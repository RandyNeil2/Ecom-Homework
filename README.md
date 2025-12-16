# 🛍️ LuxeShop - Premium Angular E-Commerce Application

![Angular](https://img.shields.io/badge/Angular-18+-dd0031.svg?style=for-the-badge&logo=angular&logoColor=white)
![NgRx](https://img.shields.io/badge/NgRx-State_Management-ba2bd2.svg?style=for-the-badge&logo=ngrx&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Material UI](https://img.shields.io/badge/Material_UI-0081CB?style=for-the-badge&logo=material-ui&logoColor=white)

**LuxeShop** is a state-of-the-art, premium e-commerce platform built with modern web technologies. It delivers a seamless, high-performance shopping experience with a focus on aesthetic excellence and robust architecture.

---

## ✨ Key Features

### 🎨 **Premium UI/UX**
*   **Responsive Design:** Fully fluid layout that adapts perfectly to mobile, tablet, and desktop.
*   **Glassmorphism & Animations:** Subtle micro-interactions, smooth transitions, and modern glass effects.
*   **Sticky Header:** Dynamic header that adapts to scroll position (transparent to white) for an immersive feel.
*   **Dark/Light Mode Ready:** Built with CSS variables and Tailwind for easy theming.

### 🛒 **Shopping Experience**
*   **Product Catalog:** Dynamic product listing with filtering by category.
*   **Product Details:** Rich product pages with image galleries, stock status, and reviews.
*   **Shopping Cart:** Real-time cart management with persistent state.
*   **Checkout Process:** Multi-step checkout flow (Shipping -> Payment -> Confirmation).
*   **Wishlist:** Save favorite items for later (persisted locally).

### 🔐 **Authentication & User Accounts**
*   **Secure Auth:** Login and Registration with JWT-based authentication flow (mocked for demo).
*   **User Dashboard:** Personalized area to view order history and manage profile.
*   **Admin Dashboard:** Dedicated area for product management (CRUD operations).

### ⚡ **Technical Excellence**
*   **State Management:** Powered by **NgRx** (Store, Effects, Selectors) for predictable state changes.
*   **Mock API:** Robust `ShopApiService` simulating a real backend with `localStorage` persistence.
*   **Performance:** Lazy loading of modules (`Shop`, `Admin`, `Account`) for fast initial load.
*   **Robust Error Handling:** Global error interception and user-friendly notifications.

---

## 🛠️ Tech Stack

*   **Framework:** [Angular 18+](https://angular.io/)
*   **State Management:** [NgRx](https://ngrx.io/) (Redux pattern)
*   **Styling:** 
    *   [Tailwind CSS](https://tailwindcss.com/) (Utility-first)
    *   [Angular Material](https://material.angular.io/) (Components)
    *   Custom CSS Variables for theming
*   **Icons:** Material Icons & SVG
*   **Tooling:** Angular CLI, ESLint, Prettier

---

## 🚀 Getting Started

### Prerequisites
*   Node.js (v18 or higher)
*   npm (v9 or higher)

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/luxeshop.git
    cd luxeshop
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Start the development server**
    ```bash
    npm start
    ```

4.  **Open in browser**
    Navigate to `http://localhost:4200/`

---

## 📂 Project Structure

```
src/
├── app/
│   ├── components/      # Shared UI components (Header, Footer, Cards)
│   ├── pages/           # Top-level pages (Home, Auth, Account)
│   ├── services/        # Data services (API, Auth)
│   ├── shop/            # Shop feature module (Product List, Details, Cart)
│   ├── state/           # NgRx State (Actions, Reducers, Selectors, Effects)
│   │   ├── auth/
│   │   ├── cart/
│   │   ├── products/
│   │   └── orders/
│   └── app.component.ts # Root component
├── assets/              # Static assets (Images, Icons)
├── mocks/               # Mock data for development
└── styles.css           # Global styles and Tailwind imports
```

---

## 🧩 Architecture Highlights

### **State Management (NgRx)**
The application uses a centralized store to manage data consistency across components.
*   **Products:** Fetched once and cached, with stock updates reflected instantly.
*   **Cart:** Persisted to `localStorage` so users don't lose items on refresh.
*   **Auth:** Token-based session management with auto-login capabilities.

### **Mock Backend**
To ensure a realistic experience without a running server, `ShopApiService` intercepts HTTP calls and mimics a database using browser storage. This allows for:
*   Persistent User Sessions
*   Persistent Order History
*   Real-time Stock Decrementing

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1.  Fork the project
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

*Built with ❤️ by the LuxeShop Team*
