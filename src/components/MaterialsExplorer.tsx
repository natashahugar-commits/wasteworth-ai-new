import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, CheckCircle2, Info, Sparkles } from 'lucide-react';
import { MATERIAL_GUIDES } from '../data/materials';
import { useWasteStore } from '../store/wasteStore';
import { MaterialIcon } from './MaterialIcon';

export function MaterialsExplorer() {
  const {
    selectedMaterial,
    setSelectedMaterial,
    openCreateListingForMaterial,
    openAssistantWithPrompt,
    openPassport,
  } = useWasteStore();

  const [chapterStep, setChapterStep] = useState(0);

  const guide =
    MATERIAL_GUIDES.find((m) => m.id === selectedMaterial) ?? MATERIAL_GUIDES[0];

  const handleSelectMaterial = (id: typeof selectedMaterial) => {
    setSelectedMaterial(id);
    setChapterStep(0);
  };

  return (
    <main className="max-w-[1280px] mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#E2DDD3] dark:border-[#24352E] pb-6">
        <div className="space-y-2 max-w-2xl">
          <p className="text-xs font-medium text-[#0F8A5F] dark:text-[#22B57E]">
            Material Stories Explorer
          </p>
          <h1 className="font-display text-2xl sm:text-4xl font-bold tracking-tight text-[#133C2C] dark:text-[#F2F5F3] text-balance">
            Understand what makes each stream valuable before listing it.
          </h1>
          <p className="text-sm sm:text-base text-[#546059] dark:text-[#A4B5AC]">
            Select any of the six core campus and commercial streams below to inspect preparation
            standards, value drivers, buyer requirements, and its five-step journey.
          </p>
        </div>

        <button
          type="button"
          onClick={() => openCreateListingForMaterial(guide.id)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold bg-[#133C2C] text-white hover:bg-[#0F8A5F] dark:bg-[#22B57E] dark:text-[#0B1310] transition-colors cursor-pointer self-start md:self-auto whitespace-nowrap shrink-0"
        >
          <span>Create Listing for {guide.shortName}</span>
          <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>

      {/* 6 Interactive Material Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {MATERIAL_GUIDES.map((item) => {
          const isSelected = item.id === guide.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleSelectMaterial(item.id)}
              className={`rounded-xl border p-4 text-left transition-all duration-150 flex flex-col justify-between gap-3 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F8A5F] ${
                isSelected
                  ? 'border-[#0F8A5F] dark:border-[#22B57E] bg-[#133C2C] text-white dark:bg-[#17251F] shadow-sm'
                  : 'border-[#E2DDD3] dark:border-[#24352E] bg-white dark:bg-[#111C17] text-[#1B201D] dark:text-[#F2F5F3] hover:border-[#0F8A5F]/60'
              }`}
            >
              <div
                className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                  isSelected
                    ? 'bg-white/15 text-[#8CE2BE]'
                    : 'bg-[#F2EFE9] dark:bg-[#17251F] text-[#133C2C] dark:text-[#22B57E]'
                }`}
              >
                <MaterialIcon material={item.id} className="w-5 h-5" />
              </div>
              <div>
                <div className="font-display text-sm font-semibold">{item.shortName}</div>
                <div
                  className={`text-[11px] mt-0.5 line-clamp-2 ${
                    isSelected ? 'text-white/75' : 'text-[#546059] dark:text-[#A4B5AC]'
                  }`}
                >
                  {item.resinOrGrade.split('·')[0].trim()}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Signature Material Interaction: Give This Material Its Next Chapter */}
      <section className="rounded-xl border border-[#E2DDD3] dark:border-[#24352E] bg-white dark:bg-[#111C17] p-6 sm:p-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E2DDD3] dark:border-[#24352E] pb-5">
          <div>
            <p className="text-xs font-medium text-[#0F8A5F] dark:text-[#22B57E]">
              Interactive Journey Preview
            </p>
            <h2 className="font-display text-xl sm:text-2xl font-bold text-[#133C2C] dark:text-[#F2F5F3]">
              Give This Material Its Next Chapter: {guide.id}
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() =>
                setChapterStep((prev) => (prev + 1) % guide.nextChapterSteps.length)
              }
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold border border-[#E2DDD3] dark:border-[#24352E] hover:border-[#0F8A5F] text-[#1B201D] dark:text-[#F2F5F3] cursor-pointer whitespace-nowrap"
            >
              <span>Advance Stage ({chapterStep + 1}/5)</span>
              <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => openPassport('WW-0001')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold text-[#0F8A5F] dark:text-[#22B57E] hover:underline cursor-pointer whitespace-nowrap"
            >
              <span>View Sample Passport (WW-0001)</span>
            </button>
          </div>
        </div>

        {/* 5-Stage Step Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5">
          {guide.nextChapterSteps.map((step, index) => {
            const reached = index <= chapterStep;
            const current = index === chapterStep;
            return (
              <button
                key={step.stage}
                type="button"
                onClick={() => setChapterStep(index)}
                className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
                  current
                    ? 'border-[#0F8A5F] dark:border-[#22B57E] bg-[#0F8A5F]/10 dark:bg-[#22B57E]/15'
                    : reached
                    ? 'border-[#0F8A5F]/40 dark:border-[#22B57E]/40 bg-[#FAF8F4] dark:bg-[#17251F]/60'
                    : 'border-[#E2DDD3] dark:border-[#24352E] bg-transparent opacity-75 hover:opacity-100'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-[11px] font-semibold text-[#0F8A5F] dark:text-[#22B57E] tabular-nums">
                    0{index + 1}
                  </span>
                  {reached && (
                    <CheckCircle2
                      className="w-3.5 h-3.5 text-[#0F8A5F] dark:text-[#22B57E]"
                      aria-hidden="true"
                    />
                  )}
                </div>
                <div className="text-xs font-semibold text-[#1B201D] dark:text-[#F2F5F3] mt-1">
                  {step.stage}
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Stage Spotlight */}
        <motion.div
          key={`${guide.id}-${chapterStep}`}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.18 }}
          className="rounded-lg bg-[#FAF8F4] dark:bg-[#17251F] border border-[#E2DDD3] dark:border-[#24352E] p-5 grid grid-cols-1 md:grid-cols-12 gap-5 items-center"
        >
          <div className="md:col-span-7 space-y-1.5">
            <div className="text-xs font-semibold text-[#0F8A5F] dark:text-[#22B57E]">
              Stage {chapterStep + 1}: {guide.nextChapterSteps[chapterStep].stage}
            </div>
            <p className="text-sm sm:text-base text-[#1B201D] dark:text-[#F2F5F3] leading-relaxed">
              {guide.nextChapterSteps[chapterStep].detail}
            </p>
          </div>
          <div className="md:col-span-5 md:border-l border-[#E2DDD3] dark:border-[#24352E] md:pl-5 space-y-1">
            <div className="text-xs font-medium text-[#546059] dark:text-[#A4B5AC]">
              Record Captured in WasteWorth AI
            </div>
            <div className="font-mono text-xs text-[#1B201D] dark:text-[#DCE4DF] leading-relaxed">
              {guide.nextChapterSteps[chapterStep].recordCaptured}
            </div>
          </div>
        </motion.div>
      </section>

      {/* 6 Detailed Sections for Selected Material */}
      <motion.div
        key={guide.id}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
        className="grid grid-cols-1 lg:grid-cols-12 gap-6"
      >
        {/* Left Column: Definition, Prep, Routes */}
        <div className="lg:col-span-7 space-y-6">
          {/* 1. What it is */}
          <div className="rounded-xl border border-[#E2DDD3] dark:border-[#24352E] bg-white dark:bg-[#111C17] p-6 space-y-4">
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-display text-lg font-semibold text-[#133C2C] dark:text-[#F2F5F3]">
                1. What {guide.shortName} Is
              </h3>
              <span className="font-mono text-xs text-[#546059] dark:text-[#A4B5AC]">
                {guide.resinOrGrade}
              </span>
            </div>
            <p className="text-sm text-[#1B201D] dark:text-[#DCE4DF] leading-relaxed">
              {guide.whatItIs}
            </p>
            <div className="border-t border-[#E2DDD3] dark:border-[#24352E] pt-3">
              <div className="text-xs font-semibold text-[#546059] dark:text-[#A4B5AC] mb-2">
                Typical Campus & Office Sources
              </div>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-[#1B201D] dark:text-[#DCE4DF]">
                {guide.commonSources.map((src) => (
                  <li key={src} className="flex items-start gap-2">
                    <span className="text-[#0F8A5F] dark:text-[#22B57E]">·</span>
                    <span>{src}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* 2. Safe Preparation & Sorting */}
          <div className="rounded-xl border border-[#E2DDD3] dark:border-[#24352E] bg-white dark:bg-[#111C17] p-6 space-y-3">
            <h3 className="font-display text-lg font-semibold text-[#133C2C] dark:text-[#F2F5F3]">
              2. How to Prepare or Sort It Safely
            </h3>
            <ol className="space-y-2.5 text-sm text-[#1B201D] dark:text-[#DCE4DF]">
              {guide.preparationSteps.map((step, i) => (
                <li key={step} className="flex items-start gap-3">
                  <span className="font-mono text-xs font-semibold text-[#0F8A5F] dark:text-[#22B57E] pt-0.5 tabular-nums">
                    0{i + 1}
                  </span>
                  <span className="leading-relaxed">{step}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* 3. Potential Reuse or Recycling Routes */}
          <div className="rounded-xl border border-[#E2DDD3] dark:border-[#24352E] bg-white dark:bg-[#111C17] p-6 space-y-3">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="font-display text-lg font-semibold text-[#133C2C] dark:text-[#F2F5F3]">
                3. Potential Reuse or Recycling Routes
              </h3>
              <span className="text-xs text-[#546059] dark:text-[#A4B5AC]">
                Subject to local acceptance & condition
              </span>
            </div>
            <ul className="space-y-2.5 text-sm text-[#1B201D] dark:text-[#DCE4DF]">
              {guide.potentialRoutes.map((route) => (
                <li key={route} className="flex items-start gap-2.5 leading-relaxed">
                  <CheckCircle2
                    className="w-4 h-4 text-[#0F8A5F] dark:text-[#22B57E] shrink-0 mt-0.5"
                    aria-hidden="true"
                  />
                  <span>{route}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Column: Value Drivers, Buyer Info Needed, Actions */}
        <div className="lg:col-span-5 space-y-6">
          {/* 4. What affects potential resale value */}
          <div className="rounded-xl border border-[#E2DDD3] dark:border-[#24352E] bg-white dark:bg-[#111C17] p-6 space-y-4">
            <h3 className="font-display text-lg font-semibold text-[#133C2C] dark:text-[#F2F5F3]">
              4. What Affects Potential Resale Value
            </h3>
            <dl className="divide-y divide-[#E2DDD3] dark:divide-[#24352E] text-sm">
              {(
                [
                  ['Cleanliness', guide.valueFactors.cleanliness],
                  ['Quality', guide.valueFactors.quality],
                  ['Quantity', guide.valueFactors.quantity],
                  ['Location', guide.valueFactors.location],
                  ['Buyer Demand', guide.valueFactors.demand],
                ] as const
              ).map(([label, desc]) => (
                <div key={label} className="py-2.5 first:pt-0 last:pb-0">
                  <dt className="text-xs font-semibold text-[#133C2C] dark:text-[#22B57E]">
                    {label}
                  </dt>
                  <dd className="text-xs sm:text-sm text-[#546059] dark:text-[#A4B5AC] mt-0.5 leading-relaxed">
                    {desc}
                  </dd>
                </div>
              ))}
            </dl>
            <div className="rounded-lg bg-[#FAF8F4] dark:bg-[#17251F] border border-[#E2DDD3] dark:border-[#24352E] p-3 flex items-start gap-2.5 text-xs text-[#546059] dark:text-[#A4B5AC]">
              <Info className="w-4 h-4 text-[#0F8A5F] dark:text-[#22B57E] shrink-0 mt-0.5" aria-hidden="true" />
              <span>
                No fixed resale price or guaranteed recycling is claimed. Acceptance and pricing
                always depend on local buyers, batch cleanliness, and prevailing market demand.
              </span>
            </div>
          </div>

          {/* 5. Information buyers need */}
          <div className="rounded-xl border border-[#E2DDD3] dark:border-[#24352E] bg-white dark:bg-[#111C17] p-6 space-y-4">
            <h3 className="font-display text-lg font-semibold text-[#133C2C] dark:text-[#F2F5F3]">
              5. Information a Buyer Needs First
            </h3>
            <ul className="space-y-2 text-sm text-[#1B201D] dark:text-[#DCE4DF]">
              {guide.buyerInfoNeeded.map((info) => (
                <li key={info} className="flex items-start gap-2.5 leading-relaxed">
                  <span className="font-mono text-xs text-[#0F8A5F] dark:text-[#22B57E] pt-0.5">
                    —
                  </span>
                  <span>{info}</span>
                </li>
              ))}
            </ul>

            <div className="pt-3 border-t border-[#E2DDD3] dark:border-[#24352E] flex flex-col sm:flex-row gap-2.5">
              <button
                type="button"
                onClick={() => openCreateListingForMaterial(guide.id)}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs sm:text-sm font-semibold bg-[#133C2C] text-white hover:bg-[#0F8A5F] dark:bg-[#22B57E] dark:text-[#0B1310] transition-colors cursor-pointer whitespace-nowrap"
              >
                <span>Create Listing for {guide.shortName}</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() =>
                  openAssistantWithPrompt(`What can I do with 20 kg of ${guide.id.toLowerCase()}?`)
                }
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg text-xs sm:text-sm font-semibold border border-[#E2DDD3] dark:border-[#24352E] text-[#1B201D] dark:text-[#F2F5F3] hover:border-[#0F8A5F] transition-colors cursor-pointer whitespace-nowrap"
              >
                <Sparkles className="w-4 h-4 text-[#0F8A5F] dark:text-[#22B57E]" aria-hidden="true" />
                <span>Ask Assistant</span>
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </main>
  );
}
