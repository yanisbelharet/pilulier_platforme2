import React, { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ShoppingCart } from 'lucide-react';
import { CheckoutForm, Testimonials } from './LandingPage';

// Import images to ensure Vite bundles them and handles paths correctly
import img1 from './assets/1_optimise.webp';
import img2 from './assets/2_optimise.webp';
import img3 from './assets/3_optimise.webp';
import img4 from './assets/4_optimise.webp';
import img5 from './assets/5_optimise.webp';

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
        // Show sticky button when we've scrolled PAST the checkout form
        // checkoutForm.getBoundingClientRect().bottom < window.innerHeight means the bottom of the form is visible, 
        // let's say when the bottom is above the viewport ( < 0 ) or mostly above.
        // Let's just say < 0 so it appears when the form is hidden.
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
        <img src={img1} alt="Product" className="w-full object-cover" />

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
        <img src={img2} alt="Product details" className="w-full object-cover" />
        <img src={img3} alt="Product details" className="w-full object-cover mt-2" />
        <img src={img4} alt="Product details" className="w-full object-cover mt-2" />
        <img src={img5} alt="Product details" className="w-full object-cover mt-2" />

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
