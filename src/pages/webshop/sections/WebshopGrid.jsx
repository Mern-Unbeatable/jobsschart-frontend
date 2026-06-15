import React, { memo, useMemo } from 'react';
import ProductCard from './ProductCard';
import Pagination from '../../../components/Pagination';

const SKELETON_COUNT = 8;

const WebshopGrid = memo(({ products = [], selectedCategory, isLoading, isError }) => {
  const itemsPerPage = 8;
  const [currentPage, setCurrentPage] = React.useState(1);

  // Category filter — 'All' shows everything; otherwise match display label
  const filteredProducts = useMemo(() => {
    if (!selectedCategory || selectedCategory.toLowerCase() === 'all') return products;

    const lower = selectedCategory.toLowerCase();
    return products.filter((p) => {
      const cat = (p.category || '').toLowerCase();
      // match by display label, API enum, or partial
      return (
        cat === lower ||
        cat.replace(/\s/g, '') === lower.replace(/\s/g, '')
      );
    });
  }, [products, selectedCategory]);

  // Reset to page 1 when category changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory]);

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isLoading) {
    return (
      <div className='container mx-auto px-4 py-10'>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
          {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
            <div key={i} className='bg-white rounded-xl border border-gray-100 p-3 animate-pulse'>
              <div className='aspect-square rounded-lg bg-gray-200 mb-4' />
              <div className='h-6 bg-gray-200 rounded mb-2 w-3/4' />
              <div className='h-4 bg-gray-100 rounded mb-1 w-full' />
              <div className='h-4 bg-gray-100 rounded mb-4 w-2/3' />
              <div className='h-6 bg-gray-200 rounded mb-4 w-1/3' />
              <div className='flex gap-2'>
                <div className='flex-1 h-10 bg-gray-200 rounded-lg' />
                <div className='flex-1 h-10 bg-gray-100 rounded-lg' />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className='container mx-auto px-4 py-20 text-center text-gray-500'>
        <p className='text-lg'>Failed to load products. Please try again later.</p>
      </div>
    );
  }

  if (filteredProducts.length === 0) {
    return (
      <div className='container mx-auto px-4 py-20 text-center text-gray-400'>
        <p className='text-lg'>No products found in this category.</p>
      </div>
    );
  }

  return (
    <div className='container mx-auto px-4 py-10'>
      {/* Products Grid */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12'>
        {paginatedProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
});

WebshopGrid.displayName = 'WebshopGrid';

export default WebshopGrid;
