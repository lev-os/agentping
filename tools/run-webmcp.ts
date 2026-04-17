#!/usr/bin/env npx tsx
/**
 * run-webmcp.ts — Execute a .webmcp.yaml intent via AgentPing daemon
 *
 * Translates YAML actions to daemon tool calls. fill/click/focus/wait/extract
 * all go through eval; navigate uses the native chrome.tabs action.
 *
 * Usage:
 *   npx tsx tools/run-webmcp.ts <yaml> <intent> <tool> [--param k=v ...]
 *
 * Examples:
 *   npx tsx tools/run-webmcp.ts webmcp/nicnames-com.webmcp.yaml manage_dns navigate_to_dns --param domain=lev.now
 *   npx tsx tools/run-webmcp.ts webmcp/nicnames-com.webmcp.yaml manage_dns get_current_nameservers
 *   npx tsx tools/run-webmcp.ts webmcp/nicnames-com.webmcp.yaml manage_dns set_nameservers \
 *     --param ns1=aria.ns.cloudflare.com --param ns2=cruz.ns.cloudflare.com
 */

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import yaml from 'js-yaml';

const DAEMON_PORT = parseInt(process.env.AGENTPING_PORT || '7890', 10);
const DAEMON_URL = `http://localhost:${DAEMON_PORT}`;
const TOOL_TIMEOUT = parseInt(process.env.WEBMCP_TIMEOUT || '60000', 10);

// ── Types ──────────────────────────────────────────────────────────────────────

interface ActionDef {
  type: string;
  url?: string;
  selector?: string;
  value?: string;
  expression?: string;
  timeout?: number;
}

interface ToolDef {
  name: string;
  description: string;
  parameters?: Record<string, { type: string; required?: boolean; description?: string }>;
  actions: ActionDef[];
  result?: { type: string; selector?: string; extract?: string; timeout?: number };
}

interface IntentDef {
  description: string;
  page: string;
  tools: ToolDef[];
}

interface WebMcpSpec {
  name: string;
  version: string;
  match: string[];
  auth: string;
  description: string;
  intents: Record<string, IntentDef>;
}

// ── Daemon transport ───────────────────────────────────────────────────────────

async function daemonTool(action: string, params: Record<string, unknown> = {}): Promise<unknown> {
  const res = await fetch(`${DAEMON_URL}/api/v1/tool`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action, params }),
    signal: AbortSignal.timeout(TOOL_TIMEOUT),
  });
  const data = (await res.json()) as { result?: unknown; error?: string };
  if (data.error) throw new Error(`[daemon] ${data.error}`);
  return data.result;
}

async function evalInPage(expression: string): Promise<unknown> {
  return daemonTool('eval', { expression });
}

// ── Template interpolation ─────────────────────────────────────────────────────

function interpolate(template: string, params: Record<string, string>): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => {
    if (!(key in params)) throw new Error(`Missing parameter: ${key}`);
    return params[key];
  });
}

function interpolateAction(action: ActionDef, params: Record<string, string>): ActionDef {
  const out = { ...action };
  if (out.url) out.url = interpolate(out.url, params);
  if (out.selector) out.selector = interpolate(out.selector, params);
  if (out.value) out.value = interpolate(out.value, params);
  if (out.expression) out.expression = interpolate(out.expression, params);
  return out;
}

// ── Action executors ──────────────────────────────────────────────────────────

function escapeForEval(s: string): string {
  return JSON.stringify(s);
}

async function executeNavigate(action: ActionDef): Promise<unknown> {
  log(`  → navigate ${action.url}`);
  return daemonTool('navigate', { url: action.url });
}

