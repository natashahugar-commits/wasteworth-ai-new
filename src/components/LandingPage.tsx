import React, { useState } from 'react';
import {
  ArrowRight,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  RefreshCw,
} from 'lucide-react';
import { RESEARCH_FACTS } from '../data/facts';
import { useWasteStore } from '../store/wasteStore';
import { MaterialFlowVisual } from './MaterialFlowVisual';

const WORKFLOW_STEPS = [
  {
    num: '01',
    title: 'Identify',
    detail: 'Classify cardboard, paper, #1 PET, #2 HDPE, aluminium, or ferrous steel cleanly at source.',
  },
  {
    num: '02',
    title: 'Discover value',
    detail: 'Understand how dryness, resin sorting, and batch volume change buyer acceptance.',
  },
  {
    num: '03',
    title: 'Match',
    detail: 'Evaluate demo buyer profiles using transparent material, weight, and location rules.',
  },
  {
    num: '04',
    title: 'Collect',
    detail: 'Log pickup handoffs with collector details, loading notes, and optional evidence.',
  },
  {
    num: '05',
    title: 'Track destination',
    detail: 'Record reported intake facility details inside a unique WW-XXXX Digital Waste Passport.',
  },
  {
    num: '06',
    title: 'Learn',
    detail: 'Export structured CSV audit trails to refine hostel, lab, and campus sorting habits.',
  },
];

