import { 
  Category, 
  Product, 
  User, 
  State, 
  City, 
  Address, 
  UserAddress, 
  Zone, 
  ZoneAssignment, 
  Vendor, 
  Salesperson, 
  Retailer, 
  Order, 
  OrderItem, 
  OrderStatusHistory, 
  Invoice, 
  InvoiceItem, 
  PaymentMethod, 
  Payment, 
  AuditLog, 
  Notification, 
  UserToken ,
  PaymentHistory,
  Customer
} from './types';

export const dummyUsers: User[] = [
  {
    id: "USR1",
    username: "admin",
    password: "adminpass",
    email: "admin@example.com",
    role: "ADMIN",
    status: "ACTIVE",
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01"
  },
  {
    id: "USR2",
    username: "vendor1",
    password: "",
    email: "vendor1@example.com",
    role: "VENDOR",
    status: "ACTIVE",
    createdBy: "USR1",
    createdAt: "2024-01-02",
    updatedAt: "2024-01-02"
  },
  {
    id: "USR3",
    username: "sales1",
    password: "",
    email: "sales1@example.com",
    role: "SALESPERSON",
    status: "ACTIVE",
    createdBy: "USR1",
    createdAt: "2024-01-03",
    updatedAt: "2024-01-03"
  },
  {
    id: "USR4",
    username: "retailer1",
    password: "",
    email: "retailer1@example.com",
    role: "RETAILER",
    status: "ACTIVE",
    createdBy: "USR1",
    createdAt: "2024-01-04",
    updatedAt: "2024-01-04"
  },
    {
    id: "USR20251105132941957",
    username: "sales1",
    email: "sales1@example.com",
    password: "********",
    role: "SALESPERSON",
    status: "ACTIVE",
    createdBy: "USR20251104142947738",
    createdAt: "2025-11-05",
    updatedAt: "2025-11-05"
  },
  {
    id: "USR20251104132941958",
    username: "admin1",
    email: "admin@example.com",
    password: "********",
    role: "ADMIN",
    status: "ACTIVE",
    createdBy: "SYSTEM",
    createdAt: "2025-11-04",
    updatedAt: "2025-11-05"
  },
  {
    id: "USR20251104132941959",
    username: "vendor1",
    email: "vendor@example.com",
    password: "********",
    role: "VENDOR",
    status: "INACTIVE",
    createdBy: "USR20251104142947738",
    createdAt: "2025-11-04",
    updatedAt: "2025-11-04"
  },
];

export const dummyStates: State[] = [
  {
    id: "ST1",
    stateName: "Uttar Pradesh",
    stateCode: "UP",
    status: "ACTIVE",
    createdAt: "2024-01-01"
  },
  {
    id: "ST2",
    stateName: "Maharashtra",
    stateCode: "MH",
    status: "ACTIVE",
    createdAt: "2024-01-01"
  },
  {
    id: "ST3",
    stateName: "Delhi",
    stateCode: "DL",
    status: "ACTIVE",
    createdAt: "2024-01-01"
  }
];

export const dummyCities: City[] = [
  {
    id: "CT1",
    cityName: "Ghaziabad",
    stateId: "ST1",
    pincode: "201001",
    status: "ACTIVE",
    createdAt: "2024-01-01"
  },
  {
    id: "CT2",
    cityName: "Mumbai",
    stateId: "ST2",
    pincode: "400001",
    status: "ACTIVE",
    createdAt: "2024-01-01"
  },
  {
    id: "CT3",
    cityName: "New Delhi",
    stateId: "ST3",
    pincode: "110001",
    status: "ACTIVE",
    createdAt: "2024-01-01"
  }
];

export const dummyAddresses: Address[] = [
  {
    id: "ADDR1",
    addressLine1: "123 Admin St",
    addressLine2: "Block A",
    landmark: "Near Gov Office",
    cityId: "CT1",
    pincode: "201001",
    addressType: "OFFICE",
    isPrimary: true,
    createdAt: "2024-01-01"
  },
  {
    id: "ADDR2",
    addressLine1: "456 Vendor Lane",
    addressLine2: "Suite 100",
    landmark: "Market Complex",
    cityId: "CT2",
    pincode: "400001",
    addressType: "OFFICE",
    isPrimary: true,
    createdAt: "2024-01-02"
  },
  {
    id: "ADDR3",
    addressLine1: "789 Sales Rd",
    addressLine2: "Floor 5",
    landmark: "Business Park",
    cityId: "CT3",
    pincode: "110001",
    addressType: "OFFICE",
    isPrimary: true,
    createdAt: "2024-01-03"
  },
  {
    id: "ADDR4",
    addressLine1: "321 Retail St",
    addressLine2: "Shop 12",
    landmark: "Main Bazaar",
    cityId: "CT3",
    pincode: "110001",
    addressType: "SHOP",
    isPrimary: true,
    createdAt: "2024-01-04"
  }
];

