import React, { useState } from "react";
import {
  Eye,
  ChevronUp,
  ChevronDown,
  IndianRupee,
  Send,
  ShieldCheck,
  CheckCircle2,
  RefreshCcw,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import PaymentCollectionModal from "./PaymentCollectionModal";
import ReceiptPreviewModal from "./ReceiptPreviewModal";
import { Invoice, SortDirection } from "@/impData/types";
import { updateInvoiceStatus } from "@/service/payment";

type SortField = keyof Invoice;

interface PaymentTableProps {
  invoices: Invoice[];
  onView?: (invoice: Invoice) => void;
  onSort?: (field: SortField) => void;
  sortField?: SortField | null;
  sortDirection?: SortDirection;
  /** Optional: called after a status-transition action succeeds */
  onStatusChange?: (invoiceId: string, newStatus: Invoice["status"], updatedInvoice: Invoice) => void;
}

// ─── Status Styles ────────────────────────────────────────────────────────────
const STATUS_STYLES: Record<string, string> = {
  PENDING:      "bg-yellow-100 text-yellow-800 border border-yellow-200",
  COLLECTED:    "bg-cyan-100 text-cyan-800 border border-cyan-200",
  SUBMITTED:    "bg-indigo-100 text-indigo-800 border border-indigo-200",
  VERIFIED:     "bg-green-100 text-green-800 border border-green-200",
  COMPLETED:    "bg-emerald-100 text-emerald-800 border border-emerald-200",
  DISPUTED:     "bg-red-100 text-red-800 border border-red-200",
  REFUNDED:     "bg-orange-100 text-orange-800 border border-orange-200",
  PAID:         "bg-green-100 text-green-800 border border-green-200",
  OVERDUE:      "bg-red-100 text-red-800 border border-red-200",
  PARTIAL_PAID: "bg-orange-100 text-orange-800 border border-orange-200",
  IN_PROGRESS:  "bg-blue-100 text-blue-800 border border-blue-200",
  ON_HOLD:      "bg-purple-100 text-purple-800 border border-purple-200",
  CANCELLED:    "bg-gray-300 text-gray-700 border border-gray-400",
};

const StatusBadge: React.FC<{ status: string }> = ({ status }) => (
  <span
    className={`px-2 py-1 rounded text-xs font-medium ${
      STATUS_STYLES[status] ?? "bg-gray-100 text-gray-800 border border-gray-200"
    }`}
  >
    {status.replace(/_/g, " ")}
  </span>
);

// ─── Sortable Header ──────────────────────────────────────────────────────────
const SortableHeader: React.FC<{
  label: string;
  field: SortField;
  onSort?: (field: SortField) => void;
  sortField?: SortField | null;
  sortDirection?: SortDirection;
}> = ({ label, field, onSort, sortField, sortDirection }) => {
  const active = sortField === field;
  return (
    <TableHead
      onClick={() => onSort?.(field)}
      className="cursor-pointer select-none whitespace-nowrap"
    >
      <div className="flex items-center gap-1">
        {label}
        {active ? (
          sortDirection === "asc" ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )
        ) : (
          <div className="h-4 w-4" />
        )}
      </div>
    </TableHead>
  );
};

// ─── Action Config per Status ─────────────────────────────────────────────────
type ActionConfig = {
  /** true  → show the "Collect Payment" (₹) button */
  showCollect: boolean;
  /** defined → show a status-transition button */
  transition?: {
    label:      string;
    icon:       React.ReactNode;
    btnClass:   string;
    newStatus:  Invoice["status"];
  };
};

const getActionConfig = (status: Invoice["status"]): ActionConfig => {
  switch (status) {
    case "PENDING":
      return {
        showCollect: true,
      };

    case "COLLECTED":
      return {
        showCollect: false,
        transition: {
          label:     "Submit",
          icon:      <Send className="h-3.5 w-3.5" />,
          btnClass:  "bg-indigo-600 hover:bg-indigo-700 text-white",
          newStatus: "SUBMITTED",
        },
      };

    case "SUBMITTED":
      return {
        showCollect: false,
        transition: {
          label:     "Verify",
          icon:      <ShieldCheck className="h-3.5 w-3.5" />,
          btnClass:  "bg-green-600 hover:bg-green-700 text-white",
          newStatus: "VERIFIED",
        },
      };

    case "VERIFIED":
      return {
        showCollect: false,
        transition: {
          label:     "Complete",
          icon:      <CheckCircle2 className="h-3.5 w-3.5" />,
          btnClass:  "bg-emerald-600 hover:bg-emerald-700 text-white",
          newStatus: "COMPLETED",
        },
      };

    case "DISPUTED":
      return {
        showCollect: false,
        transition: {
          label:     "Resolve",
          icon:      <RefreshCcw className="h-3.5 w-3.5" />,
          btnClass:  "bg-rose-600 hover:bg-rose-700 text-white",
          newStatus: "PENDING",
        },
      };

    // View-only statuses — no extra actions
    case "COMPLETED":
    case "REFUNDED":
      return { showCollect: false };

    // Fallback: overdue / partial / in-progress — allow collection
    default:
      return { showCollect: true };
  }
};

