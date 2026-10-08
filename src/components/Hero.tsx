import React from 'react';
import { ArrowRight, Truck, ShieldCheck, Headphones, Award } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const Hero: React.FC = () => {
  const { siteSettings, setCurrentView, setSelectedCategory } = useStore();

  const handleAction = (link: string) => {
    if (link === 'categories') {
      setCurrentView('categories');
    } else {
      setSelectedCategory(null);
      setCurrentView('shop');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#EDF4F0] via-[#F6FAF7] to-white text-slate-900 pt-10 sm:pt-14 pb-8 sm:pb-12 border-b border-[#DCE7DF] font-sans">
      {/* Soft Ambient Sage & Eucalyptus Glow Behind Hero Products */}
      <div className="absolute right-0 top-1/4 w-[500px] h-[500px] bg-[#A3CDB0]/30 blur-[130px] pointer-events-none rounded-full" />
      <div className="absolute left-1/3 bottom-0 w-[400px] h-[300px] bg-[#4A6B53]/10 blur-[120px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 items-center">
          {/* Left Column: Headlines & Action Buttons */}
          <div className="lg:col-span-6 space-y-6 text-left">
            {/* Sage Pill Badge */}
            <div className="inline-block">
              <span className="px-4 py-1.5 rounded-full bg-[#4A6B53] text-white text-xs font-bold uppercase tracking-wider shadow-sm border border-[#5C7F66]">
                AIO PRODUCTS
              </span>
            </div>

            {/* Main Headline (Because Brand in Deep Pine, Matters. in Vibrant Sage) */}
            <h1 className="text-4xl sm:text-6xl lg:text-[68px] font-black font-['Outfit'] tracking-tight leading-[1.05]">
              <span className="text-[#1A3124] block">Because Brand</span>
              <span className="text-[#4A6B53] block">Matters.</span>
            </h1>

            {/* Supporting Text */}
            <p className="text-[#3B5745] text-sm sm:text-base max-w-lg leading-relaxed font-normal">
              Discover quality products, shop with confidence, and enjoy a simple online shopping experience with AIO PRODUCT.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 pt-1">
              <button
                onClick={() => handleAction('shop')}
                className="px-7 py-3.5 rounded-xl bg-[#4A6B53] hover:bg-[#395642] text-white font-bold text-sm shadow-lg shadow-[#4A6B53]/25 transition-all hover:scale-[1.02] active:scale-98 flex items-center gap-2 group cursor-pointer"
              >
                <span>Shop Now</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>

              <button
                onClick={() => handleAction('categories')}
                className="px-7 py-3.5 rounded-xl bg-white hover:bg-[#EDF4F0] text-[#284833] font-bold text-sm border-2 border-[#88C49A] shadow-xs transition-all hover:scale-[1.02] active:scale-98 flex items-center justify-center cursor-pointer"
              >
                <span>Explore Categories</span>
              </button>
            </div>
          </div>

          {/* Right Column: Hero Showcase Collage matching reference image */}
          <div className="lg:col-span-6 relative mt-4 lg:mt-0">
            {/* Handwritten Calligraphy Top Right: "Quality Trust Value" in Warm Champagne Gold */}
            <div className="absolute top-0 right-4 sm:right-8 z-20 flex flex-col items-end pointer-events-none select-none">
              <div className="text-right text-[#C5A059] font-serif italic text-base sm:text-lg leading-tight tracking-wide drop-shadow-sm">
                <span className="block">Quality</span>
                <span className="block font-medium">Trust</span>
                <span className="block font-bold">Value</span>
              </div>
              {/* Calligraphy curved arrow pointing down */}
              <svg
                className="w-10 h-10 text-[#C5A059] stroke-current fill-none -mt-1 transform rotate-12"
                viewBox="0 0 50 50"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M 35 5 Q 40 25 15 35" />
                <path d="M 23 27 L 15 35 L 24 40" />
              </svg>
            </div>

            {/* Hero Product Composition Graphic */}
            <div className="relative rounded-2xl overflow-hidden p-2 sm:p-4">
              <div className="relative w-full h-[320px] sm:h-[400px] lg:h-[430px] flex items-center justify-center">
                {/* Center composite image of AIO products on clean backdrop */}
                <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl flex items-center justify-center border border-[#DCE7DF]">
                  <img
                    src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1000&auto=format&fit=crop&q=80"
                    alt="AIO PRODUCT Showcase"
                    className="w-full h-full object-cover object-center filter contrast-105"
                  />
                  {/* Subtle soft gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                  {/* Visual badges floating inside the showcase */}
                  <div className="absolute bottom-4 left-4 right-4 p-3.5 rounded-xl bg-white/95 backdrop-blur-md border border-[#D5E3DA] shadow-lg flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-[#4A6B53] text-white flex items-center justify-center font-black text-xs shadow-xs">
                        AIO
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">Curated Collection</h4>
                        <p className="text-[10px] text-slate-500">Electronics • Lifestyle • Essentials</p>
                      </div>
                    </div>
                    <span className="text-[11px] font-bold text-[#2D4D36] bg-[#EDF4F0] px-2.5 py-1 rounded-md border border-[#D5E3DA]">
                      100% Genuine
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Trust Badge Bar Right Under Hero */}
        <div className="mt-8 pt-6 border-t border-[#DCE7DF] flex flex-wrap items-center justify-between gap-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 flex-1">
            {/* 1. Cash on Delivery */}
            <div className="flex items-center gap-3 bg-white/80 border border-[#DDE8E0] p-3 rounded-xl shadow-xs">
              <div className="w-8 h-8 rounded-lg bg-[#EDF4F0] text-[#4A6B53] flex items-center justify-center shrink-0">
                <Truck className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#1A3124]">Cash on Delivery</h4>
                <p className="text-[11px] text-slate-500">All Pakistan cities</p>
              </div>
            </div>

            {/* 2. Quality Checked */}
            <div className="flex items-center gap-3 bg-white/80 border border-[#DDE8E0] p-3 rounded-xl shadow-xs">
              <div className="w-8 h-8 rounded-lg bg-[#EDF4F0] text-[#4A6B53] flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#1A3124]">Quality Checked</h4>
                <p className="text-[11px] text-slate-500">7-day replacement</p>
              </div>
            </div>

            {/* 3. Fast Delivery */}
            <div className="flex items-center gap-3 bg-white/80 border border-[#DDE8E0] p-3 rounded-xl shadow-xs">
              <div className="w-8 h-8 rounded-lg bg-[#EDF4F0] text-[#4A6B53] flex items-center justify-center shrink-0">
                <Award className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#1A3124]">Fast Delivery</h4>
                <p className="text-[11px] text-slate-500">To your doorstep</p>
              </div>
            </div>

            {/* 4. 24/7 Support */}
            <div className="flex items-center gap-3 bg-white/80 border border-[#DDE8E0] p-3 rounded-xl shadow-xs">
              <div className="w-8 h-8 rounded-lg bg-[#EDF4F0] text-[#4A6B53] flex items-center justify-center shrink-0">
                <Headphones className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#1A3124]">24/7 Support</h4>
                <p className="text-[11px] text-slate-500">WhatsApp & Email</p>
              </div>
            </div>
          </div>

          {/* Carousel dots indicator */}
          <div className="hidden lg:flex items-center gap-1.5 pl-4">
            <span className="w-4 h-1.5 bg-[#4A6B53] rounded-full transition-all" />
            <span className="w-1.5 h-1.5 bg-slate-300 rounded-full" />
            <span className="w-1.5 h-1.5 bg-slate-300 rounded-full" />
          </div>
        </div>
      </div>
    </section>
  );
};
