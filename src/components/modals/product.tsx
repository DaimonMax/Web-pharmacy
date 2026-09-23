'use client';

import React from 'react';
import { Product } from '@/shared/types/product';
import { useAuth } from '@/context/authContext';
import { useCart } from '@/context/cartContext';
import { useWishlist } from '@/context/wishlistContext';
import { usePrescriptions } from '@/context/prescriptionContext';
import { useCatalog } from '@/context/catalogContext';
import { getIcon, getProductImg } from '@/shared/utils/icons';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product | null;
  onRequireRecipe?: (product: Product) => void;
  onRequireAuth?: () => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  isOpen,
  onClose,
  product = null,
  onRequireRecipe,
  onRequireAuth,
}) => {
  const { user } = useAuth();
  const { items: cartItems, add: addToCart, updateQuantity, remove: removeFromCart } = useCart();
  const { wishlistIds, toggle: toggleWishlist } = useWishlist();
  const { isAttached, getAttachedPrescriptionId } = usePrescriptions();
  const { dailyDeal } = useCatalog();

  if (!isOpen || !product) return null;

  const inWish = wishlistIds.includes(product.id);
  const attached = isAttached(product.id);
  const canAdd = !product.isRecipeRequired || attached;
  const isDailyDeal = dailyDeal?.product?.id === product.id;

  const oldPrice = product.price;
  const newPrice = Math.round(product.price * 0.7);
  const activePrice = isDailyDeal ? newPrice : oldPrice;

  const cartItem = cartItems.find((c) => c.productId === product.id);
  const cartQty = cartItem?.quantity || 0;

  const imgSrc = getProductImg(product.imageUrl);
  const fallbackIconHtml = getIcon(product.varietyId);

  const handleWishClick = () => {
    if (!user) {
      onClose();
      onRequireAuth?.();
      return;
    }
    toggleWishlist(product.id);
  };

  const handleAddClick = async () => {
    if (!user) {
      onClose();
      onRequireAuth?.();
      return;
    }
    if (!canAdd) {
      onClose();
      onRequireRecipe?.(product);
      return;
    }
    const prescriptionId = product.isRecipeRequired ? getAttachedPrescriptionId(product.id) ?? null : null;
    
    await addToCart(product.id, 1, prescriptionId);
  };

  const handleDecreaseQty = async () => {
    if (!cartItem) return;
    if (cartQty > 1) {
      await updateQuantity(cartItem.id, cartQty - 1);
    } else {
      await removeFromCart(cartItem.id);
    }
  };

  const handleIncreaseQty = async () => {
    if (!cartItem) return;
    await updateQuantity(cartItem.id, cartQty + 1);
  };

  return (
    <div className={`modal-overlay ${isOpen ? 'open' : ''}`} id="productModalOverlay">
      <div className="modal product-modal" style={{ maxWidth: '560px' }}>
        <div className="modal-header">
          <h3>Про товар</h3>
          <button className="modal-close" id="closeProductModal" type="button" onClick={onClose}>
            ✕
          </button>
        </div>
        <div className="modal-body">
          <div className="pm-body">
            <div className="pm-icon-wrap" id="pmIcon" style={{ color: 'var(--purple)' }}>
              {imgSrc ? (
                <img
                  src={imgSrc}
                  alt={product.name}
                  className="pm-img-photo"
                  style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display = 'none';
                  }}
                />
              ) : (
                <div dangerouslySetInnerHTML={{ __html: fallbackIconHtml }} />
              )}
            </div>

            <div className="pm-info">
              <div className="pm-name" id="pmName">
                {product.name}
              </div>
              <div className="pm-desc" id="pmDesc">
                {product.description || ''}
              </div>

              <div className="pm-meta-row">
                <div className="pm-meta-item">
                  <svg
                    viewBox="0 0 24 24"
                    fill={inWish ? '#e91e8c' : 'none'}
                    stroke={inWish ? '#e91e8c' : 'currentColor'}
                    strokeWidth="1.8"
                    width="13"
                    height="13"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <line x1="2" y1="12" x2="22" y2="12" />
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                  </svg>
                  <span className="pm-meta-label">Виробник:</span>
                  <span id="pmCountry">{product.manufacturer || 'Не вказано'}</span>
                </div>
              </div>

              <div className="pm-composition-wrap">
                <div className="pm-meta-label">Склад:</div>
                <div className="pm-composition" id="pmComposition">
                  {product.composition || '—'}
                </div>
              </div>

              {product.isRecipeRequired && (
                <div className="pm-rx" id="pmRx" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="13" height="13">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                  <span>Потрібен рецепт</span>
                  {attached && (
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="var(--green-ok)"
                      strokeWidth="2.5"
                      width="13"
                      height="13"
                      style={{ marginLeft: '5px' }}
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </div>
              )}

              <div className="pm-footer">
                <div className="pm-price" id="pmPrice">
                  {isDailyDeal ? (
                    <>
                      <span style={{ color: '#e02020', fontWeight: 800 }}>{newPrice} грн</span>
                      <small
                        style={{
                          textDecoration: 'line-through',
                          color: 'var(--text3)',
                          fontWeight: 400,
                          fontSize: '14px',
                          marginLeft: '8px',
                        }}
                      >
                        {oldPrice} грн
                      </small>
                    </>
                  ) : (
                    `${activePrice} грн`
                  )}
                </div>

                <div className="pm-actions">
                  <button
                    className='pm-wish-btn'
                    id="pmWishBtn"
                    type="button"
                    onClick={handleWishClick}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill={inWish ? '#e91e8c' : 'none'}
                      stroke={inWish ? '#e91e8c' : 'currentColor'}
                      strokeWidth="2"
                      width="18"
                      height="18"
                    >
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                  </button>

                  <div className="pm-add-wrap">
                    {cartQty > 0 ? (
                      <div className="stepper">
                        <button
                          className="btn-purple"
                          type="button"
                          style={{ padding: '6px 12px' }}
                          onClick={handleDecreaseQty}
                        >
                          -
                        </button>
                        <span style={{ fontWeight: 600, minWidth: '20px', textAlign: 'center' }}>{cartQty}</span>
                        <button
                          className="btn-purple"
                          type="button"
                          style={{ padding: '6px 12px' }}
                          onClick={handleIncreaseQty}
                        >
                          +
                        </button>
                      </div>
                    ) : (
                      <button
                        className={`btn-purple pm-add-btn ${!canAdd ? 'pm-needs-rx' : ''}`}
                        id="pmAddBtn"
                        type="button"
                        onClick={handleAddClick}
                      >
                        {!canAdd ? (
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="14" height="14">
                            <rect x="3" y="11" width="18" height="11" rx="2" />
                            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                          </svg>
                        ) : (
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="18" height="18">
                            <line x1="12" y1="5" x2="12" y2="19" />
                            <line x1="5" y1="12" x2="19" y2="12" />
                          </svg>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};