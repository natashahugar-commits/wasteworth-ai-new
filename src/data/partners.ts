import type { PartnerProfile, WasteBatch } from '../types/waste';

export const DEMO_PARTNERS: PartnerProfile[] = [
  {
    id: 'partner-greenfiber',
    name: 'GreenFiber Paper Aggregators',
    partnerType: 'Fiber & Mill Consolidation Hub',
    cityArea: 'North Campus & Industrial Ring',
    acceptedMaterials: ['Cardboard', 'Newspaper'],
    minQuantityKg: 15,
    acceptanceCriteria: [
      'Must be dry and stored off damp floors',
      'Zero food grease or waxed coatings',
      'Boxes flattened or tied into bundles',
    ],
    collectionCapability: 'Light utility van pickup (15 kg – 400 kg) on 48h schedule',
    isDemoPartner: true,
    responseWindow: 'Within 1–2 business days (Demo)',
  },
  {
    id: 'partner-clearloop',
    name: 'ClearLoop Polymer Processors',
    partnerType: 'Registered Plastic Reprocessor (rPET / rHDPE)',
    cityArea: 'Central Metro & Campus Corridor',
    acceptedMaterials: ['PET beverage bottles', 'HDPE plastic'],
    minQuantityKg: 15,
    acceptanceCriteria: [
      'Separated by resin code (#1 PET vs. #2 HDPE)',
      'Emptied and rinsed free of sugary or chemical residue',
      'Non-hazardous prior contents declared for HDPE drums',
    ],
    collectionCapability: 'Bagged pickup route twice weekly (min 15 kg)',
    isDemoPartner: true,
    responseWindow: 'Within 2 business days (Demo)',
  },
  {
    id: 'partner-aurum-metal',
    name: 'Metro Alloys & Ferrous Depot',
    partnerType: 'Licensed Scrap Metal & Foundry Feeder',
    cityArea: 'East Workshop Zone & City Perimeter',
    acceptedMaterials: ['Aluminium cans', 'Iron and steel'],
    minQuantityKg: 10,
    acceptanceCriteria: [
      'Magnet-sorted between aluminium (UBC) and ferrous steel',
      'Rinsed food tins and drained beverage cans',
      'Wood, plastic handles, and batteries detached',
    ],
    collectionCapability: 'Scale-equipped pickup truck (10 kg – 1,000 kg)',
    isDemoPartner: true,
    responseWindow: 'Same or next business day (Demo)',
  },
  {
    id: 'partner-campus-mrf',
    name: 'Civic Dry-Waste Recovery Collective',
    partnerType: 'Multi-Stream Material Recovery Facility (MRF)',
    cityArea: 'All Campus Zones & Surrounding Wards',
    acceptedMaterials: [
      'Cardboard',
      'Newspaper',
      'PET beverage bottles',
      'HDPE plastic',
      'Aluminium cans',
    ],
    minQuantityKg: 20,
    acceptanceCriteria: [
      'Source-separated dry streams in labelled sacks or bundles',
      'No wet organic waste or hazardous lab materials',
      'Ground-floor loading access or caretaker sign-off',
    ],
    collectionCapability: 'Multi-compartment dry-waste route van',
    isDemoPartner: true,
    responseWindow: 'Within 2–3 business days (Demo)',
  },
];

export interface PartnerMatchEvaluation {
  partner: PartnerProfile;
  fitTier: 'Strong Alignment' | 'Conditional Fit' | 'Not Aligned';
  score: number;
  reasons: string[];
  caveats: string[];
}

export function evaluatePartnerMatches(batch: WasteBatch): PartnerMatchEvaluation[] {
  const results: PartnerMatchEvaluation[] = DEMO_PARTNERS.map((partner) => {
    const acceptsMaterial = partner.acceptedMaterials.includes(batch.material);
    const meetsMinQty = batch.quantityKg >= partner.minQuantityKg;

    const reasons: string[] = [];
    const caveats: string[] = [];
    let score = 0;

    if (acceptsMaterial) {
      score += 50;
      reasons.push(`Accepts ${batch.material}`);
    } else {
      caveats.push(`Does not intake ${batch.material}`);
    }

    if (meetsMinQty) {
      score += 25;
      reasons.push(`${batch.quantityKg} kg meets ${partner.minQuantityKg} kg pickup minimum`);
    } else {
      caveats.push(
        `${batch.quantityKg} kg is below ${partner.minQuantityKg} kg pickup minimum (drop-off or consolidation needed)`
      );
    }

    const locLower = batch.location.toLowerCase();
    const areaLower = partner.cityArea.toLowerCase();
    if (
      areaLower.includes('all campus') ||
      locLower.includes('campus') ||
      locLower.includes('hostel') ||
      locLower.includes('block') ||
      locLower.includes('library') ||
      locLower.includes('cafeteria') ||
      locLower.includes('workshop')
    ) {
      score += 15;
      reasons.push(`Serves ${partner.cityArea}`);
    }

    const condLower = batch.condition.toLowerCase();
    const hasRiskWords =
      condLower.includes('wet') ||
      condLower.includes('grease') ||
      condLower.includes('damp') ||
      condLower.includes('dirty') ||
      condLower.includes('mixed') ||
      condLower.includes('unrinsed');

    if (hasRiskWords) {
      caveats.push(
        `Stated condition ("${batch.condition}") may require re-sorting or drying against partner criteria`
      );
    } else {
      score += 10;
      reasons.push(`Stated condition ("${batch.condition}") aligns with intake criteria`);
    }

    let fitTier: PartnerMatchEvaluation['fitTier'] = 'Not Aligned';
    if (acceptsMaterial && meetsMinQty && !hasRiskWords) {
      fitTier = 'Strong Alignment';
    } else if (acceptsMaterial) {
      fitTier = 'Conditional Fit';
    }

    return {
      partner,
      fitTier,
      score,
      reasons,
      caveats,
    };
  });

  return results
    .filter((r) => r.fitTier !== 'Not Aligned')
    .sort((a, b) => b.score - a.score);
}
