```ts
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import {
  AdminCredentials,
  Category,
  Customer,
  NewsletterSubscriber,
  Order,
  OrderItem,
  OrderStatus,
  Product,
  Review,
  SiteSettings,
} from '../types';
import {
  DEFAULT_SITE_SETTINGS,
  INITIAL_CATEGORIES,
  INITIAL_ORDERS,
  INITIAL_PRODUCTS,
  INITIAL_REVIEWS,
} from './seedData';

// ============================================================
// SUPABASE CONFIGURATION
// ============================================================

export function getSupabaseCredentials(): {
  url: string;
  anonKey: string;
} {
  const url = String(import.meta.env.VITE_SUPABASE_URL || '').trim();
  const anonKey = String(
    import.meta.env.VITE_SUPABASE_ANON_KEY || ''
  ).trim();

  return {
    url,
    anonKey,
  };
}

let supabaseInstance: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  const { url, anonKey } = getSupabaseCredentials();

  if (!url || !anonKey || !url.startsWith('https://')) {
    return null;
  }

  if (!supabaseInstance) {
    try {
      supabaseInstance = createClient(url, anonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
        },
      });
    } catch (error) {
      console.error('Supabase initialization failed:', error);
      return null;
    }
  }

  return supabaseInstance;
}

export function isSupabaseConnected(): boolean {
  const { url, anonKey } = getSupabaseCredentials();

  return Boolean(
    url &&
    anonKey &&
    url.startsWith('https://')
  );
}

export async function testSupabaseConnection(
  url?: string,
  anonKey?: string
): Promise<{ success: boolean; message: string }> {
  const targetUrl = (url || getSupabaseCredentials().url).trim();
  const targetKey = (anonKey || getSupabaseCredentials().anonKey).trim();

  if (!targetUrl || !targetKey || !targetUrl.startsWith('https://')) {
    return {
      success: false,
      message:
        'Please provide a valid Supabase project URL and Anon public API key.',
    };
  }

  try {
    const testClient = createClient(targetUrl, targetKey);

    const { data, error } = await testClient
      .from('products')
      .select('id')
      .limit(1);

export const testSupabaseConnection = async (): Promise<{
  success: boolean;
  message: string;
}> => {
  try {
    const { error } = await supabase
      .from('products')
      .select('id')
      .limit(1);

    if (error) {
      if (error.code === '42P01') {
        return {
          success: false,
          message:
            'Connected to Supabase, but the "products" table was not found.',
        };
      }

      return {
        success: false,
        message: `Supabase error: ${error.message}`,
      };
    }

    return {
      success: true,
      message: 'Successfully connected to Supabase.',
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || 'Could not connect to Supabase.',
    };
  }
};
  }
}

// ============================================================
// LOCAL STORAGE
// ============================================================
// Only used for temporary browser session information.
// BUSINESS DATA IS NOT STORED IN LOCAL STORAGE.
// ============================================================

const CURRENT_CUSTOMER_KEY = 'aio_current_customer';

export function getCurrentCustomer(): Customer | null {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const stored = localStorage.getItem(CURRENT_CUSTOMER_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

  try {
    const value = localStorage.getItem(CURRENT_CUSTOMER_KEY);

    if (!value) {
      return null;
    }

    return JSON.parse(value);
  } catch {
    return null;
  }
}

export function saveCurrentCustomer(
  customer: Customer | null
): void {
  if (typeof window === 'undefined') {
    return;
  }

  if (!customer) {
    localStorage.removeItem(CURRENT_CUSTOMER_KEY);
    return;
  }

  localStorage.setItem(
    CURRENT_CUSTOMER_KEY,
    JSON.stringify(customer)
  );
}

// ============================================================
// PRODUCTS
// ============================================================

export async function getProducts(): Promise<Product[]> {
  const supabase = getSupabaseClient();

  if (!supabase) {
    console.error('Supabase is not configured.');
    return [];
  }

  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Products fetch error:', error);
      return [];
    }

    return (data || []) as Product[];
  } catch (error) {
    console.error('Products query error:', error);
    return [];
  }
}

export async function upsertProduct(
  product: Partial<Product> & {
    name: string;
    price: number;
  }
): Promise<Product> {
  const supabase = getSupabaseClient();

  if (!supabase) {
    throw new Error('Supabase is not connected.');
  }

  const slug =
    product.slug ||
    product.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

  const now = new Date().toISOString();

  const newProduct: Product = {
    id:
      product.id ||
      (typeof crypto !== 'undefined' &&
      crypto.randomUUID
        ? crypto.randomUUID()
        : `prod-${Date.now()}`),

    name: product.name,
    slug,

    description: product.description || '',

    price: Number(product.price),

    compare_at_price:
      product.compare_at_price != null
        ? Number(product.compare_at_price)
        : undefined,

    image_url:
      product.image_url || '',

    category_id:
      product.category_id || '',

    stock_quantity:
      Number(product.stock_quantity ?? 0),

    is_active:
      product.is_active ?? true,

    is_featured:
      product.is_featured ?? false,

    created_at:
      product.created_at || now,

    updated_at:
      now,
  };

  const { data, error } = await supabase
    .from('products')
    .upsert(newProduct)
    .select()
    .single();

  if (error) {
    console.error('Product save error:', error);
    throw new Error(error.message);
  }

  return data as Product;
}

export async function deleteProductById(
  id: string
): Promise<boolean> {
  const supabase = getSupabaseClient();

  if (!supabase) {
    throw new Error('Supabase is not connected.');
  }

  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Product delete error:', error);
    return false;
  }

  return true;
}

// ============================================================
// CATEGORIES
// ============================================================

export async function getCategories(): Promise<Category[]> {
  const supabase = getSupabaseClient();

  if (!supabase) {
    return [];
  }

  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');

    if (error) {
      console.error('Categories fetch error:', error);
      return [];
    }

    return (data || []) as Category[];
  } catch (error) {
    console.error('Categories query error:', error);
    return [];
  }
}

export async function upsertCategory(
  category: Partial<Category> & {
    name: string;
  }
): Promise<Category> {
  const supabase = getSupabaseClient();

  if (!supabase) {
    throw new Error('Supabase is not connected.');
  }

  const slug =
    category.slug ||
    category.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

  const newCategory: Category = {
    id:
      category.id ||
      (typeof crypto !== 'undefined' &&
      crypto.randomUUID
        ? crypto.randomUUID()
        : `cat-${Date.now()}`),

    name: category.name,
    slug,

    description:
      category.description || '',

    image_url:
      category.image_url || '',

    is_active:
      category.is_active ?? true,

    created_at:
      category.created_at ||
      new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from('categories')
    .upsert(newCategory)
    .select()
    .single();

  if (error) {
    console.error('Category save error:', error);
    throw new Error(error.message);
  }

  return data as Category;
}

export async function deleteCategoryById(
  id: string
): Promise<boolean> {
  const supabase = getSupabaseClient();

  if (!supabase) {
    throw new Error('Supabase is not connected.');
  }

  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Category delete error:', error);
    return false;
  }

  return true;
}

// ============================================================
// ORDERS
// ============================================================

export async function getOrders(): Promise<Order[]> {
  const supabase = getSupabaseClient();

  if (!supabase) {
    console.error('Supabase is not connected.');
    return [];
  }

  try {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (*)
      `)
      .order('created_at', {
        ascending: false,
      });

    if (error) {
      console.error('Orders fetch error:', error);
      return [];
    }

    return (data || []).map((order: any) => ({
      ...order,
      items:
        order.order_items ||
        order.items ||
        [],
    })) as Order[];
  } catch (error) {
    console.error('Orders query error:', error);
    return [];
  }
}

