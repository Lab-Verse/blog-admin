'use client';

import React, { useState } from 'react';
import { useGetCostSummaryQuery } from '@/redux/api/agent-logs/agentLogsApi';
import { DollarSign, TrendingUp, Cpu, Image, Loader2 } from 'lucide-react';

function formatUSD(val: string | number): string {
  const n = typeof val === 'string' ? parseFloat(val) : val;
  if (isNaN(n)) return '$0.00';
  return `$${n.toFixed(4)}`;
}

function formatNumber(val: string | number): string {
  const n = typeof val === 'string' ? parseInt(val, 10) : val;
  if (isNaN(n)) return '0';
  return n.toLocaleString();
}

export default function CostDashboard() {
  const [days, setDays] = useState(7);
  const { data, isLoading } = useGetCostSummaryQuery(days);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  const totals = data?.totals;
  const daily = data?.daily || [];

  return (
    <div className="space-y-6">
      {/* Period Selector */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-green-600" />
          <h2 className="text-lg font-semibold text-gray-900">Cost Analytics</h2>
        </div>
        <div className="flex gap-1 rounded-lg border bg-gray-50 p-0.5">
          {[7, 14, 30].map((d) => (
            <button
              key={d}
              onClick={() => setDays(d)}
              className={`rounded-md px-3 py-1 text-sm font-medium transition-colors ${
                days === d ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {d}d
            </button>
          ))}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="rounded-xl border bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <DollarSign className="h-4 w-4 text-green-500" />
            Total Cost
          </div>
          <p className="mt-1 text-2xl font-bold text-gray-900">{formatUSD(totals?.total_cost_usd || '0')}</p>
          <p className="text-xs text-gray-400">{formatNumber(totals?.total_runs || '0')} runs</p>
        </div>
        <div className="rounded-xl border bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Cpu className="h-4 w-4 text-blue-500" />
            Total Tokens
          </div>
          <p className="mt-1 text-2xl font-bold text-gray-900">{formatNumber(totals?.total_tokens || '0')}</p>
          <p className="text-xs text-gray-400">{formatNumber(totals?.total_api_calls || '0')} API calls</p>
        </div>
        <div className="rounded-xl border bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <TrendingUp className="h-4 w-4 text-purple-500" />
            Input Tokens
          </div>
          <p className="mt-1 text-2xl font-bold text-gray-900">{formatNumber(totals?.total_prompt_tokens || '0')}</p>
          <p className="text-xs text-gray-400">prompt tokens</p>
        </div>
        <div className="rounded-xl border bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Image className="h-4 w-4 text-orange-500" />
            Images
          </div>
          <p className="mt-1 text-2xl font-bold text-gray-900">{formatNumber(totals?.total_image_generations || '0')}</p>
          <p className="text-xs text-gray-400">generated</p>
        </div>
      </div>

      {/* Daily Breakdown */}
      {daily.length > 0 && (
        <div className="rounded-xl border bg-white shadow-sm">
          <div className="border-b px-4 py-3">
            <h3 className="font-medium text-gray-900">Daily Breakdown</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-gray-50 text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-4 py-2">Date</th>
                  <th className="px-4 py-2">Runs</th>
                  <th className="px-4 py-2">Tokens</th>
                  <th className="px-4 py-2">Cost</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {daily.map((row) => (
                  <tr key={row.date} className="hover:bg-gray-50">
                    <td className="px-4 py-2 font-medium text-gray-700">{row.date}</td>
                    <td className="px-4 py-2 text-gray-600">{formatNumber(row.runs)}</td>
                    <td className="px-4 py-2 text-gray-600">{formatNumber(row.tokens)}</td>
                    <td className="px-4 py-2 font-medium text-green-700">{formatUSD(row.cost_usd)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
