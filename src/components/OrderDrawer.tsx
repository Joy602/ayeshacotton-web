import React, { useState, useEffect } from 'react';
import { Product, Order, StoreSettings, CustomerUser } from '../types';
import { X, CheckCircle2, ShoppingBag, User, LogIn, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { OptimizedImage } from './common/OptimizedImage';
import { insertOrderToSupabase } from '../lib/supabase';
import { sendOrderNotificationEmail } from '../lib/emailService';

interface OrderDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  currencySymbol: string;
  settings: StoreSettings;
  onOrderPlaced: (order: Order) => void;
  currentUser: CustomerUser | null;
  onRequireAuth: (purposeMessage?: string) => void;
}

export const OrderDrawer: React.FC<OrderDrawerProps> = ({
  isOpen,
  onClose,
  product,
  currencySymbol,
  settings,
  onOrderPlaced,
  currentUser,
  onRequireAuth,
}) => {
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [city, setCity] = useState('Dhaka');
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [notes, setNotes] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Pre-fill user information if logged in or when product changes
  useEffect(() => {
    if (product) {
      setQuantity(1);
      setSelectedSize(product.sizes && product.sizes.length > 0 ? product.sizes[0] : '');
      setIsSuccess(false);
      setIsSubmitting(false);
      setErrorMessage('');
    }
  }, [product, isOpen]);

  useEffect(() => {
    if (currentUser) {
      if (currentUser.name) setFullName(currentUser.name);
      if (currentUser.phoneNumber) setPhoneNumber(currentUser.phoneNumber);
      if (currentUser.address) setDeliveryAddress(currentUser.address);
      if (currentUser.city) setCity(currentUser.city);
    }
  }, [currentUser, isOpen]);

  if (!isOpen || !product) return null;

  const itemTotal = product.price * quantity;
  const deliveryFee = city.toLowerCase().includes('dhaka') ? 80 : 150;
  const grandTotal = itemTotal + deliveryFee;

  const validateAndCheckAuth = (): boolean => {
    if (!currentUser) {
      onRequireAuth('Please sign in or create an account with your phone number to complete your order.');
      return false;
    }
    if (!fullName.trim()) {
      setErrorMessage('Please enter your full name.');
      return false;
    }
    if (!phoneNumber.trim()) {
      setErrorMessage('Please enter your phone number.');
      return false;
    }
    if (!deliveryAddress.trim()) {
      setErrorMessage('Please enter your complete delivery address.');
      return false;
    }
    return true;
  };

  const handleWhatsAppOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateAndCheckAuth()) return;

    setErrorMessage('');
    setIsSubmitting(true);

    // Construct the WhatsApp message
    const orderNumber = `AC-ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    const message = `🌸 *New Order Inquiry - Ayesha Cotton* 🌸
--------------------------------
*Order Ref:* ${orderNumber}
*Product:* ${product.name}
*SKU:* ${product.sku}
*Category:* ${product.category}
${selectedSize ? `*Size:* ${selectedSize}\n` : ''}*Quantity:* ${quantity}
*Item Price:* ${currencySymbol}${product.price.toLocaleString()}
*Subtotal:* ${currencySymbol}${itemTotal.toLocaleString()}
*Estimated Delivery (${city}):* ${currencySymbol}${deliveryFee}
*Total Payable:* ${currencySymbol}${grandTotal.toLocaleString()}

