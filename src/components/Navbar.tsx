import React, { useState } from 'react';
import { Menu, X, Sun, Moon, RotateCcw } from 'lucide-react';
import { useWasteStore } from '../store/wasteStore';
import type { AppSection } from '../types/waste';

const NAV_ITEMS: { id: AppSection; label: string }[] = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'materials', label: 'Materials' },
  { id: 'assistant', label: 'Assistant' },
  { id: 'marketplace', label: 'Marketplace' },
  { id: 'reports', label: 'Reports' },
];

export function Navbar() {
  const {
    activeSection,
    setActiveSection,
    theme,
    toggleTheme,
    resetDemoData,
    batches,
  } = useWasteStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [confirmResetOpen, setConfirmResetOpen] = useState(false);

  const navigate = (section: AppSection) => {
    setActiveSection(section);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const userBatchCount = batches.filter((b) => !b.isDemo).length;

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-[#E2DDD3] dark:border-[#24352E] bg-[#FAF8F4]/95 dark:bg-[#0B1310]/95 backdrop-blur-sm">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Single text element wordmark */}
          <button
            type="button"
            onClick={() => navigate('landing')}
            className="font-display text-lg sm:text-xl font-bold tracking-tight text-[#133C2C] dark:text-[#F2F5F3] hover:text-[#0F8A5F] dark:hover:text-[#22B57E] transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0F8A5F]"
          >
            WasteWorth AI
          </button>

          {/* Zone 2: 5 concise single-line navigation links */}
          <nav
            aria-label="Primary navigation"
            className="hidden md:flex items-center gap-6 text-sm font-medium"
          >
            {NAV_ITEMS.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => navigate(item.id)}
                  className={`py-1 transition-colors whitespace-nowrap shrink-0 cursor-pointer border-b-2 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0F8A5F] ${
                    isActive
                      ? 'border-[#0F8A5F] dark:border-[#22B57E] text-[#133C2C] dark:text-[#F2F5F3] font-semibold'
                      : 'border-transparent text-[#546059] dark:text-[#A4B5AC] hover:text-[#1B201D] dark:hover:text-[#F2F5F3]'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: 1 Primary Action + Mobile Menu Trigger */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => navigate('passports')}
              className={`hidden sm:inline-flex items-center px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F8A5F] ${
                activeSection === 'passports'
                  ? 'bg-[#0F8A5F] text-white'
                  : 'bg-[#133C2C] text-white hover:bg-[#0F8A5F] dark:bg-[#22B57E] dark:text-[#0B1310] dark:hover:bg-[#1A9A6B]'
              }`}
            >
              Waste Passport
            </button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen((v) => !v)}
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileMenuOpen}
              className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg border border-[#E2DDD3] dark:border-[#24352E] text-[#1B201D] dark:text-[#F2F5F3] hover:bg-[#F2EFE9] dark:hover:bg-[#17251F] cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile navigation drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-[#E2DDD3] dark:border-[#24352E] bg-[#FAF8F4] dark:bg-[#0B1310] px-4 py-3 space-y-1">
            {NAV_ITEMS.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => navigate(item.id)}
                  className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-[#133C2C] text-white dark:bg-[#22B57E] dark:text-[#0B1310]'
                      : 'text-[#1B201D] dark:text-[#F2F5F3] hover:bg-[#F2EFE9] dark:hover:bg-[#17251F]'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
            <button
              type="button"
              onClick={() => navigate('passports')}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
                activeSection === 'passports'
                  ? 'bg-[#0F8A5F] text-white'
                  : 'bg-[#133C2C] text-white dark:bg-[#22B57E] dark:text-[#0B1310]'
              }`}
            >
              Waste Passport
            </button>
          </div>
        )}
      </header>

      {/* Secondary Workspace Utility Bar (kept cleanly outside <header> per Top Bar Contract) */}
      <div className="border-b border-[#E2DDD3] dark:border-[#24352E] bg-[#F2EFE9]/70 dark:bg-[#111C17]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-2 flex flex-wrap items-center justify-between gap-3 text-xs text-[#546059] dark:text-[#A4B5AC]">
          <div className="flex items-center gap-2 min-w-0">
            <button
              type="button"
              onClick={() => navigate('landing')}
              className="hover:text-[#133C2C] dark:hover:text-[#F2F5F3] cursor-pointer underline-offset-2 hover:underline whitespace-nowrap"
            >
              Overview
            </button>
            <span aria-hidden="true">/</span>
            <span className="font-medium text-[#1B201D] dark:text-[#F2F5F3] capitalize truncate">
              {activeSection === 'landing'
                ? 'Home & Waste Intelligence Lab'
                : activeSection === 'passports'
                ? 'Digital Waste Passports'
                : activeSection}
            </span>
            <span aria-hidden="true" className="hidden sm:inline">·</span>
            <span className="hidden sm:inline tabular-nums">
              {batches.length} total batches ({userBatchCount} user-created)
            </span>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border border-[#E2DDD3] dark:border-[#24352E] bg-white dark:bg-[#17251F] text-[#1B201D] dark:text-[#F2F5F3] hover:border-[#0F8A5F] transition-colors cursor-pointer whitespace-nowrap"
            >
              {theme === 'light' ? (
                <>
                  <Moon className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Dark</span>
                </>
              ) : (
                <>
                  <Sun className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Light</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => setConfirmResetOpen(true)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border border-[#E2DDD3] dark:border-[#24352E] bg-white dark:bg-[#17251F] text-[#1B201D] dark:text-[#F2F5F3] hover:border-[#0F8A5F] transition-colors cursor-pointer whitespace-nowrap"
            >
              <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Reset Demo Data</span>
            </button>
          </div>
        </div>
      </div>

      {/* Inline Accessible Reset Confirmation Dialog */}
      {confirmResetOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="reset-dialog-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
        >
          <div className="w-full max-w-md rounded-xl border border-[#E2DDD3] dark:border-[#24352E] bg-white dark:bg-[#111C17] p-6 shadow-xl space-y-4">
            <h2
              id="reset-dialog-title"
              className="font-display text-lg font-semibold text-[#1B201D] dark:text-[#F2F5F3]"
            >
              Reset Demo Data?
            </h2>
            <p className="text-sm text-[#546059] dark:text-[#A4B5AC] leading-relaxed">
              This clears any listings, match selections, collection logs, or destination records
              you created in browser storage and restores the 5 baseline demo batches (WW-0001
              through WW-0005).
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setConfirmResetOpen(false)}
                className="px-4 py-2 text-sm font-medium rounded-lg border border-[#E2DDD3] dark:border-[#24352E] text-[#1B201D] dark:text-[#F2F5F3] hover:bg-[#F2EFE9] dark:hover:bg-[#17251F] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  resetDemoData();
                  setConfirmResetOpen(false);
                }}
                className="px-4 py-2 text-sm font-semibold rounded-lg bg-[#133C2C] text-white hover:bg-[#0F8A5F] dark:bg-[#22B57E] dark:text-[#0B1310] cursor-pointer"
              >
                Confirm Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
