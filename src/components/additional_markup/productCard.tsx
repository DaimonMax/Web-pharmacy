'use client';

import React from 'react';
import { Product } from '@/shared/types/product';
import { useAuth } from '@/context/authContext';
import { useCart } from '@/context/cartContext';
import { useWishlist } from '@/context/wishlistContext';
import { usePrescriptions } from '@/context/prescriptionContext';
import { useCatalog } from '@/context/catalogContext';
import { getIcon, getProductImg } from '@/shared/utils/icons';

interface ProductCardProps {
  product: Product;
  onOpenProduct: (product: Product) => void;
  onRequireRecipe?: (product: Product) => void;
  onRequireAuth?: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onOpenProduct,
  onRequireRecipe,
  onRequireAuth,
}) => {
  const { user } = useAuth();
  const { items: cartItems, add: addToCart } = useCart();
  const { wishlistIds, toggle: toggleWishlist } = useWishlist();
  const { isAttached, getAttachedPrescriptionId } = usePrescriptions();
  const { dailyDeal } = useCatalog();

  const inWish = wishlistIds.includes(product.id);
  const attached = isAttached(product.id);
  const canAdd = !product.isRecipeRequired || attached;
  const isDailyDeal = dailyDeal?.product?.id === product.id;

  const oldPrice = product.price;
  const newPrice = Math.round(product.price * 0.7);
  const displayPrice = isDailyDeal ? newPrice : oldPrice;

  const cartItem = cartItems.find((c) => c.productId === product.id);
  const cartQty = cartItem?.quantity || 0;
  const inCart = cartQty > 0;

  const imgSrc = getProductImg(product.imageUrl);
  const fallbackIconHtml = getIcon(product.varietyId);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) return onRequireAuth?.();
    if (!canAdd) return onRequireRecipe?.(product);

    const prescriptionId = product.isRecipeRequired ? getAttachedPrescriptionId(product.id) ?? null : null;
    await addToCart(product.id, 1, prescriptionId);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) return onRequireAuth?.();
    toggleWishlist(product.id);
  };

  return (
    <div className="prod-card" onClick={() => onOpenProduct(product)}>
      <div className="prod-img-wrap">
        {imgSrc ? (
          <img
            src={imgSrc}
            className="prod-img-photo"
            alt={product.name}
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = 'none';
            }}
          />
        ) : (
          <div className="prod-img-svg-wrap" dangerouslySetInnerHTML={{ __html: fallbackIconHtml }} />
        )}

        {product.isRecipeRequired && <div className="prod-rx-badge">Рецепт</div>}

        <button
          className={`prod-wish-btn ${inWish ? 'wished' : ''}`}
          type="button"
          onClick={handleWishlistToggle}
        >
          <svg
            viewBox="0 0 24 24"
            fill={inWish ? '#e91e8c' : 'none'}
            stroke={inWish ? '#e91e8c' : 'currentColor'}
            strokeWidth="2"
            width="14"
            height="14"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>
      </div>

      <div className="prod-body">
        <div className="prod-name">{product.name}</div>
        <div className="prod-vol">{product.description || ''}</div>

        <div className="prod-pricing">
          <div className="prod-price-wrap">
            <div className="prod-price-now" style={isDailyDeal ? { color: '#e02020' } : undefined}>
              {displayPrice} грн
            </div>
          </div>

          <div className="prod-add-wrap">
            {inCart && <span className="prod-cart-count">{cartQty}</span>}
            <button
              className={`prod-add-btn ${!canAdd ? 'needs-rx' : 'normal'}`}
              type="button"
              onClick={handleAddToCart}
            >
              {!canAdd ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="14" height="14">
                  <rect x="3" y="11" width="18" height="11" rx="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="16" height="16">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};