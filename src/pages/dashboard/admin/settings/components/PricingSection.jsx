import React from 'react';
import PricingCard from './PricingCard';

const PricingSection = ({ pricingPlans, onAddClick, onEditPlan, onDeletePlan }) => (
  <section className='bg-white border border-gray-200 rounded-xl p-6'>
    <div className='flex items-center justify-between mb-4'>
      <h2 className='text-xl font-semibold text-gray-800'>Pricing</h2>
      <button
        type='button'
        onClick={onAddClick}
        className='px-4 py-2.5 bg-[#E2AB0B] hover:brightness-95 text-white text-base font-medium rounded-lg transition-colors'
      >
        Add Price
      </button>
    </div>
    <hr className='border-gray-100 mb-4' />
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
      {pricingPlans.map((plan) => (
        <PricingCard
          key={plan.id}
          plan={plan}
          onEdit={() => onEditPlan(plan)}
          onDelete={() => onDeletePlan(plan.id)}
        />
      ))}
    </div>
  </section>
);

export default PricingSection;
