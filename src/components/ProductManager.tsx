
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Product, User } from '../types';
import { t, formatCurrency } from '../utils/i18n';
import { Plus, Edit, Trash2 } from 'lucide-react';

interface ProductManagerProps {
  products: Product[];
  user: User;
  onAddProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'currentStock'>) => void;
  onUpdateProduct: (productId: string, updates: Partial<Product>) => void;
  onDeleteProduct: (productId: string) => void;
}

const ProductManager: React.FC<ProductManagerProps> = ({
  products,
  user,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    subcategory: '',
    initialStock: 0,
    purchasePrice: 0,
    salePrice: 0
  });

  const resetForm = () => {
    setFormData({
      name: '',
      category: '',
      subcategory: '',
      initialStock: 0,
      purchasePrice: 0,
      salePrice: 0
    });
    setEditingProduct(null);
  };

  const handleSubmit = () => {
    if (editingProduct) {
      onUpdateProduct(editingProduct.id, formData);
    } else {
      onAddProduct(formData);
    }
    resetForm();
    setIsDialogOpen(false);
  };

  const handleEdit = (product: Product) => {
    setFormData({
      name: product.name,
      category: product.category,
      subcategory: product.subcategory || '',
      initialStock: product.initialStock,
      purchasePrice: product.purchasePrice,
      salePrice: product.salePrice
    });
    setEditingProduct(product);
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-6 p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">{t('products.title', user.language)}</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={resetForm}>
              <Plus className="w-4 h-4 mr-2" />
              {t('products.addProduct', user.language)}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingProduct ? t('common.edit', user.language) : t('products.addProduct', user.language)}
              </DialogTitle>
              <DialogDescription>
                Remplissez les informations du produit
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">{t('products.name', user.language)}</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Nom du produit"
                />
              </div>
              <div>
                <label className="text-sm font-medium">{t('products.category', user.language)}</label>
                <Input
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="Catégorie"
                />
              </div>
              <div>
                <label className="text-sm font-medium">{t('products.subcategory', user.language)}</label>
                <Input
                  value={formData.subcategory}
                  onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                  placeholder="Sous-catégorie (optionnel)"
                />
              </div>
              <div>
                <label className="text-sm font-medium">{t('products.initialStock', user.language)}</label>
                <Input
                  type="number"
                  value={formData.initialStock}
                  onChange={(e) => setFormData({ ...formData, initialStock: Number(e.target.value) })}
                  placeholder="0"
                />
              </div>
              <div>
                <label className="text-sm font-medium">{t('products.purchasePrice', user.language)}</label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.purchasePrice}
                  onChange={(e) => setFormData({ ...formData, purchasePrice: Number(e.target.value) })}
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="text-sm font-medium">{t('products.salePrice', user.language)}</label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.salePrice}
                  onChange={(e) => setFormData({ ...formData, salePrice: Number(e.target.value) })}
                  placeholder="0.00"
                />
              </div>
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product) => (
          <Card key={product.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{product.name}</CardTitle>
                  <CardDescription>{product.category}</CardDescription>
                </div>
                <div className="flex gap-1">
                  <Button size="sm" variant="ghost" onClick={() => handleEdit(product)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => onDeleteProduct(product.id)}>
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Stock actuel:</span>
                  <span className={`font-medium ${product.currentStock <= 5 ? 'text-red-600' : 'text-green-600'}`}>
                    {product.currentStock}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Prix d'achat:</span>
                  <span>{formatCurrency(product.purchasePrice, user.currency)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Prix de vente:</span>
                  <span className="font-medium">{formatCurrency(product.salePrice, user.currency)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Marge:</span>
                  <span className="font-medium text-green-600">
                    {formatCurrency(product.salePrice - product.purchasePrice, user.currency)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ProductManager;
