
import React from 'react';
import { Button } from '@/components/ui/button';
import { Home, Package, TrendingUp, DollarSign, LogOut } from 'lucide-react';

interface BottomNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onLogout: () => void;
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({
  activeTab,
  onTabChange,
  onLogout
}) => {
  const tabs = [
    { id: 'dashboard', icon: Home, label: 'Accueil' },
    { id: 'products', icon: Package, label: 'Produits' },
    { id: 'sales', icon: TrendingUp, label: 'Ventes' },
    { id: 'expenses', icon: DollarSign, label: 'Dépenses' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 safe-area-pb">
      <div className="flex justify-between items-center max-w-md mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "default" : "ghost"}
              size="sm"
              onClick={() => onTabChange(tab.id)}
              className="flex-1 flex flex-col items-center py-2 h-auto"
            >
              <Icon className="w-5 h-5 mb-1" />
              <span className="text-xs">{tab.label}</span>
            </Button>
          );
        })}
        <Button
          variant="ghost"
          size="sm"
          onClick={onLogout}
          className="flex-1 flex flex-col items-center py-2 h-auto text-red-600"
        >
          <LogOut className="w-5 h-5 mb-1" />
          <span className="text-xs">Sortir</span>
        </Button>
      </div>
    </div>
  );
};

export default BottomNavigation;
