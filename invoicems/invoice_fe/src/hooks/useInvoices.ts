import { useState, useMemo, useCallback } from "react";
import { usePathname } from "next/navigation";
import { Invoice, SortDirection } from "@/impData/types";

type SortField = keyof Invoice;

interface UseInvoicesProps {
  initialInvoices: Invoice[];
  pageSize: number;
}

export function useInvoices({ initialInvoices, pageSize }: UseInvoicesProps) {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const pathname = usePathname();

  const handleSearch = useCallback((value: string) => {
    setSearchTerm(value);
    setPage(1);
  }, []);

  const handleSort = useCallback((field: SortField) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  }, [sortField]);

  const processedData = useMemo(() => {
    let filtered = initialInvoices;

    // Filter by status based on route
    const statusMap: { [key: string]: Invoice['status'] } = {
      "/invoices/paid": "PAID",
      "/invoices/unpaid": "PENDING",
      "/invoices/partialpaid": "PARTIAL_PAID",
      "/invoices/overdue": "OVERDUE",
      "/invoices/on-hold": "CANCELLED",
    };
    const statusToFilter = statusMap[pathname];
    if (statusToFilter) {
      filtered = filtered.filter((item) => item.status === statusToFilter);
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter((item) =>
        Object.values(item).some(val => 
          String(val).toLowerCase().includes(term)
        )
      );
    }

    if (sortField) {
      filtered = [...filtered].sort((a, b) => {
        const aVal = a[sortField];
        const bVal = b[sortField];
        const result = String(aVal).localeCompare(String(bVal), undefined, { numeric: true });
        return sortDirection === "asc" ? result : -result;
      });
    }
    return filtered;
  }, [initialInvoices, searchTerm, sortField, sortDirection, pathname]);

  const pagedData = useMemo(() =>
    processedData.slice((page - 1) * pageSize, page * pageSize),
    [processedData, page, pageSize]
  );

  const totalPages = Math.ceil(processedData.length / pageSize);

  return {
    pagedData,
    processedData,
    page,
    setPage,
    totalPages,
    handleSearch,
    handleSort,
  };
}