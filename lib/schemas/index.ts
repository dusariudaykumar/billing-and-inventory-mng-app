import { z } from 'zod';

const InfoObject = {
  name: z.string().min(1, 'Name is required'),
  companyName: z.string().min(1, 'Company name is required'),
  contactDetails: z.object({
    phone: z.string().min(1, 'Phone number is required'),
    email: z.string().nullable(),
    address: z.string().nullable(),
  }),
};

// customer
export const customerSchema = z.object({
  ...InfoObject,
  customerID: z.string().nullable().default(''),
});
export type CustomerFormData = z.infer<typeof customerSchema>;

// supplier
export const supplierSchema = z.object(InfoObject);
export type SupplierFormData = z.infer<typeof supplierSchema>;

// inventory
export const inventorySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  sellingPrice: z.number().min(1, 'sales price is required'),
  quantity: z.number().min(0, 'quantity is required'),
  purchasePrice: z.number().min(1, 'purchase price is required'),
  units: z.string().min(1, 'units is required'),
});
export type InventoryFormData = z.infer<typeof inventorySchema>;

export const createInvoiceSchema = z.object({
  customerName: z.string().min(1, 'Customer name is required'),
  invoiceDate: z.date({ required_error: 'Choose invoice data' }),
  paymentMode: z.string().min(1, 'Choose payment mode'),
  products: z.string().min(1, 'Add products'),
});
