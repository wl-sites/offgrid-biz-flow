
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Product, Sale, User } from '../types';
import { t, formatCurrency } from '../utils/i18n';
import { useToast } from '@/hooks/use-toast';

interface SalesManagerProps {
  products: Product[];
  sales: Sale[];
  user: User;
  onAddSale: (productId: string, quantity: number) => Promise<boolean>;
}

const SalesManager: React.FC<SalesManagerProps> = ({
  products,
  sales,
  user,
  onAddSale
}) => {
  const [selectedProductId, setSelectedProductId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedProductId) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un produit",
        variant: "destructive"
      });
      return;
    }

    const success = await onAddSale(selectedProductId, quantity);
    
    if (success) {
      toast({
        title: "Succès",
        description: "Vente ajoutée avec succès"
      });
      setSelectedProductId('');
      setQuantity(1);
    } else {
      toast({
        title: "Erreur",
        description: "Stock insuffisant ou erreur lors de la vente",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6 p-4">
      <h1 className="text-2xl font-bold text-gray-900">{t('sales.title', user.language)}</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>{t('sales.addSale', user.language)}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                {t('sales.selectProduct', user.language)}
              </label>
              <Select value={selectedProductId} onValueChange={setSelectedProductId}>
                <SelectTrigger>
                  <SelectValue placeholder={t('sales.selectProduct', user.language)} />
                </SelectTrigger>
                <SelectContent>
                  {products.filter(p => p.currentStock > 0).map((product) => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.name} (Stock: {product.currentStock})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">
                {t('sales.quantity', user.language)}
              </label>
              <Input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                required
              />
            </div>
            
            <Button type="submit" className="w-full">
              {t('sales.addSale', user.language)}
            </Button>
          </form>
        </CardContent>
      </Card>

      {sales.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Historique des ventes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {sales.map((sale) => (
                <div key={sale.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{sale.productName}</p>
                    <p className="text-sm text-gray-600">
                      {sale.quantity} × {formatCurrency(sale.unitPrice, user.currency)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {sale.date.toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">
                      {formatCurrency(sale.totalAmount, user.currency)}
                    </p>
                    <p className="text-sm text-green-600">
                      Profit: {formatCurrency(sale.profit, user.currency)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SalesManager;
