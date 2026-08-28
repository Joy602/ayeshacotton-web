import React, { useState, useEffect } from 'react';
import { CartItem, Order, StoreSettings, CustomerUser } from '../types';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, User } from 'lucide-react';
import confetti from 'canvas-confetti';
import { OptimizedImage } from './common/OptimizedImage';
import { insertOrderToSupabase } from '../lib/supabase';
import { sendOrderNotificationEmail } from '../lib/emailService';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  currencySymbol: string;
  settings: StoreSettings;
  onOrderPlaced: (order: Order) => void;
  currentUser: CustomerUser | null;
  onRequireAuth: (purposeMessage?: string) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  currencySymbol,
  settings,
  onOrderPlaced,
  currentUser,
  onRequireAuth,
}) => {
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Dhaka');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Prefill details from logged in customer
  useEffect(() => {
    if (currentUser) {
      if (currentUser.name) setCustomerName(currentUser.name);
      if (currentUser.phoneNumber) setPhone(currentUser.phoneNumber);
      if (currentUser.address) setAddress(currentUser.address);
      if (currentUser.city) setCity(currentUser.city);
    }
  }, [currentUser, isOpen]);

  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const deliveryCharge = items.length > 0 ? (city.toLowerCase().includes('dhaka') ? 80 : 150) : 0;
  const isFreeDelivery = subtotal >= settings.freeShippingThreshold;
  const finalDelivery = isFreeDelivery ? 0 : deliveryCharge;
  const grandTotal = subtotal + finalDelivery;

  const handleCheckoutViaWhatsApp = async () => {
    if (!currentUser) {
      onRequireAuth('Please sign in or register with your phone number before submitting your order.');
      return;
    }

    if (!customerName.trim() || !phone.trim() || !address.trim()) {
      setErrorMessage('Please fill in your name, phone number, and delivery address.');
      return;
    }

    setErrorMessage('');
    setIsSubmitting(true);

    const orderNumber = `AC-ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    const itemsList = items
      .map(
        (i, idx) =>
          `${idx + 1}. *${i.product.name}* (x${i.quantity}) ${i.selectedSize ? `[Size: ${i.selectedSize}]` : ''} - ${currencySymbol}${(i.product.price * i.quantity).toLocaleString()}`
      )
      .join('\n');

    const message = `🌸 *New Multi-Item Order Inquiry - Ayesha Cotton* 🌸
--------------------------------
*Order Ref:* ${orderNumber}
*Items:*
${itemsList}

*Subtotal:* ${currencySymbol}${subtotal.toLocaleString()}
*Delivery Charge (${city}):* ${isFreeDelivery ? 'FREE' : `${currencySymbol}${finalDelivery}`}
*Total Payable:* ${currencySymbol}${grandTotal.toLocaleString()}

*Customer Details:*
• Name: ${customerName.trim()}
• Phone: ${phone.trim()}
• Delivery Address: ${address.trim()}
• City: ${city}

Please confirm order placement. Thank you!`;

    const emailPayload = {
      orderId: orderNumber,
      customerName: customerName.trim(),
      phoneNumber: phone.trim(),
      deliveryAddress: `${address.trim()}, ${city}`,
      city,
      items: items.map((i) => ({
        product_id: i.product.id,
        productId: i.product.id,
        product_name: i.product.name,
        productName: i.product.name,
        price: i.product.price,
        quantity: i.quantity,
        selected_size: i.selectedSize || null,
        selectedSize: i.selectedSize || null,
        image_url: i.product.imageUrl,
        imageUrl: i.product.imageUrl,
      })),
      totalAmount: grandTotal,
      deliveryFee: finalDelivery,
      paymentMethod: 'WhatsApp Order',
    };

    // 1. Dispatch Instant Email Notification to Admin (abranjoy2@gmail.com)
    try {
      const emailResult = await sendOrderNotificationEmail(emailPayload);
      console.log('[CartDrawer] Email notification result:', emailResult);
    } catch (emailErr) {
      console.warn('[CartDrawer] Email notification error:', emailErr);
    }

    // 2. Insert into Supabase safely
    try {
      await insertOrderToSupabase({
        customerName: customerName.trim(),
        phoneNumber: phone.trim(),
        deliveryAddress: `${address.trim()}, ${city}`,
        city,
        items: items.map((i) => ({
          productId: i.product.id,
          productName: i.product.name,
          price: i.product.price,
          quantity: i.quantity,
          selectedSize: i.selectedSize,
          imageUrl: i.product.imageUrl,
        })),
        totalPrice: grandTotal,
        orderNumber,
        paymentMethod: 'WhatsApp Order',
      });
    } catch (dbErr) {
      console.warn('Supabase Cart non-blocking sync note:', dbErr);
    }

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber,
      customerName: customerName.trim(),
      phoneNumber: phone.trim(),
      deliveryAddress: `${address.trim()}, ${city}`,
      city,
      items: items.map((i) => ({
        productId: i.product.id,
        productName: i.product.name,
        price: i.product.price,
        quantity: i.quantity,
        selectedSize: i.selectedSize,
        imageUrl: i.product.imageUrl,
      })),
      totalAmount: grandTotal,
      status: 'Pending',
      paymentMethod: 'WhatsApp Order',
      createdAt: new Date().toISOString(),
    };

    onOrderPlaced(newOrder);
    onClearCart();

    try {
      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#fcd4e4', '#745663', '#25D366', '#fed65b'],
      });
    } catch (e) {}

    // 3. Construct WhatsApp URL and open it
    let cleanNumber = (settings.whatsappNumber || '01783769261').replace(/[^0-9]/g, '');
    if (cleanNumber.startsWith('01')) {
      cleanNumber = '88' + cleanNumber;
    } else if (cleanNumber.length === 10 && cleanNumber.startsWith('1')) {
      cleanNumber = '880' + cleanNumber;
    }
    window.open(`https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`, '_blank');
    setIsSubmitting(false);
    setIsSuccess(true);
  };

  return (
    <aside role="dialog" aria-modal="true" aria-label="Shopping Bag Drawer">
      <div onClick={onClose} className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 transition-opacity" />

      <div className="fixed top-0 right-0 h-[100dvh] sm:h-full w-full max-w-full sm:max-w-md bg-white text-[#1b1c1c] border-l border-[#ede8e4] shadow-2xl z-50 flex flex-col p-4 sm:p-6 overflow-y-auto animate-in slide-in-from-right duration-300">
        <div className="flex justify-between items-center mb-4 sm:mb-6 shrink-0">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 text-[#745663]" />
            <h2 className="font-playfair text-xl sm:text-2xl font-bold text-[#1b1c1c]">
              Shopping Bag ({items.reduce((s, i) => s + i.quantity, 0)})
            </h2>
          </div>
          <button onClick={onClose} aria-label="Close cart" className="p-2 rounded-full hover:bg-[#f6f4f2] text-[#53434b] hover:text-[#1b1c1c] transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccess ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-emerald-50 border border-emerald-200 text-emerald-600 rounded-full flex items-center justify-center mb-3 sm:mb-4 text-xl sm:text-2xl font-bold shadow-xs">
              ✓
            </div>
            <h3 className="font-playfair text-xl sm:text-2xl font-bold text-[#1b1c1c] mb-2">Order Confirmed!</h3>
            <p className="text-xs sm:text-sm text-[#53434b] mb-6">
              Your bag items have been placed and sent to our customer care team via WhatsApp.
            </p>
            <button
              onClick={() => {
                setIsSuccess(false);
                setIsCheckingOut(false);
                onClose();
              }}
              className="w-full bg-[#745663] hover:bg-[#5c434e] text-white py-3 sm:py-3.5 rounded-full font-semibold text-xs sm:text-sm transition-colors cursor-pointer shadow-xs"
            >
              Continue Shopping
            </button>
          </div>
        ) : items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
            <ShoppingBag className="w-14 h-14 sm:w-16 sm:h-16 text-[#c5bcbf] mb-3 stroke-[1.5]" />
            <h3 className="font-playfair text-lg sm:text-xl font-bold text-[#1b1c1c] mb-1">Your bag is empty</h3>
            <p className="text-xs text-[#53434b] mb-6">Explore our luxury lawn &amp; silk collections and add your favorite pieces.</p>
            <button
              onClick={onClose}
              className="px-6 py-2.5 sm:py-3 rounded-full bg-[#745663] hover:bg-[#5c434e] text-white text-xs font-semibold tracking-wide transition-colors cursor-pointer shadow-xs"
            >
              Start Shopping
            </button>
          </div>
        ) : !isCheckingOut ? (
          <div className="flex-1 flex flex-col justify-between">
            {/* Items List */}
            <div className="space-y-3 divide-y divide-[#ede8e4] overflow-y-auto max-h-[50vh] sm:max-h-[55vh] pr-1">
              {items.map((item) => (
                <div key={item.product.id} className="pt-3 first:pt-0 flex gap-2.5 sm:gap-3 items-center">
                  <div className="w-14 h-18 sm:w-16 sm:h-20 bg-[#f2eeeb] rounded-xl overflow-hidden shrink-0 border border-[#ede8e4]">
                    <OptimizedImage
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      aspectRatio="h-full w-full"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-playfair font-bold text-xs sm:text-sm text-[#1b1c1c] truncate">
                      {item.product.name}
                    </p>
                    <p className="text-[11px] sm:text-xs text-[#8f8287]">
                      {item.product.category} {item.selectedSize ? `• Size: ${item.selectedSize}` : ''}
                    </p>
                    <p className="text-xs font-bold text-[#745663] mt-0.5 font-playfair">
                      {currencySymbol}{item.product.price.toLocaleString()}
                    </p>

                    {/* Quantity controls */}
                    <div className="flex items-center gap-2 mt-1.5 sm:mt-2">
                      <div className="flex items-center border border-[#e4e0dc] rounded-full bg-[#f6f4f2]">
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, -1)}
                          className="p-1 text-[#53434b] hover:text-[#1b1c1c] cursor-pointer"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-bold text-[#1b1c1c]">{item.quantity}</span>
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, 1)}
                          className="p-1 text-[#53434b] hover:text-[#1b1c1c] cursor-pointer"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => onRemoveItem(item.product.id)}
                        className="p-1 text-[#8f8287] hover:text-rose-600 transition-colors ml-auto cursor-pointer"
                        title="Remove"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Summary */}
            <div className="pt-3 sm:pt-4 border-t border-[#ede8e4] space-y-2.5 sm:space-y-3 mt-3 sm:mt-4">
              <div className="space-y-1 sm:space-y-1.5 text-xs text-[#53434b]">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-semibold text-[#1b1c1c]">{currencySymbol}{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping:</span>
                  <span className="font-semibold text-[#1b1c1c]">
                    {isFreeDelivery ? 'Free' : `Calculated at checkout`}
                  </span>
                </div>
                <div className="flex justify-between border-t border-[#ede8e4] pt-1.5 text-xs sm:text-sm font-bold text-[#1b1c1c]">
                  <span>Total:</span>
                  <span className="text-[#745663] font-playfair">{currencySymbol}{subtotal.toLocaleString()}</span>
                </div>
              </div>

              <button
                onClick={() => {
                  if (!currentUser) {
                    onRequireAuth('Please sign in or create an account with your phone number to proceed with checkout.');
                    return;
                  }
                  setIsCheckingOut(true);
                }}
                className="w-full bg-[#745663] hover:bg-[#5c434e] text-white py-3 sm:py-3.5 rounded-full font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer shadow-xs transition-colors"
              >
                Proceed to Checkout
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          /* Multi-item Checkout Form */
          <div className="flex-1 flex flex-col justify-between">
            <div className="space-y-2.5 sm:space-y-3">
              <button
                onClick={() => setIsCheckingOut(false)}
                className="text-xs font-semibold text-[#745663] hover:text-[#5c434e] underline cursor-pointer mb-1 sm:mb-2"
              >
                ← Back to bag
              </button>

              {/* Customer Account Indicator */}
              {currentUser && (
                <div className="p-2.5 bg-[#fdebf3] border border-[#fcd4e4] rounded-xl flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-[#1b1c1c]">{currentUser.name}</span>
                    <span className="text-[#53434b] text-[11px] ml-1.5 font-mono">({currentUser.phoneNumber})</span>
                  </div>
                  <span className="text-[10px] font-bold text-[#745663] bg-white px-2 py-0.5 rounded-full">
                    Verified
                  </span>
                </div>
              )}

              {errorMessage && (
                <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-semibold">
                  {errorMessage}
                </div>
              )}

              <div>
                <label className="block text-[11px] sm:text-xs font-semibold text-[#1b1c1c] mb-1">Full Name</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Your full name"
                  className="w-full bg-[#f6f4f2] border border-[#e4e0dc] focus:border-[#745663] focus:bg-white rounded-xl px-3.5 py-2.5 text-base sm:text-sm text-[#1b1c1c] placeholder-[#8f8287] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] sm:text-xs font-semibold text-[#1b1c1c] mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="017XXXXXXXX"
                  className="w-full bg-[#f6f4f2] border border-[#e4e0dc] focus:border-[#745663] focus:bg-white rounded-xl px-3.5 py-2.5 text-base sm:text-sm text-[#1b1c1c] placeholder-[#8f8287] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] sm:text-xs font-semibold text-[#1b1c1c] mb-1">Delivery Address</label>
                <textarea
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Street address, apartment, etc."
                  className="w-full bg-[#f6f4f2] border border-[#e4e0dc] focus:border-[#745663] focus:bg-white rounded-xl px-3.5 py-2.5 text-base sm:text-sm text-[#1b1c1c] placeholder-[#8f8287] focus:outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-[11px] sm:text-xs font-semibold text-[#1b1c1c] mb-1">City / Region</label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-[#f6f4f2] border border-[#e4e0dc] focus:border-[#745663] focus:bg-white rounded-xl px-3 py-2.5 text-base sm:text-sm text-[#1b1c1c] focus:outline-none cursor-pointer"
                >
                  <option value="Dhaka">Inside Dhaka (৳80)</option>
                  <option value="Outside Dhaka">Outside Dhaka (৳150)</option>
                </select>
              </div>

              <div className="bg-[#fcfbfa] p-3 rounded-2xl border border-[#ede8e4] text-xs space-y-1 mt-2">
                <div className="flex justify-between">
                  <span className="text-[#53434b]">Grand Total:</span>
                  <span className="font-bold text-xs sm:text-sm text-[#745663] font-playfair">{currencySymbol}{grandTotal.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <button
              disabled={isSubmitting}
              onClick={handleCheckoutViaWhatsApp}
              className={`w-full mt-4 bg-[#25D366] text-white py-3 sm:py-3.5 rounded-full font-bold text-xs sm:text-sm hover:bg-[#1EBE5A] flex items-center justify-center gap-2 shadow-sm cursor-pointer transition-all ${
                isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Saving Order & Connecting...</span>
                </div>
              ) : (
                <span>Confirm Bag via WhatsApp</span>
              )}
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};
