"use client";

import { useEffect, useState } from "react";
import { Building2, Calculator, RotateCcw, Save } from "lucide-react";
import { toast } from "sonner";
import { PageHeader, Panel } from "@/components/admin/ui";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/input";
import { DEFAULT_ESTIMATOR, type EngineType, type EstimatorConfig } from "@/lib/config";
import { useStore } from "@/lib/store";
import type { CompanySettings } from "@/lib/types";

const PCT_FIELDS: [keyof EstimatorConfig, string, string][] = [
  ["importDutyPct", "Import duty", "% of CIF"],
  ["levyPct", "Vehicle levy", "% of CIF"],
  ["surchargePct", "Surcharge", "% of duty"],
  ["cissPct", "CISS", "% of value"],
  ["etlsPct", "ETLS", "% of CIF"],
  ["vatPct", "VAT", "% of subtotal"],
  ["agePenaltyPct", "Age surcharge", "% of CIF"],
  ["agePenaltyYears", "Age surcharge applies after", "years"],
];

export default function SettingsPage() {
  const { db, updateSettings } = useStore();
  const [company, setCompany] = useState<CompanySettings>(db.company);
  const [est, setEst] = useState<EstimatorConfig>(db.estimator);

  useEffect(() => {
    setCompany(db.company);
    setEst(db.estimator);
  }, [db.company, db.estimator]);

  const num = (v: string) => (v === "" ? 0 : Number(v));

  return (
    <div>
      <PageHeader title="Settings" subtitle="Company details and the estimator's placeholder percentages" />
      <div className="grid gap-6 xl:grid-cols-2">
        <Panel className="p-5 sm:p-7">
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-2xl bg-[#eef6fc] text-navy">
              <Building2 className="size-5" />
            </span>
            <div>
              <p className="font-bold">Company info</p>
              <p className="text-xs text-muted-foreground">Shown in the website footer and on the contact page</p>
            </div>
          </div>
          <form
            className="mt-6 space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              updateSettings({ company });
              toast.success("Company info saved", { description: "The website footer and contact page are updated." });
            }}
          >
            <Field label="Business name">
              <Input value={company.name} onChange={(e) => setCompany({ ...company, name: e.target.value })} />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Phone">
                <Input value={company.phone} onChange={(e) => setCompany({ ...company, phone: e.target.value })} />
              </Field>
              <Field label="Email">
                <Input value={company.email} onChange={(e) => setCompany({ ...company, email: e.target.value })} />
              </Field>
            </div>
            <Field label="Address">
              <Input value={company.address} onChange={(e) => setCompany({ ...company, address: e.target.value })} />
            </Field>
            <Field label="Opening hours">
              <Input value={company.hours} onChange={(e) => setCompany({ ...company, hours: e.target.value })} />
            </Field>
            <Button type="submit">
              <Save /> Save company info
            </Button>
          </form>
        </Panel>

        <Panel className="p-5 sm:p-7">
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-2xl bg-gold-soft text-[#7a5410]">
              <Calculator className="size-5" />
            </span>
            <div>
              <p className="font-bold">Duty & clearing estimator</p>
              <p className="text-xs text-muted-foreground">Placeholder values. Used by the public estimator page.</p>
            </div>
          </div>
          <form
            className="mt-6"
            onSubmit={(e) => {
              e.preventDefault();
              updateSettings({ estimator: est });
              toast.success("Estimator updated", { description: "The public estimator now uses these figures." });
            }}
          >
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {PCT_FIELDS.map(([k, label, unit]) => (
                <Field key={k} label={label} hint={unit}>
                  <Input type="number" step="0.1" value={est[k] as number} onChange={(e) => setEst({ ...est, [k]: num(e.target.value) })} />
                </Field>
              ))}
            </div>
            <p className="mb-3 mt-6 text-sm font-bold">Engine multipliers</p>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {(Object.keys(est.engineMultiplier) as EngineType[]).map((k) => (
                <Field key={k} label={k}>
                  <Input type="number" step="0.05" value={est.engineMultiplier[k]} onChange={(e) => setEst({ ...est, engineMultiplier: { ...est.engineMultiplier, [k]: num(e.target.value) } })} />
                </Field>
              ))}
            </div>
            <p className="mb-3 mt-6 text-sm font-bold">Flat charges (₦)</p>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              <Field label="Port & terminal">
                <Input type="number" value={est.portTerminalNGN} onChange={(e) => setEst({ ...est, portTerminalNGN: num(e.target.value) })} />
              </Field>
              <Field label="Agency fee">
                <Input type="number" value={est.agencyFeeNGN} onChange={(e) => setEst({ ...est, agencyFeeNGN: num(e.target.value) })} />
              </Field>
              <Field label="Default ₦/$ rate">
                <Input type="number" value={est.defaultRate} onChange={(e) => setEst({ ...est, defaultRate: num(e.target.value) })} />
              </Field>
            </div>
            <p className="mb-3 mt-6 text-sm font-bold">Delivery by destination (₦)</p>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {Object.entries(est.deliveryNGN).map(([zone, v]) => (
                <Field key={zone} label={zone}>
                  <Input type="number" value={v} onChange={(e) => setEst({ ...est, deliveryNGN: { ...est.deliveryNGN, [zone]: num(e.target.value) } })} />
                </Field>
              ))}
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              <Button type="submit">
                <Save /> Save estimator
              </Button>
              <Button type="button" variant="ghost" onClick={() => setEst(structuredClone(DEFAULT_ESTIMATOR))}>
                <RotateCcw /> Restore defaults
              </Button>
            </div>
          </form>
        </Panel>
      </div>
    </div>
  );
}
