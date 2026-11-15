import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { INITIAL_DEMO_BATCHES } from '../data/demoBatches';
import type { PartnerMatchEvaluation } from '../data/partners';
import type {
  AppSection,
  CollectionDetails,
  DestinationDetails,
  MaterialCategory,
  WasteBatch,
} from '../types/waste';

const STORAGE_KEY = 'wasteworth_batches_v1';
const THEME_KEY = 'wasteworth_theme_v1';

export interface CreateBatchInput {
  title: string;
  material: MaterialCategory;
  quantityKg: number;
  condition: string;
  location: string;
  sourceUnit: string;
  createdBy: string;
  notes: string;
  evidenceNote?: string;
}

export interface UpdateBatchInput {
  title?: string;
  material?: MaterialCategory;
  quantityKg?: number;
  condition?: string;
  location?: string;
  sourceUnit?: string;
  notes?: string;
  evidenceNote?: string;
}

interface WasteContextValue {
  batches: WasteBatch[];
  activeSection: AppSection;
  setActiveSection: (section: AppSection) => void;
  selectedMaterial: MaterialCategory;
  setSelectedMaterial: (material: MaterialCategory) => void;
  selectedPassportId: string;
  setSelectedPassportId: (id: string) => void;
  listingPrefill: Partial<CreateBatchInput> | null;
  setListingPrefill: (draft: Partial<CreateBatchInput> | null) => void;
  assistantPrefill: string;
  setAssistantPrefill: (prompt: string) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  toast: { type: 'success' | 'error' | 'info'; message: string } | null;
  showToast: (type: 'success' | 'error' | 'info', message: string) => void;
  clearToast: () => void;
  createBatch: (input: CreateBatchInput) => WasteBatch;
  updateBatch: (id: string, patch: UpdateBatchInput) => void;
  deleteBatch: (id: string) => void;
  matchBatchWithPartner: (
    batchId: string,
    evaluation: PartnerMatchEvaluation,
    actor: string
  ) => void;
  recordCollection: (batchId: string, details: CollectionDetails) => void;
  recordDestination: (batchId: string, details: DestinationDetails) => void;
  resetDemoData: () => void;
  openMaterialStory: (material: MaterialCategory) => void;
  openCreateListingForMaterial: (material: MaterialCategory, notes?: string) => void;
  openPassport: (batchId: string) => void;
  openAssistantWithPrompt: (prompt: string) => void;
}

const WasteContext = createContext<WasteContextValue | null>(null);

function loadStoredBatches(): WasteBatch[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL_DEMO_BATCHES;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return INITIAL_DEMO_BATCHES;
    }
    return parsed as WasteBatch[];
  } catch {
    return INITIAL_DEMO_BATCHES;
  }
}

function generateNextBatchId(batches: WasteBatch[]): string {
  let maxNum = 0;
  for (const b of batches) {
    const match = /^WW-(\d+)$/.exec(b.id);
    if (match) {
      const n = Number(match[1]);
      if (Number.isFinite(n) && n > maxNum) {
        maxNum = n;
      }
    }
  }
  const next = maxNum + 1;
  return `WW-${String(next).padStart(4, '0')}`;
}

