
import React, { useState, useEffect } from 'react';
import { useFirebaseAuth } from '../hooks/useFirebaseAuth';
import { useFirebaseData } from '../hooks/useFirebaseData';
import AuthScreen from '../components/AuthScreen';
import ConfigScreen from '../components/ConfigScreen';
import Dashboard from '../components/Dashboard';
import ProductManager from '../components/ProductManager';
import SalesManager from '../components/SalesManager';
import ExpenseManager from '../components/ExpenseManager';
import BottomNavigation from '../components/BottomNavigation';
import { User } from '../types';

const Index = () => {
  const { user: firebaseUser, isLoading, login, logout } = useFirebaseAuth();
  const {
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
  } = useFirebaseData(firebaseUser?.uid);
  
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showConfig, setShowConfig] = useState(false);
  const [userConfig, setUserConfig] = useState<User | null>(null);

  useEffect(() => {
    if (firebaseUser && !userConfig) {
      // Configuration par défaut pour les nouveaux utilisateurs
      const defaultConfig: User = {
        id: firebaseUser.uid,
        email: firebaseUser.email || '',
        language: 'fr',
        currency: 'USD'
      };
      setUserConfig(defaultConfig);
      setShowConfig(true);
    }
  }, [firebaseUser, userConfig]);

  const handleConfigComplete = (language: 'fr' | 'en' | 'sw', currency: 'USD' | 'CDF' | 'EUR') => {
    if (firebaseUser) {
      const updatedConfig: User = {
        id: firebaseUser.uid,
        email: firebaseUser.email || '',
        language,
        currency
      };
      setUserConfig(updatedConfig);
      setShowConfig(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Chargement...</p>
        </div>
      </div>
    );
  }

  if (!firebaseUser) {
    return <AuthScreen onLogin={login} />;
  }

  if (showConfig || !userConfig) {
    return <ConfigScreen onConfigComplete={handleConfigComplete} />;
  }

  const renderActiveTab = () => {
    const stats = getDashboardStats();
    
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard stats={stats} user={userConfig} />;
      case 'products':
        return (
          <ProductManager
            products={products}
            user={userConfig}
            onAddProduct={addProduct}
            onUpdateProduct={updateProduct}
            onDeleteProduct={deleteProduct}
          />
        );
      case 'sales':
        return (
          <SalesManager
            products={products}
            sales={sales}
            user={userConfig}
            onAddSale={addSale}
          />
        );
      case 'expenses':
        return (
          <ExpenseManager
            expenses={expenses}
            user={userConfig}
            onAddExpense={addExpense}
            onDeleteExpense={deleteExpense}
          />
        );
      default:
        return <Dashboard stats={stats} user={userConfig} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="pb-20">
        {renderActiveTab()}
      </div>
      <BottomNavigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onLogout={logout}
      />
    </div>
  );
};

export default Index;
