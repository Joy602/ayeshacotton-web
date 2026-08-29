import { Product, Order, Customer, StoreSettings } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  // Products featured in Main Product Listing
  {
    id: 'prod-1',
    name: 'Luxury Floral Lawn',
    sku: 'AC-US-104',
    category: 'Unstitched',
    price: 3500,
    originalPrice: 4200,
    stock: 34,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCCmV9SmkXqabgR7GlMAK09fV4FfxUkN2i3y7fki8sH_dONF1py1CBRZebxIP7NX5pxPFBhmjFL7ij3HdrIrWhnKLdjCFjM9FSQhpnXS1WrTIWimqjGC6_8nnNDu3wN7gjma55KGfmynU0lVlma4y4dNgb_RSoH7k_AQNXfFg5z0sHCbU_4-rPGOfJjHFF2QC60bdxmcejuL-DtfOLY73qYtGQMu7Ths1fGWvhRpZ-oHxD1mgoLn0vy',
    badge: 'Unstitched',
    description: 'Unstitched luxury floral lawn fabric laid out beautifully, featuring intricate embroidery details in cream and rose tones on a soft pink background. High-quality textile craftsmanship with digital printed silk dupatta.',
    fabricDetails: '100% Pure Combed Lawn Shirt (3.0m), Digital Silk Dupatta (2.5m), Dyed Cotton Trouser (2.5m)',
    pieces: '3-Piece (Shirt, Trouser, Dupatta)',
    color: 'Blush Pink & Rose',
    isLatest: false
  },
  {
    id: 'prod-2',
    name: 'Royal Silk Suite',
    sku: 'AC-ST-004',
    category: 'Stitched',
    price: 5800,
    originalPrice: 6500,
    stock: 18,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuATjAkjVMInFUEyI9QyVEZMQgVnjmXIX2EIp19X6Uk8c0hYi8-_G_YKVRMwEnIUtoRGdFdEiqJust53kPtORLP50LlXXjpJ4HkjNxb8FtDkwssqezrJNI7w6qykJ0SZJQuZt-rShUSS62LP5amsb9O07fPfne80Dzyjc_FjxrCEapShsP_fcX2CB4KA5ytkAWcAbnIruCbWr6R2pond2Nuna0jyaCRGv5rpYCh5kQ6QeSLLJwh_uV98',
    badge: 'Stitched',
    description: 'A luxurious royal blue silk 3-piece tailored suit detailed with gold zari work and tilla embroidery. Includes tailored straight trousers and an embellished organza dupatta.',
    fabricDetails: 'Pure Raw Silk Kurti with Gold Zari Embellishment, Silk Straight Trouser, Organza Dupatta',
    pieces: '3-Piece Ready to Wear',
    color: 'Royal Blue & Antique Gold',
    sizes: ['S', 'M', 'L', 'XL'],
    isLatest: false
  },
  {
    id: 'prod-3',
    name: 'Midnight Velvet',
    sku: 'AC-ST-005',
    category: 'Stitched',
    price: 7200,
    originalPrice: 8500,
    stock: 8,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBAp8wkXF1fjq7Ny1jhnCQYmvwSC5DVY25d4ggH6RF4W9VzGhNCj4VtvvoXyj8XW3AAjzchzM08kQGzQ0p_jQzZfgKHV1oZ2OJhS7Fji5oAsOGn4vuARhKzuqI7HJto9noaH-3ofvITiBAMweAj4PvywZWxycaPok4sHrcOlB-2AzBwfwBE7Duz92kWDCWlBmuGpI3UUczldzlroTTCNNuYVNSleP3imnOdSesk7Rf_EPILhCY--N-L',
    badge: 'Stitched',
    description: 'A sophisticated deep midnight blue velvet stitched outfit draped elegantly. Detailed with intricate beadwork, zardozi embroidery, and rich royal velvet texture for festive and wedding evenings.',
    fabricDetails: '9000 Micro Velvet Shirt with Hand-embellished Neckline, Raw Silk Trouser, Net Embroidered Dupatta',
    pieces: '3-Piece Ready to Wear',
    color: 'Midnight Blue & Antique Gold',
    sizes: ['S', 'M', 'L', 'XL'],
    isLatest: false
  },
  {
    id: 'prod-4',
    name: 'Pastel Dream Lawn',
    sku: 'AC-US-105',
    category: 'Unstitched',
    price: 3200,
    originalPrice: 3800,
    stock: 22,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCM0eMakQUXGa1Mru-izviG2s1qNnr1Fxd8deiZEPR2UVAYD0eKCwoS_ZT_kAgsgkRmrYsY9h5JQ8mN78TyMwtsnbAI4RqcxBHfX6chHqqZ1Jic1zaj6dIMed7VOjTM8XxxT_LIGTIInCnMyOQ2ihetYgrQlS8Kj3IzUlS5j_jXXD99fN-C0AKb0ozIErcGWzVXRCMnWVfCgpLUW3XIt_yaHVCqo0i3GbCwvzh__eDGbPbmT-OsoB52',
    badge: 'Unstitched',
    description: 'Light pastel mint and lavender unstitched lawn fabric pieces folded neatly. Delicate floral prints visible on the ultra-soft premium cotton material. Fresh, breezy, and timeless.',
    fabricDetails: 'Luxury Digital Printed Lawn Shirt (3.0m), Chiffon Dupatta (2.5m), Dyed Trouser (2.5m)',
    pieces: '3-Piece (Shirt, Trouser, Dupatta)',
    color: 'Mint Green & Soft Lavender',
    isLatest: false
  },

  // Latest Products / New Arrivals (as in Image 6 / HTML)
  {
    id: 'prod-5',
    name: 'Emerald Silk Unstitched',
    sku: 'AC-US-106',
    category: 'Unstitched',
    price: 4200,
    originalPrice: 4800,
    stock: 15,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBgh48wnyqBr7uZlW0v7NczDoMI3ONX4bpczDwvAL8s37OXVWMXjl9eV-7qcQDDQvkbt6mOyCV6SkuK40T6K3MPKbnTRKZG17TDM2bSAa3j_vYiGrbHT-1MrzUG7etjMQOECUk9sl623SXPkQjuspI_hK6R99t41w2eh2Z13SrVEjmaFH5bMQSgS6rwTv2IM49T8cqDcS2Cr2cG83Jl3Ma_Kqc0iE89Sc7NjRjxdn3-Yhz3sQRzLv3g',
    badge: 'New Arrival',
    description: 'Elegant emerald green unstitched silk fabric featuring intricate gold zari and thread embroidery detailing. Premium quality fabric draped softly with embroidered motifs.',
    fabricDetails: 'Embroidered Silk Shirt (3.0m), Embroidered Organza Borders, Dyed Raw Silk Trouser, Chiffon Dupatta',
    pieces: '3-Piece Unstitched',
    color: 'Emerald Green & Gold',
    isLatest: true
  },
  {
    id: 'prod-6',
    name: 'Ruby Chiffon Glamour',
    sku: 'AC-ST-006',
    category: 'Stitched',
    price: 6500,
    originalPrice: 7500,
    stock: 10,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCao5Cv0pZQkDC2yxjrwixIYRNbaEMW3vuRJ_ozyaNX6V9WJAlyr6zBmUcjcPC1JsD9VPmeqY2BUeiV3lk78KqVCLyNT5oxPSgYFKEBODx9VT2vuRQsaHOKHGXSTE0Lk1c7m2Hka--menlBWdqcqlb9zIzvZeMedt8eZxn6Tz9mOMSFVqCJBbl1RoCdcjyufLYlHcfbH9DF1ub7qevafygUlid__pW1B9-scUZL7eX0NNXF3StGjN80',
    badge: 'Stitched',
    description: 'A striking ruby red stitched chiffon 3-piece suit beautifully displayed on a vintage dress form. Detailed silver sequin work and cutwork border edges catch the ambient light.',
    fabricDetails: 'Pure Chiffon Embroidered Shirt with Inner Slip, Chiffon Dupatta with 4-side Lace, Silk Trouser',
    pieces: '3-Piece Ready to Wear',
    color: 'Ruby Red & Silver',
    sizes: ['S', 'M', 'L', 'XL'],
    isLatest: true
  },
  {
    id: 'prod-7',
    name: 'Lavender Pearl Organza',
    sku: 'AC-US-107',
    category: 'Unstitched',
    price: 4800,
    originalPrice: 5600,
    stock: 19,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDS71ugZLpvHmVVr3_ru1dXnnDAoXTEyQLBfanRZsHbdLr8r1TDRRlHMaTlFxlyVZm1l_3UI5xn12g312Evku17VQ6nkpOywi4RDGxHRat-kn34thUXTQiDKEKDe9ohi_WZLSy6LYd737R63dey8XxX6IKuHmW86AH_V6qT9G3ne7-mDq1h6_F9lfrIh2F7sLxdlifYHhYDPghspZ7PFyZTu18DzJIvjqj7Y2Bc-nlQ1oBuwTSFkFnS',
    badge: 'Unstitched',
    description: 'Soft lavender colored premium unstitched organza fabric with delicate silver thread work and scattered pearls. Airy aesthetic with ethereal elegance.',
    fabricDetails: 'Embroidered Organza Front & Back (3.0m), Pearl Work Neckline Patch, Grip Silk Trouser, Organza Dupatta',
    pieces: '3-Piece Unstitched',
    color: 'Lavender Mist & Silver',
    isLatest: true
  },
  {
    id: 'prod-8',
    name: 'Regal Black Velvet',
    sku: 'AC-ST-007',
    category: 'Stitched',
    price: 8000,
    originalPrice: 9200,
    stock: 6,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDLo3alSHMHEfbC2N6HVNY78ndlv-iPtORH5Vr1Edw4auD4oSQ4S1eyJYgo14V1EoPqsQu8EiEHCqATIx8-yMaA2aeR-07m16-ewbgemruDtqs1-Q4PV5Wxb37Wxtp8sl7-bDDtafa4e7yGJSQhOjTXLKocSY51VW0XeNBkUBUT15TPGkiE33giueEMgn1XoHqXVvGbRj2V_JT_Rw991rzCQE-eHSpMXsDvfC_1pqqVxmNbcqh3RoxN',
    badge: 'Stitched',
    description: 'A classic black velvet stitched suit with heavy gold antique zari and zardosi work around the neckline. Regal, majestic, and tailor-fit to perfection.',
    fabricDetails: 'Plush Velvet Shirt with Resham & Zari Work, Heavy Embroidered Velvet Shawl/Dupatta, Velvet Trouser',
    pieces: '3-Piece Ready to Wear',
    color: 'Pitch Black & Rich Gold',
    sizes: ['S', 'M', 'L', 'XL'],
    isLatest: true
  },

  // Admin Dashboard Catalog Items
  {
    id: 'prod-9',
    name: 'Roseate Blossom Kurta',
    sku: 'AC-ST-001',
    category: 'Stitched',
    price: 4500,
    originalPrice: 5000,
    stock: 45,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCMLZtNdUUoSU7JTEM-EmMCgguj7wdXSeqyMBPTrE9LmqbhCw8uS9l_Jx2pg3ZYuxxepO7wprAxQgAULjOoQs8wAVmCEduzKhj3WXCvIKmcXZdw4g51bxOfvnY_M6pv3psyRBNMIkUjPIb0rapV4An6AWwPGHHd3c4U9abGd-tXC5elp-m79wvNQ60QE9eSB8XZAJtAbJ6V28wH4PW5aEt9qA61rJ66wbp_Ty9A5boR17bv1k-yaEw8',
    badge: 'Stitched',
    description: 'A close up studio shot of a beautiful, intricate embroidered stitched cotton dress in soft pastel pink, folded neatly. Professional luxury tailoring.',
    fabricDetails: 'Pure Jacquard Cotton Kurti with Organza Border, Embroidered Cigarette Pants',
    pieces: '2-Piece Stitched',
    color: 'Dusty Rose & Powder Pink',
    sizes: ['S', 'M', 'L', 'XL'],
    isLatest: false
  },
  {
    id: 'prod-10',
    name: 'Midnight Gold Lawn 3-Piece',
    sku: 'AC-US-102',
    category: 'Unstitched',
    price: 6200,
    originalPrice: 7000,
    stock: 12,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAOkbtBcsUeYOsEeegLnOmBxN_hSii6dOE6R06LB0DP6n9l1lxLRtSMLvUmd2wJvs43i7INx8NPUWnQieZDyC58aKlOAUDaRazSZOs3iEPNiqYgM_UkCSHCQyknbDnUVCD-tNSNVoBT8-0L2Slz8a4V5ByRzuuiHJqXjjrliHh65-ug0o5qM5YW7kW0e9cLJ49cNIrkwcCqQQKJSlo8ta0C12cpDR8g8pUPMRyP1g85ROxFzO5pPAHc',
    badge: 'Unstitched',
    description: 'Unstitched premium lawn cotton fabric in deep charcoal with delicate gold embroidery patterns, laid flat with opulent metallic thread sheen.',
    fabricDetails: 'Jacquard Lawn Shirt (3m), Embroidered Net Dupatta (2.5m), Cambric Trouser (2.5m)',
    pieces: '3-Piece Unstitched',
    color: 'Charcoal Black & Gold',
    isLatest: false
  },
  {
    id: 'prod-11',
    name: 'Mint Meadow Frock (Ages 4-6)',
    sku: 'AC-KD-045',
    category: 'Kids',
    price: 2800,
    originalPrice: 3200,
    stock: 2,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAucesUHR5r02hbvJuqEdJXu6Uyt5XF6gs_c0LYrezkQtLBfaYiFoiTzvuIVk0hur0mItRvClQ7L8_OFwmAd6Q75ZSbT71V-eWHu5X47sAF21CE1vN9nGjpLoNUwc70kA5Zp3pQopIjJUZgzcxXF3tc3HhDAh56CqGJ99QpqhSc2wwH8L7JqdIXaHBS_I5R6p3r-9d-NMYkp-uL3HQ4cMBxaO1mXWIY_EuCkHAoXQuiTcVy13n-7q0_',
    badge: 'Kids',
    description: 'A cute children\'s cotton frock in bright mint green with small floral prints, soft ruffled sleeve caps, and comfortable hypoallergenic lining.',
    fabricDetails: '100% Breathable Soft Cotton with Voile Lining',
    pieces: '1-Piece Frock with Matching Hairband',
    color: 'Mint Green & Floral Yellow',
    sizes: ['Age 2-3', 'Age 4-5', 'Age 6-7'],
    isLatest: false
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-1',
    orderNumber: 'AC-ORD-8942',
    customerName: 'Samira Khan',
    phoneNumber: '+880 1712-345678',
    deliveryAddress: 'House 42, Road 11, Block D, Banani',
    city: 'Dhaka',
    items: [
      {
        productId: 'prod-1',
        productName: 'Luxury Floral Lawn',
        price: 3500,
        quantity: 1,
        imageUrl: INITIAL_PRODUCTS[0].imageUrl
      }
    ],
    totalAmount: 3500,
    status: 'Processing',
    paymentMethod: 'WhatsApp Order',
    createdAt: '2026-08-25T14:22:00Z',
    notes: 'Please ensure contactless delivery.'
  },
  {
    id: 'ord-2',
    orderNumber: 'AC-ORD-8941',
    customerName: 'Nusrat Jahan',
    phoneNumber: '+880 1819-876543',
    deliveryAddress: 'Apt 5B, Gulshan Lake View, Gulshan 2',
    city: 'Dhaka',
    items: [
      {
        productId: 'prod-2',
        productName: 'Royal Silk Suite',
        price: 5800,
        quantity: 1,
        selectedSize: 'M',
        imageUrl: INITIAL_PRODUCTS[1].imageUrl
      }
    ],
    totalAmount: 5800,
    status: 'Delivered',
    paymentMethod: 'Cash on Delivery',
    createdAt: '2026-08-24T10:15:00Z'
  },
  {
    id: 'ord-3',
    orderNumber: 'AC-ORD-8940',
    customerName: 'Farhana Rahman',
    phoneNumber: '+880 1911-223344',
    deliveryAddress: 'Sector 7, Road 14, Uttara',
    city: 'Dhaka',
    items: [
      {
        productId: 'prod-3',
        productName: 'Midnight Velvet',
        price: 7200,
        quantity: 1,
        selectedSize: 'L',
        imageUrl: INITIAL_PRODUCTS[2].imageUrl
      }
    ],
    totalAmount: 7200,
    status: 'Shipped',
    paymentMethod: 'WhatsApp Order',
    createdAt: '2026-08-23T18:40:00Z'
  }
];

