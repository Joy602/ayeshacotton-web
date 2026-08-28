import { createClient } from '@supabase/supabase-js';
import { Product, Order, Customer, CustomerUser } from '../types';

export const SUPABASE_URL =
  ((import.meta as any).env?.VITE_SUPABASE_URL as string) ||
  'https://cfzrpmpjjepdwklkvczn.supabase.co';

export const SUPABASE_ANON_KEY =
  ((import.meta as any).env?.VITE_SUPABASE_ANON_KEY as string) ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmenJwbXBqamVwZHdrbGt2Y3puIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc3NTYzNzEsImV4cCI6MjEwMzMzMjM3MX0.g0DT4Yf1LTa5A1A3j9rnd-SnZCbrtOPPv2hIp68g6rw';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * Normalizes a raw Supabase product record (which might use snake_case or camelCase)
 * into the standard application Product interface.
 */
export function normalizeProduct(row: any): Product {
  return {
    id: String(row.id || row.product_id || `prod-${Date.now()}`),
    name: String(row.name || row.title || 'Luxury 3-Piece Suit'),
    sku: String(row.sku || row.code || `AC-${Math.floor(100 + Math.random() * 900)}`),
    category: (row.category || 'Stitched') as 'Stitched' | 'Unstitched' | 'Kids',
    categoryLabel: row.category_label || row.categoryLabel || undefined,
    price: Number(row.price || row.unit_price || 0),
    originalPrice: row.original_price ?? row.originalPrice ?? undefined,
    stock: typeof row.stock === 'number' ? row.stock : (row.stock_quantity ?? 15),
    imageUrl: row.image_url || row.imageUrl || row.image || 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&auto=format&fit=crop&q=80',
    badge: row.badge || undefined,
    description: String(row.description || ''),
    fabricDetails: row.fabric_details || row.fabricDetails || row.fabric || undefined,
    pieces: row.pieces || undefined,
    color: row.color || undefined,
    sizes: Array.isArray(row.sizes) ? row.sizes : (typeof row.sizes === 'string' ? row.sizes.split(',').map((s: string) => s.trim()) : undefined),
    isLatest: Boolean(row.is_latest ?? row.isLatest ?? false),
  };
}

/**
 * Fetches live products from the Supabase 'products' table.
 * If empty or in case of error, returns null so the app can fallback to default products.
 */
export async function fetchProductsFromSupabase(): Promise<Product[] | null> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*');

    if (error) {
      console.warn('Supabase products fetch warning:', error.message);
      return null;
    }

    if (data && data.length > 0) {
      return data.map(normalizeProduct);
    }
    return null;
  } catch (err) {
    console.warn('Error fetching from Supabase products:', err);
    return null;
  }
}

export interface OrderInsertPayload {
  customerName: string;
  phoneNumber: string;
  deliveryAddress: string;
  city?: string;
  items: Array<{
    productId: string;
    productName: string;
    price: number;
    quantity: number;
    selectedSize?: string | null;
    imageUrl?: string;
  }>;
  totalPrice: number;
  orderNumber?: string;
  paymentMethod?: string;
  notes?: string;
}

/**
 * Inserts a new order into the Supabase 'orders' table.
 */