// ─── Confirm Dialog ───────────────────────────────────────────────────────────
interface ConfirmDialogProps {
  isOpen:       boolean;
  actionLabel:  string;           // "Submit" | "Verify" | "Complete" | "Resolve"
  confirmClass: string;
  icon:         React.ReactNode;
  invoice:      Invoice;
  isLoading:    boolean;
  error:        string | null;
  onConfirm:    () => void;
  onCancel:     () => void;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  actionLabel,
  confirmClass,
  icon,
  invoice,
  isLoading,
  error,
  onConfirm,
  onCancel,
}) => (
  <AlertDialog open={isOpen} onOpenChange={onCancel}>
    <AlertDialogContent className="sm:max-w-md">
      <AlertDialogHeader>
        <AlertDialogTitle className="flex items-center gap-2 text-gray-800">
          {icon}
          Are you sure to {actionLabel}?
        </AlertDialogTitle>
      </AlertDialogHeader>

      {/* ── Invoice detail card ── */}
      <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 space-y-2 text-sm">
        <div className="flex justify-between items-center">
          <span className="text-gray-500 font-medium">Invoice No</span>
          <span className="font-semibold text-gray-800">{invoice.invoiceNumber || "—"}</span>
        </div>
        <div className="border-t border-gray-200" />
        <div className="flex justify-between items-center">
          <span className="text-gray-500 font-medium">Order No</span>
          <span className="font-semibold text-gray-800">
            {(invoice as any).orderNumber || "—"}
          </span>
        </div>
        <div className="border-t border-gray-200" />
        <div className="flex justify-between items-center">
          <span className="text-gray-500 font-medium">Customer</span>
          <span className="font-semibold text-gray-800 truncate max-w-[180px] text-right">
            {invoice.customerName || "—"}
          </span>
        </div>
        <div className="border-t border-gray-200" />
        <div className="flex justify-between items-center">
          <span className="text-gray-500 font-medium">Collect Amount</span>
          <span className="font-bold text-emerald-700 text-base">
            ₹{((invoice as any).collectionAmount ?? invoice.paidAmount ?? 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
          </span>
        </div>
      </div>

      {/* ── API error ── */}
      {error && (
        <div className="flex items-start gap-2 text-sm text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded-md">
          <span className="mt-0.5 flex-shrink-0">⚠</span>
          <span>{error}</span>
        </div>
      )}

      <AlertDialogFooter>
        <AlertDialogCancel asChild>
          <Button variant="outline" onClick={onCancel} disabled={isLoading}>
            Cancel
          </Button>
        </AlertDialogCancel>
        <AlertDialogAction asChild>
          <Button className={confirmClass} onClick={onConfirm} disabled={isLoading}>
            {isLoading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Processing…
              </span>
            ) : (
              <>Confirm {actionLabel}</>
            )}
          </Button>
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
);

// ─── Main Component ───────────────────────────────────────────────────────────
export const PaymentTable: React.FC<PaymentTableProps> = ({
  invoices,
  onView,
  onSort,
  sortField,
  sortDirection,
  onStatusChange,
}) => {
  // ── Collect-payment modal ──
  const [collectModalOpen, setCollectModalOpen] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState<{
    id:                  string;
    invoiceNo:           string;
    orderNumber:         string;
    customer:            string;
    customerCode:        string;
    contactPerson:       string;
    mobile:              string;
    billingAddress:      string;
    city:                string;
    state:               string;
    amount:              number;
    previousOutstanding: number;
  } | null>(null);

  // ── Receipt modal ──
  const [receiptOpen, setReceiptOpen] = useState(false);
  const [receiptDetails, setReceiptDetails] = useState<{
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
  } | null>(null);

  // ── Status-transition confirm dialog ──
  const [confirmDialog, setConfirmDialog] = useState<{
    invoice: Invoice;
    config:  NonNullable<ActionConfig["transition"]>;
  } | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionError, setTransitionError] = useState<string | null>(null);

  // ── Open collect modal ──
  const openCollect = (inv: Invoice) => {
    setSelectedCollection({
      id:                  inv.id,
      invoiceNo:           inv.invoiceNumber,
      orderNumber:         (inv as any).orderNumber ?? "",
      customer:            inv.customerName,
      customerCode:        (inv as any).customerCode ?? "",
      contactPerson:       (inv as any).contactPerson ?? "",
      mobile:              (inv as any).mobile ?? "",
      billingAddress:      (inv as any).billingAddress ?? "",
      city:                (inv as any).city ?? "",
      state:               (inv as any).state ?? "",
      amount:              inv.outstandingAmount,
      previousOutstanding: inv.outstandingAmount,
    });
    setCollectModalOpen(true);
  };

  // ── Receipt number generator ──
  const generateReceiptNumber = () => {
    const now = new Date();
    const pad = (n: number, l = 2) => String(n).padStart(l, "0");
    return [
      String(now.getFullYear()).slice(-2),
      pad(now.getMonth() + 1),
      pad(now.getDate()),
      pad(now.getHours()),
      pad(now.getMinutes()),
      pad(now.getSeconds()),
      pad(now.getMilliseconds(), 3),
    ].join("");
  };

  // ── After successful payment collection ──
  const handleGenerateReceipt = (details: any) => {
    const snap = selectedCollection;
    const inv: Invoice = details.updatedInvoice;

    // Notify parent to update the invoice in its list
    if (onStatusChange) {
      onStatusChange(inv.id, inv.status, inv);
    }

    setCollectModalOpen(false);
    setSelectedCollection(null);
    setReceiptDetails({
      receiptNo:           generateReceiptNumber(),
      invoiceNo:           snap?.invoiceNo     ?? inv.invoiceNumber,
      orderNumber:         snap?.orderNumber   ?? (inv as any).orderNumber ?? "",
      collectionId:        snap?.id            ?? details.collectionId,
      customer:            snap?.customer      ?? inv.customerName,
      customerCode:        snap?.customerCode  ?? (inv as any).customerCode ?? "",
      contactPerson:       snap?.contactPerson ?? (inv as any).contactPerson ?? "",
      mobile:              snap?.mobile        ?? (inv as any).mobile ?? "",
      billingAddress:      snap?.billingAddress ?? (inv as any).billingAddress ?? "",
      city:                snap?.city          ?? (inv as any).city ?? "",
      state:               snap?.state         ?? (inv as any).state ?? "",
      collectedAmount:     details.amount,
      paymentMethod:       details.method,
      paymentRef:          details.reference,
      assignUser:          details.collectedBy || inv.assignUser || "",
      collectionDate:      details.collectionDate,
      collectionLocation:  details.location ?? "",
      previousOutstanding: snap?.previousOutstanding ?? 0,
      remarks:             details.remarks,
    });
    setReceiptOpen(true);
  };

  // ── Status-transition confirm — real API call ──
  const handleTransitionConfirm = async () => {
    if (!confirmDialog) return;
    setIsTransitioning(true);
    setTransitionError(null);
    try {
      const updatedInvoice = await updateInvoiceStatus(
        confirmDialog.invoice.id,
        confirmDialog.config.newStatus
      );
      onStatusChange?.(confirmDialog.invoice.id, confirmDialog.config.newStatus, updatedInvoice);
      setConfirmDialog(null);
    } catch (err: any) {
      console.error("Status transition failed:", err);
      const msg =
        err?.response?.data?.message ||
        err?.response?.data ||
        err?.message ||
        "Failed to update status. Please try again.";
      setTransitionError(typeof msg === "string" ? msg : "Failed to update status. Please try again.");
    } finally {
      setIsTransitioning(false);
    }
  };

  return (
    <>
      <div className="border border-green-200 rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <SortableHeader label="Invoice #"    field="invoiceNumber"     onSort={onSort} sortField={sortField} sortDirection={sortDirection} />
              <SortableHeader label="Status"       field="status"            onSort={onSort} sortField={sortField} sortDirection={sortDirection} />
              <SortableHeader label="Customer"     field="customerName"      onSort={onSort} sortField={sortField} sortDirection={sortDirection} />
              <SortableHeader label="Assigned To"  field="assignUser"        onSort={onSort} sortField={sortField} sortDirection={sortDirection} />
              <SortableHeader label="Invoice Date" field="invoiceDate"       onSort={onSort} sortField={sortField} sortDirection={sortDirection} />
              <SortableHeader label="Due Date"     field="dueDate"           onSort={onSort} sortField={sortField} sortDirection={sortDirection} />
              <SortableHeader label="Total"        field="totalAmount"       onSort={onSort} sortField={sortField} sortDirection={sortDirection} />
              <SortableHeader label="Paid"         field="paidAmount"        onSort={onSort} sortField={sortField} sortDirection={sortDirection} />
              <SortableHeader label="Outstanding"  field="outstandingAmount" onSort={onSort} sortField={sortField} sortDirection={sortDirection} />
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {invoices.length > 0 ? (
              invoices.map((inv) => {
                const { showCollect, transition } = getActionConfig(inv.status);

                return (
                  <TableRow key={inv.id} className="hover:bg-gray-50 transition-colors">
                    <TableCell className="font-medium">{inv.invoiceNumber}</TableCell>
                    <TableCell><StatusBadge status={inv.status} /></TableCell>
                    <TableCell>{inv.customerName}</TableCell>
                    <TableCell>
                      {inv.assignUser || (
                        <span className="text-gray-400 text-xs">Unassigned</span>
                      )}
                    </TableCell>
                    <TableCell>{inv.invoiceDate}</TableCell>
                    <TableCell>{inv.dueDate}</TableCell>
                    <TableCell>&#8377;{inv.totalAmount.toFixed(2)}</TableCell>
                    <TableCell>&#8377;{inv.paidAmount.toFixed(2)}</TableCell>
                    <TableCell>&#8377;{inv.outstandingAmount.toFixed(2)}</TableCell>

                    <TableCell>
                      <div className="flex items-center gap-1 justify-center">

                        {/* ── View Invoice (always shown) ── */}
                        {onView && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onView(inv)}
                            className="h-8 w-8 p-0 hover:bg-green-100"
                            title="View Invoice"
                          >
                            <Eye className="h-4 w-4 text-green-600" />
                          </Button>
                        )}

                        {/* ── Collect Payment ── PENDING / fallback statuses ── */}
                        {showCollect && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openCollect(inv)}
                            className="h-8 w-8 p-0 hover:bg-emerald-100"
                            title="Collect Payment"
                          >
                            <IndianRupee className="h-4 w-4 text-emerald-600" />
                          </Button>
                        )}

                        {/* ── Status Transition Button ── COLLECTED / SUBMITTED / VERIFIED / DISPUTED ── */}
                        {transition && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              setConfirmDialog({ invoice: inv, config: transition })
                            }
                            className="h-8 px-2.5 text-xs flex items-center gap-1.5 border-gray-300 hover:border-gray-400 hover:bg-gray-50"
                            title={transition.title}
                          >
                            {transition.icon}
                            {transition.label}
                          </Button>
                        )}

                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={10} className="text-center text-gray-500 py-10">
                  No payments found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* ── Payment Collection Modal ── */}
      <PaymentCollectionModal
        isOpen={collectModalOpen}
        onClose={() => setCollectModalOpen(false)}
        collection={selectedCollection}
        onGenerateReceipt={handleGenerateReceipt}
      />

      {/* ── Receipt Preview Modal ── */}
      <ReceiptPreviewModal
        isOpen={receiptOpen}
        onClose={() => setReceiptOpen(false)}
        details={receiptDetails}
      />

      {/* ── Status Transition Confirm Dialog ── */}
      {confirmDialog && (
        <ConfirmDialog
          isOpen
          actionLabel={confirmDialog.config.label}
          confirmClass={confirmDialog.config.btnClass}
          icon={confirmDialog.config.icon}
          invoice={confirmDialog.invoice}
          isLoading={isTransitioning}
          error={transitionError}
          onConfirm={handleTransitionConfirm}
          onCancel={() => { setConfirmDialog(null); setTransitionError(null); }}
        />
      )}
    </>
  );
};