import { smClient } from "@/lib";

// Transformation functions
const transformApiCustomerToFE = (apiCustomer) => {
  // Handle potential wrapper (e.g. if API returns { data: { ... } } or { body: { ... } })
  // We check if the top level has an ID; if not, and 'data'/'body' exists, we use that.
  let source = apiCustomer;
  const rawId = apiCustomer.id || apiCustomer._id || apiCustomer.customerId || apiCustomer.customer_id;
  if (!rawId && (apiCustomer.data || apiCustomer.body)) {
    source = apiCustomer.data || apiCustomer.body;
  }


  return {
    id: source.id || source._id || source.customerId || source.customer_id || "",
    userId: source.userId || source.user_id || "",
    customerCode: source.customerCode || source.customer_code,
    businessName: source.businessName || source.business_name,
    gstin: source.gstin,
    pan: source.pan,
    contactPerson: source.contactPerson || source.contact_person,
    mobile: source.mobile,
    email: source.email,
    address: source.address,
    city: source.city,
    state: source.state,
    creditDays: source.creditDays || source.credit_days,
    currentOutstanding: source.currentOutstanding || source.current_outstanding || 0,
    status: source.status,
    createdAt: source.createdAt || source.created_at,
    updatedAt: source.updatedAt || source.updated_at,
  };
};

const transformFECustomerToApi = (feCustomer) => {
  const ensureTime = (dateStr) => {
    if (dateStr && dateStr.length === 10) {
      return `${dateStr}T00:00:00`;
    }
    return dateStr;
  };

  return {
    id: feCustomer.id,
    userId: feCustomer.userId,
    customerCode: feCustomer.customerCode,
    businessName: feCustomer.businessName,
    gstin: feCustomer.gstin,
    pan: feCustomer.pan,
    contactPerson: feCustomer.contactPerson,
    mobile: feCustomer.mobile,
    email: feCustomer.email,
    address: feCustomer.address,
    city: feCustomer.city,
    state: feCustomer.state,
    creditDays: feCustomer.creditDays,
    currentOutstanding: feCustomer.currentOutstanding,
    status: feCustomer.status,
    createdAt: ensureTime(feCustomer.createdAt),
    updatedAt: ensureTime(feCustomer.updatedAt),
  };
};


// --------------------------------------------------
// CREATE USER
// --------------------------------------------------
export async function createCustomer(payload) {
  const apiPayload = transformFECustomerToApi(payload);
  const response = await smClient.post(`/customers/createCustomer`, apiPayload);
  return transformApiCustomerToFE(response.data);
}

// --------------------------------------------------
// UPDATE USER
// --------------------------------------------------
export async function updateCustomer(id, payload) {
  const apiPayload = transformFECustomerToApi(payload);
  const response = await smClient.put(`/customers/updateCustomer/${id}`, apiPayload);
  return transformApiCustomerToFE(response.data);
}

// --------------------------------------------------
// GET USER BY ID
// --------------------------------------------------
export async function getCustomerById(id, payload) {
  const response = await smClient.get(`/customers/getCustomerById/${id}`, { params: payload });
  return transformApiCustomerToFE(response.data);
}



// --------------------------------------------------
// DELETE CUSTOMER
// --------------------------------------------------
export async function deleteCustomer(id) {
  if (!id) throw new Error("Customer ID is missing");
  const response = await smClient.delete(`/customers/deleteCustomer/${id}`);
  return response.data;
}


export async function filterCustomers() {
  const payload = {
    limit: 100,
    filters: [
      {
        attribute: "",
        operation: "",
        value: ""
      }
    ]
  };

  const response = await smClient.post(`/customers/filterCustomers`, payload);

  console.log("🔥 FILTER CUSTOMERS RESPONSE:", response.data);

  return response.data.map(transformApiCustomerToFE);
}