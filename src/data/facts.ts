import type { ResearchFact } from '../types/waste';

export const RESEARCH_FACTS: ResearchFact[] = [
  {
    id: 'fact-cardboard',
    material: 'Cardboard',
    headlineStat: '96.5% vs. 20.8%',
    factTitle: 'Corrugated boxes achieve 96.5% recovery in U.S. EPA data, while other paper packaging lags at 20.8%.',
    factStatement:
      'According to the U.S. EPA national Municipal Solid Waste dataset, paper and paperboard form the single largest MSW material stream (67.4 million tons, or 23.1% of all waste generated), with corrugated boxes reaching a 96.5% recycling rate compared to 20.8% for non-corrugated paper packaging.',
    whyItMatters:
      'High recovery happens when cardboard is flattened, kept dry, and collected separately at commercial or institutional loading docks—not tossed into wet mixed bins.',
    actionForOrg:
      'Place a dedicated dry flat-stacking rack at every campus mailroom, library, and hostel store before boxes reach general trash.',
    sourceName: 'U.S. EPA — Paper and Paperboard Material-Specific Data',
    sourceYear: '2018 Benchmark Dataset',
    sourceUrl: 'https://www.epa.gov/facts-and-figures-about-materials-waste-and-recycling/paper-and-paperboard-material-specific-data',
  },
  {
    id: 'fact-newspaper',
    material: 'Newspaper',
    headlineStat: '64.8% Recovery',
    factTitle: 'Sorted newspapers reach a 64.8% recycling rate—far above mixed nondurable paper (43.1%).',
    factStatement:
      'U.S. EPA material tracking reports that newspapers in the nondurable paper stream achieved a 64.8% recycling rate, outperforming general nondurable paper goods at 43.1%, largely because bundled newsprint is easy to isolate cleanly.',
    whyItMatters:
      'Once newsprint gets mixed with food wrappers or damp organic waste, paper mills often downgrade or reject the entire bundle.',
    actionForOrg:
      'Collect library and common-room newspapers in dry, covered bins separated from glossy sleeves and food waste.',
    sourceName: 'U.S. EPA — Paper and Paperboard Material-Specific Data',
    sourceYear: '2018 Benchmark Dataset',
    sourceUrl: 'https://www.epa.gov/facts-and-figures-about-materials-waste-and-recycling/paper-and-paperboard-material-specific-data',
  },
  {
    id: 'fact-pet',
    material: 'PET beverage bottles',
    headlineStat: '~8.7% Recycled',
    factTitle: 'Out of 35.7 million tons of U.S. plastic waste generated, ~27 million tons went to landfills.',
    factStatement:
      'U.S. EPA Municipal Solid Waste figures show plastics accounted for 35.7 million tons (12.2% of total waste), yet only roughly 3.1 million tons (~8.7%) were recycled while approximately 27 million tons were landfilled.',
    whyItMatters:
      'Because dozens of plastic resins look similar, unwashed or mixed-resin batches quickly lose reprocessing viability—making source separation by resin code (#1 PET vs. #2 HDPE) critical.',
    actionForOrg:
      'Add liquid-drain stations and clear #1 PET signage at cafeterias and sports venues so bottles stay clean and resin-pure.',
    sourceName: 'U.S. EPA — Plastics Material-Specific Data',
    sourceYear: '2018 Benchmark Dataset',
    sourceUrl: 'https://www.epa.gov/facts-and-figures-about-materials-waste-and-recycling/plastics-material-specific-data',
  },
  {
    id: 'fact-hdpe',
    material: 'HDPE plastic',
    headlineStat: 'Category I EPR',
    factTitle: 'CPCB Plastic Waste Management rules classify rigid PET (#1) & HDPE (#2) under mandatory EPR traceability.',
    factStatement:
      'Under India’s Central Pollution Control Board (CPCB) Extended Producer Responsibility framework, rigid plastic packaging such as PET and HDPE containers (Category I) requires registered Plastic Waste Processors to maintain digital chain-of-custody records.',
    whyItMatters:
      'Documenting batch weights, resin codes, and destination intake facilities turns informal scrap handoffs into auditable institutional records.',
    actionForOrg:
      'Log every rinsed #2 HDPE container batch with resin verification, prior-contents clearance, and destination details.',
    sourceName: 'CPCB — Centralized EPR Portal for Plastic Packaging',
    sourceYear: 'Plastic Waste Management Rules',
    sourceUrl: 'https://eprplastic.cpcb.gov.in/',
  },
  {
    id: 'fact-aluminium',
    material: 'Aluminium cans',
    headlineStat: '50.4% Can Rate',
    factTitle: 'Aluminum beverage cans hit a 50.4% recycling rate—yet 2.7 million tons of aluminum still hit landfills.',
    factStatement:
      'U.S. EPA aluminum data reports 3.9 million tons of aluminum generated in MSW; beer and soft drink cans achieved a 50.4% recycling rate (0.67 million tons) compared to 34.9% across all aluminum packaging, while 2.7 million tons were landfilled.',
    whyItMatters:
      'Aluminium is light (~65 cans per kg), so individual buildings rarely accumulate enough alone—coordination across hostels and events unlocks pickup thresholds.',
    actionForOrg:
      'Consolidate drained, crushed beverage cans from multiple campus blocks into a single weekly pickup batch.',
    sourceName: 'U.S. EPA — Aluminum Material-Specific Data',
    sourceYear: '2018 Benchmark Dataset',
    sourceUrl: 'https://www.epa.gov/facts-and-figures-about-materials-waste-and-recycling/aluminum-material-specific-data',
  },
  {
    id: 'fact-steel',
    material: 'Iron and steel',
    headlineStat: '70.9% Steel Cans',
    factTitle: 'Steel cans reach a 70.9% recovery rate across 19.2 million tons of ferrous MSW streams.',
    factStatement:
      'According to the U.S. EPA, ferrous metals represent 19.2 million tons (6.6% of total MSW), and steel cans achieved a 70.9% recycling rate (1.1 million tons) because magnetic separation efficiently isolates ferrous scrap.',
    whyItMatters:
      'Even with strong magnetic recovery, sharp-edged tins and mixed workshop scrap require safe rinsing and non-metal detachment before haulers will accept them.',
    actionForOrg:
      'Provide a simple magnet check and puncture-safe drum at mess kitchens and engineering workshops.',
    sourceName: 'U.S. EPA — Ferrous Metals Material-Specific Data',
    sourceYear: '2018 Benchmark Dataset',
    sourceUrl: 'https://www.epa.gov/facts-and-figures-about-materials-waste-and-recycling/ferrous-metals-material-specific-data',
  },
];
