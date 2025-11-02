/**
 * A response represents a [JSend](https://github.com/omniti-labs/jsend) response returned by the API
 */
export type IResponse<T> = {
  /** The status */
  success: boolean;

  /** The response data (optional if status === 'error', otherwise required) */
  data?: T;

  /** An optional message if status === 'error' */
  message?: string;
};

// User
export interface User {
  _id: string;
  name: string;
  email: string;
  // token: string;
}

export type UserAPIResponse = IResponse<User>;

// customer
export interface Customer {
  name: string;
  companyName: string;
  contactDetails: ContactDetails;
  _id: string;
  createdAt: string;
  updatedAt: string;
  customerID: string;
}

export interface ContactDetails {
  phone: string;
  email: string | null;
  address: string | null;
}

interface PaginatedResponse {
  totalPages: number;
  currentPage: number;
  totalResults: number;
}

export type GetAllCustomersAPIResponse = IResponse<
  PaginatedResponse & { customers: Customer[] }
>;

// create customer
export interface CreateCustomerPayload
  extends Omit<Customer, '_id' | 'createdAt' | 'updatedAt' | 'customerID'> {
  customerID?: string;
}

export type CreateCutomerAPIResponse = IResponse<Customer>;

export type UpdateCustomerAPIResponse = IResponse<Customer>;

interface CustomerDetails {
  id: string;
  name: string;
  companyName: string;
  email: string;
  phone: string;
  address: string;
  status: string;
  customerSince: string;
  stats: {
    totalBusiness: number;
    dueAmount: number;
    totalInvoices: number;
    totalPaid: number;
  };
  recentSales: Array<{
    id: string;
    invoiceNumber: number;
    date: Date;
    amount: number;
    customerPaid: number;
    dueAmount: number;
    dueDate: Date;
    status: InvoiceStatus;
  }>;
}

export type GetCustomerDetailsAPIResponse = IResponse<CustomerDetails>;

// Suppliers

export interface Supplier {
  _id: string;
  name: string;
  companyName: string;
  contactDetails: ContactDetails;
  createdAt: string;
  updatedAt: string;
}

export type GetAllSuppliersAPIResponse = IResponse<
  PaginatedResponse & { suppliers: Supplier[] }
>;

export type CreateSupplierPayload = Omit<
  Supplier,
  '_id' | 'createdAt' | 'updatedAt'
>;

export type CreateSupplierAPIResponse = IResponse<Supplier>;

export type UpdateSupplierAPIResponse = IResponse<Supplier>;

// Inventory

export interface Inventory {
  _id: string;
  name: string;
  sellingPrice: number;
  quantity: number;
  units: string;
  purchasePrice: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export type GetAllItemsFromInventoryAPIResponse = IResponse<
  PaginatedResponse & { items: Inventory[] }
>;

export type AddNewItemToInventoryPayload = Omit<
  Inventory,
  '_id' | 'createdAt' | 'updatedAt' | '__v'
>;
export type AddNewItemToInventoryAPIResponse = IResponse<Inventory>;

export type UpdateInventoryItemAPIResponse = IResponse<Inventory>;

export enum InvoiceStatus {
  PAID = 'Paid',
  PARTIALLY_PAID = 'Partially Paid',
  UNPAID = 'Unpaid',
}

export enum PaymentMethods {
  CASH = 'Cash',
  CARD = 'Card',
  UPI = 'UPI',
  BANK_TRANSFER = 'Bank Transfer',
}

// sales

export interface Item {
  itemId: string;
  name: string;
  sellingPrice: number;
  units: string;
  discount: number;
  amount: number;
  quantity: number;
  isCustomService?: boolean;
}

export interface Sale {
  _id: string;
  invoiceNumber: string;
  customerId: string;
  vehicleNumber: string;
  invoiceDate: string;
  items: Item[];
  customerPaid: number;
  totalAmount: number;
  dueAmount: number;
  discount: number;
  status: string;
  paymentMethod: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
  customerInfo: Omit<Customer, 'createdAt' | 'updatedAt'>;
  __v: number;
}

export type GetAllSalesAPIResponse = IResponse<
  PaginatedResponse & { sales: Sale[] }
>;

export type GetInvoiceAPIResponse = IResponse<
  Omit<Sale, 'customerInfo' | 'customerId'> & {
    customerId: Omit<Customer, 'createdAt' | 'updatedAt'>;
  }
>;

export type UpdateInvoiceAPIResponse = IResponse<Sale>;

export enum Units {
  PIECE = 'Piece',
  KG = 'KG',
}

interface CutomerUnpaidInvoice {
  invoices: Array<{
    id: string;
    invoiceNumber: string;
    date: Date;
    totalAmount: number;
    customerPaid: number;
    dueAmount: number;
    status: string;
  }>;
  stats: {
    totalInvoiceAmount: number;
    totalDueAmount: number;
    invoiceCount: number;
  };
}

export type GetCustomerUnpaidInvoicesAPIResponse =
  IResponse<CutomerUnpaidInvoice>;

// Dashboard

export interface DashboardStats {
  totalRevenue: number;
  totalDue: number;
  totalCustomers: number;
  totalItems: number;
}

export interface CustomerWithDues {
  id: string;
  name: string;
  companyName: string;
  contactInfo: {
    phone: string;
    email: string | null;
  };
  dueAmount: number;
  invoiceCount: number;
  lastInvoiceDate: string | Date;
}

export interface RecentSale {
  _id: string;
  customerInfo: {
    name: string;
  };
  invoiceNumber: string;
  totalAmount: number;
  status: string;
  date: string | Date;
}

export interface LowStockItem {
  _id: string;
  name: string;
  units: string;
  quantity: number;
  sellingPrice: number;
}

export interface MonthlySalesData {
  month: string;
  sales: number;
  revenue: number;
}

export interface RevenueStatus {
  name: string;
  value: number;
}

export interface DashboardData {
  stats: DashboardStats;
  customersWithDues: CustomerWithDues[];
  monthlySalesData: MonthlySalesData[];
  revenueStatus: RevenueStatus[];
  recentSales: RecentSale[];
  lowStockItems: LowStockItem[];
}

export type GetDashboardAPIResponse = IResponse<DashboardData>;
