"use client";

import { cn } from "@/lib/utils";
import { useCookies } from "react-cookie";
import {
  LayoutDashboard,
  FileText,
  Users,
  Settings,
  PieChart,
  UserCheck,
  ShoppingCart,
  Package,
  CreditCard,
  MapPin,
  Building2,
  User,
  Tags,
  ClipboardCheck,
  ClipboardList,
  Clock,
  CheckCircle2,
  Loader2,
  Truck,
  Box,
  XCircle,
  AlertTriangle,
  RotateCcw,
  PauseCircle,
  FileX,
  Receipt,
  FileCheck,
  DollarSign,
  Undo2,
  ShieldCheck,
  Upload,
  icons,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, Children } from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuButtonText,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

// ✅ Menu Items with Icons
const menuItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    url: "/dashboard",
  },
  {
    title: "Products",
    icon: Package,
    children: [
      { title: "Product", url: "/products", icon: Package },
      { title: "Product Category", url: "/products/category", icon: Tags },
    ],
  },
  {
    title: "Orders",
    icon: ShoppingCart,
    children: [
      { title: "Created Orders", url: "/orders/created", icon: ClipboardList },
      { title: "In Progress Orders", url: "/orders/in-progress", icon: Loader2 },
      { title: "Completed Orders", url: "/orders/completed", icon: ClipboardCheck },
    ],
  },

  {
    title: "Invoices",
    icon: FileText,
    children: [
      { title: "All", url: "/invoices/all", icon: FileText },
      { title: "Pending", url: "/invoices/pending", icon: FileX },
      { title: "Partial Paid", url: "/invoices/partialpaid", icon: Receipt },
      { title: "Overdue", url: "/invoices/overdue", icon: AlertTriangle },
      { title: "In Progress", url: "/invoices/inprogress", icon: Loader2 },
      { title: "Paid", url: "/invoices/paid", icon: FileCheck },
      { title: "Cancelled", url: "/invoices/cancelled", icon: XCircle },
      { title: "On Hold", url: "/invoices/onhold", icon: PauseCircle },
    ],
  },

  {
    title: "Payments",
    icon: CreditCard,
    children: [
      { title: "All", url: "/payments/all", icon: DollarSign },
      { title: "Pending", url: "/payments/pending", icon: Clock },
      { title: "Collected", url: "/payments/collected", icon: Package },
      { title: "Submitted", url: "/payments/submitted", icon: Receipt },
      { title: "Verified", url: "/payments/verified", icon: CheckCircle2 },
      { title: "Completed", url: "/payments/completed", icon: ClipboardCheck },
      { title: "Disputed", url: "/payments/disputed", icon: AlertTriangle },
      { title: "Refunded", url: "/payments/refunded", icon: Undo2 },
    ],
  },



  {
    title: "Print Receipts",
    icon: FileText,
    children: [
      { title: "Print Receipts", url: "/recipts", icon: FileText },

    ]
  },

  { title: "Customers", icon: Users, url: "/customer" },

    {
    title: "User Management",
    icon: User,
    allowedRoles: ["ADMIN"],
    children: [
      { title: "All", url: "/user/all", icon: Users },
      
      { title: "Collection Team", icon: Building2, url: "/user/collections" },
      { title: "Accounts", icon: UserCheck, url: "/user/accounts" },
    ],
  },

  {
    title: "Reports",
    icon: PieChart,
    children: [
      { title: "Sales Report", url: "/reports/sales", icon:Receipt },
       { title: "Collection Report", url: "/reports/receipt", icon: DollarSign },
      { title: "Financial Report", url: "/reports/financial", icon: DollarSign },
      { title: "Performance Report", url: "/reports/performance", icon: PieChart },
      // { title: "Collection Report", url: "/reports/collection", icon: Receipt },
      { title: "Customer Report", url: "/reports/customer", icon: Users },
      { title: "Custom Report", url: "/reports/custom", icon: FileText },


    
    ],
  },
  // { title: "Zone Management", icon: MapPin, url: "/zones" },
  { title: "Settings", icon: Settings, url: "/settings" },
];


