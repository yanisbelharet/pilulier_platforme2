import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './LandingPage';
import LandingPageV2 from './LandingPageV2';
import LandingPageV3 from './LandingPageV3';
import Dashboard from './Dashboard';
import Storefront from './Storefront';
import ThankYou from './ThankYou';
import { db } from './firebase';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';

export default function App() {
  const [config, setConfig] = useState<{
    productPrice: number;
    productOldPrice: number;
    promoActive: boolean;
    promoText: string;
    visits: number;
    fbPixelId: string;
    tiktokPixelId: string;
    timerEnabled: boolean;
    timerHours: number;
    products: any[];
  } | null>(null);

  const defaultProducts = [
    {
      id: "med-alarm",
      name: "منبه الدواء الذكي",
      description: "تخلص من القلق ونظم أدويتك بكل سهولة! حافظة ذكية مزودة بـ 4 منبهات قوية لتذكيرك في الوقت المحدد.",
      price: 2000,
      oldPrice: 2900,
      imageUrl: "https://cdn.youcan.shop/stores/defae844a0bbda3e5af90b6e7c10442b/others/7UDcKpzGFzchMMbeTwAB3UJZsYDCHWRiLTfg2A3T.jpg",
      isVisible: true
    },
    {
      id: "med-alarm-v3",
      name: "منبه الدواء الذكي (النسخة 3)",
      description: "تخلص من القلق ونظم أدويتك بكل سهولة! حافظة ذكية مزودة بـ 4 منبهات قوية لتذكيرك في الوقت المحدد.",
      price: 2000,
      oldPrice: 2900,
      imageUrl: "https://cdn.youcan.shop/stores/ba86712f261c8f3eed78e0e12a689855/others/UcuCAbqBuLvphQwpgudEKiSTjNT7tkDWqG2nmVoF.webp",
      isVisible: true,
      customPath: "/product-v3/med-alarm"
    }
  ];

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "config", "main"), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        
        // Merge default products with saved products if necessary
        let mergedProducts = data.products || defaultProducts;
        if (data.products) {
          // Add missing default products to the saved products based on ID
          const existingIds = new Set(data.products.map(p => p.id));
          const missingProducts = defaultProducts.filter(p => !existingIds.has(p.id));
          mergedProducts = [...data.products, ...missingProducts];
        }

        setConfig({ 
           productPrice: 2000,
           productOldPrice: 3500,
           promoActive: true,
           promoText: 'عرض ترويجي محدود!',
           visits: 0,
           fbPixelId: "",
           tiktokPixelId: "",
           timerEnabled: true,
           timerHours: 24,
           ...data,
           products: mergedProducts
         } as any);

      } else {
        setConfig({
          productPrice: 2000,
          productOldPrice: 3500,
          promoActive: true,
           promoText: 'عرض ترويجي محدود!',
          visits: 0,
          fbPixelId: "",
          tiktokPixelId: "",
          timerEnabled: true,
          timerHours: 24,
          products: defaultProducts
        });
      }
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (config) {
      // Inject Facebook Pixel
      if (config.fbPixelId) {
        ;(function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)})(window, document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
        
        const fbPixels = config.fbPixelId.split(',').map(p => p.trim()).filter(Boolean);
        fbPixels.forEach(p => window.fbq('init', p));
        window.fbq('track', 'PageView');
      }

      // Inject TikTok Pixel
      if (config.tiktokPixelId) {
        ;(function (w, d, t) {
          w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"];ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e};ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=i,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};var o=document.createElement("script");o.type="text/javascript",o.async=!0,o.src=i+"?sdkid="+e+"&lib="+t;var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};
          const ttPixels = config.tiktokPixelId.split(',').map(p => p.trim()).filter(Boolean);
          ttPixels.forEach(p => ttq.load(p));
          ttq.page();
        })(window, document, 'ttq');
      }
    }
  }, [config]);

  
  useEffect(() => {
    // track visit once per session
    if (!sessionStorage.getItem('visitTracked')) {
      fetch('/api/track-visit', { method: 'POST' }).catch(() => {});
      sessionStorage.setItem('visitTracked', 'true');
    }
  }, []);

  const handlePurchase = (price: number, product: any, formData?: any) => {
    if (config?.fbPixelId && window.fbq) {
      window.fbq('track', 'Purchase', { value: price, currency: 'DZD' });
    }
    if (config?.tiktokPixelId && window.ttq) {
      if (formData && formData.phone) {
        let phone = String(formData.phone).trim();
        if (phone.startsWith('0')) {
          phone = '+213' + phone.substring(1);
        } else if (!phone.startsWith('+')) {
          phone = '+213' + phone;
        }
        window.ttq.identify({
          phone_number: phone
        });
      }
      window.ttq.track('CompletePayment', {
        contents: [{
          content_id: product.id,
          content_type: 'product',
          content_name: product.name,
        }],
        value: price,
        currency: 'DZD'
      });
    }
  };

  if (!config) return <div className="min-h-screen flex items-center justify-center">Chargement...</div>;

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Storefront config={config} />} />
        <Route path="/product/:id" element={<LandingPage config={config} onPurchase={(price, product, formData) => handlePurchase(price, product, formData)} />} />
        <Route path="/product-v2/:id" element={<LandingPageV2 config={config} onPurchase={(price, product, formData) => handlePurchase(price, product, formData)} />} />
        <Route path="/product-v3/:id" element={<LandingPageV3 config={config} onPurchase={(price, product, formData) => handlePurchase(price, product, formData)} />} />
        <Route path="/admin" element={<Dashboard />} />
        <Route path="/thank-you" element={<ThankYou config={config} />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

declare global {
  interface Window {
    fbq: any;
    _fbq: any;
    TiktokAnalyticsObject: any;
    ttq: any;
  }
}