async function executeFill(action: ActionDef): Promise<unknown> {
  const sel = action.selector!;
  const val = action.value!;
  log(`  → fill [${sel}] = "${val}"`);
  return evalInPage(`
    (function(){
      var parts=${escapeForEval(sel)}.split(',');
      var el=null;
      for(var i=0;i<parts.length;i++){try{el=document.querySelector(parts[i].trim());if(el)break;}catch(e){}}
      if(!el)return{ok:false,error:'not found: '+${escapeForEval(sel)}};
      var ns=Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype,'value');
      if(ns&&ns.set){ns.set.call(el,${escapeForEval(val)});}else{el.value=${escapeForEval(val)};}
      el.dispatchEvent(new Event('input',{bubbles:true}));
      el.dispatchEvent(new Event('change',{bubbles:true}));
      return{ok:true,value:el.value};
    })()
  `);
}

async function executeClick(action: ActionDef): Promise<unknown> {
  const sel = action.selector!;
  log(`  → click [${sel}]`);
  return evalInPage(`
    (function(){
      var sel=${escapeForEval(sel)};
      var el=null;
      var ht=sel.match(/^(.+):has-text\\(['"](.+)['"]\\)$/);
      if(ht){
        var base=ht[1].trim()||'*';
        var txt=ht[2].toLowerCase();
        var cands=document.querySelectorAll(base);
        for(var i=0;i<cands.length;i++){if(cands[i].textContent.toLowerCase().includes(txt)){el=cands[i];break;}}
      }
      if(!el){
        var parts=sel.split(',');
        for(var i=0;i<parts.length;i++){try{el=document.querySelector(parts[i].trim());if(el)break;}catch(e){}}
      }
      if(!el)return{ok:false,error:'not found: '+sel};
      el.click();
      return{ok:true,tag:el.tagName,text:el.textContent.trim().slice(0,60)};
    })()
  `);
}

async function executeFocus(action: ActionDef): Promise<unknown> {
  const sel = action.selector!;
  log(`  → focus [${sel}]`);
  return evalInPage(`
    (function(){
      var parts=${escapeForEval(sel)}.split(',');
      for(var i=0;i<parts.length;i++){try{var el=document.querySelector(parts[i].trim());if(el){el.focus();return{ok:true};}}catch(e){}}
      return{ok:false,error:'not found: '+${escapeForEval(sel)}};
    })()
  `);
}

async function executeWait(action: ActionDef, defaultTimeout = 10000): Promise<unknown> {
  const sel = action.selector!;
  const timeout = action.timeout ?? defaultTimeout;
  log(`  → wait [${sel}] (${timeout}ms)`);
  const deadline = Date.now() + timeout;
  while (Date.now() < deadline) {
    const r = await evalInPage(`
      (function(){
        var parts=${escapeForEval(sel)}.split(',');
        for(var i=0;i<parts.length;i++){try{var el=document.querySelector(parts[i].trim());if(el)return{found:true,tag:el.tagName};}catch(e){}}
        return{found:false};
      })()
    `) as { found: boolean };
    if (r?.found) return r;
    await sleep(600);
  }
  log(`  ⚠  wait timed out`);
  return { found: false, timedOut: true };
}

async function executeExtract(action: ActionDef): Promise<unknown> {
  const sel = action.selector!;
  log(`  → extract [${sel}]`);
  return evalInPage(`
    (function(){
      var parts=${escapeForEval(sel)}.split(',');
      var el=null;
      for(var i=0;i<parts.length;i++){try{el=document.querySelector(parts[i].trim());if(el)break;}catch(e){}}
      if(!el)return{ok:false,error:'not found: '+${escapeForEval(sel)}};
      return{ok:true,text:el.textContent.trim(),html:el.innerHTML.slice(0,3000)};
    })()
  `);
}

async function executeAction(action: ActionDef, params: Record<string, string>): Promise<unknown> {
  const a = interpolateAction(action, params);
  switch (a.type) {
    case 'navigate': return executeNavigate(a);
    case 'fill':     return executeFill(a);
    case 'click':    return executeClick(a);
    case 'focus':    return executeFocus(a);
    case 'wait':     return executeWait(a);
    case 'extract':  return executeExtract(a);
    case 'eval':     { log(`  → eval`); return evalInPage(a.expression!); }
    default:         throw new Error(`Unknown action type: ${a.type}`);
  }
}

