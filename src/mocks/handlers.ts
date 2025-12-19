/* eslint-disable @typescript-eslint/no-explicit-any */
import { http, HttpResponse } from 'msw';
import { products } from './data';
import { paginate, avgRating } from './utils';

const API = '/api';

// Mock user data
let currentUser = {
  id: '1',
  username: 'demo',
  email: 'demo@example.com',
  fullName: 'Demo User',
  phone: '+33 1 23 45 67 89',
  defaultAddress: {
    street: '123 Demo Street',
    city: 'Paris',
    postalCode: '75001',
    country: 'France'
  },
  preferences: {
    newsletter: true,
    defaultMinRating: 3
  }
};

// Mock wishlist (productIds)
let wishlistProductIds: number[] = [];

// Mock reviews for products
const mockReviews: { [productId: number]: any[] } = {
  1: [
    { id: 1, userName: 'Alice', rating: 5, comment: 'Excellent pen! Writes very smoothly.', date: '2025-01-15' },
    { id: 2, userName: 'Bob', rating: 4, comment: 'Good quality, fast delivery.', date: '2025-01-10' }
  ],
  2: [
    { id: 3, userName: 'Charlie', rating: 5, comment: 'Perfect notebook for journaling.', date: '2025-02-01' }
  ]
};

// Promo codes
const promoCodes: { [code: string]: { type: 'percent' | 'fixed' | 'shipping'; value: number; minAmount?: number } } = {
  'WELCOME10': { type: 'percent', value: 10 },
  'FREESHIP': { type: 'shipping', value: 0 },
  'VIP20': { type: 'percent', value: 20, minAmount: 50 }
};