// ============================================================
// CREATE ORDER
// ============================================================

export async function createOrder(
  customerData: {
    name: string;
    phone: string;
    email?: string;
    address: string;
    city: string;
    province: string;
    postal_code?: string;
  },

  items: OrderItem[],

  totalAmount: number,

  notes?: string,

  paymentMethod:
    | 'Cash on Delivery'
    | 'Online Payment' = 'Cash on Delivery'
): Promise<Order> {
  const supabase = getSupabaseClient();

  if (!supabase) {
    throw new Error(
      'Supabase is not connected. The order was NOT saved.'
    );
  }

  const orderId =
    typeof crypto !== 'undefined' &&
    crypto.randomUUID
      ? crypto.randomUUID()
      : `ord-${Date.now()}`;

  const customerId =
    typeof crypto !== 'undefined' &&
    crypto.randomUUID
      ? crypto.randomUUID()
      : `cust-${Date.now()}`;

  const orderNumber =
    'AIO-PK-' +
    Math.floor(
      100000 + Math.random() * 900000
    );

  const now =
    new Date().toISOString();

  // ----------------------------------------------------------
  // 1. SAVE CUSTOMER
  // ----------------------------------------------------------

  const { data: customerRecord, error: customerError } =
    await supabase
      .from('customers')
      .upsert(
        {
          id: customerId,

          name: customerData.name,

          phone: customerData.phone,

          email:
            customerData.email || null,

          address:
            customerData.address,

          city:
            customerData.city,

          province:
            customerData.province,

          postal_code:
            customerData.postal_code || null,

          updated_at:
            now,
        },
        {
          onConflict: 'id',
        }
      )
      .select()
      .single();

  if (customerError) {
    console.error(
      'Customer save error:',
      customerError
    );

    throw new Error(
      `Customer could not be saved: ${customerError.message}`
    );
  }

  // ----------------------------------------------------------
  // 2. SAVE ORDER
  // ----------------------------------------------------------

  const { data: orderRecord, error: orderError } =
    await supabase
      .from('orders')
      .insert({
        id: orderId,

        order_number:
          orderNumber,

        customer_id:
          customerRecord?.id ||
          customerId,

        customer_name:
          customerData.name,

        customer_phone:
          customerData.phone,

        customer_email:
          customerData.email ||
          null,

        customer_city:
          customerData.city,

        customer_address:
          customerData.address,

        total_amount:
          totalAmount,

        payment_method:
          paymentMethod,

        payment_status:
          'Pending',

        order_status:
          'Pending',

        shipping_address:
          customerData,

        notes:
          notes || null,

        created_at:
          now,

        updated_at:
          now,
      })
      .select()
      .single();

  if (orderError) {
    console.error(
      'Order save error:',
      orderError
    );

    throw new Error(
      `Order could not be saved: ${orderError.message}`
    );
  }

  // ----------------------------------------------------------
  // 3. SAVE ORDER ITEMS
  // ----------------------------------------------------------

  const orderItems = items.map(
    (item) => ({
      order_id:
        orderRecord.id,

      product_id:
        item.product_id,

      product_name:
        item.product_name,

      quantity:
        item.quantity,

      price:
        item.price,

      subtotal:
        item.subtotal,
    })
  );

  if (orderItems.length > 0) {
    const {
      error: itemsError,
    } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) {
      console.error(
        'Order items save error:',
        itemsError
      );

      // Remove incomplete order if items failed.
      await supabase
        .from('orders')
        .delete()
        .eq(
          'id',
          orderRecord.id
        );

      throw new Error(
        `Order items could not be saved: ${itemsError.message}`
      );
    }
  }

  // ----------------------------------------------------------
  // 4. RETURN SAVED ORDER
  // ----------------------------------------------------------

  return {
    ...orderRecord,

    items:
      items.map(
        (item) => ({
          ...item,
          order_id:
            orderRecord.id,
        })
      ),
  } as Order;
}

