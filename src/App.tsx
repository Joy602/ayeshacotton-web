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
} from './lib/supabase';
import { SEOHead } from './components/seo/SEOHead';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
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

export function App() {
  // Persistence with localStorage
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('ayesha_cotton_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('ayesha_cotton_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [customers, setCustomers] = useState<Customer[]>(() => {
    const saved = localStorage.getItem('ayesha_cotton_customers');
    return saved ? JSON.parse(saved) : INITIAL_CUSTOMERS;
  });

  const [settings, setSettings] = useState<StoreSettings>(() => {
    const saved = localStorage.getItem('ayesha_cotton_settings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.whatsappNumber === '+8801700000000' || !parsed.whatsappNumber) {
          return { ...parsed, whatsappNumber: '+8801783769261' };
        }
        return parsed;
      } catch (e) {
        return INITIAL_SETTINGS;
      }
    }
    return INITIAL_SETTINGS;
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('ayesha_cotton_cart');
    return saved ? JSON.parse(saved) : [];
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

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('ayesha_cotton_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('ayesha_cotton_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('ayesha_cotton_customers', JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem('ayesha_cotton_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('ayesha_cotton_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('ayesha_cotton_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('ayesha_cotton_current_user');
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
            setProducts(liveProducts);
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
      setAuthPurposeMessage('Admin panel is restricted. Please login with admin credentials (abranjoy2@gmail.com).');
      setAuthModalInitialMode('login');
      setIsAuthModalOpen(true);
      return;
    }

    if (currentUser.email?.toLowerCase().trim() === ADMIN_EMAIL) {
      setIsAdminView((prev) => !prev);
    } else {
      alert(`Access denied. Only the official admin account (${ADMIN_EMAIL}) has access to the Admin Dashboard.`);
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
          onUpdateProducts={setProducts}
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
    </div>
  );
}

export default App;

