
import { useState, useEffect } from 'react';
import { Product, Sale, Expense, DashboardStats } from '../types';
import { storage } from '../utils/storage';

export const useData = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setProducts(storage.getProducts());
    setSales(storage.getSales());
    setExpenses(storage.getExpenses());
  };

  const addProduct = (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'currentStock'>) => {
    const product: Product = {
      ...productData,
      id: Date.now().toString(),
      currentStock: productData.initialStock,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    storage.addProduct(product);
    loadData();
  };

  const updateProduct = (productId: string, updates: Partial<Product>) => {
    storage.updateProduct(productId, updates);
    loadData();
  };

  const deleteProduct = (productId: string) => {
    storage.deleteProduct(productId);
    loadData();
  };

  const addSale = (productId: string, quantity: number) => {
    const product = products.find(p => p.id === productId);
    if (product && product.currentStock >= quantity) {
      const profit = (product.salePrice - product.purchasePrice) * quantity;
      const sale: Sale = {
        id: Date.now().toString(),
        productId,
        productName: product.name,
        quantity,
        unitPrice: product.salePrice,
        totalAmount: product.salePrice * quantity,
        profit,
        date: new Date()
      };
      storage.addSale(sale);
      loadData();
      return true;
    }
    return false;
  };

  const addExpense = (expenseData: Omit<Expense, 'id'>) => {
    const expense: Expense = {
      ...expenseData,
      id: Date.now().toString()
    };
    storage.addExpense(expense);
    loadData();
  };

  const deleteExpense = (expenseId: string) => {
    storage.deleteExpense(expenseId);
    loadData();
  };

  const getDashboardStats = (): DashboardStats => {
    const totalRevenue = sales.reduce((sum, sale) => sum + sale.totalAmount, 0);
    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    
    // Calcul du bénéfice net = total des profits des ventes - total des dépenses
    const totalSalesProfit = sales.reduce((sum, sale) => sum + sale.profit, 0);
    const netProfit = totalSalesProfit - totalExpenses;

    const productProfits = products.map(product => {
      const productSales = sales.filter(sale => sale.productId === product.id);
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
