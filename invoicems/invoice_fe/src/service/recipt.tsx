import { smClient } from "@/lib";

// This is the canonical type for receipt details, used across the app.
export type ReceiptDetails = {
  id:                  string;
  receiptNo:           string;
  invoiceNo:           string;
  orderNumber:         string;
  customer:            string;
  contactPerson:       string;
  billingAddress:      string;
  collectedAmount:     number;
  paymentMethod:       string;
  paymentRef:          string;
  assignUser:          string;
  collectionDate:      string;
  collectionLocation:  string;
  previousOutstanding: number;
  balanceOutstanding:  number;
  remarks?:            string;
  createdAt?:          string;
  mobile?:             string;
};

// Raw shape returned by the API
type ReceiptApiResponse = {
  id:                  string;
  receiptNo:           string;
  orderNumber:         string;
  invoiceNumber:       string;
  receiptDate:         string;
  amount:              number;
  paymentMethod:       string;
  paymentRef:          string;
  previousOutstanding: number;
  balanceOutstanding:  number;
  collectedBy:         string;
  customerName:        string;
  contactPerson:       string;
  customerAddress:     string;
  mobile?:             string;
  remarks?:            string;
  collectionAddress:   string;
  createdAt:           string;
};

/** Map a raw API receipt to the shape expected by ReceiptPreviewModal */
function mapReceiptToDetails(r: ReceiptApiResponse): ReceiptDetails {
  return {
    id:                  r.id,
    receiptNo:           r.receiptNo,
    invoiceNo:           r.invoiceNumber,
    orderNumber:         r.orderNumber,
    customer:            r.customerName,
    contactPerson:       r.contactPerson,
    billingAddress:      r.customerAddress,
    collectedAmount:     r.amount,
    paymentMethod:       r.paymentMethod,
    paymentRef:          r.paymentRef,
    assignUser:          r.collectedBy,
    collectionDate:      r.receiptDate,
    collectionLocation:  r.collectionAddress,
    previousOutstanding: r.previousOutstanding,
    balanceOutstanding:  r.balanceOutstanding,
    remarks:             r.remarks,
    createdAt:           r.createdAt,
    mobile:              r.mobile,
  };
}

/** Fetch all receipts with optional filters, returning them mapped to ReceiptDetails */
export async function fetchReceipts(
  filters: { attribute: string; operation: string; value: string }[] = []
): Promise<ReceiptDetails[]> {
  const response = await smClient.post<{ data: ReceiptApiResponse[] }>(
    'receipts/getAllReceiptsFilter',
    {
      limit: 100,
      filters,
    }
  );

  return response.data.map(mapReceiptToDetails);
}