import React, { useMemo, useState } from 'react';
import { Download, Info } from 'lucide-react';
import { MATERIAL_CATEGORIES } from '../data/materials';
import { useWasteStore } from '../store/wasteStore';
import type { BatchStatus, MaterialCategory } from '../types/waste';
import { formatShortDate } from './MaterialIcon';

const ALL_STATUSES: BatchStatus[] = [
  'Created',
  'Listed',
  'Matched',
  'Collection recorded',
  'Destination recorded',
];

function escapeCsvCell(value: unknown): string {
  const str = String(value ?? '');
  if (str.includes('"') || str.includes(',') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export function ReportsView() {
  const { batches, openPassport, showToast } = useWasteStore();

  const [materialFilter, setMaterialFilter] = useState<'All' | MaterialCategory>('All');
  const [originFilter, setOriginFilter] = useState<'all' | 'user' | 'demo'>('all');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const filtered = useMemo(() => {
    return batches.filter((b) => {
      if (materialFilter !== 'All' && b.material !== materialFilter) return false;
      if (originFilter === 'user' && b.isDemo) return false;
      if (originFilter === 'demo' && !b.isDemo) return false;

      const createdDay = b.createdAt.slice(0, 10);
      if (fromDate && createdDay < fromDate) return false;
      if (toDate && createdDay > toDate) return false;
      return true;
    });
  }, [batches, materialFilter, originFilter, fromDate, toDate]);

  const totalKg = useMemo(
    () => filtered.reduce((sum, b) => sum + b.quantityKg, 0),
    [filtered]
  );

  const byMaterial = useMemo(() => {
    return MATERIAL_CATEGORIES.map((mat) => {
      const rows = filtered.filter((b) => b.material === mat);
      const kg = rows.reduce((sum, b) => sum + b.quantityKg, 0);
      const destCount = rows.filter((b) => b.status === 'Destination recorded').length;
      return {
        material: mat,
        batches: rows.length,
        kg,
        sharePct: totalKg > 0 ? ((kg / totalKg) * 100).toFixed(1) : '0.0',
        destCount,
      };
    });
  }, [filtered, totalKg]);

  const byStatus = useMemo(() => {
    return ALL_STATUSES.map((status) => {
      const rows = filtered.filter((b) => b.status === status);
      return {
        status,
        batches: rows.length,
        kg: rows.reduce((sum, b) => sum + b.quantityKg, 0),
      };
    });
  }, [filtered]);

  const collectionRows = useMemo(
    () => filtered.filter((b) => Boolean(b.collection)),
    [filtered]
  );

  const handleExportCsv = () => {
    const headers = [
      'Batch ID',
      'Data Origin',
      'Title',
      'Material Category',
      'Quantity (kg)',
      'Condition',
      'Location',
      'Source Unit',
      'Created Date',
      'Current Status',
      'Matched Partner',
      'Partner Type',
      'Collection Date',
      'Collector Name',
      'Pickup Notes',
      'Destination Recorded Date',
      'Destination Facility',
      'Destination Classification',
      'Intake Reference',
    ];

    const lines = [
      headers.map(escapeCsvCell).join(','),
      ...filtered.map((b) =>
        [
          b.id,
          b.isDemo ? 'Demo Data' : 'User Record',
          b.title,
          b.material,
          b.quantityKg,
          b.condition,
          b.location,
          b.sourceUnit,
          b.createdAt,
          b.status,
          b.match ? `${b.match.partnerName} (Demo Partner)` : 'Not matched',
          b.match?.partnerType ?? '',
          b.collection?.recordedAt ?? '',
          b.collection?.collectorName ?? '',
          b.collection?.pickupNotes ?? '',
          b.destination?.recordedAt ?? '',
          b.destination?.facilityName ?? 'Destination not yet recorded',
          b.destination?.destinationType ?? '',
          b.destination?.intakeReference ?? '',
        ]
          .map(escapeCsvCell)
          .join(',')
      ),
    ];

    const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const dateStamp = new Date().toISOString().slice(0, 10);
    link.href = url;
    link.download = `wasteworth-traceability-report-${dateStamp}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast('success', `Exported ${filtered.length} batch records to CSV.`);
  };

  return (
    <main className="max-w-[1280px] mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-8">
      {/* Header & CSV Export */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#E2DDD3] dark:border-[#24352E] pb-6">
        <div className="space-y-1.5 max-w-2xl">
          <p className="text-xs font-medium text-[#0F8A5F] dark:text-[#22B57E]">
            Reports & Audit Traceability
          </p>
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[#133C2C] dark:text-[#F2F5F3]">
            Material ledger, collection logs, and destination records.
          </h1>
          <p className="text-sm text-[#546059] dark:text-[#A4B5AC]">
            Every summary figure below is computed directly from saved batch records. Batches
            without a destination record are explicitly flagged as pending.
          </p>
        </div>

        <button
          type="button"
          onClick={handleExportCsv}
          disabled={filtered.length === 0}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold bg-[#133C2C] text-white hover:bg-[#0F8A5F] dark:bg-[#22B57E] dark:text-[#0B1310] transition-colors cursor-pointer disabled:opacity-50 self-start md:self-auto whitespace-nowrap shrink-0"
        >
          <Download className="w-4 h-4" aria-hidden="true" />
          <span>Export CSV ({filtered.length})</span>
        </button>
      </div>

      {/* Filters */}
      <section className="rounded-xl border border-[#E2DDD3] dark:border-[#24352E] bg-white dark:bg-[#111C17] p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div>
          <label
            htmlFor="report-material"
            className="block text-[11px] font-semibold text-[#546059] dark:text-[#A4B5AC] mb-1"
          >
            Material Category
          </label>
          <select
            id="report-material"
            value={materialFilter}
            onChange={(e) => setMaterialFilter(e.target.value as 'All' | MaterialCategory)}
            className="w-full rounded-lg border border-[#E2DDD3] dark:border-[#24352E] bg-[#FAF8F4] dark:bg-[#0B1310] px-3 py-2 text-xs sm:text-sm text-[#1B201D] dark:text-[#F2F5F3]"
          >
            <option value="All">All Materials</option>
            {MATERIAL_CATEGORIES.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="report-origin"
            className="block text-[11px] font-semibold text-[#546059] dark:text-[#A4B5AC] mb-1"
          >
            Record Origin
          </label>
          <select
            id="report-origin"
            value={originFilter}
            onChange={(e) => setOriginFilter(e.target.value as 'all' | 'user' | 'demo')}
            className="w-full rounded-lg border border-[#E2DDD3] dark:border-[#24352E] bg-[#FAF8F4] dark:bg-[#0B1310] px-3 py-2 text-xs sm:text-sm text-[#1B201D] dark:text-[#F2F5F3]"
          >
            <option value="all">All Records (User + Demo)</option>
            <option value="user">User Records Only</option>
            <option value="demo">Demo Data Only</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="report-from"
            className="block text-[11px] font-semibold text-[#546059] dark:text-[#A4B5AC] mb-1"
          >
            Created From
          </label>
          <input
            id="report-from"
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="w-full rounded-lg border border-[#E2DDD3] dark:border-[#24352E] bg-[#FAF8F4] dark:bg-[#0B1310] px-3 py-2 text-xs sm:text-sm text-[#1B201D] dark:text-[#F2F5F3]"
          />
        </div>

        <div>
          <label
            htmlFor="report-to"
            className="block text-[11px] font-semibold text-[#546059] dark:text-[#A4B5AC] mb-1"
          >
            Created To
          </label>
          <input
            id="report-to"
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="w-full rounded-lg border border-[#E2DDD3] dark:border-[#24352E] bg-[#FAF8F4] dark:bg-[#0B1310] px-3 py-2 text-xs sm:text-sm text-[#1B201D] dark:text-[#F2F5F3]"
          />
        </div>
      </section>

      {/* Tables Row 1: Quantities by Material + Listings by Status */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <section className="lg:col-span-7 rounded-xl border border-[#E2DDD3] dark:border-[#24352E] bg-white dark:bg-[#111C17] p-6 space-y-4">
          <div className="flex items-baseline justify-between border-b border-[#E2DDD3] dark:border-[#24352E] pb-3">
            <h2 className="font-display text-lg font-semibold text-[#133C2C] dark:text-[#F2F5F3]">
              Quantities by Material (kg)
            </h2>
            <span className="font-mono text-xs text-[#546059] dark:text-[#A4B5AC] tabular-nums">
              Total: {totalKg} kg
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-[#E2DDD3] dark:border-[#24352E] text-xs text-[#546059] dark:text-[#A4B5AC]">
                  <th className="py-2 pr-3 font-medium">Material</th>
                  <th className="py-2 px-3 text-right font-medium">Batches</th>
                  <th className="py-2 px-3 text-right font-medium">Quantity (kg)</th>
                  <th className="py-2 px-3 text-right font-medium">Share (%)</th>
                  <th className="py-2 pl-3 text-right font-medium">Destination Logged</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2DDD3] dark:divide-[#24352E]">
                {byMaterial.map((row) => (
                  <tr key={row.material}>
                    <td className="py-2.5 pr-3 font-medium text-[#1B201D] dark:text-[#F2F5F3]">
                      {row.material}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono tabular-nums text-xs">
                      {row.batches}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono tabular-nums text-xs font-semibold">
                      {row.kg} kg
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono tabular-nums text-xs text-[#546059] dark:text-[#A4B5AC]">
                      {row.sharePct}%
                    </td>
                    <td className="py-2.5 pl-3 text-right font-mono tabular-nums text-xs text-[#0F8A5F] dark:text-[#22B57E]">
                      {row.destCount} / {row.batches}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="lg:col-span-5 rounded-xl border border-[#E2DDD3] dark:border-[#24352E] bg-white dark:bg-[#111C17] p-6 space-y-4">
          <div className="border-b border-[#E2DDD3] dark:border-[#24352E] pb-3">
            <h2 className="font-display text-lg font-semibold text-[#133C2C] dark:text-[#F2F5F3]">
              Listings by Lifecycle Status
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-[#E2DDD3] dark:border-[#24352E] text-xs text-[#546059] dark:text-[#A4B5AC]">
                  <th className="py-2 pr-3 font-medium">Status</th>
                  <th className="py-2 px-3 text-right font-medium">Batches</th>
                  <th className="py-2 pl-3 text-right font-medium">Total Weight</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2DDD3] dark:divide-[#24352E]">
                {byStatus.map((row) => (
                  <tr key={row.status}>
                    <td className="py-2.5 pr-3 font-medium text-[#1B201D] dark:text-[#F2F5F3] text-xs sm:text-sm">
                      {row.status}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono tabular-nums text-xs">
                      {row.batches}
                    </td>
                    <td className="py-2.5 pl-3 text-right font-mono tabular-nums text-xs font-semibold">
                      {row.kg} kg
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {/* Recorded Collection Activity */}
      <section className="rounded-xl border border-[#E2DDD3] dark:border-[#24352E] bg-white dark:bg-[#111C17] p-6 space-y-4">
        <div className="flex items-baseline justify-between border-b border-[#E2DDD3] dark:border-[#24352E] pb-3">
          <h2 className="font-display text-lg font-semibold text-[#133C2C] dark:text-[#F2F5F3]">
            Recorded Collection Activity
          </h2>
          <span className="font-mono text-xs text-[#546059] dark:text-[#A4B5AC] tabular-nums">
            {collectionRows.length} collections logged
          </span>
        </div>

        {collectionRows.length === 0 ? (
          <p className="text-sm text-[#546059] dark:text-[#A4B5AC]">
            No collections have been recorded for the active filter selection.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-[#E2DDD3] dark:border-[#24352E] text-xs text-[#546059] dark:text-[#A4B5AC]">
                  <th className="py-2 pr-3 font-medium">Batch</th>
                  <th className="py-2 px-3 font-medium">Material</th>
                  <th className="py-2 px-3 text-right font-medium">Weight</th>
                  <th className="py-2 px-3 font-medium">Collector</th>
                  <th className="py-2 px-3 font-medium">Pickup Notes</th>
                  <th className="py-2 pl-3 text-right font-medium">Collected Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2DDD3] dark:divide-[#24352E]">
                {collectionRows.map((b) => (
                  <tr key={b.id}>
                    <td className="py-2.5 pr-3 font-mono text-xs font-semibold">
                      <button
                        type="button"
                        onClick={() => openPassport(b.id)}
                        className="text-[#0F8A5F] dark:text-[#22B57E] hover:underline cursor-pointer"
                      >
                        {b.id}
                      </button>
                    </td>
                    <td className="py-2.5 px-3">{b.material}</td>
                    <td className="py-2.5 px-3 text-right font-mono tabular-nums">
                      {b.quantityKg} kg
                    </td>
                    <td className="py-2.5 px-3">{b.collection?.collectorName}</td>
                    <td className="py-2.5 px-3 text-[#546059] dark:text-[#A4B5AC] max-w-md">
                      {b.collection?.pickupNotes}
                    </td>
                    <td className="py-2.5 pl-3 text-right font-mono tabular-nums whitespace-nowrap">
                      {b.collection ? formatShortDate(b.collection.recordedAt) : ''}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Destination Records Table */}
      <section className="rounded-xl border border-[#E2DDD3] dark:border-[#24352E] bg-white dark:bg-[#111C17] p-6 space-y-4">
        <div className="border-b border-[#E2DDD3] dark:border-[#24352E] pb-3">
          <h2 className="font-display text-lg font-semibold text-[#133C2C] dark:text-[#F2F5F3]">
            Destination Traceability Ledger
          </h2>
          <p className="text-xs text-[#546059] dark:text-[#A4B5AC]">
            Lists every batch and its destination status. Missing destination data is never treated
            as recycled.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-[#E2DDD3] dark:border-[#24352E] text-xs text-[#546059] dark:text-[#A4B5AC]">
                <th className="py-2 pr-3 font-medium">Batch</th>
                <th className="py-2 px-3 font-medium">Origin</th>
                <th className="py-2 px-3 font-medium">Material</th>
                <th className="py-2 px-3 text-right font-medium">Quantity</th>
                <th className="py-2 px-3 font-medium">Status</th>
                <th className="py-2 px-3 font-medium">Recorded Facility</th>
                <th className="py-2 pl-3 text-right font-medium">Intake Ref</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2DDD3] dark:divide-[#24352E]">
              {filtered.map((b) => (
                <tr key={b.id}>
                  <td className="py-2.5 pr-3 font-mono text-xs font-semibold">
                    <button
                      type="button"
                      onClick={() => openPassport(b.id)}
                      className="text-[#0F8A5F] dark:text-[#22B57E] hover:underline cursor-pointer"
                    >
                      {b.id}
                    </button>
                  </td>
                  <td className="py-2.5 px-3 text-xs text-[#546059] dark:text-[#A4B5AC] whitespace-nowrap">
                    {b.isDemo ? 'Demo Data' : 'User Record'}
                  </td>
                  <td className="py-2.5 px-3">{b.material}</td>
                  <td className="py-2.5 px-3 text-right font-mono tabular-nums whitespace-nowrap">
                    {b.quantityKg} kg
                  </td>
                  <td className="py-2.5 px-3 whitespace-nowrap">{b.status}</td>
                  <td className="py-2.5 px-3 text-[#546059] dark:text-[#A4B5AC]">
                    {b.destination ? b.destination.facilityName : 'Destination not yet recorded'}
                  </td>
                  <td className="py-2.5 pl-3 text-right font-mono text-xs whitespace-nowrap">
                    {b.destination ? b.destination.intakeReference : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Metric Definitions */}
      <section className="rounded-xl border border-[#E2DDD3] dark:border-[#24352E] bg-[#FAF8F4] dark:bg-[#17251F] p-5 space-y-3 text-xs text-[#546059] dark:text-[#A4B5AC]">
        <div className="flex items-center gap-2 font-semibold text-[#1B201D] dark:text-[#F2F5F3]">
          <Info className="w-4 h-4 text-[#0F8A5F] dark:text-[#22B57E]" aria-hidden="true" />
          <span>Metric Definitions & Scope</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 leading-relaxed">
          <div>
            <strong className="text-[#1B201D] dark:text-[#F2F5F3]">Quantity (kg):</strong> Sum of
            estimated or scale-recorded batch weights entered by users or demo records.
          </div>
          <div>
            <strong className="text-[#1B201D] dark:text-[#F2F5F3]">Collection Recorded:</strong>{' '}
            Batches where a collector name and pickup handover note have been logged.
          </div>
          <div>
            <strong className="text-[#1B201D] dark:text-[#F2F5F3]">Destination Recorded:</strong>{' '}
            Batches with a logged receiving facility and intake reference; does not independently
            certify physical recycling.
          </div>
        </div>
      </section>
    </main>
  );
}
