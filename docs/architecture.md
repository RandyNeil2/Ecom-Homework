# Architecture Documentation

This document provides a comprehensive overview of the MyShop application architecture, state management, API layer, and development practices.

## Table of Contents

1. [High-Level Architecture](#high-level-architecture)
2. [State Management (NgRx)](#state-management-ngrx)
3. [API Layer & MSW](#api-layer--msw)
4. [Routing](#routing)
5. [Component Architecture](#component-architecture)
6. [Storybook](#storybook)
7. [How to Extend the App](#how-to-extend-the-app)

## High-Level Architecture

The application follows a modern Angular architecture with clear separation of concerns:

```
┌─────────────────────────────────────────────────────────┐
│                    Angular App                          │
├─────────────────────────────────────────────────────────┤
│  Pages (Container Components)                            │
│  ├── LoginPageComponent                                  │
│  ├── ProductsPageComponent                              │
│  └── ProductRatingPageComponent                         │
├─────────────────────────────────────────────────────────┤
│  Components (Presentational)                             │
│  ├── ProductCardComponent                               │
│  ├── ProductsListComponent                              │
│  └── LoginFormComponent                                 │
├─────────────────────────────────────────────────────────┤
│  State Management (NgRx)                                │
│  ├── Auth Slice (actions, reducer, selectors, effects) │
│  └── Products Slice (actions, reducer, selectors, effects)│
├─────────────────────────────────────────────────────────┤
│  Services                                                │
│  ├── ShopApiService (HTTP calls)                        │
│  └── AuthInterceptor (Bearer token injection)           │
├─────────────────────────────────────────────────────────┤
│  MSW (Mock Service Worker)                              │
│  └── API Mock Handlers                                  │
└─────────────────────────────────────────────────────────┘
```

### Data Flow

1. **User Action** → Component dispatches NgRx action
2. **Action** → Effect intercepts and calls API service
3. **API Service** → Makes HTTP request (intercepted by MSW in dev)
4. **Response** → Effect dispatches success/failure action
5. **Reducer** → Updates state
6. **Selector** → Component subscribes to state changes
7. **UI Update** → Component re-renders with new data

## State Management (NgRx)

### Auth Slice

**Location**: `src/app/state/auth/`

**State Shape**:
```typescript
interface AuthState {
  access: string | null;      // JWT access token
  refresh: string | null;     // JWT refresh token
  loading: boolean;           // Loading state
  error: string | null;       // Error message
}
```

**Main Actions**:
- `login({ username, password })` - Initiate login
- `loginSuccess({ access, refresh })` - Login succeeded
- `loginFailure({ error })` - Login failed

**Main Selectors**:
- `selectIsLoggedIn` - Returns true if access token exists
- `selectAuthLoading` - Returns loading state
- `selectAuthError` - Returns error message

**Effects**:
- `login$` - Intercepts `login` action, calls `ShopApiService.login()`, dispatches success/failure

### Products Slice

**Location**: `src/app/state/products/`

**State Shape**:
```typescript
interface ProductsState {
  list: Product[];                              // Array of products
  count: number;                                // Total count (for pagination)
  loading: boolean;                              // Loading state
  error: string | null;                          // Error message
  lastQueryParams: ProductsQueryParams | null;  // Last applied filters
}
```

**Query Parameters**:
```typescript
interface ProductsQueryParams {
  page?: number;        // Page number (1-based)
  pageSize?: number;    // Items per page
  minRating?: number;   // Minimum rating filter
  ordering?: string;    // Sort order (e.g., '-created_at', 'price')
}
```

**Main Actions**:
- `loadProducts({ params })` - Load products with filters
- `loadProductsSuccess({ response, params })` - Products loaded successfully
- `loadProductsFailure({ error })` - Failed to load products

**Main Selectors**:
- `selectProductsList` - Returns products array
- `selectProductsCount` - Returns total count
- `selectProductsLoading` - Returns loading state
- `selectProductsError` - Returns error message
- `selectLastQueryParams` - Returns last query parameters

**Effects**:
- `loadProducts$` - Intercepts `loadProducts` action, calls `ShopApiService.getProducts()`, dispatches success/failure

## API Layer & MSW

### ShopApiService

**Location**: `src/app/services/shop-api.service.ts`

**Methods**:

1. **login(username, password)**
   - Endpoint: `POST /api/auth/token/`
   - Returns: `{ access: string, refresh: string }`

2. **refresh(refreshToken)**
   - Endpoint: `POST /api/auth/token/refresh/`
   - Returns: `{ access: string }`

3. **getProducts(params)**
   - Endpoint: `GET /api/products/?page=&page_size=&min_rating=&ordering=`
   - Returns: `{ count: number, results: Product[], next: string | null, previous: string | null }`

4. **getRating(productId)**
   - Endpoint: `GET /api/products/:id/rating/`
   - Returns: `{ product_id: number, avg_rating: number, count: number }`

### AuthInterceptor

**Location**: `src/app/interceptors/auth.interceptor.ts`

Automatically adds `Authorization: Bearer <access_token>` header to all HTTP requests (except auth endpoints).

### MSW Configuration

**Location**: `src/mocks/`

MSW (Mock Service Worker) is configured to intercept API calls in development:

- **Handlers**: `src/mocks/handlers.ts` - Defines mock endpoints
- **Data**: `src/mocks/data.ts` - Mock product data
- **Utils**: `src/mocks/utils.ts` - Helper functions (pagination, rating calculation)
- **Browser Setup**: `src/mocks/browser.ts` - MSW browser setup

**Mock Endpoints**:
- All endpoints return mock data based on the handlers configuration
- No backend server required for development

## Routing

**Location**: `src/app/app.routes.ts`

### Route Structure

- `/` - Home component (navigation hub)
- `/login` - Login page
- `/shop/products` - Products listing page
- `/shop/rating` - Product rating page
- `/app` - App placeholder with navigation links
- `/dev/*` - Development playground routes

### Navigation

The `AppPlaceholderComponent` (`src/app/app-placeholder.component.ts`) provides navigation links to all main pages using Angular Material buttons.

## Component Architecture

### Container vs Presentational Components

**Container Components** (Pages):
- Connected to NgRx store
- Dispatch actions
- Subscribe to selectors
- Handle business logic
- Examples: `LoginPageComponent`, `ProductsPageComponent`, `ProductRatingPageComponent`

**Presentational Components**:
- No NgRx dependencies
- Receive data via `@Input()`
- Emit events via `@Output()`
- Pure UI components
- Examples: `ProductCardComponent`, `ProductsListComponent`, `LoginFormComponent`

### Component Examples

#### LoginPageComponent (Container)
```typescript
// Dispatches actions
this.store.dispatch(AuthActions.login({ username, password }));

// Subscribes to selectors
loading$ = this.store.select(selectAuthLoading);
```

#### LoginFormComponent (Presentational)
```typescript
// Emits events
@Output() submit = new EventEmitter<LoginFormData>();

// No NgRx dependencies
```

## Storybook

**Location**: `src/app/components/*/`

### Stories Available

1. **ProductCard** (`product-card.stories.ts`)
   - Displays product information (name, price, date, rating)
   - Stories: Default, HighRating, LowRating, Expensive

2. **ProductsList** (`products-list.stories.ts`)
   - Displays list of products
   - Stories: Default, Loading, Error, Empty, SingleProduct

3. **LoginForm** (`login-form.stories.ts`)
   - Login form component
   - Stories: Default, WithPrefilledValues
   - Uses Storybook actions to capture form submissions

### Running Storybook

```bash
npm run storybook
```

### Why Storybook?

- **Isolated Development**: Develop components without running the full app
- **Visual Testing**: See all component states (loading, error, empty)
- **Documentation**: Stories serve as living documentation
- **Design Review**: Share components with designers/stakeholders

## How to Extend the App

### Adding a New Filter to Products

1. **Update ProductsQueryParams** (`src/app/state/products/products.actions.ts`):
```typescript
export interface ProductsQueryParams {
  // ... existing params
  newFilter?: string;  // Add new filter
}
```

2. **Update ShopApiService** (`src/app/services/shop-api.service.ts`):
```typescript
getProducts(params: ProductsQueryParams): Observable<ProductsResponse> {
  let httpParams = new HttpParams();
  // ... existing params
  if (params.newFilter) {
    httpParams = httpParams.set('new_filter', params.newFilter);
  }
  // ...
}
```

3. **Update ProductsPageComponent** (`src/app/pages/products-page/products-page.ts`):
```typescript
filterForm: FormGroup = this.fb.group({
  // ... existing fields
  newFilter: [''],  // Add to form
});
```

4. **Update MSW Handler** (`src/mocks/handlers.ts`):
```typescript
http.get(`${API}/products/`, async ({ request }) => {
  const url = new URL(request.url);
  const newFilter = url.searchParams.get('new_filter');
  // Apply filter logic
});
```

### Adding a New Field to Auth State

1. **Update AuthState** (`src/app/state/auth/auth.reducer.ts`):
```typescript
export interface AuthState {
  // ... existing fields
  userProfile?: UserProfile;  // Add new field
}
```

2. **Update Reducer** (same file):
```typescript
on(AuthActions.loginSuccess, (state, { access, refresh, userProfile }) => ({
  ...state,
  access,
  refresh,
  userProfile,  // Add to state
  loading: false,
  error: null,
}))
```

3. **Update Actions** (`src/app/state/auth/auth.actions.ts`):
```typescript
export const loginSuccess = createAction(
  '[Auth] Login Success',
  props<{ access: string; refresh: string; userProfile?: UserProfile }>()
);
```

4. **Update Selector** (`src/app/state/auth/auth.selectors.ts`):
```typescript
export const selectUserProfile = createSelector(
  selectAuthState,
  (state) => state.userProfile
);
```

### Adding a New Page

1. **Create Component**:
```bash
ng generate component pages/new-page
```

2. **Add Route** (`src/app/app.routes.ts`):
```typescript
{ path: 'new-page', component: NewPageComponent }
```

3. **Add Navigation Link** (`src/app/app-placeholder.component.ts`):
```html
<button routerLink="/new-page">New Page</button>
```

4. **If needed, create NgRx slice**:
   - Create `src/app/state/new-feature/` directory
   - Add actions, reducer, selectors, effects
   - Register in `app.config.ts`

### Adding a New Storybook Story

1. **Create Component** (if not presentational, extract to component):
```bash
ng generate component components/new-component
```

2. **Create Story File** (`new-component.stories.ts`):
```typescript
import type { Meta, StoryObj } from '@storybook/angular';
import { NewComponent } from './new-component.component';

const meta: Meta<NewComponent> = {
  title: 'Shop/NewComponent',
  component: NewComponent,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<NewComponent>;

export const Default: Story = {
  args: {
    // component inputs
  },
};
```

## Best Practices

1. **Keep Components Pure**: Presentational components should not depend on NgRx
2. **Use Effects for Side Effects**: All API calls should go through NgRx effects
3. **Type Safety**: Use TypeScript interfaces for all data structures
4. **Error Handling**: Always handle loading and error states in UI
5. **Reusability**: Extract common UI patterns into presentational components
6. **Documentation**: Keep stories and documentation up to date

## Troubleshooting

### MSW Not Working

- Ensure `public/mockServiceWorker.js` exists
- Check browser console for MSW initialization messages
- Verify handlers are correctly registered in `src/mocks/browser.ts`

### NgRx State Not Updating

- Check Redux DevTools (install browser extension)
- Verify effects are registered in `app.config.ts`
- Ensure actions are being dispatched correctly

### Angular Material Not Styling

- Verify `@angular/material` is installed
- Check `src/custom-theme.scss` is imported
- Ensure Material modules are imported in components

