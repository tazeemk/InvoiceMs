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

  const wholeAmount = Math.floor(Math.abs(Number(amount) || 0));
  if (wholeAmount === 0) return "Zero Only";

  const groups = [
    { value: Math.floor(wholeAmount / 10000000), label: "Crore" },
    { value: Math.floor((wholeAmount % 10000000) / 100000), label: "Lakh" },
    { value: Math.floor((wholeAmount % 100000) / 1000), label: "Thousand" },
    { value: wholeAmount % 1000, label: "" },
  ];
  return `${groups.filter(group => group.value > 0).map(group => `${underThousand(group.value)} ${group.label}`.trim()).join(" ")} Only`;
};

export const InvoiceViewPage: React.FC<InvoiceDocumentProps> = ({ invoice, onBack }) => {
  const items = invoice.items || [];
  const invoiceDetails = invoice as Invoice & { stateCode?: string; orderNumber?: string };
  const itemsAmount = items.reduce((sum, item) => sum + (item.taxableAmount ?? item.quantity * item.rate), 0);
  const subtotal = invoice.subtotal || itemsAmount;
  const totalTax = invoice.taxAmount || 0;
  const cgstAmount = Math.round(totalTax * 50) / 100;
  const sgstAmount = totalTax - cgstAmount;
  const grandTotal = invoice.totalAmount || subtotal + totalTax - (invoice.discountAmount || 0) + (invoice.roundOff || 0);
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
  const orderNumber = invoiceDetails.orderNumber || "";

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
          <div className="keyar-copy-heading">
            <strong>TAX INVOICE</strong>
            <span>Original for Recipient</span>
          </div>

          <header className="keyar-company-header">
            <div className="keyar-issuer">
              <KeyarLogo width={82} height={48} className="keyar-logo" />
              <div>
                <h1>{companyDetails.name}</h1>
                <p className="keyar-company-address">
                  {companyDetails.addressLines.map(line => <span key={line}>{line}</span>)}
                </p>
                <p className="keyar-company-contact">GSTIN: {companyDetails.gstin}</p>
                <p className="keyar-company-contact">Phone: {companyDetails.phones.join(", ")}</p>
              </div>
            </div>
          </header>

          <section className="keyar-parties" aria-label="Invoice parties and references">
            <div className="keyar-party-block">
              <h2>Buyer (Bill To)</h2>
              <p><strong>{invoice.customerName}</strong></p>
              <p>{invoice.billingAddress || ""}</p>
              <p>GSTIN/UIN: {invoice.gstin || ""}</p>
              <p>State Name: {invoice.state || ""}{invoice.gstin ? `, Code: ${invoiceDetails.stateCode || invoice.gstin.slice(0, 2)}` : ""}</p>
              <p>Contact: {invoice.contactPerson || ""}{invoice.mobile ? ` | ${invoice.mobile}` : ""}</p>
            </div>
            <div className="keyar-reference-block keyar-invoice-reference">
              <div><strong>Invoice No.</strong><span>{invoice.invoiceNumber}</span></div>
              <div><strong>Dated</strong><span>{formatDate(invoice.invoiceDate)}</span></div>
              <div><strong>Reference No. &amp; Date</strong><span>{orderNumber}</span></div>
              <div><strong>Other References</strong><span>{invoice.notes || ""}</span></div>
            </div>
            <div className="keyar-party-block">
              <h2>Consignee (Ship To)</h2>
              <p><strong>{invoice.customerName}</strong></p>
              <p>{invoice.shippingAddress || invoice.billingAddress || ""}</p>
              <p>GSTIN/UIN: {invoice.gstin || ""}</p>
              <p>State Name: {invoice.state || ""}{invoice.gstin ? `, Code: ${invoiceDetails.stateCode || invoice.gstin.slice(0, 2)}` : ""}</p>
            </div>
            <div className="keyar-reference-block">
              <div><strong>Buyer's Order No.</strong><span>{orderNumber || invoice.orderId || ""}</span></div>
              <div><strong>Due Date</strong><span>{formatDate(invoice.dueDate)}</span></div>
              <div><strong>Terms of Delivery</strong><span>{invoice.termsConditions || ""}</span></div>
              <div><strong>Status</strong><span>{invoice.status}</span></div>
              <div><strong>Balance Due</strong><span>{formatAmount(invoice.outstandingAmount)}</span></div>
            </div>
          </section>

          <table className="keyar-items-table">
            <colgroup>
              <col className="keyar-serial-column" />
              <col className="keyar-description-column" />
              <col className="keyar-hsn-column" />
              <col className="keyar-quantity-column" />
              <col className="keyar-rate-column" />
              <col className="keyar-unit-column" />
              <col className="keyar-discount-column" />
              <col className="keyar-amount-column" />
            </colgroup>
            <thead>
              <tr>
                <th>Sl.</th>
                <th>Description of Goods</th>
                <th>HSN/SAC</th>
                <th>Quantity</th>
                <th>Rate</th>
                <th>Per</th>
                <th>Disc. %</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={item.id || `${item.itemName}-${index}`}>
                  <td className="keyar-center">{index + 1}</td>
                  <td><strong>{item.itemName}</strong>{item.description ? <small>{item.description}</small> : null}</td>
                  <td className="keyar-center">{item.hsnCode || ""}</td>
                  <td className="keyar-number">{Number(item.quantity) || 0}</td>
                  <td className="keyar-number">{formatAmount(item.rate)}</td>
                  <td className="keyar-center">{item.unit || ""}</td>
                  <td className="keyar-number">{formatAmount(item.discountPercent)}</td>
                  <td className="keyar-number">{formatAmount(item.taxableAmount ?? item.quantity * item.rate)}</td>
                </tr>
              ))}
              {Array.from({ length: Math.max(0, 8 - items.length) }, (_, index) => (
                <tr className="keyar-blank-row" key={`blank-${index}`}>
                  {Array.from({ length: 8 }, (_, cellIndex) => <td key={cellIndex}>{cellIndex === 1 ? "\u00a0" : ""}</td>)}
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td></td>
                <td><strong>Total</strong></td>
                <td></td>
                <td className="keyar-number"><strong>{totalQuantity}</strong></td>
                <td></td><td></td><td></td>
                <td className="keyar-number"><strong>{formatAmount(itemsAmount)}</strong></td>
              </tr>
            </tfoot>
          </table>

          <section className="keyar-totals">
            <div className="keyar-tax-ledger">
              <strong>Tax Summary</strong>
              <div><span>Taxable Amount</span><span>{formatAmount(subtotal)}</span></div>
              <div><span>CGST A/C</span><span>{formatAmount(cgstAmount)}</span></div>
              <div><span>SGST A/C</span><span>{formatAmount(sgstAmount)}</span></div>
              <div className="keyar-total-tax"><strong>Total Tax</strong><strong>{formatAmount(totalTax)}</strong></div>
            </div>
            <div className="keyar-tax-block">
              <div><strong>Sub-total</strong><span>{formatAmount(subtotal)}</span></div>
              {invoice.discountAmount > 0 && <div><strong>Discount</strong><span>-{formatAmount(invoice.discountAmount)}</span></div>}
              <div><strong>GST</strong><span>{formatAmount(totalTax)}</span></div>
              <div className="keyar-grand-total"><strong>Grand Total</strong><strong>{formatAmount(grandTotal)}</strong></div>
              <div className="keyar-amount-words"><strong>Amount in Words</strong><span>Rupees {numberToWords(grandTotal)}</span></div>
            </div>
          </section>

          <footer className="keyar-invoice-footer">
            <div className="keyar-bank-details">
              <strong>Our Bank Details</strong>
              <p><strong>A/C Holder Name:</strong> {companyDetails.name}</p>
              <p><strong>Bank Name:</strong> {companyDetails.bank}</p>
              <p><strong>Branch:</strong> {companyDetails.branch}</p>
              <p><strong>Bank A/C No:</strong> {companyDetails.accountNumber}</p>
              <p><strong>IFSC Code:</strong> {companyDetails.ifsc}</p>
              <p className="keyar-note">Subject to Jaunpur jurisdiction only.</p>
            </div>
            <div className="keyar-signature">
              <span>For, {companyDetails.name}</span>
              <div className="keyar-signature-space" />
              <strong>Authorised Signatory</strong>
              <span className="keyar-computer-generated">This is a computer generated invoice</span>
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
          padding: 8mm;
          background: #fff;
        }
        .keyar-invoice {
          box-sizing: border-box;
          min-height: 276mm;
          border: 1px solid #777;
          color: #111;
          background: #fff;
          font-family: Arial, Helvetica, sans-serif;
          font-size: 9px;
          line-height: 1.2;
        }
        .keyar-copy-heading {
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 9mm;
          border-bottom: 1px solid #777;
          font-size: 13px;
          font-weight: 700;
        }
        .keyar-copy-heading span {
          position: absolute;
          right: 4mm;
          font-size: 8px;
          font-style: italic;
          font-weight: 400;
        }
        .keyar-company-header {
          min-height: 31mm;
          padding: 3mm;
          border-bottom: 1px solid #777;
        }
        .keyar-issuer {
          display: grid;
          grid-template-columns: 22mm minmax(0, 1fr);
          align-items: center;
          gap: 3mm;
        }
        .keyar-logo { display: block; object-fit: contain; }
        .keyar-company-header h1 {
          margin: 0 0 1mm;
          font-size: 13px;
          font-weight: 700;
        }
        .keyar-company-address {
          margin: 0 0 1mm;
          font-size: 8px;
          line-height: 1.25;
        }
        .keyar-company-address span { display: block; }
        .keyar-company-contact { margin: 0.5mm 0; font-size: 8px; }
        .keyar-parties { display: grid; grid-template-columns: 1fr 1fr; }
        .keyar-party-block,
        .keyar-reference-block {
          min-height: 31mm;
          border-bottom: 1px solid #777;
        }
        .keyar-party-block { padding: 2mm; border-right: 1px solid #777; }
        .keyar-party-block h2 { margin: 0 0 1mm; font-size: 9px; font-weight: 700; }
        .keyar-party-block p { margin: 0.8mm 0; overflow-wrap: anywhere; }
        .keyar-party-block p strong { font-size: 9px; font-weight: 700; }
        .keyar-reference-block {
          display: grid;
          grid-template-rows: repeat(5, minmax(0, 1fr));
        }
        .keyar-invoice-reference { grid-template-rows: repeat(4, minmax(0, 1fr)); }
        .keyar-reference-block > div {
          display: grid;
          grid-template-columns: 42% 58%;
          align-items: center;
          gap: 1mm;
          padding: 1mm 2mm;
          border-bottom: 1px solid #aaa;
          overflow-wrap: anywhere;
        }
        .keyar-reference-block > div:last-child { border-bottom: 0; }
        .keyar-reference-block > div strong { font-weight: 700; }
        .keyar-reference-block > div span { min-width: 0; }
        .keyar-items-table {
          width: 100%;
          border-collapse: collapse;
          table-layout: fixed;
          font-size: 8.5px;
        }
        .keyar-items-table th,
        .keyar-items-table td {
          padding: 1.2mm 0.8mm;
          border-right: 1px solid #999;
          border-bottom: 1px solid #999;
          vertical-align: top;
          overflow-wrap: anywhere;
        }
        .keyar-items-table th {
          height: 9mm;
          text-align: center;
          vertical-align: middle;
          font-weight: 700;
        }
        .keyar-items-table td:nth-child(2),
        .keyar-items-table th:nth-child(2) { text-align: left; }
        .keyar-items-table td:nth-child(2) > strong { font-size: 8.5px; font-weight: 700; }
        .keyar-items-table td:nth-child(9) { font-weight: 700; }
        .keyar-serial-column { width: 5%; }
        .keyar-description-column { width: 30%; }
        .keyar-hsn-column { width: 11%; }
        .keyar-quantity-column { width: 13%; }
        .keyar-rate-column { width: 12%; }
        .keyar-unit-column { width: 8%; }
        .keyar-discount-column { width: 7%; }
        .keyar-amount-column { width: 14%; }
        .keyar-items-table td small { display: block; margin-top: 1px; color: #444; }
        .keyar-center { text-align: center; }
        .keyar-number { text-align: right; white-space: nowrap; }
        .keyar-blank-row { height: 8mm; }
        .keyar-items-table tfoot td { height: 8mm; vertical-align: middle; font-weight: 700; }
        .keyar-totals {
          display: grid;
          grid-template-columns: 1fr 0.8fr;
          min-height: 34mm;
          border-bottom: 1px solid #777;
        }
        .keyar-tax-ledger { padding: 2mm; border-right: 1px solid #777; }
        .keyar-tax-ledger > strong { display: block; margin-bottom: 2mm; font-size: 9px; font-weight: 700; }
        .keyar-tax-ledger > div { display: flex; justify-content: space-between; margin: 1mm 0; }
        .keyar-tax-ledger .keyar-total-tax {
          margin-top: 2mm;
          padding-top: 1mm;
          border-top: 1px solid #777;
        }
        .keyar-tax-block {
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: 2mm;
        }
        .keyar-tax-block > div { display: flex; justify-content: space-between; gap: 2mm; margin: 1mm 0; }
        .keyar-tax-block .keyar-grand-total {
          margin-top: 1mm;
          padding-top: 1.5mm;
          border-top: 1px solid #777;
          font-size: 10px;
          font-weight: 700;
        }
        .keyar-tax-block .keyar-amount-words { display: block; margin-top: 2mm; font-size: 8px; }
        .keyar-amount-words span { display: block; margin-top: 1mm; }
        .keyar-invoice-footer { display: grid; grid-template-columns: 1fr 1fr; min-height: 27mm; }
        .keyar-bank-details { padding: 2mm; border-right: 1px solid #777; font-size: 7px; }
        .keyar-bank-details > strong { display: block; margin-bottom: 1mm; }
        .keyar-bank-details p { margin: 0.8mm 0; }
        .keyar-note { margin-top: 2mm !important; font-weight: 600; }
        .keyar-signature {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          justify-content: space-between;
          padding: 2mm;
          text-align: right;
          font-size: 7px;
        }
        .keyar-signature-space { flex: 1; min-height: 15mm; }
        .keyar-computer-generated { align-self: center; margin-top: 2mm; }
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
            padding: 10mm;
            margin: 0;
          }
          .keyar-invoice { min-height: 277mm; }
        }
        @media screen and (max-width: 640px) {
          .keyar-print-area { padding: 8px; overflow-x: auto; }
          .keyar-invoice { min-width: 700px; }
          .keyar-screen-actions { padding: 0 8px; }
        }
      `}</style>
    </>
  );
};