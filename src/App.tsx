import React, { useState, useEffect } from 'react';
import {
  INITIAL_PRODUCTS,
  INITIAL_ORDERS,
  INITIAL_CUSTOMERS,
  INITIAL_SETTINGS,
} from './data/initialData';
import { Product, Order, Customer, StoreSettings, CartItem, CustomerUser } from './types';
import {
  fetchProductsFromSupabase,
  fetchOrdersFromSupabase,
  fetchCustomersFromSupabase,
  updateOrderStatusInSupabase,
  deleteOrderFromSupabase,
  syncCustomerOrderStatsInSupabase,
  saveProductToSupabase,
  deleteProductFromSupabase,
} from './lib/supabase';
import { SEOHead } from './components/seo/SEOHead';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { FeaturedCategories } from './components/FeaturedCategories';
import { LatestProducts } from './components/LatestProducts';
import { ProductGrid } from './components/ProductGrid';
import { OrderDrawer } from './components/OrderDrawer';
import { CartDrawer } from './components/CartDrawer';
import { ProductDetailModal } from './components/ProductDetailModal';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { AdminDashboard } from './components/AdminDashboard';
import { Footer } from './components/Footer';
import { ContactModal } from './components/ContactModal';
import { CustomerAuthModal } from './components/CustomerAuthModal';
import { safeSetItem, safeRemoveItem } from './lib/safeStorage';

function normalizeProductName(name: string): string {
  return (name || '').trim().toLowerCase();
}

function getDeletedProductKeys(): Set<string> {
  try {
    const raw = localStorage.getItem('ayesha_cotton_deleted_product_keys');
    if (raw) {
      const arr: string[] = JSON.parse(raw);
      return new Set(arr.map((k) => k.toLowerCase().trim()));
    }
  } catch {}
  return new Set();
}

function recordDeletedProductKey(id: string, name?: string) {
  try {
    const current = getDeletedProductKeys();
    if (id) current.add(id.toLowerCase().trim());
    if (name) current.add(name.toLowerCase().trim());
    localStorage.setItem(
      'ayesha_cotton_deleted_product_keys',
      JSON.stringify(Array.from(current))
    );
  } catch {}
}

export function mergeAndDeduplicateProducts(
  incomingProducts: Product[],
  skipInitialFallback = false
): Product[] {
  const deletedKeys = getDeletedProductKeys();
  const initialMapByName = new Map<string, Product>();
  const initialMapById = new Map<string, Product>();
  for (const initP of INITIAL_PRODUCTS) {
    initialMapByName.set(normalizeProductName(initP.name), initP);
    initialMapById.set(initP.id, initP);
  }

  const result: Product[] = [];
  const seenNames = new Set<string>();
  const seenIds = new Set<string>();

  // 1. Process incoming products first
  for (const p of incomingProducts) {
    if (!p || p.id === 'prod-11') continue;
    const nameKey = normalizeProductName(p.name);
    const idKey = (p.id || '').toLowerCase().trim();

    // Skip if marked as deleted
    if ((idKey && deletedKeys.has(idKey)) || (nameKey && deletedKeys.has(nameKey))) {
      continue;
    }
    
    // Skip if this product name or id is already in our result
    if ((nameKey && seenNames.has(nameKey)) || (p.id && seenIds.has(p.id))) {
      continue;
    }

    // Match with initial data by name or ID to inherit rich attributes
    const initMatch = (nameKey ? initialMapByName.get(nameKey) : null) || (p.id ? initialMapById.get(p.id) : null);
    
    const merged: Product = initMatch
      ? {
          ...initMatch,
          ...p,
          id: p.id || initMatch.id,
          imageUrl: p.imageUrl || initMatch.imageUrl,
          images: (p.images && p.images.length > 0) ? p.images : (initMatch.images || [p.imageUrl || initMatch.imageUrl]),
        }
      : p;

    // Enforce strict category normalization to '3 pcs', 'Kids', or 'Latest'
    const rawCat = String(merged.category || '').trim().toLowerCase();
    if (rawCat === 'kids' || rawCat === 'kid' || rawCat === 'baby') {
      merged.category = 'Kids';
    } else if (rawCat === 'latest' || rawCat === 'new arrival') {
      merged.category = 'Latest';
    } else {
      merged.category = '3 pcs';
    }

    if (nameKey) seenNames.add(nameKey);
    if (merged.id) seenIds.add(merged.id);
    result.push(merged);
  }

  // 2. Add INITIAL_PRODUCTS only if not skipping fallback and not deleted
  if (!skipInitialFallback) {
    for (const initP of INITIAL_PRODUCTS) {
      if (initP.id === 'prod-11') continue;
      const nameKey = normalizeProductName(initP.name);
      const idKey = (initP.id || '').toLowerCase().trim();

      if ((idKey && deletedKeys.has(idKey)) || (nameKey && deletedKeys.has(nameKey))) {
        continue;
      }
      if (nameKey && seenNames.has(nameKey)) continue;
      if (initP.id && seenIds.has(initP.id)) continue;

      if (nameKey) seenNames.add(nameKey);
      if (initP.id) seenIds.add(initP.id);
      result.push(initP);
    }
  }

  return result;
}

