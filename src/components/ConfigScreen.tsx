
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { t } from '../utils/i18n';

interface ConfigScreenProps {
  onConfigComplete: (language: 'fr' | 'en' | 'sw', currency: 'USD' | 'CDF' | 'EUR') => void;
}

const ConfigScreen: React.FC<ConfigScreenProps> = ({ onConfigComplete }) => {
  const [language, setLanguage] = useState<'fr' | 'en' | 'sw'>('fr');
  const [currency, setCurrency] = useState<'USD' | 'CDF' | 'EUR'>('USD');

  const handleSave = () => {
    onConfigComplete(language, currency);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-blue-900">Configuration</CardTitle>
          <CardDescription>Configurez votre application</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">{t('config.language', language)}</label>
            <Select value={language} onValueChange={(value: 'fr' | 'en' | 'sw') => setLanguage(value)}>
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
            <label className="text-sm font-medium">{t('config.currency', language)}</label>
            <Select value={currency} onValueChange={(value: 'USD' | 'CDF' | 'EUR') => setCurrency(value)}>
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
          
          <Button 
            className="w-full bg-blue-600 hover:bg-blue-700" 
            onClick={handleSave}
          >
            {t('config.save', language)}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ConfigScreen;
