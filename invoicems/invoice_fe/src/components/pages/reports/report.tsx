"use client";

import { useEffect, useMemo, useState } from "react";
import { FileText, BarChart3, Receipt } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ReportsPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 300);
    return () => window.clearTimeout(timer);
  }, []);

  const summaryCards = useMemo(
    () => [
      { title: "Sales", value: "Available", icon: BarChart3 },
      { title: "Receipts", value: "Available", icon: Receipt },
      { title: "Invoices", value: "Available", icon: FileText },
    ],
    []
  );

  if (loading) {
    return <div className="p-6 text-sm text-gray-500">Loading reports…</div>;
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Reports</h1>
          <p className="text-sm text-gray-500">Reporting views are available through the dashboard sections.</p>
        </div>
        <Button variant="outline">Export</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {summaryCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.title} className="rounded-lg border bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{card.title}</p>
                  <p className="mt-2 text-xl font-semibold">{card.value}</p>
                </div>
                <Icon className="h-5 w-5 text-emerald-600" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
