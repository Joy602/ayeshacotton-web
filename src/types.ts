export type ProductCategory = 'Stitched' | 'Unstitched' | 'Kids' | 'All';

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: 'Stitched' | 'Unstitched' | 'Kids';
  categoryLabel?: string;
  price: number;
  originalPrice?: number;
  stock: number;
  imageUrl: string;
  images?: string[];
  badge?: 'Stitched' | 'Unstitched' | 'Kids' | 'New Arrival' | 'Bestseller';
  description: string;
  fabricDetails?: string;
  pieces?: string;
  color?: string;
  sizes?: string[];
  isLatest?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  phoneNumber: string;
  deliveryAddress: string;
  city?: string;
  items: {
    productId: string;
    productName: string;
    price: number;
    quantity: number;
    selectedSize?: string;
    imageUrl: string;
  }[];
  totalAmount: number;
  status: 'Pending' | 'Confirmed' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  paymentMethod: 'WhatsApp Order' | 'Cash on Delivery' | 'Online Payment';
  createdAt: string;
  notes?: string;
}

export interface CustomerUser {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  address: string;
  city?: string;
  password?: string;
  role?: 'customer' | 'admin';
  createdAt?: string;
}

export interface Customer {
  id: string;
  name: string;
  email?: string;
  phoneNumber: string;
  address: string;
  city?: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: string;
  createdAt?: string;
}

export interface StoreSettings {
  storeName: string;
  currencySymbol: string;
  whatsappNumber: string;
  whatsappGreeting: string;
  shippingFee: number;
  freeShippingThreshold: number;
  supportEmail: string;
  address: string;
}
