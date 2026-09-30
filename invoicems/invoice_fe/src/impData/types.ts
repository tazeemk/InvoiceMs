

export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  role: 'ADMIN' | 'COLLECTION' | 'ACCOUNTS' | 'CUSTOMER' | 'USER';
  status: 'ACTIVE' | 'INACTIVE';
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Customer {
  id: string;
  userId: string;
  customerCode: string;
  businessName: string;
  gstin: string;
  pan: string;
  contactPerson: string;
  mobile: string;
  email: string;
  address: string;
  city: string;
  state: string;
  creditDays: number;
  currentOutstanding: number;
  status: "ACTIVE" | "INACTIVE";
  createdAt: string;
  updatedAt: string;
}
export interface Vendor{

    id: string,
    userId: string,
    companyName: string,
    contactPerson: string,
    phone: string,
    primaryAddressId: string,
    billingAddressId: string,
    gstNumber: string,
    status: "ACTIVE" | "INACTIVE",
    createdAt: string
    updatedAt: string;

}

export interface UserToken {
  id: string;
  userId: string;
  tokenType: 'ACCESS' | 'REFRESH';
  expiresAt: string;
  createdAt: string;
}

export interface State {
  id: string;
  stateName: string;
  stateCode: string;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
}

export interface City {
  id: string;
  cityName: string;
  stateId: string;
  pincode: string;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
}

export interface Address {
  id: string;
  addressLine1: string;
  addressLine2?: string;
  landmark?: string;
  cityId: string;
  pincode: string;
  addressType: 'OFFICE' | 'SHOP' | 'HOME' | 'WAREHOUSE';
  isPrimary: boolean;
  createdAt: string;
}

export interface UserAddress {
  id: string;
  userId: string;
  addressId: string;
  addressLabel: string;
  isPrimary: boolean;
  isBilling: boolean;
  isShipping: boolean;
  createdAt: string;
}

export interface Zone {
  id: string;
  zoneName: string;
  zoneCode: string;
  description?: string;
  status: 'ACTIVE' | 'INACTIVE';
  createdBy: string;
  createdAt: string;
}

export interface ZoneAssignment {
  id: string;
  userId: string;
  zoneId: string;
  assignedDate: string;
  status: 'ACTIVE' | 'INACTIVE';
  assignedBy: string;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  status: "Active" | "Inactive";
  productCount: number;
  description?: string;
  createdBy: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Product {
  id: string;
  productName: string;
  productCode: string;
  productCount?:any;
  categoryId: string;
  
  description: string;
  unitPrice: number;
  stockUnit: string;
  taxRate: number;
  status: "ACTIVE" | "INACTIVE";
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface Salesperson {
  id: string;
  userId: string;
  employeeCode: string;
  fullName: string;
  phone: string;
  primaryAddressId: string;
  joiningDate: string;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
}

export interface Retailer {
  id: string;
  userId: string;
  shopName: string;
  ownerName: string;
  phone: string;
  shopAddressId: string;
  billingAddressId: string;
  deliveryAddressId: string;
  gstNumber?: string;
  creditLimit: number;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  updatedAt: string;
  description?: string;
}

export interface Order {
  orderId?: number;
  orderNumber: string;
  retailer: string;
  salesperson: string;
  customer: string;
  status?: string;
  orderDate: string;
  expectedDeliveryDate: string;
  totalAmount: number;
  description?: string;
  orderlist?: OrderItem[];
  createdAt?: string;
  updatedAt?: string;
}

export interface OrderItem {
  product: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  taxRate: string | number; // Can be string or number for flexibility
  taxAmount: number;
}

export interface OrderStatusHistory {
  id: string;
  orderId: string;
  previousStatus?: string;
  newStatus: string;
  changedBy: string;
  changeReason: string;
  changedAt: string;
}
// Add these fields to your existing Invoice interface in types.ts

export interface Invoice {
  id: string;
  invoiceNumber: string;
  orderId: string;
  customerName: string;
  salespersonId: string;
  vendorId: string;
  invoiceDate: string;
  dueDate: string;
  billingCycle: string;
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
  paidAmount: number;
  outstandingAmount: number;
  status: 'PENDING' | 'PAID' | 'OVERDUE' | 'CANCELLED' | 'PARTIAL_PAID' | 'APPROVED';
  notes: string;
  createdAt: string;
  updatedAt: string;
  items: InvoiceItem[];
  
  // Additional fields from API
  gstin?: string;
  billingAddress?: string;
  shippingAddress?: string;
  state?: string;
  contactPerson?: string;
  mobile?: string;
  cgstAmount?: number;
  sgstAmount?: number;
  igstAmount?: number;
  roundOff?: number;
  termsConditions?: string;
}

export interface InvoiceItem {
  id: string;
  itemName: string;
  description: string;
  quantity: number;
  unit: string;
  rate: number;
  totalAmount: number;
  discountPercent?: number;
  discountAmount?: number;
  taxableAmount?: number;
  cgstRate?: number;
  cgstAmount?: number;
  sgstRate?: number;
  sgstAmount?: number;
  igstRate?: number;
  igstAmount?: number;
  hsnCode?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PaymentMethod {
  id: string;
  methodName: string;
  methodCode: string;
  description?: string;
  status: 'ACTIVE' | 'INACTIVE';
  createdBy: string;
  createdAt: string;
}

export interface Payment {
  id: string;
  paymentNumber: string;
  invoiceId: string;
  retailerId: string;
  salespersonId: string;
  paymentMethodId: string;
  paymentDate: string;
  amount: number;
  referenceNumber?: string;
  notes?: string;
  collectionDate?: string;
  depositDate?: string;
  status: 'PENDING' | 'COLLECTED' | 'SUBMITTED' | 'VERIFIED' | 'COMPLETED' | 'DISPUTED' | 'REFUNDED';
  createdAt: string;
  updatedAt: string;
}

export interface PaymentHistory {
  id: string;
  paymentId: string;
  status: string;
  updatedBy: string;     
  updatedAt: string;     
  notes: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  tableName: string;
  recordId: string;
  oldValues?: string;
  newValues?: string;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'SUCCESS' | 'ERROR' | 'WARNING' | 'INFO';
  category: 'PAYMENT' | 'ORDER' | 'INVOICE' | 'SYSTEM';
  isRead: boolean;
  createdAt: string;
}

export type SortField = keyof Category;
export type SortDirection = "asc" | "desc";
export type CurrentPage = "list" | "view" | "edit" | "add";