export function LandingPage() {
  const { setActiveSection, openMaterialStory, openPassport } = useWasteStore();
  const [selectedFactIndex, setSelectedFactIndex] = useState(0);
  const [expandedFact, setExpandedFact] = useState(true);

  const activeFact = RESEARCH_FACTS[selectedFactIndex];

  const handleNextFact = () => {
    setSelectedFactIndex((prev) => (prev + 1) % RESEARCH_FACTS.length);
  };

  return (
    <main className="pb-20">
      {/* 1. HERO SECTION */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 pt-10 sm:pt-14 pb-12 sm:pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
          <div className="lg:col-span-6 flex flex-col justify-between gap-8">
            <div className="space-y-5">
              <p className="text-xs sm:text-sm font-medium text-[#0F8A5F] dark:text-[#22B57E]">
                Resource Coordination & Traceability Workspace · Campus & Business Prototype
              </p>

              <h1 className="font-display text-[clamp(2.25rem,4.3vw,3.75rem)] font-bold leading-[1.08] tracking-tight text-[#133C2C] dark:text-[#F2F5F3] text-balance">
                Your Waste Has a Next Chapter.
              </h1>

              <p className="text-base sm:text-lg text-[#1B201D] dark:text-[#DCE4DF] leading-relaxed max-w-xl">
                Discover material value. Find the right next destination. Track every batch in one
                intelligent workspace.
              </p>

              <p className="text-sm sm:text-base text-[#546059] dark:text-[#A4B5AC] leading-relaxed max-w-xl">
                Colleges, hostels, and offices discard clean cardboard, plastics, and metals daily—not
                because they lack value, but because sorting guidance, buyer matching, and handoff
                records live nowhere together.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setActiveSection('dashboard');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-lg text-sm font-semibold bg-[#133C2C] text-white hover:bg-[#0F8A5F] dark:bg-[#22B57E] dark:text-[#0B1310] dark:hover:bg-[#1CA16F] transition-colors cursor-pointer whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F8A5F]"
                >
                  <span>Explore the live demo</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </button>

                <button
                  type="button"
                  onClick={() => openMaterialStory('Cardboard')}
                  className="inline-flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-semibold border border-[#E2DDD3] dark:border-[#24352E] bg-white dark:bg-[#111C17] text-[#1B201D] dark:text-[#F2F5F3] hover:border-[#0F8A5F] transition-colors cursor-pointer whitespace-nowrap"
                >
                  <span>Discover the hidden value</span>
                </button>

                <button
                  type="button"
                  onClick={() => openPassport('WW-0001')}
                  className="inline-flex items-center gap-1.5 px-3 py-3 text-sm font-semibold text-[#0F8A5F] dark:text-[#22B57E] hover:underline underline-offset-4 cursor-pointer whitespace-nowrap"
                >
                  <span>Follow a material’s journey</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <MaterialFlowVisual />
          </div>
        </div>
      </section>

      {/* 2. EDITORIAL TRANSITION & WORKFLOW SECTION */}
      <section className="border-y border-[#E2DDD3] dark:border-[#24352E] bg-[#F2EFE9]/60 dark:bg-[#111C17] py-14 sm:py-16">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2 max-w-2xl">
              <p className="text-xs font-medium text-[#0F8A5F] dark:text-[#22B57E]">
                The Integrated Workflow
              </p>
              <h2 className="font-display text-2xl sm:text-4xl font-bold tracking-tight text-[#133C2C] dark:text-[#F2F5F3] text-balance">
                Before it becomes waste, it is still a resource.
              </h2>
            </div>
            <p className="text-sm text-[#546059] dark:text-[#A4B5AC] max-w-md leading-relaxed">
              WasteWorth AI replaces fragmented spreadsheets and guesswork with one connected
              batch lifecycle—from source sorting to recorded destination.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
            {WORKFLOW_STEPS.map((step) => (
              <div
                key={step.num}
                className="rounded-xl border border-[#E2DDD3] dark:border-[#24352E] bg-white dark:bg-[#17251F]/70 p-4 flex flex-col justify-between gap-3"
              >
                <div className="font-mono text-xs font-semibold text-[#0F8A5F] dark:text-[#22B57E] tabular-nums">
                  {step.num}.
                </div>
                <div className="space-y-1.5">
                  <h3 className="font-display text-base font-semibold text-[#1B201D] dark:text-[#F2F5F3]">
                    {step.title}
                  </h3>
                  <p className="text-xs text-[#546059] dark:text-[#A4B5AC] leading-relaxed">
                    {step.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. THE WASTE INTELLIGENCE LAB ("DID YOU KNOW?") */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 py-14 sm:py-18 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <p className="text-xs font-medium text-[#0F8A5F] dark:text-[#22B57E]">
              The Waste Intelligence Lab · Did You Know?
            </p>
            <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[#133C2C] dark:text-[#F2F5F3] text-balance">
              Why coordination gaps—not material scarcity—drive landfill loss.
            </h2>
          </div>

          <button
            type="button"
            onClick={handleNextFact}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-[#E2DDD3] dark:border-[#24352E] bg-white dark:bg-[#111C17] text-xs font-semibold text-[#1B201D] dark:text-[#F2F5F3] hover:border-[#0F8A5F] transition-colors cursor-pointer self-start md:self-auto whitespace-nowrap"
          >
            <RefreshCw className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Next Sourced Fact</span>
          </button>
        </div>

        {/* Material Selector Tabs */}
        <div
          role="tablist"
          aria-label="Select research fact by material"
          className="flex flex-wrap gap-2"
        >
          {RESEARCH_FACTS.map((fact, idx) => {
            const active = idx === selectedFactIndex;
            return (
              <button
                key={fact.id}
                role="tab"
                type="button"
                aria-selected={active}
                onClick={() => setSelectedFactIndex(idx)}
                className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                  active
                    ? 'bg-[#133C2C] text-white dark:bg-[#22B57E] dark:text-[#0B1310]'
                    : 'border border-[#E2DDD3] dark:border-[#24352E] bg-white dark:bg-[#111C17] text-[#546059] dark:text-[#A4B5AC] hover:text-[#1B201D] dark:hover:text-[#F2F5F3]'
                }`}
              >
                {fact.material}
              </button>
            );
          })}
        </div>

        {/* Active Fact Display */}
        <div className="rounded-xl border border-[#E2DDD3] dark:border-[#24352E] bg-white dark:bg-[#111C17] p-6 sm:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-5 space-y-4">
              <div className="text-xs text-[#546059] dark:text-[#A4B5AC]">
                <span>General Research Benchmark</span>
                <span aria-hidden="true"> · </span>
                <span>{activeFact.sourceYear}</span>
              </div>

              <div className="font-display text-3xl sm:text-5xl font-bold text-[#0F8A5F] dark:text-[#22B57E] tabular-nums tracking-tight">
                {activeFact.headlineStat}
              </div>

              <h3 className="font-display text-xl sm:text-2xl font-semibold text-[#1B201D] dark:text-[#F2F5F3] leading-snug text-balance">
                {activeFact.factTitle}
              </h3>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => openMaterialStory(activeFact.material)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs sm:text-sm font-semibold bg-[#133C2C] text-white hover:bg-[#0F8A5F] dark:bg-[#22B57E] dark:text-[#0B1310] transition-colors cursor-pointer whitespace-nowrap"
                >
                  <span>Explore this material</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </button>

                <a
                  href={activeFact.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-[#0F8A5F] dark:text-[#22B57E] hover:underline underline-offset-4"
                >
                  <span>{activeFact.sourceName}</span>
                  <ExternalLink className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                </a>
              </div>
            </div>

            <div className="lg:col-span-7 border-t lg:border-t-0 lg:border-l border-[#E2DDD3] dark:border-[#24352E] pt-6 lg:pt-0 lg:pl-8 space-y-5">
              <p className="text-sm sm:text-base text-[#1B201D] dark:text-[#DCE4DF] leading-relaxed">
                {activeFact.factStatement}
              </p>

              <div>
                <button
                  type="button"
                  onClick={() => setExpandedFact((v) => !v)}
                  aria-expanded={expandedFact}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#133C2C] dark:text-[#22B57E] hover:underline cursor-pointer"
                >
                  <span>
                    {expandedFact
                      ? 'Hide context & campus action'
                      : 'Show why it matters & campus action'}
                  </span>
                  {expandedFact ? (
                    <ChevronUp className="w-4 h-4" aria-hidden="true" />
                  ) : (
                    <ChevronDown className="w-4 h-4" aria-hidden="true" />
                  )}
                </button>

                {expandedFact && (
                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-[#E2DDD3] dark:border-[#24352E]">
                    <div className="space-y-1.5">
                      <h4 className="text-xs font-semibold text-[#133C2C] dark:text-[#22B57E]">
                        Why this fact matters
                      </h4>
                      <p className="text-sm text-[#546059] dark:text-[#A4B5AC] leading-relaxed">
                        {activeFact.whyItMatters}
                      </p>
                    </div>
                    <div className="space-y-1.5">
                      <h4 className="text-xs font-semibold text-[#133C2C] dark:text-[#22B57E]">
                        One action a college or business can take
                      </h4>
                      <p className="text-sm text-[#546059] dark:text-[#A4B5AC] leading-relaxed">
                        {activeFact.actionForOrg}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <p className="text-xs text-[#546059] dark:text-[#A4B5AC] pt-2 border-t border-[#E2DDD3] dark:border-[#24352E]">
                Note: These external agency figures describe broader municipal waste patterns. They
                do not represent achieved results of the WasteWorth AI student prototype.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. SIGNATURE PREVIEW & PROTOTYPE TRANSPARENCY */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 space-y-8">
        <div className="rounded-xl border border-[#E2DDD3] dark:border-[#24352E] bg-[#133C2C] text-white dark:bg-[#111C17] p-6 sm:p-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-3">
              <div className="text-xs font-medium text-[#8CE2BE]">
                Signature Feature · Digital Waste Passport
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-balance">
                Every material batch gets a verifiable record—from WW-0001 onward.
              </h2>
              <p className="text-sm sm:text-base text-white/80 dark:text-[#A4B5AC] leading-relaxed max-w-2xl">
                Follow our Illustrative Demo Journey (Batch WW-0001) to see how 42 kg of campus
                corrugated cardboard moves from mailroom sorting to partner matching, recorded
                collection, and destination intake logging.
              </p>
            </div>

            <div className="lg:col-span-5 flex flex-wrap lg:justify-end gap-3">
              <button
                type="button"
                onClick={() => openPassport('WW-0001')}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-lg text-sm font-semibold bg-white text-[#133C2C] hover:bg-[#FAF8F4] transition-colors cursor-pointer whitespace-nowrap"
              >
                <span>Inspect WW-0001 Passport</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => setActiveSection('assistant')}
                className="inline-flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-semibold border border-white/30 text-white hover:bg-white/10 transition-colors cursor-pointer whitespace-nowrap"
              >
                <span>Ask AI Assistant</span>
              </button>
            </div>
          </div>
        </div>

        {/* Quiet Prototype Boundaries Footer */}
        <footer className="border-t border-[#E2DDD3] dark:border-[#24352E] pt-8 flex flex-col md:flex-row justify-between gap-6 text-xs text-[#546059] dark:text-[#A4B5AC]">
          <div className="space-y-1 max-w-2xl">
            <div className="font-semibold text-[#1B201D] dark:text-[#F2F5F3]">
              WasteWorth AI — Turn Waste Into Worth
            </div>
            <p className="leading-relaxed">
              Student-built sustainability coordination prototype. Works today with persistent
              browser storage, dynamic batch KPIs, explainable demo-partner matching, Digital Waste
              Passports, and CSV audit exports. Real-world deployment requires local buyer
              verification, weighbridge integration, and organizational accounts.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-5 shrink-0">
            <button
              type="button"
              onClick={() => setActiveSection('dashboard')}
              className="hover:text-[#1B201D] dark:hover:text-[#F2F5F3] cursor-pointer"
            >
              Dashboard
            </button>
            <button
              type="button"
              onClick={() => openMaterialStory('Cardboard')}
              className="hover:text-[#1B201D] dark:hover:text-[#F2F5F3] cursor-pointer"
            >
              Material Stories
            </button>
            <button
              type="button"
              onClick={() => setActiveSection('marketplace')}
              className="hover:text-[#1B201D] dark:hover:text-[#F2F5F3] cursor-pointer"
            >
              Marketplace
            </button>
            <button
              type="button"
              onClick={() => setActiveSection('reports')}
              className="hover:text-[#1B201D] dark:hover:text-[#F2F5F3] cursor-pointer"
            >
              Reports & CSV
            </button>
          </div>
        </footer>
      </section>
    </main>
  );
}
