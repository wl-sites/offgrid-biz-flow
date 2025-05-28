
import React, { useState, useEffect } from 'react';
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

  // Reset product selection when products change or when stock becomes 0
  useEffect(() => {
    if (selectedProductId) {
      const selectedProduct = products.find(p => p.id === selectedProductId);
      if (!selectedProduct || selectedProduct.currentStock === 0) {
        console.log('Resetting product selection - stock is 0 or product not found');
        setSelectedProductId('');
        setQuantity(1);
      } else if (quantity > selectedProduct.currentStock) {
        // Ajuster la quantité si elle dépasse le stock disponible
        setQuantity(selectedProduct.currentStock);
      }
    }
  }, [products, selectedProductId, quantity]);

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

    const selectedProduct = products.find(p => p.id === selectedProductId);
    if (!selectedProduct || selectedProduct.currentStock < quantity) {
      toast({
        title: "Erreur",
        description: "Stock insuffisant pour cette vente",
        variant: "destructive"
      });
      return;
    }

    console.log('Attempting sale:', {
      productId: selectedProductId,
      productName: selectedProduct.name,
      quantity,
      currentStock: selectedProduct.currentStock
    });

    const success = await onAddSale(selectedProductId, quantity);
    
    if (success) {
      toast({
        title: "Succès",
        description: `Vente de ${quantity} ${selectedProduct.name} enregistrée - Stock mis à jour`
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

  // Filtre les produits avec stock disponible
  const availableProducts = products.filter(p => p.currentStock > 0);

  console.log('SalesManager render - Available products:', availableProducts.length);
  console.log('Products with stock:', availableProducts.map(p => ({ id: p.id, name: p.name, stock: p.currentStock })));

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
                  {availableProducts.map((product) => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.name} (Stock: {product.currentStock})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {availableProducts.length === 0 && (
                <p className="text-sm text-red-600 mt-1">Aucun produit en stock disponible</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">
                {t('sales.quantity', user.language)}
              </label>
              <Input
                type="number"
                min="1"
                max={selectedProductId ? products.find(p => p.id === selectedProductId)?.currentStock || 1 : 1}
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                required
              />
            </div>
            
            <Button type="submit" className="w-full" disabled={!selectedProductId || availableProducts.length === 0}>
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
