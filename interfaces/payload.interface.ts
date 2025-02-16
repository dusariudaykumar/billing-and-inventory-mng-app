export interface User {
  _id: string;
  name: string;
  email: string;
  password: string;
  token: string;
}

export interface BasicQueryParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface CreateInvoicePayload {
  customerId: string;
  vehicleNumber: string;
  invoiceDate: Date;
  items: Item[];
  customerPaid: number;
  totalAmount: number;
  dueAmount: number;
  discount?: number;
  status: string;
  paymentMethod: string;
  notes: string;
}

export interface Item {
  itemId: string;
  name: string;
  quantity: number;
  sellingPrice: number;
  amount: number;
  discount: number;
  units: string;
}
