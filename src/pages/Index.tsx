
import React, { useState, useEffect } from 'react';
import { useFirebaseAuth } from '../hooks/useFirebaseAuth';
import { useFirebaseData } from '../hooks/useFirebaseData';
import AuthScreen from '../components/AuthScreen';
import ConfigScreen from '../components/ConfigScreen';
import Dashboard from '../components/Dashboard';
import ProductManager from '../components/ProductManager';
import SalesManager from '../components/SalesManager';
import ExpenseManager from '../components/ExpenseManager';
import Settings from '../components/Settings';
import BottomNavigation from '../components/BottomNavigation';
import { User } from '../types';
import { Wifi, WifiOff } from 'lucide-react';

const Index = () => {
  const { user: firebaseUser, isLoading, login, logout } = useFirebaseAuth();
  const {
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

  const handleUpdateConfig = (language: 'fr' | 'en' | 'sw', currency: 'USD' | 'CDF' | 'EUR') => {
    if (firebaseUser) {
      const updatedConfig: User = {
        id: firebaseUser.uid,
        email: firebaseUser.email || '',
        language,
        currency
      };
      setUserConfig(updatedConfig);
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
      case 'settings':
        return (
          <Settings
            user={userConfig}
            onUpdateConfig={handleUpdateConfig}
            onLogout={logout}
          />
        );
      default:
        return <Dashboard stats={stats} user={userConfig} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Indicateur de connexion */}
      <div className={`fixed top-0 left-0 right-0 z-50 p-2 text-center text-sm ${
        isConnected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
      }`}>
        <div className="flex items-center justify-center gap-2">
          {isConnected ? (
            <>
              <Wifi className="w-4 h-4" />
              <span>Connecté - Données synchronisées</span>
            </>
          ) : (
            <>
              <WifiOff className="w-4 h-4" />
              <span>Hors ligne - Vérifiez votre connexion</span>
            </>
          )}
        </div>
      </div>
      
      <div className="pb-20 pt-12">
        {renderActiveTab()}
      </div>
      <BottomNavigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
    </div>
  );
};

export default Index;
