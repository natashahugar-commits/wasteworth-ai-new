import React, { useMemo, useState } from 'react';
import { ArrowRight, Plus, FileSpreadsheet, ShieldAlert } from 'lucide-react';
import { MATERIAL_CATEGORIES } from '../data/materials';
import { useWasteStore } from '../store/wasteStore';
import { MaterialIcon, formatDateTime } from './MaterialIcon';

type OriginFilter = 'all' | 'user' | 'demo';

export function DashboardView() {
  const {
    batches,
    setActiveSection,
    openPassport,
    openCreateListingForMaterial,
  } = useWasteStore();

  const [originFilter, setOriginFilter] = useState<OriginFilter>('all');

  const filteredBatches = useMemo(() => {
    if (originFilter === 'user') return batches.filter((b) => !b.isDemo);
    if (originFilter === 'demo') return batches.filter((b) => b.isDemo);
    return batches;
  }, [batches, originFilter]);

  const metrics = useMemo(() => {
    const totalKg = filteredBatches.reduce((sum, b) => sum + b.quantityKg, 0);
    const awaitingMatch = filteredBatches.filter(
      (b) => b.status === 'Created' || b.status === 'Listed'
    );
    const matched = filteredBatches.filter((b) => b.status === 'Matched');
    const collected = filteredBatches.filter(
      (b) => b.status === 'Collection recorded' || b.status === 'Destination recorded'
    );
    const destinationRecorded = filteredBatches.filter(
      (b) => b.status === 'Destination recorded'
    );

    const userKg = filteredBatches
      .filter((b) => !b.isDemo)
      .reduce((sum, b) => sum + b.quantityKg, 0);
    const demoKg = filteredBatches
      .filter((b) => b.isDemo)
      .reduce((sum, b) => sum + b.quantityKg, 0);

    return {
      totalKg,
      userKg,
      demoKg,
      awaitingMatchCount: awaitingMatch.length,
      matchedCount: matched.length,
      collectedCount: collected.length,
      destinationCount: destinationRecorded.length,
      awaitingMatch,
      matched,
      onlyCollected: filteredBatches.filter((b) => b.status === 'Collection recorded'),
    };
  }, [filteredBatches]);

  const materialBreakdown = useMemo(() => {
    const maxKg = Math.max(
      1,
      ...MATERIAL_CATEGORIES.map((cat) =>
        filteredBatches
          .filter((b) => b.material === cat)
          .reduce((sum, b) => sum + b.quantityKg, 0)
      )
    );

    return MATERIAL_CATEGORIES.map((cat) => {
      const catBatches = filteredBatches.filter((b) => b.material === cat);
      const kg = catBatches.reduce((sum, b) => sum + b.quantityKg, 0);
      const share = metrics.totalKg > 0 ? Math.round((kg / metrics.totalKg) * 100) : 0;
      const barPct = Math.round((kg / maxKg) * 100);
      return {
        category: cat,
        count: catBatches.length,
        kg,
        share,
        barPct,
      };
    });
  }, [filteredBatches, metrics.totalKg]);

  const recentActivity = useMemo(() => {
    const events = filteredBatches.flatMap((batch) =>
      batch.history.map((evt) => ({
        ...evt,
        batchId: batch.id,
        material: batch.material,
        isDemo: batch.isDemo,
      }))
    );
    return events
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 8);
  }, [filteredBatches]);

  const nextActions = useMemo(() => {
    const items: {
      title: string;
      description: string;
      cta: string;
      onClick: () => void;
    }[] = [];

    if (metrics.awaitingMatch.length > 0) {
      const target = metrics.awaitingMatch[0];
      items.push({
        title: `Match ${target.id} (${target.material})`,
        description: `${target.quantityKg} kg at ${target.location} is listed and awaiting a partner selection.`,
        cta: 'Find Match in Marketplace',
        onClick: () => setActiveSection('marketplace'),
      });
    }

    if (metrics.matched.length > 0) {
      const target = metrics.matched[0];
      items.push({
        title: `Record collection for ${target.id}`,
        description: `Matched with ${target.match?.partnerName ?? 'partner'}. Log collector pickup when handoff occurs.`,
        cta: 'Open Passport',
        onClick: () => openPassport(target.id),
      });
    }

    if (metrics.onlyCollected.length > 0) {
      const target = metrics.onlyCollected[0];
      items.push({
        title: `Record destination for ${target.id}`,
        description: `Collection logged (${target.quantityKg} kg ${target.material}). Add facility intake details to complete traceability.`,
        cta: 'Update Destination',
        onClick: () => openPassport(target.id),
      });
    }

    if (items.length === 0) {
      items.push({
        title: 'Create a new material batch',
        description: 'Log a fresh campus or office material stream to generate a unique WW-XXXX passport.',
        cta: 'New Listing',
        onClick: () => openCreateListingForMaterial('Cardboard'),
      });
    }

    return items.slice(0, 3);
  }, [metrics, setActiveSection, openPassport, openCreateListingForMaterial]);

  return (
    <main className="max-w-[1280px] mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-8">
      {/* Header & Origin Filter */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#E2DDD3] dark:border-[#24352E] pb-6">
        <div className="space-y-1.5">
          <p className="text-xs font-medium text-[#0F8A5F] dark:text-[#22B57E]">
            Intelligent Coordination Dashboard
          </p>
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[#133C2C] dark:text-[#F2F5F3]">
            Batch Activity & Traceability Overview
          </h1>
          <p className="text-sm text-[#546059] dark:text-[#A4B5AC]">
            All figures below are calculated live from saved application records. Demo records are
            labelled separately from your own created entries.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <div
            role="group"
            aria-label="Filter dashboard records by source"
            className="inline-flex items-center p-1 rounded-lg bg-[#F2EFE9] dark:bg-[#17251F] border border-[#E2DDD3] dark:border-[#24352E]"
          >
            {(
              [
                ['all', 'All Records'],
                ['user', 'User Records'],
                ['demo', 'Demo Data'],
              ] as const
            ).map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => setOriginFilter(key)}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                  originFilter === key
                    ? 'bg-white dark:bg-[#111C17] text-[#133C2C] dark:text-[#22B57E] shadow-xs'
                    : 'text-[#546059] dark:text-[#A4B5AC] hover:text-[#1B201D] dark:hover:text-[#F2F5F3]'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => openCreateListingForMaterial('Cardboard')}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold bg-[#133C2C] text-white hover:bg-[#0F8A5F] dark:bg-[#22B57E] dark:text-[#0B1310] transition-colors cursor-pointer whitespace-nowrap"
          >
            <Plus className="w-4 h-4" aria-hidden="true" />
            <span>New Listing</span>
          </button>
        </div>
      </div>

      {/* 5 Live KPI Cards */}
      <section aria-label="Key metrics" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="rounded-xl border border-[#E2DDD3] dark:border-[#24352E] bg-white dark:bg-[#111C17] p-5 space-y-2">
          <div className="text-xs font-medium text-[#546059] dark:text-[#A4B5AC]">
            Total Material Recorded
          </div>
          <div className="font-display text-3xl font-bold text-[#133C2C] dark:text-[#F2F5F3] tabular-nums">
            {metrics.totalKg} <span className="text-base font-medium">kg</span>
          </div>
          <div className="text-xs text-[#546059] dark:text-[#A4B5AC] tabular-nums">
            {metrics.userKg} kg User · {metrics.demoKg} kg Demo
          </div>
        </div>

        <div className="rounded-xl border border-[#E2DDD3] dark:border-[#24352E] bg-white dark:bg-[#111C17] p-5 space-y-2">
          <div className="text-xs font-medium text-[#546059] dark:text-[#A4B5AC]">
            Awaiting Match
          </div>
          <div className="font-display text-3xl font-bold text-[#1B201D] dark:text-[#F2F5F3] tabular-nums">
            {metrics.awaitingMatchCount}
          </div>
          <div className="text-xs text-[#546059] dark:text-[#A4B5AC]">
            Listed in Marketplace
          </div>
        </div>

        <div className="rounded-xl border border-[#E2DDD3] dark:border-[#24352E] bg-white dark:bg-[#111C17] p-5 space-y-2">
          <div className="text-xs font-medium text-[#546059] dark:text-[#A4B5AC]">
            Matched Listings
          </div>
          <div className="font-display text-3xl font-bold text-[#1B201D] dark:text-[#F2F5F3] tabular-nums">
            {metrics.matchedCount}
          </div>
          <div className="text-xs text-[#546059] dark:text-[#A4B5AC]">
            Partner selected, pickup pending
          </div>
        </div>

        <div className="rounded-xl border border-[#E2DDD3] dark:border-[#24352E] bg-white dark:bg-[#111C17] p-5 space-y-2">
          <div className="text-xs font-medium text-[#546059] dark:text-[#A4B5AC]">
            Collections Recorded
          </div>
          <div className="font-display text-3xl font-bold text-[#0F8A5F] dark:text-[#22B57E] tabular-nums">
            {metrics.collectedCount}
          </div>
          <div className="text-xs text-[#546059] dark:text-[#A4B5AC]">
            Pickup handoff logged
          </div>
        </div>

        <div className="rounded-xl border border-[#E2DDD3] dark:border-[#24352E] bg-white dark:bg-[#111C17] p-5 space-y-2">
          <div className="text-xs font-medium text-[#546059] dark:text-[#A4B5AC]">
            Destination Recorded
          </div>
          <div className="font-display text-3xl font-bold text-[#0F8A5F] dark:text-[#22B57E] tabular-nums">
            {metrics.destinationCount}
          </div>
          <div className="text-xs text-[#546059] dark:text-[#A4B5AC]">
            Intake facility logged
          </div>
        </div>
      </section>

      {/* Empty state when filtering User Records before any user record exists */}
      {filteredBatches.length === 0 ? (
        <div className="rounded-xl border border-[#E2DDD3] dark:border-[#24352E] bg-white dark:bg-[#111C17] p-10 text-center space-y-3">
          <h2 className="font-display text-lg font-semibold text-[#1B201D] dark:text-[#F2F5F3]">
            No user-created batches recorded yet
          </h2>
          <p className="text-sm text-[#546059] dark:text-[#A4B5AC] max-w-md mx-auto">
            You are viewing User Records Only. Create a new material listing in the Marketplace or
            switch to All Records to inspect the baseline Demo Data.
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <button
              type="button"
              onClick={() => openCreateListingForMaterial('Cardboard')}
              className="px-4 py-2 rounded-lg text-sm font-semibold bg-[#133C2C] text-white hover:bg-[#0F8A5F] dark:bg-[#22B57E] dark:text-[#0B1310] cursor-pointer"
            >
              Create First Listing
            </button>
            <button
              type="button"
              onClick={() => setOriginFilter('all')}
              className="px-4 py-2 rounded-lg text-sm font-medium border border-[#E2DDD3] dark:border-[#24352E] text-[#1B201D] dark:text-[#F2F5F3] cursor-pointer"
            >
              Show All Records
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Material-Category Breakdown */}
          <section className="lg:col-span-7 rounded-xl border border-[#E2DDD3] dark:border-[#24352E] bg-white dark:bg-[#111C17] p-6 space-y-5">
            <div className="flex items-center justify-between gap-2 border-b border-[#E2DDD3] dark:border-[#24352E] pb-3.5">
              <div>
                <h2 className="font-display text-lg font-semibold text-[#133C2C] dark:text-[#F2F5F3]">
                  Material-Category Breakdown
                </h2>
                <p className="text-xs text-[#546059] dark:text-[#A4B5AC]">
                  Recorded weight (kg) and share across active filtered batches
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveSection('reports')}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0F8A5F] dark:text-[#22B57E] hover:underline cursor-pointer whitespace-nowrap"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Full Report & CSV</span>
              </button>
            </div>

            <div className="space-y-4">
              {materialBreakdown.map((row) => (
                <div key={row.category} className="space-y-1.5">
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <div className="flex items-center gap-2 min-w-0">
                      <MaterialIcon
                        material={row.category}
                        className="w-4 h-4 text-[#0F8A5F] dark:text-[#22B57E] shrink-0"
                      />
                      <span className="font-medium text-[#1B201D] dark:text-[#F2F5F3] truncate">
                        {row.category}
                      </span>
                      <span className="text-xs text-[#546059] dark:text-[#A4B5AC] tabular-nums">
                        ({row.count} {row.count === 1 ? 'batch' : 'batches'})
                      </span>
                    </div>
                    <div className="font-mono text-xs sm:text-sm font-medium text-[#1B201D] dark:text-[#F2F5F3] tabular-nums shrink-0">
                      {row.kg} kg · {row.share}%
                    </div>
                  </div>
                  <div className="h-2 w-full rounded-full bg-[#F2EFE9] dark:bg-[#17251F] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[#0F8A5F] dark:bg-[#22B57E] transition-all duration-300"
                      style={{ width: `${row.barPct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-[#E2DDD3] dark:border-[#24352E] flex items-start gap-2 text-xs text-[#546059] dark:text-[#A4B5AC]">
              <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5 text-[#0F8A5F] dark:text-[#22B57E]" aria-hidden="true" />
              <span>
                WasteWorth AI intentionally avoids fabricated revenue, carbon-offset, or landfill
                diversion estimates. Metrics reflect only saved batch quantities and logged
                checkpoints.
              </span>
            </div>
          </section>

          {/* Next-Action Panel */}
          <section className="lg:col-span-5 rounded-xl border border-[#E2DDD3] dark:border-[#24352E] bg-white dark:bg-[#111C17] p-6 space-y-5">
            <div className="border-b border-[#E2DDD3] dark:border-[#24352E] pb-3.5">
              <h2 className="font-display text-lg font-semibold text-[#133C2C] dark:text-[#F2F5F3]">
                Recommended Next Actions
              </h2>
              <p className="text-xs text-[#546059] dark:text-[#A4B5AC]">
                Prioritized from current batch states
              </p>
            </div>

            <div className="divide-y divide-[#E2DDD3] dark:divide-[#24352E]">
              {nextActions.map((action) => (
                <div key={action.title} className="py-4 first:pt-0 last:pb-0 space-y-2">
                  <div className="text-sm font-semibold text-[#1B201D] dark:text-[#F2F5F3]">
                    {action.title}
                  </div>
                  <p className="text-xs text-[#546059] dark:text-[#A4B5AC] leading-relaxed">
                    {action.description}
                  </p>
                  <button
                    type="button"
                    onClick={action.onClick}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0F8A5F] dark:text-[#22B57E] hover:underline cursor-pointer"
                  >
                    <span>{action.cta}</span>
                    <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </button>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {/* Recent Activity Log */}
      {filteredBatches.length > 0 && (
        <section className="rounded-xl border border-[#E2DDD3] dark:border-[#24352E] bg-white dark:bg-[#111C17] p-6 space-y-4">
          <div className="flex items-center justify-between gap-4 border-b border-[#E2DDD3] dark:border-[#24352E] pb-3.5">
            <div>
              <h2 className="font-display text-lg font-semibold text-[#133C2C] dark:text-[#F2F5F3]">
                Recent Passport Activity
              </h2>
              <p className="text-xs text-[#546059] dark:text-[#A4B5AC]">
                Latest state changes across batches
              </p>
            </div>
            <button
              type="button"
              onClick={() => openPassport(filteredBatches[0].id)}
              className="text-xs font-semibold text-[#0F8A5F] dark:text-[#22B57E] hover:underline cursor-pointer whitespace-nowrap"
            >
              Open Passports
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-[#E2DDD3] dark:border-[#24352E] text-xs text-[#546059] dark:text-[#A4B5AC]">
                  <th className="py-2.5 pr-4 font-medium">Batch ID</th>
                  <th className="py-2.5 pr-4 font-medium">Stage</th>
                  <th className="py-2.5 pr-4 font-medium">Activity Note</th>
                  <th className="py-2.5 pr-4 font-medium">Origin</th>
                  <th className="py-2.5 text-right font-medium">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2DDD3] dark:divide-[#24352E]">
                {recentActivity.map((evt) => (
                  <tr
                    key={evt.id}
                    className="hover:bg-[#FAF8F4] dark:hover:bg-[#17251F]/60 transition-colors"
                  >
                    <td className="py-3 pr-4 font-mono text-xs font-semibold whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => openPassport(evt.batchId)}
                        className="text-[#0F8A5F] dark:text-[#22B57E] hover:underline cursor-pointer"
                      >
                        {evt.batchId}
                      </button>
                    </td>
                    <td className="py-3 pr-4 text-xs font-medium text-[#1B201D] dark:text-[#F2F5F3] whitespace-nowrap">
                      {evt.stage}
                    </td>
                    <td className="py-3 pr-4 text-xs text-[#546059] dark:text-[#A4B5AC] max-w-md">
                      {evt.note}
                    </td>
                    <td className="py-3 pr-4 text-xs whitespace-nowrap text-[#546059] dark:text-[#A4B5AC]">
                      {evt.isDemo ? 'Demo Data' : 'User Record'}
                    </td>
                    <td className="py-3 text-right font-mono text-xs text-[#546059] dark:text-[#A4B5AC] tabular-nums whitespace-nowrap">
                      {formatDateTime(evt.timestamp)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </main>
  );
}
