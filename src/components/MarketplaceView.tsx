import React, { useEffect, useMemo, useState } from 'react';
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  X,
} from 'lucide-react';
import { MATERIAL_CATEGORIES } from '../data/materials';
import { evaluatePartnerMatches, type PartnerMatchEvaluation } from '../data/partners';
import { useWasteStore } from '../store/wasteStore';
import type { BatchStatus, MaterialCategory, WasteBatch } from '../types/waste';
import { MaterialIcon, formatShortDate } from './MaterialIcon';

type SortKey = 'newest' | 'qty_desc' | 'qty_asc';

export function MarketplaceView() {
  const {
    batches,
    listingPrefill,
    setListingPrefill,
    createBatch,
    updateBatch,
    deleteBatch,
    matchBatchWithPartner,
    openPassport,
  } = useWasteStore();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | BatchStatus>('All');
  const [materialFilter, setMaterialFilter] = useState<'All' | MaterialCategory>('All');
  const [sortBy, setSortBy] = useState<SortKey>('newest');

  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedBatchId, setSelectedBatchId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [matchActor, setMatchActor] = useState('Campus Sustainability Coordinator');

  // Form state
  const [title, setTitle] = useState('');
  const [material, setMaterial] = useState<MaterialCategory>('Cardboard');
  const [quantityKg, setQuantityKg] = useState('20');
  const [condition, setCondition] = useState('Dry, flattened, clean');
  const [location, setLocation] = useState('North Campus · Engineering Block B');
  const [sourceUnit, setSourceUnit] = useState('Campus Mailroom');
  const [createdBy, setCreatedBy] = useState('Campus Coordinator');
  const [notes, setNotes] = useState('');
  const [evidenceNote, setEvidenceNote] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (listingPrefill) {
      setEditingId(null);
      setTitle(listingPrefill.title || `${listingPrefill.material || 'Cardboard'} Batch`);
      setMaterial(listingPrefill.material || 'Cardboard');
      setQuantityKg('20');
      setCondition('Dry, sorted, clean');
      setLocation('North Campus · Engineering Block B');
      setSourceUnit('Campus Collection Point');
      setCreatedBy('Campus Coordinator');
      setNotes(listingPrefill.notes || '');
      setEvidenceNote('');
      setFormError(null);
      setFormOpen(true);
      setListingPrefill(null);
    }
  }, [listingPrefill, setListingPrefill]);

  const openCreateForm = () => {
    setEditingId(null);
    setTitle('');
    setMaterial('Cardboard');
    setQuantityKg('20');
    setCondition('Dry, flattened, clean');
    setLocation('North Campus · Engineering Block B');
    setSourceUnit('Campus Mailroom');
    setCreatedBy('Campus Coordinator');
    setNotes('');
    setEvidenceNote('');
    setFormError(null);
    setFormOpen(true);
  };

  const openEditForm = (batch: WasteBatch) => {
    setEditingId(batch.id);
    setTitle(batch.title);
    setMaterial(batch.material);
    setQuantityKg(String(batch.quantityKg));
    setCondition(batch.condition);
    setLocation(batch.location);
    setSourceUnit(batch.sourceUnit);
    setCreatedBy(batch.createdBy);
    setNotes(batch.notes);
    setEvidenceNote(batch.evidenceNote || '');
    setFormError(null);
    setFormOpen(true);
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedQty = Number(quantityKg);
    if (!title.trim()) {
      setFormError('Please enter a descriptive batch title.');
      return;
    }
    if (!Number.isFinite(parsedQty) || parsedQty <= 0) {
      setFormError('Please enter a valid positive weight in kg.');
      return;
    }
    if (!condition.trim() || !location.trim()) {
      setFormError('Condition and pickup location are required.');
      return;
    }

    if (editingId) {
      updateBatch(editingId, {
        title: title.trim(),
        material,
        quantityKg: parsedQty,
        condition: condition.trim(),
        location: location.trim(),
        sourceUnit: sourceUnit.trim(),
        notes: notes.trim(),
        evidenceNote: evidenceNote.trim() || undefined,
      });
      setSelectedBatchId(editingId);
    } else {
      const created = createBatch({
        title: title.trim(),
        material,
        quantityKg: parsedQty,
        condition: condition.trim(),
        location: location.trim(),
        sourceUnit: sourceUnit.trim(),
        createdBy: createdBy.trim(),
        notes: notes.trim(),
        evidenceNote: evidenceNote.trim() || undefined,
      });
      setSelectedBatchId(created.id);
    }
    setFormOpen(false);
    setEditingId(null);
  };

  const filteredBatches = useMemo(() => {
    const q = search.trim().toLowerCase();
    const list = batches.filter((b) => {
      if (statusFilter !== 'All' && b.status !== statusFilter) return false;
      if (materialFilter !== 'All' && b.material !== materialFilter) return false;
      if (!q) return true;
      return (
        b.id.toLowerCase().includes(q) ||
        b.title.toLowerCase().includes(q) ||
        b.material.toLowerCase().includes(q) ||
        b.location.toLowerCase().includes(q) ||
        b.condition.toLowerCase().includes(q)
      );
    });

    return [...list].sort((a, b) => {
      if (sortBy === 'qty_desc') return b.quantityKg - a.quantityKg;
      if (sortBy === 'qty_asc') return a.quantityKg - b.quantityKg;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [batches, search, statusFilter, materialFilter, sortBy]);

  const selectedBatch =
    batches.find((b) => b.id === selectedBatchId) ?? filteredBatches[0] ?? null;

  const partnerMatches = useMemo<PartnerMatchEvaluation[]>(() => {
    if (!selectedBatch) return [];
    return evaluatePartnerMatches(selectedBatch);
  }, [selectedBatch]);

  return (
    <main className="max-w-[1280px] mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#E2DDD3] dark:border-[#24352E] pb-6">
        <div className="space-y-1.5 max-w-2xl">
          <p className="text-xs font-medium text-[#0F8A5F] dark:text-[#22B57E]">
            Waste Marketplace & Explainable Partner Matching
          </p>
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[#133C2C] dark:text-[#F2F5F3]">
            List batches, inspect match criteria, and advance demo workflows.
          </h1>
          <p className="text-sm text-[#546059] dark:text-[#A4B5AC]">
            Every listing generates a unique WW-XXXX Digital Waste Passport. Partner profiles shown
            are clearly labelled Demo Partners—not live commercial bids.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateForm}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold bg-[#133C2C] text-white hover:bg-[#0F8A5F] dark:bg-[#22B57E] dark:text-[#0B1310] transition-colors cursor-pointer self-start md:self-auto whitespace-nowrap shrink-0"
        >
          <Plus className="w-4 h-4" aria-hidden="true" />
          <span>Create Listing</span>
        </button>
      </div>

      {/* Create / Edit Form Drawer */}
      {formOpen && (
        <section
          aria-label={editingId ? 'Edit material listing' : 'Create material listing'}
          className="rounded-xl border border-[#0F8A5F]/40 dark:border-[#22B57E]/40 bg-white dark:bg-[#111C17] p-6 space-y-5"
        >
          <div className="flex items-center justify-between border-b border-[#E2DDD3] dark:border-[#24352E] pb-3.5">
            <h2 className="font-display text-lg font-semibold text-[#133C2C] dark:text-[#F2F5F3]">
              {editingId ? `Edit Listing ${editingId}` : 'Create New Material Listing'}
            </h2>
            <button
              type="button"
              onClick={() => setFormOpen(false)}
              aria-label="Close listing form"
              className="p-1.5 rounded-md hover:bg-[#F2EFE9] dark:hover:bg-[#17251F] text-[#546059] cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSubmitForm} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label
                htmlFor="listing-title"
                className="block text-xs font-semibold text-[#1B201D] dark:text-[#F2F5F3] mb-1"
              >
                Batch Title *
              </label>
              <input
                id="listing-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Mailroom Flattened Cardboard Cartons"
                className="w-full rounded-lg border border-[#E2DDD3] dark:border-[#24352E] bg-[#FAF8F4] dark:bg-[#0B1310] px-3 py-2 text-sm text-[#1B201D] dark:text-[#F2F5F3]"
              />
            </div>

            <div>
              <label
                htmlFor="listing-material"
                className="block text-xs font-semibold text-[#1B201D] dark:text-[#F2F5F3] mb-1"
              >
                Material Category *
              </label>
              <select
                id="listing-material"
                value={material}
                onChange={(e) => setMaterial(e.target.value as MaterialCategory)}
                className="w-full rounded-lg border border-[#E2DDD3] dark:border-[#24352E] bg-[#FAF8F4] dark:bg-[#0B1310] px-3 py-2 text-sm text-[#1B201D] dark:text-[#F2F5F3]"
              >
                {MATERIAL_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="listing-qty"
                className="block text-xs font-semibold text-[#1B201D] dark:text-[#F2F5F3] mb-1"
              >
                Estimated Quantity (kg) *
              </label>
              <input
                id="listing-qty"
                type="number"
                min="0.5"
                step="0.5"
                value={quantityKg}
                onChange={(e) => setQuantityKg(e.target.value)}
                className="w-full rounded-lg border border-[#E2DDD3] dark:border-[#24352E] bg-[#FAF8F4] dark:bg-[#0B1310] px-3 py-2 text-sm font-mono tabular-nums text-[#1B201D] dark:text-[#F2F5F3]"
              />
            </div>

            <div>
              <label
                htmlFor="listing-condition"
                className="block text-xs font-semibold text-[#1B201D] dark:text-[#F2F5F3] mb-1"
              >
                Condition & Prep *
              </label>
              <input
                id="listing-condition"
                type="text"
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                placeholder="e.g., Dry, flattened, tape removed"
                className="w-full rounded-lg border border-[#E2DDD3] dark:border-[#24352E] bg-[#FAF8F4] dark:bg-[#0B1310] px-3 py-2 text-sm text-[#1B201D] dark:text-[#F2F5F3]"
              />
            </div>

            <div>
              <label
                htmlFor="listing-location"
                className="block text-xs font-semibold text-[#1B201D] dark:text-[#F2F5F3] mb-1"
              >
                Pickup Location *
              </label>
              <input
                id="listing-location"
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g., North Campus · Block B"
                className="w-full rounded-lg border border-[#E2DDD3] dark:border-[#24352E] bg-[#FAF8F4] dark:bg-[#0B1310] px-3 py-2 text-sm text-[#1B201D] dark:text-[#F2F5F3]"
              />
            </div>

            <div>
              <label
                htmlFor="listing-source"
                className="block text-xs font-semibold text-[#1B201D] dark:text-[#F2F5F3] mb-1"
              >
                Source Department / Unit
              </label>
              <input
                id="listing-source"
                type="text"
                value={sourceUnit}
                onChange={(e) => setSourceUnit(e.target.value)}
                className="w-full rounded-lg border border-[#E2DDD3] dark:border-[#24352E] bg-[#FAF8F4] dark:bg-[#0B1310] px-3 py-2 text-sm text-[#1B201D] dark:text-[#F2F5F3]"
              />
            </div>

            <div>
              <label
                htmlFor="listing-creator"
                className="block text-xs font-semibold text-[#1B201D] dark:text-[#F2F5F3] mb-1"
              >
                Recorded By
              </label>
              <input
                id="listing-creator"
                type="text"
                value={createdBy}
                onChange={(e) => setCreatedBy(e.target.value)}
                className="w-full rounded-lg border border-[#E2DDD3] dark:border-[#24352E] bg-[#FAF8F4] dark:bg-[#0B1310] px-3 py-2 text-sm text-[#1B201D] dark:text-[#F2F5F3]"
              />
            </div>

            <div>
              <label
                htmlFor="listing-evidence"
                className="block text-xs font-semibold text-[#1B201D] dark:text-[#F2F5F3] mb-1"
              >
                Optional Evidence Note
              </label>
              <input
                id="listing-evidence"
                type="text"
                value={evidenceNote}
                onChange={(e) => setEvidenceNote(e.target.value)}
                placeholder="e.g., Weighed on mailroom platform scale"
                className="w-full rounded-lg border border-[#E2DDD3] dark:border-[#24352E] bg-[#FAF8F4] dark:bg-[#0B1310] px-3 py-2 text-sm text-[#1B201D] dark:text-[#F2F5F3]"
              />
            </div>

            <div className="sm:col-span-2 lg:col-span-3">
              <label
                htmlFor="listing-notes"
                className="block text-xs font-semibold text-[#1B201D] dark:text-[#F2F5F3] mb-1"
              >
                Additional Handling Notes
              </label>
              <textarea
                id="listing-notes"
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Access hours, pallet availability, or contamination checks..."
                className="w-full rounded-lg border border-[#E2DDD3] dark:border-[#24352E] bg-[#FAF8F4] dark:bg-[#0B1310] px-3 py-2 text-sm text-[#1B201D] dark:text-[#F2F5F3]"
              />
            </div>

            {formError && (
              <div className="sm:col-span-2 lg:col-span-3 text-xs text-red-700 dark:text-red-400">
                {formError}
              </div>
            )}

            <div className="sm:col-span-2 lg:col-span-3 flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setFormOpen(false)}
                className="px-4 py-2 rounded-lg text-xs sm:text-sm font-medium border border-[#E2DDD3] dark:border-[#24352E] text-[#1B201D] dark:text-[#F2F5F3] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-lg text-xs sm:text-sm font-semibold bg-[#133C2C] text-white hover:bg-[#0F8A5F] dark:bg-[#22B57E] dark:text-[#0B1310] cursor-pointer"
              >
                {editingId ? 'Save Changes' : 'Publish Listing & Generate Passport'}
              </button>
            </div>
          </form>
        </section>
      )}

      {/* Search, Filter & Sort Controls */}
      <section className="rounded-xl border border-[#E2DDD3] dark:border-[#24352E] bg-white dark:bg-[#111C17] p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-center">
        <div className="lg:col-span-5 relative">
          <Search
            className="w-4 h-4 text-[#546059] dark:text-[#A4B5AC] absolute left-3 top-1/2 -translate-y-1/2"
            aria-hidden="true"
          />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Batch ID (WW-0001), material, or location..."
            aria-label="Search marketplace listings"
            className="w-full rounded-lg border border-[#E2DDD3] dark:border-[#24352E] bg-[#FAF8F4] dark:bg-[#0B1310] pl-9 pr-3 py-2 text-xs sm:text-sm text-[#1B201D] dark:text-[#F2F5F3]"
          />
        </div>

        <div className="lg:col-span-3">
          <select
            aria-label="Filter by material"
            value={materialFilter}
            onChange={(e) => setMaterialFilter(e.target.value as 'All' | MaterialCategory)}
            className="w-full rounded-lg border border-[#E2DDD3] dark:border-[#24352E] bg-[#FAF8F4] dark:bg-[#0B1310] px-3 py-2 text-xs sm:text-sm text-[#1B201D] dark:text-[#F2F5F3]"
          >
            <option value="All">All Materials</option>
            {MATERIAL_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="lg:col-span-2">
          <select
            aria-label="Filter by status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as 'All' | BatchStatus)}
            className="w-full rounded-lg border border-[#E2DDD3] dark:border-[#24352E] bg-[#FAF8F4] dark:bg-[#0B1310] px-3 py-2 text-xs sm:text-sm text-[#1B201D] dark:text-[#F2F5F3]"
          >
            <option value="All">All Statuses</option>
            <option value="Listed">Listed</option>
            <option value="Matched">Matched</option>
            <option value="Collection recorded">Collection recorded</option>
            <option value="Destination recorded">Destination recorded</option>
          </select>
        </div>

        <div className="lg:col-span-2">
          <select
            aria-label="Sort listings"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortKey)}
            className="w-full rounded-lg border border-[#E2DDD3] dark:border-[#24352E] bg-[#FAF8F4] dark:bg-[#0B1310] px-3 py-2 text-xs sm:text-sm text-[#1B201D] dark:text-[#F2F5F3]"
          >
            <option value="newest">Newest First</option>
            <option value="qty_desc">Highest Weight (kg)</option>
            <option value="qty_asc">Lowest Weight (kg)</option>
          </select>
        </div>
      </section>

      {/* Main Split: Listings List (Left) + Explainable Partner Match Panel (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Listings */}
        <div className="lg:col-span-7 space-y-3">
          {filteredBatches.length === 0 ? (
            <div className="rounded-xl border border-[#E2DDD3] dark:border-[#24352E] bg-white dark:bg-[#111C17] p-8 text-center space-y-3">
              <p className="font-display text-base font-semibold text-[#1B201D] dark:text-[#F2F5F3]">
                No listings match your current filters
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearch('');
                  setStatusFilter('All');
                  setMaterialFilter('All');
                }}
                className="px-4 py-2 rounded-lg text-xs font-semibold border border-[#E2DDD3] dark:border-[#24352E] cursor-pointer"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            filteredBatches.map((batch) => {
              const isSelected = selectedBatch?.id === batch.id;
              return (
                <div
                  key={batch.id}
                  onClick={() => setSelectedBatchId(batch.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setSelectedBatchId(batch.id);
                    }
                  }}
                  className={`rounded-xl border p-5 transition-colors cursor-pointer space-y-3 ${
                    isSelected
                      ? 'border-[#0F8A5F] dark:border-[#22B57E] bg-white dark:bg-[#111C17]'
                      : 'border-[#E2DDD3] dark:border-[#24352E] bg-white/80 dark:bg-[#111C17]/80 hover:border-[#0F8A5F]/50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 text-xs text-[#546059] dark:text-[#A4B5AC]">
                        <span className="font-mono font-semibold text-[#0F8A5F] dark:text-[#22B57E]">
                          {batch.id}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>{batch.material}</span>
                        <span aria-hidden="true">·</span>
                        <span>{batch.isDemo ? 'Demo Data' : 'User Record'}</span>
                      </div>
                      <h2 className="font-display text-base sm:text-lg font-semibold text-[#1B201D] dark:text-[#F2F5F3]">
                        {batch.title}
                      </h2>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="font-mono text-base font-bold text-[#133C2C] dark:text-[#F2F5F3] tabular-nums">
                        {batch.quantityKg} kg
                      </div>
                      <div className="text-xs font-medium text-[#0F8A5F] dark:text-[#22B57E]">
                        {batch.status}
                      </div>
                    </div>
                  </div>

                  <div className="text-xs text-[#546059] dark:text-[#A4B5AC] flex flex-wrap items-center gap-x-3 gap-y-1">
                    <span>Location: {batch.location}</span>
                    <span aria-hidden="true">·</span>
                    <span>Condition: {batch.condition}</span>
                    <span aria-hidden="true">·</span>
                    <span>Listed {formatShortDate(batch.createdAt)}</span>
                  </div>

                  <div
                    className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-[#E2DDD3] dark:border-[#24352E]"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      type="button"
                      onClick={() => openPassport(batch.id)}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0F8A5F] dark:text-[#22B57E] hover:underline cursor-pointer"
                    >
                      <span>Open Waste Passport</span>
                      <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => openEditForm(batch)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium border border-[#E2DDD3] dark:border-[#24352E] text-[#1B201D] dark:text-[#F2F5F3] hover:border-[#0F8A5F] cursor-pointer"
                      >
                        <Pencil className="w-3 h-3" aria-hidden="true" />
                        <span>Edit</span>
                      </button>

                      {confirmDeleteId === batch.id ? (
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              deleteBatch(batch.id);
                              setConfirmDeleteId(null);
                            }}
                            className="px-2.5 py-1.5 rounded-md text-xs font-semibold bg-red-600 text-white cursor-pointer"
                          >
                            Confirm Delete
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteId(null)}
                            className="px-2 py-1.5 text-xs text-[#546059] cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setConfirmDeleteId(batch.id)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium border border-[#E2DDD3] dark:border-[#24352E] text-[#546059] dark:text-[#A4B5AC] hover:text-red-600 hover:border-red-300 cursor-pointer"
                        >
                          <Trash2 className="w-3 h-3" aria-hidden="true" />
                          <span>Delete</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right: Explainable Partner Match Panel */}
        <aside className="lg:col-span-5 rounded-xl border border-[#E2DDD3] dark:border-[#24352E] bg-white dark:bg-[#111C17] p-6 space-y-5 lg:sticky lg:top-24">
          {selectedBatch ? (
            <>
              <div className="space-y-1 border-b border-[#E2DDD3] dark:border-[#24352E] pb-4">
                <div className="flex items-center justify-between gap-2 text-xs text-[#546059] dark:text-[#A4B5AC]">
                  <span className="font-mono font-semibold text-[#0F8A5F] dark:text-[#22B57E]">
                    {selectedBatch.id} · Match Inspector
                  </span>
                  <span>{selectedBatch.status}</span>
                </div>
                <h2 className="font-display text-lg font-bold text-[#133C2C] dark:text-[#F2F5F3]">
                  Potential Partners for {selectedBatch.material}
                </h2>
                <p className="text-xs text-[#546059] dark:text-[#A4B5AC] leading-relaxed">
                  Matches evaluate material category, batch weight ({selectedBatch.quantityKg} kg),
                  location, and stated condition. Profiles below are{' '}
                  <strong className="text-[#1B201D] dark:text-[#F2F5F3]">
                    Demo Partner Profiles
                  </strong>
                  —not live verified businesses or active offers.
                </p>
              </div>

              {selectedBatch.match && (
                <div className="rounded-lg border border-[#0F8A5F]/40 dark:border-[#22B57E]/40 bg-[#0F8A5F]/8 dark:bg-[#22B57E]/10 p-4 space-y-2">
                  <div className="flex items-center justify-between gap-2 text-xs font-semibold text-[#0F8A5F] dark:text-[#22B57E]">
                    <span>Currently Selected Demo Partner</span>
                    <span>Demo Workflow</span>
                  </div>
                  <div className="text-sm font-semibold text-[#1B201D] dark:text-[#F2F5F3]">
                    {selectedBatch.match.partnerName}
                  </div>
                  <div className="text-xs text-[#546059] dark:text-[#A4B5AC]">
                    {selectedBatch.match.partnerType}
                  </div>
                  <button
                    type="button"
                    onClick={() => openPassport(selectedBatch.id)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#133C2C] dark:text-[#22B57E] hover:underline cursor-pointer pt-1"
                  >
                    <span>Continue on Digital Waste Passport</span>
                    <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </button>
                </div>
              )}

              <div>
                <label
                  htmlFor="match-actor"
                  className="block text-xs font-medium text-[#546059] dark:text-[#A4B5AC] mb-1"
                >
                  Coordinator Name (recorded on passport when selecting a match)
                </label>
                <input
                  id="match-actor"
                  type="text"
                  value={matchActor}
                  onChange={(e) => setMatchActor(e.target.value)}
                  className="w-full rounded-lg border border-[#E2DDD3] dark:border-[#24352E] bg-[#FAF8F4] dark:bg-[#0B1310] px-3 py-1.5 text-xs text-[#1B201D] dark:text-[#F2F5F3]"
                />
              </div>

              <div className="space-y-4">
                {partnerMatches.map((evalItem) => {
                  const isChosen =
                    selectedBatch.match?.partnerId === evalItem.partner.id;
                  const canAdvance = selectedBatch.status === 'Created' || selectedBatch.status === 'Listed';

                  return (
                    <div
                      key={evalItem.partner.id}
                      className="rounded-lg border border-[#E2DDD3] dark:border-[#24352E] bg-[#FAF8F4] dark:bg-[#17251F]/70 p-4 space-y-3"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="text-[11px] font-medium text-[#546059] dark:text-[#A4B5AC]">
                            Demo Partner Profile · {evalItem.fitTier}
                          </div>
                          <h3 className="font-display text-sm sm:text-base font-semibold text-[#1B201D] dark:text-[#F2F5F3]">
                            {evalItem.partner.name}
                          </h3>
                          <div className="text-xs text-[#546059] dark:text-[#A4B5AC]">
                            {evalItem.partner.partnerType} · {evalItem.partner.cityArea}
                          </div>
                        </div>
                        <MaterialIcon
                          material={selectedBatch.material}
                          className="w-4 h-4 text-[#0F8A5F] dark:text-[#22B57E] shrink-0"
                        />
                      </div>

                      <div className="space-y-1.5 text-xs">
                        <div className="font-semibold text-[#133C2C] dark:text-[#22B57E]">
                          Why this match is suggested
                        </div>
                        {evalItem.reasons.map((r) => (
                          <div
                            key={r}
                            className="flex items-start gap-1.5 text-[#1B201D] dark:text-[#DCE4DF]"
                          >
                            <CheckCircle2
                              className="w-3.5 h-3.5 text-[#0F8A5F] dark:text-[#22B57E] shrink-0 mt-0.5"
                              aria-hidden="true"
                            />
                            <span>{r}</span>
                          </div>
                        ))}
                        {evalItem.caveats.map((c) => (
                          <div
                            key={c}
                            className="flex items-start gap-1.5 text-amber-800 dark:text-amber-300"
                          >
                            <AlertTriangle
                              className="w-3.5 h-3.5 shrink-0 mt-0.5"
                              aria-hidden="true"
                            />
                            <span>{c}</span>
                          </div>
                        ))}
                      </div>

                      <div className="text-[11px] text-[#546059] dark:text-[#A4B5AC] border-t border-[#E2DDD3] dark:border-[#24352E] pt-2">
                        Acceptance rules: {evalItem.partner.acceptanceCriteria.join(' · ')}
                      </div>

                      <div className="flex items-center justify-between gap-2 pt-1">
                        {canAdvance ? (
                          <button
                            type="button"
                            onClick={() =>
                              matchBatchWithPartner(selectedBatch.id, evalItem, matchActor)
                            }
                            className="w-full inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold bg-[#133C2C] text-white hover:bg-[#0F8A5F] dark:bg-[#22B57E] dark:text-[#0B1310] transition-colors cursor-pointer whitespace-nowrap"
                          >
                            <span>Select Demo Partner & Advance</span>
                            <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => openPassport(selectedBatch.id)}
                            className="w-full inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold border border-[#E2DDD3] dark:border-[#24352E] text-[#1B201D] dark:text-[#F2F5F3] hover:border-[#0F8A5F] cursor-pointer whitespace-nowrap"
                          >
                            <span>
                              {isChosen
                                ? 'Selected · Open Waste Passport'
                                : `Status is "${selectedBatch.status}" · Open Passport`}
                            </span>
                            <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <p className="text-sm text-[#546059] dark:text-[#A4B5AC]">
              Select a listing on the left to inspect explainable partner matches.
            </p>
          )}
        </aside>
      </div>
    </main>
  );
}
