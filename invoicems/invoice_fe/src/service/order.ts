import { smClient } from "@/lib";
import { Order, OrderItem } from "@/impData/types";

export interface CreateOrderDTO {
  orderNumber: string;
  retailer: string;
  salesperson: string;
  customer: string;
  orderDate: string;
  expectedDeliveryDate: string;
  totalAmount: number;
  description?: string;
  orderlist: {
    product: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    taxRate: string;
    taxAmount: number;
  }[];
}

// The backend may return either a plain string or an object with fields
// such as `description` or `orderId`. Use a flexible response type.
export type OrderResponse = any;

// Create Order
export const createOrder = async (
  orderData: CreateOrderDTO
): Promise<OrderResponse> => {
  try {
    const response =await smClient.post("order/createOrder", orderData);
    console.log('Order created successfully:', response.data);
    return  response.data
  } catch (error: any) {
    console.error('Error creating order:', error);
    throw error;
  }
};

// Get all Orders
export const getAllOrders = async (): Promise<OrderResponse[]> => {
  try {
    const response = await smClient.get("order/getAllOrders");
    console.log("Orders fetched successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw error;
  }
};

// Get Order by ID
export const getOrderById = async (orderId: number): Promise<OrderResponse> => {
  try {
    const response = await smClient.get(`order/getOrderById/${orderId}`);
    console.log("Order fetched successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching order:", error);
    throw error;
  }
};

// Update Order
export const updateOrder = async (
  orderId: number,
  orderData: Partial<CreateOrderDTO>
): Promise<OrderResponse> => {
  try {
    const response = await smClient.put(
      `order/updateOrder/${orderId}`,
      orderData
    );
    console.log("Order updated successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error updating order:", error);
    throw error;
  }
};

// Delete Order
export const deleteOrder = async (orderId: number): Promise<void> => {
  try {
    await smClient.delete(`order/deleteOrder/${orderId}`);
    console.log("Order deleted successfully");
  } catch (error) {
    console.error("Error deleting order:", error);
    throw error;
  }
};

// Change Order Status
export const changeOrderStatus = async (orderNumber: string): Promise<any> => {
  try {
    const response = await smClient.put(`order/changeStatus/${orderNumber}`);
    console.log("Order status changed successfully: status=", response.status, "data=", response.data);
    // return the full response so caller can inspect status if needed
    return response;
  } catch (error) {
    console.error("Error changing order status:", error);
    throw error;
  }
};

// Cancel Order
export const cancelOrder = async (orderNumber: string, reason: string): Promise<OrderResponse> => {
  try {
    const response = await smClient.put(
      `order/cancelOrder/${orderNumber}/${encodeURIComponent(reason)}`,
      { reason }
    );
    console.log("Order cancelled successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error cancelling order:", error);
    throw error;
  }
};

export const rejectOrder = async (orderNumber: string): Promise<OrderResponse> => {
  const response = await smClient.put(`order/rejectOrder/${encodeURIComponent(orderNumber)}`);
  return response.data;
};
