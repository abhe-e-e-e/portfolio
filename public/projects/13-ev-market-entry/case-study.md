# 13 / A neighbourhood pilot for mobile EV charging

Independent strategy exercise. Research checked 15 November 2026. All proposed operations, budgets, demand estimates and thresholds below are assumptions; no pilot has been run. This is not an account of PLUSX work or a recommendation made to that company.

## Decision

Test scheduled charging in one compact residential cluster before offering citywide, immediate dispatch. The key uncertainty is paid repeat demand at a route density that covers equipment and delivery costs. A large number of EVs alone does not answer that question.

## Evidence ledger

DEWA reported 47,944 EVs in Dubai at the end of 2025, up from 37,486 a year earlier. It also reported more than 1,860 charging points, including licensed partner infrastructure, and 23,600 registered Green Charger users by mid-January 2026. These are different populations: dividing vehicles by charging points is not a measure of utilisation or unmet demand. [DEWA, February 2026](https://dewa.gov.ae/en/about-us/media-publications/latest-news/2026/2/dewa-accelerates-dubais-shift-to-sustainable-mobility-by-expanding-ev-green-charger-network).

PLUSX publicly advertises portable charging at the customer's location, with 30 kWh at AED 109 plus VAT and 50 kWh at AED 159 plus VAT. These are observed advertised packages, not independently verified transaction prices. They demonstrate an existing mobile competitor and a convenience premium, not a vacant market. [PLUSX service page, accessed 15 November 2026](https://plusxelectric.com/mobile-ev-charging-dubai).

DEWA provides a public charging network and guest charging access. It is a substitute for mobile charging, rather than the same delivery model. The public regulatory framework covers charging infrastructure and independent operators. The exact licensing, vehicle, fire-safety, insurance and permitted pricing treatment for the proposed mobile service requires confirmation before a pilot. [DEWA service guide](https://www.dewa.gov.ae/en/about-us/service-guide/consumer-services/ev-charging) and [regulatory framework](https://www.dewa.gov.ae/en/builder/useful-tools/regulatory-framework-for-ev-charging-infrastructure).

## Segment choices

| Segment | Need hypothesis | Attractive feature | Reason to defer or test |
|---|---|---|---|
| Apartment residents without reliable home charging | Predictable overnight charge without moving the car | Repeated visits within one building | Building access and overnight equipment custody |
| Small fleets at a shared depot | Scheduled top-up before a shift | Dense demand and one buyer | Fleet price sensitivity; fixed charging may win |
| Roadside emergencies | Enough energy to reach a charger | High urgency | Unpredictable geography and demanding response times |
| Hotels and valet operators | Guest convenience | Distribution partner | Liability, handover and parking access |

Start with apartment residents through two cooperating buildings. Validate access before advertising. Interview 20 owners and two property managers; recruit using a transparent proposed service and refundable interest reservation, not invented availability.

## Competitive response

PLUSX already offers mobile delivery. A new entrant must prove a narrower advantage such as reliable scheduled building rounds; copying its feature list is insufficient. Public charging competes on infrastructure access and avoids the mobile delivery leg. Home charging removes repeated delivery costs where installation is practical. A fleet contract may be served better by permanent equipment. Reject customers for whom an alternative is a better fit.

## Illustrative economics in AED, excluding VAT

Assume a 30 kWh session at 109, purchased energy at 0.55/kWh, 88% energy efficiency, 30 of delivery labour/vehicle cost, 8 of equipment wear and 4 of payment/support cost.

`energy_cost = 30 / 0.88 * 0.55 = 18.75`

`contribution_per_session = 109 - 18.75 - 30 - 8 - 4 = 48.25`

With 12,000 monthly fixed costs, break-even requires `ceil(12000 / 48.25) = 249` sessions per month, or 9.58 per operating day over 26 days. This is contribution break-even, not cash payback: deposits, equipment purchases, working capital, financing and taxes are excluded. The 0.55 energy assumption is not a quotation or a claim about the applicable tariff.

| Scenario | Price | Delivery cost | Contribution/session | Sessions/month to cover 12,000 |
|---|---:|---:|---:|---:|
| Dense scheduled route | 109 | 20 | 58.25 | 207 |
| Base | 109 | 30 | 48.25 | 249 |
| Dispersed route | 109 | 50 | 28.25 | 425 |
| Lower price, base route | 89 | 30 | 28.25 | 425 |

Capacity check: six pods, two completed turns per pod per operating day, and 26 days give a theoretical ceiling of 312 sessions. The base break-even consumes 80% of that ceiling; recharge, transport, cancellations and downtime make it fragile. If only one turn per pod is feasible, the 156-session ceiling cannot support the base case. A dispatch simulation must track pod occupancy and recharge as well as driver time.

## Six-week pilot proposal

Weeks 1–2: confirm operating permissions, obtain equipment and insurance quotations, secure building access, and collect interviews. Stop if compliance or safe access is unresolved. Weeks 3–4: a capped paid trial, limited to two scheduled delivery windows in one cluster. Weeks 5–6: offer repeat bookings without introductory discounts and measure actual delivery time, energy losses and repeat demand.

Instrument each request with consented pseudonymous customer ID, request time, promised window, arrival, completion, kWh, travel minutes, cancellation reason, charge failures and variable cost. Report both cancelled and completed requests. Suggested decision thresholds: at least 90% within the promised window, contribution at least AED 45 after observed variable costs, no unresolved safety incident, and at least 30% of eligible first-time customers rebooking within 30 days. These thresholds are management choices, not industry standards; the six-week trial leaves some cohorts immature.

Do not scale based on a small satisfaction survey. Scale only if repeat demand and measured capacity support break-even under a slower-route sensitivity. Otherwise narrow the service window, change the cluster, or stop.

## Limitations and reproducibility

This is desk research plus an explicit arithmetic model. There is no primary customer research, supplier quote, route telemetry, completed experiment or causal estimate. Research is time-sensitive and prices should be rechecked. Reproduce the base case from the formulas above, or use the portfolio calculator to vary price, variable costs and fixed cost. Measured result here means the calculated scenario output, not commercial performance.

## Portfolio writeup

Built an independent market-entry case for a scheduled mobile charging service in Dubai. Compared direct and substitute competitors, separated public evidence from operating assumptions, and used contribution and pod-capacity constraints to define a small pilot and stop conditions.
