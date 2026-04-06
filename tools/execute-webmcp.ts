#!/usr/bin/env npx tsx
/**
 * execute-webmcp.ts — WebMCP shim executor
 *
 * Executes tool actions via AgentPing daemon → extension → Chrome APIs.
 * NO CDP. NO debugger. NO WebSocket to the browser.
 *
 * Transport: HTTP POST to daemon /api/v1/tool
 * Execution: Extension uses chrome.tabs, chrome.scripting, chrome.cookies
 *
 * Usage:
 *   npx tsx tools/execute-webmcp.ts navigate https://example.com
 *   npx tsx tools/execute-webmcp.ts extract-markdown
 *   npx tsx tools/execute-webmcp.ts extract-video
 *   npx tsx tools/execute-webmcp.ts eval "document.title"
 *   npx tsx tools/execute-webmcp.ts full <post-url> [output-dir]
 */

import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { execSync } from 'child_process';

const DAEMON_PORT = parseInt(process.env.AGENTPING_PORT || '7890', 10);
const DAEMON_URL = `http://localhost:${DAEMON_PORT}`;

// ============================================================================
// Transport — HTTP to daemon, zero CDP
// ============================================================================

async function tool(action: string, params: Record<string, unknown> = {}): Promise<any> {
  const res = await fetch(`${DAEMON_URL}/api/v1/tool`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action, params }),
  });
  const data = await res.json() as any;
  if (data.error) throw new Error(data.error);
  return data.result;
}

