import React, { memo, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSEO } from '../../hooks/useSEO';
import { useCreateCheckoutMutation } from '../../features/api/paymentApi';
import toast from 'react-hot-toast';

const Checkout = memo(() => {
  const navigate = useNavigate();
  const location = useLocation();
  const { product, quantity } = location.state || {};

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'Switzerland',
  });

  useSEO({
    title: 'Checkout',
    description: 'Complete your purchase',
    keywords: ['checkout', 'purchase', 'order'],
  });

  const [createCheckout, { isLoading: isCheckingOut }] = useCreateCheckoutMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const subtotal = product ? parseFloat(product.price || 0) * quantity : 0;
  const deliveryFee = 15.0;
  const total = subtotal + deliveryFee;

  const handleConfirmPurchase = async () => {
    if (
      !formData.fullName ||
      !formData.email ||
      !formData.phone ||
      !formData.address ||
      !formData.city ||
      !formData.postalCode
    ) {
      toast.error('Please fill in all required fields.');
      return;
    }

    try {
      const payload = {
        type: 'WEBSHOP',
        cartItems: [
          {
            productId: product.id,
            quantity: quantity,
          },
        ],
        shippingAddress: {
          street: formData.address,
          city: formData.city,
          postalCode: formData.postalCode,
          country: formData.country,
        },
      };

      const result = await createCheckout(payload).unwrap();

      // Backend returns { url, sessionId } — redirect to Stripe checkout
      if (result?.url) {
        window.location.href = result.url;
      } else {
        toast.error('Could not initiate payment. Please try again.');
      }
    } catch (err) {
      toast.error(
        err?.data?.message || err?.message || 'Payment failed. Please try again.'
      );
    }
  };

  if (!product) {
    return (
      <div className='min-h-screen bg-[#FBFDFF] flex items-center justify-center'>
        <div className='text-center'>
          <h1 className='text-3xl font-bold mb-4'>No product selected</h1>
          <button
            onClick={() => navigate('/webshop')}
            className='bg-[#E2AB0B] text-white px-6 py-2 rounded-lg'
          >
            Back to Webshop
          </button>
        </div>
      </div>
    );
  }

  const productImage = product.gallery?.[0] || product.image || '';

  return (
    <div className='min-h-screen bg-[#FBFDFF] pt-8 md:pt-12 pb-14'>
      <div className='container mx-auto px-4 lg:px-6'>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-12'>
          {/* Left: Customer Information */}
          <div className='lg:col-span-2'>
            <h2 className='text-2xl md:text-3xl font-bold text-gray-800 mb-4'>
              Customer Information
            </h2>

            <div className='space-y-6'>
              {/* Full Name */}
              <div>
                <label className='block text-base font-semibold text-gray-700 mb-2'>
                  Full Name <span className='text-red-500'>*</span>
                </label>
                <input
                  type='text'
                  name='fullName'
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder='Enter your full name...'
                  className='w-full px-4 py-3 border border-[#00000033] bg-white rounded-lg focus:outline-none focus:border-[#E2AB0B]'
                />
              </div>

              {/* Email Address */}
              <div>
                <label className='block text-base font-semibold text-gray-700 mb-2'>
                  Email Address <span className='text-red-500'>*</span>
                </label>
                <input
                  type='email'
                  name='email'
                  value={formData.email}
                  onChange={handleChange}
                  placeholder='name@example.com'
                  className='w-full px-4 py-3 border border-[#00000033] bg-white rounded-lg focus:outline-none focus:border-[#E2AB0B]'
                />
              </div>

              {/* Phone Number */}
              <div>
                <label className='block text-base font-semibold text-gray-700 mb-2'>
                  Phone Number <span className='text-red-500'>*</span>
                </label>
                <input
                  type='tel'
                  name='phone'
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder='Enter your phone number...'
                  className='w-full px-4 py-3 border border-[#00000033] bg-white rounded-lg focus:outline-none focus:border-[#E2AB0B]'
                />
              </div>

              {/* Detailed Address */}
              <div>
                <label className='block text-base font-semibold text-gray-700 mb-2'>
                  Street Address <span className='text-red-500'>*</span>
                </label>
                <textarea
                  name='address'
                  value={formData.address}
                  onChange={handleChange}
                  placeholder='Street name, House no. Apartment...'
                  rows='3'
                  className='w-full px-4 py-3 border border-[#00000033] bg-white rounded-lg focus:outline-none focus:border-[#E2AB0B]'
                />
              </div>

              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                {/* City */}
                <div>
                  <label className='block text-base font-semibold text-gray-700 mb-2'>
                    City <span className='text-red-500'>*</span>
                  </label>
                  <input
                    type='text'
                    name='city'
                    value={formData.city}
                    onChange={handleChange}
                    placeholder='Zurich'
                    className='w-full px-4 py-3 border border-[#00000033] bg-white rounded-lg focus:outline-none focus:border-[#E2AB0B]'
                  />
                </div>

                {/* Postal Code */}
                <div>
                  <label className='block text-base font-semibold text-gray-700 mb-2'>
                    Postal Code <span className='text-red-500'>*</span>
                  </label>
                  <input
                    type='text'
                    name='postalCode'
                    value={formData.postalCode}
                    onChange={handleChange}
                    placeholder='8001'
                    className='w-full px-4 py-3 border border-[#00000033] bg-white rounded-lg focus:outline-none focus:border-[#E2AB0B]'
                  />
                </div>
              </div>

              {/* Country */}
              <div>
                <label className='block text-base font-semibold text-gray-700 mb-2'>
                  Country
                </label>
                <input
                  type='text'
                  name='country'
                  value={formData.country}
                  onChange={handleChange}
                  placeholder='Switzerland'
                  className='w-full px-4 py-3 border border-[#00000033] bg-white rounded-lg focus:outline-none focus:border-[#E2AB0B]'
                />
              </div>
            </div>
          </div>

          {/* Right: Order Summary */}
          <div className='lg:col-span-1'>
            <div className='bg-green-50 rounded-lg p-4 md:p-6 sticky top-34'>
              <h2 className='text-2xl font-bold text-gray-800 mb-4'>Order Summary</h2>

              {/* Product preview */}
              <div className='flex items-center gap-3 mb-4 pb-4 border-b border-green-400'>
                {productImage && (
                  <img
                    src={productImage}
                    alt={product.name}
                    className='w-16 h-16 rounded-lg object-cover border border-gray-200 shrink-0'
                  />
                )}
                <div className='flex-1 min-w-0'>
                  <p className='text-sm font-semibold text-gray-800 truncate'>{product.name}</p>
                  <p className='text-xs text-gray-500'>Qty: {quantity}</p>
                </div>
                <span className='text-sm font-bold text-gray-900'>
                  €{(parseFloat(product.price || 0) * quantity).toFixed(2)}
                </span>
              </div>

              <div className='space-y-4 mb-6 border-b border-green-400 pb-4'>
                {/* Subtotal */}
                <div className='flex justify-between items-center'>
                  <span className='text-gray-600'>Subtotal ({quantity} items)</span>
                  <span className='font-semibold text-gray-900'>€{subtotal.toFixed(2)}</span>
                </div>

                {/* Delivery Fee */}
                <div className='flex justify-between items-center'>
                  <span className='text-gray-600'>Delivery Fee</span>
                  <span className='font-semibold text-gray-900'>€{deliveryFee.toFixed(2)}</span>
                </div>
              </div>

              {/* Total */}
              <div className='flex justify-between items-center mb-6'>
                <span className='text-lg font-bold text-gray-800'>Total</span>
                <span className='text-2xl font-bold text-gray-900'>€{total.toFixed(2)}</span>
              </div>

              {/* Confirm Purchase → Stripe Redirect */}
              <button
                onClick={handleConfirmPurchase}
                disabled={isCheckingOut}
                className='w-full bg-green-500/60 text-white font-bold py-3 rounded-lg transition-colors text-lg hover:bg-[#c99809] disabled:opacity-50 disabled:cursor-not-allowed'
              >
                {isCheckingOut ? (
                  <span className='flex items-center justify-center gap-2'>
                    <svg className='animate-spin h-5 w-5' viewBox='0 0 24 24' fill='none'>
                      <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' />
                      <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8v8z' />
                    </svg>
                    Redirecting to Payment...
                  </span>
                ) : (
                  'Confirm & Pay'
                )}
              </button>

              <p className='text-sm text-gray-400 text-center mt-3'>
                You will be redirected to Stripe for secure payment.
              </p>
            </div>
          </div>
        </div>

        {/* Ads Placeholder */}
        <div className='w-full mt-24 bg-gray-50 rounded-2xl py-20 flex items-center justify-center border border-gray-200'>
          <span className='text-gray-400 font-bold text-2xl'>Ads</span>
        </div>
      </div>
    </div>
  );
});

Checkout.displayName = 'Checkout';

export default Checkout;
