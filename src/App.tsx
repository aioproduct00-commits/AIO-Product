import React, { useState } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { FeaturedProducts } from './components/FeaturedProducts';
import { CategoriesSection } from './components/CategoriesSection';
import { SpecialOffers } from './components/SpecialOffers';
import { AboutAndReviewsSection } from './components/AboutAndReviewsSection';
import { AboutSection } from './components/AboutSection';
import { Newsletter } from './components/Newsletter';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { ProductDetailsView } from './components/ProductDetailsView';
import { ShopView } from './components/ShopView';
import { CheckoutView } from './components/CheckoutView';
import { OrderConfirmationView } from './components/OrderConfirmationView';
import { AdminDashboard } from './components/AdminDashboard';
import { CategoriesView } from './components/CategoriesView';
import { ContactView } from './components/ContactView';
import { TrackOrderModal } from './components/TrackOrderModal';
import { PolicyModal } from './components/PolicyModals';
import { CustomerAuthModal } from './components/CustomerAuthModal';
import { FrontPageProductModal } from './components/FrontPageProductModal';
import { LiveSiteEditorModal } from './components/LiveSiteEditorModal';
import { FrontPageAdminBar } from './components/FrontPageAdminBar';
import { ShareProductModal } from './components/ShareProductModal';
import { Toast } from './components/Toast';

const MainLayout: React.FC = () => {
  const { currentView, sharingProduct, setSharingProduct } = useStore();
  const [trackOrderOpen, setTrackOrderOpen] = useState(false);
  const [policyType, setPolicyType] = useState<'privacy' | 'terms' | 'return' | 'shipping' | null>(null);

  // If viewing admin dashboard, render it as a full-screen dedicated management workspace
  if (currentView === 'admin') {
    return (
      <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
        <AdminDashboard />
        <FrontPageProductModal />
        {sharingProduct && (
          <ShareProductModal
            product={sharingProduct}
            onClose={() => setSharingProduct(null)}
          />
        )}
        <Toast />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F7FAF8] text-slate-800 font-sans selection:bg-[#4A6B53] selection:text-white">
      {/* Admin Front Page Live Bar (when logged in) */}
      <FrontPageAdminBar />

      {/* Sticky Header with Navigation */}
      <Navbar
        onOpenTrackOrder={() => setTrackOrderOpen(true)}
      />

      {/* Dynamic View Router */}
      <main className="flex-1">
        {currentView === 'home' && (
          <>
            {/* 1. Hero Section with Quality Trust Value Calligraphy and Trust Bar */}
            <Hero />

            {/* 2. Explore Our Categories (White background, 6 cards) */}
            <CategoriesSection />

            {/* 3. Featured Products (Dark background, 4 cards with -25%, New, etc.) */}
            <FeaturedProducts />

            {/* 4. Special Offers UP TO 50% OFF with countdown timer */}
            <SpecialOffers />

            {/* 5. About AIO Product & Customer Reviews (Side by side on White background) */}
            <AboutAndReviewsSection />

            {/* 6. Subscribe to Our Newsletter (Dark with orange button) */}
            <Newsletter />
          </>
        )}

        {currentView === 'shop' && <ShopView />}

        {currentView === 'categories' && <CategoriesView />}

        {currentView === 'product-details' && <ProductDetailsView />}

        {currentView === 'about' && (
          <>
            <AboutSection />
            <Newsletter />
          </>
        )}

        {currentView === 'contact' && <ContactView />}

        {currentView === 'checkout' && <CheckoutView />}

        {currentView === 'order-confirmation' && <OrderConfirmationView />}
      </main>

      {/* Global Footer (Dark background with links, policies, contact info, VISA, Mastercard, COD) */}
      <Footer
        onOpenPolicy={type => setPolicyType(type)}
        onOpenTrackOrder={() => setTrackOrderOpen(true)}
      />

      {/* Slide-over Cart */}
      <CartDrawer />

      {/* Modals & Overlays */}
      <TrackOrderModal
        isOpen={trackOrderOpen}
        onClose={() => setTrackOrderOpen(false)}
      />

      <PolicyModal
        type={policyType}
        onClose={() => setPolicyType(null)}
      />

      {/* Customer Account & Gmail Auth Modal */}
      <CustomerAuthModal />

      {/* Front Page Product Editor Modal */}
      <FrontPageProductModal />

      {/* Live Site Content Editor Modal */}
      <LiveSiteEditorModal />

      {/* Product Share Modal */}
      {sharingProduct && (
        <ShareProductModal
          product={sharingProduct}
          onClose={() => setSharingProduct(null)}
        />
      )}

      {/* Toast Feedback */}
      <Toast />
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <MainLayout />
    </StoreProvider>
  );
}