async function evalJS(expression: string): Promise<any> {
  return await tool('eval', { expression });
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

// ============================================================================
// Actions — the primitives that WebMCP tool execute() callbacks would use
// ============================================================================

const actions = {
  /** Navigate to a URL — uses chrome.tabs.update, waits for load */
  async navigate(url: string): Promise<string> {
    const result = await tool('navigate', { url }) as any;
    return result?.url || url;
  },

  /** Extract the article body as markdown */
  async extractMarkdown(): Promise<{ title: string; author: string; date: string; markdown: string }> {
    const data = await evalJS(`
      (function() {
        var title = '';
        var titleEl = document.querySelector('h1.post-title, article h1, h1');
        if (titleEl) title = titleEl.textContent.trim();

        var author = '';
        var authorEl = document.querySelector('.author-name, [data-testid="author-name"], .pencraft a[href*="/@"]');
        if (authorEl) author = authorEl.textContent.trim();

        var date = '';
        var dateEl = document.querySelector('time, .post-date, [datetime]');
        if (dateEl) date = dateEl.getAttribute('datetime') || dateEl.textContent.trim();

        // Get the article body
        var body = document.querySelector('.body.markup, article .body, .post-content, article');
        if (!body) body = document.querySelector('article') || document.querySelector('main');
        if (!body) return JSON.stringify({ error: 'No article body found' });

        // Convert to markdown-ish text
        function toMarkdown(el) {
          var md = '';
          var children = el.childNodes;
          for (var i = 0; i < children.length; i++) {
            var node = children[i];
            if (node.nodeType === 3) {
              md += node.textContent;
            } else if (node.nodeType === 1) {
              var tag = node.tagName.toLowerCase();
              if (tag === 'h1') md += '\\n# ' + node.textContent.trim() + '\\n\\n';
              else if (tag === 'h2') md += '\\n## ' + node.textContent.trim() + '\\n\\n';
              else if (tag === 'h3') md += '\\n### ' + node.textContent.trim() + '\\n\\n';
              else if (tag === 'h4') md += '\\n#### ' + node.textContent.trim() + '\\n\\n';
              else if (tag === 'p') md += node.textContent.trim() + '\\n\\n';
              else if (tag === 'blockquote') md += '> ' + node.textContent.trim() + '\\n\\n';
              else if (tag === 'ul' || tag === 'ol') {
                var items = node.querySelectorAll('li');
                for (var j = 0; j < items.length; j++) {
                  md += (tag === 'ol' ? (j+1) + '. ' : '- ') + items[j].textContent.trim() + '\\n';
                }
                md += '\\n';
              }
              else if (tag === 'pre' || tag === 'code') md += '\\n\`\`\`\\n' + node.textContent + '\\n\`\`\`\\n\\n';
              else if (tag === 'img') {
                var src = node.getAttribute('src') || '';
                var alt = node.getAttribute('alt') || '';
                if (src) md += '![' + alt + '](' + src + ')\\n\\n';
              }
              else if (tag === 'a') {
                var href = node.getAttribute('href') || '';
                md += '[' + node.textContent.trim() + '](' + href + ')';
              }
              else if (tag === 'strong' || tag === 'b') md += '**' + node.textContent.trim() + '**';
              else if (tag === 'em' || tag === 'i') md += '*' + node.textContent.trim() + '*';
              else if (tag === 'br') md += '\\n';
              else if (tag === 'hr') md += '\\n---\\n\\n';
              else if (tag === 'figure') {
                var img = node.querySelector('img');
                var cap = node.querySelector('figcaption');
                if (img) md += '![' + (cap ? cap.textContent.trim() : '') + '](' + (img.getAttribute('src') || '') + ')\\n\\n';
                else md += toMarkdown(node);
              }
              else if (tag === 'div' || tag === 'section' || tag === 'span') md += toMarkdown(node);
              else md += node.textContent;
            }
          }
          return md;
        }

        return JSON.stringify({
          title: title,
          author: author,
          date: date,
          markdown: toMarkdown(body),
        });
      })()
    `);

    return JSON.parse(data);
  },

  /** Find video elements and extract their source URLs */
  async extractVideos(): Promise<Array<{ src: string; type: string; poster?: string; duration?: string }>> {
    const data = await evalJS(`
      (function() {
        var videos = [];

        // Native <video> elements
        var videoEls = document.querySelectorAll('video');
        for (var i = 0; i < videoEls.length; i++) {
          var v = videoEls[i];
          var src = v.src || '';
          // Check <source> children
          if (!src) {
            var sourceEl = v.querySelector('source');
            if (sourceEl) src = sourceEl.src || sourceEl.getAttribute('src') || '';
          }
          // Check data attributes
          if (!src) src = v.getAttribute('data-src') || v.getAttribute('data-url') || '';
          if (src) {
            videos.push({
              src: src,
              type: v.querySelector('source')?.getAttribute('type') || 'video/mp4',
              poster: v.getAttribute('poster') || '',
              duration: v.duration ? String(Math.round(v.duration)) + 's' : '',
            });
          }
        }

        // Iframes (YouTube, Vimeo, etc.)
        var iframes = document.querySelectorAll('iframe');
        for (var i = 0; i < iframes.length; i++) {
          var src = iframes[i].src || '';
          if (/youtube|vimeo|wistia|loom|cloudflare.*stream/.test(src)) {
            videos.push({ src: src, type: 'iframe-embed', poster: '', duration: '' });
          }
        }

        // Substack-specific video containers
        var substackVideos = document.querySelectorAll('[class*="video"], [data-component-name="VideoEmbed"], .video-container, .captioned-video');
        for (var i = 0; i < substackVideos.length; i++) {
          var el = substackVideos[i];
          var vid = el.querySelector('video');
          if (vid && vid.src && !videos.find(function(v) { return v.src === vid.src; })) {
            videos.push({
              src: vid.src,
              type: 'substack-video',
              poster: vid.getAttribute('poster') || '',
              duration: '',
            });
          }
          // Check for Cloudflare Stream
          var stream = el.querySelector('iframe[src*="cloudflarestream"], iframe[src*="customer-"]');
          if (stream) {
            videos.push({
              src: stream.src,
              type: 'cloudflare-stream',
              poster: '',
              duration: '',
            });
          }
        }

        return JSON.stringify(videos);
      })()
    `);

    return JSON.parse(data);
  },

  /** Evaluate arbitrary JS in the page */
  async eval(expression: string): Promise<any> {
    return await evalJS(expression);
  },
};

// ============================================================================
// CLI
// ============================================================================

async function main() {
  const args = process.argv.slice(2);
  const action = args[0];

  if (!action) {
    console.error(`Usage:
  execute-webmcp.ts navigate <url>         Navigate to URL
  execute-webmcp.ts extract-markdown       Extract article as markdown
  execute-webmcp.ts extract-video          Find video URLs on page
  execute-webmcp.ts eval "<expression>"    Evaluate JS in page
  execute-webmcp.ts full <post-url> [dir]  Full extraction: markdown + video`);
    process.exit(1);
  }

  // Verify daemon is reachable
  try {
    const health = await fetch(`${DAEMON_URL}/health`);
    if (!health.ok) throw new Error('Daemon not healthy');
  } catch {
    console.error(`[webmcp] Cannot reach daemon at ${DAEMON_URL}. Is it running?`);
    process.exit(1);
  }
  console.error(`[webmcp] Connected to daemon at ${DAEMON_URL} (no CDP)`);

  try {
    switch (action) {
      case 'navigate': {
        const url = args[1];
        if (!url) { console.error('Missing URL'); process.exit(1); }
        const finalUrl = await actions.navigate(url);
        console.log(JSON.stringify({ action: 'navigate', url: finalUrl }));
        break;
      }

      case 'extract-markdown': {
        const result = await actions.extractMarkdown();
        // Output to stdout as JSON (agent reads this)
        console.log(JSON.stringify(result));
        break;
      }

      case 'extract-video': {
        const videos = await actions.extractVideos();
        console.log(JSON.stringify({ videos }));
        break;
      }

      case 'eval': {
        const expr = args[1];
        if (!expr) { console.error('Missing expression'); process.exit(1); }
        const result = await actions.eval(expr);
        console.log(JSON.stringify({ result }));
        break;
      }

      case 'full': {
        const postUrl = args[1];
        const outputDir = args[2] || 'output';
        if (!postUrl) { console.error('Missing post URL'); process.exit(1); }

        // Step 1: Navigate
        console.error(`[webmcp] Tool call: navigate(${postUrl})`);
        const finalUrl = await actions.navigate(postUrl);
        console.error(`[webmcp]   → ${finalUrl}`);

        // Step 2: Extract markdown
        console.error('[webmcp] Tool call: extract_article_markdown()');
        const article = await actions.extractMarkdown();
        console.error(`[webmcp]   → "${article.title}" by ${article.author} (${article.date})`);

        // Step 3: Extract videos
        console.error('[webmcp] Tool call: extract_videos()');
        const videos = await actions.extractVideos();
        console.error(`[webmcp]   → ${videos.length} video(s) found`);

        // Step 4: Save markdown
        if (!existsSync(outputDir)) mkdirSync(outputDir, { recursive: true });
        const slug = postUrl.split('/p/')[1]?.split('?')[0] || 'article';
        const mdPath = `${outputDir}/${slug}.md`;

        const frontmatter = `---
title: "${article.title}"
author: "${article.author}"
date: "${article.date}"
source: "${finalUrl}"
extracted: "${new Date().toISOString()}"
videos: ${videos.length}
---

`;
        writeFileSync(mdPath, frontmatter + article.markdown);
        console.error(`[webmcp]   → Saved ${mdPath}`);

        // Step 5: Get cookies via chrome.cookies (includes httpOnly)
        console.error('[webmcp] Tool call: cookies()');
        const cookies = await tool('cookies', { url: finalUrl }) as any[];
        const cookieStr = (cookies || []).map((c: any) => `${c.name}=${c.value}`).join('; ');
        console.error(`[webmcp]   → ${cookies?.length || 0} cookies (including httpOnly)`);

        // Step 6: Download videos with auth cookies
        for (let i = 0; i < videos.length; i++) {
          const video = videos[i];
          console.error(`[webmcp] Tool call: download_video(${video.src.slice(0, 80)}...)`);

          if (video.type === 'iframe-embed' || video.type === 'cloudflare-stream') {
            console.error(`[webmcp]   → Embed URL (not directly downloadable): ${video.src}`);
            writeFileSync(`${outputDir}/${slug}-video-${i}.url`, video.src);
            continue;
          }

          try {
            const videoPath = `${outputDir}/${slug}-video-${i}.mp4`;
            // Pass auth cookies for gated content
            const isHLS = video.type === 'application/x-mpegURL' || video.src.includes('type=hls');
            if (isHLS) {
              // HLS stream — use ffmpeg with cookies
              execSync(
                `ffmpeg -headers "Cookie: ${cookieStr.replace(/"/g, '\\"')}" -i "${video.src}" -c copy -bsf:a aac_adtstoasc "${videoPath}" -y`,
                { timeout: 600000, stdio: ['pipe', 'pipe', 'pipe'] },
              );
            } else {
              execSync(`curl -sL -b "${cookieStr}" -o "${videoPath}" "${video.src}"`, { timeout: 120000 });
            }
            const stat = execSync(`ls -lh "${videoPath}"`, { encoding: 'utf-8' }).trim();
            console.error(`[webmcp]   → Downloaded: ${stat}`);
          } catch (err) {
            console.error(`[webmcp]   → Download failed: ${err instanceof Error ? err.message : err}`);
          }
        }

        // Output final summary as JSON to stdout
        console.log(JSON.stringify({
          url: finalUrl,
          title: article.title,
          author: article.author,
          date: article.date,
          markdownPath: mdPath,
          markdownLength: article.markdown.length,
          videos: videos.map((v, i) => ({
            src: v.src,
            type: v.type,
            localPath: v.type === 'iframe-embed' || v.type === 'cloudflare-stream'
              ? `${outputDir}/${slug}-video-${i}.url`
              : `${outputDir}/${slug}-video-${i}.mp4`,
          })),
        }));
        break;
      }

      default:
        console.error(`Unknown action: ${action}`);
        process.exit(1);
    }
  } finally {
    // HTTP transport — nothing to close
  }
}

main().catch((e) => {
  console.error(`Fatal: ${e.message}`);
  process.exit(1);
});
