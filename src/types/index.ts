
export interface User {
  id: string;
  email: string;
  language: 'fr' | 'en' | 'sw';
  currency: 'USD' | 'CDF' | 'EUR';
}

export interface Product {
  id: string;
  name: string;
  category: string;
  subcategory?: string;
  initialStock: number;
  currentStock: number;
  purchasePrice: number;
  salePrice: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Sale {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  profit: number;
  date: Date;
}

export interface Expense {
  id: string;
  amount: number;
  description: string;
  category?: string;
  date: Date;
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
