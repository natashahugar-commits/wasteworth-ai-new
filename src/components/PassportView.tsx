import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import {
  CheckCircle2,
  Circle,
  ArrowRight,
  ImagePlus,
  ShieldCheck,
  FileText,
} from 'lucide-react';
import { useWasteStore } from '../store/wasteStore';
import type { BatchStatus, DestinationDetails } from '../types/waste';
import { MaterialIcon, formatDateTime, formatShortDate } from './MaterialIcon';

const TIMELINE_STAGES: BatchStatus[] = [
  'Created',
  'Listed',
  'Matched',
  'Collection recorded',
  'Destination recorded',
];

const DESTINATION_TYPES: DestinationDetails['destinationType'][] = [
  'Material Recovery Facility (MRF) Intake',
  'Aggregated Processor Yard (Unverified)',
  'Direct Mill / Foundry Intake',
  'Campus / Local Reuse Partner',
];

export function PassportView() {
  const {
    batches,
    selectedPassportId,
    setSelectedPassportId,
    recordCollection,
    recordDestination,
    setActiveSection,
  } = useWasteStore();

  const batch =
    batches.find((b) => b.id === selectedPassportId) ?? batches[0] ?? null;

  // Collection form state
  const [collectorName, setCollectorName] = useState('Campus Logistics & Partner Van');
  const [pickupNotes, setPickupNotes] = useState('');
  const [evidenceSummary, setEvidenceSummary] = useState('');
  const [evidenceImageDataUrl, setEvidenceImageDataUrl] = useState<string | undefined>(
    undefined
  );
  const [collectionError, setCollectionError] = useState<string | null>(null);

  // Destination form state
  const [facilityName, setFacilityName] = useState('');
  const [destinationType, setDestinationType] =
    useState<DestinationDetails['destinationType']>(
      'Material Recovery Facility (MRF) Intake'
    );
  const [intakeReference, setIntakeReference] = useState('');
  const [destinationNotes, setDestinationNotes] = useState('');
  const [recordedBy, setRecordedBy] = useState('Campus Sustainability Coordinator');
  const [destinationError, setDestinationError] = useState<string | null>(null);

  useEffect(() => {
    if (!batch) return;
    setPickupNotes('');
    setEvidenceSummary('');
    setEvidenceImageDataUrl(undefined);
    setCollectionError(null);
    setFacilityName(
      batch.match
        ? `${batch.match.partnerName} Intake Yard`
        : 'Regional Material Recovery Facility'
    );
    setIntakeReference('');
    setDestinationNotes('');
    setDestinationError(null);
  }, [batch?.id, batch?.status]);

  if (!batch) {
    return (
      <main className="max-w-[1280px] mx-auto px-4 sm:px-6 py-12">
        <div className="rounded-xl border border-[#E2DDD3] dark:border-[#24352E] bg-white dark:bg-[#111C17] p-8 text-center space-y-3">
          <h1 className="font-display text-xl font-semibold text-[#1B201D] dark:text-[#F2F5F3]">
            No batches available
          </h1>
          <button
            type="button"
            onClick={() => setActiveSection('marketplace')}
            className="px-4 py-2 rounded-lg text-sm font-semibold bg-[#133C2C] text-white cursor-pointer"
          >
            Create a Batch in Marketplace
          </button>
        </div>
      </main>
    );
  }

  const currentStageIndex = TIMELINE_STAGES.indexOf(batch.status);

  const handleEvidenceFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setCollectionError('Evidence attachment must be an image file.');
      return;
    }
    if (file.size > 400 * 1024) {
      setCollectionError('Please choose a compressed photo under 400 KB for browser storage.');
      return;
    }
    setCollectionError(null);
    const reader = new FileReader();
    reader.onload = () => {
      setEvidenceImageDataUrl(String(reader.result || ''));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmitCollection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!collectorName.trim() || !pickupNotes.trim()) {
      setCollectionError('Please provide collector name and pickup notes.');
      return;
    }
    recordCollection(batch.id, {
      recordedAt: new Date().toISOString(),
      collectorName: collectorName.trim(),
      pickupNotes: pickupNotes.trim(),
      evidenceSummary: evidenceSummary.trim() || undefined,
      evidenceImageDataUrl,
    });
  };

  const handleSubmitDestination = (e: React.FormEvent) => {
    e.preventDefault();
    if (!facilityName.trim() || !recordedBy.trim()) {
      setDestinationError('Facility name and recorder name are required.');
      return;
    }
    recordDestination(batch.id, {
      recordedAt: new Date().toISOString(),
      facilityName: facilityName.trim(),
      destinationType,
      intakeReference: intakeReference.trim() || 'UNASSIGNED-REF',
      destinationNotes:
        destinationNotes.trim() ||
        'Arrival logged in WasteWorth AI; end-processing requires independent facility confirmation.',
      recordedBy: recordedBy.trim(),
    });
  };

  return (
    <main className="max-w-[1280px] mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#E2DDD3] dark:border-[#24352E] pb-6">
        <div className="space-y-1.5 max-w-2xl">
          <p className="text-xs font-medium text-[#0F8A5F] dark:text-[#22B57E]">
            Digital Waste Passport · Batch Chain-of-Custody Record
          </p>
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[#133C2C] dark:text-[#F2F5F3]">
            Follow every batch from source to recorded destination.
          </h1>
          <p className="text-sm text-[#546059] dark:text-[#A4B5AC]">
            Select any batch ID below to inspect its 5-stage timeline, update collection or
            destination details, and review timestamped activity logs.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setSelectedPassportId('WW-0001')}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-[#E2DDD3] dark:border-[#24352E] bg-white dark:bg-[#111C17] text-xs font-semibold text-[#1B201D] dark:text-[#F2F5F3] hover:border-[#0F8A5F] cursor-pointer self-start md:self-auto whitespace-nowrap"
        >
          <span>View Illustrative Demo Journey (WW-0001)</span>
        </button>
      </div>

      {/* Layout: Batch Selector (Left) + Passport Document (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Batch Selector Sidebar */}
        <aside className="lg:col-span-4 rounded-xl border border-[#E2DDD3] dark:border-[#24352E] bg-white dark:bg-[#111C17] p-4 space-y-3">
          <div className="flex items-center justify-between px-1 pb-2 border-b border-[#E2DDD3] dark:border-[#24352E]">
            <h2 className="text-xs font-semibold text-[#546059] dark:text-[#A4B5AC]">
              All Batch Passports ({batches.length})
            </h2>
            <span className="font-mono text-[11px] text-[#546059] dark:text-[#A4B5AC]">
              WW-XXXX
            </span>
          </div>

          <div className="space-y-1.5 max-h-[540px] overflow-y-auto pr-1">
            {batches.map((b) => {
              const active = b.id === batch.id;
              return (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => setSelectedPassportId(b.id)}
                  className={`w-full text-left p-3 rounded-lg border transition-colors cursor-pointer space-y-1 ${
                    active
                      ? 'border-[#0F8A5F] dark:border-[#22B57E] bg-[#133C2C] text-white dark:bg-[#17251F]'
                      : 'border-transparent hover:border-[#E2DDD3] dark:hover:border-[#24352E] hover:bg-[#FAF8F4] dark:hover:bg-[#17251F]/50'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <span
                      className={`font-mono font-semibold ${
                        active ? 'text-[#8CE2BE]' : 'text-[#0F8A5F] dark:text-[#22B57E]'
                      }`}
                    >
                      {b.id}
                    </span>
                    <span
                      className={`tabular-nums font-mono ${
                        active ? 'text-white/80' : 'text-[#546059] dark:text-[#A4B5AC]'
                      }`}
                    >
                      {b.quantityKg} kg
                    </span>
                  </div>
                  <div
                    className={`text-xs font-semibold truncate ${
                      active ? 'text-white' : 'text-[#1B201D] dark:text-[#F2F5F3]'
                    }`}
                  >
                    {b.material}
                  </div>
                  <div
                    className={`text-[11px] flex items-center justify-between gap-2 ${
                      active ? 'text-white/75' : 'text-[#546059] dark:text-[#A4B5AC]'
                    }`}
                  >
                    <span className="truncate">
                      {b.isIllustrativeJourney
                        ? 'Illustrative Demo Journey'
                        : b.isDemo
                        ? 'Demo Data'
                        : 'User Record'}
                    </span>
                    <span className="shrink-0">{b.status}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </aside>

        {/* Passport Detail Sheet */}
        <motion.section
          key={batch.id}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="lg:col-span-8 rounded-xl border border-[#E2DDD3] dark:border-[#24352E] bg-white dark:bg-[#111C17] p-6 sm:p-8 space-y-8"
        >
          {/* Passport Header */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-[#E2DDD3] dark:border-[#24352E] pb-6">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2 text-xs text-[#546059] dark:text-[#A4B5AC]">
                <span className="font-mono text-sm font-bold text-[#0F8A5F] dark:text-[#22B57E]">
                  {batch.id}
                </span>
                <span aria-hidden="true">·</span>
                <span className="font-semibold text-[#1B201D] dark:text-[#F2F5F3]">
                  {batch.isIllustrativeJourney
                    ? 'Illustrative Demo Journey'
                    : batch.isDemo
                    ? 'Demo Data'
                    : 'User Record'}
                </span>
                <span aria-hidden="true">·</span>
                <span>Created {formatShortDate(batch.createdAt)}</span>
              </div>

              <h2 className="font-display text-xl sm:text-2xl font-bold text-[#133C2C] dark:text-[#F2F5F3]">
                {batch.title}
              </h2>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs sm:text-sm text-[#546059] dark:text-[#A4B5AC]">
                <span className="inline-flex items-center gap-1.5 text-[#1B201D] dark:text-[#F2F5F3] font-medium">
                  <MaterialIcon
                    material={batch.material}
                    className="w-4 h-4 text-[#0F8A5F] dark:text-[#22B57E]"
                  />
                  {batch.material}
                </span>
                <span aria-hidden="true">·</span>
                <span className="font-mono font-semibold text-[#1B201D] dark:text-[#F2F5F3] tabular-nums">
                  {batch.quantityKg} {batch.unit}
                </span>
                <span aria-hidden="true">·</span>
                <span>{batch.location}</span>
              </div>
            </div>

            <div className="rounded-lg border border-[#E2DDD3] dark:border-[#24352E] bg-[#FAF8F4] dark:bg-[#17251F] px-4 py-2.5 text-left sm:text-right shrink-0">
              <div className="text-[11px] text-[#546059] dark:text-[#A4B5AC]">Current Status</div>
              <div className="font-display text-sm font-bold text-[#0F8A5F] dark:text-[#22B57E]">
                {batch.status}
              </div>
            </div>
          </div>

          {/* 5-Stage Visual Timeline */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold text-[#546059] dark:text-[#A4B5AC]">
              Batch Journey Timeline
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
              {TIMELINE_STAGES.map((stage, idx) => {
                const completed = idx <= currentStageIndex;
                const current = idx === currentStageIndex;
                const stageEvt = batch.history.find((h) => h.stage === stage);

                return (
                  <div
                    key={stage}
                    className={`rounded-lg border p-3.5 space-y-2 transition-colors ${
                      current
                        ? 'border-[#0F8A5F] dark:border-[#22B57E] bg-[#0F8A5F]/10 dark:bg-[#22B57E]/15'
                        : completed
                        ? 'border-[#0F8A5F]/40 dark:border-[#22B57E]/40 bg-[#FAF8F4] dark:bg-[#17251F]/70'
                        : 'border-[#E2DDD3] dark:border-[#24352E] opacity-60'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-[11px] font-semibold text-[#0F8A5F] dark:text-[#22B57E] tabular-nums">
                        0{idx + 1}
                      </span>
                      {completed ? (
                        <CheckCircle2
                          className="w-4 h-4 text-[#0F8A5F] dark:text-[#22B57E]"
                          aria-hidden="true"
                        />
                      ) : (
                        <Circle
                          className="w-4 h-4 text-[#546059]/40"
                          aria-hidden="true"
                        />
                      )}
                    </div>
                    <div className="text-xs font-semibold text-[#1B201D] dark:text-[#F2F5F3]">
                      {stage}
                    </div>
                    <div className="text-[11px] text-[#546059] dark:text-[#A4B5AC] tabular-nums">
                      {stageEvt ? formatShortDate(stageEvt.timestamp) : 'Pending'}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Core Record Grid: Metadata, Match, Collection, Destination */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-[#E2DDD3] dark:border-[#24352E] pt-6">
            {/* Batch Source & Notes */}
            <div className="space-y-2.5">
              <h3 className="text-xs font-semibold text-[#133C2C] dark:text-[#22B57E]">
                Batch Origin & Condition
              </h3>
              <dl className="text-xs space-y-1.5 text-[#546059] dark:text-[#A4B5AC]">
                <div>
                  <span className="font-semibold text-[#1B201D] dark:text-[#F2F5F3]">
                    Source unit:
                  </span>{' '}
                  {batch.sourceUnit}
                </div>
                <div>
                  <span className="font-semibold text-[#1B201D] dark:text-[#F2F5F3]">
                    Condition:
                  </span>{' '}
                  {batch.condition}
                </div>
                <div>
                  <span className="font-semibold text-[#1B201D] dark:text-[#F2F5F3]">
                    Created by:
                  </span>{' '}
                  {batch.createdBy}
                </div>
                {batch.notes && (
                  <div>
                    <span className="font-semibold text-[#1B201D] dark:text-[#F2F5F3]">
                      Notes:
                    </span>{' '}
                    {batch.notes}
                  </div>
                )}
                {batch.evidenceNote && (
                  <div>
                    <span className="font-semibold text-[#1B201D] dark:text-[#F2F5F3]">
                      Initial evidence:
                    </span>{' '}
                    {batch.evidenceNote}
                  </div>
                )}
              </dl>
            </div>

            {/* Match / Partner Details */}
            <div className="space-y-2.5">
              <h3 className="text-xs font-semibold text-[#133C2C] dark:text-[#22B57E]">
                Match & Partner Details
              </h3>
              {batch.match ? (
                <div className="text-xs space-y-1.5 text-[#546059] dark:text-[#A4B5AC]">
                  <div className="font-semibold text-[#1B201D] dark:text-[#F2F5F3]">
                    {batch.match.partnerName}{' '}
                    <span className="font-normal text-[#0F8A5F] dark:text-[#22B57E]">
                      ({batch.match.isDemoPartner ? 'Demo Partner' : 'Partner'})
                    </span>
                  </div>
                  <div>{batch.match.partnerType}</div>
                  <div>Matched: {formatDateTime(batch.match.matchedAt)}</div>
                  <div className="pt-1">
                    <span className="font-semibold text-[#1B201D] dark:text-[#F2F5F3]">
                      Match criteria:
                    </span>{' '}
                    {batch.match.reasons.join(' · ')}
                  </div>
                </div>
              ) : (
                <div className="text-xs text-[#546059] dark:text-[#A4B5AC] space-y-2">
                  <p>No partner selected yet.</p>
                  <button
                    type="button"
                    onClick={() => setActiveSection('marketplace')}
                    className="inline-flex items-center gap-1.5 font-semibold text-[#0F8A5F] dark:text-[#22B57E] hover:underline cursor-pointer"
                  >
                    <span>Select Demo Partner in Marketplace</span>
                    <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </button>
                </div>
              )}
            </div>

            {/* Collection Details */}
            <div className="space-y-2.5 border-t border-[#E2DDD3] dark:border-[#24352E] pt-5">
              <h3 className="text-xs font-semibold text-[#133C2C] dark:text-[#22B57E]">
                Collection Record
              </h3>
              {batch.collection ? (
                <div className="text-xs space-y-1.5 text-[#546059] dark:text-[#A4B5AC]">
                  <div>
                    <span className="font-semibold text-[#1B201D] dark:text-[#F2F5F3]">
                      Collector:
                    </span>{' '}
                    {batch.collection.collectorName}
                  </div>
                  <div>
                    <span className="font-semibold text-[#1B201D] dark:text-[#F2F5F3]">
                      Recorded:
                    </span>{' '}
                    {formatDateTime(batch.collection.recordedAt)}
                  </div>
                  <div>
                    <span className="font-semibold text-[#1B201D] dark:text-[#F2F5F3]">
                      Pickup notes:
                    </span>{' '}
                    {batch.collection.pickupNotes}
                  </div>
                  {batch.collection.evidenceSummary && (
                    <div>
                      <span className="font-semibold text-[#1B201D] dark:text-[#F2F5F3]">
                        Evidence note:
                      </span>{' '}
                      {batch.collection.evidenceSummary}
                    </div>
                  )}
                  {batch.collection.evidenceImageDataUrl && (
                    <div className="pt-2">
                      <img
                        src={batch.collection.evidenceImageDataUrl}
                        alt={`Collection evidence for ${batch.id}`}
                        className="w-28 h-20 object-cover rounded-md border border-[#E2DDD3] dark:border-[#24352E]"
                      />
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-xs text-[#546059] dark:text-[#A4B5AC]">
                  Collection has not been recorded for this batch yet.
                </p>
              )}
            </div>

            {/* Destination Details */}
            <div className="space-y-2.5 border-t border-[#E2DDD3] dark:border-[#24352E] pt-5">
              <h3 className="text-xs font-semibold text-[#133C2C] dark:text-[#22B57E]">
                Destination Record
              </h3>
              {batch.destination ? (
                <div className="text-xs space-y-1.5 text-[#546059] dark:text-[#A4B5AC]">
                  <div>
                    <span className="font-semibold text-[#1B201D] dark:text-[#F2F5F3]">
                      Facility:
                    </span>{' '}
                    {batch.destination.facilityName}
                  </div>
                  <div>
                    <span className="font-semibold text-[#1B201D] dark:text-[#F2F5F3]">
                      Destination type:
                    </span>{' '}
                    {batch.destination.destinationType}
                  </div>
                  <div>
                    <span className="font-semibold text-[#1B201D] dark:text-[#F2F5F3]">
                      Intake ref:
                    </span>{' '}
                    <span className="font-mono">{batch.destination.intakeReference}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-[#1B201D] dark:text-[#F2F5F3]">
                      Recorded by:
                    </span>{' '}
                    {batch.destination.recordedBy} · {formatDateTime(batch.destination.recordedAt)}
                  </div>
                  <div>
                    <span className="font-semibold text-[#1B201D] dark:text-[#F2F5F3]">
                      Notes:
                    </span>{' '}
                    {batch.destination.destinationNotes}
                  </div>
                </div>
              ) : (
                <p className="text-xs text-[#546059] dark:text-[#A4B5AC]">
                  Destination facility details have not been recorded yet.
                </p>
              )}
            </div>
          </div>

          {/* Interactive Journey Update Panels */}
          {batch.status === 'Matched' && (
            <form
              onSubmit={handleSubmitCollection}
              className="rounded-xl border border-[#0F8A5F]/40 dark:border-[#22B57E]/40 bg-[#FAF8F4] dark:bg-[#17251F] p-5 space-y-4"
            >
              <div>
                <h3 className="font-display text-base font-semibold text-[#133C2C] dark:text-[#F2F5F3]">
                  Record Collection Update
                </h3>
                <p className="text-xs text-[#546059] dark:text-[#A4B5AC]">
                  Log collector pickup details to advance {batch.id} to “Collection recorded”.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="collector-name"
                    className="block text-xs font-semibold text-[#1B201D] dark:text-[#F2F5F3] mb-1"
                  >
                    Collector / Hauler Name *
                  </label>
                  <input
                    id="collector-name"
                    type="text"
                    value={collectorName}
                    onChange={(e) => setCollectorName(e.target.value)}
                    className="w-full rounded-lg border border-[#E2DDD3] dark:border-[#24352E] bg-white dark:bg-[#0B1310] px-3 py-2 text-xs text-[#1B201D] dark:text-[#F2F5F3]"
                  />
                </div>
                <div>
                  <label
                    htmlFor="evidence-summary"
                    className="block text-xs font-semibold text-[#1B201D] dark:text-[#F2F5F3] mb-1"
                  >
                    Optional Evidence Note / Scale Slip
                  </label>
                  <input
                    id="evidence-summary"
                    type="text"
                    value={evidenceSummary}
                    onChange={(e) => setEvidenceSummary(e.target.value)}
                    placeholder="e.g., Handover slip #104 signed at loading bay"
                    className="w-full rounded-lg border border-[#E2DDD3] dark:border-[#24352E] bg-white dark:bg-[#0B1310] px-3 py-2 text-xs text-[#1B201D] dark:text-[#F2F5F3]"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label
                    htmlFor="pickup-notes"
                    className="block text-xs font-semibold text-[#1B201D] dark:text-[#F2F5F3] mb-1"
                  >
                    Collection & Handover Notes *
                  </label>
                  <textarea
                    id="pickup-notes"
                    rows={2}
                    value={pickupNotes}
                    onChange={(e) => setPickupNotes(e.target.value)}
                    placeholder="e.g., Loaded 2 dry bundles from Engineering Block B dock at 14:30."
                    className="w-full rounded-lg border border-[#E2DDD3] dark:border-[#24352E] bg-white dark:bg-[#0B1310] px-3 py-2 text-xs text-[#1B201D] dark:text-[#F2F5F3]"
                  />
                </div>
                <div className="sm:col-span-2 flex flex-wrap items-center justify-between gap-3">
                  <label className="inline-flex items-center gap-2 text-xs font-medium text-[#1B201D] dark:text-[#F2F5F3] cursor-pointer">
                    <ImagePlus className="w-4 h-4 text-[#0F8A5F] dark:text-[#22B57E]" aria-hidden="true" />
                    <span>
                      {evidenceImageDataUrl
                        ? 'Evidence photo attached'
                        : 'Optional evidence photo (<400 KB)'}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleEvidenceFile}
                      className="hidden"
                    />
                  </label>

                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg text-xs font-semibold bg-[#133C2C] text-white hover:bg-[#0F8A5F] dark:bg-[#22B57E] dark:text-[#0B1310] cursor-pointer whitespace-nowrap"
                  >
                    Save Collection Update
                  </button>
                </div>
              </div>

              {collectionError && (
                <p className="text-xs text-red-700 dark:text-red-400">{collectionError}</p>
              )}
            </form>
          )}

          {batch.status === 'Collection recorded' && (
            <form
              onSubmit={handleSubmitDestination}
              className="rounded-xl border border-[#0F8A5F]/40 dark:border-[#22B57E]/40 bg-[#FAF8F4] dark:bg-[#17251F] p-5 space-y-4"
            >
              <div>
                <h3 className="font-display text-base font-semibold text-[#133C2C] dark:text-[#F2F5F3]">
                  Record Destination Details
                </h3>
                <p className="text-xs text-[#546059] dark:text-[#A4B5AC]">
                  Document the reported intake facility and reference for {batch.id}.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="facility-name"
                    className="block text-xs font-semibold text-[#1B201D] dark:text-[#F2F5F3] mb-1"
                  >
                    Receiving Facility Name *
                  </label>
                  <input
                    id="facility-name"
                    type="text"
                    value={facilityName}
                    onChange={(e) => setFacilityName(e.target.value)}
                    className="w-full rounded-lg border border-[#E2DDD3] dark:border-[#24352E] bg-white dark:bg-[#0B1310] px-3 py-2 text-xs text-[#1B201D] dark:text-[#F2F5F3]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="destination-type"
                    className="block text-xs font-semibold text-[#1B201D] dark:text-[#F2F5F3] mb-1"
                  >
                    Destination Classification *
                  </label>
                  <select
                    id="destination-type"
                    value={destinationType}
                    onChange={(e) =>
                      setDestinationType(
                        e.target.value as DestinationDetails['destinationType']
                      )
                    }
                    className="w-full rounded-lg border border-[#E2DDD3] dark:border-[#24352E] bg-white dark:bg-[#0B1310] px-3 py-2 text-xs text-[#1B201D] dark:text-[#F2F5F3]"
                  >
                    {DESTINATION_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="intake-ref"
                    className="block text-xs font-semibold text-[#1B201D] dark:text-[#F2F5F3] mb-1"
                  >
                    Intake / Weighbridge Reference
                  </label>
                  <input
                    id="intake-ref"
                    type="text"
                    value={intakeReference}
                    onChange={(e) => setIntakeReference(e.target.value)}
                    placeholder="e.g., IN-4092"
                    className="w-full rounded-lg border border-[#E2DDD3] dark:border-[#24352E] bg-white dark:bg-[#0B1310] px-3 py-2 text-xs font-mono text-[#1B201D] dark:text-[#F2F5F3]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="recorded-by"
                    className="block text-xs font-semibold text-[#1B201D] dark:text-[#F2F5F3] mb-1"
                  >
                    Recorded By *
                  </label>
                  <input
                    id="recorded-by"
                    type="text"
                    value={recordedBy}
                    onChange={(e) => setRecordedBy(e.target.value)}
                    className="w-full rounded-lg border border-[#E2DDD3] dark:border-[#24352E] bg-white dark:bg-[#0B1310] px-3 py-2 text-xs text-[#1B201D] dark:text-[#F2F5F3]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor="destination-notes"
                    className="block text-xs font-semibold text-[#1B201D] dark:text-[#F2F5F3] mb-1"
                  >
                    Destination & Intake Notes
                  </label>
                  <textarea
                    id="destination-notes"
                    rows={2}
                    value={destinationNotes}
                    onChange={(e) => setDestinationNotes(e.target.value)}
                    placeholder="e.g., Received dry at baling intake gate; net scale weight matched."
                    className="w-full rounded-lg border border-[#E2DDD3] dark:border-[#24352E] bg-white dark:bg-[#0B1310] px-3 py-2 text-xs text-[#1B201D] dark:text-[#F2F5F3]"
                  />
                </div>
              </div>

              {destinationError && (
                <p className="text-xs text-red-700 dark:text-red-400">{destinationError}</p>
              )}

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg text-xs font-semibold bg-[#133C2C] text-white hover:bg-[#0F8A5F] dark:bg-[#22B57E] dark:text-[#0B1310] cursor-pointer whitespace-nowrap"
                >
                  Save Destination Details
                </button>
              </div>
            </form>
          )}

          {/* Honest Verification Disclaimer */}
          <div className="rounded-lg bg-[#FAF8F4] dark:bg-[#17251F] border border-[#E2DDD3] dark:border-[#24352E] p-4 flex items-start gap-3 text-xs text-[#546059] dark:text-[#A4B5AC]">
            <ShieldCheck
              className="w-4 h-4 text-[#0F8A5F] dark:text-[#22B57E] shrink-0 mt-0.5"
              aria-hidden="true"
            />
            <p className="leading-relaxed">
              <strong className="text-[#1B201D] dark:text-[#F2F5F3]">
                Traceability Scope Notice:
              </strong>{' '}
              Recording a destination logs where a batch was reported to arrive. It does not
              independently prove or verify that physical recycling occurred without third-party
              facility audits.
            </p>
          </div>

          {/* Complete Activity History */}
          <div className="space-y-3 border-t border-[#E2DDD3] dark:border-[#24352E] pt-6">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-xs font-semibold text-[#133C2C] dark:text-[#22B57E] inline-flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Chronological Activity History</span>
              </h3>
              <button
                type="button"
                onClick={() => setActiveSection('reports')}
                className="text-xs font-semibold text-[#0F8A5F] dark:text-[#22B57E] hover:underline cursor-pointer"
              >
                View in Reports & CSV
              </button>
            </div>

            <ol className="divide-y divide-[#E2DDD3] dark:divide-[#24352E]">
              {batch.history.map((evt) => (
                <li
                  key={evt.id}
                  className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                >
                  <div className="space-y-0.5">
                    <div className="font-semibold text-[#1B201D] dark:text-[#F2F5F3]">
                      {evt.stage}{' '}
                      <span className="font-normal text-[#546059] dark:text-[#A4B5AC]">
                        · Recorded by {evt.actor}
                      </span>
                    </div>
                    <div className="text-[#546059] dark:text-[#A4B5AC]">{evt.note}</div>
                  </div>
                  <div className="font-mono text-[11px] text-[#546059] dark:text-[#A4B5AC] tabular-nums shrink-0">
                    {formatDateTime(evt.timestamp)}
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </motion.section>
      </div>
    </main>
  );
}