export function AppSidebar() {
  const { state, setOpen, isMobile } = useSidebar();
  const pathname = usePathname();
  const [cookies] = useCookies(["userid", "role"]);  
  const [openSubmenus, setOpenSubmenus] = useState<{ [key: string]: boolean }>({});

  const toggleSubmenu = (title: string) => {
    setOpenSubmenus((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const userRole = cookies.role;

  const filteredMenuItems = menuItems.filter(item => {
    if (!mounted) return !item.allowedRoles; // On server, only show items without role restrictions

    if (!item.allowedRoles) {
      return true; // If no roles are specified, show the item
    }
    return item.allowedRoles.includes(userRole); // Check if user's role is in the allowed list
  });  

  return (
    <Sidebar>
      {/* Header */}
      <SidebarHeader className="p-6 border-b border-emerald-800/30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center flex-shrink-0 shadow-lg">
            <span className="text-white font-extrabold">K</span>
          </div>
          {(state === "expanded" || isMobile) && (
            <div className="min-w-0 text-white">
              <div className="font-extrabold leading-tight">Keyar</div>
              <div className="text-xs leading-tight whitespace-normal">NAMASTE SS INTERNATIONAL Pvt. Ltd.</div>
            </div>
          )}
        </div>
      </SidebarHeader>

      {/* Sidebar Menu */}
      <SidebarContent className="px-4 py-6">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {filteredMenuItems.map((item) => {
                const isActive = pathname === item.url;
                const hasChildren = Array.isArray(item.children);
                const isSubmenuOpen = openSubmenus[item.title];

                return (
                  <SidebarMenuItem key={item.title}>
                    {hasChildren ? (
                      <>
                        <SidebarMenuButton
                          onClick={() => toggleSubmenu(item.title)}
                          className={cn(
                            "h-12 px-4 rounded-xl transition-all duration-300 relative group hover:scale-[1.02]",
                            state === "collapsed" && "md:justify-center md:px-3",
                            "text-gray-300 hover:bg-white/5 hover:text-white hover:shadow-md"
                          )}
                            >
                          <item.icon className="w-5 h-5 flex-shrink-0" />
                          <SidebarMenuButtonText className="font-medium">
                            {item.title}
                          </SidebarMenuButtonText>
                        </SidebarMenuButton>

                        {/* Submenu */}
                        {isSubmenuOpen && (
                          <div className="ml-8 mt-2 space-y-1">
                            {item.children?.map((child: any) => (
                              child.children ? (
                                // Recursive submenu for nested children
                                <div key={child.title}>
                                  <SidebarMenuButton
                                    onClick={() => toggleSubmenu(child.title)}
                                    className={cn(
                                      "h-10 px-3 rounded-md transition-all duration-300 relative group hover:scale-[1.02]",
                                      state === "collapsed" && "md:justify-center md:px-3",
                                      "text-gray-300 hover:bg-white/5 hover:text-white hover:shadow-md"
                                    )}
                                  >
                                    {child.icon && <child.icon className="w-4 h-4 mr-2" />}
                                    <SidebarMenuButtonText className="font-medium">
                                      {child.title}
                                    </SidebarMenuButtonText>
                                  </SidebarMenuButton>
                                  {openSubmenus[child.title] && (
                                    <div className="ml-8 mt-1 space-y-1">
                                      {child.children.map((subchild: any) => (
                                        subchild.url ? (
                                          <Link
                                            key={subchild.title}
                                            href={subchild.url as string}
                                            onClick={() => isMobile && setOpen(false)}
                                          >
                                            <div
                                              className={cn(
                                                "h-10 flex items-center px-3 rounded-md text-sm transition hover:bg-white/10 hover:text-white",
                                                pathname === subchild.url
                                                  ? "bg-emerald-700/20 text-emerald-300"
                                                  : "text-gray-400"
                                              )}
                                            >
                                              {subchild.icon && <subchild.icon className="w-4 h-4 mr-2" />}
                                              {subchild.title}
                                            </div>
                                          </Link>
                                        ) : null
                                      ))}
                                    </div>
                                  )}
                                </div>
                              ) : child.url ? (
                                <Link
                                  key={child.title}
                                  href={child.url as string}
                                  onClick={() => isMobile && setOpen(false)}
                                >
                                  <div
                                    className={cn(
                                      "h-10 flex items-center px-3 rounded-md text-sm transition hover:bg-white/10 hover:text-white",
                                      pathname === child.url
                                        ? "bg-emerald-700/20 text-emerald-300"
                                        : "text-gray-400"
                                    )}
                                  >
                                    {child.icon && <child.icon className="w-4 h-4 mr-2" />}
                                    {child.title}
                                  </div>
                                </Link>
                              ) : null
                            ))}
                          </div>
                        )}
                      </>
                    ) : (
                      <Link
                        href={item.url!}
                        className="w-full"
                        onClick={() => isMobile && setOpen(false)}
                      >
                        <SidebarMenuButton
                          isActive={isActive}
                          className={cn(
                            "h-12 px-4 rounded-xl transition-all duration-300 relative group hover:scale-[1.02]",
                            state === "collapsed" && "md:justify-center md:px-3",
                            isActive
                              ? "bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 text-emerald-300 shadow-lg border border-emerald-500/30"
                              : "text-gray-300 hover:bg-white/5 hover:text-white hover:shadow-md"
                          )}
                        >
                          <item.icon className="w-5 h-5 flex-shrink-0" />
                          <SidebarMenuButtonText className="font-medium">
                            {item.title}
                          </SidebarMenuButtonText>
                          {isActive && (
                            <div className="absolute right-2 top-1/2 -translate-y-1/2 w-2 h-2 bg-emerald-400 rounded-full shadow-lg shadow-emerald-400/50" />
                          )}
                        </SidebarMenuButton>
                      </Link>
                    )}
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className="p-4 border-t border-emerald-800/30">
        <div className="bg-gradient-to-r from-emerald-900/30 to-emerald-800/30 rounded-xl p-4 backdrop-blur-sm border border-emerald-700/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center flex-shrink-0 shadow-lg">
              <User className="w-5 h-5 text-white" />
            </div>
            {(state === "expanded" || isMobile) && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{cookies.userid}</p>
                {mounted && (
                  <p className="text-xs text-emerald-200/70">
                    {cookies.role}
                  </p>
                )}
              </div>  
            )}
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
