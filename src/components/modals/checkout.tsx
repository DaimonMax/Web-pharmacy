'use client';

import React, { useState } from 'react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalAmount: number;
  onOrderComplete?: (deliveryData: { city: string; street: string; house: string }) => Promise<void> | void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  totalAmount,
  onOrderComplete,
}) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [city, setCity] = useState('');
  const [street, setStreet] = useState('');
  const [house, setHouse] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handlePay = async () => {
    if (!city.trim() || !street.trim() || !house.trim()) {
      setError('Будь ласка, заповніть усі поля доставки');
      return;
    }

    setError('');
    setIsSubmitting(true);
    try {
      await onOrderComplete?.({ city, street, house });
      setStep(2);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Помилка при оформленні замовлення');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseAll = () => {
    setStep(1);
    setCity('');
    setStreet('');
    setHouse('');
    setError('');
    onClose();
  };

  return (
    <div className={`modal-overlay ${isOpen ? 'open' : ''}`} id="checkoutOverlay">
      <div className="modal" style={{ maxWidth: '520px' }}>
        <div className="modal-header">
          <h3>Оформлення замовлення</h3>
          <button className="modal-close" id="closeCheckout" type="button" onClick={handleCloseAll}>
            ✕
          </button>
        </div>
        <div className="modal-body">
          {step === 1 && (
            <div id="checkoutStep1">
              <div className="delivery-section" style={{ marginTop: 0 }}>
                <div className="delivery-title">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="16" height="16">
                    <rect x="1" y="3" width="15" height="13" rx="2" />
                    <path d="M16 8h4l3 5v3h-7V8z" />
                    <circle cx="5.5" cy="18.5" r="2.5" />
                    <circle cx="18.5" cy="18.5" r="2.5" />
                  </svg>
                  Адреса доставки
                </div>
                <div className="pf-group">
                  <label>Місто</label>
                  <input
                    type="text"
                    id="deliveryCity"
                    placeholder="Київ"
                    autoComplete="off"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                </div>
                <div className="pf-group">
                  <label>Вулиця</label>
                  <input
                    type="text"
                    id="deliveryStreet"
                    placeholder="вул. Хрещатик"
                    autoComplete="off"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                  />
                </div>
                <div className="pf-group">
                  <label>Будинок / кв.</label>
                  <input
                    type="text"
                    id="deliveryHouse"
                    placeholder="12 / 34"
                    autoComplete="off"
                    value={house}
                    onChange={(e) => setHouse(e.target.value)}
                  />
                </div>
              </div>

              {error && (
                <div className="pay-error" id="payError" style={{ color: '#dc2626', marginTop: '10px' }}>
                  {error}
                </div>
              )}

              <button
                className="btn-purple"
                style={{ width: '100%', padding: '14px', fontSize: '16px', marginTop: '16px' }}
                id="payBtn"
                type="button"
                onClick={handlePay}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Оформлення...' : (
                  <>Оформити замовлення на <span id="payAmount">{totalAmount} грн</span></>
                )}
              </button>
            </div>
          )}

          {step === 2 && (
            <div id="checkoutStep2">
              <div className="pay-success" style={{ textAlign: 'center', padding: '20px 0' }}>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#16a34a"
                  strokeWidth="2"
                  width="54"
                  height="54"
                  style={{ marginBottom: '14px' }}
                >
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="9 12 11 14 15 10" />
                </svg>
                <h3>Дякуємо що обрали нас</h3>
                <p>Ваше замовлення прийнято та буде доставлено найближчим часом</p>
                <button
                  className="btn-purple"
                  style={{ marginTop: '24px', padding: '12px 32px' }}
                  id="payDoneBtn"
                  type="button"
                  onClick={handleCloseAll}
                >
                  Закрити
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};