export function App() {
  // Persistence with localStorage & deduplication
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('ayesha_cotton_products');
      if (saved) {
        const parsed: Product[] = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return mergeAndDeduplicateProducts(parsed);
        }
      }
    } catch (e) {
      console.warn('Error reading products from localStorage:', e);
    }
    return INITIAL_PRODUCTS;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('ayesha_cotton_orders');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.warn('Error reading orders from localStorage:', e);
    }
    return INITIAL_ORDERS;
  });

  const [customers, setCustomers] = useState<Customer[]>(() => {
    try {
      const saved = localStorage.getItem('ayesha_cotton_customers');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.warn('Error reading customers from localStorage:', e);
    }
    return INITIAL_CUSTOMERS;
  });

  const [settings, setSettings] = useState<StoreSettings>(() => {
    try {
      const saved = localStorage.getItem('ayesha_cotton_settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (
          parsed.whatsappNumber === '+8801700000000' ||
          parsed.whatsappNumber === '+8801783769261' ||
          !parsed.whatsappNumber
        ) {
          return { ...parsed, whatsappNumber: '+8801712679721' };
        }
        return parsed;
      }
    } catch (e) {
      console.warn('Error reading settings from localStorage:', e);
    }
    return INITIAL_SETTINGS;
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('ayesha_cotton_cart');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.warn('Error reading cart from localStorage:', e);
    }
    return [];
  });

  // Current Logged-in Customer
  const [currentUser, setCurrentUser] = useState<CustomerUser | null>(() => {
    const saved = localStorage.getItem('ayesha_cotton_current_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  // UI state
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isAdminView, setIsAdminView] = useState<boolean>(false);

  // Modals & Drawers
  const [orderDrawerProduct, setOrderDrawerProduct] = useState<Product | null>(null);
  const [isOrderDrawerOpen, setIsOrderDrawerOpen] = useState<boolean>(false);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [detailProduct, setDetailProduct] = useState<Product | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState<boolean>(false);
  const [isContactOpen, setIsContactOpen] = useState<boolean>(false);

  // Customer Auth Modal State
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalInitialMode, setAuthModalInitialMode] = useState<'login' | 'register'>('login');
  const [authPurposeMessage, setAuthPurposeMessage] = useState<string | undefined>(undefined);
  const [notificationMessage, setNotificationMessage] = useState<string | null>(null);

  // Sync to localStorage safely with quota protection
  useEffect(() => {
    // Strip oversized base64 images from localStorage copy so it never exceeds 5MB browser quota
    const isLargeBase64 = (str?: string) => typeof str === 'string' && str.startsWith('data:') && str.length > 50000;
    const sanitizedProducts = products.map((p) => {
      const imgIsLarge = isLargeBase64(p.imageUrl);
      const hasLargeGallery = Array.isArray(p.images) && p.images.some(isLargeBase64);
      if (!imgIsLarge && !hasLargeGallery) return p;
      return {
        ...p,
        imageUrl: imgIsLarge ? 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80' : p.imageUrl,
        images: (p.images || []).map((img) =>
          isLargeBase64(img) ? 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80' : img
        ),
      };
    });
    safeSetItem('ayesha_cotton_products', sanitizedProducts);
  }, [products]);

  useEffect(() => {
    safeSetItem('ayesha_cotton_orders', orders);
  }, [orders]);

  useEffect(() => {
    safeSetItem('ayesha_cotton_customers', customers);
  }, [customers]);

  useEffect(() => {
    safeSetItem('ayesha_cotton_settings', settings);
  }, [settings]);

  useEffect(() => {
    safeSetItem('ayesha_cotton_cart', cart);
  }, [cart]);

  useEffect(() => {
    if (currentUser) {
      safeSetItem('ayesha_cotton_current_user', currentUser);
    } else {
      safeRemoveItem('ayesha_cotton_current_user');
    }
  }, [currentUser]);

  // Load live products, orders and customers from Supabase
  useEffect(() => {
    let isMounted = true;
    async function loadLiveSupabaseData() {
      try {
        const [liveProducts, liveOrders, liveCustomers] = await Promise.all([
          fetchProductsFromSupabase(),
          fetchOrdersFromSupabase(),
          fetchCustomersFromSupabase(),
        ]);
        if (isMounted) {
          if (liveProducts && liveProducts.length > 0) {
            const merged = mergeAndDeduplicateProducts(liveProducts, true);
            setProducts(merged);
          }
          if (liveOrders && liveOrders.length > 0) {
            setOrders(liveOrders);
          }
          if (liveCustomers && liveCustomers.length > 0) {
            setCustomers(liveCustomers);
          }
        }
      } catch (e) {
        console.warn('Error loading Supabase live data:', e);
      }
    }
    loadLiveSupabaseData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Product update & sync with Supabase
  const handleUpdateProducts = async (newProducts: Product[]) => {
    // Detect any removed products so that deletions also sync to Supabase
    const newIds = new Set(newProducts.map((p) => p.id));
    const newNames = new Set(newProducts.map((p) => (p.name || '').trim().toLowerCase()));
    const removedProducts = products.filter(
      (p) => !newIds.has(p.id) && !newNames.has((p.name || '').trim().toLowerCase())
    );

    for (const rem of removedProducts) {
      recordDeletedProductKey(rem.id, rem.name);
    }

    setProducts(newProducts);

    try {
      // Sync deletions to Supabase
      for (const rem of removedProducts) {
        deleteProductFromSupabase(rem.id, rem.name);
      }
      // Sync added/updated
      for (const p of newProducts) {
        saveProductToSupabase(p);
      }
    } catch (e) {
      console.warn('Failed to sync product changes to Supabase:', e);
    }
  };

  const handleDeleteProduct = async (productId: string, productName?: string) => {
    // Record deletion so it never gets resurrected by initial fallback
    recordDeletedProductKey(productId, productName);
    // Remove from cart if present
    setCart((prev) =>
      prev.filter((item) => item.product.id !== productId && item.product.name !== productName)
    );
    // Remove from product list
    setProducts((prev) =>
      prev.filter((p) => p.id !== productId && p.name !== productName)
    );
    try {
      return await deleteProductFromSupabase(productId, productName);
    } catch (e) {
      console.warn('Failed to delete product from Supabase:', e);
      return { success: false, error: e };
    }
  };

  // Update order status with Supabase syncing
  const handleUpdateOrderStatus = async (orderId: string, status: Order['status']) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId || o.orderNumber === orderId ? { ...o, status } : o))
    );
    try {
      await updateOrderStatusInSupabase(orderId, status);
    } catch (e) {
      console.warn('Failed to sync status to Supabase:', e);
    }
  };

  // Delete order with Supabase syncing
  const handleDeleteOrder = async (orderId: string) => {
    setOrders((prev) =>
      prev.filter((o) => o.id !== orderId && o.orderNumber !== orderId)
    );
    try {
      await deleteOrderFromSupabase(orderId);
    } catch (e) {
      console.warn('Failed to delete order from Supabase:', e);
    }
  };

  // Auth Modal trigger functions
  const handleOpenAuth = (mode: 'login' | 'register' = 'login', purpose?: string) => {
    setAuthModalInitialMode(mode);
    setAuthPurposeMessage(purpose);
    setIsAuthModalOpen(true);
  };

  const handleRequireAuth = (purposeMessage?: string) => {
    setAuthPurposeMessage(purposeMessage || 'Please sign in or register before ordering.');
    setAuthModalInitialMode('login');
    setIsAuthModalOpen(true);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    if (isAdminView) {
      setIsAdminView(false);
    }
  };

  // Admin Access Verification
  const handleAttemptAdminAccess = () => {
    const ADMIN_EMAIL = 'abranjoy2@gmail.com';
    if (!currentUser) {
      setAuthPurposeMessage('অ্যাডমিন প্যানেল সুরক্ষিত। অনুগ্রহ করে অ্যাডমিন অ্যাকাউন্টে লগইন করুন।');
      setAuthModalInitialMode('login');
      setIsAuthModalOpen(true);
      return;
    }

    if (currentUser.email?.toLowerCase().trim() === ADMIN_EMAIL) {
      setIsAdminView((prev) => !prev);
    } else {
      setNotificationMessage('অ্যাডমিন প্যানেলে প্রবেশের অনুমতি শুধুমাত্র অথোরাইজড অ্যাডমিন অ্যাকাউন্টের জন্য সংরক্ষিত।');
      setTimeout(() => setNotificationMessage(null), 4000);
    }
  };

  // Cart operations
  const handleAddToCart = (product: Product, size?: string) => {
    setCart((prev) => {
      const existing = prev.find(
        (item) => item.product.id === product.id && item.selectedSize === size
      );
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id && item.selectedSize === size
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1, selectedSize: size }];
    });
    setIsCartOpen(true);
  };

  const handleUpdateCartQuantity = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  // Buy Now flow (opens "Complete Your Order" Drawer)
  const handleBuyNow = (product: Product) => {
    setOrderDrawerProduct(product);
    setIsOrderDrawerOpen(true);
  };

  // Quick detail modal flow
  const handleViewDetails = (product: Product) => {
    setDetailProduct(product);
    setIsDetailOpen(true);
  };

  // Order Placement callback
  const handleOrderPlaced = (newOrder: Order) => {
    setOrders((prev) => [newOrder, ...prev]);

    // Update customer records or create customer in state
    setCustomers((prev) => {
      const existing = prev.find(
        (c) => c.phoneNumber === newOrder.phoneNumber || c.name === newOrder.customerName
      );
      if (existing) {
        return prev.map((c) =>
          c.id === existing.id
            ? {
                ...c,
                totalOrders: c.totalOrders + 1,
                totalSpent: c.totalSpent + newOrder.totalAmount,
                lastOrderDate: new Date().toISOString().split('T')[0],
              }
            : c
        );
      } else {
        const newCust: Customer = {
          id: `cust-${Date.now()}`,
          name: newOrder.customerName,
          phoneNumber: newOrder.phoneNumber,
          address: newOrder.deliveryAddress,
          totalOrders: 1,
          totalSpent: newOrder.totalAmount,
          lastOrderDate: new Date().toISOString().split('T')[0],
        };
        return [newCust, ...prev];
      }
    });

    // Sync customer stats in Supabase
    syncCustomerOrderStatsInSupabase(newOrder.phoneNumber, newOrder.totalAmount).then(() => {
      fetchCustomersFromSupabase().then((custs) => {
        if (custs && custs.length > 0) setCustomers(custs);
      });
    });

    // Reduce product stock
    newOrder.items.forEach((item) => {
      setProducts((prev) =>
        prev.map((p) =>
          p.id === item.productId
            ? { ...p, stock: Math.max(0, p.stock - item.quantity) }
            : p
        )
      );
    });
  };

  // Scroll to shop catalog section
  const handleScrollToShop = () => {
    const el = document.getElementById('shop-catalog');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-[#fbf9f8] text-[#1b1c1c] font-sans-body flex flex-col selection:bg-[#fcd4e4] selection:text-[#2b1420]">
      
      {/* Comprehensive Dynamic SEO Meta & JSON-LD Structured Data */}
      <SEOHead
        category={selectedCategory}
        product={detailProduct}
        products={products}
        settings={settings}
      />

      {/* Top Sticky Navigation */}
      <Navbar
        activeTab={selectedCategory}
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          if (isAdminView) setIsAdminView(false);
          handleScrollToShop();
        }}
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        isAdminView={isAdminView}
        onToggleAdmin={handleAttemptAdminAccess}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenContact={() => setIsContactOpen(true)}
        currentUser={currentUser}
        onOpenAuth={handleOpenAuth}
        onLogout={handleLogout}
        onAttemptAdminAccess={handleAttemptAdminAccess}
      />

      {/* Main View: Admin Dashboard vs Customer Storefront */}
      {isAdminView && currentUser?.email?.toLowerCase().trim() === 'abranjoy2@gmail.com' ? (
        <AdminDashboard
          products={products}
          orders={orders}
          customers={customers}
          settings={settings}
          onUpdateProducts={handleUpdateProducts}
          onDeleteProduct={handleDeleteProduct}
          onUpdateOrders={setOrders}
          onUpdateOrderStatus={handleUpdateOrderStatus}
          onDeleteOrder={handleDeleteOrder}
          onUpdateSettings={setSettings}
          onSwitchToStore={() => setIsAdminView(false)}
        />
      ) : (
        <main className="flex-1" role="main">
          
          {/* Hero Section */}
          <Hero onShopClick={handleScrollToShop} />

          {/* Featured Category Cards (3 pcs, Kids, Latest) */}
          <FeaturedCategories
            products={products}
            selectedCategory={selectedCategory}
            onSelectCategory={(cat) => {
              setSelectedCategory(cat);
              handleScrollToShop();
            }}
          />

          {/* Latest Arrivals Drop */}
          <LatestProducts
            products={products}
            currencySymbol={settings.currencySymbol}
            onBuyNow={handleBuyNow}
            onAddToCart={handleAddToCart}
            onViewDetails={handleViewDetails}
          />

          {/* Main Product Catalog with Category Tabs */}
          <ProductGrid
            products={products}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            currencySymbol={settings.currencySymbol}
            searchQuery={searchQuery}
            onBuyNow={handleBuyNow}
            onAddToCart={handleAddToCart}
            onViewDetails={handleViewDetails}
          />

          {/* Floating WhatsApp Action Button */}
          <FloatingWhatsApp settings={settings} />

          {/* Slide-out Order Drawer ("Complete Your Order") */}
          <OrderDrawer
            isOpen={isOrderDrawerOpen}
            onClose={() => setIsOrderDrawerOpen(false)}
            product={orderDrawerProduct}
            currencySymbol={settings.currencySymbol}
            settings={settings}
            onOrderPlaced={handleOrderPlaced}
            currentUser={currentUser}
            onRequireAuth={handleRequireAuth}
          />

          {/* Multi-Item Shopping Cart Drawer */}
          <CartDrawer
            isOpen={isCartOpen}
            onClose={() => setIsCartOpen(false)}
            items={cart}
            onUpdateQuantity={handleUpdateCartQuantity}
            onRemoveItem={handleRemoveFromCart}
            onClearCart={handleClearCart}
            currencySymbol={settings.currencySymbol}
            settings={settings}
            onOrderPlaced={handleOrderPlaced}
            currentUser={currentUser}
            onRequireAuth={handleRequireAuth}
          />

          {/* Product Detail Modal */}
          <ProductDetailModal
            isOpen={isDetailOpen}
            product={detailProduct}
            onClose={() => setIsDetailOpen(false)}
            currencySymbol={settings.currencySymbol}
            onBuyNow={handleBuyNow}
            onAddToCart={handleAddToCart}
          />

          {/* Contact Us Modal */}
          <ContactModal
            isOpen={isContactOpen}
            onClose={() => setIsContactOpen(false)}
            settings={settings}
          />

          {/* Footer */}
          <Footer
            settings={settings}
            onSelectCategory={(cat) => {
              setSelectedCategory(cat);
              handleScrollToShop();
            }}
            onOpenAdmin={handleAttemptAdminAccess}
            onOpenContact={() => setIsContactOpen(true)}
            isAdminUser={currentUser?.email?.toLowerCase().trim() === 'abranjoy2@gmail.com'}
          />
        </main>
      )}

      {/* Customer Authentication Modal (Login & Register) */}
      <CustomerAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authModalInitialMode}
        currentUser={currentUser}
        onAuthSuccess={(user) => {
          setCurrentUser(user);
          setIsAuthModalOpen(false);
          // Refresh customer list so admin sees new accounts immediately
          fetchCustomersFromSupabase().then((custs) => {
            if (custs && custs.length > 0) setCustomers(custs);
          });
        }}
        purposeMessage={authPurposeMessage}
      />

      {/* Toast Notification Banner */}
      {notificationMessage && (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 max-w-[90vw] sm:max-w-md bg-[#1b1c1c] text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-white/10 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <span className="text-sm">ℹ️</span>
          <p className="text-xs font-medium leading-relaxed">{notificationMessage}</p>
        </div>
      )}
    </div>
  );
}

export default App;

