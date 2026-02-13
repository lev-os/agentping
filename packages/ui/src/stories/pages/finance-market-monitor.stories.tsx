import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { CandleStickChart } from "../../components/migrations/candlestick-chart";
import { DepthChart } from "../../components/migrations/depth-chart";
import { MetricChart } from "../../components/migrations/metric-chart";
import { RadarChart } from "../../components/migrations/radar-chart";
import { SankeyDiagram } from "../../components/migrations/sankey-diagram";
import { WorldClock } from "../../components/migrations/world-clock";
import { WeatherCard } from "../../components/migrations/weather-card";
import { TickerTape } from "../../components/migrations/ticker-tape";
import { OrderBook } from "../../components/migrations/order-book";
import { TradeHistory } from "../../components/migrations/trade-history";
import { PortfolioPie } from "../../components/migrations/portfolio-pie";
import { StatsGrid } from "../../components/migrations/stats-grid";
import { StatusIndicator } from "../../components/migrations/status-indicator";
import { AlertBanner } from "../../components/migrations/alert-banner";

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

const tickerItems = [
  { symbol: "BTC", price: "67,342.18", change: 2.41 },
  { symbol: "ETH", price: "3,891.04", change: -0.87 },
  { symbol: "SOL", price: "142.67", change: 5.23 },
  { symbol: "AAPL", price: "198.12", change: 0.34 },
  { symbol: "MSFT", price: "421.88", change: 1.12 },
  { symbol: "NVDA", price: "892.33", change: 3.67 },
  { symbol: "TSLA", price: "241.09", change: -2.14 },
  { symbol: "LINK", price: "18.92", change: 1.88 },
];

const candleData = Array.from({ length: 40 }, (_, i) => {
  const base = 67000 + Math.sin(i / 5) * 500;
  const open = base + (Math.random() - 0.5) * 300;
  const close = base + (Math.random() - 0.5) * 300;
  return {
    time: `Feb ${Math.floor(i / 4) + 1} ${(i % 4) * 6}:00`,
    open,
    close,
    high: Math.max(open, close) + Math.random() * 200,
    low: Math.min(open, close) - Math.random() * 200,
    volume: Math.floor(Math.random() * 1000),
  };
});

const bids = Array.from({ length: 12 }, (_, i) => {
  const price = 67342 - i * 10;
  const amount = Math.random() * 2 + 0.1;
  return { price, amount, total: amount * (i + 1) * 0.8 };
});

const asks = Array.from({ length: 12 }, (_, i) => {
  const price = 67352 + i * 10;
  const amount = Math.random() * 2 + 0.1;
  return { price, amount, total: amount * (i + 1) * 0.8 };
});

const trades = [
  { id: "t1", price: 67342.18, amount: 0.2341, side: "buy" as const, time: "14:32:08" },
  { id: "t2", price: 67339.44, amount: 0.0812, side: "sell" as const, time: "14:32:06" },
  { id: "t3", price: 67344.91, amount: 1.4200, side: "buy" as const, time: "14:32:03" },
  { id: "t4", price: 67338.12, amount: 0.5600, side: "sell" as const, time: "14:31:58" },
  { id: "t5", price: 67341.33, amount: 0.1100, side: "buy" as const, time: "14:31:55" },
  { id: "t6", price: 67336.78, amount: 0.3400, side: "sell" as const, time: "14:31:51" },
  { id: "t7", price: 67345.22, amount: 0.8900, side: "buy" as const, time: "14:31:48" },
  { id: "t8", price: 67340.11, amount: 0.0234, side: "buy" as const, time: "14:31:44" },
  { id: "t9", price: 67335.67, amount: 2.1000, side: "sell" as const, time: "14:31:40" },
  { id: "t10", price: 67348.90, amount: 0.4500, side: "buy" as const, time: "14:31:37" },
];

const portfolio = [
  { name: "Bitcoin", symbol: "BTC", allocation: 40, value: "$134,684" },
  { name: "Ethereum", symbol: "ETH", allocation: 25, value: "$84,178" },
  { name: "Solana", symbol: "SOL", allocation: 15, value: "$50,507" },
  { name: "Chainlink", symbol: "LINK", allocation: 10, value: "$33,671" },
  { name: "Stablecoins", symbol: "USDC", allocation: 10, value: "$33,671" },
];

const radarAxes = [
  { label: "Momentum", value: 78 },
  { label: "Volume", value: 65 },
  { label: "Volatility", value: 45 },
  { label: "Sentiment", value: 82 },
  { label: "Liquidity", value: 91 },
  { label: "Correlation", value: 34 },
];

