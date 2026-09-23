'use client';

import React, { useEffect, useState } from 'react';
import { Product } from '@/shared/types/product';
import { DailyDeal } from '@/shared/types/dailydeal';

interface DailyDealCardProps {
  deal: DailyDeal;
  product: Product; 
  onOpenProduct: (product: Product) => void;
  onRequireRecipe: (product: Product) => void;
  onRequireAuth: () => void;

  cartItems?: Array<{ productId: number; quantity: number }>;
  attachedPrescriptions?: Record<number, number>;
  user?: any;
  onAddToCart?: (productId: number, quantity: number, prescriptionId?: number | null) => void;
  getProductImg?: (imageUrl?: string) => string | null;
  getIcon?: (varietyId: number) => string;
}

export const DailyDealCard: React.FC<DailyDealCardProps> = ({
  deal,
  product,
  onOpenProduct,
  onRequireRecipe,
  onRequireAuth,
  cartItems = [],
  attachedPrescriptions = {},
  user,
  onAddToCart,
  getProductImg,
  getIcon,
}) => {

  const [timeLeft, setTimeLeft] = useState<{ hours: string; minutes: string; seconds: string }>({
    hours: '00',
    minutes: '00',
    seconds: '00',
  });

  useEffect(() => {
    const updateTimer = () => {
      const now = Math.floor(Date.now() / 1000);
      const diff = deal.expiresAtUnix - now;

      if (diff <= 0) {
        setTimeLeft({ hours: '00', minutes: '00', seconds: '00' });
        return;
      }

      const h = Math.floor(diff / 3600);
      const m = Math.floor((diff % 3600) / 60);
      const s = diff % 60;

      setTimeLeft({
        hours: String(h).padStart(2, '0'),
        minutes: String(m).padStart(2, '0'),
        seconds: String(s).padStart(2, '0'),
      });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [deal.expiresAtUnix]);


  const p = product;
  const cartItem = cartItems.find((c) => c.productId === p.id);
  const inCart = !!cartItem;
  const qty = inCart ? cartItem.quantity : 0;
  
  const canAdd = !p.isRecipeRequired || Boolean(attachedPrescriptions[p.id]);

  const oldPrice = p.price;
  const newPrice = Math.round(p.price * 0.7);

  const imgSrc = getProductImg ? getProductImg(p.imageUrl) : p.imageUrl;
  const fallbackIconHtml = getIcon ? getIcon(p.varietyId) : '';

  const handleCardClick = () => {
    onOpenProduct(p);
  };

  const handleAddClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      onRequireAuth();
      return;
    }
    if (!canAdd) {
      onRequireRecipe(p);
      return;
    }
    const rxId = attachedPrescriptions[p.id] ?? null;
    onAddToCart?.(p.id, 1, rxId);
  };

  const btnCls = !canAdd ? 'needs-rx' : 'normal';

  return (
    <div className="flash-product-wrapper">
      <div
        className="fp-image fp-animate"
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
        onClick={handleCardClick}
      >
        {imgSrc ? (
          <img
            src={imgSrc}
            alt={p.name}
            style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '8px' }}
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = 'none';
            }}
          />
        ) : (
          <div style={{ color: 'var(--purple)' }} dangerouslySetInnerHTML={{ __html: fallbackIconHtml }} />
        )}
      </div>

      <div className="fp-info fp-animate" style={{ cursor: 'pointer' }} onClick={handleCardClick}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
          <div className="fp-label" style={{ margin: 0 }}>
            Пропозиція дня
          </div>
          <div style={{ background: '#e02020', color: 'white', borderRadius: '50px', padding: '3px 10px', fontSize: '11px', fontWeight: 700 }}>
            Знижка 30%
          </div>
        </div>

        <div className="fp-name">{p.name}</div>
        <div className="fp-vol">{p.description || ''}</div>

        <div className="fp-pricing">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text2)', position: 'relative', display: 'inline-block', whiteSpace: 'nowrap' }}>
              {oldPrice} грн
              <svg
                style={{ position: 'absolute', left: '-2px', top: 0, width: 'calc(100% + 4px)', height: '100%', pointerEvents: 'none' }}
                viewBox="0 0 100 24"
                preserveAspectRatio="none"
              >
                <line x1="0" y1="24" x2="100" y2="0" stroke="#e02020" strokeWidth="2.5" />
              </svg>
            </div>
            <div style={{ fontSize: '26px', fontWeight: 800, color: '#e02020', whiteSpace: 'nowrap' }}>
              {newPrice} грн
            </div>
          </div>

          <div className="prod-add-wrap" style={{ position: 'relative', display: 'inline-flex' }}>
            {inCart && (
              <span className="prod-cart-count" id="cc-daily">
                {qty}
              </span>
            )}
            <button
              className={`prod-add-btn ${btnCls}`}
              style={{
                width: '35px',
                height: '35px',
                border: 'none',
                ...(canAdd ? { background: 'var(--blue)' } : {}),
              }}
              id="ab-daily"
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
          </div>
        </div>
      </div>
    </div>
  );
};