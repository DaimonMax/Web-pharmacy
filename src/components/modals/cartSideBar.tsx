'use client';

import React from 'react';
import { useCart } from '@/context/cartContext';
import { useCatalog } from '@/context/catalogContext';
import { getIcon, getProductImg } from '@/shared/utils/icons'; 

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onCheckout: () => void;
}

export const CartSidebar: React.FC<CartSidebarProps> = ({ isOpen, onClose, onCheckout }) => {
  const { items, updateQuantity, remove } = useCart();
  const { dailyDeal } = useCatalog();

  const isEmpty = items.length === 0;
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleQtyChange = (cartItemId: number, currentQty: number, delta: number) => {
    updateQuantity(cartItemId, currentQty + delta);
  };

  return (
    <>
      <div className={`overlay ${isOpen ? 'open' : ''}`} id="overlay" onClick={onClose} />

      <aside className={`cart-sidebar ${isOpen ? 'open' : ''}`} id="cartSidebar">
        <div className="cs-header">
          <h3>Кошик</h3>
          <button className="cs-close" id="closeCart" type="button" onClick={onClose}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="cs-body">
          {isEmpty ? (
            <div className="cs-empty" id="csEmpty">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.2"
                width="46"
                height="46"
                style={{ opacity: 0.35, marginBottom: '12px' }}
              >
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              <p>Ваш кошик порожній</p>
              <span>Додайте товари з каталогу</span>
            </div>
          ) : (
            <div id="csItems">
              {items.map((item) => {
                const imgSrc = getProductImg(item.imageUrl);
                const isDailyDeal = dailyDeal?.product.id === item.productId;

                return (
                  <div key={item.id} className="ci">
                    <div className="ci-img" style={{ color: 'var(--purple)' }}>
                      {imgSrc ? (
                        <img
                          src={imgSrc}
                          style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '6px' }}
                          alt={item.productName}
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      ) : (
                        <div dangerouslySetInnerHTML={{ __html: getIcon(item.varietyId) }} />
                      )}
                    </div>
                    <div className="ci-info">
                      <div className="ci-name">{item.productName}</div>
                      <div
                        className="ci-price"
                        style={isDailyDeal ? { color: '#e02020', fontWeight: 800 } : undefined}
                      >
                        {(item.price * item.quantity).toLocaleString('uk-UA')} грн
                      </div>
                      <div className="ci-controls">
                        <button
                          className="ci-qty-btn"
                          type="button"
                          onClick={() => handleQtyChange(item.id, item.quantity, -1)}
                        >
                          −
                        </button>
                        <span className="ci-qty-val">{item.quantity}</span>
                        <button
                          className="ci-qty-btn"
                          type="button"
                          onClick={() => handleQtyChange(item.id, item.quantity, 1)}
                        >
                          +
                        </button>
                        <button className="ci-del" type="button" onClick={() => remove(item.id)}>
                          Видалити
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {!isEmpty && (
          <div className="cs-footer" id="csFooter">
            <div className="cs-subtotal">
              <span>Підсумок</span>
              <span id="csTotal">{total.toLocaleString('uk-UA')} грн</span>
            </div>
            <div className="cs-delivery">
              <span>Доставка</span>
              <span>Безкоштовно</span>
            </div>
            <div className="cs-divider" />
            <div className="cs-total-row">
              <strong>Разом</strong>
              <strong id="csTotalFinal">{total.toLocaleString('uk-UA')} грн</strong>
            </div>
            <button className="btn-purple cs-checkout" id="checkoutBtn" type="button" onClick={onCheckout}>
              Оформити замовлення →
            </button>
            <button className="btn-outline-purple cs-continue" id="continueShopping" type="button" onClick={onClose}>
              Продовжити покупки
            </button>
          </div>
        )}
      </aside>
    </>
  );
};