"use client";

import { useState, useEffect } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar
} from "recharts";




const API_BASE = `${process.env.NEXT_PUBLIC_APP_BASE_URL || "http://192.168.1.65:8060/"}receipts/report`;

const COLORS = ["#1a73e8","#34a853","#fbbc04","#ea4335","#9334e6","#00acc1","#e67c22"];

const fmt = (val) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(val ?? 0);

/* ─── KPI Card ─── */
function KpiCard({ label, value, icon, color }) {
  return (
    <div style={{
      background: "#fff",
      borderRadius: 12,
      padding: "20px 24px",
      flex: 1,
      minWidth: 180,
      boxShadow: "0 1px 6px rgba(0,0,0,0.08)",
      borderLeft: `4px solid ${color}`
    }}>
      <div style={{ fontSize: 11, color: "#888", fontWeight: 600, letterSpacing: 1, textTransform: "uppercase" }}>
        {label}
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 8 }}>
        <div style={{ fontSize: 26, fontWeight: 700, color: "#1a1a2e" }}>{value}</div>
        <div style={{ fontSize: 32 }}>{icon}</div>
      </div>
    </div>
  );
}

/* ─── Section Card ─── */
function Card({ title, children, style = {} }) {
  return (
    <div style={{
      background: "#fff",
      borderRadius: 12,
      padding: 24,
      boxShadow: "0 1px 6px rgba(0,0,0,0.08)",
      ...style
    }}>
      {title && <h3 style={{ margin: "0 0 16px", fontSize: 16, fontWeight: 600, color: "#1a1a2e" }}>{title}</h3>}
      {children}
    </div>
  );
}