export const dummyUserAddresses: UserAddress[] = [
  {
    id: "UA1",
    userId: "USR1",
    addressId: "ADDR1",
    addressLabel: "Admin Office",
    isPrimary: true,
    isBilling: true,
    isShipping: false,
    createdAt: "2024-01-01"
  },
  {
    id: "UA2",
    userId: "USR2",
    addressId: "ADDR2",
    addressLabel: "Vendor Office",
    isPrimary: true,
    isBilling: true,
    isShipping: false,
    createdAt: "2024-01-02"
  },
  {
    id: "UA3",
    userId: "USR3",
    addressId: "ADDR3",
    addressLabel: "Sales Office",
    isPrimary: true,
    isBilling: true,
    isShipping: true,
    createdAt: "2024-01-03"
  },
  {
    id: "UA4",
    userId: "USR4",
    addressId: "ADDR4",
    addressLabel: "Retailer Shop",
    isPrimary: true,
    isBilling: true,
    isShipping: true,
    createdAt: "2024-01-04"
  }
];

export const dummyZones: Zone[] = [
  {
    id: "ZONE1",
    zoneName: "East Zone",
    zoneCode: "EAST",
    description: "Eastern Territory",
    status: "ACTIVE",
    createdBy: "USR1",
    createdAt: "2024-01-01"
  },
  {
    id: "ZONE2",
    zoneName: "West Zone",
    zoneCode: "WEST",
    description: "Western Territory",
    status: "ACTIVE",
    createdBy: "USR1",
    createdAt: "2024-01-01"
  },
  {
    id: "ZONE3",
    zoneName: "North Zone",
    zoneCode: "NORTH",
    description: "Northern Territory",
    status: "ACTIVE",
    createdBy: "USR1",
    createdAt: "2024-01-01"
  }
];

export const dummyZoneAssignments: ZoneAssignment[] = [
  {
    id: "ZA1",
    userId: "USR2",
    zoneId: "ZONE1",
    assignedDate: "2024-01-01",
    status: "ACTIVE",
    assignedBy: "USR1",
    createdAt: "2024-01-01"
  },
  {
    id: "ZA2",
    userId: "USR3",
    zoneId: "ZONE1",
    assignedDate: "2024-01-01",
    status: "ACTIVE",
    assignedBy: "USR1",
    createdAt: "2024-01-01"
  },
  {
    id: "ZA3",
    userId: "USR4",
    zoneId: "ZONE1",
    assignedDate: "2024-01-01",
    status: "ACTIVE",
    assignedBy: "USR1",
    createdAt: "2024-01-01"
  }
];

export const dummyCategories: Category[] = [
  {
    id: "CAT0001",
    name: "Food",
    description: "Food Items",
    status: "Active",
    productCount: 120,
    createdBy: "USR1",
    createdAt: "2024-01-15",
    updatedAt: "2024-08-01"
  },
  {
    id: "CAT0002",
    name: "Beverages",
    description: "Drinks and Beverages",
    status: "Active",
    productCount: 85,
    createdBy: "USR1",
    createdAt: "2024-02-10",
    updatedAt: "2024-07-20"
  },
  {
    id: "CAT0003",
    name: "Electronics",
    description: "Electronic devices, gadgets, and accessories",
    status: "Active",
    productCount: 40,
    createdBy: "USR1",
    createdAt: "2024-01-20",
    updatedAt: "2024-08-05"
  },
  {
    id: "CAT0004",
    name: "Clothing",
    description: "Fashion apparel for men, women, and children",
    status: "Inactive",
    productCount: 72,
    createdBy: "USR1",
    createdAt: "2024-03-01",
    updatedAt: "2024-07-30"
  },
  {
    id: "CAT0005",
    name: "Home & Kitchen",
    description: "Home appliances, kitchen tools, furniture",
    status: "Active",
    productCount: 60,
    createdBy: "USR1",
    createdAt: "2024-02-28",
    updatedAt: "2024-07-25"
  }
];

