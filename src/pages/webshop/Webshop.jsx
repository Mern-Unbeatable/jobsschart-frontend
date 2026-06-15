import React, { memo, useState } from 'react';
import { useSEO } from '../../hooks/useSEO';
import WebshopHero from './sections/WebshopHero';
import WebshopGrid from './sections/WebshopGrid';
import WebshopAds from './sections/WebshopAds';
import { useGetProductsQuery } from '../../features/api/productApi';

const Webshop = memo(() => {
  const [selectedCategory, setSelectedCategory] = useState('All');

  useSEO({
    title: 'Webshop',
    description: 'Spiritual products recommended by our expert consultants',
    keywords: ['webshop', 'shop', 'spiritual', 'products'],
  });

  const { data, isLoading, isError } = useGetProductsQuery({ isActive: true });

  // API returns products array under data.products or data directly
  const rawProducts = data?.products || data || [];

  // Normalize each product so ProductCard always has .image and .category (display label)
  const CATEGORY_LABEL = {
    SpiritualItems: 'Spiritual Items',
    HealingTools: 'Healing Tools',
    Articles: 'Articles',
    DigitalProducts: 'Digital Products',
    Books: 'Books',
  };

  const products = rawProducts.map((p) => ({
    ...p,
    image: p.gallery?.[0] || p.image || '',
    category: CATEGORY_LABEL[p.productCategory] || p.productCategory || '',
  }));

  return (
    <div className='min-h-screen bg-[#FBFDFF] pt-8 md:pt-12 pb-14 mb:pb-20'>
      <WebshopHero selectedCategory={selectedCategory} onCategoryChange={setSelectedCategory} />
      <WebshopGrid
        products={products}
        selectedCategory={selectedCategory}
        isLoading={isLoading}
        isError={isError}
      />
      <WebshopAds />
    </div>
  );
});

Webshop.displayName = 'Webshop';

export default Webshop;