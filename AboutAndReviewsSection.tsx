import React from 'react';
import { ArrowRight, Star, CheckCircle2, Edit3, Plus } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { formatDate } from '../lib/utils';

export const AboutAndReviewsSection: React.FC = () => {
  const { setCurrentView, siteSettings, reviews, isAdminLoggedIn, openLiveEdit } = useStore();

  const about = siteSettings.about || {
    heading: 'Because Brand Matters.',
    tagline: 'Because Brand Matters.',
    description:
      'AIO PRODUCT is a modern online shopping brand focused on bringing useful, quality, and carefully selected products to customers in Pakistan. We aim to provide a simple, trustworthy, convenient, and enjoyable shopping experience.',
  };

  const defaultReviews = [
    {
      id: 'rev-seed-1',
      customer_name: 'Ahmed Raza',
      rating: 5,
      created_at: '2025-04-12T10:00:00Z',
      review_text: 'Amazing quality and very fast delivery. Highly recommended!',
    },
    {
      id: 'rev-seed-2',
      customer_name: 'Ayesha Khan',
      rating: 5,
      created_at: '2025-04-08T10:00:00Z',
      review_text: 'Original products and great customer service. Will shop again!',
    },
    {
      id: 'rev-seed-3',
      customer_name: 'Usman Ali',
      rating: 5,
      created_at: '2025-04-02T10:00:00Z',
      review_text: 'Best online shopping experience in Pakistan. Keep it up!',
    },
  ];

  const displayReviews = (reviews && reviews.length > 0 ? reviews.slice(0, 3) : defaultReviews);

  return (
    <section className="py-14 sm:py-20 bg-white font-sans border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12">
          {/* Left Column: ABOUT AIO PRODUCT */}
          <div className="lg:col-span-7 flex flex-col md:flex-row gap-6 items-start relative">
            {/* Storefront Image */}
            <div className="w-full md:w-5/12 aspect-[4/5] sm:aspect-square md:aspect-auto md:h-full rounded-2xl overflow-hidden bg-slate-900 relative shadow-md shrink-0">
              <img
                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&auto=format&fit=crop&q=80"
                alt="AIO PRODUCT Storefront"
                className="w-full h-full object-cover filter brightness-90"
              />
              <div className="absolute inset-0 bg-black/40 flex flex-col justify-end p-4 text-white">
                <span className="text-base font-black font-['Outfit'] uppercase tracking-tight">
                  AIO PRODUCT.
                </span>
                <span className="text-[10px] text-[#88C49A] font-semibold">
                  Because Brand Matters.
                </span>
              </div>
            </div>

            {/* Content & 4 Value Badges */}
            <div className="flex-1 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#4A6B53] block">
                  ABOUT AIO PRODUCT
                </span>

                {isAdminLoggedIn && (
                  <button
                    type="button"
                    onClick={() => openLiveEdit('about')}
                    className="px-2.5 py-1 rounded-lg bg-[#4A6B53] hover:bg-[#3D5B45] text-white text-[11px] font-bold flex items-center gap-1 shadow-sm transition-all cursor-pointer"
                  >
                    <Edit3 className="w-3 h-3" />
                    <span>Edit About</span>
                  </button>
                )}
              </div>

              <h3 className="text-2xl sm:text-3xl font-black text-slate-950 font-['Outfit'] tracking-tight">
                {about.heading || 'Because Brand Matters.'}
              </h3>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {about.description}
              </p>

              {/* 4 Pillars in 2x2 grid */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-md bg-[#EBF3ED] text-[#2F533A] flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-bold text-slate-900">Quality Products</span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-md bg-[#EBF3ED] text-[#2F533A] flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-bold text-slate-900">Trusted Shopping</span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-md bg-[#EBF3ED] text-[#2F533A] flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-bold text-slate-900">Convenience For You</span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-md bg-[#EBF3ED] text-[#2F533A] flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-bold text-slate-900">Customer Satisfaction</span>
                </div>
              </div>

              {/* Learn More Button */}
              <div className="pt-2">
                <button
                  onClick={() => {
                    setCurrentView('about');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="px-5 py-2.5 rounded-xl bg-[#4A6B53] hover:bg-[#3D5B45] text-white font-bold text-xs flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
                >
                  <span>Learn More</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: CUSTOMER REVIEWS */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#4A6B53] block mb-1">
                  CUSTOMER REVIEWS
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-950 font-['Outfit'] tracking-tight">
                  What Our Customers Say
                </h3>
              </div>

              {isAdminLoggedIn && (
                <button
                  type="button"
                  onClick={() => openLiveEdit('review')}
                  className="px-2.5 py-1 rounded-lg bg-[#4A6B53] hover:bg-[#3D5B45] text-white text-[11px] font-bold flex items-center gap-1 shadow-sm transition-all cursor-pointer"
                >
                  <Plus className="w-3 h-3" />
                  <span>+ Add Review</span>
                </button>
              )}
            </div>

            {/* Review Cards */}
            <div className="space-y-3 pt-1">
              {displayReviews.map((rev, idx) => (
                <div
                  key={rev.id || idx}
                  className="p-3.5 sm:p-4 rounded-2xl bg-[#f8f9fa] border border-slate-100 flex items-start gap-3 hover:bg-white hover:border-[#A9C4B0] hover:shadow-sm transition-all"
                >
                  <div className="w-10 h-10 rounded-full bg-[#EBF3ED] text-[#2F533A] font-black text-sm flex items-center justify-center shrink-0 border border-[#D3E5D7]">
                    {rev.customer_name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-bold text-slate-900 truncate">{rev.customer_name}</h4>
                        <div className="flex text-amber-400">
                          {[...Array(rev.rating)].map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-current text-amber-400" />
                          ))}
                        </div>
                      </div>
                      <span className="text-[10px] text-slate-400 shrink-0">
                        {rev.created_at ? formatDate(rev.created_at) : 'Recent'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1 leading-snug">
                      &quot;{rev.review_text}&quot;
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
