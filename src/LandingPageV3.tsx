import React, { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ShoppingCart } from 'lucide-react';
import { CheckoutForm, Testimonials } from './LandingPage';

// Images hébergées directement sur le CDN YouCan (plus besoin de les inclure dans le bundle)
const img1 = 'https://cdn.youcan.shop/stores/ba86712f261c8f3eed78e0e12a689855/others/HxVCmxikiwh6FWU4vOJ9898xYRoXH5n8uTCqLIP3.webp';
const img2 = 'https://cdn.youcan.shop/stores/ba86712f261c8f3eed78e0e12a689855/others/1FEj3c7j36EWW7kiy2pKEZM7qvWb9mSMlohcRY2L.webp';
const img3 = 'https://cdn.youcan.shop/stores/ba86712f261c8f3eed78e0e12a689855/others/U2IocP01AopSh7BOOXvMuHvfpw6ZXuCo4NqtoSRW.webp';
const img4 = 'https://cdn.youcan.shop/stores/ba86712f261c8f3eed78e0e12a689855/others/h8zAvfzkwgJ8jrYQ733QQlmJFFXLWn5A4V8DAN7S.webp';
const img5 = 'https://cdn.youcan.shop/stores/ba86712f261c8f3eed78e0e12a689855/others/zEIXhfMlrE4wnCPQs6Bps1b806axSQE6gDj2ND5t.webp';

export default function LandingPageV3({ config, onPurchase }: { config: any, onPurchase: (p: number, product: any, formData?: any) => void }) {
  const { id } = useParams();
  const product = config.products ? config.products.find((p: any) => p.id === id) : null;
  
  if (!product) return <Navigate to="/" />;

  const [showStickyButton, setShowStickyButton] = useState(false);

  useEffect(() => {
    if (product && window.ttq) {
      window.ttq.track('ViewContent', {
        contents: [{
          content_id: product.id,
          content_type: 'product',
          content_name: product.name,
        }],
        value: product.price,
        currency: 'DZD'
      });
    }
  }, [product]);

  useEffect(() => {
    const handleScroll = () => {
      const checkoutForm = document.getElementById('checkout');
      let pastCheckout = false;

      if (checkoutForm) {
        pastCheckout = checkoutForm.getBoundingClientRect().bottom < 0;
      } else {
        pastCheckout = window.scrollY > 400;
      }
      
      setShowStickyButton(pastCheckout);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    setTimeout(handleScroll, 100);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 pb-24 font-sans text-slate-800" dir="rtl">
      <div className="max-w-2xl mx-auto bg-white shadow-2xl min-h-screen overflow-hidden flex flex-col">
        {/* 1. Image 1 */}
        <img src={img1} alt="Product" loading="eager" decoding="async" fetchpriority="high" width="600" height="600" className="w-full object-cover aspect-square" />

        {/* 2. Checkout Form */}
        <section id="checkout" className="py-8 bg-white px-4 border-t border-slate-100">
          <div className="max-w-xl mx-auto">
            <CheckoutForm product={product} promoActive={config.promoActive} promoText={config.promoText} onPurchase={onPurchase} />
          </div>
        </section>

        {/* 3. Link Button - Scroll to Checkout */}
        <div className="px-4 pb-8 pt-4 flex justify-center">
          <a 
            href="#checkout" 
            className="w-[300px] flex items-center justify-center gap-3 py-3 px-6 bg-gradient-to-r from-[#417505] to-[#7ED321] hover:from-[#7ED321] hover:to-[#417505] text-white rounded-[30px] font-bold text-[17px] border-4 border-[#7ED321] transition-all shadow-sm"
          >
            <ShoppingCart size={20} />
            أطلب الآن
          </a>
        </div>

        {/* 4. Images List */}
        <img src={img2} alt="Product details" loading="lazy" decoding="async" width="600" height="600" className="w-full object-cover aspect-square" />
        <img src={img3} alt="Product details" loading="lazy" decoding="async" width="600" height="600" className="w-full object-cover aspect-square mt-2" />
        <img src={img4} alt="Product details" loading="lazy" decoding="async" width="600" height="600" className="w-full object-cover aspect-square mt-2" />
        <img src={img5} alt="Product details" loading="lazy" decoding="async" width="600" height="600" className="w-full object-cover aspect-square mt-2" />

        {/* 5. Reviews */}
        <Testimonials />
      </div>

      {/* Sticky Bottom CTA */}
      <motion.div 
        initial={{ y: 100 }}
        animate={{ y: showStickyButton ? 0 : 100 }}
        className="fixed bottom-0 left-0 right-0 p-4 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-[0_-10px_30px_rgba(0,0,0,0.1)] z-50 flex justify-center items-center gap-4"
      >
        <div className="w-full max-w-2xl mx-auto flex items-center justify-between gap-4 px-2">
          <a 
            href="#checkout" 
            className="flex-1 flex items-center justify-center gap-3 py-3.5 px-6 bg-gradient-to-r from-[#417505] to-[#7ED321] text-white rounded-2xl font-black text-xl shadow-lg active:scale-95 transition-all"
          >
            <ShoppingCart size={22} />
            <span>اطلب الآن</span>
          </a>
        </div>
      </motion.div>
    </div>
  );
}
