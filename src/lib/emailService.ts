import emailjs from '@emailjs/browser';

export interface EmailOrderItem {
  product_id?: string;
  productId?: string;
  product_name?: string;
  productName?: string;
  price: number;
  quantity: number;
  selected_size?: string | null;
  selectedSize?: string | null;
  image_url?: string;
  imageUrl?: string;
}

export interface SendOrderEmailPayload {
  orderId: string;
  orderDate?: string;
  customerName: string;
  phoneNumber: string;
  deliveryAddress: string;
  city: string;
  items: EmailOrderItem[];
  totalAmount: number;
  deliveryFee?: number;
  paymentMethod?: string;
  notes?: string;
}

export interface EmailJsConfig {
  serviceId: string;
  templateId: string;
  publicKey: string;
  adminEmail: string;
}

export function getEmailJsConfig(): EmailJsConfig {
  try {
    const saved = localStorage.getItem('ayesha_cotton_emailjs_config');
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        serviceId: parsed.serviceId || 'service_jcosb9b',
        templateId: parsed.templateId || 'template_lx3rxt8',
        publicKey: parsed.publicKey || 'kMGzfY2Q2abGu6Db6',
        adminEmail: parsed.adminEmail || 'abranjoy2@gmail.com',
      };
    }
  } catch (e) {
    // fallback
  }
  return {
    serviceId: ((import.meta as any).env?.VITE_EMAILJS_SERVICE_ID as string) || 'service_jcosb9b',
    templateId: ((import.meta as any).env?.VITE_EMAILJS_TEMPLATE_ID as string) || 'template_lx3rxt8',
    publicKey: ((import.meta as any).env?.VITE_EMAILJS_PUBLIC_KEY as string) || 'kMGzfY2Q2abGu6Db6',
    adminEmail: ((import.meta as any).env?.VITE_ADMIN_EMAIL as string) || 'abranjoy2@gmail.com',
  };
}

export function saveEmailJsConfig(config: Partial<EmailJsConfig>): EmailJsConfig {
  const current = getEmailJsConfig();
  const updated = { ...current, ...config };
  localStorage.setItem('ayesha_cotton_emailjs_config', JSON.stringify(updated));
  return updated;
}

export const ADMIN_EMAIL = 'abranjoy2@gmail.com';
export const EMAILJS_SERVICE_ID = 'service_jcosb9b';
export const EMAILJS_TEMPLATE_ID = 'template_lx3rxt8';
export const EMAILJS_PUBLIC_KEY = 'kMGzfY2Q2abGu6Db6';

/**
 * Builds a rich, responsive HTML email body containing:
 * - Order ID & Date/Time
 * - Customer Details (Name, Phone, Address, City)
 * - Product Details (Title, Quantity, Price) with Product Image thumbnails
 * - Total Order Amount breakdown
 */
