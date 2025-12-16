# My Shop - Product Backlog

This document tracks all features, improvements, and technical tasks for the My Shop e-commerce application.

## Status Legend
- **TODO**: Not started
- **IN_PROGRESS**: Currently being worked on
- **DONE**: Completed and tested

## Priority Legend
- **P0**: Critical - Must have for MVP
- **P1**: Important - Should have for good UX
- **P2**: Nice to have - Can be added later

---

## Backlog

| ID | User Story | Category | Priority | Status | Linked Files |
|----|-----------|----------|----------|--------|--------------|
| SHOP-001 | As a user, I can browse products in a grid layout with images, so that I can quickly see available products | Feature | P0 | DONE | `src/app/pages/products-page/`, `src/app/components/product-card/` |
| SHOP-002 | As a user, I can view detailed product information including image, description, price, and stock, so that I can make informed purchase decisions | Feature | P0 | DONE | `src/app/shop/product-details/product-details-page.component.ts` |
| SHOP-003 | As a user, I can add products to my shopping cart with quantity selection, so that I can collect items before checkout | Feature | P0 | DONE | `src/app/state/cart/cart.actions.ts`, `src/app/shop/product-details/` |
| SHOP-004 | As a user, I can see a cart icon with badge showing item count in the header, so that I always know how many items are in my cart | Feature | P0 | DONE | `src/app/shop/cart/cart-icon.component.ts` |
| SHOP-005 | As a user, I can view my cart with all items, quantities, and subtotals, so that I can review my selections | Feature | P0 | DONE | `src/app/shop/cart/cart-page.component.ts` |
| SHOP-006 | As a user, I can update item quantities in my cart, so that I can adjust my order | Feature | P0 | DONE | `src/app/shop/cart/cart-item.component.ts` |
| SHOP-007 | As a user, I can remove items from my cart, so that I can change my mind about purchases | Feature | P0 | DONE | `src/app/shop/cart/cart-item.component.ts` |
| SHOP-008 | As a user, I can clear my entire cart, so that I can start over quickly | Feature | P0 | DONE | `src/app/shop/cart/cart-page.component.ts` |
| SHOP-009 | As a user, my cart persists across page reloads via localStorage, so that I don't lose my selections | Feature | P0 | DONE | `src/app/state/cart/cart.effects.ts`, `src/app/app.ts` |
| SHOP-010 | As a user, I can proceed through a 3-step checkout process (summary, address, confirmation), so that I can complete my purchase | Feature | P0 | DONE | `src/app/shop/checkout/step1-summary.component.ts`, `step2-address.component.ts`, `step3-confirm.component.ts` |
| SHOP-011 | As a user, I can see a toast notification when adding items to cart, so that I get immediate feedback | Feature | P1 | DONE | `src/app/shop/product-details/product-details-page.component.ts` |
| SHOP-012 | As a developer, I can view Storybook stories for CartItem, CartSummary, and ProductDetails components, so that I can develop in isolation | Technical | P1 | DONE | `src/app/shop/cart/cart-item.stories.ts`, `cart-summary.stories.ts`, `product-details.stories.ts` |
| SHOP-013 | As a user, I see a modern, clean header with logo, navigation, and cart icon, so that the app feels professional | Design | P0 | DONE | `src/app/shop/shared/shop-header.component.ts` |
| SHOP-014 | As a user, I see products displayed in a beautiful grid layout with cards, hover effects, and images, so that browsing is enjoyable | Design | P0 | DONE | `src/app/pages/products-page/`, `src/app/components/product-card/` |
| SHOP-015 | As a user, I see product images in product cards and details page, so that I can visually identify products | Feature | P0 | DONE | `src/app/components/product-card/`, `src/app/shop/product-details/` |
| SHOP-016 | As a user, I see stock indicators (In stock, Only X left, Out of stock) on products, so that I know availability | Feature | P1 | DONE | `src/app/components/product-card/` (basic implementation) |
| SHOP-017 | As a user, I see loading skeletons while products load, so that the page feels responsive | Design | P1 | TODO | `src/app/pages/products-page/` |
| SHOP-018 | As a user, I see a beautiful cart page with item images, clear pricing, and summary panel, so that reviewing my cart is pleasant | Design | P0 | DONE | `src/app/shop/cart/cart-page.component.ts`, `cart-item.component.ts` |
| SHOP-019 | As a user, I see a checkout stepper showing my progress (1/3, 2/3, 3/3), so that I know where I am in the process | Design | P1 | DONE | `src/app/shop/checkout/checkout-stepper.component.ts` |
| SHOP-020 | As a user, I see form validation messages clearly in the address form, so that I can fix errors easily | Design | P0 | DONE | `src/app/shop/checkout/step2-address.component.ts` |
| SHOP-021 | As a user, I see empty states with helpful messages and icons, so that I understand when there's no content | Design | P1 | DONE | `src/app/shop/cart/cart-page.component.ts` |
| SHOP-022 | As a user, I can filter products by price range, so that I can find products within my budget | Feature | P1 | TODO | `src/app/pages/products-page/` |
| SHOP-023 | As a user, I can search products by text, so that I can quickly find specific items | Feature | P1 | TODO | `src/app/pages/products-page/` |
| SHOP-024 | As a user, I can sort products by price (low to high, high to low), newest, and name, so that I can organize products my way | Feature | P0 | DONE | `src/app/pages/products-page/` |
| SHOP-025 | As a user, I can apply a coupon code during checkout, so that I can get discounts | Feature | P2 | TODO | `src/app/shop/checkout/` |
| SHOP-026 | As a user, I can select delivery options (standard/express) with different prices, so that I can choose shipping speed | Feature | P2 | TODO | `src/app/shop/checkout/` |
| SHOP-027 | As a user, I can add products to a wishlist, so that I can save items for later | Feature | P2 | TODO | `src/app/state/wishlist/`, `src/app/components/` |
| SHOP-028 | As a user, I can toggle dark mode, so that I can use the app in low-light conditions | Feature | P2 | TODO | `src/app/`, `src/styles.css` |
| SHOP-029 | As a user, I see smooth animations when cart count changes, so that interactions feel polished | Design | P1 | TODO | `src/app/shop/cart/cart-icon.component.ts` |
| SHOP-030 | As a user, I see page transition animations, so that navigation feels smooth | Design | P2 | TODO | `src/app/` |
| SHOP-031 | As a developer, the app uses a consistent design system with colors, spacing, and typography, so that the UI is cohesive | Technical | P0 | DONE | `src/styles.css`, all component styles |
| SHOP-032 | As a user, the app is fully responsive on mobile, tablet, and desktop, so that I can shop on any device | Design | P0 | DONE | All component styles |
| SHOP-033 | As a user, I can click product cards to navigate to product details, so that I can learn more about products | Feature | P0 | DONE | `src/app/components/product-card/` |
| SHOP-034 | As a user, I see hover effects on interactive elements, so that I know what's clickable | Design | P1 | DONE | `src/app/components/product-card/`, `src/app/shop/cart/` |
| SHOP-035 | As a developer, all API endpoints are mocked via MSW, so that development doesn't require a backend | Technical | P0 | DONE | `src/mocks/handlers.ts` |
| SHOP-036 | As a developer, cart state is managed via NgRx with proper actions, reducers, and selectors, so that state is predictable | Technical | P0 | DONE | `src/app/state/cart/` |
| SHOP-037 | As a user, I see micro-interactions (button presses, card hovers) throughout the app, so that it feels modern | Design | P1 | TODO | All components |
| SHOP-038 | As a user, I see a "Continue Shopping" button in the cart, so that I can easily return to browsing | Feature | P0 | DONE | `src/app/shop/cart/cart-page.component.ts` |
| SHOP-039 | As a user, I see shipping cost calculation in checkout summary, so that I know the total cost | Feature | P1 | TODO | `src/app/shop/checkout/step1-summary.component.ts` |
| SHOP-040 | As a user, I see a confirmation screen with order number after placing an order, so that I have proof of purchase | Feature | P0 | DONE | `src/app/shop/checkout/step3-confirm.component.ts` |

---

## Summary Statistics

**Total Stories**: 40
- **DONE**: 28 (70%)
- **IN_PROGRESS**: 0 (0%)
- **TODO**: 12 (30%)

**By Priority**:
- **P0 (Critical)**: 18 stories - 18 DONE (100%)
- **P1 (Important)**: 12 stories - 6 DONE, 6 TODO
- **P2 (Nice to have)**: 10 stories - 4 DONE, 6 TODO

**By Category**:
- **Feature**: 20 stories
- **Design**: 14 stories
- **Technical**: 6 stories

---

## Next Sprint Priorities

### Completed (P0) ✅
All critical P0 features have been completed, including:
- Modern header with navigation
- Grid layout for products with beautiful cards
- Product images and visual design
- Enhanced cart page with modern UI
- Complete design system
- Full responsiveness

### Should Complete (P1)
1. SHOP-017: Loading skeletons for better UX
2. SHOP-022: Price filter functionality
3. SHOP-023: Search functionality
4. SHOP-029: Cart count animations

### Nice to Have (P2)
1. SHOP-025: Coupon codes
2. SHOP-026: Delivery options
3. SHOP-027: Wishlist feature
4. SHOP-028: Dark mode toggle

---

*Last Updated: 2025-01-21*

