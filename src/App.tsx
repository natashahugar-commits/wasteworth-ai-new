import React from 'react';
import { CheckCircle2, Info, AlertCircle, X } from 'lucide-react';
import { WasteProvider, useWasteStore } from './store/wasteStore';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { DashboardView } from './components/DashboardView';
import { MaterialsExplorer } from './components/MaterialsExplorer';
import { AssistantView } from './components/AssistantView';
import { MarketplaceView } from './components/MarketplaceView';
import { PassportView } from './components/PassportView';
import { ReportsView } from './components/ReportsView';

function WorkspaceRouter() {
  const { activeSection, toast, clearToast } = useWasteStore();

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F4] text-[#1B201D] dark:bg-[#0B1310] dark:text-[#F2F5F3] transition-colors">
      <Navbar />

      <div className="flex-1">
        {activeSection === 'landing' && <LandingPage />}
        {activeSection === 'dashboard' && <DashboardView />}
        {activeSection === 'materials' && <MaterialsExplorer />}
        {activeSection === 'assistant' && <AssistantView />}
        {activeSection === 'marketplace' && <MarketplaceView />}
        {activeSection === 'passports' && <PassportView />}
        {activeSection === 'reports' && <ReportsView />}
      </div>

      {/* Non-blocking accessible notification banner */}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-4 right-4 z-50 max-w-sm rounded-xl border border-[#E2DDD3] dark:border-[#24352E] bg-white dark:bg-[#111C17] px-4 py-3 shadow-lg flex items-start gap-3 text-xs"
        >
          {toast.type === 'success' && (
            <CheckCircle2
              className="w-4 h-4 text-[#0F8A5F] dark:text-[#22B57E] shrink-0 mt-0.5"
              aria-hidden="true"
            />
          )}
          {toast.type === 'info' && (
            <Info
              className="w-4 h-4 text-[#0F8A5F] dark:text-[#22B57E] shrink-0 mt-0.5"
              aria-hidden="true"
            />
          )}
          {toast.type === 'error' && (
            <AlertCircle
              className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0 mt-0.5"
              aria-hidden="true"
            />
          )}
          <span className="flex-1 text-[#1B201D] dark:text-[#F2F5F3] leading-snug">
            {toast.message}
          </span>
          <button
            type="button"
            onClick={clearToast}
            aria-label="Dismiss notification"
            className="text-[#546059] hover:text-[#1B201D] dark:hover:text-white cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <WasteProvider>
      <WorkspaceRouter />
    </WasteProvider>
  );
}
