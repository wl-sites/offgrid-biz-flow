
import React, { useState } from 'react';
import { useSupabaseAuth } from '../hooks/useSupabaseAuth';
import { useSupabaseData } from '../hooks/useSupabaseData';
import AuthPage from '../components/AuthPage';
import ConfigScreen from '../components/ConfigScreen';
import Dashboard from '../components/Dashboard';
import ProductManager from '../components/ProductManager';
import SalesManager from '../components/SalesManager';
import ExpenseManager from '../components/ExpenseManager';
import BottomNavigation from '../components/BottomNavigation';

const Index = () => {
  const { user, isLoading, signOut, updateUserConfig } = useSupabaseAuth();
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
  } = useSupabaseData(user?.id || null);
  
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showConfig, setShowConfig] = useState(false);

  const handleConfigComplete = async (language: 'fr' | 'en' | 'sw', currency: 'USD' | 'CDF' | 'EUR') => {
    await updateUserConfig(language, currency);
    setShowConfig(false);
  };

  const handleLogout = async () => {
    await signOut();
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
    return <AuthPage />;
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
        onLogout={handleLogout}
      />
    </div>
  );
};

export default Index;
