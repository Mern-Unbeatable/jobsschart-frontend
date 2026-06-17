import React, { useCallback, useEffect, useRef, useState, useMemo } from 'react';
import toast from 'react-hot-toast';
import CategorySection from './components/CategorySection';
import TopicsSection from './components/TopicsSection';
import BlogCategorySection from './components/BlogCategorySection';
import PricingSection from './components/PricingSection';
import SettingsModal from './components/SettingsModal';

import {
  useGetAllPackagesQuery,
  useCreatePackageMutation,
  useUpdatePackageMutation,
  useDeletePackageMutation,
} from '../../../../features/api/packageApi';

import {
  useGetAllBlogCategoriesQuery,
  useCreateBlogCategoryMutation,
  useDeleteBlogCategoryMutation,
} from '../../../../features/api/blogApi';

import {
  useGetAllTopicsQuery,
  useCreateTopicMutation,
  useDeleteTopicMutation,
} from '../../../../features/api/topicApi';

import {
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
} from '../../../../features/api/categoryApi';

// ─── Constants ────────────────────────────────────────────────────────────────

const MODAL_CLOSE_ANIMATION_MS = 240;

const TAG_MODAL_CONFIG = {
  category: {
    title: 'Category name',
    placeholder: 'Category name',
  },
  topics: {
    title: 'Topics name',
    placeholder: 'Topics name',
  },
  blogCategory: {
    title: 'Blog category',
    placeholder: 'Category name',
  },
};

const INITIAL_CATEGORIES = [
  { id: 1, name: 'Relationship advice' },
  { id: 2, name: 'Compatibility check' },
  { id: 3, name: 'Stress management' },
];

const INITIAL_TOPICS = [
  { id: 1, name: 'How to stay consistent in life?' },
  { id: 2, name: 'How to switch career?' },
];

const INITIAL_BLOG_CATEGORIES = [
  { id: 1, name: 'Spiritual Guidance' },
  { id: 2, name: 'Consultant tips' },
  { id: 3, name: 'Platform Updates' },
  { id: 4, name: 'Articles' },
];

const EMPTY_PRICE_FORM = {
  name: '',
  price: '',
  minutes: '0',
  credits: '0',
  description: '',
  featured: '',
};

// ─── Main component ───────────────────────────────────────────────────────────

