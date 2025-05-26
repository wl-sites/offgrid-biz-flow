
import { Product, Sale, Expense, User } from '../types';

class LocalStorage {
  private prefix = 'commerce_app_';

  private getKey(key: string): string {
    return `${this.prefix}${key}`;
  }

  // User management
  setUser(user: User): void {
    localStorage.setItem(this.getKey('user'), JSON.stringify(user));
  }

  getUser(): User | null {
    const userData = localStorage.getItem(this.getKey('user'));
    return userData ? JSON.parse(userData) : null;
  }

  clearUser(): void {
    localStorage.removeItem(this.getKey('user'));
  }

  // Products management
  getProducts(): Product[] {
    const products = localStorage.getItem(this.getKey('products'));
    return products ? JSON.parse(products) : [];
  }

  saveProducts(products: Product[]): void {
    localStorage.setItem(this.getKey('products'), JSON.stringify(products));
  }

  addProduct(product: Product): void {
    const products = this.getProducts();
    products.push(product);
    this.saveProducts(products);
  }

  updateProduct(productId: string, updates: Partial<Product>): void {
    const products = this.getProducts();
    const index = products.findIndex(p => p.id === productId);
    if (index !== -1) {
      products[index] = { ...products[index], ...updates, updatedAt: new Date() };
      this.saveProducts(products);
    }
  }

  deleteProduct(productId: string): void {
    const products = this.getProducts().filter(p => p.id !== productId);
    this.saveProducts(products);
  }

  // Sales management
  getSales(): Sale[] {
    const sales = localStorage.getItem(this.getKey('sales'));
    return sales ? JSON.parse(sales) : [];
  }

  saveSales(sales: Sale[]): void {
    localStorage.setItem(this.getKey('sales'), JSON.stringify(sales));
  }

  addSale(sale: Sale): void {
    const sales = this.getSales();
    sales.push(sale);
    this.saveSales(sales);
    
    // Update product stock
    this.updateProduct(sale.productId, {
      currentStock: this.getProducts().find(p => p.id === sale.productId)!.currentStock - sale.quantity
    });
  }

  // Expenses management
  getExpenses(): Expense[] {
    const expenses = localStorage.getItem(this.getKey('expenses'));
    return expenses ? JSON.parse(expenses) : [];
  }

  saveExpenses(expenses: Expense[]): void {
    localStorage.setItem(this.getKey('expenses'), JSON.stringify(expenses));
  }

  addExpense(expense: Expense): void {
    const expenses = this.getExpenses();
    expenses.push(expense);
    this.saveExpenses(expenses);
  }

  deleteExpense(expenseId: string): void {
    const expenses = this.getExpenses().filter(e => e.id !== expenseId);
    this.saveExpenses(expenses);
  }

  // Clear all data
  clearAllData(): void {
    const keys = Object.keys(localStorage).filter(key => key.startsWith(this.prefix));
    keys.forEach(key => localStorage.removeItem(key));
  }
}

export const storage = new LocalStorage();