export function generateOrderHtmlTemplate(payload: SendOrderEmailPayload): string {
  const formattedDate =
    payload.orderDate ||
    new Date().toLocaleString('en-US', {
      dateStyle: 'full',
      timeStyle: 'short',
      timeZone: 'Asia/Dhaka',
    });

  const currency = '৳';

  const itemsRows = payload.items
    .map((item) => {
      const pName = item.product_name || item.productName || 'Ayesha Cotton Dress';
      const pSize = item.selected_size || item.selectedSize;
      const fallbackImg =
        'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=200&auto=format&fit=crop&q=80';
      const imgSource = item.image_url || item.imageUrl || fallbackImg;
      const itemSubtotal = item.price * item.quantity;
      const sizeTag = pSize
        ? `<span style="display:inline-block;background:#f3edf0;color:#745663;font-size:11px;font-weight:600;padding:2px 6px;border-radius:4px;margin-top:4px;">Size: ${pSize}</span>`
        : '';

      return `
        <tr style="border-bottom:1px solid #f0e8eb;">
          <td style="padding:14px 10px 14px 0;width:70px;vertical-align:top;">
            <img src="${imgSource}" alt="${pName}" width="64" height="80" style="width:64px;height:80px;object-fit:cover;border-radius:8px;display:block;border:1px solid #ebdce3;" />
          </td>
          <td style="padding:14px 10px;vertical-align:top;">
            <div style="font-size:14px;font-weight:700;color:#1b1c1c;line-height:1.3;margin-bottom:4px;">
              ${pName}
            </div>
            ${sizeTag}
            <div style="font-size:12px;color:#745663;margin-top:6px;">
              Qty: <strong style="color:#1b1c1c;">${item.quantity}</strong> × ${currency}${item.price.toLocaleString()}
            </div>
          </td>
          <td style="padding:14px 0 14px 10px;text-align:right;vertical-align:top;font-size:14px;font-weight:700;color:#745663;white-space:nowrap;">
            ${currency}${itemSubtotal.toLocaleString()}
          </td>
        </tr>
      `;
    })
    .join('');

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Order Notification - ${payload.orderId}</title>
</head>
<body style="margin:0;padding:0;background-color:#fbf8f7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#1b1c1c;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#fbf8f7;padding:30px 15px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background-color:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #f0e6ea;box-shadow:0 4px 20px rgba(0,0,0,0.04);">
          
          <!-- Header Banner -->
          <tr>
            <td style="background-color:#745663;padding:28px 24px;text-align:center;">
              <h1 style="margin:0 0 6px 0;font-size:22px;color:#ffffff;font-family:Georgia,serif;font-weight:700;letter-spacing:0.5px;">
                Ayesha Cotton
              </h1>
              <p style="margin:0;font-size:13px;color:#fcd4e4;letter-spacing:1px;text-transform:uppercase;font-weight:500;">
                New Order Received • Instant Notification
              </p>
            </td>
          </tr>

          <!-- Order Status Bar -->
          <tr>
            <td style="background-color:#fff3f7;padding:14px 24px;border-bottom:1px solid #f5dfeb;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <span style="font-size:12px;color:#745663;text-transform:uppercase;font-weight:700;letter-spacing:0.5px;">Order Reference</span>
                    <div style="font-size:16px;font-weight:800;color:#745663;margin-top:2px;">
                      #${payload.orderId}
                    </div>
                  </td>
                  <td style="text-align:right;">
                    <span style="display:inline-block;background:#25D366;color:#ffffff;font-size:11px;font-weight:700;padding:4px 10px;border-radius:20px;text-transform:uppercase;letter-spacing:0.5px;">
                      ${payload.paymentMethod || 'Pending Confirmation'}
                    </span>
                    <div style="font-size:11px;color:#8f7b84;margin-top:4px;">${formattedDate}</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body Content -->
          <tr>
            <td style="padding:24px;">
              
              <!-- Customer Details Card -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#faf7f8;border-radius:12px;border:1px solid #ede3e7;margin-bottom:24px;">
                <tr>
                  <td style="padding:18px;">
                    <h3 style="margin:0 0 12px 0;font-size:14px;color:#745663;text-transform:uppercase;letter-spacing:0.5px;font-weight:700;border-bottom:1px dashed #e6d3dc;padding-bottom:8px;">
                      Customer Information
                    </h3>
                    <table width="100%" cellpadding="4" cellspacing="0" style="font-size:13px;line-height:1.5;">
                      <tr>
                        <td style="width:130px;color:#776c72;font-weight:600;">Full Name:</td>
                        <td style="color:#1b1c1c;font-weight:700;">${payload.customerName}</td>
                      </tr>
                      <tr>
                        <td style="color:#776c72;font-weight:600;">Phone Number:</td>
                        <td>
                          <a href="tel:${payload.phoneNumber}" style="color:#745663;font-weight:700;text-decoration:none;">
                            ${payload.phoneNumber}
                          </a>
                        </td>
                      </tr>
                      <tr>
                        <td style="color:#776c72;font-weight:600;vertical-align:top;">Delivery Address:</td>
                        <td style="color:#1b1c1c;font-weight:500;">${payload.deliveryAddress}</td>
                      </tr>
                      <tr>
                        <td style="color:#776c72;font-weight:600;">City / Region:</td>
                        <td style="color:#1b1c1c;font-weight:700;">${payload.city}</td>
                      </tr>
                      ${
                        payload.notes
                          ? `<tr>
                              <td style="color:#776c72;font-weight:600;vertical-align:top;">Customer Notes:</td>
                              <td style="color:#a83232;font-style:italic;">${payload.notes}</td>
                            </tr>`
                          : ''
                      }
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Product Details Header -->
              <h3 style="margin:0 0 12px 0;font-size:14px;color:#745663;text-transform:uppercase;letter-spacing:0.5px;font-weight:700;">
                Ordered Products (${payload.items.length} ${payload.items.length === 1 ? 'item' : 'items'})
              </h3>

              <!-- Product Items Table with Thumbnails -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;border-collapse:collapse;">
                <thead>
                  <tr style="border-bottom:2px solid #e8d8e0;font-size:11px;text-transform:uppercase;color:#8f7b84;letter-spacing:0.5px;">
                    <th align="left" colspan="2" style="padding-bottom:8px;">Product</th>
                    <th align="right" style="padding-bottom:8px;">Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsRows}
                </tbody>
              </table>

              <!-- Financial Summary Table -->
              <table width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #f0e6ea;padding-top:14px;">
                <tr>
                  <td align="right" style="padding:4px 0;font-size:13px;color:#776c72;">Total Order Amount:</td>
                  <td align="right" style="padding:4px 0 4px 16px;width:120px;font-size:18px;font-weight:800;color:#745663;">
                    ${currency}${payload.totalAmount.toLocaleString()}
                  </td>
                </tr>
              </table>

              <!-- Direct Call to Customer Button -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:24px;">
                <tr>
                  <td align="center">
                    <a href="https://wa.me/${payload.phoneNumber.replace(/[^0-9]/g, '')}" target="_blank" style="display:inline-block;background-color:#25D366;color:#ffffff;font-size:13px;font-weight:700;padding:12px 26px;border-radius:24px;text-decoration:none;box-shadow:0 2px 8px rgba(37,211,102,0.3);">
                      Chat Customer on WhatsApp (${payload.phoneNumber})
                    </a>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#faf6f8;padding:18px 24px;text-align:center;border-top:1px solid #ede3e7;font-size:11px;color:#9b8a92;">
              This is an automated notification from <strong>Ayesha Cotton Online Store</strong> sent to <strong>${ADMIN_EMAIL}</strong>.
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