export function WasteProvider({ children }: { children: React.ReactNode }) {
  const [batches, setBatches] = useState<WasteBatch[]>(() => loadStoredBatches());
  const [activeSection, setActiveSection] = useState<AppSection>('landing');
  const [selectedMaterial, setSelectedMaterial] = useState<MaterialCategory>('Cardboard');
  const [selectedPassportId, setSelectedPassportId] = useState<string>('WW-0001');
  const [listingPrefill, setListingPrefill] = useState<Partial<CreateBatchInput> | null>(null);
  const [assistantPrefill, setAssistantPrefill] = useState<string>('');
  const [toast, setToast] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(
    null
  );

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try {
      const saved = window.localStorage.getItem(THEME_KEY);
      if (saved === 'dark' || saved === 'light') return saved;
    } catch {
      // ignore storage errors
    }
    return 'light';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    try {
      window.localStorage.setItem(THEME_KEY, theme);
    } catch {
      // ignore
    }
  }, [theme]);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(batches));
    } catch {
      // ignore quota failures gracefully
    }
  }, [batches]);

  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(null), 4500);
    return () => window.clearTimeout(t);
  }, [toast]);

  const showToast = (type: 'success' | 'error' | 'info', message: string) => {
    setToast({ type, message });
  };

  const clearToast = () => setToast(null);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const createBatch = (input: CreateBatchInput): WasteBatch => {
    const now = new Date().toISOString();
    const id = generateNextBatchId(batches);
    const actor = input.createdBy.trim() || 'Campus Coordinator';
    const createdBatch: WasteBatch = {
      id,
      title: input.title.trim(),
      material: input.material,
      quantityKg: Number(input.quantityKg),
      unit: 'kg',
      condition: input.condition.trim(),
      location: input.location.trim(),
      sourceUnit: input.sourceUnit.trim() || 'Campus Collection Point',
      createdAt: now,
      createdBy: actor,
      status: 'Listed',
      isDemo: false,
      notes: input.notes.trim(),
      evidenceNote: input.evidenceNote?.trim() || undefined,
      history: [
        {
          id: `evt-${id}-1`,
          stage: 'Created',
          timestamp: now,
          actor,
          note: `Batch ${id} created (${input.quantityKg} kg ${input.material}).`,
        },
        {
          id: `evt-${id}-2`,
          stage: 'Listed',
          timestamp: now,
          actor,
          note: `Published listing to WasteWorth Marketplace from ${input.location.trim()}.`,
        },
      ],
    };

    setBatches((prev) => [createdBatch, ...prev]);

    showToast('success', `Batch ${createdBatch.id} created and listed.`);
    return createdBatch;
  };

  const updateBatch = (id: string, patch: UpdateBatchInput) => {
    const now = new Date().toISOString();
    setBatches((prev) =>
      prev.map((b) => {
        if (b.id !== id) return b;
        return {
          ...b,
          ...patch,
          quantityKg: patch.quantityKg !== undefined ? Number(patch.quantityKg) : b.quantityKg,
          history: [
            ...b.history,
            {
              id: `evt-${id}-${Date.now()}`,
              stage: b.status,
              timestamp: now,
              actor: b.createdBy,
              note: 'Listing details updated by user.',
            },
          ],
        };
      })
    );
    showToast('success', `Updated batch ${id}.`);
  };

  const deleteBatch = (id: string) => {
    setBatches((prev) => {
      const next = prev.filter((b) => b.id !== id);
      if (selectedPassportId === id && next.length > 0) {
        setSelectedPassportId(next[0].id);
      }
      return next;
    });
    showToast('info', `Removed listing ${id}.`);
  };

  const matchBatchWithPartner = (
    batchId: string,
    evaluation: PartnerMatchEvaluation,
    actor: string
  ) => {
    const now = new Date().toISOString();
    setBatches((prev) =>
      prev.map((b) => {
        if (b.id !== batchId) return b;
        return {
          ...b,
          status: 'Matched',
          match: {
            partnerId: evaluation.partner.id,
            partnerName: evaluation.partner.name,
            partnerType: evaluation.partner.partnerType,
            isDemoPartner: evaluation.partner.isDemoPartner,
            matchedAt: now,
            reasons: evaluation.reasons,
          },
          history: [
            ...b.history,
            {
              id: `evt-${batchId}-${Date.now()}`,
              stage: 'Matched',
              timestamp: now,
              actor: actor.trim() || 'Campus Coordinator',
              note: `Selected demo partner ${evaluation.partner.name} (${evaluation.fitTier}).`,
            },
          ],
        };
      })
    );
    showToast('success', `Batch ${batchId} matched with ${evaluation.partner.name} (Demo Partner).`);
  };

  const recordCollection = (batchId: string, details: CollectionDetails) => {
    setBatches((prev) =>
      prev.map((b) => {
        if (b.id !== batchId) return b;
        return {
          ...b,
          status: 'Collection recorded',
          collection: details,
          history: [
            ...b.history,
            {
              id: `evt-${batchId}-${Date.now()}`,
              stage: 'Collection recorded',
              timestamp: details.recordedAt,
              actor: details.collectorName,
              note: details.pickupNotes,
            },
          ],
        };
      })
    );
    showToast('success', `Collection recorded on passport ${batchId}.`);
  };

  const recordDestination = (batchId: string, details: DestinationDetails) => {
    setBatches((prev) =>
      prev.map((b) => {
        if (b.id !== batchId) return b;
        return {
          ...b,
          status: 'Destination recorded',
          destination: details,
          history: [
            ...b.history,
            {
              id: `evt-${batchId}-${Date.now()}`,
              stage: 'Destination recorded',
              timestamp: details.recordedAt,
              actor: details.recordedBy,
              note: `Destination logged: ${details.facilityName} (${details.destinationType}). Ref: ${details.intakeReference || 'N/A'}.`,
            },
          ],
        };
      })
    );
    showToast('success', `Destination details recorded for ${batchId}.`);
  };

  const resetDemoData = () => {
    setBatches(INITIAL_DEMO_BATCHES);
    setSelectedPassportId('WW-0001');
    setListingPrefill(null);
    showToast('info', 'Demo records restored to initial baseline (WW-0001 to WW-0005).');
  };

  const openMaterialStory = (material: MaterialCategory) => {
    setSelectedMaterial(material);
    setActiveSection('materials');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openCreateListingForMaterial = (material: MaterialCategory, notes?: string) => {
    setListingPrefill({
      material,
      notes: notes || '',
      title: `${material} Campus Batch`,
    });
    setActiveSection('marketplace');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openPassport = (batchId: string) => {
    setSelectedPassportId(batchId);
    setActiveSection('passports');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openAssistantWithPrompt = (prompt: string) => {
    setAssistantPrefill(prompt);
    setActiveSection('assistant');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const value = useMemo<WasteContextValue>(
    () => ({
      batches,
      activeSection,
      setActiveSection,
      selectedMaterial,
      setSelectedMaterial,
      selectedPassportId,
      setSelectedPassportId,
      listingPrefill,
      setListingPrefill,
      assistantPrefill,
      setAssistantPrefill,
      theme,
      toggleTheme,
      toast,
      showToast,
      clearToast,
      createBatch,
      updateBatch,
      deleteBatch,
      matchBatchWithPartner,
      recordCollection,
      recordDestination,
      resetDemoData,
      openMaterialStory,
      openCreateListingForMaterial,
      openPassport,
      openAssistantWithPrompt,
    }),
    [batches, activeSection, selectedMaterial, selectedPassportId, listingPrefill, assistantPrefill, theme, toast]
  );

  return <WasteContext.Provider value={value}>{children}</WasteContext.Provider>;
}

export function useWasteStore(): WasteContextValue {
  const ctx = useContext(WasteContext);
  if (!ctx) {
    throw new Error('useWasteStore must be used inside WasteProvider');
  }
  return ctx;
}
