
import { useState, useEffect } from 'react';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  onSnapshot,
  orderBy,
  Timestamp 
} from 'firebase/firestore';
import { db } from '../utils/firebase';
import { Product, Sale, Expense, DashboardStats } from '../types';

export const useFirebaseData = (userId: string | undefined) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);

  useEffect(() => {
    if (!userId) {
      setProducts([]);
      setSales([]);
      setExpenses([]);
      return;
    }

    // Écouter les produits de l'utilisateur
    const productsQuery = query(
      collection(db, 'products'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );

    const unsubscribeProducts = onSnapshot(productsQuery, (snapshot) => {
      const productsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date()
      })) as Product[];
      setProducts(productsData);
    });

    // Écouter les ventes de l'utilisateur
    const salesQuery = query(
      collection(db, 'sales'),
      where('userId', '==', userId),
      orderBy('date', 'desc')
    );

    const unsubscribeSales = onSnapshot(salesQuery, (snapshot) => {
      const salesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date?.toDate() || new Date()
      })) as Sale[];
      setSales(salesData);
    });

    // Écouter les dépenses de l'utilisateur
    const expensesQuery = query(
      collection(db, 'expenses'),
      where('userId', '==', userId),
      orderBy('date', 'desc')
    );

    const unsubscribeExpenses = onSnapshot(expensesQuery, (snapshot) => {
      const expensesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date?.toDate() || new Date()
      })) as Expense[];
      setExpenses(expensesData);
    });

    return () => {
      unsubscribeProducts();
      unsubscribeSales();
      unsubscribeExpenses();
    };
  }, [userId]);

  const addProduct = async (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!userId) return;

    try {
      await addDoc(collection(db, 'products'), {
        ...productData,
        userId,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
    } catch (error) {
      console.error('Erreur lors de l\'ajout du produit:', error);
    }
  };

  const updateProduct = async (productId: string, updates: Partial<Product>) => {
    if (!userId) return;

    try {
      await updateDoc(doc(db, 'products', productId), {
        ...updates,
        updatedAt: Timestamp.now()
      });
    } catch (error) {
      console.error('Erreur lors de la mise à jour du produit:', error);
    }
  };

  const deleteProduct = async (productId: string) => {
    if (!userId) return;

    try {
      await deleteDoc(doc(db, 'products', productId));
    } catch (error) {
      console.error('Erreur lors de la suppression du produit:', error);
    }
  };

  const addSale = async (productId: string, quantity: number) => {
    if (!userId) return false;

    const product = products.find(p => p.id === productId);
    if (!product || product.currentStock < quantity) return false;

    try {
      const profit = (product.salePrice - product.purchasePrice) * quantity;
      
      // Ajouter la vente
      await addDoc(collection(db, 'sales'), {
        productId,
        productName: product.name,
        quantity,
        unitPrice: product.salePrice,
        totalAmount: product.salePrice * quantity,
        profit,
        userId,
        date: Timestamp.now()
      });

      // Mettre à jour le stock
      await updateProduct(productId, {
        currentStock: product.currentStock - quantity
      });

      return true;
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la vente:', error);
      return false;
    }
  };

  const addExpense = async (expenseData: Omit<Expense, 'id'>) => {
    if (!userId) return;

    try {
      await addDoc(collection(db, 'expenses'), {
        ...expenseData,
        userId,
        date: Timestamp.now()
      });
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la dépense:', error);
    }
  };

  const deleteExpense = async (expenseId: string) => {
    if (!userId) return;

    try {
      await deleteDoc(doc(db, 'expenses', expenseId));
    } catch (error) {
      console.error('Erreur lors de la suppression de la dépense:', error);
    }
  };

  const getDashboardStats = (): DashboardStats => {
    const totalRevenue = sales.reduce((sum, sale) => sum + sale.totalAmount, 0);
    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    
    // Calculate total profits from all products sold
    const totalProductProfits = sales.reduce((sum, sale) => sum + sale.profit, 0);
    
    // Net profit = Total profits from products - Total expenses
    const netProfit = totalProductProfits - totalExpenses;

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
