
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Expense, User } from '../types';
import { t, formatCurrency } from '../utils/i18n';
import { Plus, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ExpenseManagerProps {
  expenses: Expense[];
  user: User;
  onAddExpense: (expense: Omit<Expense, 'id'>) => void;
  onDeleteExpense: (expenseId: string) => void;
}

const ExpenseManager: React.FC<ExpenseManagerProps> = ({
  expenses,
  user,
  onAddExpense,
  onDeleteExpense
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    amount: 0,
    description: '',
    category: '',
    date: new Date().toISOString().split('T')[0]
  });
  const { toast } = useToast();

  const resetForm = () => {
    setFormData({
      amount: 0,
      description: '',
      category: '',
      date: new Date().toISOString().split('T')[0]
    });
  };

  const handleSubmit = () => {
    if (!formData.description || formData.amount <= 0) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires"
      });
      return;
    }

    onAddExpense({
      ...formData,
      date: new Date(formData.date)
    });
    
    resetForm();
    setIsDialogOpen(false);
    toast({
      title: "Dépense ajoutée",
      description: "La dépense a été enregistrée avec succès"
    });
  };

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <div className="space-y-6 p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">{t('expenses.title', user.language)}</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-red-600 hover:bg-red-700" onClick={resetForm}>
              <Plus className="w-4 h-4 mr-2" />
              {t('expenses.addExpense', user.language)}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{t('expenses.addExpense', user.language)}</DialogTitle>
              <DialogDescription>
                Enregistrez une nouvelle dépense
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">{t('expenses.amount', user.language)}</label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="text-sm font-medium">{t('expenses.description', user.language)}</label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Description de la dépense"
                />
              </div>
              <div>
                <label className="text-sm font-medium">{t('expenses.category', user.language)}</label>
                <Input
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="Catégorie (optionnel)"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Date</label>
                <Input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
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

      <Card className="bg-red-50 border-red-200">
        <CardHeader>
          <CardTitle className="text-red-800">Total des dépenses</CardTitle>
          <CardDescription className="text-2xl font-bold text-red-900">
            {formatCurrency(totalExpenses, user.currency)}
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="space-y-4">
        {expenses.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center text-gray-500">
              Aucune dépense enregistrée
            </CardContent>
          </Card>
        ) : (
          expenses.slice().reverse().map((expense) => (
            <Card key={expense.id}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-medium">{expense.description}</h3>
                    {expense.category && (
                      <p className="text-sm text-gray-600 mb-1">{expense.category}</p>
                    )}
                    <p className="text-sm text-gray-500">
                      {new Date(expense.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-red-600">
                      {formatCurrency(expense.amount, user.currency)}
                    </p>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onDeleteExpense(expense.id)}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
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

export default ExpenseManager;
