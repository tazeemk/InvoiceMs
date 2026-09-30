"use client";

import { useRef } from 'react';
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogContent,
} from "@/components/ui/alert-dialog";
import { X, Printer, Download, Send, CheckCircle2, MapPin } from "lucide-react";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { amountToWords } from '@/lib/utils';
import { companyDetails } from '@/lib/company';
import KeyarLogo from '@/components/KeyarLogo';

type ReceiptDetails = {
  receiptNo:           string;
  invoiceNo:           string;
  orderNumber:         string;
  collectionId:        string;
  customer:            string;
  customerCode:        string;
  contactPerson:       string;
  mobile:              string;
  billingAddress:      string;
  city:                string;
  state:               string;
  collectedAmount:     string;
  paymentMethod:       string;
  paymentRef:          string;
  assignUser:          string;
  collectionDate:      string;
  collectionLocation:  string;
  previousOutstanding: number;
  remarks?:            string;
};

interface ReceiptPreviewModalProps {
  isOpen:  boolean;
  onClose: () => void;
  details: ReceiptDetails | null;
}

// ─── App color tokens — matches Invoice Master ────────────────────────────────
const C = {
  green:       '#1a5c3a',
  greenDark:   '#154d30',
  greenMid:    '#1e6b45',
  greenLight:  '#e8f5ee',
  greenBorder: '#b8deca',
  greenText:   '#1a5c3a',
  white:       '#ffffff',
  offWhite:    '#f8fafb',
  border:      '#e2e8f0',
  labelGray:   '#64748b',
  textDark:    '#1e293b',
  textMid:     '#374151',
  red:         '#dc2626',
  emerald:     '#059669',
  orange:      '#d97706',
};

const Label = ({ children }: { children: React.ReactNode }) => (
  <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: '0.09em', color: C.labelGray, textTransform: 'uppercase', marginBottom: 3 }}>
    {children}
  </div>
);

