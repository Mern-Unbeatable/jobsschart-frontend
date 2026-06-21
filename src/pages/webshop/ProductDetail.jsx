import React, { memo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, CircleCheck, Minus, Plus } from "lucide-react";
import CommonAdsSection from "../../components/CommonAdsSection";
import { useGetProductByIdQuery } from "../../features/api/productApi";
import { useSelector } from "react-redux";
import { selectIsAuthenticated } from "../../features/slices/authSlice";
import Swal from "sweetalert2";

const ProductDetail = memo(() => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const { data, isLoading, isError } = useGetProductByIdQuery(id, {
    skip: !id,
  });

  // API response: { product: { ... } }
  const product = data?.product || data || null;

  /* ── Loading skeleton ── */
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white pt-8 md:pt-12 pb-14 animate-pulse">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <div className="rounded-2xl bg-gray-200 h-96 mb-4" />
              <div className="grid grid-cols-6 gap-2">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="aspect-square rounded-lg bg-gray-200"
                  />
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded w-2/3" />
              <div className="h-5 bg-gray-100 rounded w-1/2" />
              <div className="h-8 bg-gray-200 rounded w-1/4" />
              <div className="h-4 bg-gray-100 rounded w-full" />
              <div className="h-4 bg-gray-100 rounded w-5/6" />
              <div className="h-4 bg-gray-100 rounded w-4/6" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ── Error state ── */
  if (isError || !product) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-500 mb-4">Product not found.</p>
          <button
            onClick={() => navigate("/webshop")}
            className="text-green-500/60 font-medium hover:underline flex items-center gap-1 mx-auto"
          >
            <ArrowLeft size={16} /> Back to Webshop
          </button>
        </div>
      </div>
    );
  }

  const gallery = product.gallery?.length > 0 ? product.gallery : [];
  const mainImage = gallery[selectedImage] || gallery[0] || "";
  const price = parseFloat(product.price || 0);

  return (
    <div className="min-h-screen bg-white pt-8 md:pt-12 pb-14 mb:pb-20">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left: Image & Thumbnails */}
          <div>
            {mainImage ? (
              <>
                <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm mb-4">
                  <img
                    src={mainImage}
                    alt={product.name}
                    className="w-full h-120 object-cover"
                  />
                </div>
                {gallery.length > 1 && (
                  <div className="grid grid-cols-6 gap-2">
                    {gallery.map((img, idx) => (
                      <div
                        key={idx}
                        className={`aspect-square rounded-lg overflow-hidden border-2 cursor-pointer hover:border-[#D9A108] transition-all ${
                          selectedImage === idx
                            ? "border-[#D9A108]"
                            : "border-gray-200"
                        }`}
                        onClick={() => setSelectedImage(idx)}
                      >
                        <img
                          src={img}
                          alt="gallery"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="rounded-2xl bg-gray-100 h-96 flex items-center justify-center text-gray-400">
                No image available
              </div>
            )}
          </div>

          {/* Right: Product Info */}
          <div className="flex flex-col">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-1">
              {product.name}
            </h1>
            {product.subTitle && (
              <p className="text-lg text-gray-500 mb-4">{product.subTitle}</p>
            )}

            <div className="text-3xl font-bold text-green-500/60  mb-2">
              €{price.toFixed(2)}
            </div>

            {product.description && (
              <>
                <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                  Product Description
                </h3>
                <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                  {product.description}
                </p>
              </>
            )}

            {product.features?.length > 0 && (
              <>
                <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
                  Features
                </h3>
                <ul className="space-y-3 mb-10">
                  {product.features.map((feature, idx) => (
                    <li
                      key={idx}
                      className="flex items-center gap-3 text-lg text-gray-600"
                    >
                      <div className="text-green-500">
                        <CircleCheck size={18} strokeWidth={2} />
                      </div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </>
            )}

            {/* Quantity and Buy Button Row */}
            <div className="flex items-center gap-4 mt-auto">
              <div className="flex items-center border border-gray-300 rounded-md h-12">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3 text-gray-500 hover:text-black"
                >
                  <Minus size={16} />
                </button>
                <span className="px-4 font-bold text-gray-700">{quantity}</span>
                <button
                  onClick={() =>
                    setQuantity((q) => Math.min(product.stock || 99, q + 1))
                  }
                  className="px-3 text-gray-500 hover:text-black"
                >
                  <Plus size={16} />
                </button>
              </div>
              <button
                onClick={() => {
                  if (!isAuthenticated) {
                    Swal.fire({
                      title: "Login Required",
                      text: "You must log in to purchase this product.",
                      icon: "warning",
                      showCancelButton: true,
                      confirmButtonColor: "#3085d6",
                      cancelButtonColor: "#d33",
                      confirmButtonText: "Login",
                    }).then((result) => {
                      if (result.isConfirmed) {
                        navigate("/login");
                      }
                    });
                    return;
                  }
                  navigate("/checkout", { state: { product, quantity } });
                }}
                className="flex-1 bg-green-500/60 text-white font-bold h-12 rounded-md shadow-sm transition-all text-base "
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>

        {/* What's Inside & Benefits Horizontal Grid */}
        {(product.whatsInside?.length > 0 || product.benefits?.length > 0) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-20">
            {product.whatsInside?.length > 0 && (
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
                  What's Inside
                </h2>
                <div className="flex flex-wrap gap-2">
                  {product.whatsInside.map((item, idx) => (
                    <span
                      key={idx}
                      className="px-5 py-2.5 bg-[#F2F2F2] text-gray-600 rounded-lg text-base font-medium"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {product.benefits?.length > 0 && (
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
                  Benefits
                </h2>
                <div className="flex flex-wrap gap-2">
                  {product.benefits.map((benefit, idx) => (
                    <span
                      key={idx}
                      className="px-5 py-2.5 bg-[#F2F2F2] text-gray-600 rounded-lg text-base font-medium"
                    >
                      {benefit}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Ads Section */}
        <CommonAdsSection
          wrapperClassName="mt-24"
          containerClassName="px-0"
          boxClassName="w-full h-44 md:h-56 lg:h-72 bg-[#F1F5F9] rounded-xl border border-dashed border-gray-300 flex items-center justify-center group"
          title="Advertisement Area"
          titleClassName="text-black font-bold text-2xl tracking-widest uppercase"
          placement="WEBSHOP"
        />
      </div>
    </div>
  );
});

ProductDetail.displayName = "ProductDetail";

export default ProductDetail;