// ============================================================
// UPDATE ORDER STATUS
// ============================================================

export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus
): Promise<boolean> {
  const supabase = getSupabaseClient();

  if (!supabase) {
    throw new Error(
      'Supabase is not connected.'
    );
  }

  const {
    error,
  } = await supabase
    .from('orders')
    .update({
      order_status:
        status,

      updated_at:
        new Date().toISOString(),
    })
    .eq(
      'id',
      orderId
    );

  if (error) {
    console.error(
      'Order status update error:',
      error
    );

    return false;
  }

  return true;
}

// ============================================================
// DELETE ORDER
// ============================================================

export async function deleteOrderById(
  orderId: string
): Promise<boolean> {
  const supabase = getSupabaseClient();

  if (!supabase) {
    throw new Error(
      'Supabase is not connected.'
    );
  }

  // Delete order items first.
  const {
    error: itemsError,
  } = await supabase
    .from('order_items')
    .delete()
    .eq(
      'order_id',
      orderId
    );

  if (itemsError) {
    console.error(
      'Order items delete error:',
      itemsError
    );
  }

  const {
    error,
  } = await supabase
    .from('orders')
    .delete()
    .eq(
      'id',
      orderId
    );

  if (error) {
    console.error(
      'Order delete error:',
      error
    );

    return false;
  }

  return true;
}

// ============================================================
// REVIEWS
// ============================================================

export async function getReviews(
  approvedOnly = true
): Promise<Review[]> {
  const supabase = getSupabaseClient();

  if (!supabase) {
    return [];
  }

  try {
    let query = supabase
      .from('reviews')
      .select('*')
      .order(
        'created_at',
        {
          ascending: false,
        }
      );

    if (approvedOnly) {
      query = query.eq(
        'is_approved',
        true
      );
    }

    const {
      data,
      error,
    } = await query;

    if (error) {
      console.error(
        'Reviews fetch error:',
        error
      );

      return [];
    }

    return (data || []) as Review[];
  } catch (error) {
    console.error(
      'Reviews query error:',
      error
    );

    return [];
  }
}