export const dummyProducts: Product[] = [
  {
    id: "PROD1",
    productName: "Rice",
    productCode: "PROD001",
    categoryId: "CAT0001",
    description: "Basmati Rice 5kg",
    unitPrice: 200.0,
    stockUnit: "kg",
    taxRate: 5.0,
    status: "ACTIVE",
    createdBy: "USR1",
    createdAt: "2024-07-30",
    updatedAt: "2024-07-30"
  },
  {
    id: "PROD2",
    productName: "Coca Cola",
    productCode: "PROD002",
    categoryId: "CAT0002",
    description: "500ml Bottle",
    unitPrice: 50.0,
    stockUnit: "piece",
    taxRate: 12.0,
    status: "ACTIVE",
    createdBy: "USR1",
    createdAt: "2024-07-30",
    updatedAt: "2024-07-30"
  },
  {
    id: "PROD3",
    productName: "Laptop - Dell Inspiron",
    productCode: "PROD003",
    categoryId: "CAT0003",
    description: "15.6 inch, Intel i5, 8GB RAM, 512GB SSD",
    unitPrice: 55000.0,
    stockUnit: "piece",
    taxRate: 18.0,
    status: "ACTIVE",
    createdBy: "USR1",
    createdAt: "2024-07-30",
    updatedAt: "2024-07-30"
  },
  {
    id: "PROD4",
    productName: "Men's Formal Shirt",
    productCode: "PROD004",
    categoryId: "CAT0004",
    description: "Cotton, Slim Fit, Size L",
    unitPrice: 1200.0,
    stockUnit: "piece",
    taxRate: 5.0,
    status: "INACTIVE",
    createdBy: "USR1",
    createdAt: "2024-07-30",
    updatedAt: "2024-07-30"
  },
  {
    id: "PROD5",
    productName: "Electric Kettle",
    productCode: "PROD005",
    categoryId: "CAT0005",
    description: "1.5 Litre, 1500W Stainless Steel",
    unitPrice: 1500.0,
    stockUnit: "piece",
    taxRate: 12.0,
    status: "ACTIVE",
    createdBy: "USR1",
    createdAt: "2024-07-30",
    updatedAt: "2024-07-30"
  }
];

export const dummyVendors: Vendor[] = [
  {
    id: "VEN1",
    userId: "USR2",
    companyName: "Vendor Pvt Ltd",
    contactPerson: "Mr. Vendor",
    phone: "9876543210",
    primaryAddressId: "ADDR2",
    billingAddressId: "ADDR2",
    gstNumber: "GSTIN12345XYZ",
    status: "ACTIVE",
    createdAt: "2024-01-02",
    updatedAt: "2024-01-02"
  }
];

export const dummySalespersons: Salesperson[] = [
  {
    id: "SAL1",
    userId: "USR3",
    employeeCode: "EMP-201",
    fullName: "John Sales",
    phone: "9123456780",
    primaryAddressId: "ADDR3",
    joiningDate: "2022-01-15",
    status: "ACTIVE",
    createdAt: "2024-01-03"
  }
];

export const dummyRetailers: Retailer[] = [
  {
    id: "RET1",
    userId: "USR4",
    shopName: "Retailer Store",
    ownerName: "Alice Owner",
    phone: "9012345678",
    shopAddressId: "ADDR4",
    billingAddressId: "ADDR4",
    deliveryAddressId: "ADDR4",
    gstNumber: "GSTIN67890ABC",
    creditLimit: 50000.0,
    status: "ACTIVE",
    createdAt: "2024-01-04",
    updatedAt: "2024-01-04"
  }
];

