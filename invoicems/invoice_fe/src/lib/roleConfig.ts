// Role-based dashboard configuration
export type UserRole = 'ADMIN' | 'ACCOUNTS' | 'SALESPERSON' | 'COLLECTION' | 'USER';

export interface DashboardPermissions {
  showOrders: boolean;
  showRevenue: boolean;
  showCustomers: boolean;
  showPayments: boolean;
  showOutstanding: boolean;
  showUsers: boolean;
  showOrderPipeline: boolean;
  showOrderStatusCards: boolean;
  showRecentOrders: boolean;
  showRecentCustomers: boolean;
  showTopRetailers: boolean;
  showTopOutstanding: boolean;
  showQuickActions: boolean;
}

export const rolePermissions: Record<UserRole, DashboardPermissions> = {
  ADMIN: {
    showOrders: true,
    showRevenue: true,
    showCustomers: true,
    showPayments: true,
    showOutstanding: true,
    showUsers: true,
    showOrderPipeline: true,
    showOrderStatusCards: true,
    showRecentOrders: true,
    showRecentCustomers: true,
    showTopRetailers: true,
    showTopOutstanding: true,
    showQuickActions: true,
  },
  ACCOUNTS: {
    showOrders: true,
    showRevenue: true,
    showCustomers: true,
    showPayments: true,
    showOutstanding: true,
    showUsers: false, // Accounts cannot see users
    showOrderPipeline: true,
    showOrderStatusCards: true,
    showRecentOrders: true,
    showRecentCustomers: true,
    showTopRetailers: true,
    showTopOutstanding: true,
    showQuickActions: true,
  },
  SALESPERSON: {
    showOrders: true,
    showRevenue: false,
    showCustomers: false,
    showPayments: false,
    showOutstanding: false,
    showUsers: false,
    showOrderPipeline: true,
    showOrderStatusCards: true,
    showRecentOrders: true,
    showRecentCustomers: false,
    showTopRetailers: true,
    showTopOutstanding: false,
    showQuickActions: true,
  },
  COLLECTION: {
    showOrders: false,
    showRevenue: false,
    showCustomers: true,
    showPayments: true,
    showOutstanding: true,
    showUsers: false,
    showOrderPipeline: false,
    showOrderStatusCards: false,
    showRecentOrders: false,
    showRecentCustomers: true,
    showTopRetailers: false,
    showTopOutstanding: true,
    showQuickActions: true,
  },
  USER: {
    showOrders: true,
    showRevenue: true,
    showCustomers: true,
    showPayments: true,
    showOutstanding: true,
    showUsers: false, // User cannot see users
    showOrderPipeline: true,
    showOrderStatusCards: true,
    showRecentOrders: true,
    showRecentCustomers: true,
    showTopRetailers: true,
    showTopOutstanding: true,
    showQuickActions: true,
  },
};

export const getRolePermissions = (role?: string): DashboardPermissions => {
  if (!role) return rolePermissions.USER;
  
  const normalizedRole = role.toUpperCase().replace('ROLE_', '') as UserRole;
  return rolePermissions[normalizedRole] || rolePermissions.USER;
};
