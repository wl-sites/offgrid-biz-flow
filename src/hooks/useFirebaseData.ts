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
  Timestamp,
  enableNetwork,
  disableNetwork
} from 'firebase/firestore';
import { db } from '../utils/firebase';
import { Product, Sale, Expense, DashboardStats } from '../types';

export const useFirebaseData = (userId: string | undefined) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    if (!userId) {
      console.log('No userId provided, clearing all data');
      setProducts([]);
      setSales([]);
      setExpenses([]);
      return;
    }

    console.log('Setting up Firebase listeners for user:', userId);

    // Ensure network is enabled
    enableNetwork(db).then(() => {
      console.log('Firebase network enabled');
      setIsConnected(true);
    }).catch((error) => {
      console.error('Error enabling Firebase network:', error);
      setIsConnected(false);
    });

    // Écouter les produits de l'utilisateur en temps réel
    const productsQuery = query(
      collection(db, 'products'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );

    const unsubscribeProducts = onSnapshot(productsQuery, (snapshot) => {
      const productsData = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date()
        };
      }) as Product[];
      console.log('Products updated from Firebase:', productsData.length, 'products loaded');
      console.log('Products stock data:', productsData.map(p => ({ id: p.id, name: p.name, stock: p.currentStock })));
      setProducts(productsData);
    }, (error) => {
      console.error('Erreur lors de l\'écoute des produits:', error);
      setIsConnected(false);
    });

    // Écouter les ventes de l'utilisateur en temps réel
    const salesQuery = query(
      collection(db, 'sales'),
      where('userId', '==', userId),
      orderBy('date', 'desc')
    );

    const unsubscribeSales = onSnapshot(salesQuery, (snapshot) => {
      const salesData = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          date: data.date?.toDate() || new Date()
        };
      }) as Sale[];
      console.log('Sales updated from Firebase:', salesData.length, 'sales loaded');
      setSales(salesData);
    }, (error) => {
      console.error('Erreur lors de l\'écoute des ventes:', error);
      setIsConnected(false);
    });

    // Écouter les dépenses de l'utilisateur en temps réel
    const expensesQuery = query(
      collection(db, 'expenses'),
      where('userId', '==', userId),
      orderBy('date', 'desc')
    );

    const unsubscribeExpenses = onSnapshot(expensesQuery, (snapshot) => {
      const expensesData = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          date: data.date?.toDate() || new Date()
        };
      }) as Expense[];
      console.log('Expenses updated from Firebase:', expensesData.length, 'expenses loaded');
      setExpenses(expensesData);
    }, (error) => {
      console.error('Erreur lors de l\'écoute des dépenses:', error);
      setIsConnected(false);
    });

    return () => {
      console.log('Cleaning up Firebase listeners');
      unsubscribeProducts();
      unsubscribeSales();
      unsubscribeExpenses();
    };
  }, [userId]);

  const addProduct = async (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!userId) {
      console.error('Cannot add product: no userId');
      return;
    }

    try {
      console.log('Adding product to Firebase:', productData);
      const docRef = await addDoc(collection(db, 'products'), {
        ...productData,
        userId,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
      console.log('Product added successfully with ID:', docRef.id);
    } catch (error) {
      console.error('Erreur lors de l\'ajout du produit:', error);
      throw error;
    }
  };

  const updateProduct = async (productId: string, updates: Partial<Product>) => {
    if (!userId) {
      console.error('Cannot update product: no userId');
      return;
    }

    try {
      console.log('Updating product in Firebase:', productId, updates);
      
      // Mise à jour locale immédiate pour la réactivité
      setProducts(prevProducts => 
        prevProducts.map(product => 
          product.id === productId 
            ? { ...product, ...updates, updatedAt: new Date() }
            : product
        )
      );

      // Mise à jour Firebase
      const productRef = doc(db, 'products', productId);
      await updateDoc(productRef, {
        ...updates,
        updatedAt: Timestamp.now()
      });
      
      console.log('Product updated successfully in Firebase');
    } catch (error) {
      console.error('Erreur lors de la mise à jour du produit:', error);
      // En cas d'erreur, recharger les données depuis Firebase
      throw error;
    }
  };

  const deleteProduct = async (productId: string) => {
    if (!userId) {
      console.error('Cannot delete product: no userId');
      return;
    }

    try {
      console.log('Deleting product from Firebase:', productId);
      await deleteDoc(doc(db, 'products', productId));
      console.log('Product deleted successfully');
    } catch (error) {
      console.error('Erreur lors de la suppression du produit:', error);
      throw error;
    }
  };

  const addSale = async (productId: string, quantity: number) => {
    if (!userId) {
      console.error('Cannot add sale: no userId');
      return false;
    }

    const product = products.find(p => p.id === productId);
    if (!product || product.currentStock < quantity) {
      console.log('Stock insuffisant pour le produit:', productId, 'Stock:', product?.currentStock, 'Demandé:', quantity);
      return false;
    }

    try {
      const profit = (product.salePrice - product.purchasePrice) * quantity;
      const newStock = product.currentStock - quantity;
      
      console.log('Processing sale:', {
        productId,
        productName: product.name,
        quantity,
        currentStock: product.currentStock,
        newStock
      });
      
      // Mise à jour locale immédiate du stock pour la réactivité
      setProducts(prevProducts => 
        prevProducts.map(p => 
          p.id === productId 
            ? { ...p, currentStock: newStock, updatedAt: new Date() }
            : p
        )
      );

      // Ajouter la vente à Firebase
      const saleDocRef = await addDoc(collection(db, 'sales'), {
        productId,
        productName: product.name,
        quantity,
        unitPrice: product.salePrice,
        totalAmount: product.salePrice * quantity,
        profit,
        userId,
        date: Timestamp.now()
      });

      // Mettre à jour le stock dans Firebase
      const productRef = doc(db, 'products', productId);
      await updateDoc(productRef, {
        currentStock: newStock,
        updatedAt: Timestamp.now()
      });

      console.log('Sale added with ID:', saleDocRef.id, 'and stock updated from', product.currentStock, 'to', newStock);
      return true;
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la vente:', error);
      // En cas d'erreur, restaurer l'état local
      setProducts(prevProducts => 
        prevProducts.map(p => 
          p.id === productId 
            ? { ...p, currentStock: product.currentStock }
            : p
        )
      );
      return false;
    }
  };

  const addExpense = async (expenseData: Omit<Expense, 'id'>) => {
    if (!userId) {
      console.error('Cannot add expense: no userId');
      return;
    }

    try {
      console.log('Adding expense to Firebase:', expenseData);
      const docRef = await addDoc(collection(db, 'expenses'), {
        ...expenseData,
        userId,
        date: Timestamp.now()
      });
      console.log('Expense added successfully with ID:', docRef.id);
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la dépense:', error);
      throw error;
    }
  };

  const deleteExpense = async (expenseId: string) => {
    if (!userId) {
      console.error('Cannot delete expense: no userId');
      return;
    }

    try {
      console.log('Deleting expense from Firebase:', expenseId);
      await deleteDoc(doc(db, 'expenses', expenseId));
      console.log('Expense deleted successfully');
    } catch (error) {
      console.error('Erreur lors de la suppression de la dépense:', error);
      throw error;
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
    isConnected,
    addProduct,
    updateProduct,
    deleteProduct,
    addSale,
    addExpense,
    deleteExpense,
    getDashboardStats
  };
};