/* ─── Main Component ─── */
export default function ReceiptReport() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const fetchReport = async () => {
    setLoading(true);
    setError(null);
    try {
      let url = `${API_BASE}/summary`;
      const params = [];
      if (startDate) params.push(`startDate=${startDate}`);
      if (endDate)   params.push(`endDate=${endDate}`);
      if (params.length) url += "?" + params.join("&");

      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch report");
      const data = await res.json();
      setReport(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchReport(); }, []);

  /* ── Derived chart data ── */
  const monthlyData = report
    ? Object.entries(report.monthlyTrend || {}).map(([month, amount]) => ({ month, amount: Number(amount) }))
    : [];

  const paymentPieData = report
    ? Object.entries(report.paymentMethodAmount || {}).map(([name, value]) => ({ name, value: Number(value) }))
    : [];

  const collectorData = report
    ? Object.entries(report.collectedByAmount || {}).map(([name, amount]) => ({ name, amount: Number(amount) }))
    : [];

  const paymentCountData = report
    ? Object.entries(report.paymentMethodBreakdown || {}).map(([name, count]) => ({ name, count: Number(count) }))
    : [];

  return (
    <div style={{ fontFamily: "'Segoe UI', sans-serif", background: "#f4f6fa", minHeight: "100vh", padding: "0 0 40px" }}>

      {/* ── Header ── */}
      <div style={{ background: "#fff", padding: "20px 32px", borderBottom: "1px solid #e8eaed", marginBottom: 24 }}>
        <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "#1a1a2e" }}>
          Receipt Report Dashboard
        </h2>
        <p style={{ margin: "4px 0 0", color: "#888", fontSize: 13 }}>Overview of your receipt collections</p>
      </div>

      <div style={{ padding: "0 32px" }}>

        {/* ── Date Filter ── */}
        <Card style={{ marginBottom: 24 }}>
          <div style={{ display: "flex", gap: 16, alignItems: "flex-end", flexWrap: "wrap" }}>
            <div>
              <label style={{ display: "block", fontSize: 12, color: "#666", marginBottom: 4, fontWeight: 600 }}>
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                style={{
                  border: "1px solid #ddd", borderRadius: 8, padding: "8px 12px",
                  fontSize: 13, outline: "none", cursor: "pointer"
                }}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 12, color: "#666", marginBottom: 4, fontWeight: 600 }}>
                End Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                style={{
                  border: "1px solid #ddd", borderRadius: 8, padding: "8px 12px",
                  fontSize: 13, outline: "none", cursor: "pointer"
                }}
              />
            </div>
            <button
              onClick={fetchReport}
              style={{
                background: "#1a73e8", color: "#fff", border: "none",
                borderRadius: 8, padding: "9px 20px", fontSize: 13,
                fontWeight: 600, cursor: "pointer"
              }}
            >
              Apply Filter
            </button>
            <button
              onClick={() => { setStartDate(""); setEndDate(""); setTimeout(fetchReport, 0); }}
              style={{
                background: "#f1f3f4", color: "#444", border: "none",
                borderRadius: 8, padding: "9px 20px", fontSize: 13,
                fontWeight: 600, cursor: "pointer"
              }}
            >
              Reset
            </button>
          </div>
        </Card>

        {/* ── Loading / Error ── */}
        {loading && (
          <div style={{ textAlign: "center", padding: 60, color: "#888", fontSize: 15 }}>
            Loading receipt data...
          </div>
        )}
        {error && (
          <div style={{
            background: "#fff3f3", border: "1px solid #ffcdd2", borderRadius: 8,
            padding: 16, color: "#c62828", marginBottom: 24
          }}>
            ⚠ {error}
          </div>
        )}

        {report && !loading && (
          <>
            {/* ── KPI Row ── */}
            <div style={{ display: "flex", gap: 16, marginBottom: 24, flexWrap: "wrap" }}>
              <KpiCard label="Total Collected"     value={fmt(report.totalAmount)}              icon="💰" color="#1a73e8" />
              <KpiCard label="Total Receipts"      value={report.totalReceipts}                 icon="🧾" color="#34a853" />
              <KpiCard label="Avg Receipt Amount"  value={fmt(report.averageReceiptAmount)}     icon="📊" color="#fbbc04" />
              <KpiCard label="Balance Outstanding" value={fmt(report.totalBalanceOutstanding)}  icon="⚠️"  color="#ea4335" />
            </div>

            {/* ── Charts Row 1 ── */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 24 }}>

              {/* Monthly Trend */}
              <Card title="Monthly Collection Trend">
                <ResponsiveContainer width="100%" height={260}>
                  <LineChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                    <YAxis tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} tick={{ fontSize: 11 }} />
                    <Tooltip formatter={(v) => fmt(v)} />
                    <Legend />
                    <Line
                      type="monotone" dataKey="amount" name="Monthly Collection"
                      stroke="#1a73e8" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Card>

              {/* Payment Method Pie */}
              <Card title="Collection by Payment Method">
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie
                      data={paymentPieData}
                      cx="50%" cy="50%"
                      outerRadius={100}
                      dataKey="value"
                      label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                      labelLine={false}
                    >
                      {paymentPieData.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v) => fmt(v)} />
                  </PieChart>
                </ResponsiveContainer>
              </Card>
            </div>

            {/* ── Charts Row 2 ── */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 24 }}>

              {/* Collected By Bar */}
              <Card title="Collection by Collector">
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={collectorData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis type="number" tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} tick={{ fontSize: 11 }} />
                    <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={80} />
                    <Tooltip formatter={(v) => fmt(v)} />
                    <Bar dataKey="amount" name="Amount" fill="#34a853" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Card>

              {/* Payment Count Bar */}
              <Card title="Receipt Count by Payment Method">
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={paymentCountData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Bar dataKey="count" name="Receipts" fill="#9334e6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </div>

            {/* ── Top Customers Table ── */}
            <Card title="Top Customers by Collection" style={{ marginBottom: 24 }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead>
                  <tr style={{ background: "#f8f9fa" }}>
                    {["#", "Customer Name", "Receipts", "Total Amount", "Avg Amount"].map((h) => (
                      <th key={h} style={{
                        padding: "10px 14px", textAlign: "left",
                        fontWeight: 600, color: "#555", fontSize: 12,
                        borderBottom: "2px solid #e8eaed"
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {(report.topCustomers || []).map((c, i) => (
                    <tr key={i} style={{ borderBottom: "1px solid #f0f0f0" }}
                      onMouseEnter={(e) => e.currentTarget.style.background = "#f8f9fa"}
                      onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
                      <td style={{ padding: "10px 14px", color: "#888" }}>{i + 1}</td>
                      <td style={{ padding: "10px 14px", fontWeight: 500 }}>{c.customerName}</td>
                      <td style={{ padding: "10px 14px" }}>
                        <span style={{
                          background: "#e8f0fe", color: "#1a73e8",
                          borderRadius: 12, padding: "2px 10px", fontSize: 12, fontWeight: 600
                        }}>{c.receiptCount}</span>
                      </td>
                      <td style={{ padding: "10px 14px", fontWeight: 600, color: "#1a1a2e" }}>{fmt(c.totalAmount)}</td>
                      <td style={{ padding: "10px 14px", color: "#555" }}>
                        {fmt(c.receiptCount ? c.totalAmount / c.receiptCount : 0)}
                      </td>
                    </tr>
                  ))}
                  {!(report.topCustomers?.length) && (
                    <tr><td colSpan={5} style={{ padding: 24, textAlign: "center", color: "#aaa" }}>No data available</td></tr>
                  )}
                </tbody>
              </table>
            </Card>

            {/* ── Recent Receipts Table ── */}
            <Card title="Recent Receipts">
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead>
                  <tr style={{ background: "#f8f9fa" }}>
                    {["Receipt No", "Customer", "Date", "Amount", "Payment Method", "Collected By", "Balance"].map((h) => (
                      <th key={h} style={{
                        padding: "10px 14px", textAlign: "left",
                        fontWeight: 600, color: "#555", fontSize: 12,
                        borderBottom: "2px solid #e8eaed"
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {(report.recentReceipts || []).map((r, i) => (
                    <tr key={i} style={{ borderBottom: "1px solid #f0f0f0" }}
                      onMouseEnter={(e) => e.currentTarget.style.background = "#f8f9fa"}
                      onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
                      <td style={{ padding: "10px 14px", color: "#1a73e8", fontWeight: 500 }}>{r.receiptNo}</td>
                      <td style={{ padding: "10px 14px" }}>{r.customerName}</td>
                      <td style={{ padding: "10px 14px", color: "#666" }}>{r.receiptDate}</td>
                      <td style={{ padding: "10px 14px", fontWeight: 600 }}>{fmt(r.amount)}</td>
                      <td style={{ padding: "10px 14px" }}>
                        <span style={{
                          background: "#e6f4ea", color: "#34a853",
                          borderRadius: 12, padding: "2px 10px", fontSize: 12, fontWeight: 600
                        }}>{r.paymentMethod || "—"}</span>
                      </td>
                      <td style={{ padding: "10px 14px", color: "#666" }}>{r.collectedBy || "—"}</td>
                      <td style={{ padding: "10px 14px", color: r.balanceOutstanding > 0 ? "#ea4335" : "#34a853", fontWeight: 600 }}>
                        {fmt(r.balanceOutstanding)}
                      </td>
                    </tr>
                  ))}
                  {!(report.recentReceipts?.length) && (
                    <tr><td colSpan={7} style={{ padding: 24, textAlign: "center", color: "#aaa" }}>No data available</td></tr>
                  )}
                </tbody>
              </table>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}