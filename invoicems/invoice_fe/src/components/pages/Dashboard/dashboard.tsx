"use client";
import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { getUserRole } from "@/lib/cookies";
import { getRolePermissions } from "@/lib/roleConfig";
import { smClient } from "@/lib";

// ─── Types ────────────────────────────────────────────────────────────────────

interface OrderStatusCount {
  status: string;
  count: number;
  totalAmount: number;
}

interface RawOrder {
  orderId?: string;
  orderNumber?: string;
  retailer?: string;
  status?: string;
  totalAmount?: number;
  orderDate?: string;
  createdAt?: string;
}

interface RawCustomer {
  id?: string;
  customerCode?: string;
  businessName?: string;
  contactPerson?: string;
  mobile?: string;
  email?: string;
  city?: string;
  state?: string;
  currentOutstanding?: number;
  status?: string;
  createdAt?: string;
}

interface DashboardMetrics {
  created: OrderStatusCount;
  inProgress: OrderStatusCount;
  completed: OrderStatusCount;
  cancelled: OrderStatusCount;
  rejected: OrderStatusCount;
  totalOrders: number;
  totalRevenue: number;
  prevTotalOrders: number;
  prevTotalRevenue: number;
  recentOrders: RawOrder[];
  // Customer metrics
  totalCustomers: number;
  activeCustomers: number;
  inactiveCustomers: number;
  totalOutstanding: number;
  recentCustomers: RawCustomer[];
  prevTotalCustomers: number;
  prevTotalOutstanding: number;
}

// ─── Config ───────────────────────────────────────────────────────────────────

const STATUS_CONFIGS = [
  { key: "created",    label: "Created",     apiStatus: "CREATED",     route: "/orders/created",     icon: "📝", barColor: "#f59e0b", hex: "#fef3c7", textHex: "#92400e" },
  { key: "inProgress", label: "In Progress", apiStatus: "IN_PROGRESS", route: "/orders/in-progress", icon: "🔄", barColor: "#3b82f6", hex: "#dbeafe", textHex: "#1e3a5f" },
  { key: "completed",  label: "Completed",   apiStatus: "COMPLETED",   route: "/orders/completed",   icon: "🏆", barColor: "#22c55e", hex: "#dcfce7", textHex: "#14532d" },
  { key: "cancelled",  label: "Cancelled",   apiStatus: "CANCELLED",   route: "/orders/cancelled",   icon: "🚫", barColor: "#f43f5e", hex: "#ffe4e6", textHex: "#881337" },
  { key: "rejected",   label: "Rejected",    apiStatus: "REJECTED",    route: "/orders/rejected",   icon: "❌", barColor: "#6b7280", hex: "#f3f4f6", textHex: "#1f2937" },
];

const PIPELINE_STATUSES = ["created", "inProgress", "completed"];
const REFRESH_INTERVAL = 30;

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmt = (v: number) =>
  v >= 100000 ? `₹${(v / 100000).toFixed(1)}L`
  : v >= 1000  ? `₹${(v / 1000).toFixed(1)}K`
  : `₹${v}`;

const pct = (a: number, b: number) => (b === 0 ? 0 : Math.round((a / b) * 100));

const delta = (now: number, prev: number) => {
  if (prev === 0) return null;
  const d = Math.round(((now - prev) / prev) * 100);
  return { sign: d >= 0 ? "+" : "", val: `${Math.abs(d)}%`, up: d >= 0 };
};

const timeAgo = (dateStr?: string) => {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "—";
  const secs = Math.floor((Date.now() - d.getTime()) / 1000);
  if (secs < 60) return "just now";
  if (secs < 3600) return `${Math.floor(secs / 60)}m ago`;
  if (secs < 86400) return `${Math.floor(secs / 3600)}h ago`;
  return `${Math.floor(secs / 86400)}d ago`;
};

// ─── Sub-Components ───────────────────────────────────────────────────────────

function LiveDot({ color = "#10b981" }: { color?: string }) {
  return (
    <span className="relative flex h-2 w-2 flex-shrink-0">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60" style={{ backgroundColor: color }} />
      <span className="relative inline-flex rounded-full h-2 w-2" style={{ backgroundColor: color }} />
    </span>
  );
}

function SkeletonCard() {
  return (
    <div className="rounded-2xl bg-white border border-gray-100 p-4 animate-pulse">
      <div className="h-3 bg-gray-200 rounded w-20 mb-4" />
      <div className="h-7 bg-gray-200 rounded w-16 mb-2" />
      <div className="h-2 bg-gray-100 rounded w-14" />
    </div>
  );
}

