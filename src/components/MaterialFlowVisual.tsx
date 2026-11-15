import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { MATERIAL_GUIDES } from '../data/materials';
import { MaterialIcon } from './MaterialIcon';
import { useWasteStore } from '../store/wasteStore';
import type { MaterialCategory } from '../types/waste';

const DESTINATION_NODES: Record<MaterialCategory, { dest: string; prep: string; batchRef: string }> = {
  Cardboard: {
    dest: 'Linerboard & Box Mill',
    prep: 'Flattened, dry, tape removed',
    batchRef: 'WW-0001',
  },
  Newspaper: {
    dest: 'De-Inking & Molded Pulp Plant',
    prep: 'Bundled dry, glossy inserts separated',
    batchRef: 'WW-0004',
  },
  'PET beverage bottles': {
    dest: 'rPET Wash & Flake Line',
    prep: 'Drained, crushed, #1 resin sorted',
    batchRef: 'WW-0002',
  },
  'HDPE plastic': {
    dest: 'Rigid Polymer Regrind Yard',
    prep: 'Triple-rinsed, non-hazardous #2',
    batchRef: 'WW-0005',
  },
  'Aluminium cans': {
    dest: 'Secondary Aluminium Smelter',
    prep: 'Drained, crushed, magnet-checked',
    batchRef: 'WW-0003',
  },
  'Iron and steel': {
    dest: 'Licensed Ferrous Scrap Foundry',
    prep: 'Magnet-verified, non-metal stripped',
    batchRef: 'Sample Route',
  },
};