// ── Runner ─────────────────────────────────────────────────────────────────────

async function runTool(
  spec: WebMcpSpec,
  intentName: string,
  toolName: string,
  params: Record<string, string>,
): Promise<void> {
  const intent = spec.intents[intentName];
  if (!intent) throw new Error(`Intent "${intentName}" not found. Available: ${Object.keys(spec.intents).join(', ')}`);

  const tool = intent.tools.find((t) => t.name === toolName);
  if (!tool) throw new Error(`Tool "${toolName}" not found in "${intentName}". Available: ${intent.tools.map((t) => t.name).join(', ')}`);

  for (const [key, def] of Object.entries(tool.parameters ?? {})) {
    if (def.required && !(key in params)) throw new Error(`Missing required param: ${key}`);
  }

  log(`\n[webmcp] ${spec.name} / ${intentName} / ${toolName}`);
  log(`[webmcp] ${tool.description}`);
  if (Object.keys(params).length > 0) log(`[webmcp] params: ${JSON.stringify(params)}`);
  log('[webmcp] executing actions...');

  const results: unknown[] = [];
  for (const action of tool.actions) {
    try {
      const r = await executeAction(action, params);
      results.push(r);
      const ro = r as Record<string, unknown> | null;
      if (ro && 'ok' in ro && !ro.ok) log(`  ⚠  ${ro.error ?? JSON.stringify(ro)}`);
    } catch (err) {
      log(`  ✗  ${err instanceof Error ? err.message : String(err)}`);
      results.push({ error: String(err) });
    }
  }

  if (tool.result?.type === 'wait' && tool.result.selector) {
    log('[webmcp] waiting for result...');
    await executeWait({ type: 'wait', selector: tool.result.selector }, tool.result.timeout);
  }
  if (tool.result?.type === 'text' && tool.result.selector) {
    log('[webmcp] extracting result...');
    const extracted = await executeExtract({ type: 'extract', selector: tool.result.selector });
    log(JSON.stringify(extracted, null, 2));
  }

  console.log(JSON.stringify({ intent: intentName, tool: toolName, params, results }, null, 2));
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function log(msg: string) { process.stderr.write(msg + '\n'); }
function sleep(ms: number) { return new Promise<void>((r) => setTimeout(r, ms)); }

function parseCliParams(args: string[]): Record<string, string> {
  const out: Record<string, string> = {};
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--param' && args[i + 1]) {
      const [k, ...vs] = args[i + 1].split('=');
      out[k] = vs.join('=');
      i++;
    }
  }
  return out;
}

// ── CLI ───────────────────────────────────────────────────────────────────────

async function main() {
  const args = process.argv.slice(2);
  if (args.length < 3) {
    process.stderr.write(`Usage: run-webmcp.ts <yaml> <intent> <tool> [--param k=v ...]\n`);
    process.exit(1);
  }

  const [yamlPath, intentName, toolName, ...rest] = args;
  const params = parseCliParams(rest);

  try {
    const h = await fetch(`${DAEMON_URL}/health`, { signal: AbortSignal.timeout(5000) });
    if (!h.ok) throw new Error('unhealthy');
  } catch {
    console.error(`[webmcp] Daemon not reachable at ${DAEMON_URL}`);
    process.exit(1);
  }
  log(`[webmcp] Daemon OK ✓`);
  log('[webmcp] NOTE: Approve the browser lease when your extension prompts you');

  const rawYaml = readFileSync(resolve(process.cwd(), yamlPath), 'utf-8');
  const spec = yaml.load(rawYaml) as WebMcpSpec;
  log(`[webmcp] Loaded: ${spec.name} v${spec.version}`);

  await runTool(spec, intentName, toolName, params);
}

main().catch((e) => { console.error(`Fatal: ${e instanceof Error ? e.message : e}`); process.exit(1); });
