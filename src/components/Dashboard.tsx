
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardStats, User } from '../types';
import { t, formatCurrency } from '../utils/i18n';

interface DashboardProps {
  stats: DashboardStats;
  user: User;
}

const Dashboard: React.FC<DashboardProps> = ({ stats, user }) => {
  return (
    <div className="space-y-6 p-4">
      <h1 className="text-2xl font-bold text-gray-900">{t('dashboard.title', user.language)}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-green-50 border-green-200">
          <CardHeader className="pb-2">
            <CardDescription className="text-green-700">
              {t('dashboard.totalRevenue', user.language)}
            </CardDescription>
            <CardTitle className="text-2xl text-green-800">
              {formatCurrency(stats.totalRevenue, user.currency)}
            </CardTitle>
          </CardHeader>
        </Card>
        
        <Card className="bg-red-50 border-red-200">
          <CardHeader className="pb-2">
            <CardDescription className="text-red-700">
              {t('dashboard.totalExpenses', user.language)}
            </CardDescription>
            <CardTitle className="text-2xl text-red-800">
              {formatCurrency(stats.totalExpenses, user.currency)}
            </CardTitle>
          </CardHeader>
        </Card>
        
        <Card className={`${stats.netProfit >= 0 ? 'bg-blue-50 border-blue-200' : 'bg-red-50 border-red-200'}`}>
          <CardHeader className="pb-2">
            <CardDescription className={stats.netProfit >= 0 ? 'text-blue-700' : 'text-red-700'}>
              {t('dashboard.netProfit', user.language)}
            </CardDescription>
            <CardTitle className={`text-2xl ${stats.netProfit >= 0 ? 'text-blue-800' : 'text-red-800'}`}>
              {formatCurrency(stats.netProfit, user.currency)}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>
      
      {stats.productProfits.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Gains par produit</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.productProfits.map((item) => (
                <div key={item.productId} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{item.productName}</p>
                    <p className="text-sm text-gray-600">{item.unitsSold} unités vendues</p>
                  </div>
                  <p className="font-bold text-green-600">
                    {formatCurrency(item.totalProfit, user.currency)}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Dashboard;