function RingProgress({ value, size = 52, stroke = 5, color = "#10b981" }: {
  value: number; size?: number; stroke?: number; color?: string;
}) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (value / 100) * circ;
  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#e5e7eb" strokeWidth={stroke} />
      <circle
        cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke={color} strokeWidth={stroke}
        strokeDasharray={circ} strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: "stroke-dashoffset 0.9s ease" }}
      />
    </svg>
  );
}

function CountdownRing({ seconds, total }: { seconds: number; total: number }) {
  return (
    <div className="relative flex items-center justify-center w-7 h-7">
      <RingProgress value={pct(seconds, total)} size={28} stroke={3} color="#10b981" />
      <span className="absolute text-[8px] font-bold text-gray-500">{seconds}</span>
    </div>
  );
}

function DistributionBar({ metrics }: { metrics: DashboardMetrics }) {
  const total = metrics.totalOrders;
  if (total === 0) return <div className="h-2 bg-gray-100 rounded-full" />;
  return (
    <div className="flex h-2.5 rounded-full overflow-hidden w-full gap-px">
      {STATUS_CONFIGS.map(cfg => {
        const count = (metrics as any)[cfg.key]?.count ?? 0;
        const w = pct(count, total);
        if (w === 0) return null;
        return (
          <div
            key={cfg.key}
            title={`${cfg.label}: ${count} (${w}%)`}
            style={{ width: `${w}%`, backgroundColor: cfg.barColor }}
            className="transition-all duration-700"
          />
        );
      })}
    </div>
  );
}

function PipelineRow({ metrics, loading, router }: { metrics: DashboardMetrics | null; loading: boolean; router: ReturnType<typeof useRouter> }) {
  if (loading || !metrics) {
    return (
      <div className="flex gap-2 overflow-x-auto pb-1">
        {PIPELINE_STATUSES.map(k => (
          <div key={k} className="flex-1 min-w-[76px] h-20 rounded-xl bg-gray-100 animate-pulse" />
        ))}
      </div>
    );
  }
  const total = metrics.totalOrders || 1;
  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      {PIPELINE_STATUSES.map((key, i) => {
        const cfg = STATUS_CONFIGS.find(c => c.key === key)!;
        const count = (metrics as any)[key]?.count ?? 0;
        const fillW = Math.max(pct(count, total), 3);
        return (
          <div
            key={key}
            onClick={() => router.push(cfg.route)}
            className="flex-1 min-w-[76px] rounded-xl p-3 cursor-pointer hover:scale-[1.05] hover:shadow-md active:scale-[0.97] transition-all duration-150 relative overflow-hidden"
            style={{ backgroundColor: cfg.hex }}
          >
            <div
              className="absolute bottom-0 left-0 h-1 rounded-b-xl"
              style={{ width: `${fillW}%`, backgroundColor: cfg.barColor, transition: "width 0.8s ease" }}
            />
            <div className="text-sm mb-1">{cfg.icon}</div>
            <div className="text-[10px] font-semibold truncate" style={{ color: cfg.textHex }}>{cfg.label}</div>
            <div className="text-xl font-bold leading-tight" style={{ color: cfg.textHex }}>{count}</div>
            {i < PIPELINE_STATUSES.length - 1 && (
              <span className="absolute -right-1 top-1/2 -translate-y-1/2 text-[10px] text-gray-300 z-10">▶</span>
            )}
          </div>
        );
      })}
    </div>
  );
}

