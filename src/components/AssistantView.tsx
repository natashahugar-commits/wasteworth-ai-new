import React, { useEffect, useRef, useState } from 'react';
import {
  Send,
  ImagePlus,
  X,
  ArrowRight,
  AlertCircle,
  Loader2,
  Bot,
} from 'lucide-react';
import { MATERIAL_CATEGORIES } from '../data/materials';
import { useWasteStore } from '../store/wasteStore';
import type { AssistantAnalysis, MaterialCategory } from '../types/waste';

const SUGGESTED_PROMPTS = [
  'What can I do with 20 kg of cardboard?',
  'Help me prepare a listing for PET bottles.',
  'What should I ask a potential recycler?',
  'How can our college organize its waste records?',
];

interface ChatTurn {
  id: string;
  userMessage: string;
  imagePreview?: string;
  mode: 'gemini' | 'fallback';
  model: string;
  reason?: string;
  apiError?: string;
  analysis: AssistantAnalysis;
  timestamp: string;
}

function mapSuggestedCategory(suggested: string): MaterialCategory {
  const lower = suggested.toLowerCase();
  if (lower.includes('cardboard')) return 'Cardboard';
  if (lower.includes('newspaper') || lower.includes('paper')) return 'Newspaper';
  if (lower.includes('pet')) return 'PET beverage bottles';
  if (lower.includes('hdpe')) return 'HDPE plastic';
  if (lower.includes('alumin')) return 'Aluminium cans';
  if (lower.includes('steel') || lower.includes('iron') || lower.includes('metal')) {
    return 'Iron and steel';
  }
  return 'Cardboard';
}

