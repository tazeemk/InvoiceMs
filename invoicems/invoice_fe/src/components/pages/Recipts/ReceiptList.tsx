"use client";

import { Search, File, Receipt } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useCallback, useEffect, useMemo } from "react";
import { Spinner } from "@/components/ui/spinner";
import ReceiptPreviewModal from "./components/ReceiptPreviewModal";
import { fetchReceipts, ReceiptDetails } from "@/service/recipt";

// ── Types ────────────────────────────────────────────────────────────────────

// ── Helpers ──────────────────────────────────────────────────────────────────

const fmt = (n: number) =>
  `₹${n.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;

const C = {
  green:       "#059669",
  greenDark:   "#059669",
  greenLight:  "#e8f5ee",
  greenBorder: "#b8deca",
  greenText:   "#059669",
  white:       "#ffffff",
  border:      "#e2e8f0",
  labelGray:   "#64748b",
  textDark:    "#1e293b",
  red:         "#dc2626",
  emerald:     "#059669",
  orange:      "#d97706",
};

const STATUS_COLORS: Record<string, { bg: string; color: string; label: string }> = {
  PAID:    { bg: "#dcfce7", color: "#059669", label: "Paid" },
  PARTIAL: { bg: "#fef9c3", color: "#b45309", label: "Partial" },
  PENDING: { bg: "#fee2e2", color: "#b91c1c", label: "Pending" },
};

function getStatus(receipt: ReceiptDetails): keyof typeof STATUS_COLORS {
  if (receipt.balanceOutstanding <= 0) return "PAID";
  if (receipt.collectedAmount > 0)     return "PARTIAL";
  return "PENDING";
}

// ── Sub-components ───────────────────────────────────────────────────────────

function StatusBadge({ receipt }: { receipt: ReceiptDetails }) {
  const st = STATUS_COLORS[getStatus(receipt)];
  return (
    <span style={{
      background: st.bg,
      color: st.color,
      fontSize: 11,
      fontWeight: 700,
      letterSpacing: "0.06em",
      padding: "3px 10px",
      borderRadius: 20,
      textTransform: "uppercase",
    }}>
      {st.label}
    </span>
  );
}

function ReceiptRow({
  receipt,
  onView,
}: {
  receipt: ReceiptDetails;
  onView: (r: ReceiptDetails) => void;
}) {
  return (
    <tr
      style={{ borderBottom: `1px solid ${C.border}`, cursor: "pointer" }}
      onClick={() => onView(receipt)}
      onMouseEnter={e => (e.currentTarget.style.background = "#f0fdf4")}
      onMouseLeave={e => (e.currentTarget.style.background = C.white)}
    >
      <td style={td}>
        <div style={{ fontWeight: 600, color: C.greenText, fontSize: 13 }}>{receipt.receiptNo}</div>
        <div style={{ fontSize: 11, color: C.labelGray }}>{receipt.invoiceNo}</div>
      </td>
      <td style={td}>
        <div style={{ fontWeight: 600, color: C.textDark, fontSize: 13 }}>{receipt.customer}</div>
        <div style={{ fontSize: 11, color: C.labelGray }}>{receipt.contactPerson}</div>
      </td>
      <td style={td}>
        <div style={{ fontSize: 13, color: C.textDark }}>{receipt.collectionDate}</div>
        <div style={{ fontSize: 11, color: C.labelGray }}>{receipt.assignUser}</div>
      </td>
      <td style={{ ...td, textAlign: "right" }}>
        <div style={{ fontWeight: 700, fontSize: 14, color: C.emerald }}>{fmt(receipt.collectedAmount)}</div>
        <div style={{ fontSize: 11, color: C.labelGray }}>{receipt.paymentMethod}</div>
      </td>
      <td style={{ ...td, textAlign: "right" }}>
        <div style={{ fontSize: 13, color: receipt.balanceOutstanding > 0 ? C.red : C.emerald, fontWeight: 600 }}>
          {fmt(receipt.balanceOutstanding)}
        </div>
      </td>
      <td style={{ ...td, textAlign: "center" }}>
        <StatusBadge receipt={receipt} />
      </td>
      <td style={{ ...td, textAlign: "center" }}>
        <button
          onClick={e => { e.stopPropagation(); onView(receipt); }}
          style={{
            padding: "5px 14px",
            borderRadius: 6,
            border: `1px solid ${C.greenBorder}`,
            background: C.greenLight,
            color: C.greenText,
            fontSize: 12,
            fontWeight: 600,
            cursor: "pointer",
          }}
          onMouseEnter={e => (e.currentTarget.style.background = C.greenBorder)}
          onMouseLeave={e => (e.currentTarget.style.background = C.greenLight)}
        >
          View
        </button>
      </td>
    </tr>
  );
}

const th: React.CSSProperties = {
  padding: "10px 14px",
  fontSize: 10,
  fontWeight: 700,
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  color: C.white,
  background: C.greenDark,
  borderBottom: `2px solid ${C.greenBorder}`,
  whiteSpace: "nowrap",
};

const td: React.CSSProperties = {
  padding: "12px 14px",
  verticalAlign: "middle",
};

// ── Main Component ───────────────────────────────────────────────────────────

export default function ReceiptList() {
  const [receipts, setReceipts]       = useState<ReceiptDetails[]>([]);
  const [isLoading, setIsLoading]     = useState(true);
  const [error, setError]             = useState<string | null>(null);
  const [search, setSearch]           = useState("");
  const [page, setPage]               = useState(1);
  const [previewReceipt, setPreviewReceipt] = useState<ReceiptDetails | null>(null);

  const pageSize = 10;

  // Fetch on mount
  useEffect(() => {
    (async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchReceipts();
        setReceipts(data);
      } catch (err) {
        setError("Failed to fetch receipts. Please try again later.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  // Search filter
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return receipts.filter(r => {
      const matchesSearch = !q || (
      r.receiptNo.toLowerCase().includes(q) ||
      r.customer.toLowerCase().includes(q) ||
      r.invoiceNo.toLowerCase().includes(q) ||
      r.orderNumber.toLowerCase().includes(q) ||
      r.assignUser.toLowerCase().includes(q) ||
      r.paymentMethod.toLowerCase().includes(q));
      return matchesSearch;
    });
  }, [receipts, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paged = useMemo(
    () => filtered.slice((page - 1) * pageSize, page * pageSize),
    [filtered, page]
  );

  // Reset to page 1 on search
  const handleSearch = useCallback((val: string) => {
    setSearch(val);
    setPage(1);
  }, []);

  // Summary stats
  const stats = useMemo(() => ({
    total:      receipts.length,
    totalAmt:   receipts.reduce((s, r) => s + r.collectedAmount, 0),
    outstanding: receipts.reduce((s, r) => s + r.balanceOutstanding, 0),
    paid:       receipts.filter(r => r.balanceOutstanding <= 0).length,
  }), [receipts]);

  // Export CSV
  const handleExport = useCallback(() => {
    const rows = [
      ["Receipt No", "Invoice No", "Order No", "Customer", "Contact", "Date", "Amount", "Method", "Ref", "Prev Outstanding", "Balance", "Collected By", "Location", "Remarks"],
      ...filtered.map(r => [
        r.receiptNo, r.invoiceNo, r.orderNumber, r.customer, r.contactPerson,
        r.collectionDate, r.collectedAmount, r.paymentMethod, r.paymentRef,
        r.previousOutstanding, r.balanceOutstanding, r.assignUser,
        r.collectionLocation, r.remarks ?? "",
      ]),
    ]
      .map(row => row.join(","))
      .join("\n");

    const blob = new Blob([rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "receipts.csv";
    a.click();
    URL.revokeObjectURL(url);
  }, [filtered]);

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-4">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Receipt className="h-6 w-6 text-emerald-700" />
          <h1 className="text-2xl font-bold tracking-tight text-emerald-900">Receipts</h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4 z-10" />
            <Input
              placeholder="Search receipts..."
              value={search}
              onChange={e => handleSearch(e.target.value)}
              className="pl-10 pr-2 py-2 w-64 border-green-200 focus:border-green-500 focus:ring-green-500"
            />
          </div>
          <Button
            variant="outline"
            onClick={handleExport}
            className="border-emerald-600 text-emerald-600 hover:bg-emerald-50"
          >
            <File className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      {!isLoading && !error && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
          {[
            { label: "Total Receipts",    value: stats.total.toString(),    color: C.green },
            { label: "Total Collected",   value: fmt(stats.totalAmt),       color: C.emerald },
            { label: "Balance Outstanding", value: fmt(stats.outstanding),  color: stats.outstanding > 0 ? C.red : C.emerald },
            { label: "Fully Paid",        value: stats.paid.toString(),     color: C.emerald },
          ].map(card => (
            <div key={card.label} style={{
              background: C.white,
              border: `1px solid ${C.border}`,
              borderTop: `3px solid ${card.color}`,
              borderRadius: 8,
              padding: "14px 18px",
            }}>
              <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: C.labelGray, marginBottom: 4 }}>
                {card.label}
              </div>
              <div style={{ fontSize: 20, fontWeight: 800, color: card.color }}>{card.value}</div>
            </div>
          ))}
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded" role="alert">
          <strong className="font-bold">Error: </strong>
          <span>{error}</span>
        </div>
      )}

      {/* Table */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Spinner size="lg" />
        </div>
      ) : (
        <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 10, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={th}>Receipt / Invoice</th>
                <th style={th}>Customer</th>
                <th style={th}>Date / Collected By</th>
                <th style={{ ...th, textAlign: "right" }}>Amount</th>
                <th style={{ ...th, textAlign: "right" }}>Balance</th>
                <th style={{ ...th, textAlign: "center" }}>Status</th>
                <th style={{ ...th, textAlign: "center" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {paged.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ padding: "48px", textAlign: "center", color: C.labelGray }}>
                    No receipts found.
                  </td>
                </tr>
              ) : (
                paged.map(r => (
                  <ReceiptRow key={r.id} receipt={r} onView={setPreviewReceipt} />
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3 border-t border-gray-200">
        <div className="text-sm text-gray-500">
          Showing {Math.min((page - 1) * pageSize + 1, filtered.length)} to{" "}
          {Math.min(page * pageSize, filtered.length)} of {filtered.length} results
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="border-green-200 hover:bg-green-50"
          >
            Previous
          </Button>
          <span className="text-sm text-gray-600 px-2">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="border-green-200 hover:bg-green-50"
          >
            Next
          </Button>
        </div>
      </div>

      {/* Receipt Preview Modal */}
      <ReceiptPreviewModal
        isOpen={!!previewReceipt}
        onClose={() => setPreviewReceipt(null)}
        details={previewReceipt}
      />
    </div>
  );
}