export async function submitReview(
  review: {
    product_id: string;
    product_name?: string;
    customer_name: string;
    rating: number;
    review_text: string;
  }
): Promise<Review> {
  const supabase = getSupabaseClient();

  if (!supabase) {
    throw new Error(
      'Supabase is not connected. Review was NOT saved.'
    );
  }

  const newReview: Review = {
    id:
      typeof crypto !== 'undefined' &&
      crypto.randomUUID
        ? crypto.randomUUID()
        : `rev-${Date.now()}`,

    product_id:
      review.product_id,

    product_name:
      review.product_name ||
      'AIO Product',

    customer_name:
      review.customer_name,

    rating:
      review.rating,

    review_text:
      review.review_text,

    is_approved:
      false,

    created_at:
      new Date().toISOString(),
  };

  const {
    data,
    error,
  } = await supabase
    .from('reviews')
    .insert(newReview)
    .select()
    .single();

  if (error) {
    console.error(
      'Review save error:',
      error
    );

    throw new Error(
      error.message
    );
  }

  return data as Review;
}

export async function setReviewApproval(
  reviewId: string,
  isApproved: boolean
): Promise<boolean> {
  const supabase = getSupabaseClient();

  if (!supabase) {
    throw new Error(
      'Supabase is not connected.'
    );
  }

  const {
    error,
  } = await supabase
    .from('reviews')
    .update({
      is_approved:
        isApproved,
    })
    .eq(
      'id',
      reviewId
    );

  if (error) {
    console.error(
      'Review approval error:',
      error
    );

    return false;
  }

  return true;
}

export async function deleteReviewById(
  reviewId: string
): Promise<boolean> {
  const supabase = getSupabaseClient();

  if (!supabase) {
    throw new Error(
      'Supabase is not connected.'
    );
  }

  const {
    error,
  } = await supabase
    .from('reviews')
    .delete()
    .eq(
      'id',
      reviewId
    );

  if (error) {
    console.error(
      'Review delete error:',
      error
    );

    return false;
  }

  return true;
}

// ============================================================
// NEWSLETTER
// ============================================================

export async function subscribeNewsletter(
  email: string
): Promise<{
  success: boolean;
  message: string;
}> {
  const supabase = getSupabaseClient();

  if (!supabase) {
    return {
      success: false,
      message:
        'Supabase is not connected. Please try again later.',
    };
  }

  const cleanEmail =
    email
      .trim()
      .toLowerCase();

  if (!cleanEmail) {
    return {
      success: false,
      message:
        'Please enter a valid email address.',
    };
  }

  const {
    error,
  } = await supabase
    .from('newsletter_subscribers')
    .insert({
      email:
        cleanEmail,

      created_at:
        new Date().toISOString(),
    });

  if (!error) {
    return {
      success: true,
      message:
        'Thank you for subscribing! Use code WELCOME10 for 10% off your first order.',
    };
  }

  if (error.code === '23505') {
    return {
      success: true,
      message:
        'You are already subscribed to our newsletter! Thank you for being with us.',
    };
  }

  console.error(
    'Newsletter error:',
    error
  );

  return {
    success: false,
    message:
      error.message ||
      'Could not subscribe.',
  };
}

// ============================================================
// CUSTOMERS
// ============================================================

export async function getCustomers(): Promise<Customer[]> {
  const supabase = getSupabaseClient();

  if (!supabase) {
    return [];
  }

  try {
    const {
      data,
      error,
    } = await supabase
      .from('customers')
      .select('*')
      .order(
        'created_at',
        {
          ascending: false,
        }
      );

    if (error) {
      console.error(
        'Customers fetch error:',
        error
      );

      return [];
    }

    return (data || []) as Customer[];
  } catch (error) {
    console.error(
      'Customers query error:',
      error
    );

    return [];
  }
}

