export type MaterialCategory =
  | 'Cardboard'
  | 'Newspaper'
  | 'PET beverage bottles'
  | 'HDPE plastic'
  | 'Aluminium cans'
  | 'Iron and steel';

export type BatchStatus =
  | 'Created'
  | 'Listed'
  | 'Matched'
  | 'Collection recorded'
  | 'Destination recorded';

export type AppSection =
  | 'landing'
  | 'dashboard'
  | 'materials'
  | 'assistant'
  | 'marketplace'
  | 'passports'
  | 'reports';

export interface ActivityEvent {
  id: string;
  stage: BatchStatus;
  timestamp: string;
  actor: string;
  note: string;
}

export interface MatchDetails {
  partnerId: string;
  partnerName: string;
  partnerType: string;
  isDemoPartner: boolean;
  matchedAt: string;
  reasons: string[];
}

export interface CollectionDetails {
  recordedAt: string;
  collectorName: string;
  pickupNotes: string;
  evidenceSummary?: string;
  evidenceImageDataUrl?: string;
}

export interface DestinationDetails {
  recordedAt: string;
  facilityName: string;
  destinationType:
    | 'Material Recovery Facility (MRF) Intake'
    | 'Aggregated Processor Yard (Unverified)'
    | 'Direct Mill / Foundry Intake'
    | 'Campus / Local Reuse Partner';
  intakeReference: string;
  destinationNotes: string;
  recordedBy: string;
}

export interface WasteBatch {
  id: string; // e.g. WW-0001
  title: string;
  material: MaterialCategory;
  quantityKg: number;
  unit: 'kg';
  condition: string;
  location: string;
  sourceUnit: string; // e.g. Engineering Block B, Hostel 3
  createdAt: string;
  createdBy: string;
  status: BatchStatus;
  isDemo: boolean;
  isIllustrativeJourney?: boolean;
  notes: string;
  evidenceNote?: string;
  match?: MatchDetails;
  collection?: CollectionDetails;
  destination?: DestinationDetails;
  history: ActivityEvent[];
}

export interface PartnerProfile {
  id: string;
  name: string;
  partnerType: string;
  cityArea: string;
  acceptedMaterials: MaterialCategory[];
  minQuantityKg: number;
  acceptanceCriteria: string[];
  collectionCapability: string;
  isDemoPartner: true;
  responseWindow: string;
}

export interface MaterialGuide {
  id: MaterialCategory;
  shortName: string;
  resinOrGrade: string;
  summary: string;
  whatItIs: string;
  commonSources: string[];
  preparationSteps: string[];
  potentialRoutes: string[];
  valueFactors: {
    cleanliness: string;
    quality: string;
    quantity: string;
    location: string;
    demand: string;
  };
  buyerInfoNeeded: string[];
  nextChapterSteps: {
    stage: string;
    detail: string;
    recordCaptured: string;
  }[];
  destinationExamples: string[];
}

export interface ResearchFact {
  id: string;
  material: MaterialCategory;
  headlineStat: string;
  factTitle: string;
  factStatement: string;
  whyItMatters: string;
  actionForOrg: string;
  sourceName: string;
  sourceYear: string;
  sourceUrl: string;
}

export interface AssistantAnalysis {
  suggestedCategory: string;
  confidenceNote: string;
  summary: string;
  informationNeeded: string[];
  preparationSteps: string[];
  potentialRoutes: string[];
  listingChecklist: string[];
  buyerQuestions: string[];
  reviewNotice: string;
}
