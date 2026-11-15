import type { MaterialGuide, MaterialCategory } from '../types/waste';

export const MATERIAL_CATEGORIES: MaterialCategory[] = [
  'Cardboard',
  'Newspaper',
  'PET beverage bottles',
  'HDPE plastic',
  'Aluminium cans',
  'Iron and steel',
];

export const MATERIAL_GUIDES: MaterialGuide[] = [
  {
    id: 'Cardboard',
    shortName: 'Cardboard',
    resinOrGrade: 'OCC / Corrugated Fiberboard',
    summary:
      'Fluted kraft paperboard cartons from campus deliveries, labs, hostels, and bookstores.',
    whatItIs:
      'Old Corrugated Containers (OCC) consist of a fluted inner medium sandwiched between flat kraft linerboards. Long virgin and recycled cellulose fibers make clean cardboard one of the most widely accepted recovered fibers.',
    commonSources: [
      'Campus mailrooms and bookshop deliveries',
      'Cafeteria dry-goods cartons (non-greasy)',
      'Hostel move-in shipping boxes',
      'Office IT equipment packaging',
    ],
    preparationSteps: [
      'Remove all foam inserts, bubble wrap, and plastic air pillows before flattening.',
      'Collapse boxes flat so stacks fit neatly in dry storage rooms or loading bays.',
      'Keep cardboard elevated off damp floors; moisture weakens fibers and triggers mold rejection.',
      'Separate grease-stained or food-soaked boxes (such as used pizza boxes) into compost or residual waste.',
    ],
    potentialRoutes: [
      'Paper aggregators supplying recycled linerboard and corrugated medium mills (subject to dryness and low plastic content).',
      'Internal campus reuse for bookstore shipping, archive storage, or student move-out packing.',
      'Local packaging remanufacturers producing protective edge-boards or molded pulp trays.',
    ],
    valueFactors: {
      cleanliness: 'Dry, grease-free fibers retain structural strength; wet or food-contaminated loads are commonly rejected.',
      quality: 'Pure unbleached corrugated cartons command cleaner grading than waxed or plastic-laminated board.',
      quantity: 'Flattened, bundled batches (20 kg+) reduce transport volume per trip and attract more collectors.',
      location: 'Ground-floor dock access near urban paper mills or aggregators lowers haulage friction.',
      demand: 'Mill appetite shifts with seasonal e-commerce packaging cycles and regional fiber inventory.',
    },
    buyerInfoNeeded: [
      'Estimated total dry weight (kg) and whether boxes are flattened or baled.',
      'Confirmation of dry indoor storage and absence of wax coating or food grease.',
      'Whether heavy packing tape or plastic strapping has been removed.',
      'Building access hours and vehicle parking clearance.',
    ],
    nextChapterSteps: [
      {
        stage: 'Source Generation',
        detail: 'Campus mailroom flattens delivery cartons instead of tossing them into mixed bins.',
        recordCaptured: 'Source building, dry storage check, preliminary weight estimate',
      },
      {
        stage: 'Structured Listing',
        detail: 'Batch receives a unique ID (e.g., WW-0006) with condition notes and pickup window.',
        recordCaptured: 'Material category, kg quantity, condition disclosure, location',
      },
      {
        stage: 'Potential Buyer Match',
        detail: 'Matched against local dry-fiber aggregators whose minimum kg and dryness rules align.',
        recordCaptured: 'Partner profile selected, transparent match criteria logged',
      },
      {
        stage: 'Recorded Collection',
        detail: 'Collector picks up flattened stacks and facilities steward records dispatch details.',
        recordCaptured: 'Collector name, pickup timestamp, loading-bay handover note',
      },
      {
        stage: 'Recorded Destination',
        detail: 'Intake facility and weight slip reference are logged to complete batch traceability.',
        recordCaptured: 'Facility name, destination type, intake reference, recorder name',
      },
    ],
    destinationExamples: ['Recycled Linerboard Mill', 'Corrugated Box Aggregator', 'Campus Reuse Pool'],
  },
  {
    id: 'Newspaper',
    shortName: 'Newspaper',
    resinOrGrade: 'ONP / De-inked Newsprint',
    summary:
      'Clean reading-room newspapers, circulars, and unlaminated broadsheets.',
    whatItIs:
      'Old Newspaper (ONP) is short-fiber mechanical pulp paper used for dailies, campus bulletins, and inserts. Kept clean and dry, it can be de-inked or pulped into new newsprint and molded fiber products.',
    commonSources: [
      'Library reading rooms and departmental lounges',
      'Hostel common rooms and administrative offices',
      'Campus print publications and surplus event circulars',
    ],
    preparationSteps: [
      'Stack newspapers flat in dry rooms away from humidity or direct sunlight yellowing.',
      'Pull out plastic delivery bags, rubber bands, and glossy coated inserts if requested locally.',
      'Tie stacks into compact 5–10 kg bundles or pack inside dry cardboard cartons.',
      'Never mix with wet kitchen paper, tissues, or carbon/thermal receipt paper.',
    ],
    potentialRoutes: [
      'De-inking paper mills and newsprint recyclers (subject to dryness and low glossy mix).',
      'Molded-pulp manufacturers making egg cartons, fruit trays, and shipping inserts.',
      'Regional paperboard mills blending newsprint with corrugated grades.',
    ],
    valueFactors: {
      cleanliness: 'Water damage, mildew, or food spills quickly render newsprint unusable for repulping.',
      quality: 'Consistent unbleached newsprint separated from glossy magazines grades higher.',
      quantity: 'Consolidating monthly library/hostel bundles makes collection trips worthwhile.',
      location: 'Proximity to urban paper brokers and dry-waste centers lowers collection overhead.',
      demand: 'Varies locally depending on regional mill schedules and molded-pulp production.',
    },
    buyerInfoNeeded: [
      'Total dry weight (kg) and approximate bundle count.',
      'Whether glossy inserts or plastic sleeves have been separated.',
      'Storage age and confirmation of zero moisture or mold.',
      'Preferred campus pickup slot.',
    ],
    nextChapterSteps: [
      {
        stage: 'Source Generation',
        detail: 'Library staff collect weekly reading-room newspapers in a dedicated dry rack.',
        recordCaptured: 'Origin room, dryness verification, stack count',
      },
      {
        stage: 'Structured Listing',
        detail: 'Consolidated monthly batch is weighed and listed with bundle format details.',
        recordCaptured: 'ONP category, total kg, glossy-free note',
      },
      {
        stage: 'Potential Buyer Match',
        detail: 'Matched with paper brokers serving de-inking or molded-pulp mills.',
        recordCaptured: 'Buyer acceptance fit, minimum kg confirmation',
      },
      {
        stage: 'Recorded Collection',
        detail: 'Bundles are loaded during dry weather and signed off by campus coordinator.',
        recordCaptured: 'Collection date, vehicle/driver note, steward name',
      },
      {
        stage: 'Recorded Destination',
        detail: 'Receiving paper depot intake record is attached to the batch passport.',
        recordCaptured: 'Depot name, intake date, recorded weight note',
      },
    ],
    destinationExamples: ['De-Inking Paper Mill', 'Molded-Pulp Tray Plant', 'Regional Paper Broker'],
  },
  {
    id: 'PET beverage bottles',
    shortName: 'PET Bottles',
    resinOrGrade: 'Resin Code #1 · Polyethylene Terephthalate',
    summary:
      'Clear and light-tinted beverage bottles from cafeterias, hostels, and campus events.',
    whatItIs:
      'PET (Resin #1) is a lightweight, shatter-resistant thermoplastic polyester widely used for water and soft-drink bottles. Clear, uncontaminated PET flakes can be reprocessed into fiber, strapping, or food-grade rPET where certified.',
    commonSources: [
      'Student canteens and vending stations',
      'Sports complexes and auditorium events',
      'Hostel hydration and pantry collection bins',
    ],
    preparationSteps: [
      'Empty all remaining liquid completely to prevent fermentation and weight distortion.',
      'Give bottles a quick rinse if they held sugary drinks or dairy beverages.',
      'Crush bottles flat to save storage volume; check locally whether buyers want caps on or separated.',
      'Keep PVC shrink-wrapped bottles, oil bottles, and disposable cups out of the PET stream.',
    ],
    potentialRoutes: [
      'Registered Plastic Waste Processors (PWPs) washing and flaking PET into textile fiber or strapping (subject to local acceptance).',
      'Bottle-to-bottle rPET recyclers where clear sorting and food-contact regulations apply.',
      'Dry-waste Material Recovery Facilities (MRFs) baling sorted #1 bottles.',
    ],
    valueFactors: {
      cleanliness: 'Residual sugary liquid, cigarette butts, or soil lowers flake yield and causes rejection.',
      quality: 'Clear transparent PET is typically preferred over dark-colored or heavy-label bottles.',
      quantity: 'Uncompressed bottles take huge space; crushed 25 kg+ bags improve logistics efficiency.',
      location: 'Urban proximity to PET washing lines significantly affects buyer pickup willingness.',
      demand: 'Shifts with recycled polyester fiber demand and EPR compliance targets.',
    },
    buyerInfoNeeded: [
      'Color breakdown (clear/light blue vs. mixed colors) and confirmation of Resin #1.',
      'Estimated weight (kg) and whether bottles are crushed and bagged.',
      'Whether caps and full-body shrink labels remain attached.',
      'Any food or non-beverage bottles mixed into the batch.',
    ],
    nextChapterSteps: [
      {
        stage: 'Source Generation',
        detail: 'Sports complex installs liquid-drain trays beside #1 PET bottle collection bins.',
        recordCaptured: 'Source zone, drain/rinse check, resin verification',
      },
      {
        stage: 'Structured Listing',
        detail: 'Crushed clear bottles are bagged, weighed, and logged as a distinct PET batch.',
        recordCaptured: 'PET #1 category, kg weight, color & cap notes',
      },
      {
        stage: 'Potential Buyer Match',
        detail: 'Matched with polymer reprocessors accepting bagged crushed #1 bottles.',
        recordCaptured: 'Processor criteria check, location fit explanation',
      },
      {
        stage: 'Recorded Collection',
        detail: 'Collection partner logs sack count and leaves campus pickup confirmation.',
        recordCaptured: 'Collector name, sack count, handover timestamp',
      },
      {
        stage: 'Recorded Destination',
        detail: 'Washing/flaking yard intake is logged on the batch Digital Waste Passport.',
        recordCaptured: 'Facility name, destination type, intake ref',
      },
    ],
    destinationExamples: ['rPET Flaking & Wash Line', 'Polyester Fiber Reprocessor', 'Dry-Waste MRF'],
  },
  {
    id: 'HDPE plastic',
    shortName: 'HDPE Plastic',
    resinOrGrade: 'Resin Code #2 · High-Density Polyethylene',
    summary:
      'Rigid milk jugs, detergent bottles, and triple-rinsed institutional housekeeping containers.',
    whatItIs:
      'HDPE (Resin #2) is a tough, opaque or translucent polyolefin used in milk jugs, personal-care bottles, and rigid utility containers. Sorted by natural vs. colored grades, HDPE regrinds cleanly into pipes, crates, and new containers.',
    commonSources: [
      'Hostel laundry rooms (detergent and softener jugs)',
      'Cafeteria kitchens (food-grade oil or milk jugs, washed)',
      'Facilities housekeeping (non-hazardous cleaner containers)',
    ],
    preparationSteps: [
      'Verify the stamped #2 HDPE triangle on the container base.',
      'Empty and rinse containers thoroughly; never list containers that held toxic solvents, pesticides, or hazardous lab chemicals.',
      'Separate natural (translucent white) HDPE from brightly pigmented colored HDPE if possible.',
      'Remove metal foil seals or pump springs that contain steel.',
    ],
    potentialRoutes: [
      'Rigid polymer recyclers pelletizing HDPE into drainage pipes, pallets, bins, or non-food bottles (subject to rinsing and chemical safety).',
      'Registered CPCB/municipal Plastic Waste Processors under rigid Category I streams.',
    ],
    valueFactors: {
      cleanliness: 'Oil, soap film, or unknown chemical residues sharply reduce processor acceptance.',
      quality: 'Natural unpigmented HDPE has broader remolding flexibility than mixed dark colors.',
      quantity: 'Stacking or nesting rigid jugs increases kg per pickup trip.',
      location: 'Access to industrial rigid-plastic grinders determines transport viability.',
      demand: 'Depends on regional pipe, crate, and blow-molding manufacturing orders.',
    },
    buyerInfoNeeded: [
      'Confirmation of #2 HDPE stamp and prior contents (food/detergent vs. industrial).',
      'Color split (natural vs. mixed colored) and total weight (kg).',
      'Confirmation that containers are rinsed, drained, and free of hazardous labels.',
      'Whether caps or metal pump springs have been removed.',
    ],
    nextChapterSteps: [
      {
        stage: 'Source Generation',
        detail: 'Housekeeping team sets aside triple-rinsed non-hazardous #2 HDPE supply jugs.',
        recordCaptured: 'Prior-contents safety check, #2 resin check',
      },
      {
        stage: 'Structured Listing',
        detail: 'Natural and colored jugs are weighed and documented with safety clearance notes.',
        recordCaptured: 'HDPE #2 category, kg quantity, condition & color note',
      },
      {
        stage: 'Potential Buyer Match',
        detail: 'Matched with rigid-polymer buyers who explicitly accept institutional HDPE.',
        recordCaptured: 'Acceptance rules check, minimum weight alignment',
      },
      {
        stage: 'Recorded Collection',
        detail: 'Collector verifies rinse status at dock and logs pickup handover.',
        recordCaptured: 'Collector ID/name, pickup time, condition sign-off',
      },
      {
        stage: 'Recorded Destination',
        detail: 'Pelletizing or regrind yard intake is recorded to close the batch timeline.',
        recordCaptured: 'Facility name, destination classification, intake ID',
      },
    ],
    destinationExamples: ['Rigid HDPE Regrind & Pellet Plant', 'Industrial Pipe Manufacturer', 'EPR Registered PWP'],
  },
  {
    id: 'Aluminium cans',
    shortName: 'Aluminium Cans',
    resinOrGrade: 'UBC · Non-Ferrous Aluminium Alloy',
    summary:
      'Lightweight beverage cans from student unions, vending zones, and campus events.',
    whatItIs:
      'Used Beverage Cans (UBCs) are rolled from high-grade aluminium alloys. Unlike fibers or many polymers, aluminium can be remelted repeatedly without losing intrinsic metallurgical properties when kept free of moisture and steel.',
    commonSources: [
      'Student union cafés and vending machines',
      'Campus festivals, hackathons, and athletic meets',
      'Hostel common areas',
    ],
    preparationSteps: [
      'Drain every drop of liquid to prevent fermentation odor and inaccurate wet weight.',
      'Test a sample with a magnet—pull out any steel/tin cans (which stick to magnets).',
      'Crush cans flat to cut storage space dramatically and keep bags tidy.',
      'Keep aluminium cans separate from dirty foil wrappers or food-caked trays.',
    ],
    potentialRoutes: [
      'Non-ferrous metal aggregators supplying secondary aluminium remelters and can-sheet mills (subject to dryness and low steel contamination).',
      'Campus sustainability drives pooling cans across multiple hostels to hit scrap-yard pickup minimums.',
    ],
    valueFactors: {
      cleanliness: 'Dry, liquid-free cans avoid weight deductions for moisture and residue.',
      quality: 'Zero steel cans, glass shards, or sand contamination ensures UBC-grade acceptance.',
      quantity: 'Because aluminium is so light (~65 cans per kg), consolidating 10–15 kg+ improves pickup viability.',
      location: 'Local scrap yards are widespread, though direct smelter aggregators prefer larger consolidated loads.',
      demand: 'Closely tracks global and regional aluminium ingot demand.',
    },
    buyerInfoNeeded: [
      'Estimated dry weight (kg) and approximate number of crushed vs. uncrushed sacks.',
      'Confirmation of magnet test (no steel cans mixed in).',
      'Absence of trapped liquids, sand, or food wrappers.',
      'Pickup access details.',
    ],
    nextChapterSteps: [
      {
        stage: 'Source Generation',
        detail: 'Student union places dedicated drained-can bins next to vending machines.',
        recordCaptured: 'Vending zone source, magnet check, drain routine',
      },
      {
        stage: 'Structured Listing',
        detail: 'Crushed cans are weighed on a platform scale and listed as a clean UBC batch.',
        recordCaptured: 'Aluminium cans category, net kg, crushed state',
      },
      {
        stage: 'Potential Buyer Match',
        detail: 'Matched with non-ferrous metal yards accepting campus-scale UBC batches.',
        recordCaptured: 'Partner minimum weight fit, clean-UBC alignment',
      },
      {
        stage: 'Recorded Collection',
        detail: 'Buyer weighs sacks on-site and logs pickup confirmation.',
        recordCaptured: 'Collector name, scale weight note, timestamp',
      },
      {
        stage: 'Recorded Destination',
        detail: 'Secondary metal yard or smelter aggregator intake is recorded on the passport.',
        recordCaptured: 'Receiving yard, destination type, intake reference',
      },
    ],
    destinationExamples: ['Non-Ferrous Metal Aggregator', 'Secondary Aluminium Smelter', 'Regional Scrap Depot'],
  },
  {
    id: 'Iron and steel',
    shortName: 'Iron & Steel',
    resinOrGrade: 'Ferrous Scrap · Tinplate & Mild Steel',
    summary:
      'Magnetic steel food cans, damaged metal shelving, workshop offcuts, and dismantled frames.',
    whatItIs:
      'Ferrous metals (iron and steel) are magnetic alloys found in kitchen tin cans, lab racks, furniture frames, and workshop offcuts. Magnetic separation makes ferrous scrap one of the easiest materials to recover cleanly.',
    commonSources: [
      'Central mess & cafeteria steel food tins',
      'Engineering workshop mild-steel offcuts',
      'Broken hostel bed frames, filing cabinets, and shelving',
    ],
    preparationSteps: [
      'Verify with a magnet—ferrous steel sticks firmly, separating it from aluminium or brass.',
      'Rinse cafeteria food cans thoroughly and press sharp lids inside or store in rigid puncture-safe drums.',
      'Remove wood planks, plastic end-caps, foam cushions, and electrical wiring from furniture frames.',
      'Wear cut-resistant gloves and keep long bars bundled safely away from walkways.',
    ],
    potentialRoutes: [
      'Licensed ferrous scrap yards feeding electric-arc furnace (EAF) steel mills (subject to safety and non-metal removal).',
      'Campus maintenance/fabrication shop reuse for straight mild-steel angles or shelving.',
    ],
    valueFactors: {
      cleanliness: 'Heavy rust scale, oil, or food grease lowers scrap grade.',
      quality: 'Clean, thick-gauge mild steel grades differently from thin tin-coated food cans.',
      quantity: 'Heavy steel quickly builds tonnage, often qualifying for direct pickup trucks.',
      location: 'Ground-level loading clearance matters for bulky frames or heavy drums.',
      demand: 'Tied to regional construction and foundry steel demand.',
    },
    buyerInfoNeeded: [
      'Form factor (rinsed tin cans vs. workshop offcuts vs. dismantled furniture).',
      'Estimated total weight (kg) and longest piece length.',
      'Confirmation that non-metal parts, batteries, and sealed pressurized containers are removed.',
      'Loading bay or ground-floor access notes.',
    ],
    nextChapterSteps: [
      {
        stage: 'Source Generation',
        detail: 'Engineering workshop separates mild-steel offcuts from wood and composite debris.',
        recordCaptured: 'Workshop source, safety & magnet check',
      },
      {
        stage: 'Structured Listing',
        detail: 'Batch is weighed, measured for max piece length, and listed safely.',
        recordCaptured: 'Ferrous category, kg weight, form factor & hazards check',
      },
      {
        stage: 'Potential Buyer Match',
        detail: 'Matched with licensed ferrous yards equipped for light-gauge or structural pickup.',
        recordCaptured: 'Vehicle capability fit, acceptance criteria match',
      },
      {
        stage: 'Recorded Collection',
        detail: 'Scrap hauler loads bundled steel and facilities logs dispatch weight.',
        recordCaptured: 'Collector details, dispatch slip, safety sign-off',
      },
      {
        stage: 'Recorded Destination',
        detail: 'Ferrous scrap yard or foundry weighbridge intake is logged on the passport.',
        recordCaptured: 'Facility name, weighbridge ticket ref, timestamp',
      },
    ],
    destinationExamples: ['Licensed Ferrous Scrap Yard', 'Electric-Arc Steel Foundry', 'Campus Workshop Reuse'],
  },
];
