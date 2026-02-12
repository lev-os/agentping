"use client";

import * as React from "react";
import { cn } from "../../lib/utils";
import { GalleryCard } from "./gallery-card";
import { CandleStickChart } from "./candlestick-chart";
import { OrderBook } from "./order-book";
import { TickerTape } from "./ticker-tape";
import { AssetCard } from "./asset-card";
import { DepthChart } from "./depth-chart";
import { PortfolioPie } from "./portfolio-pie";
import { TradeHistory } from "./trade-history";
import { MarketHeatmap } from "./market-heatmap";

export interface GalleryFinanceSectionProps { className?: string; }

const demoBids = [
  { price: 68400, amount: 0.5, total: 0.5 },
  { price: 68350, amount: 1.2, total: 1.7 },
  { price: 68300, amount: 0.8, total: 2.5 },
];
const demoAsks = [
  { price: 68450, amount: 0.3, total: 0.3 },
  { price: 68500, amount: 0.9, total: 1.2 },
  { price: 68550, amount: 1.5, total: 2.7 },
];
const demoTickers = [
  { symbol: "BTC", price: "$68,492", change: 4.2 },
  { symbol: "ETH", price: "$3,842", change: -1.3 },
  { symbol: "SOL", price: "$142", change: 7.8 },
  { symbol: "DOGE", price: "$0.12", change: -0.4 },
];
const demoAssets = [
  { name: "Bitcoin", symbol: "BTC", allocation: 45, value: "$34k" },
  { name: "Ethereum", symbol: "ETH", allocation: 30, value: "$15k" },
  { name: "Solana", symbol: "SOL", allocation: 15, value: "$7k" },
  { name: "Other", symbol: "MISC", allocation: 10, value: "$5k" },
];
const demoTrades = [
  { id: "t1", price: 68450, amount: 0.12, side: "buy" as const, time: "14:32:01" },
  { id: "t2", price: 68440, amount: 0.05, side: "sell" as const, time: "14:32:00" },
  { id: "t3", price: 68455, amount: 0.30, side: "buy" as const, time: "14:31:58" },
];
const demoHeatCells = [
  { symbol: "BTC", change: 4.2 },
  { symbol: "ETH", change: -1.3 },
  { symbol: "SOL", change: 7.8 },
  { symbol: "ADA", change: -3.1 },
  { symbol: "DOT", change: 1.5 },
  { symbol: "AVAX", change: -6.2 },
  { symbol: "LINK", change: 2.9 },
  { symbol: "MATIC", change: -0.4 },
];

export function GalleryFinanceSection({ className }: GalleryFinanceSectionProps) {
  return (
    <div className={cn("space-y-4", className)}>
      <div className="text-xs font-mono text-cyan-400 uppercase tracking-wider">Finance Components</div>
      <div className="grid grid-cols-2 gap-3">
        <GalleryCard name="CandleStickChart">
          <CandleStickChart title="BTC/USDT" height={120} />
        </GalleryCard>
        <GalleryCard name="OrderBook">
          <OrderBook bids={demoBids} asks={demoAsks} pair="BTC/USDT" />
        </GalleryCard>
        <GalleryCard name="TickerTape" className="col-span-2">
          <TickerTape items={demoTickers} speed={20} />
        </GalleryCard>
        <GalleryCard name="AssetCard">
          <AssetCard symbol="BTC" name="Bitcoin" price="$68,492" change={4.2} />
        </GalleryCard>
        <GalleryCard name="DepthChart">
          <DepthChart bids={demoBids} asks={demoAsks} />
        </GalleryCard>
        <GalleryCard name="PortfolioPie">
          <PortfolioPie assets={demoAssets} totalValue="$61k" />
        </GalleryCard>
        <GalleryCard name="TradeHistory">
          <TradeHistory trades={demoTrades} pair="BTC/USDT" />
        </GalleryCard>
        <GalleryCard name="MarketHeatmap" className="col-span-2">
          <MarketHeatmap cells={demoHeatCells} title="CRYPTO HEATMAP" />
        </GalleryCard>
      </div>
    </div>
  );
}