// Initialize EmailJS immediately with Public Key
if (EMAILJS_PUBLIC_KEY) {
  try {
    emailjs.init({
      publicKey: EMAILJS_PUBLIC_KEY,
    });
  } catch (e) {
    console.warn('[EmailService] EmailJS init warning:', e);
  }
}

/**
 * Dispatches an order email notification to the store administrator.
 * Uses EmailJS SDK with fallback to direct HTTP REST endpoint.
 */
export async function sendOrderNotificationEmail(
  payload: SendOrderEmailPayload
): Promise<{ success: boolean; error?: any; details?: string }> {
  const config = getEmailJsConfig();
  const htmlContent = generateOrderHtmlTemplate(payload);

  const formattedItemsSummary = payload.items
    .map((item) => {
      const pName = item.product_name || item.productName || 'Dress Item';
      const pSize = item.selected_size || item.selectedSize;
      return `• ${pName} (Qty: ${item.quantity}${
        pSize ? `, Size: ${pSize}` : ''
      }) - ৳${(item.price * item.quantity).toLocaleString()}`;
    })
    .join('\n');

  const templateParams: Record<string, any> = {
    to_email: config.adminEmail,
    email: config.adminEmail,
    admin_email: config.adminEmail,
    recipient: config.adminEmail,
    to_name: 'Ayesha Cotton Admin',
    from_name: payload.customerName || 'Ayesha Cotton Customer',
    reply_to: config.adminEmail,
    order_id: payload.orderId,
    orderNumber: payload.orderId,
    order_date:
      payload.orderDate ||
      new Date().toLocaleString('en-US', {
        dateStyle: 'full',
        timeStyle: 'short',
        timeZone: 'Asia/Dhaka',
      }),
    customer_name: payload.customerName,
    customerName: payload.customerName,
    customer_phone: payload.phoneNumber,
    phone: payload.phoneNumber,
    phoneNumber: payload.phoneNumber,
    customer_address: payload.deliveryAddress,
    address: payload.deliveryAddress,
    deliveryAddress: payload.deliveryAddress,
    customer_city: payload.city,
    city: payload.city,
    customer_notes: payload.notes || 'None',
    notes: payload.notes || 'None',
    total_amount: `৳${payload.totalAmount.toLocaleString()}`,
    total_price: `৳${payload.totalAmount.toLocaleString()}`,
    totalPrice: `৳${payload.totalAmount.toLocaleString()}`,
    order_items_text: formattedItemsSummary,
    order_items: formattedItemsSummary,
    order_items_html: htmlContent,
    message_html: htmlContent,
    message: htmlContent,
    payment_method: payload.paymentMethod || 'WhatsApp Order',
    paymentMethod: payload.paymentMethod || 'WhatsApp Order',
  };

  // Candidate templates to try in order (ensuring all user-verified templates are checked)
  const templatesToTry = Array.from(
    new Set([config.templateId, 'template_lx3rxt8', 'template_x6ct4rc', 'qtul72q', 'template_qtul72q'].filter(Boolean))
  );

  console.log('[EmailService] Dispatching order email to admin:', {
    serviceId: config.serviceId,
    templatesToTry,
    publicKey: config.publicKey,
    adminEmail: config.adminEmail,
    orderId: payload.orderId,
  });

  let lastErrorDetails = '';

  for (const tid of templatesToTry) {
    // Attempt 1: EmailJS SDK
    try {
      const response = await emailjs.send(config.serviceId, tid, templateParams, {
        publicKey: config.publicKey,
      });
      console.log(`[EmailService] EmailJS dispatch SUCCESS (template: ${tid}):`, response.status, response.text);
      return { success: true, details: `Dispatched via template "${tid}" (Status ${response.status})` };
    } catch (sdkErr: any) {
      console.warn(`[EmailService] SDK dispatch failed with template "${tid}":`, sdkErr?.text || sdkErr?.message);
      lastErrorDetails = sdkErr?.text || sdkErr?.message || String(sdkErr);
    }

    // Attempt 2: Direct REST fallback with current candidate template
    try {
      const directRes = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service_id: config.serviceId,
          template_id: tid,
          user_id: config.publicKey,
          template_params: templateParams,
        }),
      });
      const directText = await directRes.text();
      if (directRes.ok) {
        console.log(`[EmailService] Direct REST fallback SUCCESS (template: ${tid}):`, directText);
        return { success: true, details: `Direct REST success with template "${tid}"` };
      } else {
        lastErrorDetails = `REST error: ${directText} (${directRes.status})`;
      }
    } catch (restErr: any) {
      lastErrorDetails = `Network error: ${restErr?.message}`;
    }
  }

  return {
    success: false,
    error: lastErrorDetails,
    details: `Failed to dispatch. Error: ${lastErrorDetails}. Check EmailJS Dashboard > Email Templates.`,
  };
}
