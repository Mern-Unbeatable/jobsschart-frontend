import React, { useRef } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { gsap } from "gsap";

function ProductCard({ product, onView, onEdit, onDelete }) {
  const cardRef = useRef(null);
  const editRef = useRef(null);
  const deleteRef = useRef(null);

  const handleEditEnter = () =>
    gsap.to(editRef.current, { scale: 1.03, duration: 0.13 });
  const handleEditLeave = () =>
    gsap.to(editRef.current, { scale: 1, duration: 0.13 });
  const handleDeleteEnter = () =>
    gsap.to(deleteRef.current, { scale: 1.03, duration: 0.13 });
  const handleDeleteLeave = () =>
    gsap.to(deleteRef.current, { scale: 1, duration: 0.13 });

  const productPrice =
    typeof product.price === "string"
      ? parseFloat(product.price)
      : product.price || 0;
  const productImage = product.gallery?.[0] || product.image || "/logo1.webp";

  return (
    <div
      ref={cardRef}
      onClick={onView}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onView();
        }
      }}
      className="border border-green-500/60 rounded-2xl p-4 flex flex-col gap-6 bg-white cursor-pointer h-full"
    >
      {/* Product image */}
      <div className="w-full h-48 sm:h-56 lg:h-64 rounded-lg overflow-hidden shrink-0">
        <img
          src={productImage}
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Product details */}
      <div className="flex flex-col gap-4 flex-1">
        <div className="flex flex-col gap-3">
          <h3
            className="text-xl font-medium text-[#333] leading-tight"
            style={{ fontFamily: "'Crimson Pro', Georgia, serif" }}
          >
            {product.name}
          </h3>
          <p className="text-sm text-[#545454] leading-relaxed line-clamp-3">
            {product.description}
          </p>
        </div>

        {/* Price */}
        <p
          className="text-xl font-medium text-[#333] mt-auto"
          style={{ fontFamily: "'Crimson Pro', Georgia, serif" }}
        >
          {"\u20AC"}
          {productPrice.toFixed(2)}
        </p>

        {/* Action buttons */}
        <div className="flex gap-4">
          <button
            ref={editRef}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            onMouseEnter={handleEditEnter}
            onMouseLeave={handleEditLeave}
            className="flex-1 flex items-center justify-center gap-2.5 bg-green-500/60 text-white px-6 py-3 rounded text-base font-normal transition-colors cursor-pointer"
          >
            <Pencil size={18} />
            Edit
          </button>
          <button
            ref={deleteRef}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            onMouseEnter={handleDeleteEnter}
            onMouseLeave={handleDeleteLeave}
            className="flex-1 flex items-center justify-center gap-2.5 border border-[#6E35AE] text-[#6E35AE] px-6 py-3 rounded text-base font-normal transition-colors hover:bg-[#6E35AE]/5 cursor-pointer"
          >
            <Trash2 size={18} />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
