import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import toast from 'react-hot-toast';
import { ROUTES } from '../../../../config';
import ProductCard from './components/ProductCard';
import DeleteModal from './components/DeleteModal';
import Pagination from './components/Pagination';
import {
  useGetProductsQuery,
  useDeleteProductMutation,
} from '../../../../features/api/productApi';

// ─── Constants ────────────────────────────────────────────────────────────────

const PAGE_SIZE = 8;

const CATEGORIES = [
  'All',
  'Spiritual Items',
  'Healing Tools',
  'Articles',
  'Digital Products',
  'Books',
];

// Map display label → API enum value
const CATEGORY_API_MAP = {
  'Spiritual Items': 'SpiritualItems',
  'Healing Tools': 'HealingTools',
  'Articles': 'Articles',
  'Digital Products': 'DigitalProducts',
  'Books': 'Books',
};

// ─── Main Component ───────────────────────────────────────────────────────────

const AdminWebshop = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('All');
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const gridRef = useRef(null);
  const filterBtnRefs = useRef([]);

  // Fetch real data using RTK Query
  const queryParams = { page, limit: PAGE_SIZE };
  if (activeCategory !== 'All') {
    queryParams.productCategory = CATEGORY_API_MAP[activeCategory] || activeCategory;
  }
  
  const { data, isLoading, error } = useGetProductsQuery(queryParams);
  const [deleteProduct] = useDeleteProductMutation();

  const products = data?.products || [];
  const totalPages = data?.meta?.totalPages || 1;

  // Animate cards when filter, page, or load state changes
  useEffect(() => {
    if (!gridRef.current || isLoading) return;
    const cards = gridRef.current.querySelectorAll('[data-card]');
    gsap.fromTo(
      cards,
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, stagger: 0.05, duration: 0.3, ease: 'power2.out' },
    );
  }, [activeCategory, page, isLoading]);

  const handleCategoryChange = useCallback((cat) => {
    setActiveCategory(cat);
    setPage(1);
  }, []);

  const handleDelete = useCallback(async () => {
    if (!deleteTarget) return;
    try {
      await deleteProduct(deleteTarget.id).unwrap();
      toast.success('Product deleted successfully');
    } catch (err) {
      console.error('Delete error:', err);
      toast.error(err?.message || 'Failed to delete product');
    } finally {
      setDeleteTarget(null);
    }
  }, [deleteTarget, deleteProduct]);

  return (
    <div className='flex flex-col gap-6'>
      {/* Page header */}
      <div className='flex items-start justify-between gap-4'>
        <div className='flex flex-col gap-2'>
          <h1
            className='text-3xl md:text-4xl font-semibold text-[#050609] leading-tight'
            style={{ fontFamily: "'Crimson Pro', Georgia, serif" }}
          >
            Webshop
          </h1>
          <p className='text-base text-[#464646]'>
            Overview &amp; manage your products, orders, and online store
            activity.
          </p>
        </div>
        <button
          onClick={() => navigate(ROUTES.ADMIN_WEBSHOP_ADD_PRODUCT)}
          className='shrink-0 flex items-center gap-2 bg-[#E2AB0B] text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-[#c99809] transition-colors cursor-pointer'
        >
          <Plus size={16} />
          Add New Products
        </button>
      </div>

      {/* Category filter tabs */}
      <div className='flex flex-wrap gap-3 items-center'>
        {CATEGORIES.map((cat, i) => (
          <button
            key={cat}
            ref={(el) => (filterBtnRefs.current[i] = el)}
            onClick={() => handleCategoryChange(cat)}
            onMouseEnter={() => {
              if (cat !== activeCategory)
                gsap.to(filterBtnRefs.current[i], {
                  scale: 1.04,
                  duration: 0.13,
                });
            }}
            onMouseLeave={() =>
              gsap.to(filterBtnRefs.current[i], { scale: 1, duration: 0.13 })
            }
            className={`px-3 py-1.5 rounded-full text-base font-normal transition-colors cursor-pointer ${
              activeCategory === cat
                ? 'bg-[#333] text-white'
                : 'border border-black/[0.12] text-[#333] hover:bg-gray-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Product grid / Load states */}
      {isLoading ? (
        <div className='py-24 text-center text-base text-gray-400 flex flex-col items-center justify-center gap-3'>
          <div className='w-8 h-8 border-4 border-[#E2AB0B] border-t-transparent rounded-full animate-spin' />
          <span>Loading products...</span>
        </div>
      ) : error ? (
        <div className='py-24 text-center text-base text-red-500'>
          {error?.data?.message || error?.message || 'Failed to load products. Please try again.'}
        </div>
      ) : products.length === 0 ? (
        <div className='py-24 text-center text-base text-gray-400'>
          No products found in this category.
        </div>
      ) : (
        <div
          ref={gridRef}
          className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5'
        >
          {products.map((product) => (
            <div key={product.id} data-card>
              <ProductCard
                product={product}
                onView={() =>
                  navigate(
                    ROUTES.ADMIN_WEBSHOP_PRODUCT_VIEW.replace(
                      ':productId',
                      product.id,
                    ),
                    {
                      state: { product },
                    },
                  )
                }
                onEdit={() =>
                  navigate(ROUTES.ADMIN_WEBSHOP_ADD_PRODUCT, {
                    state: { mode: 'edit', product },
                  })
                }
                onDelete={() =>
                  setDeleteTarget({ id: product.id, name: product.name })
                }
              />
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {!isLoading && !error && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      )}

      {/* Delete confirmation modal */}
      {deleteTarget && (
        <DeleteModal
          name={deleteTarget.name}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
};

export default AdminWebshop;
