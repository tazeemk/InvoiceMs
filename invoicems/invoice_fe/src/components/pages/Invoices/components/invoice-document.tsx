"use client";

import React from "react";
import { ArrowLeft, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Invoice } from "@/impData/types";
import { companyDetails } from "@/lib/company";
import KeyarLogo from "@/components/KeyarLogo";

interface InvoiceDocumentProps {
  invoice: Invoice;
  onBack: () => void;
  onEdit?: () => void;
}

const formatAmount = (value?: number) => (Number(value) || 0).toFixed(2);

const formatDate = (value?: string) => {
  if (!value) return "";
  const date = new Date(`${value.slice(0, 10)}T00:00:00`);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString("en-GB");
};

const numberToWords = (amount: number) => {
  const ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"];
  const teens = ["Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
  const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

  const underThousand = (value: number): string => {
    const parts: string[] = [];
    if (value >= 100) parts.push(`${ones[Math.floor(value / 100)]} Hundred`);
    const remainder = value % 100;
    if (remainder >= 10 && remainder < 20) parts.push(teens[remainder - 10]);
    else if (remainder >= 20) {
      parts.push(`${tens[Math.floor(remainder / 10)]}${remainder % 10 ? ` ${ones[remainder % 10]}` : ""}`);
    } else if (remainder > 0) parts.push(ones[remainder]);
    return parts.join(" ");
  };

  const integer = Math.floor(Math.abs(Number(amount) || 0));
  if (integer === 0) return "Zero Only";

  const groups = [
    { value: Math.floor(integer / 10000000), label: "Crore" },
    { value: Math.floor((integer % 10000000) / 100000), label: "Lakh" },
    { value: Math.floor((integer % 100000) / 1000), label: "Thousand" },
    { value: integer % 1000, label: "" },
  ];
  return `${groups.filter(group => group.value > 0).map(group => `${underThousand(group.value)} ${group.label}`.trim()).join(" ")} Only`;
};

export const InvoiceViewPage: React.FC<InvoiceDocumentProps> = ({ invoice, onBack }) => {
  const items = invoice.items || [];
  const invoiceDetails = invoice as Invoice & { stateCode?: string };
  const taxableAmount = items.reduce(
    (sum, item) => sum + (item.taxableAmount ?? item.quantity * item.rate),
    0,
  );
  const subtotal = invoice.subtotal || taxableAmount;
  const totalTax = invoice.taxAmount || 0;
  const cgstAmount = invoice.cgstAmount ?? totalTax / 2;
  const sgstAmount = invoice.sgstAmount ?? totalTax / 2;
  const igstAmount = invoice.igstAmount ?? 0;
  const formatTaxRate = (amount: number) =>
    subtotal > 0 && amount > 0 ? `${((amount / subtotal) * 100).toFixed(2)}%` : "";
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
  const blankRows = Math.max(0, 10 - items.length);

  return (
    <>
      <div className="keyar-screen-actions">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <Button variant="outline" onClick={() => window.print()}>
          <Printer className="mr-2 h-4 w-4" /> Print
        </Button>
      </div>

      <main className="keyar-print-area">
        <article className="keyar-invoice">
          <header className="keyar-company-header">
            <div className="keyar-header-meta">
              <span>GSTIN: {companyDetails.gstin}</span>
              <span>{companyDetails.phones.join(", ")}</span>
            </div>
            <KeyarLogo width={112} height={52} className="keyar-logo" />
            <h1>{companyDetails.name}</h1>
            <p className="keyar-company-address">
              {companyDetails.addressLines.map((line) => <span key={line}>{line}</span>)}
            </p>
            <p className="keyar-company-contact">Phone: {companyDetails.phones.join(", ")}</p>
            <div className="keyar-invoice-heading">
              <span>Invoice No.: {invoice.invoiceNumber}</span>
              <strong>TAX INVOICE</strong>
              <span>Date: {formatDate(invoice.invoiceDate)}</span>
            </div>
          </header>

          <section className="keyar-customer-details" aria-label="Customer details">
            <p><strong>Name:</strong><span>{invoice.customerName}</span></p>
            <p><strong>Address:</strong><span>{invoice.billingAddress || ""}</span></p>
            <p><strong>GSTIN Unique:</strong><span>{invoice.gstin || ""}</span></p>
            <p className="keyar-customer-inline">
              <strong>State:</strong><span>{invoice.state || ""}</span>
              <strong>State Code:</strong><span>{invoiceDetails.stateCode || invoice.gstin?.slice(0, 2) || ""}</span>
              <strong>Mob:</strong><span>{invoice.mobile || ""}</span>
            </p>
          </section>

          <table className="keyar-items-table">
            <colgroup>
              <col className="keyar-description-column" />
              <col className="keyar-hsn-column" />
              <col className="keyar-quantity-column" />
              <col className="keyar-unit-column" />
              <col className="keyar-rate-column" />
              <col className="keyar-amount-column" />
            </colgroup>
            <thead>
              <tr>
                <th>Description of Goods</th>
                <th>HSN Code</th>
                <th>Weight / Qty</th>
                <th>Unit</th>
                <th>Rate</th>
                <th>Amount<br />Rs. / P.</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={item.id || `${item.itemName}-${index}`}>
                  <td>{item.itemName}{item.description ? <small>{item.description}</small> : null}</td>
                  <td className="keyar-center">{item.hsnCode || ""}</td>
                  <td className="keyar-center">{item.quantity}</td>
                  <td className="keyar-center">{item.unit || ""}</td>
                  <td className="keyar-number">{formatAmount(item.rate)}</td>
                  <td className="keyar-number">{formatAmount(item.totalAmount)}</td>
                </tr>
              ))}
              {Array.from({ length: blankRows }, (_, index) => (
                <tr className="keyar-blank-row" key={`blank-${index}`}>
                  <td>&nbsp;</td><td></td><td></td><td></td><td></td><td></td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td><strong>Total</strong></td>
                <td></td>
                <td className="keyar-center"><strong>{totalQuantity}</strong></td>
                <td></td>
                <td></td>
                <td className="keyar-number"><strong>{formatAmount(invoice.totalAmount)}</strong></td>
              </tr>
            </tfoot>
          </table>

          <section className="keyar-totals">
            <div className="keyar-words-block">
              <strong>Amount in Words</strong>
              <p>Rupees {numberToWords(invoice.totalAmount)}</p>
            </div>
            <div className="keyar-tax-block">
              <div><strong>Taxable Value</strong><span>{formatAmount(subtotal)}</span></div>
              <div><strong>SGST</strong><span>{formatTaxRate(sgstAmount)}</span><span>{formatAmount(sgstAmount)}</span></div>
              <div><strong>CGST</strong><span>{formatTaxRate(cgstAmount)}</span><span>{formatAmount(cgstAmount)}</span></div>
              <div><strong>IGST</strong><span>{formatTaxRate(igstAmount)}</span><span>{formatAmount(igstAmount)}</span></div>
              <div><strong>Total GST</strong><span></span><span>{formatAmount(totalTax)}</span></div>
              <div className="keyar-grand-total"><strong>Grand Total</strong><strong>{formatAmount(invoice.totalAmount)}</strong></div>
            </div>
          </section>

          <footer className="keyar-invoice-footer">
            <div className="keyar-bank-details">
              <p><strong>A/C Holder Name:</strong> {companyDetails.name}</p>
              <p><strong>Bank Name:</strong> {companyDetails.bank}</p>
              <p><strong>Branch:</strong> {companyDetails.branch}</p>
              <p><strong>Bank A/C No:</strong> {companyDetails.accountNumber}</p>
              <p><strong>IFSC Code:</strong> {companyDetails.ifsc}</p>
              <p className="keyar-note">Note: All disputes are subject to Jaunpur jurisdiction only.</p>
            </div>
            <div className="keyar-signature">
              <span>For, {companyDetails.name}</span>
              <div className="keyar-signature-space" />
              <strong>Authorised Signatory</strong>
            </div>
          </footer>
        </article>
      </main>

      <style jsx global>{`
        .keyar-screen-actions {
          display: flex;
          justify-content: flex-end;
          gap: 8px;
          max-width: 210mm;
          margin: 0 auto 12px;
        }
        .keyar-print-area {
          box-sizing: border-box;
          width: min(100%, 210mm);
          margin: 0 auto;
          padding: 7mm;
          background: #fff;
        }
        .keyar-invoice {
          --invoice-green: #71904d;
          box-sizing: border-box;
          min-height: 280mm;
          border: 1.5px solid var(--invoice-green);
          color: #20231d;
          background: #fff;
          font-family: Arial, Helvetica, sans-serif;
          font-size: 10px;
          line-height: 1.25;
        }
        .keyar-company-header {
          position: relative;
          min-height: 42mm;
          padding: 4mm 5mm 0;
          border-bottom: 1.5px solid var(--invoice-green);
          text-align: center;
        }
        .keyar-header-meta {
          display: flex;
          justify-content: space-between;
          color: #26351c;
          font-size: 9px;
          font-weight: 700;
        }
        .keyar-logo {
          display: block;
          margin: -1mm auto 0;
          object-fit: contain;
        }
        .keyar-company-header h1 {
          margin: 0;
          color: #bd5a4d;
          font-size: 16px;
          font-weight: 700;
        }
        .keyar-company-address {
          margin: 1mm 0;
          font-size: 8px;
          line-height: 1.2;
        }
        .keyar-company-address span { display: block; }
        .keyar-company-contact {
          margin: 1mm 0 2mm;
          font-size: 9px;
        }
        .keyar-invoice-heading {
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: center;
          min-height: 9mm;
          border-top: 1px solid var(--invoice-green);
          text-align: left;
          font-size: 10px;
        }
        .keyar-invoice-heading strong {
          color: #bd5a4d;
          font-size: 14px;
        }
        .keyar-invoice-heading span:last-child { text-align: right; }
        .keyar-customer-details {
          padding: 3mm 5mm 2mm;
          border-bottom: 1px solid var(--invoice-green);
        }
        .keyar-customer-details p {
          display: flex;
          gap: 6px;
          min-height: 6mm;
          margin: 0;
          border-bottom: 1px dotted #a5ad9b;
          align-items: center;
        }
        .keyar-customer-details p strong { flex: 0 0 auto; }
        .keyar-customer-details p span { flex: 1; }
        .keyar-customer-inline { gap: 5px !important; }
        .keyar-customer-inline strong:not(:first-child) { margin-left: 8px; }
        .keyar-items-table {
          width: 100%;
          border-collapse: collapse;
          table-layout: fixed;
          font-size: 9px;
        }
        .keyar-items-table th,
        .keyar-items-table td {
          padding: 1.5mm 1mm;
          border-right: 1px solid #8c9b79;
          border-bottom: 1px solid #a7b198;
          vertical-align: middle;
        }
        .keyar-items-table th {
          height: 11mm;
          background: #d5e0c7;
          color: #26351c;
          font-weight: 700;
          text-align: center;
        }
        .keyar-items-table td:first-child,
        .keyar-items-table th:first-child { text-align: left; }
        .keyar-description-column { width: 39%; }
        .keyar-hsn-column { width: 12%; }
        .keyar-quantity-column { width: 14%; }
        .keyar-unit-column { width: 9%; }
        .keyar-rate-column { width: 12%; }
        .keyar-amount-column { width: 14%; }
        .keyar-items-table td small {
          display: block;
          margin-top: 1px;
          color: #59624f;
        }
        .keyar-center { text-align: center; }
        .keyar-number { text-align: right; white-space: nowrap; }
        .keyar-blank-row { height: 9mm; }
        .keyar-items-table tfoot td {
          height: 8mm;
          background: #eef2e8;
        }
        .keyar-totals {
          display: grid;
          grid-template-columns: 1fr 0.9fr;
          min-height: 31mm;
          border-bottom: 1px solid var(--invoice-green);
        }
        .keyar-words-block {
          padding: 4mm;
          border-right: 1px solid var(--invoice-green);
        }
        .keyar-words-block p {
          min-height: 11mm;
          margin: 3mm 0 0;
          border-bottom: 1px dotted #a5ad9b;
        }
        .keyar-tax-block > div {
          display: grid;
          grid-template-columns: minmax(0, 1fr) 14mm 24mm;
          min-height: 5mm;
          padding: 1mm 3mm;
          border-bottom: 1px solid #d4dacd;
        }
        .keyar-tax-block > div span { text-align: right; }
        .keyar-grand-total {
          background: #d5e0c7;
        }
        .keyar-invoice-footer {
          display: grid;
          grid-template-columns: 1fr 1fr;
          min-height: 31mm;
        }
        .keyar-bank-details {
          padding: 3mm;
          border-right: 1px solid var(--invoice-green);
          font-size: 8px;
        }
        .keyar-bank-details p { margin: 1mm 0; }
        .keyar-note {
          margin: 3mm -3mm -3mm !important;
          padding: 2mm 3mm;
          background: #d5e0c7;
          color: #445535;
          font-weight: 700;
        }
        .keyar-signature {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          justify-content: space-between;
          padding: 3mm;
          text-align: right;
          font-size: 9px;
        }
        .keyar-signature-space { flex: 1; min-height: 16mm; }
        @media print {
          @page { size: A4 portrait; margin: 0; }
          body { margin: 0; background: #fff !important; print-color-adjust: exact; -webkit-print-color-adjust: exact; }
          body * { visibility: hidden; }
          .keyar-screen-actions { display: none !important; }
          .keyar-print-area, .keyar-print-area * { visibility: visible; }
          .keyar-print-area {
            position: absolute;
            inset: 0;
            width: 210mm;
            height: 297mm;
            padding: 6mm;
            margin: 0;
          }
          .keyar-invoice { min-height: 285mm; }
        }
        @media screen and (max-width: 640px) {
          .keyar-print-area { padding: 8px; overflow-x: auto; }
          .keyar-invoice { min-width: 620px; }
          .keyar-screen-actions { padding: 0 8px; }
        }
      `}</style>
    </>
  );
};