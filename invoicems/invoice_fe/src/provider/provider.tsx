"use client";
import React, { useMemo, useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import { usePathname, useRouter } from "next/navigation";
import { Bell, Search, User } from "lucide-react";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/molecule/Sidebar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export default function AppProvider({ children }: { children: React.ReactNode }) {
  const [cookies] = useCookies(["userid", "role"]);
  const [showDropdown, setShowDropdown] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const NO_LAYOUT_ROUTES = ["/login", "/register", "/forgot-password", "/RegisterUser"];

  const queryClient = useMemo(() => new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: 1,
        staleTime: 30 * 1000,
        gcTime: 5 * 60 * 1000,
      },
    },
  }), []);

  if (NO_LAYOUT_ROUTES.includes(pathname)) {
    return (
      <QueryClientProvider client={queryClient}>
        <div className="min-h-screen w-full flex items-center justify-center">
          {children}
        </div>
      </QueryClientProvider>
    );
  }

  const isAdmin = mounted && cookies.role === "ROLE_ADMIN";
  const isUser = mounted && cookies.role === "user";

  const handleUserClick = () => setShowDropdown((prev) => !prev);

  const handleRegisterClick = () => {
    router.push("/RegisterUser");
    setShowDropdown(false);
  };

  const handleCloseDropdown = () => setShowDropdown(false);

  // Logout handler
  const handleLogout = () => {
    // Remove cookies for userid and role
    document.cookie = "userid=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "role=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    router.push("/login");
    setShowDropdown(false);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <SidebarProvider defaultOpen={true}>
        <div className="flex min-h-screen w-full">
          <div className="print-hide"><AppSidebar /></div>
          <SidebarInset className="flex-1 print-content">
            <header className="sticky top-0 z-20 flex h-16 items-center gap-4 px-6 bg-white/80 backdrop-blur-xl border-b border-emerald-100/50 shadow-sm print-hide">
              <SidebarTrigger />
              <div className="flex items-center justify-between flex-1">
                <div className="flex items-center gap-3">
                  <h1 className="text-xl font-bold text-emerald-900 truncate">{getPageTitle(pathname)}</h1>
                  <div className="hidden md:block w-px h-6 bg-emerald-200" />
                  <p className="hidden md:block text-sm text-emerald-600">{getPageDescription(pathname)}</p>
                </div>
                <div className="relative flex items-center gap-3">
                  <button className="relative h-10 w-10 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-600 flex items-center justify-center transition-all group">
                    <Bell className="h-5 w-5" />
                    <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full">
                      <span className="w-1.5 h-1.5 bg-white rounded-full block m-auto" />
                    </span>
                  </button>

                  <div className="h-8 w-px bg-emerald-200" />

                  <div className="flex items-center gap-3">
                    {mounted && (
                      <div className="hidden md:block text-right">
                        <p className="text-sm font-medium text-emerald-900">{cookies.userid}</p>
                        <p className="text-xs text-emerald-600">{cookies.role}</p>
                      </div>
                    )}

                    <div className="relative">
                      <button
                        onClick={handleUserClick}
                        className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 text-white flex items-center justify-center hover:shadow-xl transition-all"
                        title="User menu"
                      >
                        <User className="h-5 w-5" />
                      </button>

                      {showDropdown && (
                        <div className="absolute right-0 mt-2 w-64 bg-white border border-emerald-100 rounded-xl shadow-lg z-50 p-4 text-sm text-emerald-900">
                          <h3 className="font-bold text-emerald-700 mb-2">Admin Details</h3>
                          <p><span className="font-medium">Name:</span> Admin User</p>
                          <p><span className="font-medium">Email:</span> admin@example.com</p>
                          <p><span className="font-medium">Phone:</span> +1-234-567-8901</p>

                          {isAdmin && (
                            <button
                              onClick={handleRegisterClick}
                              className="mt-4 w-full bg-emerald-600 text-white py-2 rounded-lg hover:bg-emerald-700 font-semibold"
                            >
                              Register User
                            </button>
                          )}

                          <div className="flex gap-2 mt-2">
                            <button
                              onClick={handleCloseDropdown}
                              className="flex-1 bg-emerald-50 text-emerald-700 py-2 rounded-lg hover:bg-emerald-100"
                            >
                              Close
                            </button>
                            <button
                              onClick={handleLogout}
                              className="flex-1 bg-red-50 text-red-700 py-2 rounded-lg hover:bg-red-100"
                            >
                              Logout
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </header>

            <main className="flex-1 overflow-auto">
              <div className="p-6 h-full">{children}</div>
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </QueryClientProvider>
  );
}

// Titles
function getPageTitle(pathname: string): string {
  const pathMap: Record<string, string> = {
    "/": "Dashboard",
    "/dashboard": "Dashboard",

    // Orders
    "/orders": "Orders",
    "/orders/all": "All Orders",
    "/orders/order": "Place New Order",
    "/orders/created": "Created Orders",
    "/orders/in-progress": "In Progress Orders",
    "/orders/completed": "Completed Orders",
    "/orders/cancelled": "Cancelled Orders",
    "/orders/rejected": "Rejected Orders",

    // Products
    "/products": "Products",
    "/products/category": "Product Categories",

    // Invoices
    "/invoices": "Invoices",
    "/invoices/all": "All Invoices",
    "/invoices/paid": "Paid Invoices",
    "/invoices/unpaid": "Unpaid Invoices",
    "/invoices/partialpaid": "Partial Paid Invoices",
    "/invoices/overdue": "Overdue Invoices",
    "/invoices/on-hold": "On Hold Invoices",

    // Collections Ladger
    "/collectionLadger": "Collections Ladger",
    "/collectionLadger/all": "All Collections",
    "/collectionLadger/received": "Received Collections", 
    "/collectionLadger/pending": "Pending Collections",
    "/collectionLadger/collected": "Collected Collections",
    "/collectionLadger/validated": "Validated Collections",
    "/collectionLadger/synced": "Synced Collections",
    "/collectionLadger/failed": "Failed Collections",


    "/customer": "Customers",
    // Payments
    "/payments": "Payments",
    "/payments/all": "All Payments",
    "/payments/payment": "Add Payment",
    "/payments/pending": "Pending Payments",
    "/payments/collected": "Collected Payments",
    "/payments/submitted": "Submitted Payments",
    "/payments/verified": "Verified Payments",
    "/payments/completed": "Completed Payments",
    "/payments/disputed": "Disputed Payments",
    "/payments/refunded": "Refunded Payments",

    // User Management
    "/user/all": "All Users",
    "/user/users": "Users",
    "/user": "User Management",
    "/user/vendors": "Vendor Management",
    "/user/sales-persons": "Sales Person Management",
    "/user/retailers": "Retailer Management",

    // Reports & Settings
    "/reports": "Reports",
    "/zones": "Zone Management",
    "/settings": "Settings",
  };

  return pathMap[pathname] || "Dashboard";
}

// ✅ Descriptions
function getPageDescription(pathname: string): string {
  const descMap: Record<string, string> = {
    "/": "Overview of your business metrics",
    "/dashboard": "Overview of your business metrics",

    // Orders
    "/orders": "Manage customer orders across all stages",
    "/orders/all": "View and filter all orders",
    "/orders/order": "Create a new order for a retailer",
    "/orders/created": "Newly created orders",
    "/orders/in-progress": "Orders currently being processed",
    "/orders/completed": "Orders successfully completed",
    "/orders/cancelled": "Orders cancelled by an authorised user",
    "/orders/rejected": "Orders rejected before completion",

    // Products
    "/products": "Product catalog management",
    "/products/category": "Manage product categories",

    // Vendors & Retailers
    "/vendors": "Vendor relationship management",
    "/retailers": "Retailer network overview",

    // Invoices
    "/invoices": "Invoice management and tracking",
    "/invoices/all": "View and filter all invoices",
    "/invoices/paid": "List of paid invoices",
    "/invoices/unpaid": "Pending unpaid invoices",
    "/invoices/partialpaid": "Invoices partially paid",
    "/invoices/overdue": "Invoices overdue for payment",
    "/invoices/on-hold": "Invoices on hold for review",
    // Collections Ladger
    "/collectionLadger": "Manage and track collections",
    "/collectionLadger/all": "View and filter all collections",
    "/collectionLadger/received": "Received collections", 
    "/collectionLadger/pending": "Pending collections",
    "/collectionLadger/collected": "Collected collections",
    "/collectionLadger/validated": "Validated collections",
    "/collectionLadger/synced": "Synced collections",
    "/collectionLadger/failed": "Failed collections", 
            
    "/customer": "Manage customer details",
    // Payments
    "/payments": "Track and manage all payment transactions",
    "/payments/all": "View and filter all payments",
    "/payments/payment": "Record a new payment",
    "/payments/pending": "Pending – Payment created but not yet collected",
    "/payments/collected": "Collected – Payment collected from customer",
    "/payments/submitted": "Submitted – Forwarded to accounts team",
    "/payments/verified": "Verified – Checked and approved by accounts",
    "/payments/completed": "Completed – Payment successfully settled",
    "/payments/disputed": "Disputed – Payment under dispute (cheque bounce, mismatch)",
    "/payments/refunded": "Refunded – Payment returned to customer",

    // User Management
    "/user": "Manage internal user accounts and permissions",
    "/user/users": "Manage standard user accounts",
    "/user/all": "Manage all user accounts and roles",
    "/user/vendors": "Manage supplier and vendor information",
    "/user/sales-persons": "Manage sales team members and performance",
    "/user/retailers": "Manage retailer accounts and information",

    // Reports & Settings
    "/reports": "Business analytics and insights",
    "/zones": "Manage sales zones and territories",
    "/settings": "System configuration and preferences",
  };

  return descMap[pathname] || "Manage your business operations";
}
