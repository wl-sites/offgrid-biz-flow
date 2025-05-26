
import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useData } from '../hooks/useData';
import AuthScreen from '../components/AuthScreen';
import ConfigScreen from '../components/ConfigScreen';
import Dashboard from '../components/Dashboard';
import ProductManager from '../components/ProductManager';
import SalesManager from '../components/SalesManager';
import ExpenseManager from '../components/ExpenseManager';
import BottomNavigation from '../components/BottomNavigation';

const Index = () => {
  const { user, isLoading, login, register, logout, updateUserConfig } = useAuth();
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
  } = useData();
  
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showConfig, setShowConfig] = useState(false);

  useEffect(() => {
    if (user && !user.language) {
      setShowConfig(true);
    }
  }, [user]);

  const handleConfigComplete = (language: 'fr' | 'en' | 'sw', currency: 'USD' | 'CDF' | 'EUR') => {
    updateUserConfig(language, currency);
    setShowConfig(false);
  };

  const handleRegister = async (email: string, password: string, currency: 'USD' | 'CDF' | 'EUR') => {
    return await register(email, password, currency);
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

  if (!user) {
    return <AuthScreen onLogin={login} onRegister={handleRegister} />;
  }

  if (showConfig) {
    return <ConfigScreen onConfigComplete={handleConfigComplete} />;
  }

  const renderActiveTab = () => {
    const stats = getDashboardStats();
    
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard stats={stats} user={user} />;
      case 'products':
        return (
          <ProductManager
            products={products}
            user={user}
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
            user={user}
            onAddSale={addSale}
          />
        );
      case 'expenses':
        return (
          <ExpenseManager
            expenses={expenses}
            user={user}
            onAddExpense={addExpense}
            onDeleteExpense={deleteExpense}
          />
        );
      default:
        return <Dashboard stats={stats} user={user} />;
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
