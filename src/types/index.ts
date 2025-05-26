
export interface User {
  id: string;
  email: string;
  language: 'fr' | 'en' | 'sw';
  currency: 'USD' | 'CDF' | 'EUR';
}

export interface Product {
  id: string;
  user_id: string;
  name: string;
  category: string;
  subcategory?: string;
  initial_stock: number;
  current_stock: number;
  purchase_price: number;
  sale_price: number;
  created_at: string;
  updated_at: string;
}

export interface Sale {
  id: string;
  user_id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  total_amount: number;
  profit: number;
  date: string;
}

export interface Expense {
  id: string;
  user_id: string;
  amount: number;
  description: string;
  category?: string;
  date: string;
}

export interface DashboardStats {
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  productProfits: Array<{
    productId: string;
    productName: string;
    totalProfit: number;
    unitsSold: number;
  }>;
}