export async function upsertCustomer(
  customer: Partial<Customer> & {
    name: string;
  }
): Promise<Customer> {
  const supabase = getSupabaseClient();

  if (!supabase) {
    throw new Error(
      'Supabase is not connected.'
    );
  }

  const now =
    new Date().toISOString();

  const custId =
    customer.id ||
    (typeof crypto !== 'undefined' &&
    crypto.randomUUID
      ? crypto.randomUUID()
      : `cust-${Date.now()}`);

  const newCustomer: Customer = {
    id:
      custId,

    name:
      customer.name,

    email:
      customer.email || '',

    phone:
      customer.phone || '',

    address:
      customer.address || '',

    city:
      customer.city || '',

    province:
      customer.province || '',

    postal_code:
      customer.postal_code || '',

    avatar_url:
      customer.avatar_url || '',

    auth_provider:
      customer.auth_provider || 'google',

    status:
      customer.status || 'active',

    notes:
      customer.notes || '',

    created_at:
      customer.created_at || now,

    updated_at:
      now,
  };

  const {
    data,
    error,
  } = await supabase
    .from('customers')
    .upsert(newCustomer)
    .select()
    .single();

  if (error) {
    console.error(
      'Customer save error:',
      error
    );

    throw new Error(
      error.message
    );
  }

  return data as Customer;
}

export async function deleteCustomerById(
  customerId: string
): Promise<boolean> {
  const supabase = getSupabaseClient();

  if (!supabase) {
    throw new Error(
      'Supabase is not connected.'
    );
  }

  const {
    error,
  } = await supabase
    .from('customers')
    .delete()
    .eq(
      'id',
      customerId
    );

  if (error) {
    console.error(
      'Customer delete error:',
      error
    );

    return false;
  }

  return true;
}

// ============================================================
// GOOGLE CUSTOMER LOGIN / REGISTRATION
// ============================================================

