// src/App.js
import React, { Suspense, lazy, useEffect, useState, useRef } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from 'react-router-dom';
import { CartProvider } from './orugallu-components/CartContext';
import { useAuth } from './orugallu-components/AuthContext';

import NavbarOfOrugallu from './orugallu-components/NavbarOfOrugallu';
import FooterOfOrugallu from './orugallu-components/FooterOfOrugallu';
import CenterLoader from './orugallu-components/CenterLoader';
import PrivateRoute from './orugallu-components/PrivateRoute';
import LogoIntro from './orugallu-components/LogoIntro';

// Lazy-loaded components
const LandingPageOfOrugallu = lazy(() => import('./pages-of-orugallu/LandingPageOfOrugallu'));
const LoginOfOrugallu = lazy(() => import('./pages-of-orugallu/LoginOfOrugallu'));
const SignUpOfOrugallu = lazy(() => import('./pages-of-orugallu/SignUpOfOrugallu'));
const ItemsOfOrugallu = lazy(() => import('./pages-of-orugallu/ItemsOfOrugallu'));
const CartPageOfOrugallu = lazy(() => import('./pages-of-orugallu/CartPageOfOrugallu'));
const CheckoutPageOfOrugallu = lazy(() => import('./pages-of-orugallu/CheckoutPageOfOrugallu'));
const ThankYouPageOfOrugallu = lazy(() => import('./pages-of-orugallu/ThankYouPageOfOrugallu'));
const HomeOfOrugallu = lazy(() => import('./pages-of-orugallu/HomeOfOrugallu'));
const MyOrdersOfOrugallu = lazy(() => import('./pages-of-orugallu/MyOrdersOfOrugallu'));
const AdminOrdersPage = lazy(() => import('./pages-of-orugallu/AdminOrdersPage'));
const SearchResults = lazy(() => import('./pages-of-orugallu/SearchResults'));

// 🔁 Inner component to use `useLocation` inside Router
function AppRoutes({ skipInitialLoader }) {
  const { user } = useAuth();
  const location = useLocation();
  const [isPageLoading, setIsPageLoading] = useState(false);
  const hasSkippedInitialLoader = useRef(false);

  // Update: skip loader for landing and checkout pages
  const isLandingOrCheckout =
    location.pathname === '/' ||
    location.pathname === '/landing' ||
    location.pathname === '/checkout';

  useEffect(() => {
    // Skip loader for landing/checkout and on initial mount after logo intro
    if (isLandingOrCheckout) return;
    if (skipInitialLoader && !hasSkippedInitialLoader.current) {
      hasSkippedInitialLoader.current = true;
      return;
    }

    setIsPageLoading(true);
    const timer = setTimeout(() => {
      setIsPageLoading(false);
    }, 350);

    return () => clearTimeout(timer);
  }, [location.pathname, skipInitialLoader, isLandingOrCheckout]);

  if (isPageLoading && !isLandingOrCheckout) {
    return <CenterLoader />;
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/" element={<LandingPageOfOrugallu />} />
        <Route path="/landing" element={<LandingPageOfOrugallu />} />
        <Route path="/login" element={<LoginOfOrugallu />} />
        <Route path="/signup" element={<SignUpOfOrugallu />} />
        <Route path="/items" element={<ItemsOfOrugallu />} />
        <Route path="/cart" element={<CartPageOfOrugallu />} />
        <Route path="/checkout" element={<CheckoutPageOfOrugallu />} />
        <Route path="/thankyou/:orderId" element={<ThankYouPageOfOrugallu />} />
        <Route path="/home" element={<PrivateRoute><HomeOfOrugallu /></PrivateRoute>} />
        <Route path="/myorders" element={<MyOrdersOfOrugallu />} />
        <Route
          path="/admin/orders"
          element={
            user?.role === 'admin' ? <AdminOrdersPage /> : <Navigate to="/login" />
          }
        />
        <Route path="/search-results" element={<SearchResults />} />
      </Routes>
    </Suspense>
  );
}

function App() {
  const [showLogoIntro, setShowLogoIntro] = useState(true);
  const skipInitialLoaderRef = useRef(true);

  return (
    <CartProvider>
      <Router>
        <NavbarOfOrugallu showLogoIntro={showLogoIntro} />
        {showLogoIntro ? (
          <LogoIntro onComplete={() => {
            setShowLogoIntro(false);
            skipInitialLoaderRef.current = true;
          }} />
        ) : (
          <AppRoutes skipInitialLoader={skipInitialLoaderRef.current} />
        )}
        <FooterOfOrugallu />
      </Router>
    </CartProvider>
  );
}

export default App;