function RecentOrdersTable({ orders, loading, router }: { orders: RawOrder[]; loading: boolean; router: ReturnType<typeof useRouter> }) {
  const statusPill: Record<string, string> = {
    CREATED: "bg-amber-100 text-amber-700",
    IN_PROGRESS: "bg-blue-100 text-blue-700",
    COMPLETED: "bg-green-100 text-green-700",
    CANCELLED: "bg-rose-100 text-rose-700",
    REJECTED: "bg-gray-100 text-gray-500",
  };

  if (loading) {
    return (
      <div className="space-y-2">
        {[...Array(5)].map((_, i) => <div key={i} className="h-9 bg-gray-100 rounded-xl animate-pulse" />)}
      </div>
    );
  }
  if (!orders.length) {
    return <p className="text-sm text-gray-400 text-center py-8">No recent orders found.</p>;
  }
  return (
    <div className="overflow-x-auto -mx-1">
      <table className="w-full text-sm min-w-[420px]">
        <thead>
          <tr className="text-[10px] text-gray-400 uppercase tracking-wide border-b border-gray-100">
            <th className="text-left pb-2 px-1 font-medium">Order #</th>
            <th className="text-left pb-2 px-1 font-medium">Retailer</th>
            <th className="text-left pb-2 px-1 font-medium">Status</th>
            <th className="text-right pb-2 px-1 font-medium">Amount</th>
            <th className="text-right pb-2 px-1 font-medium">Time</th>
          </tr>
        </thead>
        <tbody>
          {orders.slice(0, 8).map((o, i) => (
            <tr
              key={o.orderId ?? i}
              onClick={() => router.push("/orders/all")}
              className="border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition-colors group"
            >
              <td className="py-2.5 px-1 font-mono text-xs text-gray-600 group-hover:text-emerald-600 transition-colors">
                {o.orderNumber ?? "—"}
              </td>
              <td className="py-2.5 px-1 text-xs text-gray-600 max-w-[100px] truncate">{o.retailer ?? "—"}</td>
              <td className="py-2.5 px-1">
                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap ${statusPill[o.status ?? ""] ?? "bg-gray-100 text-gray-400"}`}>
                  {o.status ?? "—"}
                </span>
              </td>
              <td className="py-2.5 px-1 text-right text-xs font-bold text-gray-700">{fmt(o.totalAmount ?? 0)}</td>
              <td className="py-2.5 px-1 text-right text-[10px] text-gray-400">{timeAgo(o.orderDate ?? o.createdAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function RecentCustomersTable({ customers, loading, router }: { customers: RawCustomer[]; loading: boolean; router: ReturnType<typeof useRouter> }) {
  if (loading) {
    return (
      <div className="space-y-2">
        {[...Array(5)].map((_, i) => <div key={i} className="h-9 bg-gray-100 rounded-xl animate-pulse" />)}
      </div>
    );
  }
  if (!customers.length) {
    return <p className="text-sm text-gray-400 text-center py-8">No recent customers found.</p>;
  }
  return (
    <div className="overflow-x-auto -mx-1">
      <table className="w-full text-sm min-w-[500px]">
        <thead>
          <tr className="text-[10px] text-gray-400 uppercase tracking-wide border-b border-gray-100">
            <th className="text-left pb-2 px-1 font-medium">Code</th>
            <th className="text-left pb-2 px-1 font-medium">Business Name</th>
            <th className="text-left pb-2 px-1 font-medium">Contact</th>
            <th className="text-left pb-2 px-1 font-medium">City</th>
            <th className="text-left pb-2 px-1 font-medium">Status</th>
            <th className="text-right pb-2 px-1 font-medium">Outstanding</th>
            <th className="text-right pb-2 px-1 font-medium">Added</th>
          </tr>
        </thead>
        <tbody>
          {customers.slice(0, 8).map((c, i) => (
            <tr
              key={c.id ?? i}
              onClick={() => router.push("/customer")}
              className="border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition-colors group"
            >
              <td className="py-2.5 px-1 font-mono text-xs text-gray-600 group-hover:text-emerald-600 transition-colors">
                {c.customerCode ?? "—"}
              </td>
              <td className="py-2.5 px-1 text-xs text-gray-700 font-medium max-w-[140px] truncate">
                {c.businessName ?? "—"}
              </td>
              <td className="py-2.5 px-1 text-xs text-gray-600 max-w-[100px] truncate">
                {c.contactPerson ?? "—"}
              </td>
              <td className="py-2.5 px-1 text-xs text-gray-600">{c.city ?? "—"}</td>
              <td className="py-2.5 px-1">
                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap ${
                  c.status === "ACTIVE" ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"
                }`}>
                  {c.status ?? "—"}
                </span>
              </td>
              <td className="py-2.5 px-1 text-right text-xs font-bold text-gray-700">
                {fmt(c.currentOutstanding ?? 0)}
              </td>
              <td className="py-2.5 px-1 text-right text-[10px] text-gray-400">{timeAgo(c.createdAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TopRetailers({ orders, loading }: { orders: RawOrder[]; loading: boolean }) {
  const ranked = useMemo(() => {
    const map: Record<string, number> = {};
    for (const o of orders) {
      if (o.retailer) map[o.retailer] = (map[o.retailer] ?? 0) + (o.totalAmount ?? 0);
    }
    return Object.entries(map).sort((a, b) => b[1] - a[1]).slice(0, 5);
  }, [orders]);

  const max = ranked[0]?.[1] ?? 1;
  const barColors = ["#10b981", "#3b82f6", "#8b5cf6", "#f59e0b", "#f43f5e"];

  if (loading) {
    return <div className="space-y-3">{[...Array(4)].map((_, i) => <div key={i} className="h-8 bg-gray-100 rounded-xl animate-pulse" />)}</div>;
  }
  if (!ranked.length) {
    return <p className="text-xs text-gray-400 text-center py-4">No retailer data yet.</p>;
  }
  return (
    <div className="space-y-3">
      {ranked.map(([name, val], i) => (
        <div key={name}>
          <div className="flex justify-between text-xs mb-1">
            <span className="font-medium text-gray-700 truncate max-w-[120px]">{i + 1}. {name}</span>
            <span className="text-gray-500 font-bold ml-2 flex-shrink-0">{fmt(val)}</span>
          </div>
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full"
              style={{ width: `${pct(val, max)}%`, backgroundColor: barColors[i], transition: "width 0.8s ease" }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function TopCustomersByOutstanding({ customers, loading }: { customers: RawCustomer[]; loading: boolean }) {
  const ranked = useMemo(() => {
    return [...customers]
      .filter(c => c.currentOutstanding && c.currentOutstanding > 0)
      .sort((a, b) => (b.currentOutstanding ?? 0) - (a.currentOutstanding ?? 0))
      .slice(0, 5);
  }, [customers]);

  const max = ranked[0]?.currentOutstanding ?? 1;
  const barColors = ["#f43f5e", "#f59e0b", "#8b5cf6", "#3b82f6", "#10b981"];

  if (loading) {
    return <div className="space-y-3">{[...Array(4)].map((_, i) => <div key={i} className="h-8 bg-gray-100 rounded-xl animate-pulse" />)}</div>;
  }
  if (!ranked.length) {
    return <p className="text-xs text-gray-400 text-center py-4">No outstanding amounts.</p>;
  }
  return (
    <div className="space-y-3">
      {ranked.map((c, i) => (
        <div key={c.id ?? i}>
          <div className="flex justify-between text-xs mb-1">
            <span className="font-medium text-gray-700 truncate max-w-[120px]">{i + 1}. {c.businessName ?? "—"}</span>
            <span className="text-rose-600 font-bold ml-2 flex-shrink-0">{fmt(c.currentOutstanding ?? 0)}</span>
          </div>
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full"
              style={{ width: `${pct(c.currentOutstanding ?? 0, max)}%`, backgroundColor: barColors[i], transition: "width 0.8s ease" }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────

export default function Dashboard() {
  const router = useRouter();

  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [countdown, setCountdown] = useState(REFRESH_INTERVAL);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [isOnline, setIsOnline] = useState(true);

  // Get user role and permissions
  const userRole = getUserRole();
  const permissions = getRolePermissions(userRole);

  // ── Data fetching ──────────────────────────────────────────────────────────

  const fetchByStatus = useCallback(async (apiStatus: string): Promise<{ count: number; totalAmount: number; orders: RawOrder[] }> => {
    const filters = apiStatus ? [{ attribute: "status", operation: "EQUALS", value: apiStatus }] : [];
    const response = await smClient.post("order/filterOrder", { limit: 1000, filters });
    const orders: RawOrder[] = Array.isArray(response.data) ? response.data : [];
    return {
      count: orders.length,
      totalAmount: orders.reduce((sum, order) => sum + (Number(order.totalAmount) || 0), 0),
      orders,
    };
  }, []);

  const fetchCustomers = useCallback(async (): Promise<RawCustomer[]> => {
    const response = await smClient.post("customers/filterCustomers", { limit: 1000, filters: [] });
    return Array.isArray(response.data) ? response.data : [];
  }, []);

  const fetchAllMetrics = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    try {
      const [results, allData, customersData] = await Promise.all([
        Promise.all(STATUS_CONFIGS.map(c => fetchByStatus(c.apiStatus))),
        fetchByStatus(""),
        fetchCustomers(),
      ]);
      setIsOnline(true);

      const recentOrders = [...allData.orders].sort((a, b) => {
        return new Date(b.orderDate ?? b.createdAt ?? 0).getTime() - new Date(a.orderDate ?? a.createdAt ?? 0).getTime();
      });

      const recentCustomers = [...customersData].sort((a, b) => {
        return new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime();
      });

      const activeCustomers = customersData.filter(c => c.status === "ACTIVE").length;
      const inactiveCustomers = customersData.filter(c => c.status !== "ACTIVE").length;
      const totalOutstanding = customersData.reduce((sum, c) => sum + (c.currentOutstanding ?? 0), 0);

      setMetrics(prev => ({
        created:    { status: "CREATED",     count: results[0].count, totalAmount: results[0].totalAmount },
        inProgress: { status: "IN_PROGRESS", count: results[1].count, totalAmount: results[1].totalAmount },
        completed:  { status: "COMPLETED",   count: results[2].count, totalAmount: results[2].totalAmount },
        cancelled:  { status: "CANCELLED",   count: results[3].count, totalAmount: results[3].totalAmount },
        rejected:   { status: "REJECTED",    count: results[4].count, totalAmount: results[4].totalAmount },
        totalOrders: allData.count,
        totalRevenue: allData.totalAmount,
        prevTotalOrders: prev?.totalOrders ?? 0,
        prevTotalRevenue: prev?.totalRevenue ?? 0,
        recentOrders,
        // Customer data
        totalCustomers: customersData.length,
        activeCustomers,
        inactiveCustomers,
        totalOutstanding,
        recentCustomers,
        prevTotalCustomers: prev?.totalCustomers ?? 0,
        prevTotalOutstanding: prev?.totalOutstanding ?? 0,
      }));

      setLastUpdated(new Date());
      setCountdown(REFRESH_INTERVAL);
    } catch {
      setIsOnline(false);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [fetchByStatus, fetchCustomers]);

  useEffect(() => { fetchAllMetrics(); }, [fetchAllMetrics]);

  // ── Auto-refresh countdown ─────────────────────────────────────────────────
  useEffect(() => {
    if (!autoRefresh) return;
    const tick = setInterval(() => {
      setCountdown(c => {
        if (c <= 1) { fetchAllMetrics(true); return REFRESH_INTERVAL; }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(tick);
  }, [autoRefresh, fetchAllMetrics]);

  // ── Derived values ─────────────────────────────────────────────────────────
  const completionRate = metrics ? pct(metrics.completed?.count ?? 0, metrics.totalOrders) : 0;
  const activeCount = metrics
    ? (metrics.created?.count ?? 0) + (metrics.inProgress?.count ?? 0)
    : 0;
  const cancelRate = metrics ? pct((metrics.cancelled?.count ?? 0) + (metrics.rejected?.count ?? 0), metrics.totalOrders) : 0;
  const orderDelta = metrics ? delta(metrics.totalOrders, metrics.prevTotalOrders) : null;
  const revDelta   = metrics ? delta(metrics.totalRevenue, metrics.prevTotalRevenue) : null;
  const customerDelta = metrics ? delta(metrics.totalCustomers, metrics.prevTotalCustomers) : null;
  const outstandingDelta = metrics ? delta(metrics.totalOutstanding, metrics.prevTotalOutstanding) : null;

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-full bg-[#f4f6f9] p-4 md:p-6 space-y-4" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=DM+Mono:wght@400;500&display=swap');`}</style>

      {/* ══ Header ══════════════════════════════════════════════════════════ */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-gray-900 tracking-tight">Overview</h1>
          <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1.5">
            <LiveDot color={isOnline ? "#10b981" : "#f43f5e"} />
            {isOnline ? "Connected" : "Offline"}
            {lastUpdated && ` · Updated ${timeAgo(lastUpdated.toISOString())}`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setAutoRefresh(v => !v)}
            title={autoRefresh ? "Pause auto-refresh" : "Resume auto-refresh"}
            className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-xl border transition-all ${
              autoRefresh ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "bg-white border-gray-200 text-gray-400"
            }`}
          >
            {autoRefresh ? <CountdownRing seconds={countdown} total={REFRESH_INTERVAL} /> : <span className="text-base">⏸</span>}
            <span className="hidden sm:inline text-[11px]">{autoRefresh ? `Auto` : "Paused"}</span>
          </button>
          <button
            onClick={() => fetchAllMetrics(true)}
            disabled={refreshing || loading}
            className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-xl border bg-white border-gray-200 text-gray-600 hover:border-emerald-300 hover:text-emerald-700 transition-all disabled:opacity-40"
          >
            <span className={`text-sm ${refreshing ? "animate-spin inline-block" : ""}`}>↻</span>
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>
      </div>

      {/* ══ KPI Cards (2 rows: Orders + Customers) ══════════════════════════ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">

        {/* Total Orders */}
        {permissions.showOrders && (
        <div
          onClick={() => router.push("/orders/all")}
          className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-4 md:p-5 text-white cursor-pointer hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 group"
        >
          <div className="flex justify-between items-start mb-3">
            <span className="text-[10px] font-bold opacity-80 uppercase tracking-widest">Total Orders</span>
            <span className="text-xl">📋</span>
          </div>
          {loading ? <div className="h-8 bg-white/20 rounded-lg animate-pulse w-20 mb-1" /> : (
            <div className="flex items-end gap-2 flex-wrap">
              <p className="text-3xl font-bold leading-none tabular-nums">{metrics?.totalOrders?.toLocaleString() ?? "0"}</p>
              {orderDelta && <TrendBadge {...orderDelta} />}
            </div>
          )}
          <p className="text-[10px] opacity-60 mt-1.5">All statuses · View all →</p>
        </div>
        )}

        {/* Revenue */}
        {permissions.showRevenue && (
        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-4 md:p-5 text-white">
          <div className="flex justify-between items-start mb-3">
            <span className="text-[10px] font-bold opacity-80 uppercase tracking-widest">Revenue</span>
            <span className="text-xl">💰</span>
          </div>
          {loading ? <div className="h-8 bg-white/20 rounded-lg animate-pulse w-24 mb-1" /> : (
            <div className="flex items-end gap-2 flex-wrap">
              <p className="text-3xl font-bold leading-none tabular-nums">{fmt(metrics?.totalRevenue ?? 0)}</p>
              {revDelta && <TrendBadge {...revDelta} />}
            </div>
          )}
          <p className="text-[10px] opacity-60 mt-1.5">All orders combined</p>
        </div>
        )}

        {/* Active */}
        {permissions.showOrders && (
        <div
          onClick={() => router.push("/orders/created")}
          className="bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl p-4 md:p-5 text-white cursor-pointer hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
        >
          <div className="flex justify-between items-start mb-3">
            <span className="text-[10px] font-bold opacity-80 uppercase tracking-widest">Active</span>
            <span className="text-xl">⚡</span>
          </div>
          {loading ? <div className="h-8 bg-white/20 rounded-lg animate-pulse w-12 mb-1" /> : (
            <p className="text-3xl font-bold leading-none tabular-nums">{activeCount}</p>
          )}
          <p className="text-[10px] opacity-60 mt-1.5">Created · In Progress</p>
        </div>
        )}

        {/* Completion ring */}
        {permissions.showOrders && (
        <div className="bg-white border border-gray-100 rounded-2xl p-4 md:p-5 shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Completion</span>
            <span className="text-xl">🏆</span>
          </div>
          {loading ? <div className="h-12 bg-gray-100 rounded-lg animate-pulse w-full" /> : (
            <div className="flex items-center gap-3">
              <div className="relative flex items-center justify-center flex-shrink-0">
                <RingProgress value={completionRate} size={52} stroke={5} color="#22c55e" />
                <span className="absolute text-[11px] font-bold text-gray-700">{completionRate}%</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800 tabular-nums">{metrics?.completed?.count ?? 0}</p>
                <p className="text-[10px] text-gray-400">of {metrics?.totalOrders ?? 0} orders</p>
                <p className="text-[10px] text-rose-400 mt-0.5">{cancelRate}% cancelled</p>
              </div>
            </div>
          )}
        </div>
        )}

        {/* Total Customers */}
        {permissions.showCustomers && (
        <div
          onClick={() => router.push("/customer")}
          className="bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl p-4 md:p-5 text-white cursor-pointer hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
        >
          <div className="flex justify-between items-start mb-3">
            <span className="text-[10px] font-bold opacity-80 uppercase tracking-widest">Customers</span>
            <span className="text-xl">👥</span>
          </div>
          {loading ? <div className="h-8 bg-white/20 rounded-lg animate-pulse w-20 mb-1" /> : (
            <div className="flex items-end gap-2 flex-wrap">
              <p className="text-3xl font-bold leading-none tabular-nums">{metrics?.totalCustomers?.toLocaleString() ?? "0"}</p>
              {customerDelta && <TrendBadge {...customerDelta} />}
            </div>
          )}
          <p className="text-[10px] opacity-60 mt-1.5">{metrics?.activeCustomers ?? 0} active · {metrics?.inactiveCustomers ?? 0} inactive</p>
        </div>
        )}

        {/* Total Outstanding */}
        {permissions.showOutstanding && (
        <div className="bg-gradient-to-br from-rose-500 to-pink-600 rounded-2xl p-4 md:p-5 text-white">
          <div className="flex justify-between items-start mb-3">
            <span className="text-[10px] font-bold opacity-80 uppercase tracking-widest">Outstanding</span>
            <span className="text-xl">⚠️</span>
          </div>
          {loading ? <div className="h-8 bg-white/20 rounded-lg animate-pulse w-24 mb-1" /> : (
            <div className="flex items-end gap-2 flex-wrap">
              <p className="text-3xl font-bold leading-none tabular-nums">{fmt(metrics?.totalOutstanding ?? 0)}</p>
              {outstandingDelta && <TrendBadge {...outstandingDelta} />}
            </div>
          )}
          <p className="text-[10px] opacity-60 mt-1.5">Pending payments from customers</p>
        </div>
        )}

        {/* Active Customers */}
        {permissions.showCustomers && (
        <div
          onClick={() => router.push("/customer")}
          className="bg-gradient-to-br from-cyan-500 to-blue-500 rounded-2xl p-4 md:p-5 text-white cursor-pointer hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
        >
          <div className="flex justify-between items-start mb-3">
            <span className="text-[10px] font-bold opacity-80 uppercase tracking-widest">Active Clients</span>
            <span className="text-xl">✅</span>
          </div>
          {loading ? <div className="h-8 bg-white/20 rounded-lg animate-pulse w-12 mb-1" /> : (
            <p className="text-3xl font-bold leading-none tabular-nums">{metrics?.activeCustomers ?? 0}</p>
          )}
          <p className="text-[10px] opacity-60 mt-1.5">Currently active customers</p>
        </div>
        )}

        {/* Avg Outstanding */}
        {permissions.showOutstanding && (
        <div className="bg-white border border-gray-100 rounded-2xl p-4 md:p-5 shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Avg Outstanding</span>
            <span className="text-xl">📊</span>
          </div>
          {loading ? <div className="h-8 bg-gray-100 rounded-lg animate-pulse w-20" /> : (
            <div>
              <p className="text-2xl font-bold text-gray-800 tabular-nums">
                {metrics?.totalCustomers ? fmt(Math.round((metrics.totalOutstanding / metrics.totalCustomers))) : "₹0"}
              </p>
              <p className="text-[10px] text-gray-400 mt-1">per customer</p>
            </div>
          )}
        </div>
        )}
      </div>

      {/* ══ Distribution Bar ════════════════════════════════════════════════ */}
      {!loading && metrics && permissions.showOrderStatusCards && (
        <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status Distribution</span>
            <div className="flex flex-wrap gap-x-3 gap-y-1">
              {STATUS_CONFIGS.map(cfg => (
                <button
                  key={cfg.key}
                  onClick={() => router.push(cfg.route)}
                  className="flex items-center gap-1 text-[10px] text-gray-500 hover:text-gray-800 transition-colors"
                >
                  <span className="w-2 h-2 rounded-full inline-block flex-shrink-0" style={{ backgroundColor: cfg.barColor }} />
                  {cfg.label}{" "}
                  <span className="font-bold text-gray-700">{(metrics as any)[cfg.key]?.count ?? 0}</span>
                </button>
              ))}
            </div>
          </div>
          <DistributionBar metrics={metrics} />
        </div>
      )}

      {/* ══ Pipeline ════════════════════════════════════════════════════════ */}
      {permissions.showOrderPipeline && (
      <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
        <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Order Pipeline</h3>
        <PipelineRow metrics={metrics} loading={loading} router={router} />
      </div>
      )}

      {/* ══ 8 Status Cards ══════════════════════════════════════════════════ */}
      {permissions.showOrderStatusCards && (
      <div>
        <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Status Breakdown</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {STATUS_CONFIGS.map(cfg => {
            const data = metrics ? (metrics as any)[cfg.key] as OrderStatusCount : null;
            return loading ? <SkeletonCard key={cfg.key} /> : (
              <div
                key={cfg.key}
                onClick={() => router.push(cfg.route)}
                className="group relative bg-white border border-gray-100 rounded-2xl p-4 shadow-sm hover:shadow-md hover:scale-[1.03] active:scale-[0.97] transition-all duration-150 cursor-pointer overflow-hidden"
              >
                <div className="absolute left-0 top-3 bottom-3 w-[3px] rounded-full" style={{ backgroundColor: cfg.barColor }} />
                <div className="flex items-center justify-between mb-3 pl-2">
                  <span className="text-base">{cfg.icon}</span>
                  <LiveDot color={cfg.barColor} />
                </div>
                <p className="text-2xl font-bold text-gray-800 pl-2 tabular-nums">{data?.count?.toLocaleString() ?? "0"}</p>
                <p className="text-xs font-semibold text-gray-500 pl-2 mt-0.5">{cfg.label}</p>
                <p className="text-[10px] text-gray-400 pl-2 mt-1 font-medium">{fmt(data?.totalAmount ?? 0)}</p>
                <span className="absolute right-3 bottom-3 text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: cfg.barColor }}>→</span>
              </div>
            );
          })}
        </div>
      </div>
      )}

      {/* ══ Tables: Recent Orders + Recent Customers ════════════════════════ */}
      {(permissions.showRecentOrders || permissions.showRecentCustomers) && (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        
        {/* Recent Orders */}
        {permissions.showRecentOrders && (
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
              Recent Orders
              {!loading && metrics && <span className="text-[10px] bg-emerald-50 text-emerald-600 font-semibold px-2 py-0.5 rounded-full">{metrics.recentOrders.length}</span>}
            </h3>
            <button onClick={() => router.push("/orders/all")} className="text-xs text-emerald-600 font-semibold hover:underline">
              View all →
            </button>
          </div>
          <RecentOrdersTable orders={metrics?.recentOrders ?? []} loading={loading} router={router} />
        </div>
        )}

        {/* Recent Customers */}
        {permissions.showRecentCustomers && (
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
              Recent Customers
              {!loading && metrics && <span className="text-[10px] bg-violet-50 text-violet-600 font-semibold px-2 py-0.5 rounded-full">{metrics.recentCustomers.length}</span>}
            </h3>
            <button onClick={() => router.push("/customer")} className="text-xs text-violet-600 font-semibold hover:underline">
              View all →
            </button>
          </div>
          <RecentCustomersTable customers={metrics?.recentCustomers ?? []} loading={loading} router={router} />
        </div>
        )}
      </div>
      )}

      {/* ══ Bottom: Top Retailers + Top Customers by Outstanding ════════════ */}
      {(permissions.showTopRetailers || permissions.showTopOutstanding) && (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Top Retailers */}
        {permissions.showTopRetailers && (
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
          <h3 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
            Top Retailers
            <span className="text-[10px] text-gray-400 font-normal">by order value</span>
          </h3>
          <TopRetailers orders={metrics?.recentOrders ?? []} loading={loading} />
        </div>
        )}

        {/* Top Customers by Outstanding */}
        {permissions.showTopOutstanding && (
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
          <h3 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
            Top Outstanding
            <span className="text-[10px] text-gray-400 font-normal">highest pending amounts</span>
          </h3>
          <TopCustomersByOutstanding customers={metrics?.recentCustomers ?? []} loading={loading} />
        </div>
        )}
      </div>
      )}

      {/* ══ Quick Actions ════════════════════════════════════════════════════ */}
      {permissions.showQuickActions && (
      <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
        <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {[
            { label: "Add Order",      icon: "➕", route: "/orders/all",    bg: "#d1fae5", text: "#065f46", show: permissions.showOrders },
            { label: "Created Orders", icon: "📝", route: "/orders/created", bg: "#fef3c7", text: "#92400e", show: permissions.showOrders },
            { label: "All Orders",     icon: "📋", route: "/orders/all",    bg: "#dbeafe", text: "#1e3a5f", show: permissions.showOrders },
            { label: "Add Customer",   icon: "👤", route: "/customer",      bg: "#ede9fe", text: "#4c1d95", show: permissions.showCustomers },
            { label: "View Customers", icon: "👥", route: "/customer",      bg: "#ccfbf1", text: "#134e4a", show: permissions.showCustomers },
          ].filter(a => a.show).map((a, i) => (
            <button
              key={i}
              onClick={() => router.push(a.route)}
              className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl border border-gray-100 hover:shadow-md hover:scale-[1.03] active:scale-[0.97] transition-all duration-150"
              style={{ backgroundColor: a.bg }}
            >
              <span className="text-2xl">{a.icon}</span>
              <span className="text-xs font-semibold text-center" style={{ color: a.text }}>{a.label}</span>
            </button>
          ))}
        </div>
      </div>
      )}

    </div>
  );
}

// ─── TrendBadge ────────────────────────────────────────────────────────────────
function TrendBadge({ up, val, sign }: { up: boolean; val: string; sign: string }) {
  return (
    <span className={`inline-flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
      up ? "bg-white/20 text-white" : "bg-rose-500/30 text-white"
    }`}>
      {up ? "▲" : "▼"} {sign}{val}
    </span>
  );
}