const volumeData = Array.from({ length: 24 }, (_, i) => ({
  time: `${String(i).padStart(2, "0")}:00`,
  value: Math.floor(Math.random() * 5000) + 1000,
}));

const flowNodes = [
  { id: "exchange", label: "Exchange", column: 0 },
  { id: "btc", label: "BTC", column: 1 },
  { id: "eth", label: "ETH", column: 1 },
  { id: "sol", label: "SOL", column: 1 },
  { id: "hot", label: "Hot Wallet", column: 2 },
  { id: "cold", label: "Cold Storage", column: 2 },
];
const flowLinks = [
  { source: "exchange", target: "btc", value: 40 },
  { source: "exchange", target: "eth", value: 25 },
  { source: "exchange", target: "sol", value: 15 },
  { source: "btc", target: "cold", value: 30 },
  { source: "btc", target: "hot", value: 10 },
  { source: "eth", target: "hot", value: 15 },
  { source: "eth", target: "cold", value: 10 },
  { source: "sol", target: "hot", value: 15 },
];

const timezones = [
  { zone: "America/New_York", label: "NYSE" },
  { zone: "Europe/London", label: "LSE" },
  { zone: "Asia/Tokyo", label: "TSE" },
  { zone: "Asia/Hong_Kong", label: "HKEX" },
];

const marketStats = [
  { label: "24h Volume", value: "$48.2B", change: 12.3 },
  { label: "Market Cap", value: "$1.32T", change: 2.1 },
  { label: "BTC Dominance", value: "52.4%", change: 0.3 },
  { label: "Fear & Greed", value: "72", change: 5 },
];

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------

function FinanceMarketMonitor() {
  return (
    <div className="min-h-screen bg-black/90 text-cyan-100 font-mono">
      {/* Ticker tape */}
      <TickerTape items={tickerItems} speed={25} />

      {/* Header */}
      <div className="border-b border-cyan-500/10 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-cyan-500/40 text-xs">[MKT]</span>
          <h1 className="text-lg text-cyan-400">Finance & Market Monitor</h1>
        </div>
        <div className="flex gap-4">
          <StatusIndicator status="online" label="Feed" />
          <StatusIndicator status="online" label="API" />
        </div>
      </div>

      {/* Alert */}
      <div className="px-6 pt-3">
        <AlertBanner type="success" message="BTC broke through $67,000 resistance — momentum indicators bullish across 4h and 1d timeframes" />
      </div>

      {/* Stats */}
      <div className="px-6 pt-3">
        <StatsGrid stats={marketStats} columns={4} />
      </div>

      {/* Main grid */}
      <div className="p-6 grid grid-cols-12 gap-6">
        {/* Left — Order book + Trades */}
        <div className="col-span-3 space-y-4">
          <OrderBook bids={bids} asks={asks} pair="BTC/USDT" />
          <TradeHistory trades={trades} pair="BTC/USDT" />
        </div>

        {/* Center — Charts */}
        <div className="col-span-6 space-y-4">
          <CandleStickChart data={candleData} title="BTC/USDT — 6H" width={700} height={280} />

          <div className="grid grid-cols-2 gap-4">
            <MetricChart title="24h Volume (BTC)" data={volumeData} color="#06b6d4" height={120} />
            <DepthChart bids={bids} asks={asks} title="MARKET DEPTH" />
          </div>

          <SankeyDiagram nodes={flowNodes} links={flowLinks} width={700} height={220} />
        </div>

        {/* Right — Portfolio + Radar + Clocks + Weather */}
        <div className="col-span-3 space-y-4">
          <PortfolioPie assets={portfolio} totalValue="$336,711" />

          <div className="border border-cyan-500/20 bg-black/60 rounded-lg p-4">
            <div className="text-xs text-cyan-400 uppercase tracking-wider mb-3">MARKET SIGNALS</div>
            <RadarChart axes={radarAxes} size={200} />
          </div>

          <div className="border border-cyan-500/20 bg-black/60 rounded-lg p-4">
            <div className="text-xs text-cyan-400 uppercase tracking-wider mb-3">EXCHANGE CLOCKS</div>
            <WorldClock timezones={timezones} />
          </div>

          <WeatherCard temperature={-2} condition="snowy" location="New York" unit="C" />
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Story config
// ---------------------------------------------------------------------------

const meta: Meta = {
  title: "Pages/Finance & Market Monitor",
  parameters: {
    layout: "fullscreen",
    backgrounds: { default: "dark" },
  },
};

export default meta;

type Story = StoryObj;

export const Default: Story = { render: () => <FinanceMarketMonitor /> };
