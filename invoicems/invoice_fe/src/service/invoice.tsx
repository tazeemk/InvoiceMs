import { smClient } from "@/lib";
import { Invoice, InvoiceItem } from "@/impData/types";

// This is a temporary type for the raw API response.
type ApiInvoiceItem = {
  id: string;
  invoiceId: string;
  lineNo: number;
  itemCode: string;
  itemName: string;
  description: string;
  hsnCode: string;
  quantity: number;
  unit: string;
  rate: number;
  discountPercent: number;
  discountAmount: number;
  taxableAmount: number;
  cgstRate: number;
  cgstAmount: number;
  sgstRate: number;
  sgstAmount: number;
  igstRate: number;
  igstAmount: number;
  totalAmount: number;
  createdAt: string;
};

type ApiInvoice = {
  id: string;
  invoiceNo: string;
  orderNumber?: string;
  assignUser?: string;
  assignUserId?: string;
  invoiceDate: string;
  dueDate: string;
  customerId: string;
  customerName: string;
  customerCode: string;
  contactPerson: string;
  mobile: string;
  email: string;
  billingAddress: string;
  shippingAddress: string;
  gstin: string;
  pan: string;
  state: string;
  city: string;
  subtotal: number;
  collectionAmount?: number;
  discountAmount: number;
  taxableAmount: number;
  cgstAmount: number;
  sgstAmount: number;
  igstAmount: number;
  totalTax: number;
  roundOff: number;
  grandTotal: number;
  paidAmount: number;
  balanceAmount: number;
  paymentTerms: string;
  creditDays: number;
  remarks: string;
  termsConditions: string;
  invoiceType: string;
  status: string;
  tallySynced: boolean;
  tallyVoucherNo: string | null;
  tallyLedgerId: string;
  invoicePdfPath: string | null;
  sentToCustomer: boolean;
  sentAt: string | null;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  items: ApiInvoiceItem[];
};

/**
 * Transforms API invoice items to frontend format
 */
const transformApiInvoiceItems = (apiItems: ApiInvoiceItem[]): InvoiceItem[] => {
  return apiItems.map((item) => ({
    id: item.id,
    itemName: item.itemName,
    description: item.description || '',
    quantity: item.quantity,
    unit: item.unit,
    rate: item.rate,
    totalAmount: item.totalAmount,
    discountPercent: item.discountPercent || 0,
    discountAmount: item.discountAmount || 0,
    taxableAmount: item.taxableAmount || 0, 
    cgstRate: item.cgstRate || 0,
    cgstAmount: item.cgstAmount || 0,
    sgstRate: item.sgstRate || 0,
    sgstAmount: item.sgstAmount || 0,
    igstRate: item.igstRate || 0,
    igstAmount: item.igstAmount || 0,
    hsnCode: item.hsnCode || '',
    createdAt: item.createdAt,
  }));
};

const calculateInvoiceStatus = (apiInvoice: ApiInvoice): Invoice["status"] => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const dueDate = new Date(apiInvoice.dueDate);
  dueDate.setHours(0, 0, 0, 0);

  const {
    status,
    balanceAmount,
    paidAmount,
    grandTotal,
    assignUser
  } = apiInvoice;

  const hasAssignedUser = !!assignUser?.trim();

  // 1️⃣ Cancelled
  if (status === 'CANCELLED') return 'CANCELLED';

  // 2️⃣ On Hold
  if (status === 'ON_HOLD') return 'ON_HOLD';

  // 3️⃣ Fully Paid
  if (balanceAmount === 0 && paidAmount >= grandTotal) return 'PAID';

  // 4️⃣ In Progress (Assigned user - takes priority over overdue/partial)
  if (hasAssignedUser) return 'IN_PROGRESS';

  // 5️⃣ Overdue
  if (dueDate < today && balanceAmount > 0) return 'OVERDUE';

  // 6️⃣ Partial Paid
  if (paidAmount > 0 && paidAmount < grandTotal) return 'PARTIAL_PAID';

  // 7️⃣ Pending
  return 'PENDING';
};


/**
 * Transforms the raw invoice data from the API into the format
 * expected by the frontend components.
 */