export const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 'cust-1',
    name: 'Samira Khan',
    phoneNumber: '+880 1712-345678',
    address: 'House 42, Road 11, Block D, Banani, Dhaka',
    totalOrders: 3,
    totalSpent: 12800,
    lastOrderDate: '2026-08-25'
  },
  {
    id: 'cust-2',
    name: 'Nusrat Jahan',
    phoneNumber: '+880 1819-876543',
    address: 'Apt 5B, Gulshan Lake View, Gulshan 2, Dhaka',
    totalOrders: 5,
    totalSpent: 28500,
    lastOrderDate: '2026-08-24'
  },
  {
    id: 'cust-3',
    name: 'Farhana Rahman',
    phoneNumber: '+880 1911-223344',
    address: 'Sector 7, Road 14, Uttara, Dhaka',
    totalOrders: 2,
    totalSpent: 11400,
    lastOrderDate: '2026-08-23'
  }
];

export const INITIAL_SETTINGS: StoreSettings = {
  storeName: 'Ayesha Cotton',
  currencySymbol: '৳',
  whatsappNumber: '+8801712679721',
  whatsappGreeting: 'Hello Ayesha Cotton! I would like to place an order for the following items:',
  shippingFee: 120,
  freeShippingThreshold: 5000,
  supportEmail: 'contact@ayeshacotton.com',
  address: 'Plot 18, Road 27, Block A, Banani, Dhaka, Bangladesh'
};