export const dummyOrders: Order[] = [
  // COMPLETED
  {
    id: "ORD1",
    orderNumber: "ORD001",
    retailerId: "RET1",
    salespersonId: "SAL1",
    vendorId: "VEN1",
    zoneId: "ZONE1",
    orderDate: "2024-07-30",
    expectedDeliveryDate: "2024-08-01",
    totalAmount: 10000.0,
    taxAmount: 900.0,
    discountAmount: 500.0,
    finalAmount: 10400.0,
    status: "COMPLETED",
    notes: "Urgent order for retailer",
    createdAt: "2024-07-30",
    updatedAt: "2024-08-01"
  },
  // COMPLETED (for /orders/completed)
  {
    id: "ORD7",
    orderNumber: "ORD007",
    retailerId: "RET1",
    salespersonId: "SAL1",
    vendorId: "VEN1",
    zoneId: "ZONE1",
    orderDate: "2024-09-01",
    expectedDeliveryDate: "2024-09-03",
    totalAmount: 12000.0,
    taxAmount: 1080.0,
    discountAmount: 600.0,
    finalAmount: 12480.0,
    status: "COMPLETED",
    notes: "Order fully completed and closed",
    createdAt: "2024-09-01",
    updatedAt: "2024-09-04"
  },
  // CREATED
  {
    id: "ORD2",
    orderNumber: "ORD002",
    retailerId: "RET1",
    salespersonId: "SAL1",
    vendorId: "VEN1",
    zoneId: "ZONE1",
    orderDate: "2024-08-05",
    expectedDeliveryDate: "2024-08-07",
    totalAmount: 5000.0,
    taxAmount: 450.0,
    discountAmount: 200.0,
    finalAmount: 5250.0,
    status: "CREATED",
    notes: "Regular monthly order",
    createdAt: "2024-08-05",
    updatedAt: "2024-08-05"
  },
  // IN_PROGRESS
  {
    id: "ORD3",
    orderNumber: "ORD003",
    retailerId: "RET1",
    salespersonId: "SAL1",
    vendorId: "VEN1",
    zoneId: "ZONE1",
    orderDate: "2024-08-10",
    expectedDeliveryDate: "2024-08-12",
    totalAmount: 8000.0,
    taxAmount: 720.0,
    discountAmount: 300.0,
    finalAmount: 8420.0,
    status: "IN_PROGRESS",
    notes: "Accepted by vendor",
    createdAt: "2024-08-10",
    updatedAt: "2024-08-11"
  },
  // IN_PROGRESS
  {
    id: "ORD4",
    orderNumber: "ORD004",
    retailerId: "RET1",
    salespersonId: "SAL1",
    vendorId: "VEN1",
    zoneId: "ZONE1",
    orderDate: "2024-08-15",
    expectedDeliveryDate: "2024-08-18",
    totalAmount: 12000.0,
    taxAmount: 1080.0,
    discountAmount: 600.0,
    finalAmount: 12480.0,
    status: "IN_PROGRESS",
    notes: "Order is being processed",
    createdAt: "2024-08-15",
    updatedAt: "2024-08-16"
  },
  // REJECTED (for /orders/failed, /orders/returned, /orders/rejected)
  {
    id: "ORD5",
    orderNumber: "ORD005",
    retailerId: "RET1",
    salespersonId: "SAL1",
    vendorId: "VEN1",
    zoneId: "ZONE1",
    orderDate: "2024-08-20",
    expectedDeliveryDate: "2024-08-22",
    totalAmount: 15000.0,
    taxAmount: 1350.0,
    discountAmount: 750.0,
    finalAmount: 15600.0,
    status: "REJECTED",
    notes: "Order rejected due to payment issue",
    createdAt: "2024-08-20",
    updatedAt: "2024-08-21"
  },
  // CANCELLED (for /orders/cancelled)
  {
    id: "ORD6",
    orderNumber: "ORD006",
    retailerId: "RET1",
    salespersonId: "SAL1",
    vendorId: "VEN1",
    zoneId: "ZONE1",
    orderDate: "2024-08-25",
    expectedDeliveryDate: "2024-08-28",
    totalAmount: 20000.0,
    taxAmount: 1800.0,
    discountAmount: 1000.0,
    finalAmount: 20800.0,
    status: "CANCELLED",
    notes: "Order cancelled by retailer",
    createdAt: "2024-08-25",
    updatedAt: "2024-08-26"
  },
    // COMPLETED (for /orders/completed)
    {
      id: "ORD8",
      orderNumber: "ORD008",
      retailerId: "RET1",
      salespersonId: "SAL1",
      vendorId: "VEN1",
      zoneId: "ZONE1",
      orderDate: "2024-09-10",
      expectedDeliveryDate: "2024-09-12",
      totalAmount: 18000.0,
      taxAmount: 1620.0,
      discountAmount: 900.0,
      finalAmount: 18720.0,
      status: "COMPLETED",
      notes: "Order delivered, payment received, and closed. All steps completed successfully.",
      createdAt: "2024-09-10",
      updatedAt: "2024-09-15"
    },
  // COMPLETED (for /orders/completed)
  {
    id: "ORD8",
    orderNumber: "ORD008",
    retailerId: "RET1",
    salespersonId: "SAL1",
    vendorId: "VEN1",
    zoneId: "ZONE1",
    orderDate: "2024-09-10",
    expectedDeliveryDate: "2024-09-12",
    totalAmount: 18000.0,
    taxAmount: 1620.0,
    discountAmount: 900.0,
    finalAmount: 18720.0,
    status: "COMPLETED",
    notes: "Order delivered, payment received, and closed. All steps completed successfully.",
    createdAt: "2024-09-10",
    updatedAt: "2024-09-15"
  }
];

export const dummyOrderItems: OrderItem[] = [
  {
    id: "OI1",
    orderId: "ORD1",
    productId: "PROD1",
    quantity: 50,
    unitPrice: 150.0,
    totalPrice: 7500.0,
    taxRate: 12.0,
    taxAmount: 900.0,
    createdAt: "2024-07-30"
  },
  {
    id: "OI2",
    orderId: "ORD1",
    productId: "PROD2",
    quantity: 10,
    unitPrice: 250.0,
    totalPrice: 2500.0,
    taxRate: 12.0,
    taxAmount: 300.0,
    createdAt: "2024-07-30"
  },
  {
    id: "OI3",
    orderId: "ORD2",
    productId: "PROD3",
    quantity: 1,
    unitPrice: 5000.0,
    totalPrice: 5000.0,
    taxRate: 18.0,
    taxAmount: 450.0,
    createdAt: "2024-08-05"
  }
];

