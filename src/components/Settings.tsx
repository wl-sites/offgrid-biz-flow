
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User } from '../types';
import { t } from '../utils/i18n';
import { LogOut } from 'lucide-react';

interface SettingsProps {
  user: User;
  onUpdateConfig: (language: 'fr' | 'en' | 'sw', currency: 'USD' | 'CDF' | 'EUR') => void;
  onLogout: () => void;
}

const Settings: React.FC<SettingsProps> = ({ user, onUpdateConfig, onLogout }) => {
  const handleLanguageChange = (language: 'fr' | 'en' | 'sw') => {
    onUpdateConfig(language, user.currency);
  };

  const handleCurrencyChange = (currency: 'USD' | 'CDF' | 'EUR') => {
    onUpdateConfig(user.language, currency);
  };

  return (
    <div className="space-y-6 p-4">
      <h1 className="text-2xl font-bold text-gray-900">
        {t('common.settings', user.language)}
      </h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Préférences de l'application</CardTitle>
          <CardDescription>
            Configurez votre langue et votre devise préférées
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">
              {t('config.language', user.language)}
            </label>
            <Select value={user.language} onValueChange={handleLanguageChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fr">Français</SelectItem>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="sw">Kiswahili</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">
              {t('config.currency', user.language)}
            </label>
            <Select value={user.currency} onValueChange={handleCurrencyChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USD">USD ($)</SelectItem>
                <SelectItem value="EUR">EUR (€)</SelectItem>
                <SelectItem value="CDF">CDF (FC)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Compte</CardTitle>
          <CardDescription>Gérez votre compte utilisateur</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-600">Email</label>
              <p className="text-gray-900">{user.email}</p>
            </div>
            
            <Button 
              onClick={onLogout}
              variant="destructive"
              className="w-full"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Se déconnecter
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
