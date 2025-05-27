
# Documentation de l'Application de Gestion Commerciale

Cette application est une solution de gestion commerciale développée avec React, TypeScript, Firebase et Tailwind CSS.

## Architecture de l'Application

### Technologies Utilisées
- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + Shadcn/UI
- **Backend**: Firebase (Authentication + Firestore)
- **État**: Hooks React personnalisés
- **Routage**: React Router DOM

### Structure des Dossiers
```
src/
├── components/          # Composants UI réutilisables
│   ├── ui/             # Composants Shadcn/UI
│   ├── Dashboard.tsx   # Tableau de bord principal
│   ├── ProductManager.tsx    # Gestion des produits
│   ├── SalesManager.tsx      # Gestion des ventes
│   ├── ExpenseManager.tsx    # Gestion des dépenses
│   ├── Settings.tsx          # Paramètres utilisateur
│   └── BottomNavigation.tsx  # Navigation mobile
├── hooks/              # Hooks personnalisés
│   ├── useFirebaseAuth.ts    # Authentification Firebase
│   └── useFirebaseData.ts    # Gestion des données Firebase
├── pages/              # Pages de l'application
│   └── Index.tsx       # Page principale
├── types/              # Définitions TypeScript
│   └── index.ts        # Types principaux
├── utils/              # Utilitaires
│   ├── firebase.ts     # Configuration Firebase
│   └── i18n.ts         # Internationalization
└── App.tsx             # Composant racine
```

## Fonctionnalités Principales

### 1. Authentification
- Connexion/Déconnexion avec Firebase Auth
- Gestion automatique des sessions
- Isolation des données par utilisateur

### 2. Gestion des Produits
- Ajout, modification, suppression de produits
- Suivi des stocks (initial et actuel)
- Calcul automatique des marges
- Catégorisation des produits

### 3. Gestion des Ventes
- Enregistrement des ventes
- Mise à jour automatique des stocks
- Calcul automatique des profits
- Historique des ventes

### 4. Gestion des Dépenses
- Enregistrement des dépenses
- Catégorisation optionnelle
- Suivi par date

### 5. Tableau de Bord
- Vue d'ensemble des métriques clés
- Ventes totales
- Dépenses totales
- Bénéfice net (Gains des produits - Dépenses)
- Analyse des profits par produit

### 6. Paramètres
- Changement de langue (Français, Anglais, Swahili)
- Changement de devise (USD, EUR, CDF)
- Mise à jour en temps réel sans refresh

## Guide de Développement

### Installation et Configuration

1. **Cloner le projet**
```bash
git clone [url-du-repo]
cd [nom-du-projet]
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configuration Firebase**
Créer un fichier `.env` à la racine avec:
```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

4. **Lancer le serveur de développement**
```bash
npm run dev
```

### Ajout de Nouvelles Fonctionnalités

#### 1. Ajouter un Nouveau Composant
```typescript
// src/components/MonComposant.tsx
import React from 'react';
import { User } from '../types';

interface MonComposantProps {
  user: User;
  // autres props
}

const MonComposant: React.FC<MonComposantProps> = ({ user }) => {
  return (
    <div>
      {/* Votre composant */}
    </div>
  );
};

export default MonComposant;
```

#### 2. Ajouter une Nouvelle Page
1. Créer le composant dans `src/pages/`
2. Ajouter la route dans `src/App.tsx`
3. Mettre à jour la navigation si nécessaire

#### 3. Ajouter de Nouvelles Traductions
Mettre à jour `src/utils/i18n.ts`:
```typescript
const translations: Translations = {
  // ... existantes
  'nouvelle.cle': { fr: 'Français', en: 'English', sw: 'Kiswahili' },
};
```

#### 4. Ajouter de Nouveaux Types
Mettre à jour `src/types/index.ts`:
```typescript
export interface NouveauType {
  id: string;
  // propriétés...
}
```

### Hooks Personnalisés

#### useFirebaseAuth
Gère l'authentification Firebase:
```typescript
const { user, isLoading, login, logout } = useFirebaseAuth();
```

#### useFirebaseData
Gère les données Firestore:
```typescript
const {
  products,
  sales,
  expenses,
  addProduct,
  addSale,
  addExpense,
  getDashboardStats
} = useFirebaseData(userId);
```

### Base de Données Firestore

#### Collections
- **products**: Produits de l'utilisateur
- **sales**: Ventes enregistrées
- **expenses**: Dépenses enregistrées

#### Sécurité
- Toutes les données sont filtrées par `userId`
- Isolation complète entre utilisateurs
- Écoute en temps réel des changements

### Calculs Importants

#### Bénéfice Net
```typescript
const totalProductProfits = sales.reduce((sum, sale) => sum + sale.profit, 0);
const netProfit = totalProductProfits - totalExpenses;
```

#### Profit par Vente
```typescript
const profit = (salePrice - purchasePrice) * quantity;
```

## Déploiement

### Variables d'Environnement
S'assurer que toutes les variables Firebase sont configurées en production.

### Build de Production
```bash
npm run build
```

### Déploiement Firebase Hosting (optionnel)
```bash
firebase deploy
```

## Maintenance et Debugging

### Logs Importants
- Erreurs d'authentification dans la console
- Erreurs Firestore dans les hooks
- Erreurs de navigation dans React Router

### Tests
- Tester l'isolation des données entre utilisateurs
- Vérifier les calculs de stock et profits
- Tester le changement de langue/devise

### Performance
- Les données sont chargées en temps réel
- Optimisation des requêtes Firestore
- Composants React.memo si nécessaire

## Contribution

### Standards de Code
- TypeScript strict
- Composants fonctionnels avec hooks
- Props interfaces bien définies
- Nommage descriptif en français/anglais

### Git Workflow
1. Créer une branche feature
2. Développer et tester
3. Commit avec messages descriptifs
4. Pull request vers main

Cette documentation doit être mise à jour à chaque ajout de fonctionnalité majeure.
