import { fmtDate, naira } from "./format";
import { invoiceTotal } from "./store";
import { STAGES, type Invoice, type Shipment, type ShipmentDoc } from "./types";

export function docLines(s: Shipment, d: ShipmentDoc, customer?: string) {
  return [
    `**${d.type}`,
    `Document: ${d.name}`,
    `Issued: ${fmtDate(d.date)}`,
    "",
    `**Vehicle`,
    `${s.year} ${s.make} ${s.model}  ·  VIN ${s.vin}`,
    `Tracking ID: ${s.id}`,
    `Customer: ${customer ?? "—"}`,
    "",
    `**Shipping`,
    `Origin: ${s.originPort} (${s.originCountry})`,
    `Destination: ${s.destinationPort} Port, Lagos → ${s.destinationState}`,
    `Vessel: ${s.vessel}   Container: ${s.container}`,
    `Current stage: ${STAGES[s.stage]}`,
  ];
}

export function invoiceLines(inv: Invoice, customer?: string) {
  return [
    `**Invoice ${inv.number}`,
    `Billed to: ${customer ?? "—"}`,
    `Issued: ${fmtDate(inv.issuedAt)}   Due: ${fmtDate(inv.dueAt)}`,
    inv.shipmentId ? `Shipment: ${inv.shipmentId}` : "",
    "",
    "**Items",
    ...inv.items.map((i) => `${i.description}  ·  ${naira(i.amount)}`),
    "",
    `**Total: ${naira(invoiceTotal(inv))}`,
    `Status: ${inv.status === "paid" ? `PAID on ${fmtDate(inv.paidAt)}` : "UNPAID"}`,
  ];
}