const Value = ({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) => (
  <div style={{ fontSize: 11.5, fontWeight: 600, color: C.textDark, ...style }}>
    {children}
  </div>
);

const Field = ({ label, value }: { label: string; value?: string | null }) =>
  value ? (
    <div style={{ marginBottom: 10 }}>
      <Label>{label}</Label>
      <Value>{value}</Value>
    </div>
  ) : null;

export default function ReceiptPreviewModal({ isOpen, onClose, details }: ReceiptPreviewModalProps) {
  const receiptRef = useRef<HTMLDivElement>(null);
  if (!details) return null;

  const collectedAmt    = parseFloat(details.collectedAmount) || 0;
  const prevOutstanding = details.previousOutstanding ?? 0;
  const balance         = Math.max(0, prevOutstanding - collectedAmt);
  const fullAddress     = [details.billingAddress, details.city, details.state].filter(Boolean).join(', ');
  const fmt = (n: number) => `₹${n.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;

  const handleDownloadPdf = async () => {
    const input = receiptRef.current;
    if (!input) return;
    const canvas = await html2canvas(input, {
      scale: 2,
      useCORS: true,
      onclone: (doc: Document) => {
        const style = doc.createElement('style');
        let css = '';
        for (const sheet of Array.from(doc.styleSheets)) {
          try { for (const rule of Array.from(sheet.cssRules)) css += rule.cssText; } catch (_) {}
        }
        style.appendChild(doc.createTextNode(css));
        doc.head.appendChild(style);
      },
    } as any);
    const imgData = canvas.toDataURL('image/png');
    const pdf     = new jsPDF('p', 'mm', 'a4');
    const pdfW    = pdf.internal.pageSize.getWidth();
    const pdfH    = (canvas.height * pdfW) / canvas.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pdfW, pdfH);
    pdf.save(`receipt-${details.receiptNo}.pdf`);
  };

  const handlePrint = () => {
    const clone = receiptRef.current?.cloneNode(true) as HTMLElement | undefined;
    if (!clone) return;
    let css = '';
    for (const sheet of Array.from(document.styleSheets)) {
      try { for (const rule of Array.from(sheet.cssRules)) css += rule.cssText; } catch (_) {}
    }
    const pw = window.open('', '_blank', 'width=800,height=1000');
    if (!pw) return;
    pw.document.write(`<!DOCTYPE html><html><head>
      <title>Receipt – ${details.receiptNo}</title>
      <style>${css}</style>
      <style>
        @page { size: A4 portrait; margin: 12mm; }
        @media print {
          body { margin: 0; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .no-print { display: none !important; }
        }
        body { font-family: sans-serif; background: #fff; }
      </style>
    </head><body>${clone.innerHTML}</body></html>`);
    pw.document.close();
    setTimeout(() => { pw.focus(); pw.print(); pw.close(); }, 700);
  };

  const handleSendEmail = () =>
    alert(`Receipt ${details.receiptNo} will be emailed to ${details.customer}.`);

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent
        style={{
          maxWidth: 720,
          width: '92vw',
          padding: 0,
          overflow: 'hidden',
          borderRadius: 12,
          boxShadow: '0 24px 64px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.06)',
          background: C.white,
          border: 'none',
        }}
      >
        <div style={{ overflowY: 'auto', maxHeight: '90vh' }}>

          {/* ══════════════════ PRINTABLE RECEIPT ══════════════════ */}
          <div ref={receiptRef} style={{ background: C.white, fontFamily: 'system-ui, -apple-system, sans-serif' }}>

            {/* HEADER */}
            <div style={{
              background: C.greenDark,
              padding: '20px 28px',
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
            }}>
              <div>
                <KeyarLogo width={100} height={48} />
                <div style={{ fontSize: 20, fontWeight: 800, color: '#fff', letterSpacing: '0.06em' }}>
                  {companyDetails.name}
                </div>
                <div style={{ fontSize: 10, color: '#8bbfa0', marginTop: 8, lineHeight: 1.65 }}>
                  GSTIN: {companyDetails.gstin}<br />
                  Phone: {companyDetails.phones.join(', ')}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{
                  display: 'inline-block',
                  background: C.emerald,
                  color: '#fff',
                  fontSize: 9,
                  fontWeight: 700,
                  letterSpacing: '0.16em',
                  textTransform: 'uppercase',
                  padding: '5px 14px',
                  borderRadius: 5,
                  marginBottom: 10,
                }}>
                  Payment Receipt
                </div>
                <div style={{ color: '#fff', fontWeight: 700, fontSize: 13 }}>#{details.receiptNo}</div>
                <div style={{ color: '#8bbfa0', fontSize: 10, marginTop: 3 }}>{details.collectionDate}</div>
              </div>
            </div>

            {/* VERIFIED STRIPE */}
            <div style={{
              background: C.greenLight,
              borderBottom: `1px solid ${C.greenBorder}`,
              padding: '7px 28px',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}>
              <CheckCircle2 size={12} color={C.greenMid} />
              <span style={{ fontSize: 10, color: C.greenMid, fontWeight: 600, letterSpacing: '0.04em' }}>
                Verified Digital Receipt — No Physical Signature Required
              </span>
            </div>

            {/* BODY */}
            <div style={{ padding: '20px 28px', background: C.offWhite }}>

              {/* AMOUNT HERO */}
              <div style={{
                background: C.white,
                border: `1px solid ${C.border}`,
                borderLeft: `4px solid ${C.greenMid}`,
                borderRadius: 8,
                padding: '18px 22px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 16,
              }}>
                <div>
                  <Label>Amount Received</Label>
                  <div style={{ fontSize: 34, fontWeight: 800, color: C.green, lineHeight: 1.1, letterSpacing: '-0.5px' }}>
                    {fmt(collectedAmt)}
                  </div>
                  <div style={{ fontSize: 10, color: C.labelGray, marginTop: 5, fontStyle: 'italic' }}>
                    Rupees {amountToWords(collectedAmt)} Only
                  </div>
                </div>
                <div style={{
                  background: C.offWhite,
                  border: `1px solid ${C.border}`,
                  borderRadius: 7,
                  padding: '10px 16px',
                  textAlign: 'center',
                  minWidth: 110,
                }}>
                  <Label>Method</Label>
                  <Value>{details.paymentMethod}</Value>
                  {details.paymentRef && (
                    <>
                      <div style={{ margin: '6px 0', height: 1, background: C.border }} />
                      <Label>Ref / Cheque</Label>
                      <Value>{details.paymentRef}</Value>
                    </>
                  )}
                </div>
              </div>

              {/* TWO COLUMNS */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
                {[
                  {
                    title: 'Receipt Details',
                    fields: [
                      { label: 'Receipt No',   value: details.receiptNo },
                      { label: 'Invoice No',   value: details.invoiceNo },
                      { label: 'Order No',     value: details.orderNumber },
                      { label: 'Collected By', value: details.assignUser },
                      { label: 'Date & Time',  value: details.collectionDate },
                      
                    ],
                  },
                  {
                    title: 'Customer Details',
                    fields: [
                      { label: 'Customer Name',  value: details.customer },
                      { label: 'Contact Person', value: details.contactPerson },
                      { label: 'Mobile',         value: details.mobile },
                      { label: 'Address',        value: fullAddress || null },
                    ],
                  },
                ].map(col => (
                  <div key={col.title} style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 8, overflow: 'hidden' }}>
                    <div style={{
                      background: C.offWhite,
                      borderBottom: `1px solid ${C.border}`,
                      padding: '8px 16px',
                      fontSize: 9,
                      fontWeight: 700,
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      color: C.greenText,
                    }}>
                      {col.title}
                    </div>
                    <div style={{ padding: '14px 16px' }}>
                      {col.fields.map(f => <Field key={f.label} label={f.label} value={f.value} />)}
                    </div>
                  </div>
                ))}
              </div>

              {/* PAYMENT SUMMARY */}
              <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 8, overflow: 'hidden', marginBottom: 16 }}>
                <div style={{
                  background: C.greenDark,
                  color: '#fff',
                  padding: '9px 18px',
                  fontSize: 9,
                  fontWeight: 700,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                }}>
                  Payment Summary
                </div>
                {[
                  { label: 'Previous Outstanding', value: fmt(prevOutstanding), color: C.red,     bg: C.white,    bold: false },
                  { label: 'Amount Received',      value: fmt(collectedAmt),    color: C.emerald, bg: C.white,    bold: false },
                  { label: 'Balance Outstanding',  value: fmt(balance),         color: C.orange,  bg: '#fffbf0',  bold: true  },
                ].map((row, i, arr) => (
                  <div key={row.label} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '11px 18px',
                    background: row.bg,
                    borderBottom: i < arr.length - 1 ? `1px solid ${C.border}` : 'none',
                  }}>
                    <span style={{ fontSize: 11.5, color: C.textMid, fontWeight: row.bold ? 600 : 400 }}>{row.label}</span>
                    <span style={{ fontSize: 13, fontWeight: row.bold ? 700 : 600, color: row.color }}>{row.value}</span>
                  </div>
                ))}
              </div>

              {/* REMARKS / LOCATION */}
              {(details.remarks || details.collectionLocation) && (
                <div style={{
                  background: C.white,
                  border: `1px solid ${C.border}`,
                  borderRadius: 8,
                  padding: '12px 18px',
                  marginBottom: 16,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8,
                }}>
                  {details.remarks && (
                    <div style={{ display: 'flex', gap: 10 }}>
                      <span style={{ fontSize: 9, color: C.labelGray, textTransform: 'uppercase', letterSpacing: '0.08em', whiteSpace: 'nowrap', paddingTop: 1 }}>Remarks</span>
                      <span style={{ fontSize: 11, color: C.textMid }}>{details.remarks}</span>
                    </div>
                  )}
                  {details.collectionLocation && (
                    <div style={{ display: 'flex', gap: 6, alignItems: 'flex-start' }}>
                      <MapPin size={11} color={C.red} style={{ marginTop: 1, flexShrink: 0 }} />
                      <span style={{ fontSize: 9, color: C.labelGray, textTransform: 'uppercase', letterSpacing: '0.08em', whiteSpace: 'nowrap', paddingTop: 1 }}>Location</span>
                      <span style={{ fontSize: 11, color: C.textMid }}>{details.collectionLocation}</span>
                    </div>
                  )}
                </div>
              )}

              {/* NOTICE */}
              <div style={{
                background: '#eff6ff',
                borderLeft: `3px solid #3b82f6`,
                borderRadius: '0 6px 6px 0',
                padding: '9px 14px',
                fontSize: 10,
                color: '#1d4ed8',
                marginBottom: 24,
              }}>
                This is a computer-generated digital receipt. Payment will be reflected  within 24 hours.
              </div>

              {/* FOOTER */}
              <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 10, color: C.labelGray }}>Thank you for your payment!</span>
                <span style={{ fontSize: 10, color: C.labelGray }}>{companyDetails.phones.join(' · ')}</span>
              </div>
            </div>
          </div>
          {/* ══════════════════ END PRINTABLE AREA ══════════════════ */}

          {/* ACTION BUTTONS */}
          <div
            className="no-print"
            style={{
              padding: '12px 24px',
              background: C.white,
              borderTop: `1px solid ${C.border}`,
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 8,
              flexWrap: 'wrap',
            }}
          >
            {[
              { icon: <Printer size={13} />,  label: 'Print',            onClick: handlePrint },
              { icon: <Download size={13} />, label: 'Download PDF',     onClick: handleDownloadPdf },
              { icon: <Send size={13} />,     label: 'Send to Customer', onClick: handleSendEmail },
            ].map(btn => (
              <button
                key={btn.label}
                onClick={btn.onClick}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '7px 16px', borderRadius: 6,
                  border: `1px solid ${C.border}`,
                  background: C.white, color: C.textDark,
                  fontSize: 12, fontWeight: 500, cursor: 'pointer',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = C.offWhite)}
                onMouseLeave={e => (e.currentTarget.style.background = C.white)}
              >
                {btn.icon} {btn.label}
              </button>
            ))}
            <button
              onClick={onClose}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '7px 18px', borderRadius: 6,
                border: 'none', background: C.green, color: '#fff',
                fontSize: 12, fontWeight: 600, cursor: 'pointer',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = C.greenDark)}
              onMouseLeave={e => (e.currentTarget.style.background = C.green)}
            >
              <X size={13} /> Close
            </button>
          </div>

        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}