export const dummyOrderStatusHistory: OrderStatusHistory[] = [
  {
    id: "OSH1",
    orderId: "ORD1",
    newStatus: "CREATED",
    changedBy: "USR4",
    changeReason: "Order created",
    changedAt: "2024-07-30"
  },
  {
    id: "OSH2",
    orderId: "ORD1",
    previousStatus: "CREATED",
    newStatus: "IN_PROGRESS",
    changedBy: "USR1",
    changeReason: "Order confirmed by admin",
    changedAt: "2024-07-30"
  },
  {
    id: "OSH3",
    orderId: "ORD1",
    previousStatus: "IN_PROGRESS",
    newStatus: "COMPLETED",
    changedBy: "USR1",
    changeReason: "Order completed and invoice generated",
    changedAt: "2024-08-01"
  },
  {
    id: "OSH4",
    orderId: "ORD2",
    newStatus: "CREATED",
    changedBy: "USR4",
    changeReason: "Order created",
    changedAt: "2024-08-05"
  }
];

export const dummyInvoices: Invoice[] = [
  {
    id: "INV1",
    invoiceNumber: "INV001",
    orderId: "ORD1",
    retailerId: "RET1",
    salespersonId: "SAL1",
    vendorId: "VEN1",
    invoiceDate: "2024-07-30",
    dueDate: "2024-08-13",
    billingCycle: "WEEKLY",
    subtotal: 9500.0,
    taxAmount: 900.0,
    discountAmount: 500.0,
    totalAmount: 10400.0,
    paidAmount: 10400.0,
    outstandingAmount: 0.0,
    status: "PAID",
    notes: "Invoice for order ORD1",
    createdAt: "2024-07-30",
    updatedAt: "2024-08-01"
  },
  {
    id: "INV2",
    invoiceNumber: "INV002",
    orderId: "ORD2",
    retailerId: "RET1",
    salespersonId: "SAL1",
    vendorId: "VEN1",
    invoiceDate: "2024-08-05",
    dueDate: "2024-08-19",
    billingCycle: "WEEKLY",
    subtotal: 5000.0,
    taxAmount: 450.0,
    discountAmount: 200.0,
    totalAmount: 5250.0,
    paidAmount: 0.0,
    outstandingAmount: 5250.0,
    status: "PENDING",
    notes: "Invoice for order ORD2",
    createdAt: "2024-08-05",
    updatedAt: "2024-08-05"
  },
  // Overdue invoice
  {
    id: "INV3",
    invoiceNumber: "INV003",
    orderId: "ORD3",
    retailerId: "RET2",
    salespersonId: "SAL2",
    vendorId: "VEN2",
    invoiceDate: "2024-07-01",
    dueDate: "2024-07-15",
    billingCycle: "MONTHLY",
    subtotal: 8000.0,
    taxAmount: 720.0,
    discountAmount: 300.0,
    totalAmount: 8420.0,
    paidAmount: 2000.0,
    outstandingAmount: 6420.0,
    status: "OVERDUE",
    notes: "Overdue invoice for order ORD3",
    createdAt: "2024-07-01",
    updatedAt: "2024-08-10"
  },
  // Cancelled invoice
  {
    id: "INV4",
    invoiceNumber: "INV004",
    orderId: "ORD4",
    retailerId: "RET3",
    salespersonId: "SAL3",
    vendorId: "VEN3",
    invoiceDate: "2024-06-10",
    dueDate: "2024-06-24",
    billingCycle: "MONTHLY",
    subtotal: 6000.0,
    taxAmount: 540.0,
    discountAmount: 100.0,
    totalAmount: 6440.0,
    paidAmount: 0.0,
    outstandingAmount: 6440.0,
    status: "CANCELLED",
    notes: "Cancelled invoice for order ORD4",
    createdAt: "2024-06-10",
    updatedAt: "2024-06-20"
  },
  // Partial paid invoice
  {
    id: "INV5",
    invoiceNumber: "INV005",
    orderId: "ORD5",
    retailerId: "RET4",
    salespersonId: "SAL4",
    vendorId: "VEN4",
    invoiceDate: "2024-08-01",
    dueDate: "2024-08-15",
    billingCycle: "WEEKLY",
    subtotal: 7000.0,
    taxAmount: 630.0,
    discountAmount: 200.0,
    totalAmount: 7430.0,
    paidAmount: 4000.0,
    outstandingAmount: 3430.0,
    status: "PARTIAL_PAID",
    notes: "Partial paid invoice for order ORD5",
    createdAt: "2024-08-01",
    updatedAt: "2024-08-10"
  }
];