export async function loginOrRegisterCustomerWithGoogle(
  googleProfile: {
    name: string;
    email: string;
    avatar_url?: string;
    phone?: string;
  }
): Promise<Customer> {
  const customers =
    await getCustomers();

  const existing =
    customers.find(
      (customer) =>
        customer.email?.toLowerCase() ===
        googleProfile.email.toLowerCase()
    );

  if (existing) {
    const updated =
      await upsertCustomer({
        ...existing,

        avatar_url:
          googleProfile.avatar_url ||
          existing.avatar_url,

        auth_provider:
          'google',
      });

    saveCurrentCustomer(
      updated
    );

    return updated;
  }

  const avatar =
    googleProfile.avatar_url ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      googleProfile.name
    )}&background=ff6b00&color=fff`;

  const newCustomer =
    await upsertCustomer({
      name:
        googleProfile.name,

      email:
        googleProfile.email,

      phone:
        googleProfile.phone || '',

      avatar_url:
        avatar,

      auth_provider:
        'google',

      status:
        'active',

      address:
        '',

      city:
        '',

      province:
        '',

      notes:
        'Signed up with Google account.',
    });

  saveCurrentCustomer(
    newCustomer
  );

  return newCustomer;
}

// ============================================================
// ADMIN CREDENTIALS
// ============================================================

export function getAdminCredentials(): AdminCredentials {
  // NOTE:
  // This remains local because admin credentials should NOT
  // be hard-coded into Supabase client-side business data.
  // For real production security, use Supabase Auth.

  if (typeof window !== 'undefined') {
    try {
      const stored =
        localStorage.getItem(
          'aio_admin_credentials'
        );

      if (stored) {
        return JSON.parse(
          stored
        );
      }
    } catch {
      // Ignore invalid local value.
    }
  }

  return {
    email:
      'admin@aioproduct.pk',

    password:
      'aioadmin123',

    updated_at:
      new Date().toISOString(),
  };
}

export function saveAdminCredentials(
  creds: AdminCredentials
): void {
  if (typeof window === 'undefined') {
    return;
  }

  localStorage.setItem(
    'aio_admin_credentials',
    JSON.stringify({
      ...creds,

      updated_at:
        new Date().toISOString(),
    })
  );
}

// ============================================================
// SITE SETTINGS
// ============================================================

export async function getSiteSettings(): Promise<SiteSettings> {
  const supabase = getSupabaseClient();

  if (!supabase) {
    return DEFAULT_SITE_SETTINGS;
  }

  try {
    const {
      data,
      error,
    } = await supabase
      .from('site_settings')
      .select('*')
      .eq(
        'key',
        'main_config'
      )
      .maybeSingle();

    if (error) {
      console.error(
        'Site settings fetch error:',
        error
      );

      return DEFAULT_SITE_SETTINGS;
    }

    if (
      data &&
      data.value
    ) {
      return {
        ...DEFAULT_SITE_SETTINGS,
        ...data.value,
      };
    }

    return DEFAULT_SITE_SETTINGS;
  } catch (error) {
    console.error(
      'Site settings error:',
      error
    );

    return DEFAULT_SITE_SETTINGS;
  }
}

export async function saveSiteSettings(
  settings: SiteSettings
): Promise<boolean> {
  const supabase = getSupabaseClient();

  if (!supabase) {
    throw new Error(
      'Supabase is not connected.'
    );
  }

  const {
    error,
  } = await supabase
    .from('site_settings')
    .upsert({
      key:
        'main_config',

      value:
        settings,

      updated_at:
        new Date().toISOString(),
    });

  if (error) {
    console.error(
      'Site settings save error:',
      error
    );

    return false;
  }

  return true;
}

// ============================================================
// SUPABASE STORAGE
// ============================================================

export const STORAGE_BUCKET_NAME =
  'aio-media';

export async function uploadImageToSupabaseStorage(
  fileOrBase64: File | string,

  folder:
    | 'products'
    | 'banners'
    | 'categories' = 'products'
): Promise<{
  url: string;
  success: boolean;
  error?: string;
}> {
  const supabase =
    getSupabaseClient();

  if (!supabase) {
    return {
      url: '',
      success: false,
      error:
        'Supabase is not connected.',
    };
  }

  try {
    const timestamp =
      Date.now();

    const randomStr =
      Math.random()
        .toString(36)
        .substring(
          2,
          9
        );

    let blob: Blob;

    let contentType =
      'image/jpeg';

    let fileExt =
      'jpg';

    // --------------------------------------------------------
    // BASE64 IMAGE
    // --------------------------------------------------------

    if (
      typeof fileOrBase64 ===
      'string'
    ) {
      if (
        fileOrBase64.startsWith(
          'data:'
        )
      ) {
        const matches =
          fileOrBase64.match(
            /^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/
          );

        if (
          !matches ||
          matches.length !== 3
        ) {
          return {
            url: '',
            success: false,
            error:
              'Invalid base64 image.',
          };
        }

        contentType =
          matches[1];

        if (
          contentType.includes(
            'png'
          )
        ) {
          fileExt =
            'png';
        } else if (
          contentType.includes(
            'webp'
          )
        ) {
          fileExt =
            'webp';
        }

        const byteCharacters =
          atob(matches[2]);

        const byteNumbers =
          new Array(
            byteCharacters.length
          );

        for (
          let i = 0;
          i <
          byteCharacters.length;
          i++
        ) {
          byteNumbers[i] =
            byteCharacters.charCodeAt(
              i
            );
        }

        const byteArray =
          new Uint8Array(
            byteNumbers
          );

        blob =
          new Blob(
            [byteArray],
            {
              type:
                contentType,
            }
          );
      } else {
        // Already a public remote URL.
        return {
          url:
            fileOrBase64,

          success:
            true,
        };
      }
    } else {
      // ------------------------------------------------------
      // FILE OBJECT
      // ------------------------------------------------------

      blob =
        fileOrBase64;

      contentType =
        fileOrBase64.type ||
        'image/jpeg';

      if (
        contentType.includes(
          'png'
        )
      ) {
        fileExt =
          'png';
      } else if (
        contentType.includes(
          'webp'
        )
      ) {
        fileExt =
          'webp';
      }
    }

    const filePath =
      `${folder}/${timestamp}-${randomStr}.${fileExt}`;

    // --------------------------------------------------------
    // UPLOAD
    // --------------------------------------------------------

    const {
      data,
      error,
    } = await supabase.storage
      .from(
        STORAGE_BUCKET_NAME
      )
      .upload(
        filePath,
        blob,
        {
          contentType,

          cacheControl:
            '3600',

          upsert:
            true,
        }
      );

    if (error) {
      console.error(
        'Storage upload error:',
        error
      );

      return {
        url: '',
        success: false,
        error:
          error.message,
      };
    }

    // --------------------------------------------------------
    // PUBLIC URL
    // --------------------------------------------------------

    const {
      data:
        publicUrlData,
    } =
      supabase.storage
        .from(
          STORAGE_BUCKET_NAME
        )
        .getPublicUrl(
          data.path
        );

    if (
      publicUrlData?.publicUrl
    ) {
      return {
        url:
          publicUrlData.publicUrl,

        success:
          true,
      };
    }

    return {
      url: '',
      success: false,
      error:
        'Could not generate public image URL.',
    };
  } catch (error: any) {
    console.error(
      'Storage error:',
      error
    );

    return {
      url: '',
      success: false,
      error:
        error?.message ||
        'Storage upload failed.',
    };
  }
}
```
