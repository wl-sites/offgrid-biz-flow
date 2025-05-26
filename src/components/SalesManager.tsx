
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Product, Sale, User } from '../types';
import { t, formatCurrency } from '../utils/i18n';
import { Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SalesManagerProps {
  products: Product[];
  sales: Sale[];
  user: User;
  onAddSale: (productId: string, quantity: number) => boolean;
}

const SalesManager: React.FC<SalesManagerProps> = ({
  products,
  sales,
  user,
  onAddSale
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const { toast } = useToast();

  const handleSubmit = () => {
    if (!selectedProductId) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Veuillez sélectionner un produit"
      });
      return;
    }

    const success = onAddSale(selectedProductId, quantity);
    if (success) {
      setSelectedProductId('');
      setQuantity(1);
      setIsDialogOpen(false);
      toast({
        title: "Vente ajoutée",
        description: "La vente a été enregistrée avec succès"
      });
    } else {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Stock insuffisant pour cette vente"
      });
    }
  };

  const selectedProduct = products.find(p => p.id === selectedProductId);
  const totalAmount = selectedProduct ? selectedProduct.salePrice * quantity : 0;

  return (
    <div className="space-y-6 p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">{t('sales.title', user.language)}</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-green-600 hover:bg-green-700">
              <Plus className="w-4 h-4 mr-2" />
              {t('sales.addSale', user.language)}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{t('sales.addSale', user.language)}</DialogTitle>
              <DialogDescription>
                Enregistrez une nouvelle vente
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">{t('sales.selectProduct', user.language)}</label>
                <Select value={selectedProductId} onValueChange={setSelectedProductId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choisir un produit" />
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
              
              {selectedProduct && (
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm">Prix unitaire: {formatCurrency(selectedProduct.salePrice, user.currency)}</p>
                  <p className="text-sm">Stock disponible: {selectedProduct.currentStock}</p>
                </div>
              )}
              
              <div>
                <label className="text-sm font-medium">{t('sales.quantity', user.language)}</label>
                <Input
                  type="number"
                  min="1"
                  max={selectedProduct?.currentStock || 1}
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                />
              </div>
              
              {selectedProduct && (
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="font-medium">Total: {formatCurrency(totalAmount, user.currency)}</p>
                  <p className="text-sm text-gray-600">
                    Bénéfice: {formatCurrency((selectedProduct.salePrice - selectedProduct.purchasePrice) * quantity, user.currency)}
                  </p>
                </div>
              )}
              
              <div className="flex gap-2">
                <Button className="flex-1" onClick={handleSubmit}>
                  {t('common.save', user.language)}
                </Button>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  {t('common.cancel', user.language)}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {sales.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center text-gray-500">
              Aucune vente enregistrée
            </CardContent>
          </Card>
        ) : (
          sales.slice().reverse().map((sale) => (
            <Card key={sale.id}>
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">{sale.productName}</h3>
                    <p className="text-sm text-gray-600">
                      {new Date(sale.date).toLocaleDateString()} - {sale.quantity} unité(s)
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{formatCurrency(sale.totalAmount, user.currency)}</p>
                    <p className="text-sm text-green-600">
                      Bénéfice: {formatCurrency(sale.profit, user.currency)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default SalesManager;