export const dummyInvoiceItems: InvoiceItem[] = [
  {
    id: "II1",
    invoiceId: "INV1",
    productId: "PROD1",
    quantity: 50,
    unitPrice: 150.0,
    totalPrice: 7500.0,
    taxRate: 12.0,
    taxAmount: 900.0,
    createdAt: "2024-07-30"
  },
  {
    id: "II2",
    invoiceId: "INV1",
    productId: "PROD2",
    quantity: 10,
    unitPrice: 250.0,
    totalPrice: 2500.0,
    taxRate: 12.0,
    taxAmount: 300.0,
    createdAt: "2024-07-30"
  },
  {
    id: "II3",
    invoiceId: "INV2",
    productId: "PROD3",
    quantity: 1,
    unitPrice: 5000.0,
    totalPrice: 5000.0,
    taxRate: 18.0,
    taxAmount: 450.0,
    createdAt: "2024-08-05"
  }
];

export const dummyPaymentMethods: PaymentMethod[] = [
  {
    id: "PM1",
    methodName: "Online Transfer",
    methodCode: "ONLINE",
    description: "Online Bank Transfer",
    status: "ACTIVE",
    createdBy: "USR1",
    createdAt: "2024-01-01"
  },
  {
    id: "PM2",
    methodName: "Cash",
    methodCode: "CASH",
    description: "Cash Payment",
    status: "ACTIVE",
    createdBy: "USR1",
    createdAt: "2024-01-01"
  },
  {
    id: "PM3",
    methodName: "Cheque",
    methodCode: "CHEQUE",
    description: "Bank Cheque",
    status: "ACTIVE",
    createdBy: "USR1",
    createdAt: "2024-01-01"
  }
];

export const dummyPayments: Payment[] = [
  {
    id: "PAY1",
    paymentNumber: "PAY001",
    invoiceId: "INV1",
    retailerId: "RET1",
    salespersonId: "SAL1",
    paymentMethodId: "PM1",
    paymentDate: "2024-08-01",
    amount: 10400.0,
    referenceNumber: "TXN123456789",
    notes: "Full payment received online",
    collectionDate: "2024-08-01",
    depositDate: "2024-08-02",
    status: "COMPLETED",
    createdAt: "2024-08-01",
    updatedAt: "2024-08-02"
  },
  {
    id: "PAY2",
    paymentNumber: "PAY002",
    invoiceId: "INV2",
    retailerId: "RET2",
    salespersonId: "SAL2",
    paymentMethodId: "PM2",
    paymentDate: "2024-08-03",
    amount: 5000.0,
    referenceNumber: "TXN987654321",
    notes: "Payment pending collection",
    collectionDate: "",
    depositDate: "",
    status: "PENDING",
    createdAt: "2024-08-03",
    updatedAt: "2024-08-03"
  },
  {
    id: "PAY3",
    paymentNumber: "PAY003",
    invoiceId: "INV3",
    retailerId: "RET3",
    salespersonId: "SAL3",
    paymentMethodId: "PM3",
    paymentDate: "2024-08-05",
    amount: 7500.0,
    referenceNumber: "TXN555555555",
    notes: "Collected from customer",
    collectionDate: "2024-08-05",
    depositDate: "",
    status: "COLLECTED",
    createdAt: "2024-08-05",
    updatedAt: "2024-08-05"
  },
  {
    id: "PAY4",
    paymentNumber: "PAY004",
    invoiceId: "INV4",
    retailerId: "RET4",
    salespersonId: "SAL4",
    paymentMethodId: "PM4",
    paymentDate: "2024-08-07",
    amount: 8200.0,
    referenceNumber: "TXN444444444",
    notes: "Submitted by collection team",
    collectionDate: "2024-08-07",
    depositDate: "2024-08-08",
    status: "SUBMITTED",
    createdAt: "2024-08-07",
    updatedAt: "2024-08-08"
  },
  {
    id: "PAY5",
    paymentNumber: "PAY005",
    invoiceId: "INV5",
    retailerId: "RET5",
    salespersonId: "SAL5",
    paymentMethodId: "PM5",
    paymentDate: "2024-08-09",
    amount: 9200.0,
    referenceNumber: "TXN333333333",
    notes: "Verified by accounts team",
    collectionDate: "2024-08-09",
    depositDate: "2024-08-10",
    status: "VERIFIED",
    createdAt: "2024-08-09",
    updatedAt: "2024-08-10"
  },
  {
    id: "PAY6",
    paymentNumber: "PAY006",
    invoiceId: "INV6",
    retailerId: "RET6",
    salespersonId: "SAL6",
    paymentMethodId: "PM6",
    paymentDate: "2024-08-11",
    amount: 11000.0,
    referenceNumber: "TXN222222222",
    notes: "Payment disputed (cheque bounce)",
    collectionDate: "2024-08-11",
    depositDate: "2024-08-12",
    status: "DISPUTED",
    createdAt: "2024-08-11",
    updatedAt: "2024-08-12"
  },
  {
    id: "PAY7",
    paymentNumber: "PAY007",
    invoiceId: "INV7",
    retailerId: "RET7",
    salespersonId: "SAL7",
    paymentMethodId: "PM7",
    paymentDate: "2024-08-13",
    amount: 6000.0,
    referenceNumber: "TXN111111111",
    notes: "Payment refunded to customer",
    collectionDate: "2024-08-13",
    depositDate: "2024-08-14",
    status: "REFUNDED",
    createdAt: "2024-08-13",
    updatedAt: "2024-08-14"
  }
];