export function AssistantView() {
  const {
    assistantPrefill,
    setAssistantPrefill,
    openCreateListingForMaterial,
  } = useWasteStore();

  const [geminiConfigured, setGeminiConfigured] = useState<boolean | null>(null);
  const [modelName, setModelName] = useState<string>('gemini-4-hydrogen');
  const [input, setInput] = useState('');
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [imageMimeType, setImageMimeType] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [turns, setTurns] = useState<ChatTurn[]>([]);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    let active = true;
    fetch('/api/assistant/status')
      .then((res) => res.json())
      .then((data) => {
        if (!active) return;
        setGeminiConfigured(Boolean(data.geminiConfigured));
        if (data.model) setModelName(String(data.model));
      })
      .catch(() => {
        if (active) setGeminiConfigured(false);
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (assistantPrefill) {
      setInput(assistantPrefill);
      setAssistantPrefill('');
    }
  }, [assistantPrefill, setAssistantPrefill]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Please upload a valid image file (PNG, JPG, or WebP).');
      return;
    }
    if (file.size > 4 * 1024 * 1024) {
      setError('Please select an image smaller than 4 MB.');
      return;
    }
    setError(null);
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = String(reader.result || '');
      const commaIdx = dataUrl.indexOf(',');
      if (commaIdx > -1) {
        setImagePreview(dataUrl);
        setImageBase64(dataUrl.slice(commaIdx + 1));
        setImageMimeType(file.type);
      }
    };
    reader.readAsDataURL(file);
  };

  const clearImage = () => {
    setImagePreview(null);
    setImageBase64(null);
    setImageMimeType(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const sendQuery = async (promptText?: string) => {
    const messageToSend = (promptText ?? input).trim();
    if (!messageToSend && !imageBase64) {
      setError('Enter a material question or attach a photo first.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: messageToSend,
          imageBase64: imageBase64 ?? undefined,
          imageMimeType: imageMimeType ?? undefined,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Assistant request failed.');
      }

      const newTurn: ChatTurn = {
        id: `turn-${Date.now()}`,
        userMessage: messageToSend || 'Uploaded material image for classification',
        imagePreview: imagePreview ?? undefined,
        mode: data.mode === 'gemini' ? 'gemini' : 'fallback',
        model: data.model || 'rule-based-demo',
        reason: data.reason,
        apiError: data.apiError,
        analysis: data.analysis as AssistantAnalysis,
        timestamp: new Date().toISOString(),
      };

      setTurns((prev) => [newTurn, ...prev]);
      if (!promptText) {
        setInput('');
      }
      clearImage();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to reach assistant endpoint.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-[1280px] mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-8">
      {/* Header & Honest Connection Status */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#E2DDD3] dark:border-[#24352E] pb-6">
        <div className="space-y-1.5 max-w-2xl">
          <p className="text-xs font-medium text-[#0F8A5F] dark:text-[#22B57E]">
            Waste Identification & Listing Assistant
          </p>
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[#133C2C] dark:text-[#F2F5F3]">
            Classify materials, prepare batches, and vet buyers.
          </h1>
          <p className="text-sm text-[#546059] dark:text-[#A4B5AC]">
            Describe a material stream or upload a photo to receive suggested classification,
            preparation steps, marketplace listing details, and buyer verification questions.
          </p>
        </div>

        <div className="rounded-lg border border-[#E2DDD3] dark:border-[#24352E] bg-white dark:bg-[#111C17] px-4 py-2.5 text-xs shrink-0">
          <div className="font-semibold text-[#1B201D] dark:text-[#F2F5F3]">
            {geminiConfigured === null
              ? 'Checking assistant mode...'
              : geminiConfigured
              ? `Gemini Connected (${modelName})`
              : 'Rule-Based Demo Mode Active'}
          </div>
          <div className="text-[#546059] dark:text-[#A4B5AC] mt-0.5">
            {geminiConfigured
              ? 'Live server-side Gemini analysis with automatic demo fallback'
              : 'No server Gemini key detected; responses use local deterministic rules'}
          </div>
        </div>
      </div>

      {/* Prompt Composer & Suggested Prompts */}
      <section className="rounded-xl border border-[#E2DDD3] dark:border-[#24352E] bg-white dark:bg-[#111C17] p-5 sm:p-6 space-y-5">
        <div className="space-y-2">
          <div className="text-xs font-semibold text-[#546059] dark:text-[#A4B5AC]">
            Suggested Prompts
          </div>
          <div className="flex flex-wrap gap-2">
            {SUGGESTED_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                type="button"
                disabled={loading}
                onClick={() => {
                  setInput(prompt);
                  void sendQuery(prompt);
                }}
                className="px-3 py-1.5 rounded-lg border border-[#E2DDD3] dark:border-[#24352E] bg-[#FAF8F4] dark:bg-[#17251F] text-xs font-medium text-[#1B201D] dark:text-[#F2F5F3] hover:border-[#0F8A5F] transition-colors cursor-pointer disabled:opacity-50 text-left"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            void sendQuery();
          }}
          className="space-y-4"
        >
          <div>
            <label
              htmlFor="assistant-prompt"
              className="block text-xs font-semibold text-[#1B201D] dark:text-[#F2F5F3] mb-1.5"
            >
              Describe your material, quantity, condition, or campus record question
            </label>
            <textarea
              id="assistant-prompt"
              rows={3}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Example: We have 25 kg of flattened cardboard cartons stored in Engineering Block B, some with shipping tape..."
              className="w-full rounded-lg border border-[#E2DDD3] dark:border-[#24352E] bg-[#FAF8F4] dark:bg-[#0B1310] px-3.5 py-2.5 text-sm text-[#1B201D] dark:text-[#F2F5F3] placeholder:text-[#546059]/70 focus:outline-2 focus:outline-[#0F8A5F]"
            />
          </div>

          {imagePreview && (
            <div className="flex items-center gap-3 p-3 rounded-lg border border-[#E2DDD3] dark:border-[#24352E] bg-[#FAF8F4] dark:bg-[#17251F]">
              <img
                src={imagePreview}
                alt="Selected material upload preview"
                className="w-14 h-14 object-cover rounded-md border border-[#E2DDD3] dark:border-[#24352E]"
              />
              <div className="flex-1 min-w-0 text-xs">
                <div className="font-semibold text-[#1B201D] dark:text-[#F2F5F3]">
                  Material image attached
                </div>
                <div className="text-[#546059] dark:text-[#A4B5AC]">
                  {geminiConfigured
                    ? 'Will be analyzed with Gemini multimodal vision.'
                    : 'Rule-based demo mode active; describe material in text for best guidance.'}
                </div>
              </div>
              <button
                type="button"
                onClick={clearImage}
                aria-label="Remove attached image"
                className="p-1.5 rounded-md hover:bg-black/5 dark:hover:bg-white/10 text-[#546059] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {error && (
            <div
              role="alert"
              className="flex items-center gap-2 text-xs text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-lg px-3.5 py-2.5"
            >
              <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
                id="assistant-image-upload"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-[#E2DDD3] dark:border-[#24352E] text-xs font-semibold text-[#1B201D] dark:text-[#F2F5F3] hover:border-[#0F8A5F] cursor-pointer whitespace-nowrap"
              >
                <ImagePlus className="w-4 h-4 text-[#0F8A5F] dark:text-[#22B57E]" aria-hidden="true" />
                <span>Attach Photo</span>
              </button>
              <span className="text-xs text-[#546059] dark:text-[#A4B5AC] hidden sm:inline">
                Recommendations always require human review before listing.
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold bg-[#133C2C] text-white hover:bg-[#0F8A5F] dark:bg-[#22B57E] dark:text-[#0B1310] transition-colors cursor-pointer disabled:opacity-60 whitespace-nowrap"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" aria-hidden="true" />
                  <span>Analyze Material</span>
                </>
              )}
            </button>
          </div>
        </form>
      </section>

      {/* Response Feed */}
      {turns.length === 0 ? (
        <div className="rounded-xl border border-[#E2DDD3] dark:border-[#24352E] bg-white dark:bg-[#111C17] p-8 text-center space-y-2">
          <Bot className="w-7 h-7 mx-auto text-[#0F8A5F] dark:text-[#22B57E]" aria-hidden="true" />
          <h2 className="font-display text-lg font-semibold text-[#1B201D] dark:text-[#F2F5F3]">
            Ask a question or click a prompt above to start
          </h2>
          <p className="text-sm text-[#546059] dark:text-[#A4B5AC] max-w-lg mx-auto">
            Try “What can I do with 20 kg of cardboard?” to get structured preparation steps,
            listing fields, and buyer questions, then turn it into a real Marketplace batch.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {turns.map((turn) => {
            const matchedMaterial = mapSuggestedCategory(turn.analysis.suggestedCategory);
            const isExactKnownCategory = MATERIAL_CATEGORIES.some(
              (c) => c.toLowerCase() === turn.analysis.suggestedCategory.toLowerCase()
            );

            return (
              <article
                key={turn.id}
                className="rounded-xl border border-[#E2DDD3] dark:border-[#24352E] bg-white dark:bg-[#111C17] p-6 space-y-6"
              >
                {/* Prompt + Honest Source Metadata */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-[#E2DDD3] dark:border-[#24352E] pb-4">
                  <div className="flex items-start gap-3">
                    {turn.imagePreview && (
                      <img
                        src={turn.imagePreview}
                        alt="Uploaded material"
                        className="w-12 h-12 rounded-md object-cover border border-[#E2DDD3] dark:border-[#24352E] shrink-0"
                      />
                    )}
                    <div>
                      <div className="text-xs text-[#546059] dark:text-[#A4B5AC]">Your Prompt</div>
                      <div className="text-sm sm:text-base font-semibold text-[#1B201D] dark:text-[#F2F5F3]">
                        “{turn.userMessage}”
                      </div>
                    </div>
                  </div>

                  <div className="text-xs text-left sm:text-right shrink-0">
                    <div
                      className={`font-semibold ${
                        turn.mode === 'gemini'
                          ? 'text-[#0F8A5F] dark:text-[#22B57E]'
                          : 'text-amber-700 dark:text-amber-400'
                      }`}
                    >
                      {turn.mode === 'gemini'
                        ? `Generated by Gemini (${turn.model})`
                        : 'Rule-Based Demo Fallback (Not Gemini AI)'}
                    </div>
                    {turn.reason && (
                      <div className="text-[#546059] dark:text-[#A4B5AC] max-w-xs mt-0.5">
                        {turn.reason}
                      </div>
                    )}
                  </div>
                </div>

                {/* Suggested Category & Summary */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  <div className="lg:col-span-5 space-y-3">
                    <div>
                      <div className="text-xs font-medium text-[#546059] dark:text-[#A4B5AC]">
                        Suggested Material Category
                      </div>
                      <div className="font-display text-xl font-bold text-[#133C2C] dark:text-[#22B57E] mt-0.5">
                        {turn.analysis.suggestedCategory}
                      </div>
                      <p className="text-xs text-[#546059] dark:text-[#A4B5AC] mt-1">
                        {turn.analysis.confidenceNote}
                      </p>
                    </div>
                    <p className="text-sm text-[#1B201D] dark:text-[#DCE4DF] leading-relaxed">
                      {turn.analysis.summary}
                    </p>

                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={() =>
                          openCreateListingForMaterial(
                            matchedMaterial,
                            turn.analysis.preparationSteps.slice(0, 2).join(' ')
                          )
                        }
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold bg-[#133C2C] text-white hover:bg-[#0F8A5F] dark:bg-[#22B57E] dark:text-[#0B1310] transition-colors cursor-pointer whitespace-nowrap"
                      >
                        <span>
                          {isExactKnownCategory
                            ? `Create ${matchedMaterial} Listing`
                            : `Start ${matchedMaterial} Listing`}
                        </span>
                        <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                      </button>
                    </div>
                  </div>

                  {/* Structured Guidance Columns */}
                  <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5 border-t lg:border-t-0 lg:border-l border-[#E2DDD3] dark:border-[#24352E] pt-5 lg:pt-0 lg:pl-6">
                    <div className="space-y-2">
                      <h3 className="text-xs font-semibold text-[#133C2C] dark:text-[#22B57E]">
                        Information Still Needed
                      </h3>
                      <ul className="space-y-1.5 text-xs text-[#546059] dark:text-[#A4B5AC] leading-relaxed">
                        {turn.analysis.informationNeeded.map((item) => (
                          <li key={item}>· {item}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-xs font-semibold text-[#133C2C] dark:text-[#22B57E]">
                        Possible Preparation Steps
                      </h3>
                      <ul className="space-y-1.5 text-xs text-[#546059] dark:text-[#A4B5AC] leading-relaxed">
                        {turn.analysis.preparationSteps.map((item) => (
                          <li key={item}>· {item}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-xs font-semibold text-[#133C2C] dark:text-[#22B57E]">
                        Potential Reuse / Recycling Routes
                      </h3>
                      <ul className="space-y-1.5 text-xs text-[#546059] dark:text-[#A4B5AC] leading-relaxed">
                        {turn.analysis.potentialRoutes.map((item) => (
                          <li key={item}>· {item}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-xs font-semibold text-[#133C2C] dark:text-[#22B57E]">
                        What to Include in Your Listing
                      </h3>
                      <ul className="space-y-1.5 text-xs text-[#546059] dark:text-[#A4B5AC] leading-relaxed">
                        {turn.analysis.listingChecklist.map((item) => (
                          <li key={item}>· {item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Questions for Buyer & Human Review Notice */}
                <div className="border-t border-[#E2DDD3] dark:border-[#24352E] pt-4 grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
                  <div className="lg:col-span-7 space-y-1.5">
                    <h3 className="text-xs font-semibold text-[#1B201D] dark:text-[#F2F5F3]">
                      Questions to Ask a Prospective Buyer
                    </h3>
                    <ul className="space-y-1 text-xs text-[#546059] dark:text-[#A4B5AC]">
                      {turn.analysis.buyerQuestions.map((q) => (
                        <li key={q}>— {q}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="lg:col-span-5 rounded-lg bg-[#FAF8F4] dark:bg-[#17251F] border border-[#E2DDD3] dark:border-[#24352E] p-3 text-xs text-[#546059] dark:text-[#A4B5AC] leading-relaxed">
                    <span className="font-semibold text-[#1B201D] dark:text-[#F2F5F3]">
                      Human Review Required:
                    </span>{' '}
                    {turn.analysis.reviewNotice}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </main>
  );
}