export function MaterialFlowVisual() {
  const { openMaterialStory } = useWasteStore();
  const [activeId, setActiveId] = useState<MaterialCategory>('Cardboard');
  const activeGuide = MATERIAL_GUIDES.find((m) => m.id === activeId) ?? MATERIAL_GUIDES[0];
  const routeInfo = DESTINATION_NODES[activeId];

  return (
    <div className="h-full rounded-xl border border-[#E2DDD3] dark:border-[#24352E] bg-white dark:bg-[#111C17] p-5 sm:p-6 flex flex-col justify-between gap-5">
      <div className="flex items-center justify-between gap-4 border-b border-[#E2DDD3] dark:border-[#24352E] pb-3.5">
        <div>
          <p className="text-xs font-medium text-[#0F8A5F] dark:text-[#22B57E]">
            Interactive Material Routing Map
          </p>
          <p className="text-sm font-semibold text-[#1B201D] dark:text-[#F2F5F3]">
            Select a waste stream to trace its next destination
          </p>
        </div>
        <span className="font-mono text-xs text-[#546059] dark:text-[#A4B5AC] tabular-nums shrink-0">
          6 streams
        </span>
      </div>

      {/* Three-column visual network: Material Cards -> Passport Node -> Destination */}
      <div className="relative grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
        {/* Left: 6 Glowing Material Cards */}
        <div className="sm:col-span-5 grid grid-cols-2 sm:grid-cols-1 gap-2">
          {MATERIAL_GUIDES.map((mat) => {
            const selected = mat.id === activeId;
            return (
              <button
                key={mat.id}
                type="button"
                onClick={() => setActiveId(mat.id)}
                onMouseEnter={() => setActiveId(mat.id)}
                className={`group flex items-center gap-2.5 px-3 py-2.5 rounded-lg border text-left transition-all duration-150 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F8A5F] ${
                  selected
                    ? 'border-[#0F8A5F] dark:border-[#22B57E] bg-[#0F8A5F]/8 dark:bg-[#22B57E]/12 shadow-[0_0_20px_rgba(15,138,95,0.14)]'
                    : 'border-[#E2DDD3] dark:border-[#24352E] bg-[#FAF8F4] dark:bg-[#17251F]/60 hover:border-[#0F8A5F]/50'
                }`}
              >
                <span
                  className={`flex items-center justify-center w-7 h-7 rounded-md shrink-0 transition-colors ${
                    selected
                      ? 'bg-[#133C2C] text-white dark:bg-[#22B57E] dark:text-[#0B1310]'
                      : 'bg-white dark:bg-[#111C17] text-[#546059] dark:text-[#A4B5AC]'
                  }`}
                >
                  <MaterialIcon material={mat.id} className="w-4 h-4" />
                </span>
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-[#1B201D] dark:text-[#F2F5F3] truncate">
                    {mat.shortName}
                  </div>
                  <div className="text-[11px] text-[#546059] dark:text-[#A4B5AC] truncate">
                    {mat.resinOrGrade.split('·')[0].trim()}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Center: Subtle Animated Connecting Lines + Passport Node */}
        <div className="sm:col-span-3 flex flex-col items-center justify-center py-2">
          <svg
            viewBox="0 0 120 72"
            className="w-24 h-12 hidden sm:block text-[#0F8A5F] dark:text-[#22B57E]"
            aria-hidden="true"
          >
            <path
              d="M 4 36 C 36 36, 40 36, 60 36 C 80 36, 84 36, 116 36"
              fill="none"
              stroke="currentColor"
              strokeOpacity="0.22"
              strokeWidth="2"
            />
            <motion.path
              key={activeId}
              d="M 4 36 C 36 36, 40 36, 60 36 C 80 36, 84 36, 116 36"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeDasharray="6 6"
              initial={{ strokeDashoffset: 24, opacity: 0.4 }}
              animate={{ strokeDashoffset: 0, opacity: 1 }}
              transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }}
            />
          </svg>

          <motion.div
            key={`hub-${activeId}`}
            initial={{ opacity: 0.85, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.18 }}
            className="w-full rounded-lg border border-[#0F8A5F]/40 dark:border-[#22B57E]/40 bg-[#133C2C] text-white dark:bg-[#17251F] p-3 text-center"
          >
            <div className="font-mono text-[11px] text-[#8CE2BE] tracking-tight">
              {routeInfo.batchRef}
            </div>
            <div className="text-xs font-semibold mt-0.5">Waste Passport</div>
            <div className="text-[11px] text-white/75 mt-1 leading-snug">
              Prep → Match → Track
            </div>
          </motion.div>
        </div>

        {/* Right: Next Chapter Destination Card */}
        <div className="sm:col-span-4">
          <motion.div
            key={`dest-${activeId}`}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="rounded-lg border border-[#E2DDD3] dark:border-[#24352E] bg-[#FAF8F4] dark:bg-[#17251F] p-4 space-y-3"
          >
            <div>
              <div className="text-[11px] font-medium text-[#0F8A5F] dark:text-[#22B57E]">
                Potential Next Destination
              </div>
              <div className="font-display text-base font-semibold text-[#1B201D] dark:text-[#F2F5F3] mt-0.5">
                {routeInfo.dest}
              </div>
            </div>

            <div className="border-t border-[#E2DDD3] dark:border-[#24352E] pt-2.5 space-y-1.5 text-xs">
              <div className="text-[#546059] dark:text-[#A4B5AC]">
                <span className="font-semibold text-[#1B201D] dark:text-[#F2F5F3]">
                  Required prep:
                </span>{' '}
                {routeInfo.prep}
              </div>
              <div className="text-[#546059] dark:text-[#A4B5AC]">
                <span className="font-semibold text-[#1B201D] dark:text-[#F2F5F3]">
                  Grade:
                </span>{' '}
                {activeGuide.resinOrGrade}
              </div>
            </div>

            <button
              type="button"
              onClick={() => openMaterialStory(activeId)}
              className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-md text-xs font-semibold bg-[#133C2C] text-white hover:bg-[#0F8A5F] dark:bg-[#22B57E] dark:text-[#0B1310] transition-colors cursor-pointer whitespace-nowrap"
            >
              <span>Inspect {activeGuide.shortName} Story</span>
              <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
          </motion.div>
        </div>
      </div>

      <p className="text-[11px] text-[#546059] dark:text-[#A4B5AC] border-t border-[#E2DDD3] dark:border-[#24352E] pt-3">
        Routes depend on local buyer acceptance, batch cleanliness, and minimum quantity.
      </p>
    </div>
  );
}
