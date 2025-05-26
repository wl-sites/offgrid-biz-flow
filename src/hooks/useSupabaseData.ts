
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Product, Sale, Expense, DashboardStats } from '../types';

export const useSupabaseData = (userId: string | null) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);

  useEffect(() => {
    if (userId) {
      loadData();
    }
  }, [userId]);

  const loadData = async () => {
    if (!userId) return;

    const [productsData, salesData, expensesData] = await Promise.all([
      supabase.from('products').select('*').eq('user_id', userId),
      supabase.from('sales').select('*').eq('user_id', userId),
      supabase.from('expenses').select('*').eq('user_id', userId)
    ]);

    if (productsData.data) setProducts(productsData.data);
    if (salesData.data) setSales(salesData.data);
    if (expensesData.data) setExpenses(expensesData.data);
  };

  const addProduct = async (productData: Omit<Product, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!userId) return false;

    const { error } = await supabase
      .from('products')
      .insert({
        ...productData,
        user_id: userId,
        current_stock: productData.initial_stock
      });

    if (!error) {
      loadData();
      return true;
    }
    return false;
  };

  const updateProduct = async (productId: string, updates: Partial<Product>) => {
    const { error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', productId)
      .eq('user_id', userId);

    if (!error) {
      loadData();
    }
    return !error;
  };

  const deleteProduct = async (productId: string) => {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', productId)
      .eq('user_id', userId);

    if (!error) {
      loadData();
    }
    return !error;
  };

  const addSale = async (productId: string, quantity: number) => {
    if (!userId) return false;

    const product = products.find(p => p.id === productId);
    if (!product || product.current_stock < quantity) return false;

    const profit = (product.sale_price - product.purchase_price) * quantity;
    
    const { error: saleError } = await supabase
      .from('sales')
      .insert({
        user_id: userId,
        product_id: productId,
        product_name: product.name,
        quantity,
        unit_price: product.sale_price,
        total_amount: product.sale_price * quantity,
        profit
      });

    if (!saleError) {
      // Update product stock
      await supabase
        .from('products')
        .update({ current_stock: product.current_stock - quantity })
        .eq('id', productId);
      
      loadData();
      return true;
    }
    return false;
  };

  const addExpense = async (expenseData: Omit<Expense, 'id' | 'user_id'>) => {
    if (!userId) return false;

    const { error } = await supabase
      .from('expenses')
      .insert({
        ...expenseData,
        user_id: userId
      });

    if (!error) {
      loadData();
      return true;
    }
    return false;
  };

  const deleteExpense = async (expenseId: string) => {
    const { error } = await supabase
      .from('expenses')
      .delete()
      .eq('id', expenseId)
      .eq('user_id', userId);

    if (!error) {
      loadData();
    }
    return !error;
  };

  const getDashboardStats = (): DashboardStats => {
    const totalRevenue = sales.reduce((sum, sale) => sum + sale.total_amount, 0);
    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    
    const totalSalesProfit = sales.reduce((sum, sale) => sum + sale.profit, 0);
    const netProfit = totalSalesProfit - totalExpenses;

    const productProfits = products.map(product => {
      const productSales = sales.filter(sale => sale.product_id === product.id);
      const totalProfit = productSales.reduce((sum, sale) => sum + sale.profit, 0);
      const unitsSold = productSales.reduce((sum, sale) => sum + sale.quantity, 0);
      
      return {
        productId: product.id,
        productName: product.name,
        totalProfit,
        unitsSold
      };
    }).filter(item => item.unitsSold > 0);

    return {
      totalRevenue,
      totalExpenses,
      netProfit,
      productProfits
    };
  };

  return {
    products,
    sales,
    expenses,
    addProduct,
    updateProduct,
    deleteProduct,
    addSale,
    addExpense,
    deleteExpense,
    getDashboardStats
  };
};
