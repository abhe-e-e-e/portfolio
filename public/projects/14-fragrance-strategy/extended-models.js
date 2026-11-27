export function evEconomics({price, delivery, pods, turns, demand}) {
  const days = 26;
  const fixed = 12000;
  const variableCost = (30 / 0.88) * 0.55 + delivery + 8 + 4;
  const contribution = price - variableCost;
  const capacity = Math.floor(pods * turns * days);
  const completed = Math.min(demand, capacity);
  return {
    variableCost, contribution, capacity, completed,
    unmet: Math.max(0, demand - capacity),
    breakEven: contribution > 0 ? Math.ceil(fixed / contribution) : null,
    monthly: completed * contribution - fixed
  };
}

export function fragranceEconomics({kitPrice, bottlePrice, conversion, cac}) {
  const kitMargin = kitPrice - 35;
  const bottleMargin = bottlePrice - 30 - 110 - 20 - 12;
  return {
    kitMargin, bottleMargin,
    contribution: kitMargin - cac + (conversion / 100) * bottleMargin,
    breakEven: kitMargin >= cac ? 0 : bottleMargin > 0 ? (cac - kitMargin) / bottleMargin : null
  };
}

export function experimentEffect(result) {
  const control = result.control / result.control_n;
  const treatment = result.treatment / result.treatment_n;
  const lift = treatment - control;
  const standardError = Math.sqrt(
    control * (1 - control) / result.control_n +
    treatment * (1 - treatment) / result.treatment_n
  );
  return {control, treatment, lift, lower: lift - 1.96 * standardError, upper: lift + 1.96 * standardError};
}