export const dummyPaymentHistory: PaymentHistory[] = [
  {
    id: "HIS1",
    paymentId: "PAY1",
    status: "PENDING",
    updatedBy: "System",
    updatedAt: "2024-08-01T09:00:00",
    notes: "Payment created"
  },
  {
    id: "HIS2",
    paymentId: "PAY1",
    status: "COLLECTED",
    updatedBy: "Nazim",
    updatedAt: "2024-08-01T11:30:00",
    notes: "Cash collected from retailer"
  },
  {
    id: "HIS3",
    paymentId: "PAY1",
    status: "SUBMITTED",
    updatedBy: "Rakesh",
    updatedAt: "2024-08-02T10:00:00",
    notes: "Deposited in bank"
  },
  {
    id: "HIS4",
    paymentId: "PAY1",
    status: "VERIFIED",
    updatedBy: "FinanceTeam",
    updatedAt: "2024-08-02T14:00:00",
    notes: "Verified by accounts team"
  },
  {
    id: "HIS5",
    paymentId: "PAY1",
    status: "COMPLETED",
    updatedBy: "Admin",
    updatedAt: "2024-08-02T18:30:00",
    notes: "Payment closed successfully"
  },
  {
    id: "HIS6",
    paymentId: "PAY7",
    status: "REFUNDED",
    updatedBy: "Nazim",
    updatedAt: "2024-08-14T09:45:00",
    notes: "Refunded due to order cancellation"
  }
];

export const dummyAuditLogs: AuditLog[] = [
  {
    id: "AUD1",
    userId: "USR3",
    action: "Payment Recorded",
    tableName: "payments",
    recordId: "PAY1",
  newValues: '{"amount_paid":10400.00,"status":"PAID"}',
    ipAddress: "192.168.1.100",
    userAgent: "Mozilla/5.0",
    createdAt: "2024-08-01"
  },
  {
    id: "AUD2",
    userId: "USR1",
    action: "Order Status Updated",
    tableName: "orders",
    recordId: "ORD1",
    oldValues: '{"status":"CREATED"}',
    newValues: '{"status":"COMPLETED"}',
    ipAddress: "192.168.1.101",
    userAgent: "Mozilla/5.0",
    createdAt: "2024-08-01"
  },
  {
    id: "AUD3",
    userId: "USR4",
    action: "Order Created",
    tableName: "orders",
    recordId: "ORD2",
    newValues: '{"order_number":"ORD002","status":"CREATED","total_amount":5250.00}',
    ipAddress: "192.168.1.102",
    userAgent: "Mozilla/5.0",
    createdAt: "2024-08-05"
  }
];

export const dummyNotifications: Notification[] = [
  {
    id: "NOT1",
    userId: "RET1",
    title: "Payment Received",
    message: "Payment of ₹10,400 has been received for invoice INV001",
    type: "SUCCESS",
    category: "PAYMENT",
    isRead: false,
    createdAt: "2024-08-01"
  },
  {
    id: "NOT2",
    userId: "SAL1",
    title: "Order Delivered",
    message: "Order ORD001 has been successfully delivered",
    type: "SUCCESS",
    category: "ORDER",
    isRead: true,
    createdAt: "2024-08-01"
  },
  {
    id: "NOT3",
    userId: "VEN1",
    title: "New Order Received",
    message: "New order ORD002 received from Retailer Store",
    type: "INFO",
    category: "ORDER",
    isRead: false,
    createdAt: "2024-08-05"
  },
  {
    id: "NOT4",
    userId: "USR1",
    title: "Invoice Overdue",
    message: "Invoice INV002 is pending payment since 5 days",
    type: "WARNING",
    category: "INVOICE",
    isRead: false,
    createdAt: "2024-08-10"
  }
];

export const dummyUserTokens: UserToken[] = [
  {
    id: "TOK1",
    userId: "USR1",
    tokenType: "ACCESS",
    expiresAt: "2024-08-01 00:00:00",
    createdAt: "2024-07-01 00:00:00"
  },
  {
    id: "TOK2",
    userId: "USR1",
    tokenType: "REFRESH",
    expiresAt: "2024-08-31 00:00:00",
    createdAt: "2024-07-01 00:00:00"
  },
  {
    id: "TOK3",
    userId: "USR2",
    tokenType: "ACCESS",
    expiresAt: "2024-08-15 00:00:00",
    createdAt: "2024-07-15 00:00:00"
  }
];