const Settings = () => {
  // RTK Query hooks for category operations
  const { data: categoriesData, isLoading: isCategoriesLoading } = useGetCategoriesQuery();
  const [createCategory] = useCreateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();

  const categories = useMemo(() => {
    return categoriesData?.categories || categoriesData || [];
  }, [categoriesData]);

  // RTK Query hooks for topic operations
  const { data: topicsData, isLoading: isTopicsLoading } = useGetAllTopicsQuery();
  const [createTopic] = useCreateTopicMutation();
  const [deleteTopic] = useDeleteTopicMutation();

  const topics = useMemo(() => {
    return topicsData?.topics || topicsData || [];
  }, [topicsData]);

  // RTK Query hooks for blog category operations
  const { data: blogCatsData, isLoading: isBlogCatsLoading } = useGetAllBlogCategoriesQuery();
  const [createBlogCategory] = useCreateBlogCategoryMutation();
  const [deleteBlogCategory] = useDeleteBlogCategoryMutation();

  const blogCategories = useMemo(() => {
    return blogCatsData?.categories || [];
  }, [blogCatsData]);

  // RTK Query hooks for package operations
  const { data: packagesData, isLoading: isPackagesLoading } = useGetAllPackagesQuery();
  const [createPackage, { isLoading: isCreating }] = useCreatePackageMutation();
  const [updatePackage, { isLoading: isUpdating }] = useUpdatePackageMutation();
  const [deletePackage, { isLoading: isDeleting }] = useDeletePackageMutation();

  const [activeModal, setActiveModal] = useState(null);
  const [isModalClosing, setIsModalClosing] = useState(false);
  const [editingPlanId, setEditingPlanId] = useState(null);

  const [tagInput, setTagInput] = useState('');
  const [tagError, setTagError] = useState('');
  const [priceForm, setPriceForm] = useState(EMPTY_PRICE_FORM);
  const [priceErrors, setPriceErrors] = useState({});

  const closeTimerRef = useRef(null);
  const nextIdRef = useRef(100);

  useEffect(() => {
    return () => {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    };
  }, []);

  // ── Modal lifecycle

  const handleCloseModal = useCallback(() => {
    setIsModalClosing(true);
    closeTimerRef.current = setTimeout(() => {
      setActiveModal(null);
      setIsModalClosing(false);
      setEditingPlanId(null);
      setTagInput('');
      setTagError('');
      setPriceForm(EMPTY_PRICE_FORM);
      setPriceErrors({});
    }, MODAL_CLOSE_ANIMATION_MS);
  }, []);

  const openModal = useCallback((modalType) => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    setIsModalClosing(false);
    setEditingPlanId(null);
    setTagInput('');
    setTagError('');
    setPriceForm(EMPTY_PRICE_FORM);
    setPriceErrors({});
    setActiveModal(modalType);
  }, []);

  const openEditPrice = useCallback((plan) => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    setIsModalClosing(false);
    setEditingPlanId(plan.id);
    setPriceForm({
      name: plan.name,
      price: String(plan.price),
      minutes: String(plan.minutes || 0),
      credits: String(plan.credits || 0),
      description: plan.description || '',
      featured: (plan.features || []).join('\n'),
    });
    setPriceErrors({});
    setActiveModal('price');
  }, []);

  // ── Category handlers

  const handleDeleteCategory = useCallback(async (id) => {
    try {
      await deleteCategory(id).unwrap();
      toast.success('Category deleted successfully');
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to delete category');
    }
  }, [deleteCategory]);

  const handleSaveCategory = useCallback(async () => {
    if (!tagInput.trim()) {
      setTagError('Category name is required');
      return;
    }
    try {
      await createCategory({ name: tagInput.trim() }).unwrap();
      toast.success('Category added successfully');
      handleCloseModal();
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to add category');
    }
  }, [tagInput, createCategory, handleCloseModal]);

  // ── Topics handlers

  const handleDeleteTopic = useCallback(async (id) => {
    try {
      await deleteTopic(id).unwrap();
      toast.success('Topic deleted successfully');
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to delete topic');
    }
  }, [deleteTopic]);

  const handleSaveTopic = useCallback(async () => {
    if (!tagInput.trim()) {
      setTagError('Topic name is required');
      return;
    }
    try {
      await createTopic({ name: tagInput.trim() }).unwrap();
      toast.success('Topic added successfully');
      handleCloseModal();
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to add topic');
    }
  }, [tagInput, createTopic, handleCloseModal]);

  // ── Blog Category handlers

  const handleDeleteBlogCategory = useCallback(async (id) => {
    try {
      await deleteBlogCategory(id).unwrap();
      toast.success('Blog category deleted successfully');
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to delete blog category');
    }
  }, [deleteBlogCategory]);

  const handleSaveBlogCategory = useCallback(async () => {
    if (!tagInput.trim()) {
      setTagError('Blog category name is required');
      return;
    }
    try {
      await createBlogCategory({ name: tagInput.trim() }).unwrap();
      toast.success('Blog category added successfully');
      handleCloseModal();
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to add blog category');
    }
  }, [tagInput, createBlogCategory, handleCloseModal]);

  // ── Pricing handlers

  const handleDeletePlan = useCallback(async (id) => {
    try {
      await deletePackage(id).unwrap();
      toast.success('Pricing package deleted successfully');
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to delete package');
    }
  }, [deletePackage]);

  const handleSavePrice = useCallback(async () => {
    const errors = {};

    if (!priceForm.name.trim()) {
      errors.name = 'Name is required';
    }

    if (!priceForm.price.trim()) {
      errors.price = 'Price is required';
    } else if (isNaN(Number(priceForm.price)) || Number(priceForm.price) < 0) {
      errors.price = 'Enter a valid price';
    }

    if (!priceForm.minutes.trim()) {
      errors.minutes = 'Minutes is required';
    } else if (
      isNaN(Number(priceForm.minutes)) ||
      Number(priceForm.minutes) < 0
    ) {
      errors.minutes = 'Enter valid minutes';
    }

    if (!priceForm.credits.trim()) {
      errors.credits = 'Credits are required';
    } else if (
      isNaN(Number(priceForm.credits)) ||
      Number(priceForm.credits) < 0
    ) {
      errors.credits = 'Enter valid credits';
    }

    if (!priceForm.featured.trim()) {
      errors.featured = 'At least one feature is required';
    }

    if (Object.keys(errors).length > 0) {
      setPriceErrors(errors);
      return;
    }

    const features = priceForm.featured
      .split('\n')
      .map((f) => f.trim())
      .filter(Boolean);

    // Create a URL friendly slug
    const slug = priceForm.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const planData = {
      name: priceForm.name.trim(),
      slug,
      price: Number(priceForm.price),
      minutes: Number(priceForm.minutes),
      credits: Number(priceForm.credits),
      description: priceForm.description.trim(),
      features,
    };

    try {
      if (editingPlanId !== null) {
        await updatePackage({ id: editingPlanId, ...planData }).unwrap();
        toast.success('Pricing package updated successfully');
      } else {
        await createPackage(planData).unwrap();
        toast.success('Pricing package created successfully');
      }
      handleCloseModal();
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to save pricing package');
    }
  }, [priceForm, editingPlanId, createPackage, updatePackage, handleCloseModal]);

  // ── Derived values

  const isModalOpen = activeModal !== null;
  const isPriceModal = activeModal === 'price';
  const tagConfig =
    !isPriceModal && activeModal ? TAG_MODAL_CONFIG[activeModal] : null;

  const tagSaveHandler =
    activeModal === 'category'
      ? handleSaveCategory
      : activeModal === 'topics'
        ? handleSaveTopic
        : handleSaveBlogCategory;

  const overlayClass = isModalClosing
    ? 'animate-modal-overlay-out'
    : 'animate-modal-overlay';
  const panelClass = isModalClosing
    ? 'animate-modal-panel-out'
    : 'animate-modal-panel';

  const pricingPlans = packagesData?.packages || [];

  // ── Render

  return (
    <div className='flex flex-col gap-5'>
      {/* Page header */}
      <div>
        <h1 className='dashboard-page-title'>
          Powerful Settings Control for Complete Store Management
        </h1>
        <p className='dashboard-page-subtitle mt-1'>
          Customize categories, models, and pricing rules with full flexibility
          from your admin settings panel.
        </p>
      </div>

      {/* Sections */}
      <div className='flex flex-col gap-5'>
        {/* Category */}
        {isCategoriesLoading ? (
          <div className="flex justify-center items-center py-8 bg-white border border-gray-200 rounded-xl p-6">
            <span className="text-gray-500 font-medium">Loading categories...</span>
          </div>
        ) : (
          <CategorySection
            categories={categories}
            onAddClick={() => openModal('category')}
            onDeleteCategory={handleDeleteCategory}
          />
        )}

        {/* Topics */}
        {isTopicsLoading ? (
          <div className="flex justify-center items-center py-8 bg-white border border-gray-200 rounded-xl p-6">
            <span className="text-gray-500 font-medium">Loading topics...</span>
          </div>
        ) : (
          <TopicsSection
            topics={topics}
            onAddClick={() => openModal('topics')}
            onDeleteTopic={handleDeleteTopic}
          />
        )}

        {/* Blog Category */}
        <BlogCategorySection
          blogCategories={blogCategories}
          onAddClick={() => openModal('blogCategory')}
          onDeleteBlogCategory={handleDeleteBlogCategory}
        />

        {/* Pricing */}
        {isPackagesLoading ? (
          <div className="flex justify-center items-center py-8">
            <span className="text-gray-500 font-medium">Loading pricing packages...</span>
          </div>
        ) : (
          <PricingSection
            pricingPlans={pricingPlans}
            onAddClick={() => openModal('price')}
            onEditPlan={openEditPrice}
            onDeletePlan={handleDeletePlan}
          />
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <SettingsModal
          isPriceModal={isPriceModal}
          editingPlanId={editingPlanId}
          priceForm={priceForm}
          setPriceForm={setPriceForm}
          priceErrors={priceErrors}
          handleSavePrice={handleSavePrice}
          tagConfig={tagConfig}
          tagInput={tagInput}
          setTagInput={setTagInput}
          tagError={tagError}
          setTagError={setTagError}
          tagSaveHandler={tagSaveHandler}
          handleCloseModal={handleCloseModal}
          overlayClass={overlayClass}
          panelClass={panelClass}
          isModalClosing={isModalClosing}
        />
      )}
    </div>
  );
};

export default Settings;
