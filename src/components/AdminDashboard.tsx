import React, { useState, useEffect } from 'react';
import { Product, Order, Customer, StoreSettings } from '../types';
import {
  TrendingUp,
  ShoppingBag,
  Users,
  Package,
  Plus,
  Edit2,
  Trash2,
  Phone,
  Settings as SettingsIcon,
  Store,
  CheckCircle2,
  Clock,
  Truck,
  RotateCcw,
  Search,
  Check,
  Mail,
  AlertCircle,
} from 'lucide-react';
import { OptimizedImage } from './common/OptimizedImage';
import { getEmailJsConfig, saveEmailJsConfig, EmailJsConfig } from '../lib/emailService';

interface AdminDashboardProps {
  products: Product[];
  orders: Order[];
  customers: Customer[];
  settings: StoreSettings;
  onUpdateProducts: (products: Product[]) => void;
  onUpdateOrders: (orders: Order[]) => void;
  onUpdateOrderStatus?: (orderId: string, status: Order['status']) => void;
  onDeleteOrder?: (orderId: string) => void;
  onUpdateSettings: (settings: StoreSettings) => void;
  onSwitchToStore: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  products,
  orders,
  customers,
  settings,
  onUpdateProducts,
  onUpdateOrders,
  onUpdateOrderStatus,
  onDeleteOrder,
  onUpdateSettings,
  onSwitchToStore,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'customers' | 'settings'>('overview');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [productSearch, setProductSearch] = useState('');
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('All');
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  // EmailJS Settings state
  const [emailConfig, setEmailConfig] = useState<EmailJsConfig>(getEmailJsConfig());
  const [emailConfigSaved, setEmailConfigSaved] = useState(false);

  const showNotice = (msg: string) => {
    setActionNotice(msg);
    setTimeout(() => {
      setActionNotice(null);
    }, 3500);
  };