*Customer Information:*
• *Name:* ${fullName.trim()}
• *Phone:* ${phoneNumber.trim()}
• *Delivery Address:* ${deliveryAddress.trim()}
• *City/Region:* ${city}
${notes ? `• *Special Notes:* ${notes.trim()}\n` : ''}
Please confirm availability and dispatch schedule. Thank you!`;

    const emailPayload = {
      orderId: orderNumber,
      customerName: fullName.trim(),
      phoneNumber: phoneNumber.trim(),
      deliveryAddress: `${deliveryAddress.trim()}, ${city}`,
      city,
      items: [
        {
          product_id: product.id,
          product_name: product.name,
          productId: product.id,
          productName: product.name,
          price: product.price,
          quantity,
          selected_size: selectedSize || null,
          selectedSize: selectedSize || null,
          image_url: product.imageUrl,
          imageUrl: product.imageUrl,
        },
      ],
      totalAmount: grandTotal,
      deliveryFee,
      paymentMethod: 'WhatsApp Order',
      notes: notes.trim() || undefined,
    };

    // 1. Dispatch Email Notification immediately to admin (abranjoy2@gmail.com)
    try {
      const emailResult = await sendOrderNotificationEmail(emailPayload);
      console.log('[OrderDrawer] Email notification result:', emailResult);
    } catch (emailErr) {
      console.warn('[OrderDrawer] Email notification dispatch warning:', emailErr);
    }

    // 2. Insert into Supabase with safe fallback
    try {
      await insertOrderToSupabase({
        customerName: fullName.trim(),
        phoneNumber: phoneNumber.trim(),
        deliveryAddress: `${deliveryAddress.trim()}, ${city}`,
        city,
        items: [
          {
            productId: product.id,
            productName: product.name,
            price: product.price,
            quantity,
            selectedSize: selectedSize || undefined,
            imageUrl: product.imageUrl,
          },
        ],
        totalPrice: grandTotal,
        orderNumber,
        paymentMethod: 'WhatsApp Order',
        notes: notes.trim() || undefined,
      });
    } catch (dbErr) {
      console.warn('Supabase non-blocking sync note:', dbErr);
    }

    // 3. Save order in local state for dashboard tracking
    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber,
      customerName: fullName.trim(),
      phoneNumber: phoneNumber.trim(),
      deliveryAddress: `${deliveryAddress.trim()}, ${city}`,
      city,
      items: [
        {
          productId: product.id,
          productName: product.name,
          price: product.price,
          quantity,
          selectedSize: selectedSize || undefined,
          imageUrl: product.imageUrl,
        },
      ],
      totalAmount: grandTotal,
      status: 'Pending',
      paymentMethod: 'WhatsApp Order',
      createdAt: new Date().toISOString(),
      notes: notes || undefined,
    };

    onOrderPlaced(newOrder);

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#fcd4e4', '#745663', '#25D366', '#fed65b'],
      });
    } catch (err) {
      // safe fallback
    }

    // 4. Construct the WhatsApp URL and open it
    let cleanWhatsApp = (settings.whatsappNumber || '01712679721').replace(/[^0-9]/g, '');
    if (cleanWhatsApp.startsWith('01')) {
      cleanWhatsApp = '88' + cleanWhatsApp;
    } else if (cleanWhatsApp.length === 10 && cleanWhatsApp.startsWith('1')) {
      cleanWhatsApp = '880' + cleanWhatsApp;
    }
    const whatsappUrl = `https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent(message)}`;

    // Open WhatsApp in a new tab
    window.open(whatsappUrl, '_blank');

    setIsSubmitting(false);
    setIsSuccess(true);
  };

  const handleCodOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateAndCheckAuth()) return;

    setErrorMessage('');
    setIsSubmitting(true);

    const orderNumber = `AC-ORD-${Math.floor(1000 + Math.random() * 9000)}`;

    const emailPayload = {
      orderId: orderNumber,
      customerName: fullName.trim(),
      phoneNumber: phoneNumber.trim(),
      deliveryAddress: `${deliveryAddress.trim()}, ${city}`,
      city,
      items: [
        {
          product_id: product.id,
          product_name: product.name,
          productId: product.id,
          productName: product.name,
          price: product.price,
          quantity,
          selected_size: selectedSize || null,
          selectedSize: selectedSize || null,
          image_url: product.imageUrl,
          imageUrl: product.imageUrl,
        },
      ],
      totalAmount: grandTotal,
      deliveryFee,
      paymentMethod: 'Cash on Delivery',
      notes: notes.trim() || undefined,
    };

    // 1. Dispatch Email Notification immediately to admin (abranjoy2@gmail.com)
    try {
      const emailResult = await sendOrderNotificationEmail(emailPayload);
      console.log('[OrderDrawer COD] Email notification result:', emailResult);
    } catch (emailErr) {
      console.warn('[OrderDrawer COD] Email notification error:', emailErr);
    }

    // 2. Insert into Supabase safely
    try {
      await insertOrderToSupabase({
        customerName: fullName.trim(),
        phoneNumber: phoneNumber.trim(),
        deliveryAddress: `${deliveryAddress.trim()}, ${city}`,
        city,
        items: [
          {
            productId: product.id,
            productName: product.name,
            price: product.price,
            quantity,
            selectedSize: selectedSize || undefined,
            imageUrl: product.imageUrl,
          },
        ],
        totalPrice: grandTotal,
        orderNumber,
        paymentMethod: 'Cash on Delivery',
        notes: notes.trim() || undefined,
      });
    } catch (dbErr) {
      console.warn('Supabase COD non-blocking sync note:', dbErr);
    }

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber,
      customerName: fullName.trim(),
      phoneNumber: phoneNumber.trim(),
      deliveryAddress: `${deliveryAddress.trim()}, ${city}`,
      city,
      items: [
        {
          productId: product.id,
          productName: product.name,
          price: product.price,
          quantity,
          selectedSize: selectedSize || undefined,
          imageUrl: product.imageUrl,
        },
      ],
      totalAmount: grandTotal,
      status: 'Pending',
      paymentMethod: 'Cash on Delivery',
      createdAt: new Date().toISOString(),
      notes: notes || undefined,
    };

    onOrderPlaced(newOrder);

    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#fcd4e4', '#745663', '#25D366', '#fed65b'],
      });
    } catch (err) {
      // safe fallback
    }

    setIsSubmitting(false);
    setIsSuccess(true);
  };

  return (
    <aside role="dialog" aria-modal="true" aria-label="Complete Your Order Drawer">
      {/* Overlay backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 transition-opacity duration-300"
      />

      {/* Slide-out Order Drawer */}
      <div
        className="fixed top-0 right-0 h-[100dvh] sm:h-full w-full max-w-full sm:max-w-md bg-white text-[#1b1c1c] border-l border-[#ede8e4] shadow-2xl z-50 flex flex-col p-4 sm:p-6 overflow-y-auto animate-in slide-in-from-right duration-300"
        id="orderDrawer"
      >
        {/* Drawer Header */}
        <div className="flex justify-between items-center mb-4 sm:mb-6 shrink-0">
          <h2 className="font-playfair text-xl sm:text-2xl font-bold text-[#1b1c1c]">
            Complete Your Order
          </h2>
          <button
            onClick={onClose}
            aria-label="Close order drawer"
            className="text-[#53434b] hover:text-[#1b1c1c] p-2 rounded-full hover:bg-[#f6f4f2] transition-colors cursor-pointer"
            id="closeDrawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccess ? (
          /* Order Confirmation Screen */
          <div className="flex-1 flex flex-col items-center justify-center text-center p-2 sm:p-4">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-emerald-50 border border-emerald-200 text-emerald-600 rounded-full flex items-center justify-center mb-3 sm:mb-4 shadow-xs">
              <CheckCircle2 className="w-8 h-8 sm:w-10 sm:h-10" />
            </div>
            <h3 className="font-playfair text-xl sm:text-2xl font-bold text-[#1b1c1c] mb-2">
              Order Placed Successfully!
            </h3>
            <p className="text-xs sm:text-sm text-[#53434b] mb-4 sm:mb-6">
              Thank you, <strong className="text-[#1b1c1c]">{fullName}</strong>. Your order has been recorded. Our team will verify your details and dispatch your package shortly.
            </p>

            <div className="w-full bg-[#fcfbfa] p-3.5 sm:p-4 rounded-2xl border border-[#ede8e4] text-left text-xs text-[#53434b] space-y-1.5 mb-4 sm:mb-6">
              <p><strong className="text-[#1b1c1c]">Item:</strong> {product.name}</p>
              <p><strong className="text-[#1b1c1c]">Quantity:</strong> {quantity}</p>
              <p><strong className="text-[#1b1c1c]">Total:</strong> {currencySymbol}{grandTotal.toLocaleString()}</p>
              <p><strong className="text-[#1b1c1c]">Delivery to:</strong> {deliveryAddress}, {city}</p>
            </div>

            <button
              onClick={onClose}
              className="w-full bg-[#745663] hover:bg-[#5c434e] text-white py-3 sm:py-3.5 rounded-full font-semibold text-xs sm:text-sm transition-colors cursor-pointer shadow-xs"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          /* Checkout Form */
          <>
            {/* Customer Account Status Indicator */}
            {currentUser ? (
              <div className="mb-4 p-3 bg-[#fdebf3] border border-[#fcd4e4] rounded-2xl flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-[#745663] text-white flex items-center justify-center text-xs font-bold">
                    {currentUser.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#1b1c1c]">Ordering as {currentUser.name}</p>
                    <p className="text-[10px] text-[#745663] font-mono">{currentUser.phoneNumber}</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-[#745663] bg-white px-2 py-1 rounded-full border border-[#fcd4e4]">
                  Logged In
                </span>
              </div>
            ) : (
              <div className="mb-4 p-3.5 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-between shrink-0">
                <div>
                  <p className="text-xs font-bold text-amber-900">Sign in to place orders</p>
                  <p className="text-[11px] text-amber-700">Login or register to order quickly.</p>
                </div>
                <button
                  type="button"
                  onClick={() => onRequireAuth('Please sign in or register to place your order.')}
                  className="px-3 py-1.5 bg-[#745663] text-white rounded-full text-xs font-bold hover:bg-[#5c434e] transition-colors cursor-pointer shadow-2xs"
                >
                  Sign In
                </button>
              </div>
            )}

            {/* Product Summary Box */}
            <div className="bg-[#fcfbfa] p-3 sm:p-4 rounded-2xl mb-4 sm:mb-6 flex justify-between items-center border border-[#ede8e4] shrink-0">
              <div className="pr-2 sm:pr-3">
                <p className="font-sans-body font-semibold text-xs sm:text-sm text-[#1b1c1c] line-clamp-1" id="drawerProductName">
                  {product.name}
                </p>
                <p className="font-sans-body text-[11px] sm:text-xs text-[#8f8287] mb-0.5 sm:mb-1">
                  SKU: {product.sku} • {product.category}
                </p>
                <p className="font-sans-body font-bold text-xs sm:text-sm text-[#745663] font-playfair" id="drawerProductPrice">
                  {currencySymbol}{product.price.toLocaleString()}
                </p>
              </div>
              <div className="w-14 h-16 sm:w-16 sm:h-20 bg-[#f2eeeb] rounded-xl overflow-hidden shrink-0 border border-[#ede8e4]">
                <OptimizedImage
                  src={product.imageUrl}
                  alt={product.name}
                  aspectRatio="h-full w-full"
                />
              </div>
            </div>

            {/* Validation alert */}
            {errorMessage && (
              <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-semibold shrink-0">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleWhatsAppOrder} className="flex flex-col gap-3 sm:gap-4 flex-grow">
              
              {/* Full Name */}
              <div>
                <label className="block text-[11px] sm:text-xs font-semibold text-[#1b1c1c] mb-1">
                  Full Name <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your name"
                  required
                  className="w-full bg-[#f6f4f2] border border-[#e4e0dc] focus:border-[#745663] focus:bg-white rounded-xl px-3.5 py-2.5 sm:py-3 text-base sm:text-sm text-[#1b1c1c] placeholder-[#8f8287] focus:outline-none transition-colors"
                />
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-[11px] sm:text-xs font-semibold text-[#1b1c1c] mb-1">
                  Phone Number <span className="text-rose-600">*</span>
                </label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="017XXXXXXXX / +880..."
                  required
                  className="w-full bg-[#f6f4f2] border border-[#e4e0dc] focus:border-[#745663] focus:bg-white rounded-xl px-3.5 py-2.5 sm:py-3 text-base sm:text-sm text-[#1b1c1c] placeholder-[#8f8287] focus:outline-none transition-colors"
                />
              </div>

              {/* Size Selector if available */}
              {product.sizes && product.sizes.length > 0 && (
                <div>
                  <label className="block text-[11px] sm:text-xs font-semibold text-[#1b1c1c] mb-1">
                    Select Size
                  </label>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {product.sizes.map((s) => (
                      <button
                        type="button"
                        key={s}
                        onClick={() => setSelectedSize(s)}
                        className={`px-3 py-1 sm:py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer border ${
                          selectedSize === s
                            ? 'bg-[#745663] text-white border-[#745663] shadow-2xs'
                            : 'bg-white text-[#53434b] border-[#e4e0dc] hover:border-[#745663]'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Delivery Address */}
              <div>
                <label className="block text-[11px] sm:text-xs font-semibold text-[#1b1c1c] mb-1">
                  Delivery Address <span className="text-rose-600">*</span>
                </label>
                <textarea
                  rows={2}
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  placeholder="House, Road, Area, Detailed address"
                  required
                  className="w-full bg-[#f6f4f2] border border-[#e4e0dc] focus:border-[#745663] focus:bg-white rounded-xl px-3.5 py-2.5 sm:py-3 text-base sm:text-sm text-[#1b1c1c] placeholder-[#8f8287] focus:outline-none resize-none transition-colors"
                />
              </div>

              {/* City & Quantity Row */}
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                <div>
                  <label className="block text-[11px] sm:text-xs font-semibold text-[#1b1c1c] mb-1">
                    City / Zone
                  </label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-[#f6f4f2] border border-[#e4e0dc] focus:border-[#745663] focus:bg-white rounded-xl px-2.5 sm:px-3 py-2.5 sm:py-3 text-base sm:text-sm text-[#1b1c1c] focus:outline-none cursor-pointer"
                  >
                    <option value="Dhaka">Inside Dhaka (৳80)</option>
                    <option value="Chittagong">Chittagong (৳150)</option>
                    <option value="Sylhet">Sylhet (৳150)</option>
                    <option value="Rajshahi">Rajshahi (৳150)</option>
                    <option value="Khulna">Khulna (৳150)</option>
                    <option value="Other District">Outside Dhaka (৳150)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] sm:text-xs font-semibold text-[#1b1c1c] mb-1">
                    Quantity
                  </label>
                  <input
                    type="number"
                    min="1"
                    max={product.stock || 20}
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full bg-[#f6f4f2] border border-[#e4e0dc] focus:border-[#745663] focus:bg-white rounded-xl px-3 py-2.5 sm:py-3 text-base sm:text-sm text-[#1b1c1c] focus:outline-none font-bold text-center"
                  />
                </div>
              </div>

              {/* Special Order Notes */}
              <div>
                <label className="block text-[11px] sm:text-xs font-semibold text-[#1b1c1c] mb-1">
                  Order Notes (Optional)
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g., gift wrapping, call before delivery"
                  className="w-full bg-[#f6f4f2] border border-[#e4e0dc] focus:border-[#745663] focus:bg-white rounded-xl px-3.5 py-2 text-base sm:text-xs text-[#1b1c1c] placeholder-[#8f8287] focus:outline-none transition-colors"
                />
              </div>

              {/* Price Breakdown */}
              <div className="bg-[#fcfbfa] p-3 sm:p-3.5 rounded-2xl border border-[#ede8e4] space-y-1 text-xs text-[#53434b] mt-1">
                <div className="flex justify-between">
                  <span>Subtotal ({quantity} item{quantity > 1 ? 's' : ''}):</span>
                  <span className="font-semibold text-[#1b1c1c]">{currencySymbol}{itemTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Charge:</span>
                  <span className="font-semibold text-[#1b1c1c]">{currencySymbol}{deliveryFee}</span>
                </div>
                <div className="flex justify-between border-t border-[#ede8e4] pt-1.5 text-xs sm:text-sm font-bold text-[#1b1c1c]">
                  <span>Total Amount:</span>
                  <span className="text-[#745663] font-playfair">{currencySymbol}{grandTotal.toLocaleString()}</span>
                </div>
              </div>

              {/* Action Buttons Section */}
              <div className="mt-3 pt-3 sm:mt-4 sm:pt-4 border-t border-[#ede8e4] space-y-2">
                {/* WhatsApp Primary Button */}
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleWhatsAppOrder}
                  className={`w-full bg-[#25D366] text-white py-3 sm:py-3.5 rounded-full font-semibold text-xs sm:text-sm hover:bg-[#1EBE5A] active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer ${
                    isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
                  }`}
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Saving Order & Connecting...</span>
                    </div>
                  ) : (
                    <>
                      <svg
                        fill="currentColor"
                        height="18"
                        viewBox="0 0 16 16"
                        width="18"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z" />
                      </svg>
                      <span>Confirm via WhatsApp</span>
                    </>
                  )}
                </button>

                {/* Direct Cash on Delivery Option */}
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleCodOrder}
                  className={`w-full bg-[#745663] hover:bg-[#5c434e] text-white py-3 rounded-full font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs ${
                    isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
                  }`}
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Order with Cash on Delivery</span>
                </button>
              </div>

            </form>
          </>
        )}
      </div>
    </aside>
  );
};