export async function insertOrderToSupabase(
  payload: OrderInsertPayload
): Promise<{ success: boolean; data?: any; error?: any }> {
  try {
    const formattedItems = payload.items.map((i: any) => ({
      product_id: i.productId || i.product_id,
      productId: i.productId || i.product_id,
      product_name: i.productName || i.product_name,
      productName: i.productName || i.product_name,
      price: i.price,
      quantity: i.quantity,
      selected_size: i.selectedSize || i.selected_size || null,
      selectedSize: i.selectedSize || i.selected_size || null,
      image_url: i.imageUrl || i.image_url || null,
      imageUrl: i.imageUrl || i.image_url || null,
    }));

    const orderRow: Record<string, any> = {
      customer_name: payload.customerName,
      phone: payload.phoneNumber,
      phone_number: payload.phoneNumber,
      address: payload.deliveryAddress,
      delivery_address: payload.deliveryAddress,
      city: payload.city || 'Dhaka',
      order_items: formattedItems,
      items: formattedItems,
      total_price: payload.totalPrice,
      total_amount: payload.totalPrice,
      status: 'Pending',
      order_number: payload.orderNumber || `AC-ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      payment_method: payload.paymentMethod || 'WhatsApp Order',
    };

    if (payload.notes) {
      orderRow.notes = payload.notes;
    }

    const { data, error } = await supabase.from('orders').insert([orderRow]).select();

    if (error) {
      // Fallback with minimal standard schema
      console.warn('[Supabase] Primary order insert note:', error.message);
      const fallbackRow = {
        customer_name: payload.customerName,
        phone: payload.phoneNumber,
        address: payload.deliveryAddress,
        city: payload.city || 'Dhaka',
        order_items: formattedItems,
        total_price: payload.totalPrice,
        status: 'Pending',
      };
      const fallbackRes = await supabase.from('orders').insert([fallbackRow]).select();
      if (fallbackRes.error) {
        console.warn('[Supabase] Fallback insert note:', fallbackRes.error.message);
        return { success: false, error: fallbackRes.error };
      }
      return { success: true, data: fallbackRes.data };
    }

    return { success: true, data };
  } catch (err) {
    console.error('[Supabase] Error inserting order:', err);
    return { success: false, error: err };
  }
}


export function normalizeOrder(row: any): Order {
  let parsedItems = [];
  if (Array.isArray(row.items)) {
    parsedItems = row.items.map((i: any) => ({
      productId: String(i.productId || i.product_id || `prod-${Date.now()}`),
      productName: String(i.productName || i.product_name || 'Dress Item'),
      price: Number(i.price || 0),
      quantity: Number(i.quantity || 1),
      selectedSize: i.selectedSize || i.selected_size || undefined,
      imageUrl: i.imageUrl || i.image_url || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=400&q=80',
    }));
  } else if (typeof row.items === 'string') {
    try {
      const parsed = JSON.parse(row.items);
      if (Array.isArray(parsed)) {
        parsedItems = parsed.map((i: any) => ({
          productId: String(i.productId || i.product_id || `prod-${Date.now()}`),
          productName: String(i.productName || i.product_name || 'Dress Item'),
          price: Number(i.price || 0),
          quantity: Number(i.quantity || 1),
          selectedSize: i.selectedSize || i.selected_size || undefined,
          imageUrl: i.imageUrl || i.image_url || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=400&q=80',
        }));
      }
    } catch {
      parsedItems = [];
    }
  }

  const orderNum = String(
    row.order_number || row.orderNumber || row.order_ref || (row.id ? `AC-ORD-${String(row.id).slice(-4)}` : `AC-ORD-${Math.floor(1000 + Math.random() * 9000)}`)
  );

  return {
    id: String(row.id || orderNum),
    orderNumber: orderNum,
    customerName: String(row.customer_name || row.customerName || row.name || 'Valued Customer'),
    phoneNumber: String(row.phone_number || row.customer_phone || row.phone || ''),
    deliveryAddress: String(row.delivery_address || row.address || 'Dhaka, Bangladesh'),
    city: row.city || 'Dhaka',
    items: parsedItems.length > 0 ? parsedItems : [
      {
        productId: 'item-1',
        productName: row.notes || 'Luxury Dress Order',
        price: Number(row.total_price || row.total_amount || 0),
        quantity: 1,
        imageUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=400&q=80',
      }
    ],
    totalAmount: Number(row.total_price || row.total_amount || row.amount || 0),
    status: (row.status as any) || 'Pending',
    paymentMethod: (row.payment_method as any) || 'Cash on Delivery',
    createdAt: row.created_at || new Date().toISOString(),
    notes: row.notes || undefined,
  };
}

/**
 * Fetches live orders from the Supabase 'orders' table.
 */
export async function fetchOrdersFromSupabase(): Promise<Order[] | null> {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('[Supabase] orders fetch warning:', error.message);
      return null;
    }

    if (data && data.length > 0) {
      return data.map(normalizeOrder);
    }
    return null;
  } catch (err) {
    console.warn('[Supabase] Error fetching from orders table:', err);
    return null;
  }
}

/**
 * Updates order status in Supabase 'orders' table.
 */
export async function updateOrderStatusInSupabase(
  orderIdOrNumber: string,
  status: Order['status']
): Promise<{ success: boolean; error?: any }> {
  try {
    console.log(`[Supabase] Updating status of order ${orderIdOrNumber} to ${status}`);
    
    // First try by order_number
    let { error } = await supabase
      .from('orders')
      .update({ status })
      .eq('order_number', orderIdOrNumber);

    // If no row or error, try by id
    if (error) {
      const fallback = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderIdOrNumber);
      if (fallback.error) {
        console.warn('[Supabase] Update status error:', fallback.error.message);
        return { success: false, error: fallback.error };
      }
    }

    return { success: true };
  } catch (err) {
    console.error('[Supabase] Error updating order status:', err);
    return { success: false, error: err };
  }
}

/**
 * Deletes an order from Supabase 'orders' table.
 */
export async function deleteOrderFromSupabase(
  orderIdOrNumber: string
): Promise<{ success: boolean; error?: any }> {
  try {
    console.log(`[Supabase] Deleting order ${orderIdOrNumber}`);

    // Try delete by order_number
    let { error } = await supabase
      .from('orders')
      .delete()
      .eq('order_number', orderIdOrNumber);

    // Fallback try delete by id
    if (error) {
      const fallback = await supabase
        .from('orders')
        .delete()
        .eq('id', orderIdOrNumber);
      if (fallback.error) {
        console.warn('[Supabase] Delete order error:', fallback.error.message);
        return { success: false, error: fallback.error };
      }
    }

    return { success: true };
  } catch (err) {
    console.error('[Supabase] Error deleting order:', err);
    return { success: false, error: err };
  }
}

/**
 * Ready-to-execute SQL script to create the 'customers' table in Supabase.
 */
export const SUPABASE_CUSTOMERS_TABLE_SQL = `-- Run this in Supabase SQL Editor to create the customers table
CREATE TABLE IF NOT EXISTS customers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT UNIQUE NOT NULL,
  phone_number TEXT,
  address TEXT NOT NULL,
  city TEXT DEFAULT 'Dhaka',
  password TEXT NOT NULL,
  role TEXT DEFAULT 'customer',
  total_orders INTEGER DEFAULT 0,
  total_spent NUMERIC DEFAULT 0,
  last_order_date TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Enable Row Level Security (RLS) & Public Access Policies
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read customers" ON customers FOR SELECT USING (true);
CREATE POLICY "Allow public insert customers" ON customers FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update customers" ON customers FOR UPDATE USING (true);
`;

/**
 * Normalizes a raw customer record from Supabase.
 */
export function normalizeCustomer(row: any): Customer {
  return {
    id: String(row.id || `cust-${Date.now()}`),
    name: String(row.name || row.customer_name || 'Valued Customer'),
    email: row.email || undefined,
    phoneNumber: String(row.phone || row.phone_number || row.phoneNumber || ''),
    address: String(row.address || row.delivery_address || 'Dhaka, Bangladesh'),
    city: row.city || 'Dhaka',
    totalOrders: Number(row.total_orders ?? row.totalOrders ?? 0),
    totalSpent: Number(row.total_spent ?? row.totalSpent ?? 0),
    lastOrderDate: row.last_order_date || row.lastOrderDate || new Date().toISOString().split('T')[0],
    createdAt: row.created_at || new Date().toISOString(),
  };
}

/**
 * Normalizes a raw customer record into a CustomerUser.
 */
export function normalizeCustomerUser(row: any): CustomerUser {
  const email = String(row.email || '').trim().toLowerCase();
  const isAdmin = email === 'abranjoy2@gmail.com' || row.role === 'admin';
  return {
    id: String(row.id || `user-${Date.now()}`),
    name: String(row.name || row.customer_name || 'Customer'),
    email: email,
    phoneNumber: String(row.phone_number || row.phone || row.phoneNumber || ''),
    address: String(row.address || row.delivery_address || ''),
    city: row.city || 'Dhaka',
    password: row.password || undefined,
    role: isAdmin ? 'admin' : 'customer',
    createdAt: row.created_at || new Date().toISOString(),
  };
}

/**
 * Fetches all registered customers from Supabase 'customers' table.
 */
export async function fetchCustomersFromSupabase(): Promise<Customer[] | null> {
  try {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('[Supabase] customers fetch warning (table may not exist yet):', error.message);
      return null;
    }

    if (data && data.length > 0) {
      return data.map(normalizeCustomer);
    }
    return null;
  } catch (err) {
    console.warn('[Supabase] Error fetching from customers table:', err);
    return null;
  }
}

export interface CustomerRegisterPayload {
  name: string;
  email: string;
  phoneNumber: string;
  address: string;
  city?: string;
  password: string;
}

/**
 * Registers a new customer into Supabase 'customers' table and returns the user object.
 */
export async function registerCustomerInSupabase(
  payload: CustomerRegisterPayload
): Promise<{ success: boolean; user?: CustomerUser; error?: string }> {
  try {
    const cleanPhone = payload.phoneNumber.trim();
    const cleanEmail = payload.email.trim().toLowerCase();
    const cleanName = payload.name.trim();
    const cleanAddress = payload.address.trim();
    const cleanCity = payload.city?.trim() || 'Dhaka';
    const isAdmin = cleanEmail === 'abranjoy2@gmail.com';

    // 1. Check if phone number already exists
    const { data: existingByPhone, error: phoneErr } = await supabase
      .from('customers')
      .select('id, phone_number, email')
      .eq('phone_number', cleanPhone)
      .limit(1);

    if (!phoneErr && existingByPhone && existingByPhone.length > 0) {
      return {
        success: false,
        error: 'An account with this phone number already exists. Please sign in instead.',
      };
    }

    // 2. Check if email already exists
    if (cleanEmail) {
      const { data: existingByEmail, error: emailErr } = await supabase
        .from('customers')
        .select('id, phone_number, email')
        .eq('email', cleanEmail)
        .limit(1);

      if (!emailErr && existingByEmail && existingByEmail.length > 0) {
        return {
          success: false,
          error: 'An account with this email address already exists. Please sign in instead.',
        };
      }
    }

    // 3. Exact row matching database table columns (id, name, email, phone_number, address, city, password, total_orders, total_spent)
    const customerRow = {
      name: cleanName,
      email: cleanEmail || null,
      phone_number: cleanPhone,
      address: cleanAddress,
      city: cleanCity,
      password: payload.password,
      total_orders: 0,
      total_spent: 0,
    };

    console.log('[Supabase] Inserting new customer to customers table:', customerRow);
    const { data, error } = await supabase
      .from('customers')
      .insert([customerRow])
      .select()
      .single();

    if (error) {
      console.error('[Supabase] Customer insert error details:', error);
      return {
        success: false,
        error: `Database save failed: ${error.message}. Please check your connection.`,
      };
    }

    console.log('[Supabase] Customer registered and stored successfully:', data);
    const user = normalizeCustomerUser(data);
    return { success: true, user };
  } catch (err: any) {
    console.error('[Supabase] Error registering customer:', err);
    return { success: false, error: err?.message || 'Failed to register customer' };
  }
}

/**
 * Authenticates a customer by phone number (or email) and password.
 */
export async function loginCustomerFromSupabase(
  identifier: string,
  password: string
): Promise<{ success: boolean; user?: CustomerUser; error?: string }> {
  try {
    const cleanId = identifier.trim();
    const isEmail = cleanId.includes('@');
    const cleanEmail = cleanId.toLowerCase();

    // Check special admin email login
    const isAdmin = cleanEmail === 'abranjoy2@gmail.com';

    let query = supabase.from('customers').select('*');
    if (isEmail) {
      query = query.eq('email', cleanEmail);
    } else {
      query = query.eq('phone_number', cleanId);
    }

    const { data, error } = await query.limit(1);

    if (error) {
      console.warn('[Supabase] Login query error:', error.message);
      return { success: false, error: 'Database connection issue: ' + error.message };
    }

    if (!data || data.length === 0) {
      // Special case: if logging in with admin email and not registered yet in DB, allow initial login
      if (isAdmin && password.length >= 4) {
        const adminUser: CustomerUser = {
          id: 'admin-abranjoy',
          name: 'Ayesha Cotton Admin',
          email: 'abranjoy2@gmail.com',
          phoneNumber: '01783769261',
          address: 'Ayesha Cotton HQ, Dhaka',
          city: 'Dhaka',
          role: 'admin',
          createdAt: new Date().toISOString(),
        };
        return { success: true, user: adminUser };
      }
      return { success: false, error: 'No account found with this phone number or email.' };
    }

    const userRow = data[0];
    if (userRow.password && userRow.password !== password) {
      return { success: false, error: 'Incorrect password. Please try again.' };
    }

    const user = normalizeCustomerUser(userRow);
    return { success: true, user };
  } catch (err: any) {
    console.error('[Supabase] Error logging in:', err);
    return { success: false, error: err?.message || 'Login failed' };
  }
}

/**
 * Syncs a customer's total orders and total spent in the Supabase 'customers' table.
 */
export async function syncCustomerOrderStatsInSupabase(
  phoneNumber: string,
  orderAmount: number
): Promise<void> {
  try {
    const cleanPhone = phoneNumber.trim();
    if (!cleanPhone) return;

    const { data, error } = await supabase
      .from('customers')
      .select('id, total_orders, total_spent')
      .eq('phone_number', cleanPhone)
      .limit(1);

    if (!error && data && data.length > 0) {
      const existing = data[0];
      const newTotalOrders = Number(existing.total_orders || 0) + 1;
      const newTotalSpent = Number(existing.total_spent || 0) + Number(orderAmount || 0);

      await supabase
        .from('customers')
        .update({
          total_orders: newTotalOrders,
          total_spent: newTotalSpent,
        })
        .eq('id', existing.id);
      
      console.log(`[Supabase] Updated customer stats for ${cleanPhone}: ${newTotalOrders} orders, ৳${newTotalSpent}`);
    }
  } catch (err) {
    console.warn('[Supabase] Error syncing customer order stats:', err);
  }
}