export const handlers = [
  // Auth: POST /api/auth/token/ -> { access, refresh }
  http.post(`${API}/auth/token/`, async () => {
    // Ici on accepte tout payload pour valider l'intégration front.
    return HttpResponse.json(
      {
        access: 'mock-access-token',
        refresh: 'mock-refresh-token',
      },
      { status: 200 },
    );
  }),

  // Auth refresh: POST /api/auth/token/refresh/ -> { access }
  http.post(`${API}/auth/token/refresh/`, async () => {
    return HttpResponse.json({ access: 'mock-access-token-refreshed' }, { status: 200 });
  }),

  // ========================================
  // USER PROFILE ENDPOINTS
  // ========================================

  // GET /api/me/ -> user profile
  http.get(`${API}/me/`, async () => {
    return HttpResponse.json(currentUser, { status: 200 });
  }),

  // PATCH /api/me/ -> update profile
  http.patch(`${API}/me/`, async ({ request }) => {
    const body = await request.json() as any;
    currentUser = { ...currentUser, ...body };
    if (body.preferences) {
      currentUser.preferences = { ...currentUser.preferences, ...body.preferences };
    }
    return HttpResponse.json(currentUser, { status: 200 });
  }),

  // GET /api/me/orders/ -> user's orders
  http.get(`${API}/me/orders/`, async () => {
    const ordersJson = (typeof localStorage !== 'undefined') 
      ? localStorage.getItem('orders') 
      : null;
    const orders = ordersJson ? JSON.parse(ordersJson) : [];
    return HttpResponse.json({ results: orders, count: orders.length }, { status: 200 });
  }),

  // GET /api/orders/:id/ -> order details
  http.get(`${API}/orders/:id/`, async ({ params }) => {
    const orderId = params['id'] as string;
    const ordersJson = (typeof localStorage !== 'undefined') 
      ? localStorage.getItem('orders') 
      : null;
    const orders = ordersJson ? JSON.parse(ordersJson) : [];
    const order = orders.find((o: any) => o.id === orderId || o.orderNumber === orderId);
    
    if (!order) {
      return HttpResponse.json({ detail: 'Order not found' }, { status: 404 });
    }
    
    // Add detailed info
    const detailedOrder = {
      ...order,
      subtotal: order.items?.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0) || order.total,
      taxes: (order.total * 0.2).toFixed(2), // 20% VAT
      shipping: 5.99,
      discount: 0,
      createdAt: order.date
    };
    
    return HttpResponse.json(detailedOrder, { status: 200 });
  }),

  // ========================================
  // WISHLIST ENDPOINTS
  // ========================================

  // GET /api/me/wishlist/ -> list of product IDs
  http.get(`${API}/me/wishlist/`, async () => {
    return HttpResponse.json({ productIds: wishlistProductIds }, { status: 200 });
  }),

  // POST /api/me/wishlist/ -> add or remove product
  http.post(`${API}/me/wishlist/`, async ({ request }) => {
    const body = await request.json() as { productId: number; action?: 'add' | 'remove' | 'toggle' };
    const { productId, action = 'toggle' } = body;
    
    const index = wishlistProductIds.indexOf(productId);
    
    if (action === 'add' && index === -1) {
      wishlistProductIds.push(productId);
    } else if (action === 'remove' && index !== -1) {
      wishlistProductIds.splice(index, 1);
    } else if (action === 'toggle') {
      if (index !== -1) {
        wishlistProductIds.splice(index, 1);
      } else {
        wishlistProductIds.push(productId);
      }
    }
    
    return HttpResponse.json({ productIds: wishlistProductIds }, { status: 200 });
  }),

  // ========================================
  // REVIEWS ENDPOINTS
  // ========================================

  // GET /api/products/:id/reviews/ -> list of reviews
  http.get(`${API}/products/:id/reviews/`, async ({ params }) => {
    const productId = Number(params['id']);
    const reviews = mockReviews[productId] || [];
    return HttpResponse.json({ results: reviews, count: reviews.length }, { status: 200 });
  }),

  // POST /api/products/:id/reviews/ -> create a review
  http.post(`${API}/products/:id/reviews/`, async ({ params, request }) => {
    const productId = Number(params['id']);
    const body = await request.json() as { userName: string; rating: number; comment: string };
    
    if (!body.rating || body.rating < 1 || body.rating > 5) {
      return HttpResponse.json({ error: 'Rating must be between 1 and 5' }, { status: 400 });
    }
    
    const newReview = {
      id: Date.now(),
      userName: body.userName || 'Anonymous',
      rating: body.rating,
      comment: body.comment || '',
      date: new Date().toISOString().split('T')[0],
      productId
    };
    
    if (!mockReviews[productId]) {
      mockReviews[productId] = [];
    }
    mockReviews[productId].unshift(newReview);
    
    return HttpResponse.json(newReview, { status: 201 });
  }),

  // ========================================
  // PROMO CODE & CART ENDPOINTS
  // ========================================

  // POST /api/cart/apply-promo/
  http.post(`${API}/cart/apply-promo/`, async ({ request }) => {
    const body = await request.json() as { 
      items: Array<{ product_id: number; quantity: number }>; 
      code: string;
    };
    
    const { items, code } = body;
    const promoUpper = code.toUpperCase();
    const promo = promoCodes[promoUpper];
    
    // Calculate base totals
    let itemsTotal = items.reduce((sum, item) => {
      const product = products.find(p => p.id === item.product_id);
      return sum + (product?.price || 0) * item.quantity;
    }, 0);
    
    const baseTaxRate = 0.2; // 20% VAT
    let shipping = 5.99;
    let discount = 0;
    const appliedPromos: string[] = [];
    
    if (!promo) {
      return HttpResponse.json({ 
        error: 'Invalid promo code',
        itemsTotal,
        discount: 0,
        shipping,
        taxes: Number((itemsTotal * baseTaxRate).toFixed(2)),
        grandTotal: Number((itemsTotal + shipping + itemsTotal * baseTaxRate).toFixed(2)),
        appliedPromos: []
      }, { status: 400 });
    }
    
    // Check minimum amount for VIP20
    if (promo.minAmount && itemsTotal < promo.minAmount) {
      return HttpResponse.json({ 
        error: `This promo code requires a minimum order of €${promo.minAmount}`,
        itemsTotal,
        discount: 0,
        shipping,
        taxes: Number((itemsTotal * baseTaxRate).toFixed(2)),
        grandTotal: Number((itemsTotal + shipping + itemsTotal * baseTaxRate).toFixed(2)),
        appliedPromos: []
      }, { status: 400 });
    }
    
    // Apply promo
    if (promo.type === 'percent') {
      discount = itemsTotal * (promo.value / 100);
      appliedPromos.push(`${promoUpper} (-${promo.value}%)`);
    } else if (promo.type === 'shipping') {
      shipping = 0;
      appliedPromos.push(`${promoUpper} (Free Shipping)`);
    } else if (promo.type === 'fixed') {
      discount = promo.value;
      appliedPromos.push(`${promoUpper} (-€${promo.value})`);
    }
    
    const subtotalAfterDiscount = itemsTotal - discount;
    const taxes = subtotalAfterDiscount * baseTaxRate;
    const grandTotal = subtotalAfterDiscount + shipping + taxes;
    
    return HttpResponse.json({
      itemsTotal: Number(itemsTotal.toFixed(2)),
      discount: Number(discount.toFixed(2)),
      shipping: Number(shipping.toFixed(2)),
      taxes: Number(taxes.toFixed(2)),
      grandTotal: Number(grandTotal.toFixed(2)),
      appliedPromos
    }, { status: 200 });
  }),

  // POST /api/cart/validate-stock/
  http.post(`${API}/cart/validate-stock/`, async ({ request }) => {
    const body = await request.json() as { items: Array<{ product_id: number; quantity: number }> };
    
    const errors: string[] = [];
    
    for (const item of body.items) {
      const product = products.find(p => p.id === item.product_id);
      if (!product) {
        errors.push(`Product ${item.product_id} not found`);
      } else if (product.stock < item.quantity) {
        errors.push(`Insufficient stock for "${product.name}": only ${product.stock} available`);
      }
    }
    
    if (errors.length > 0) {
      return HttpResponse.json({ valid: false, errors }, { status: 400 });
    }
    
    return HttpResponse.json({ valid: true, errors: [] }, { status: 200 });
  }),

  // ========================================
  // ADMIN ENDPOINTS
  // ========================================

  // GET /api/admin/stats/
  http.get(`${API}/admin/stats/`, async () => {
    // Get orders from localStorage
    const ordersJson = (typeof localStorage !== 'undefined') 
      ? localStorage.getItem('orders') 
      : null;
    const orders = ordersJson ? JSON.parse(ordersJson) : [];
    
    // Get users from localStorage
    const usersJson = (typeof localStorage !== 'undefined') 
      ? localStorage.getItem('mock_users') 
      : null;
    const users = usersJson ? JSON.parse(usersJson) : [];
    
    // Calculate totals
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum: number, order: any) => sum + (order.total || 0), 0);
    const totalUsers = users.length || 1;
    
    // Calculate top products
    const productSales: { [id: number]: { name: string; sold: number; revenue: number } } = {};
    for (const order of orders) {
      for (const item of (order.items || [])) {
        const productId = item.productId;
        if (!productSales[productId]) {
          productSales[productId] = { name: item.productName || 'Unknown', sold: 0, revenue: 0 };
        }
        productSales[productId].sold += item.quantity;
        productSales[productId].revenue += item.price * item.quantity;
      }
    }
    
    const topProducts = Object.entries(productSales)
      .map(([id, data]) => ({
        productId: id,
        name: data.name,
        sold: data.sold,
        revenue: Number(data.revenue.toFixed(2))
      }))
      .sort((a, b) => b.sold - a.sold)
      .slice(0, 5);
    
    // Recent orders
    const recentOrders = orders
      .slice(0, 5)
      .map((order: any) => ({
        id: order.orderNumber || order.id,
        user: order.customerEmail || 'Guest',
        total: order.total,
        createdAt: order.date,
        status: order.status
      }));
    
    return HttpResponse.json({
      totalUsers,
      totalOrders,
      totalRevenue: Number(totalRevenue.toFixed(2)),
      topProducts,
      recentOrders
    }, { status: 200 });
  }),

  // ========================================
  // PRODUCTS ENDPOINTS
  // ========================================

  // Products list: GET /api/products/?page=&page_size=&min_rating=&ordering=
  http.get(`${API}/products/`, async ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page') || '1');
    const page_size = Number(url.searchParams.get('page_size') || '10');
    const min_rating = Number(url.searchParams.get('min_rating') || '0');
    const ordering = url.searchParams.get('ordering') || '-created_at';
    const search = url.searchParams.get('search') || '';
    const category = url.searchParams.get('category') || '';
    const minPrice = Number(url.searchParams.get('min_price') || '0');
    const maxPrice = Number(url.searchParams.get('max_price') || '999999');

    // Merge base products with custom products from localStorage
    let allProducts = [...products];
    try {
      if (typeof localStorage !== 'undefined') {
        const customProductsJson = localStorage.getItem('custom_products');
        if (customProductsJson) {
          const customProducts = JSON.parse(customProductsJson);
          allProducts = [...customProducts, ...allProducts];
        }
      }
    } catch (e) {
      console.error('Failed to load custom products:', e);
    }

    let rows = allProducts
      .map((p) => ({ ...p, _avg: avgRating(p.ratings) }))
      .filter((p) => p._avg >= min_rating)
      .filter((p) => p.price >= minPrice && p.price <= maxPrice);
    
    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase();
      rows = rows.filter((p) => 
        p.name.toLowerCase().includes(searchLower) ||
        p.description.toLowerCase().includes(searchLower)
      );
    }
    
    // Apply category filter
    if (category && category !== 'all') {
      rows = rows.filter((p) => 
        p.category.toLowerCase() === category.toLowerCase()
      );
    }

    const sign = ordering.startsWith('-') ? -1 : 1;
    const key = ordering.replace(/^-/, '');
    rows.sort((a: any, b: any) => (a[key] > b[key] ? 1 : a[key] < b[key] ? -1 : 0) * sign);

    const { count, results } = paginate(rows, page, page_size);
    return HttpResponse.json({ count, next: null, previous: null, results }, { status: 200 });
  }),

  // Product rating: GET /api/products/:id/rating/
  http.get(`${API}/products/:id/rating/`, async ({ params }) => {
    const id = Number(params['id']);
    const p = products.find((x) => x.id === id);
    if (!p) return HttpResponse.json({ detail: 'Not found.' }, { status: 404 });
    return HttpResponse.json(
      { product_id: id, avg_rating: avgRating(p.ratings), count: p.ratings.length },
      { status: 200 },
    );
  }),

  // Product details: GET /api/products/:id
  http.get(`${API}/products/:id`, async ({ params }) => {
    const id = Number(params['id']);
    const p = products.find((x) => x.id === id);
    if (!p) return HttpResponse.json({ detail: 'Not found.' }, { status: 404 });
    return HttpResponse.json(p, { status: 200 });
  }),

  // Cart validation: POST /api/cart/validate
  http.post(`${API}/cart/validate`, async ({ request }) => {
    const body = (await request.json()) as { items: Array<{ product_id: number; quantity: number }> };
    const validatedItems = body.items.map((item) => {
      const product = products.find((p) => p.id === item.product_id);
      if (!product) {
        return null;
      }
      return {
        product_id: item.product_id,
        quantity: item.quantity,
        price: product.price,
      };
    }).filter((item) => item !== null);

    const total = validatedItems.reduce((sum, item) => sum + (item?.price || 0) * (item?.quantity || 0), 0);

    return HttpResponse.json(
      {
        valid: validatedItems.length === body.items.length,
        total,
        items: validatedItems,
      },
      { status: 200 }
    );
  }),

  // Create order: POST /api/order
  http.post(`${API}/order`, async ({ request }) => {
    const body = (await request.json()) as {
      items: Array<{ product_id: number; quantity: number }>;
      address: Record<string, string>;
    };
    
    // Calculate total
    const total = body.items.reduce((sum, item) => {
      const product = products.find((p) => p.id === item.product_id);
      return sum + (product?.price || 0) * item.quantity;
    }, 0);

    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    return HttpResponse.json(
      {
        order_number: orderNumber,
        total,
      },
      { status: 200 }
    );
  }),
];
