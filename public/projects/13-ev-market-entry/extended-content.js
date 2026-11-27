export const studies = {
  1: {
    title: 'Retail Inventory Reconciliation',
    category: 'Retail operations',
    question: 'Which shelf-count discrepancies should the stock team investigate first?',
    method: 'Compute expected units from opening stock, receipts, sales and returns. Compare each SKU to its physical count, apply a unit tolerance and rank exceptions by absolute cost exposure.',
    limit: 'The stock movements and counts are synthetic. Variance is a signal to recount and check cutoff times. It does not identify the cause or post a stock adjustment.',
    next: 'Recount the highest-exposure SKU before checking late receipts, cancelled sales and returns against the count cutoff.'
  },
  11: {
    title: 'Procurement Spend Analytics',
    category: 'Procurement analytics',
    question: 'Where does supplier concentration or unit-price variation justify a sourcing review?',
    method: 'Deduplicate invoice IDs, reject nonpositive quantities and prices, standardize supplier names, and classify by item. For each comparable SKU, estimate the difference between observed spend and repricing every order to the lowest observed price.',
    limit: 'The invoices are synthetic and use one line per invoice. Lowest observed price is a benchmark. Order size, availability, delivery and contractual terms may make it unattainable.',
    next: 'Start with the highest-value SKU opportunity. Confirm that prices are comparable and ask the buyer to validate volume and service terms.'
  },
  12: {
    title: 'Mobile App QA Case Study',
    category: 'Product quality',
    question: 'Can an EV booking release safely handle capacity and calculate a correct quote?',
    method: 'Exercise a mobile-sized booking prototype against four requirements. Run the regression matrix against an intentionally defective build and a corrected candidate. Each defect includes steps, expected behavior, observed behavior and a linked test.',
    limit: 'This prototype has no real booking system, network or payment flow. Release readiness covers only the five supplied scenarios. Device, accessibility, concurrency and network tests would be required for a production release.',
    next: 'Hold the defective build. Hand the corrected candidate to broader testing once the focused suite passes.'
  },
  13: {
    title: 'Dubai EV Charging Market Entry',
    category: 'Market entry case',
    question: 'Can a scheduled mobile charging pilot reach break-even in one Dubai residential cluster?',
    method: 'Compare apartment residents, fleets, roadside emergencies and hotel valet operators. Model price, delivery cost and physical pod capacity, then define a six-week pilot and go/no-go criteria.',
    limit: 'The research memo separates public evidence from operating assumptions. Model results exclude VAT, capital expenditure, working capital and financing. Pilot-specific approvals and measured route performance remain open.',
    next: 'Validate building access and demand with two property managers and 20 residents. Track paid repeat demand, arrival within the promised window, realized contribution and actual pod turns.'
  },
  14: {
    title: 'Luxury Fragrance Product Strategy',
    category: 'Product strategy case',
    question: 'Can a paid discovery kit make it easier for customers to choose a full bottle?',
    method: 'Position a three-scent home trial for premium buyers in Dubai. Compare established discovery formats and model how the kit margin, acquisition cost, credit and bottle conversion affect contribution.',
    limit: 'The concept, test prices and unit costs are assumptions. The model excludes VAT, refunds, fixed development and inventory risk. The research references are category context and do not establish local demand.',
    next: 'Run an 80-customer feasibility batch before funding a larger comparison of guided wear notes and a standard discovery insert.'
  },
  15: {
    title: 'Startup Experiment Dashboard',
    category: 'Growth analytics',
    question: 'Where should a small startup allocate its next acquisition budget?',
    method: 'Allocate budget between three channels, apply channel-specific funnel assumptions and compare cost per activated user and week-four retained users. Track separate synthetic cohort results and experiment effect estimates.',
    limit: 'All inputs are synthetic. The channel model assumes stable rates and costs when budget changes. Experiment intervals are unadjusted normal approximations for independent arms. Treat small or multiple experiments as exploratory.',
    next: 'Check activation and retention together before shifting spend. Size a follow-up experiment around the smallest lift that would justify the change.'
  }
};
