 Z-Kstore — Modern Angular E-Commerce Platform

Angular • NgRx • Tailwind CSS • Angular Material • Storybook

Z-Kstore est une application e-commerce moderne conçue avec Angular et une architecture orientée performance.
Le projet met l’accent sur une expérience utilisateur fluide, une gestion d’état robuste, et une UI soignée, tout en restant entièrement modulable.

🚀 Fonctionnalités principales
🛒 Boutique

Catalogue produits dynamique (filtres, recherche, pagination)

Pages produit complètes (galerie, stock, avis)

Panier temps réel avec persistance locale

Wishlist avec animation

Processus de commande en plusieurs étapes

Codes promo et gestion des remises

Indicateurs de stock (disponible, faible, épuisé)

👤 Compte utilisateur

Authentification sécurisée (JWT mocké)

Profil et préférences utilisateur

Historique des commandes avec filtres

Détails de commande complets

🔐 Sécurité & Accès

Routes protégées par guards

Sessions persistantes (localStorage)

Compte démo administrateur inclus

📊 Administration

Tableau de bord avec statistiques clés

Produits les plus vendus

Suivi des commandes récentes

Création de nouveaux produits

⚡ Performance & Architecture

Modules lazy-loaded (Shop, Account, Admin)

NgRx structuré par domaines

Selecteurs mémorisés

ChangeDetectionStrategy.OnPush

trackBy sur toutes les listes

🧠 Gestion d’état (NgRx)

Slices dédiés :

auth, products, cart, orders

user, wishlist, reviews

admin, navigation

Exemples de sélecteurs :

Total du panier

Produits favoris

Commandes par statut

Revenu global

🧩 API simulée (MSW)

Authentification & profil

Produits & avis

Panier & commandes

Wishlist

Endpoints admin

🛠️ Stack technique

Framework : Angular 18+

State : NgRx

UI : Tailwind CSS, Angular Material

Mock API : MSW

UI Docs : Storybook

▶️ Lancer le projet
npm install
npm start


App : http://localhost:4200

Storybook : http://localhost:6006

Compte démo
Email : demo@example.com
Mot de passe : demo123456
Rôle : Admin

🎯 Objectif du projet

Z-Kstore est un projet pédagogique avancé visant à démontrer :

une architecture Angular propre,

une utilisation réaliste de NgRx,

de bonnes pratiques UI/UX,

et une application e-commerce complète, prête à évoluer.