const transformApiInvoiceToFE = (apiInvoice: ApiInvoice): Invoice => {
  return {
    id: apiInvoice.id,
    invoiceNumber: apiInvoice.invoiceNo || '',
    orderNumber: apiInvoice.orderNumber || '',
    orderId: apiInvoice.id,
    customerName: apiInvoice.customerName || '',
    salespersonId: apiInvoice.createdBy || '',
    assignUser: apiInvoice.assignUser || '',
    assignUserId: apiInvoice.assignUserId || '',
    vendorId: '',
    invoiceDate: apiInvoice.invoiceDate,
    dueDate: apiInvoice.dueDate,
    billingCycle: apiInvoice.paymentTerms || 'MONTHLY',
    totalAmount: apiInvoice.grandTotal,
    paidAmount: apiInvoice.paidAmount,
    collectionAmount: apiInvoice.collectionAmount,
    outstandingAmount: apiInvoice.balanceAmount || 0,
    
    // Calculate status dynamically based on business rules
    status: calculateInvoiceStatus(apiInvoice),
    
    subtotal: apiInvoice.subtotal || 0,
    taxAmount: apiInvoice.totalTax || 0,
    discountAmount: apiInvoice.discountAmount || 0,
    notes: apiInvoice.remarks || '',
    createdAt: apiInvoice.createdAt,
    updatedAt: apiInvoice.updatedAt,
    
    // Additional fields from API that are used in invoice view
    gstin: apiInvoice.gstin || '',
    billingAddress: apiInvoice.billingAddress || '',
    shippingAddress: apiInvoice.shippingAddress || '',
    state: apiInvoice.state || '',
    contactPerson: apiInvoice.contactPerson || '',
    mobile: apiInvoice.mobile || '',
    cgstAmount: apiInvoice.cgstAmount || 0,
    sgstAmount: apiInvoice.sgstAmount || 0,
    igstAmount: apiInvoice.igstAmount || 0,
    roundOff: apiInvoice.roundOff || 0,
    termsConditions: apiInvoice.termsConditions || '',
    
    // Transform items array
    items: apiInvoice.items ? transformApiInvoiceItems(apiInvoice.items) : [],
  } as unknown as Invoice;
};

/**
 * Transforms the frontend Invoice object back into the format expected by the API.
 */
const transformFEInvoiceToApi = (feInvoice: Partial<Invoice>): Partial<ApiInvoice> => {
  return {
    id: feInvoice.id,
    invoiceNo: feInvoice.invoiceNumber,
    customerName: feInvoice.customerName,
    invoiceDate: feInvoice.invoiceDate,
    dueDate: feInvoice.dueDate,
    grandTotal: feInvoice.totalAmount,
    paidAmount: feInvoice.paidAmount,
    balanceAmount: feInvoice.outstandingAmount,
    status: feInvoice.status,
    subtotal: feInvoice.subtotal,
    totalTax: feInvoice.taxAmount,
    discountAmount: feInvoice.discountAmount,
    remarks: feInvoice.notes,
    items: feInvoice.items?.map(item => ({
      id: item.id,
      invoiceId: feInvoice.id || '',
      lineNo: 0,
      itemCode: '',
      itemName: item.itemName,
      description: item.description,
      hsnCode: item.hsnCode || '',
      quantity: item.quantity,
      unit: item.unit,
      rate: item.rate,
      discountPercent: item.discountPercent || 0,
      discountAmount: item.discountAmount || 0,
      taxableAmount: item.taxableAmount || 0,
      cgstRate: item.cgstRate || 0,
      cgstAmount: item.cgstAmount || 0,
      sgstRate: item.sgstRate || 0,
      sgstAmount: item.sgstAmount || 0,
      igstRate: item.igstRate || 0,
      igstAmount: item.igstAmount || 0,
      totalAmount: item.totalAmount,
      createdAt: item.createdAt || new Date().toISOString(),
    })) || [],
  };
};

/**
 * Fetch all invoices from the API
 */
export const fetchInvoices = async (): Promise<Invoice[]> => {
  const response = await smClient.post('/invoices/getAllInvoicesFilter', { 
    limit: 100, 
    filters: [{
      attribute: "",
      operation: "",
      value: ""
    }]
  });
  
  console.log("🔥 Raw API Response:", response.data);
  const transformedData = (response.data || []).map(transformApiInvoiceToFE);
  console.log("✅ Transformed Invoices:", transformedData);
  
  return transformedData;
};

/**
 * Create a new invoice
 */
export const createInvoice = async (invoiceData: Omit<Invoice, 'id'>): Promise<Invoice> => {
  const apiPayload = transformFEInvoiceToApi(invoiceData);
  const response = await smClient.post('/invoices/createInvoice', apiPayload);
  return transformApiInvoiceToFE(response.data);
};

/**
 * Update an existing invoice
 */
export const updateInvoice = async (invoiceData: Invoice): Promise<Invoice> => {
  const apiPayload = transformFEInvoiceToApi(invoiceData);
  const response = await smClient.put(`/invoices/updateInvoice/${invoiceData.id}`, apiPayload);
  return transformApiInvoiceToFE(response.data);
};

/**
 * Delete an invoice
 */
export const deleteInvoice = async (invoiceId: string): Promise<void> => {
  const response = await smClient.delete(`/invoices/deleteInvoice/${invoiceId}`);
  return response.data;
};

/**
 * user list
 */
export async function filterUsers() {
  const payload = {
    limit: 100,
    filters: []
  };

  const response = await smClient.post(`/users/filterUsers`, payload);

  console.log("🔥 FILTER USERS RESPONSE:", response.data);

  return response.data;
}

/**
 * Assign invoice to user
 */
export const assignInvoiceToUser = async (
  invoiceId: string,
  assignUserId: string
): Promise<Invoice> => {
  const response = await smClient.put(
    `/invoices/assignInvoiceToUser/${invoiceId}/${assignUserId}`
  );

  return transformApiInvoiceToFE(response.data);
};