  // Form state for new product
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: '',
    category: 'Stitched',
    price: 0,
    originalPrice: 0,
    stock: 10,
    sku: `AC-${Math.floor(1000 + Math.random() * 9000)}`,
    imageUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
    description: '',
    fabricDetails: 'Swiss lawn shirt with pure chiffon dupatta',
    pieces: '3-Piece',
    isLatest: true,
  });

  // Settings form state
  const [settingsForm, setSettingsForm] = useState<StoreSettings>(settings);
  const [settingsSaved, setSettingsSaved] = useState(false);

  // Computed metrics
  const totalRevenue = orders.reduce((sum, o) => sum + (o.status !== 'Cancelled' ? o.totalAmount : 0), 0);
  const totalOrdersCount = orders.length;
  const pendingOrdersCount = orders.filter((o) => o.status === 'Pending').length;
  const lowStockCount = products.filter((p) => p.stock <= 3).length;

  // Handlers for products
  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price) {
      alert('Please fill product name and price.');
      return;
    }

    const created: Product = {
      id: `prod-${Date.now()}`,
      name: newProduct.name || 'New Collection Dress',
      category: (newProduct.category as any) || 'Stitched',
      price: Number(newProduct.price),
      originalPrice: newProduct.originalPrice ? Number(newProduct.originalPrice) : undefined,
      stock: Number(newProduct.stock) || 10,
      sku: newProduct.sku || `AC-${Math.floor(1000 + Math.random() * 9000)}`,
      imageUrl: newProduct.imageUrl || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
      description: newProduct.description || 'Artisanal 3-piece luxury collection.',
      fabricDetails: newProduct.fabricDetails || 'Pure cotton lawn',
      pieces: newProduct.pieces || '3-Piece',
      isLatest: !!newProduct.isLatest,
    };

    onUpdateProducts([created, ...products]);
    setIsAddingProduct(false);
    setNewProduct({
      name: '',
      category: 'Stitched',
      price: 0,
      originalPrice: 0,
      stock: 10,
      sku: `AC-${Math.floor(1000 + Math.random() * 9000)}`,
      imageUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
      description: '',
      fabricDetails: 'Swiss lawn shirt with pure chiffon dupatta',
      pieces: '3-Piece',
      isLatest: true,
    });
  };

  const handleUpdateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    onUpdateProducts(products.map((p) => (p.id === editingProduct.id ? editingProduct : p)));
    setEditingProduct(null);
  };

  const handleDeleteProduct = (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      onUpdateProducts(products.filter((p) => p.id !== id));
    }
  };

  // Handlers for orders
  const handleUpdateOrderStatus = (orderId: string, status: Order['status'], orderRef?: string) => {
    if (onUpdateOrderStatus) {
      onUpdateOrderStatus(orderId, status);
    } else {
      onUpdateOrders(
        orders.map((o) => (o.id === orderId || o.orderNumber === orderId ? { ...o, status } : o))
      );
    }
    showNotice(`Order ${orderRef || orderId} status changed to "${status}"`);
  };

  const handleDeleteOrder = (orderId: string, orderRef: string) => {
    if (window.confirm(`Are you sure you want to permanently delete Order ${orderRef}? This action will remove it from the database.`)) {
      if (onDeleteOrder) {
        onDeleteOrder(orderId);
      } else {
        onUpdateOrders(orders.filter((o) => o.id !== orderId && o.orderNumber !== orderId));
      }
      showNotice(`Order ${orderRef} deleted successfully.`);
    }
  };

  // Settings save handler
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings(settingsForm);
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 2500);
  };

  return (
    <div className="bg-[#fbf9f8] min-h-[90vh] text-[#1b1c1c]">
      
      {/* Top Banner with Navigation Tabs */}
      <div className="bg-white border-b border-[#ede8e4] sticky top-20 sm:top-24 md:top-26 z-30 shadow-2xs">
        <div className="max-w-[1280px] mx-auto px-4 md:px-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-playfair text-xl md:text-2xl font-bold text-[#1b1c1c]">
                Store Management Portal
              </h1>
              <span className="bg-[#fdebf3] text-[#745663] text-xs font-bold px-2.5 py-0.5 rounded-full border border-[#fcd4e4]">
                Ayesha Cotton
              </span>
            </div>
            <p className="text-xs text-[#53434b]">
              Real-time inventory, WhatsApp orders, customer directory, and storefront settings.
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-3.5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-[#745663] text-white shadow-xs'
                  : 'bg-[#f6f4f2] text-[#53434b] hover:text-[#1b1c1c] hover:bg-[#ede8e4]'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('products')}
              className={`px-3.5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'products'
                  ? 'bg-[#745663] text-white shadow-xs'
                  : 'bg-[#f6f4f2] text-[#53434b] hover:text-[#1b1c1c] hover:bg-[#ede8e4]'
              }`}
            >
              Products ({products.length})
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-3.5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'orders'
                  ? 'bg-[#745663] text-white shadow-xs'
                  : 'bg-[#f6f4f2] text-[#53434b] hover:text-[#1b1c1c] hover:bg-[#ede8e4]'
              }`}
            >
              Orders ({orders.length})
            </button>
            <button
              onClick={() => setActiveTab('customers')}
              className={`px-3.5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'customers'
                  ? 'bg-[#745663] text-white shadow-xs'
                  : 'bg-[#f6f4f2] text-[#53434b] hover:text-[#1b1c1c] hover:bg-[#ede8e4]'
              }`}
            >
              Customers ({customers.length})
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`px-3.5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'settings'
                  ? 'bg-[#745663] text-white shadow-xs'
                  : 'bg-[#f6f4f2] text-[#53434b] hover:text-[#1b1c1c] hover:bg-[#ede8e4]'
              }`}
            >
              Settings
            </button>
          </div>
        </div>
      </div>

      {/* Main Tab Content */}
      <div className="max-w-[1280px] mx-auto px-4 md:px-10 py-8">
        {/* Action Notice Toast */}
        {actionNotice && (
          <div className="mb-6 p-4 bg-[#745663] text-white rounded-2xl shadow-lg flex items-center justify-between text-xs font-semibold animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
              <span>{actionNotice}</span>
            </div>
            <button
              onClick={() => setActionNotice(null)}
              className="text-white/80 hover:text-white text-sm ml-4 cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}
        
        {/* ===================== OVERVIEW TAB ===================== */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Metric KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="bg-white p-5 rounded-2xl border border-[#ede8e4] shadow-xs">
                <div className="flex items-center justify-between text-[#745663] mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#53434b]">Total Revenue</span>
                  <div className="p-2 rounded-xl bg-[#fdebf3]">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                </div>
                <p className="font-playfair text-2xl md:text-3xl font-bold text-[#1b1c1c]">
                  {settings.currencySymbol}{totalRevenue.toLocaleString()}
                </p>
                <p className="text-[11px] text-emerald-700 mt-1 font-semibold">
                  From {orders.filter((o) => o.status !== 'Cancelled').length} confirmed orders
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-[#ede8e4] shadow-xs">
                <div className="flex items-center justify-between text-[#745663] mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#53434b]">Total Orders</span>
                  <div className="p-2 rounded-xl bg-[#fdebf3]">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                </div>
                <p className="font-playfair text-2xl md:text-3xl font-bold text-[#1b1c1c]">
                  {totalOrdersCount}
                </p>
                <p className="text-[11px] text-[#745663] mt-1 font-semibold">
                  {pendingOrdersCount} pending approval
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-[#ede8e4] shadow-xs">
                <div className="flex items-center justify-between text-[#745663] mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#53434b]">Active Catalog</span>
                  <div className="p-2 rounded-xl bg-[#fdebf3]">
                    <Package className="w-5 h-5" />
                  </div>
                </div>
                <p className="font-playfair text-2xl md:text-3xl font-bold text-[#1b1c1c]">
                  {products.length} Items
                </p>
                <p className="text-[11px] text-rose-700 mt-1 font-semibold">
                  {lowStockCount} items with low stock (&le;3)
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-[#ede8e4] shadow-xs">
                <div className="flex items-center justify-between text-[#745663] mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#53434b]">Customer Directory</span>
                  <div className="p-2 rounded-xl bg-[#fdebf3]">
                    <Users className="w-5 h-5" />
                  </div>
                </div>
                <p className="font-playfair text-2xl md:text-3xl font-bold text-[#1b1c1c]">
                  {customers.length} Clients
                </p>
                <p className="text-[11px] text-emerald-700 mt-1 font-semibold">
                  High return buyer rate
                </p>
              </div>
            </div>

            {/* Recent Orders Overview */}
            <div className="bg-white p-6 rounded-2xl border border-[#ede8e4] shadow-xs">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="font-playfair text-lg font-bold text-[#1b1c1c]">Recent Order Queue</h2>
                  <p className="text-xs text-[#53434b]">Manage live orders, change delivery status, or remove test orders</p>
                </div>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="text-xs font-bold text-[#745663] hover:text-[#5c434e] underline cursor-pointer"
                >
                  View All Orders ({orders.length}) →
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-[#ede8e4] text-[#53434b] uppercase font-bold">
                    <tr>
                      <th className="py-3 px-3">Order Ref</th>
                      <th className="py-3 px-3">Customer</th>
                      <th className="py-3 px-3">Item(s)</th>
                      <th className="py-3 px-3">Amount</th>
                      <th className="py-3 px-3">Status</th>
                      <th className="py-3 px-3">Payment</th>
                      <th className="py-3 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#ede8e4]">
                    {orders.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-8 text-center text-[#8f8287]">
                          No orders placed yet.
                        </td>
                      </tr>
                    ) : (
                      orders.slice(0, 8).map((order) => (
                        <tr key={order.id} className="hover:bg-[#fcfbfa] transition-colors">
                          <td className="py-3 px-3 font-semibold font-mono text-[#1b1c1c]">{order.orderNumber}</td>
                          <td className="py-3 px-3">
                            <p className="font-semibold text-[#1b1c1c]">{order.customerName}</p>
                            <p className="text-[10px] text-[#8f8287]">{order.phoneNumber}</p>
                          </td>
                          <td className="py-3 px-3 text-[#53434b] max-w-xs truncate">
                            {order.items.map((i) => `${i.productName} (x${i.quantity})`).join(', ')}
                          </td>
                          <td className="py-3 px-3 font-bold text-[#745663]">
                            {settings.currencySymbol}{order.totalAmount.toLocaleString()}
                          </td>
                          <td className="py-3 px-3">
                            {/* Live status change dropdown */}
                            <select
                              value={order.status}
                              onChange={(e) =>
                                handleUpdateOrderStatus(order.id, e.target.value as any, order.orderNumber)
                              }
                              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-colors cursor-pointer focus:outline-none ${
                                order.status === 'Delivered'
                                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                  : order.status === 'Processing'
                                  ? 'bg-blue-50 text-blue-800 border-blue-300'
                                  : order.status === 'Shipped'
                                  ? 'bg-indigo-50 text-indigo-800 border-indigo-300'
                                  : order.status === 'Confirmed'
                                  ? 'bg-purple-50 text-purple-800 border-purple-300'
                                  : order.status === 'Cancelled'
                                  ? 'bg-rose-50 text-rose-800 border-rose-300'
                                  : 'bg-amber-50 text-amber-800 border-amber-300'
                              }`}
                            >
                              <option value="Pending">Pending</option>
                              <option value="Confirmed">Confirmed</option>
                              <option value="Processing">Processing</option>
                              <option value="Shipped">Shipped</option>
                              <option value="Delivered">Delivered</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          </td>
                          <td className="py-3 px-3 text-[#53434b]">{order.paymentMethod}</td>
                          <td className="py-3 px-3 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {order.phoneNumber && (
                                <a
                                  href={`https://wa.me/${order.phoneNumber.replace(/[^0-9]/g, '')}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 transition-colors"
                                  title="Chat on WhatsApp"
                                >
                                  <Phone className="w-3.5 h-3.5" />
                                </a>
                              )}
                              <button
                                onClick={() => handleDeleteOrder(order.id, order.orderNumber)}
                                className="p-1.5 rounded-lg text-[#8f8287] hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                                title="Delete Order"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ===================== PRODUCTS TAB ===================== */}
        {activeTab === 'products' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-playfair text-2xl font-bold text-[#1b1c1c]">Product Inventory</h2>
                <p className="text-xs text-[#53434b]">Add, edit, change pricing, and monitor stock levels.</p>
              </div>
              <button
                onClick={() => setIsAddingProduct(true)}
                className="bg-[#745663] hover:bg-[#5c434e] text-white px-5 py-2.5 rounded-full font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                Add New Dress
              </button>
            </div>

            {/* Search Bar */}
            <div className="flex items-center bg-white border border-[#ede8e4] rounded-2xl px-4 py-2.5 shadow-2xs">
              <Search className="w-4 h-4 text-[#745663] shrink-0" />
              <input
                type="text"
                placeholder="Search products by name or SKU..."
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                className="w-full bg-transparent border-none text-xs text-[#1b1c1c] focus:outline-none ml-2 placeholder-[#8f8287]"
              />
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-2xl border border-[#ede8e4] overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#fcfbfa] border-b border-[#ede8e4] text-[#53434b] uppercase font-bold">
                    <tr>
                      <th className="py-3 px-4">Item</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Price</th>
                      <th className="py-3 px-4">Stock</th>
                      <th className="py-3 px-4">SKU</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#ede8e4]">
                    {products
                      .filter(
                        (p) =>
                          p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
                          p.sku.toLowerCase().includes(productSearch.toLowerCase())
                      )
                      .map((product) => (
                        <tr key={product.id} className="hover:bg-[#fcfbfa] transition-colors">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-14 bg-[#f2eeeb] rounded-lg overflow-hidden shrink-0 border border-[#ede8e4]">
                                <OptimizedImage
                                  src={product.imageUrl}
                                  alt={product.name}
                                  aspectRatio="h-full w-full"
                                />
                              </div>
                              <div>
                                <p className="font-semibold text-sm text-[#1b1c1c]">{product.name}</p>
                                <p className="text-[10px] text-[#8f8287]">{product.pieces} • {product.fabricDetails}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span className="px-2.5 py-1 rounded-full bg-[#fdebf3] text-[#745663] font-bold text-[10px] border border-[#fcd4e4]">
                              {product.category}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-bold text-[#745663]">
                            {settings.currencySymbol}{product.price.toLocaleString()}
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                                product.stock > 5
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : 'bg-rose-50 text-rose-700 border border-rose-200'
                              }`}
                            >
                              {product.stock} units
                            </span>
                          </td>
                          <td className="py-3 px-4 text-[#8f8287] font-mono">{product.sku}</td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => setEditingProduct(product)}
                                className="p-1.5 rounded-lg text-[#53434b] hover:text-[#1b1c1c] hover:bg-[#f6f4f2] transition-colors cursor-pointer"
                                title="Edit Product"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(product.id)}
                                className="p-1.5 rounded-lg text-[#8f8287] hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                                title="Delete Product"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ===================== ORDERS TAB ===================== */}
        {activeTab === 'orders' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-playfair text-2xl font-bold text-[#1b1c1c]">Customer Orders</h2>
                <p className="text-xs text-[#53434b]">Track WhatsApp inquiries, confirm payments, and update delivery dispatch.</p>
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-[#53434b]">Filter:</span>
                <select
                  value={orderStatusFilter}
                  onChange={(e) => setOrderStatusFilter(e.target.value)}
                  className="bg-white border border-[#ede8e4] rounded-full px-3 py-1.5 text-xs font-semibold text-[#1b1c1c] focus:outline-none cursor-pointer"
                >
                  <option value="All">All Statuses</option>
                  <option value="Pending">Pending</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-2xl border border-[#ede8e4] overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#fcfbfa] border-b border-[#ede8e4] text-[#53434b] uppercase font-bold">
                    <tr>
                      <th className="py-3 px-4">Order Ref</th>
                      <th className="py-3 px-4">Customer &amp; Address</th>
                      <th className="py-3 px-4">Items</th>
                      <th className="py-3 px-4">Total</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Contact</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#ede8e4]">
                    {orders
                      .filter((o) => orderStatusFilter === 'All' || o.status === orderStatusFilter)
                      .map((order) => (
                        <tr key={order.id} className="hover:bg-[#fcfbfa] transition-colors">
                          <td className="py-3 px-4 font-mono font-bold text-[#1b1c1c]">{order.orderNumber}</td>
                          <td className="py-3 px-4">
                            <p className="font-bold text-sm text-[#1b1c1c]">{order.customerName}</p>
                            <p className="text-[#53434b] text-[11px] max-w-xs">{order.deliveryAddress}</p>
                            {order.city && <p className="text-[10px] text-[#8f8287]">City: {order.city}</p>}
                          </td>
                          <td className="py-3 px-4 text-[#53434b]">
                            {order.items.map((i) => (
                              <div key={i.productId}>
                                • {i.productName} (x{i.quantity}) {i.selectedSize ? `[${i.selectedSize}]` : ''}
                              </div>
                            ))}
                          </td>
                          <td className="py-3 px-4 font-bold text-[#745663]">
                            {settings.currencySymbol}{order.totalAmount.toLocaleString()}
                          </td>
                          <td className="py-3 px-4">
                            <select
                              value={order.status}
                              onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value as any, order.orderNumber)}
                              className={`border rounded-lg px-2.5 py-1 text-xs font-bold focus:outline-none cursor-pointer ${
                                order.status === 'Delivered'
                                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                  : order.status === 'Processing'
                                  ? 'bg-blue-50 text-blue-800 border-blue-300'
                                  : order.status === 'Shipped'
                                  ? 'bg-indigo-50 text-indigo-800 border-indigo-300'
                                  : order.status === 'Confirmed'
                                  ? 'bg-purple-50 text-purple-800 border-purple-300'
                                  : order.status === 'Cancelled'
                                  ? 'bg-rose-50 text-rose-800 border-rose-300'
                                  : 'bg-amber-50 text-amber-800 border-amber-300'
                              }`}
                            >
                              <option value="Pending">Pending</option>
                              <option value="Confirmed">Confirmed</option>
                              <option value="Processing">Processing</option>
                              <option value="Shipped">Shipped</option>
                              <option value="Delivered">Delivered</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          </td>
                          <td className="py-3 px-4">
                            {order.phoneNumber ? (
                              <a
                                href={`https://wa.me/${order.phoneNumber.replace(/[^0-9]/g, '')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 bg-[#25D366]/10 text-[#006d2f] hover:bg-[#25D366]/20 px-3 py-1 rounded-full font-bold text-[11px] transition-colors"
                              >
                                <Phone className="w-3 h-3" />
                                WhatsApp
                              </a>
                            ) : (
                              <span className="text-[#8f8287] text-[11px]">N/A</span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <button
                              onClick={() => handleDeleteOrder(order.id, order.orderNumber)}
                              className="p-1.5 rounded-lg text-[#8f8287] hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                              title="Delete Order"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ===================== CUSTOMERS TAB ===================== */}
        {activeTab === 'customers' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div>
              <h2 className="font-playfair text-2xl font-bold text-[#1b1c1c]">Customer Directory</h2>
              <p className="text-xs text-[#53434b]">Client relationships, order frequency, and delivery history.</p>
            </div>

            <div className="bg-white rounded-2xl border border-[#ede8e4] overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#fcfbfa] border-b border-[#ede8e4] text-[#53434b] uppercase font-bold">
                    <tr>
                      <th className="py-3 px-4">Customer Name</th>
                      <th className="py-3 px-4">Phone Number</th>
                      <th className="py-3 px-4">Primary Address</th>
                      <th className="py-3 px-4">Total Orders</th>
                      <th className="py-3 px-4">Total Spent</th>
                      <th className="py-3 px-4">Last Order</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#ede8e4]">
                    {customers.map((cust) => (
                      <tr key={cust.id} className="hover:bg-[#fcfbfa] transition-colors">
                        <td className="py-3 px-4 font-bold text-[#1b1c1c]">{cust.name}</td>
                        <td className="py-3 px-4 font-mono text-[#53434b]">{cust.phoneNumber}</td>
                        <td className="py-3 px-4 text-[#53434b]">{cust.address}</td>
                        <td className="py-3 px-4 font-bold text-[#1b1c1c]">{cust.totalOrders}</td>
                        <td className="py-3 px-4 font-bold text-[#745663]">
                          {settings.currencySymbol}{cust.totalSpent.toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-[#8f8287]">{cust.lastOrderDate}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ===================== SETTINGS TAB ===================== */}
        {activeTab === 'settings' && (
          <div className="max-w-2xl bg-white p-6 sm:p-8 rounded-3xl border border-[#ede8e4] shadow-xs space-y-6 animate-in fade-in duration-300">
            <div>
              <h2 className="font-playfair text-2xl font-bold text-[#1b1c1c]">Store Configuration</h2>
              <p className="text-xs text-[#53434b]">Customize store name, contact WhatsApp number, currency, and free delivery thresholds.</p>
            </div>

            {settingsSaved && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-xs font-semibold">
                Store settings saved successfully!
              </div>
            )}

            <form onSubmit={handleSaveSettings} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#1b1c1c] mb-1">Store Name</label>
                <input
                  type="text"
                  value={settingsForm.storeName}
                  onChange={(e) => setSettingsForm({ ...settingsForm, storeName: e.target.value })}
                  className="w-full bg-[#f6f4f2] border border-[#e4e0dc] focus:border-[#745663] focus:bg-white rounded-xl px-4 py-2.5 text-xs text-[#1b1c1c] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1b1c1c] mb-1">WhatsApp Business Number</label>
                <input
                  type="text"
                  value={settingsForm.whatsappNumber}
                  onChange={(e) => setSettingsForm({ ...settingsForm, whatsappNumber: e.target.value })}
                  className="w-full bg-[#f6f4f2] border border-[#e4e0dc] focus:border-[#745663] focus:bg-white rounded-xl px-4 py-2.5 text-xs text-[#1b1c1c] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#1b1c1c] mb-1">Currency Symbol</label>
                  <input
                    type="text"
                    value={settingsForm.currencySymbol}
                    onChange={(e) => setSettingsForm({ ...settingsForm, currencySymbol: e.target.value })}
                    className="w-full bg-[#f6f4f2] border border-[#e4e0dc] focus:border-[#745663] focus:bg-white rounded-xl px-4 py-2.5 text-xs text-[#1b1c1c] focus:outline-none font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#1b1c1c] mb-1">Free Shipping Threshold</label>
                  <input
                    type="number"
                    value={settingsForm.freeShippingThreshold}
                    onChange={(e) => setSettingsForm({ ...settingsForm, freeShippingThreshold: Number(e.target.value) })}
                    className="w-full bg-[#f6f4f2] border border-[#e4e0dc] focus:border-[#745663] focus:bg-white rounded-xl px-4 py-2.5 text-xs text-[#1b1c1c] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1b1c1c] mb-1">Support Email</label>
                <input
                  type="email"
                  value={settingsForm.supportEmail}
                  onChange={(e) => setSettingsForm({ ...settingsForm, supportEmail: e.target.value })}
                  className="w-full bg-[#f6f4f2] border border-[#e4e0dc] focus:border-[#745663] focus:bg-white rounded-xl px-4 py-2.5 text-xs text-[#1b1c1c] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1b1c1c] mb-1">Boutique Address</label>
                <input
                  type="text"
                  value={settingsForm.address}
                  onChange={(e) => setSettingsForm({ ...settingsForm, address: e.target.value })}
                  className="w-full bg-[#f6f4f2] border border-[#e4e0dc] focus:border-[#745663] focus:bg-white rounded-xl px-4 py-2.5 text-xs text-[#1b1c1c] focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#745663] hover:bg-[#5c434e] text-white py-3 rounded-full font-bold text-xs transition-colors shadow-sm cursor-pointer"
              >
                Save Settings
              </button>
            </form>

            {/* Email Notification Settings Panel */}
            <div className="pt-6 mt-6 border-t border-[#ede8e4] space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-playfair text-base font-bold text-[#1b1c1c] flex items-center gap-2">
                    <Mail className="w-4 h-4 text-[#745663]" /> Admin Email Notifications (Active)
                  </h3>
                  <p className="text-[11px] text-[#53434b]">
                    Instant itemized notification emails are sent automatically to <strong className="text-[#745663]">{emailConfig.adminEmail || 'abranjoy2@gmail.com'}</strong> whenever an order is placed.
                  </p>
                </div>
                {emailConfigSaved && (
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
                    <Check className="w-3 h-3" /> Saved
                  </span>
                )}
              </div>

              {/* EmailJS Credentials Form */}
              <div className="bg-[#fcfbfa] border border-[#ede8e4] p-4 rounded-2xl space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block font-semibold text-[#1b1c1c] mb-1">Target Admin Email</label>
                    <input
                      type="email"
                      value={emailConfig.adminEmail}
                      onChange={(e) => setEmailConfig({ ...emailConfig, adminEmail: e.target.value })}
                      placeholder="abranjoy2@gmail.com"
                      className="w-full bg-white border border-[#e4e0dc] rounded-xl px-3 py-2 text-[#1b1c1c] focus:border-[#745663] focus:outline-none font-mono text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-[#1b1c1c] mb-1">EmailJS Service ID</label>
                    <input
                      type="text"
                      value={emailConfig.serviceId}
                      onChange={(e) => setEmailConfig({ ...emailConfig, serviceId: e.target.value })}
                      placeholder="service_jcosb9b"
                      className="w-full bg-white border border-[#e4e0dc] rounded-xl px-3 py-2 text-[#1b1c1c] focus:border-[#745663] focus:outline-none font-mono text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-[#1b1c1c] mb-1">
                      EmailJS Template ID
                    </label>
                    <input
                      type="text"
                      value={emailConfig.templateId}
                      onChange={(e) => setEmailConfig({ ...emailConfig, templateId: e.target.value })}
                      placeholder="template_lx3rxt8"
                      className="w-full bg-white border border-[#e4e0dc] rounded-xl px-3 py-2 text-[#1b1c1c] focus:border-[#745663] focus:outline-none font-mono text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-[#1b1c1c] mb-1">EmailJS Public Key</label>
                    <input
                      type="text"
                      value={emailConfig.publicKey}
                      onChange={(e) => setEmailConfig({ ...emailConfig, publicKey: e.target.value })}
                      placeholder="kMGzfY2Q2abGu6Db6"
                      className="w-full bg-white border border-[#e4e0dc] rounded-xl px-3 py-2 text-[#1b1c1c] focus:border-[#745663] focus:outline-none font-mono text-xs"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      saveEmailJsConfig(emailConfig);
                      setEmailConfigSaved(true);
                      showNotice('Email notification configuration saved successfully!');
                      setTimeout(() => setEmailConfigSaved(false), 3000);
                    }}
                    className="w-full sm:w-auto px-5 py-2.5 bg-[#745663] hover:bg-[#5c434e] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer shadow-xs"
                  >
                    Save Email Configuration
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* ===================== ADD PRODUCT MODAL ===================== */}
      {isAddingProduct && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white text-[#1b1c1c] rounded-3xl p-6 max-w-lg w-full border border-[#ede8e4] shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-playfair text-xl font-bold text-[#1b1c1c]">Add New Collection Dress</h3>
              <button
                onClick={() => setIsAddingProduct(false)}
                className="p-1 text-[#8f8287] hover:text-[#1b1c1c] cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-[#1b1c1c] mb-1">Product Title</label>
                <input
                  type="text"
                  required
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  placeholder="e.g., Royal Blossom Silk 3-Piece"
                  className="w-full bg-[#f6f4f2] border border-[#e4e0dc] focus:border-[#745663] focus:bg-white rounded-xl px-3 py-2 text-[#1b1c1c] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#1b1c1c] mb-1">Category</label>
                  <select
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value as any })}
                    className="w-full bg-[#f6f4f2] border border-[#e4e0dc] focus:border-[#745663] focus:bg-white rounded-xl px-3 py-2 text-[#1b1c1c] focus:outline-none"
                  >
                    <option value="Stitched">Stitched</option>
                    <option value="Unstitched">Unstitched</option>
                    <option value="Kids">Kids</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-[#1b1c1c] mb-1">SKU</label>
                  <input
                    type="text"
                    value={newProduct.sku}
                    onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value })}
                    className="w-full bg-[#f6f4f2] border border-[#e4e0dc] focus:border-[#745663] focus:bg-white rounded-xl px-3 py-2 text-[#1b1c1c] focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-[#1b1c1c] mb-1">Price (৳)</label>
                  <input
                    type="number"
                    required
                    value={newProduct.price || ''}
                    onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
                    className="w-full bg-[#f6f4f2] border border-[#e4e0dc] focus:border-[#745663] focus:bg-white rounded-xl px-3 py-2 text-[#1b1c1c] focus:outline-none font-bold"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#1b1c1c] mb-1">Original Price</label>
                  <input
                    type="number"
                    value={newProduct.originalPrice || ''}
                    onChange={(e) => setNewProduct({ ...newProduct, originalPrice: Number(e.target.value) })}
                    className="w-full bg-[#f6f4f2] border border-[#e4e0dc] focus:border-[#745663] focus:bg-white rounded-xl px-3 py-2 text-[#1b1c1c] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#1b1c1c] mb-1">Stock</label>
                  <input
                    type="number"
                    value={newProduct.stock}
                    onChange={(e) => setNewProduct({ ...newProduct, stock: Number(e.target.value) })}
                    className="w-full bg-[#f6f4f2] border border-[#e4e0dc] focus:border-[#745663] focus:bg-white rounded-xl px-3 py-2 text-[#1b1c1c] focus:outline-none font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#1b1c1c] mb-1">Image URL</label>
                <input
                  type="text"
                  value={newProduct.imageUrl}
                  onChange={(e) => setNewProduct({ ...newProduct, imageUrl: e.target.value })}
                  placeholder="https://..."
                  className="w-full bg-[#f6f4f2] border border-[#e4e0dc] focus:border-[#745663] focus:bg-white rounded-xl px-3 py-2 text-[#1b1c1c] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#1b1c1c] mb-1">Fabric Details</label>
                <input
                  type="text"
                  value={newProduct.fabricDetails}
                  onChange={(e) => setNewProduct({ ...newProduct, fabricDetails: e.target.value })}
                  placeholder="e.g. Lawn with Chiffon Dupatta"
                  className="w-full bg-[#f6f4f2] border border-[#e4e0dc] focus:border-[#745663] focus:bg-white rounded-xl px-3 py-2 text-[#1b1c1c] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#1b1c1c] mb-1">Description</label>
                <textarea
                  rows={2}
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  className="w-full bg-[#f6f4f2] border border-[#e4e0dc] focus:border-[#745663] focus:bg-white rounded-xl px-3 py-2 text-[#1b1c1c] focus:outline-none resize-none"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddingProduct(false)}
                  className="flex-1 py-2.5 rounded-full border border-[#e4e0dc] text-[#53434b] hover:bg-[#f6f4f2] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-full bg-[#745663] hover:bg-[#5c434e] text-white font-bold transition-colors cursor-pointer shadow-sm"
                >
                  Create Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================== EDIT PRODUCT MODAL ===================== */}
      {editingProduct && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white text-[#1b1c1c] rounded-3xl p-6 max-w-lg w-full border border-[#ede8e4] shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-playfair text-xl font-bold text-[#1b1c1c]">Edit Product</h3>
              <button
                onClick={() => setEditingProduct(null)}
                className="p-1 text-[#8f8287] hover:text-[#1b1c1c] cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUpdateProduct} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-[#1b1c1c] mb-1">Product Title</label>
                <input
                  type="text"
                  required
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  className="w-full bg-[#f6f4f2] border border-[#e4e0dc] focus:border-[#745663] focus:bg-white rounded-xl px-3 py-2 text-[#1b1c1c] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-[#1b1c1c] mb-1">Price (৳)</label>
                  <input
                    type="number"
                    required
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                    className="w-full bg-[#f6f4f2] border border-[#e4e0dc] focus:border-[#745663] focus:bg-white rounded-xl px-3 py-2 text-[#1b1c1c] focus:outline-none font-bold"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#1b1c1c] mb-1">Original Price</label>
                  <input
                    type="number"
                    value={editingProduct.originalPrice || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, originalPrice: Number(e.target.value) })}
                    className="w-full bg-[#f6f4f2] border border-[#e4e0dc] focus:border-[#745663] focus:bg-white rounded-xl px-3 py-2 text-[#1b1c1c] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#1b1c1c] mb-1">Stock</label>
                  <input
                    type="number"
                    value={editingProduct.stock}
                    onChange={(e) => setEditingProduct({ ...editingProduct, stock: Number(e.target.value) })}
                    className="w-full bg-[#f6f4f2] border border-[#e4e0dc] focus:border-[#745663] focus:bg-white rounded-xl px-3 py-2 text-[#1b1c1c] focus:outline-none font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#1b1c1c] mb-1">Image URL</label>
                <input
                  type="text"
                  value={editingProduct.imageUrl}
                  onChange={(e) => setEditingProduct({ ...editingProduct, imageUrl: e.target.value })}
                  className="w-full bg-[#f6f4f2] border border-[#e4e0dc] focus:border-[#745663] focus:bg-white rounded-xl px-3 py-2 text-[#1b1c1c] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#1b1c1c] mb-1">Description</label>
                <textarea
                  rows={3}
                  value={editingProduct.description}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  className="w-full bg-[#f6f4f2] border border-[#e4e0dc] focus:border-[#745663] focus:bg-white rounded-xl px-3 py-2 text-[#1b1c1c] focus:outline-none resize-none"
                />
              </div>

              <div className="pt-3 flex gap-3">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="flex-1 py-2.5 rounded-full border border-[#e4e0dc] text-[#53434b] hover:bg-[#f6f4f2] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-full bg-[#745663] hover:bg-[#5c434e] text-white font-bold transition-colors cursor-pointer shadow-sm"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
