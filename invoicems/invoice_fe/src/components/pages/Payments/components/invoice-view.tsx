import React from 'react';
import { ArrowLeft, Edit, Download, Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Invoice } from '@/impData/types';
import { companyDetails } from '@/lib/company';
import KeyarLogo from '@/components/KeyarLogo';
 

interface InvoiceViewPageProps {
  invoice: Invoice;
  onBack: () => void;
  onEdit: () => void;
}

export const InvoiceViewPage: React.FC<InvoiceViewPageProps> = ({ invoice, onBack, onEdit }) => {
  const invoiceItems = invoice.items || [];

  // Function to convert number to words (Indian format)
  const numberToWords = (num: number): string => {
    const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    
    if (num === 0) return 'Zero';
    
    const crore = Math.floor(num / 10000000);
    const lakh = Math.floor((num % 10000000) / 100000);
    const thousand = Math.floor((num % 100000) / 1000);
    const hundred = Math.floor((num % 1000) / 100);
    const remainder = Math.floor(num % 100);
    
    let result = '';
    
    if (crore > 0) result += ones[crore] + ' Crore ';
    if (lakh > 0) result += (lakh < 10 ? ones[lakh] : (lakh < 20 ? teens[lakh - 10] : tens[Math.floor(lakh / 10)] + ' ' + ones[lakh % 10])) + ' Lakh ';
    if (thousand > 0) result += (thousand < 10 ? ones[thousand] : (thousand < 20 ? teens[thousand - 10] : tens[Math.floor(thousand / 10)] + ' ' + ones[thousand % 10])) + ' Thousand ';
    if (hundred > 0) result += ones[hundred] + ' Hundred ';
    if (remainder > 0) {
      if (remainder < 10) result += ones[remainder];
      else if (remainder < 20) result += teens[remainder - 10];
      else result += tens[Math.floor(remainder / 10)] + ' ' + ones[remainder % 10];
    }
    
    return result.trim() + ' Only';
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    if (window.confirm('Please use your browser\'s Print dialog and select "Save as PDF" as the destination to download the invoice as PDF.')) {
      window.print();
    }
  };

  const totalQuantity = invoiceItems.reduce((sum, item) => sum + item.quantity, 0);

  // Access additional fields
  const customerGSTIN = (invoice as any).gstin || 'N/A';
  const billingAddress = (invoice as any).billingAddress || 'N/A';
  const shippingAddress = (invoice as any).shippingAddress || billingAddress;
  const state = (invoice as any).state || 'N/A';
  const cgstAmount = (invoice as any).cgstAmount || (invoice.taxAmount / 2);
  const sgstAmount = (invoice as any).sgstAmount || (invoice.taxAmount / 2);
  const igstAmount = (invoice as any).igstAmount || 0;
  const roundOff = (invoice as any).roundOff || 0;
  const contactPerson = (invoice as any).contactPerson || 'N/A';
  const mobile = (invoice as any).mobile || 'N/A';
  const termsConditions = (invoice as any).termsConditions || 'Payment due within 30 days';

  return (
    <>
      {/* Action Buttons - Only visible on screen */}
      <div className="screen-only max-w-5xl mx-auto mb-4">
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onBack} className="border-emerald-600 text-emerald-600 hover:bg-emerald-50">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <Button variant="outline" onClick={handlePrint} className="border-gray-300 hover:bg-gray-50">
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
          {/* <Button variant="outline" onClick={handleDownloadPDF} className="border-gray-300 hover:bg-gray-50">
            <Download className="h-4 w-4 mr-2" />
            Save as PDF
          </Button>
          <Button onClick={onEdit} className="bg-emerald-600 hover:bg-emerald-700">
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button> */}
        </div>
      </div>

      {/* Invoice Document - Print optimized */}
      <div className="print-container">
        <div className="invoice-page">
          {/* Header */}
          <div className="invoice-header">
            <h1 className="invoice-title">Tax Invoice</h1>
            <span className="invoice-type">Original /Duplicate Bill</span>
          </div>

          {/* Company Info Box */}
          <div className="company-box">
            <div className="company-header">
              <div className="company-logo">
                <KeyarLogo width={90} height={60} className="logo-icon" />
              </div>
              <div className="company-info">
                <p className="company-gstin">GSTIN: {companyDetails.gstin}</p>
                <h2 className="company-name">{companyDetails.name}</h2>
                <p className="company-detail">Phone: {companyDetails.phones.join(', ')}</p>
              </div>
            </div>

            {/* Bill To and Invoice Info */}
            <div className="info-grid">
              <div className="bill-to">
                <p className="section-title">Bill To</p>
                <p className="info-line"><span className="label">Name:</span> {invoice.customerName}</p>
                <p className="info-line"><span className="label">GSTIN:</span> {customerGSTIN}</p>
                <p className="info-line"><span className="label">Address:</span> {billingAddress}</p>
                <p className="info-line"><span className="label">State:</span> {state}</p>
                <p className="info-line"><span className="label">Contact:</span> {contactPerson}</p>
                <p className="info-line"><span className="label">Mobile:</span> {mobile}</p>
              </div>
              <div className="invoice-info">
                <div className="info-grid-2col">
                  <span className="label">#Inv. No. :</span>
                  <span>{invoice.invoiceNumber}</span>
                  <span className="label">Inv. Date :</span>
                  <span>{new Date(invoice.invoiceDate).toLocaleDateString('en-GB')}</span>
                  <span className="label">Payment Mode :</span>
                  <span>{invoice.billingCycle}</span>
                  <span className="label">Status :</span>
                  <span className="status-text">{invoice.status}</span>
                </div>
              </div>
            </div>

            {/* Ship To */}
            <div className="info-grid">
              <div className="ship-to">
                <p className="section-title">Ship To</p>
                <p className="info-line"><span className="label">Name:</span> {invoice.customerName}</p>
                <p className="info-line"><span className="label">GSTIN:</span> {customerGSTIN}</p>
                <p className="info-line"><span className="label">Address:</span> {shippingAddress}</p>
                <p className="info-line"><span className="label">State:</span> {state}</p>
              </div>
              <div className="order-info">
                <div className="info-grid-2col">
                  <span className="label">Order ID :</span>
                  <span>{invoice.orderId || '---'}</span>
                  <span className="label">Due Date :</span>
                  <span>{new Date(invoice.dueDate).toLocaleDateString('en-GB')}</span>
                  <span className="label">Payment Terms :</span>
                  <span>{invoice.billingCycle}</span>
                </div>
              </div>
            </div>

            {/* Items Table */}
            <table className="items-table">
              <thead>
                <tr className="table-header">
                  <th className="col-sr">Sr</th>
                  <th className="col-desc">Goods & Service Description</th>
                  <th className="col-hsn">HSN</th>
                  <th className="col-qty">Quantity</th>
                  <th className="col-rate">Rate</th>
                  <th className="col-taxable">Taxable</th>
                  <th className="col-gst-combined">
                    <div>GST</div>
                    <div className="gst-subheader">
                      <span>%</span>
                      <span>Amt.</span>
                    </div>
                  </th>
                  <th className="col-total">Total</th>
                </tr>
              </thead>
              <tbody>
                {invoiceItems.map((item, index) => {
                  const itemData = item as any;
                  const hsnCode = itemData.hsnCode || '-';
                  const taxableAmount = itemData.taxableAmount || (item.quantity * item.rate);
                  const gstRate = itemData.cgstRate || itemData.sgstRate || 0;
                  const totalGstRate = gstRate * 2;
                  const gstAmount = itemData.cgstAmount && itemData.sgstAmount 
                    ? (itemData.cgstAmount + itemData.sgstAmount) 
                    : (item.totalAmount - taxableAmount);
                  
                  return (
                    <tr key={item.id} className="table-row">
                      <td className="text-left">{index + 1}</td>
                      <td className="text-left">
                        <div className="item-name">{item.itemName}</div>
                        {item.description && <div className="item-desc">{item.description}</div>}
                      </td>
                      <td className="text-center">{hsnCode}</td>
                      <td className="text-center">{item.quantity.toFixed(0)} {item.unit}</td>
                      <td className="text-right">{item.rate.toFixed(2)}</td>
                      <td className="text-right">{taxableAmount.toFixed(2)}</td>
                      <td>
                        <div className="gst-cell">
                          <span>{totalGstRate.toFixed(0)}%</span>
                          <span>{gstAmount.toFixed(2)}</span>
                        </div>
                      </td>
                      <td className="text-right">{item.totalAmount.toFixed(2)}</td>
                    </tr>
                  );
                })}
                {/* Empty rows */}
                {[...Array(Math.max(0, 6 - invoiceItems.length))].map((_, i) => (
                  <tr key={`empty-${i}`} className="table-row empty-row">
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="table-footer">
                  <td></td>
                  <td className="text-left"><strong>Sub-Total:</strong></td>
                  <td></td>
                  <td className="text-center"><strong>{totalQuantity.toFixed(0)}</strong></td>
                  <td></td>
                  <td className="text-right"><strong>{invoice.subtotal.toFixed(2)}</strong></td>
                  <td>
                    <div className="gst-cell">
                      <span></span>
                      <span><strong>{invoice.taxAmount.toFixed(2)}</strong></span>
                    </div>
                  </td>
                  <td className="text-right"><strong>{invoice.totalAmount.toFixed(2)}</strong></td>
                </tr>
              </tfoot>
            </table>

            {/* Bank Details and Summary */}
            <div className="bottom-section">
              <div className="bank-details">
                <p className="section-title">Our Bank Details</p>
                <p className="bank-line"><span className="label">Bank Name:</span> {companyDetails.bank}</p>
                <p className="bank-line"><span className="label">Branch:</span> {companyDetails.branch}</p>
                <p className="bank-line"><span className="label">Account No:</span> {companyDetails.accountNumber}</p>
                <p className="bank-line"><span className="label">IFSC Code:</span> {companyDetails.ifsc}</p>
                <p className="section-title mt-3">Invoice Total in Word</p>
                <p className="amount-words">Rupees {numberToWords(invoice.totalAmount)}</p>
              </div>
              <div className="summary-section">
                <div className="summary-header">
                  <span className="summary-label">SUMMARY</span>
                  <span className="summary-label">AMOUNT</span>
                </div>
                <div className="summary-line">
                  <span>CGST Amt :</span>
                  <span>{cgstAmount.toFixed(2)}</span>
                </div>
                <div className="summary-line">
                  <span>SGST Amt :</span>
                  <span>{sgstAmount.toFixed(2)}</span>
                </div>
                <div className="summary-line">
                  <span>IGST Amt :</span>
                  <span>{igstAmount > 0 ? igstAmount.toFixed(2) : '- - - -.- -'}</span>
                </div>
                {invoice.discountAmount > 0 && (
                  <div className="summary-line discount">
                    <span>Discount :</span>
                    <span>- {invoice.discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="summary-line">
                  <span>Round off :</span>
                  <span>{roundOff.toFixed(2)}</span>
                </div>
                <div className="summary-total">
                  <span>Total Amount :</span>
                  <span>{invoice.totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="footer-section">
              <div className="declaration">
                <p className="section-title">Declaration</p>
                <p className="declaration-text">{termsConditions}</p>
                {invoice.notes && <p className="declaration-text"><span className="label">Remarks:</span> {invoice.notes}</p>}
                <p className="declaration-text mt-2">E. & O.E.</p>
              </div>
              <div className="signature">
                <p className="signature-for">For, {companyDetails.name}</p>
                <div className="stamp-box">Stamp</div>
                <p className="signature-label">Authorised Signatory</p>
              </div>
            </div>
          </div>

          {/* Thank you message */}
          <p>Generated on: {new Date().toLocaleString()}</p>
          <p className="thank-you">Thank You For Business With US!</p>
        </div>
      </div>

      <style>{`
        /* Screen-only styles */
        .screen-only {
          display: block;
        }

        .print-container {
          max-width: 210mm;
          margin: 0 auto;
          padding: 20px;
          background: white;
        }

        .invoice-page {
          font-family: Arial, sans-serif;
          font-size: 11px;
          line-height: 1.3;
        }

        /* Header */
        .invoice-header {
          text-align: center;
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 6px;
        }

        .invoice-title {
          font-size: 18px;
          font-weight: bold;
          flex: 1;
          text-align: center;
        }

        .invoice-type {
          font-size: 10px;
        }

        /* Company Box */
        .company-box {
          border: 2px solid;
        }

        .company-header {
          text-align: center;
          display: flex;
          align-items: center;
          padding: 10px;
          border-bottom: 2px solid ;
        }

        .company-logo {
          width: 90px;
          height: 90px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .logo-icon {
          width: 99px;
          height: 99px;
          color: white;
        }

        .company-info {
          flex: 1;
        }

        .company-gstin {
          font-size: 9px;
          margin-bottom: 3px;
        }

        .company-name {
          font-size: 15px;
          font-weight: bold;
          margin-bottom: 2px;
        }

        .company-detail {
          font-size: 10px;
          margin: 1px 0;
        }

        /* Info Grid */
        .info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          border-bottom: 2px solid ;
        }

        .bill-to, .ship-to {
          padding: 10px;
          border-right: 2px solid ;
        }

        .invoice-info, .order-info {
          padding: 10px;
        }

        .section-title {
          font-weight: bold;
          margin-bottom: 6px;
          font-size: 11px;
        }

        .info-line {
          font-size: 10px;
          margin: 2px 0;
        }

        .label {
          font-weight: 600;
        }

        .info-grid-2col {
          display: grid;
          grid-template-columns: auto 1fr;
          gap: 3px 8px;
          font-size: 10px;
        }

        .status-text {
          font-weight: 600;
        }

        /* Items Table */
        .items-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 10px;
        }

        .table-header th,
        .table-subheader th {
          background: #f3f4f6;
          padding: 6px 4px;
          border-right: 1px solid #9ca3af;
          font-weight: 600;
          text-align: center;
        }

        .table-header {
          border-bottom: 2px solid;
        }

        .col-sr { width: 5%; text-align: left; }
        .col-desc { width: 25%; text-align: left; }
        .col-hsn { width: 10%; }
        .col-qty { width: 12%; }
        .col-rate { width: 10%; text-align: right; }
        .col-taxable { width: 10%; text-align: right; }
        .col-gst-combined { width: 16%; text-align: center; }
        .col-total { width: 12%; text-align: right; }

        .gst-subheader {
          display: flex;
          justify-content: space-around;
          font-size: 9px;
          margin-top: 2px;
          border-top: 1px solid #9ca3af;
          padding-top: 2px;
        }

        .gst-cell {
          display: flex;
          justify-content: space-around;
          align-items: center;
        }

        .table-row td {
          padding: 6px 4px;
          border-bottom: 1px solid #9ca3af;
          border-right: 1px solid #9ca3af;
        }

        .empty-row {
          height: 30px;
        }

        .item-name {
          font-weight: 500;
        }

        .item-desc {
          font-size: 9px;
          color: #6b7280;
        }

        .text-left { text-align: left; }
        .text-center { text-align: center; }
        .text-right { text-align: right; }

        .table-footer td {
          padding: 6px 4px;
          background: #dbeafe;
          border-bottom: 2px solid ;
          border-right: 1px solid #9ca3af;
          font-weight: 600;
        }

        /* Bottom Section */
        .bottom-section {
          display: grid;
          grid-template-columns: 1fr 1fr;
        }

        .bank-details {
          padding: 10px;
          border-right: 2px solid ;
          font-size: 10px;
        }

        .bank-line {
          margin: 2px 0;
        }

        .mt-3 {
          margin-top: 10px;
        }

        .amount-words {
          font-size: 9px;
          margin-top: 3px;
        }

        .summary-section {
          padding: 10px;
        }

        .summary-header {
          display: flex;
          justify-content: space-between;
          background: #dbeafe;
          padding: 5px 6px;
          margin-bottom: 6px;
          font-weight: 600;
          font-size: 10px;
        }

        .summary-line {
          display: flex;
          justify-content: space-between;
          font-size: 10px;
          margin: 4px 0;
        }

        .summary-line.discount {
          color: #dc2626;
        }

        .summary-total {
          display: flex;
          justify-content: space-between;
          font-weight: 600;
          font-size: 10px;
          border-top: 2px solid;
          padding-top: 5px;
          margin-top: 5px;
        }

        /* Footer */
        .footer-section {
          display: grid;
          grid-template-columns: 1fr 1fr;
          border-top: 2px solid;
        }

        .declaration {
          padding: 10px;
          border-right: 2px solid ;
        }

        .declaration-text {
          font-size: 9px;
          margin: 2px 0;
        }

        .signature {
          padding: 10px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          align-items: flex-end;
        }

        .signature-for {
          font-size: 9px;
          margin-bottom: 6px;
        }

        .stamp-box {
          width: 60px;
          height: 60px;
          border: 2px solid #9ca3af;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 9px;
          color: #9ca3af;
          margin-bottom: 6px;
        }

        .signature-label {
          font-size: 10px;
          font-weight: 600;
        }

        /* Thank you */
        .thank-you {
          text-align: center;
          font-size: 10px;
          font-weight: 600;
          margin-top: 6px;
        }

        /* Print Styles */
        @media print {
          body * {
            visibility: hidden;
          }

          .print-container,
          .print-container * {
            visibility: visible;
          }

          .screen-only {
            display: none !important;
          }

          .print-container {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            max-width: none;
            padding: 0;
            margin: 0;
          }

          .invoice-page {
            padding: 8mm;
          }

          @page {
            size: A4;
            margin: 0;
          }

          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }

          .table-header th,
          .table-footer td {
            background: #f3f4f6 !important;
          }

          .summary-header {
            background: #dbeafe !important;
          }
        }
      `}</style>
    </>
  );
};