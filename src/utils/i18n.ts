
interface Translations {
  [key: string]: {
    fr: string;
    en: string;
    sw: string;
  };
}

const translations: Translations = {
  // Authentication
  'auth.login': { fr: 'Connexion', en: 'Login', sw: 'Ingia' },
  'auth.register': { fr: 'Inscription', en: 'Register', sw: 'Jisajili' },
  'auth.email': { fr: 'Email', en: 'Email', sw: 'Barua pepe' },
  'auth.password': { fr: 'Mot de passe', en: 'Password', sw: 'Nenosiri' },
  'auth.confirmPassword': { fr: 'Confirmer le mot de passe', en: 'Confirm Password', sw: 'Thibitisha nenosiri' },
  
  // Configuration
  'config.language': { fr: 'Langue', en: 'Language', sw: 'Lugha' },
  'config.currency': { fr: 'Devise', en: 'Currency', sw: 'Sarafu' },
  'config.save': { fr: 'Enregistrer', en: 'Save', sw: 'Hifadhi' },
  
  // Dashboard
  'dashboard.title': { fr: 'Tableau de bord', en: 'Dashboard', sw: 'Dashibodi' },
  'dashboard.totalRevenue': { fr: 'Chiffre d\'affaires total', en: 'Total Revenue', sw: 'Mapato ya jumla' },
  'dashboard.totalExpenses': { fr: 'Dépenses totales', en: 'Total Expenses', sw: 'Gharama za jumla' },
  'dashboard.netProfit': { fr: 'Bénéfice net', en: 'Net Profit', sw: 'Faida halisi' },
  
  // Products
  'products.title': { fr: 'Produits', en: 'Products', sw: 'Bidhaa' },
  'products.addProduct': { fr: 'Ajouter un produit', en: 'Add Product', sw: 'Ongeza bidhaa' },
  'products.name': { fr: 'Nom du produit', en: 'Product Name', sw: 'Jina la bidhaa' },
  'products.category': { fr: 'Catégorie', en: 'Category', sw: 'Jamii' },
  'products.subcategory': { fr: 'Sous-catégorie', en: 'Subcategory', sw: 'Kijamii' },
  'products.initialStock': { fr: 'Stock initial', en: 'Initial Stock', sw: 'Hisa ya awali' },
  'products.currentStock': { fr: 'Stock actuel', en: 'Current Stock', sw: 'Hisa ya sasa' },
  'products.purchasePrice': { fr: 'Prix d\'achat', en: 'Purchase Price', sw: 'Bei ya ununuzi' },
  'products.salePrice': { fr: 'Prix de vente', en: 'Sale Price', sw: 'Bei ya mauzo' },
  
  // Sales
  'sales.title': { fr: 'Ventes', en: 'Sales', sw: 'Mauzo' },
  'sales.addSale': { fr: 'Ajouter une vente', en: 'Add Sale', sw: 'Ongeza uuzaji' },
  'sales.selectProduct': { fr: 'Sélectionner un produit', en: 'Select Product', sw: 'Chagua bidhaa' },
  'sales.quantity': { fr: 'Quantité', en: 'Quantity', sw: 'Kiasi' },
  
  // Expenses
  'expenses.title': { fr: 'Dépenses', en: 'Expenses', sw: 'Gharama' },
  'expenses.addExpense': { fr: 'Ajouter une dépense', en: 'Add Expense', sw: 'Ongeza gharama' },
  'expenses.amount': { fr: 'Montant', en: 'Amount', sw: 'Kiasi' },
  'expenses.description': { fr: 'Description', en: 'Description', sw: 'Maelezo' },
  'expenses.category': { fr: 'Catégorie', en: 'Category', sw: 'Jamii' },
  
  // Common
  'common.save': { fr: 'Enregistrer', en: 'Save', sw: 'Hifadhi' },
  'common.cancel': { fr: 'Annuler', en: 'Cancel', sw: 'Ghairi' },
  'common.delete': { fr: 'Supprimer', en: 'Delete', sw: 'Futa' },
  'common.edit': { fr: 'Modifier', en: 'Edit', sw: 'Hariri' },
  'common.back': { fr: 'Retour', en: 'Back', sw: 'Rudi' },
  'common.loading': { fr: 'Chargement...', en: 'Loading...', sw: 'Inapakia...' },
};

export const t = (key: string, language: 'fr' | 'en' | 'sw' = 'fr'): string => {
  return translations[key]?.[language] || key;
};

export const formatCurrency = (amount: number, currency: string): string => {
  const symbols: { [key: string]: string } = {
    USD: '$',
    EUR: '€',
    CDF: 'FC'
  };
  
  return `${symbols[currency] || currency} ${amount.toLocaleString()}`;
};
