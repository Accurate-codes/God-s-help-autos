/**
 * Placeholder business constants and the Duty & Clearing Estimator percentages.
 * Every figure here is illustrative only. God's Help Autos confirms final figures.
 * Admin → Settings can override the estimator values during the demo (saved to localStorage).
 */

export const COMPANY = {
  name: "God's Help Autos",
  address: "Junior Grammar School, 374 Ogunnusi Rd, Ojodu, Ojodu Berger 101233, Lagos",
  shortAddress: "Ojodu Berger, Lagos",
  phone: "0806 575 4819",
  phoneIntl: "+2348065754819",
  whatsapp: "2348065754819",
  email: "hello@godshelpautos.ng",
  hours: "Open 24 hours",
  rating: 4.4,
  reviews: 35,
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=God%27s+Help+Autos%2C+374+Ogunnusi+Rd%2C+Ojodu+Berger%2C+Lagos",
  mapsEmbed:
    "https://www.google.com/maps?q=God%27s+Help+Autos,+374+Ogunnusi+Rd,+Ojodu+Berger+101233,+Lagos&output=embed",
};

export function waLink(message?: string, number: string = COMPANY.whatsapp) {
  const base = `https://wa.me/${number}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export function telLink(phoneIntl: string = COMPANY.phoneIntl) {
  return `tel:${phoneIntl}`;
}

export type EngineType = "Petrol" | "Diesel" | "Hybrid" | "Electric";

export type EstimatorConfig = {
  /** Import duty, % of CIF value */
  importDutyPct: number;
  /** Levy on vehicles, % of CIF value */
  levyPct: number;
  /** Surcharge, % of import duty */
  surchargePct: number;
  /** CISS, % of FOB value */
  cissPct: number;
  /** ETLS, % of CIF value */
  etlsPct: number;
  /** VAT, % of (CIF + duty + levy + surcharge + CISS + ETLS) */
  vatPct: number;
  /** Extra charge for cars older than `agePenaltyYears`, % of CIF */
  agePenaltyPct: number;
  agePenaltyYears: number;
  /** Multiplier on duty/levy by engine type */
  engineMultiplier: Record<EngineType, number>;
  /** Port & terminal charges (₦, flat) */
  portTerminalNGN: number;
  /** God's Help Autos clearing agency fee (₦, flat) */
  agencyFeeNGN: number;
  /** Delivery cost from Lagos port by destination zone (₦) */
  deliveryNGN: Record<string, number>;
  /** Default USD → NGN rate shown in the estimator (user-editable) */
  defaultRate: number;
};

export const DEFAULT_ESTIMATOR: EstimatorConfig = {
  importDutyPct: 20,
  levyPct: 15,
  surchargePct: 7,
  cissPct: 1,
  etlsPct: 0.5,
  vatPct: 7.5,
  agePenaltyPct: 10,
  agePenaltyYears: 15,
  engineMultiplier: { Petrol: 1, Diesel: 1.05, Hybrid: 0.9, Electric: 0.75 },
  portTerminalNGN: 450_000,
  agencyFeeNGN: 350_000,
  deliveryNGN: {
    "Lagos": 85_000,
    "Ogun": 150_000,
    "Oyo": 220_000,
    "Osun / Ondo / Ekiti": 260_000,
    "Edo / Delta": 320_000,
    "Abuja (FCT)": 450_000,
    "Anambra / Enugu / Imo": 380_000,
    "Rivers / Bayelsa": 400_000,
    "Kano / Kaduna (North)": 550_000,
  },
  defaultRate: 1550,
};

export type EstimateInput = {
  valueUSD: number;
  year: number;
  engine: EngineType;
  rate: number;
  zone: string;
};

export type EstimateLine = { label: string; ngn: number; hint?: string };

export function estimate(input: EstimateInput, cfg: EstimatorConfig, currentYear = 2026) {
  const cif = input.valueUSD * input.rate;
  const mult = cfg.engineMultiplier[input.engine] ?? 1;
  const duty = cif * (cfg.importDutyPct / 100) * mult;
  const levy = cif * (cfg.levyPct / 100) * mult;
  const surcharge = duty * (cfg.surchargePct / 100);
  const ciss = cif * (cfg.cissPct / 100);
  const etls = cif * (cfg.etlsPct / 100);
  const age = currentYear - input.year;
  const agePenalty = age > cfg.agePenaltyYears ? cif * (cfg.agePenaltyPct / 100) : 0;
  const vat = (cif + duty + levy + surcharge + ciss + etls) * (cfg.vatPct / 100);
  const customs = duty + levy + surcharge + ciss + etls + vat + agePenalty;
  const delivery = cfg.deliveryNGN[input.zone] ?? 0;

  const lines: EstimateLine[] = [
    { label: "Import duty", ngn: duty, hint: `${cfg.importDutyPct}% of CIF × ${mult} (${input.engine})` },
    { label: "Vehicle levy", ngn: levy, hint: `${cfg.levyPct}% of CIF` },
    { label: "Surcharge", ngn: surcharge, hint: `${cfg.surchargePct}% of duty` },
    { label: "CISS + ETLS", ngn: ciss + etls, hint: `${cfg.cissPct}% + ${cfg.etlsPct}%` },
    { label: "VAT", ngn: vat, hint: `${cfg.vatPct}%` },
  ];
  if (agePenalty > 0) lines.push({ label: "Age surcharge", ngn: agePenalty, hint: `Over ${cfg.agePenaltyYears} years old` });
  lines.push(
    { label: "Port & terminal charges", ngn: cfg.portTerminalNGN, hint: "Apapa / Tin Can (flat)" },
    { label: "Agency (clearing) fee", ngn: cfg.agencyFeeNGN, hint: "God's Help Autos" },
    { label: "Delivery", ngn: delivery, hint: input.zone },
  );
  const total = customs + cfg.portTerminalNGN + cfg.agencyFeeNGN + delivery;
  return { cif, lines, customs, total, totalUSD: total / input.rate };
}