// Extended product data for better variety
export const extendedProducts: Product[] = [
  ...dummyProducts,
  {
    id: "PROD6",
    productName: "Wheat Flour",
    productCode: "PROD006",
    categoryId: "CAT0001",
    description: "Premium Quality Wheat Flour 10kg",
    unitPrice: 350.0,
    stockUnit: "kg",
    taxRate: 5.0,
    status: "ACTIVE",
    createdBy: "USR1",
    createdAt: "2024-08-01",
    updatedAt: "2024-08-01"
  },
  {
    id: "PROD7",
    productName: "Orange Juice",
    productCode: "PROD007",
    categoryId: "CAT0002",
    description: "Fresh Orange Juice 1L",
    unitPrice: 120.0,
    stockUnit: "litre",
    taxRate: 12.0,
    status: "ACTIVE",
    createdBy: "USR1",
    createdAt: "2024-08-02",
    updatedAt: "2024-08-02"
  },
  {
    id: "PROD8",
    productName: "Smartphone",
    productCode: "PROD008",
    categoryId: "CAT0003",
    description: "Android Smartphone, 128GB Storage",
    unitPrice: 25000.0,
    stockUnit: "piece",
    taxRate: 18.0,
    status: "ACTIVE",
    createdBy: "USR1",
    createdAt: "2024-08-03",
    updatedAt: "2024-08-03"
  },
  {
    id: "PROD9",
    productName: "Women's Kurti",
    productCode: "PROD009",
    categoryId: "CAT0004",
    description: "Cotton Kurti, Size M",
    unitPrice: 800.0,
    stockUnit: "piece",
    taxRate: 5.0,
    status: "ACTIVE",
    createdBy: "USR1",
    createdAt: "2024-08-04",
    updatedAt: "2024-08-04"
  },
  {
    id: "PROD10",
    productName: "Pressure Cooker",
    productCode: "PROD010",
    categoryId: "CAT0005",
    description: "5L Stainless Steel Pressure Cooker",
    unitPrice: 2500.0,
    stockUnit: "piece",
    taxRate: 12.0,
    status: "ACTIVE",
    createdBy: "USR1",
    createdAt: "2024-08-05",
    updatedAt: "2024-08-05"
  }
];


export const workflow = {
  orders: [
    {
      status: "created",
      description: "Order has been created and is awaiting processing.",
      actions: ["Start Processing", "Cancel", "Reject"],
      next: ["in-progress", "cancelled", "rejected"],
    },
    {
      status: "in-progress",
      description: "Order is being processed.",
      actions: ["Complete Order", "Cancel", "Reject"],
      next: ["completed", "cancelled", "rejected"],
    },
    {
      status: "completed",
      description: "Order completed and invoice generated.",
      actions: [],
      next: [],
    },
    {
      status: "cancelled",
      description: "Order cancelled by customer or company.",
      actions: [],
      next: [],
    },
    {
      status: "rejected",
      description: "Order rejected before completion.",
      actions: [],
      next: [],
    },
  ],

  invoices: [
    {
      status: "unpaid",
      description: "Invoice created but unpaid.",
      actions: ["Record Payment", "Send Reminder"],
      next: ["partial-paid", "paid", "overdue"],
    },
    {
      status: "partial-paid",
      description: "Invoice partially paid by customer.",
      actions: ["Record Remaining Payment"],
      next: ["paid"],
    },
    {
      status: "paid",
      description: "Invoice fully paid.",
      actions: [],
      next: [],
    },
    {
      status: "overdue",
      description: "Invoice not paid by due date.",
      actions: ["Send Reminder", "Escalate"],
      next: ["partial-paid", "paid"],
    },
  ],

  payments: [
    {
      status: "pending",
      description: "Payment created but not collected yet.",
      actions: ["Collect"],
      next: ["collected"],
    },
    {
      status: "collected",
      description: "Payment collected from customer.",
      actions: ["Submit"],
      next: ["submitted"],
    },
    {
      status: "submitted",
      description: "Payment submitted to accounts.",
      actions: ["Verify"],
      next: ["verified"],
    },
    {
      status: "verified",
      description: "Payment verified by accounts team.",
      actions: ["Complete"],
      next: ["completed"],
    },
    {
      status: "completed",
      description: "Payment fully completed and closed.",
      actions: [],
      next: [],
    },
    {
      status: "disputed",
      description: "Payment issue found (cheque bounce, mismatch).",
      actions: ["Resolve"],
      next: ["pending", "completed", "refunded"],
    },
    {
      status: "refunded",
      description: "Payment refunded to customer.",
      actions: [],
      next: [],
    },
  ],
};
