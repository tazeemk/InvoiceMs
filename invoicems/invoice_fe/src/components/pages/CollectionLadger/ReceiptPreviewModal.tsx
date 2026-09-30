"use client";

import { useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogContent,
} from "@/components/ui/alert-dialog";
import { X, Printer, Send } from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { amountToWords } from "@/lib/utils";
import { companyDetails } from "@/lib/company";
import KeyarLogo from "@/components/KeyarLogo";

type ReceiptDetails = {
  collectionId: string;
  customer: string;
  collectedAmount: string;
  paymentMethod: string;
  paymentRef: string;
  collectedBy: string;
  collectionDate: string;
  remarks?: string;
};

interface ReceiptPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  details: ReceiptDetails | null;
}

export default function ReceiptPreviewModal({
  isOpen,
  onClose,
  details,
}: ReceiptPreviewModalProps) {
  const receiptRef = useRef<HTMLDivElement>(null);

  if (!details) return null;

  const handleDownloadPdf = () => {
    const input = receiptRef.current;
    if (!input) return;

    const options: any = {
      scale: 2,
      useCORS: true,
    };

    html2canvas(input, options).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`receipt-${details.collectionId}.pdf`);
    });
  };

  const handlePrint = () => {
    const printContent = receiptRef.current?.innerHTML;
    if (!printContent) return;

    const printWindow = window.open("", "", "height=900,width=900");
    if (printWindow) {
      printWindow.document.write(
        "<html><head><title>Print Receipt</title>"
      );

      const links = document.head.getElementsByTagName("link");
      for (let i = 0; i < links.length; i++) {
        if (links[i].rel === "stylesheet") {
          printWindow.document.head.appendChild(
            links[i].cloneNode(true)
          );
        }
      }

      printWindow.document.write("</head><body>");
      printWindow.document.write(printContent);
      printWindow.document.write("</body></html>");
      printWindow.document.close();

      setTimeout(() => {
        printWindow.focus();
        printWindow.print();
        printWindow.close();
      }, 600);
    }
  };

  const handleSendEmail = () => {
    alert(
      `Emailing receipt for ${details.collectionId} to ${details.customer}.`
    );
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-5xl max-h-[95vh]">
        <div className="bg-white border rounded-xl shadow-lg overflow-y-auto max-h-[90vh] text-black">
          <div
            ref={receiptRef}
            className="p-10 space-y-10 leading-relaxed"
          >
            {/* HEADER */}
            <div className="text-center border-b pb-6 space-y-2">
              <KeyarLogo width={120} height={60} className="mx-auto object-contain" />
              <h1 className="text-3xl font-bold text-blue-700">
                {companyDetails.name}
              </h1>
              <p className="text-gray-600 text-base leading-6">
                GSTIN: {companyDetails.gstin}<br />
                Phone: {companyDetails.phones.join(", ")}
              </p>
            </div>

            {/* TITLE BAR */}
            <div className="bg-blue-600 text-white text-center py-3 text-lg font-semibold rounded-lg tracking-wide">
              PAYMENT RECEIPT
            </div>

            {/* DETAILS GRID */}
            <div className="grid grid-cols-2 gap-12 text-base">
              <div className="border rounded-lg p-6 bg-gray-50 shadow-sm space-y-3">
                <h3 className="font-semibold text-gray-700 text-lg">
                  Receipt Details
                </h3>

                <div className="flex justify-between">
                  <span>Receipt No:</span>
                  <span className="font-semibold">
                    {details.collectionId}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Date & Time:</span>
                  <span className="font-semibold">
                    {details.collectionDate}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Collected By:</span>
                  <span className="font-semibold">
                    {details.collectedBy}
                  </span>
                </div>
              </div>

              <div className="border rounded-lg p-6 bg-gray-50 shadow-sm space-y-3">
                <h3 className="font-semibold text-gray-700 text-lg">
                  Customer Details
                </h3>

                <div className="flex justify-between">
                  <span>Ledger Name:</span>
                  <span className="font-semibold">
                    {details.customer}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Payment Method:</span>
                  <span className="font-semibold">
                    {details.paymentMethod}
                  </span>
                </div>
              </div>
            </div>

            {/* AMOUNT SECTION */}
            <div className="border rounded-xl bg-yellow-50 p-10 text-center shadow-sm">
              <p className="text-gray-600 text-base uppercase tracking-wider">
                Amount Received
              </p>
              <p className="text-5xl font-bold text-yellow-700 tracking-wide mt-2">
                ₹
                {parseFloat(
                  details.collectedAmount
                ).toLocaleString()}
              </p>
              <p className="mt-3 text-base italic text-gray-700">
                (Rupees{" "}
                {amountToWords(
                  parseFloat(details.collectedAmount)
                )}{" "}
                Only)
              </p>
            </div>

            {/* SIGNATURE */}
            <div className="grid grid-cols-2 text-center mt-16 text-base gap-12">
              <div>
                <div className="border-t w-56 mx-auto"></div>
                <p className="mt-3 font-semibold">
                  {details.collectedBy}
                </p>
                <p className="text-gray-500 text-sm">
                  Collector’s Signature
                </p>
              </div>

              <div>
                <div className="border-t w-56 mx-auto"></div>
                <p className="mt-3 font-semibold">
                  {details.customer}
                </p>
                <p className="text-gray-500 text-sm">
                  Customer’s Signature
                </p>
              </div>
            </div>

            {/* FOOTER */}
            <div className="text-center text-sm text-gray-500 mt-8">
              Thank you for your payment! <br />
              For queries contact: {companyDetails.phones.join(", ")}
            </div>
          </div>

          {/* ACTIONS */}
          <div className="receipt-actions p-8 bg-gray-50 border-t flex justify-end gap-4">
            <Button variant="outline" onClick={handlePrint}>
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>

            <Button
              variant="outline"
              onClick={handleDownloadPdf}
            >
              Download PDF
            </Button>

            <Button variant="outline" onClick={handleSendEmail}>
              <Send className="h-4 w-4 mr-2" />
              Send
            </Button>

            <Button
              className="bg-emerald-600 hover:bg-emerald-700"
              onClick={onClose}
            >
              <X className="h-4 w-4 mr-2" />
              Close
            </Button>
          </div>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}