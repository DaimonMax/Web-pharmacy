'use client';

import React, { useState } from 'react';
import { Order } from '@/shared/types/order';
import { ORDER_STATUS_OPTIONS } from '@/lib/apiServices/ordersApi';

interface AdminOrdersModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
  isLoading?: boolean;
  error?: string | null;
  onUpdateStatus: (orderId: number, status: string) => void;
  onUpdateAddress: (orderId: number, newAddress: string) => void;
  onDeleteItem: (orderId: number, productId: number) => void;
}

interface AddressParts {
  city: string;
  street: string;
  house: string;
}

function parseAddress(full: string): AddressParts {
  const parts = full.split(',').map((s) => s.trim());
  return { city: parts[0] ?? '', street: parts[1] ?? '', house: parts[2] ?? '' };
}

export const AdminOrdersModal: React.FC<AdminOrdersModalProps> = ({
  isOpen,
  onClose,
  orders,
  isLoading = false,
  error = null,
  onUpdateStatus,
  onUpdateAddress,
  onDeleteItem,
}) => {
  const [activeRecipe, setActiveRecipe] = useState<{ title: string; prescriptionId: number } | null>(null);
  const [addressParts, setAddressParts] = useState<Record<number, AddressParts>>({});

  if (!isOpen) return null;

  return (
    <>
      <div className={`modal-overlay ${isOpen ? 'open' : ''}`} id="adminPanelOverlay">
        <div className="modal modal-xl">
          <div className="modal-header">
            <h3>Адмін-панель</h3>
            <button className="modal-close" type="button" onClick={onClose}>
              ✕
            </button>
          </div>

          <div className="modal-body" id="adminOrdersList">
            {isLoading && orders.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text2)' }}>
                Завантаження замовлень...
              </div>
            ) : error ? (
              <div style={{ textAlign: 'center', color: 'var(--red)', padding: '40px', fontWeight: 600 }}>
                {error}
              </div>
            ) : orders.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text2)' }}>
                Замовлень у базі немає
              </div>
            ) : (
              orders.map((order) => {
                const parts = addressParts[order.id] ?? parseAddress(order.deliveryAddress ?? '');

                const updatePart = (field: keyof AddressParts, value: string) => {
                  setAddressParts((prev) => ({
                    ...prev,
                    [order.id]: { ...parts, [field]: value },
                  }));
                };

                const saveAddress = () => {
                  const current = addressParts[order.id] ?? parts;
                  const combined = [current.city, current.street, current.house]
                    .filter(Boolean)
                    .join(', ');
                  onUpdateAddress(order.id, combined);
                };

                return (
                  <div
                    key={order.id}
                    className="order-card"
                    style={{
                      marginBottom: '20px',
                      border: '1px solid var(--border)',
                      borderRadius: '12px',
                      padding: '16px',
                      background: 'var(--bg)',
                    }}
                  >
                    <div
                      className="order-header"
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        marginBottom: '12px',
                      }}
                    >
                      <div>
                        <div className="order-id" style={{ fontSize: '16px', fontWeight: 700 }}>
                          Замовлення №{order.id}
                        </div>
                        <div
                          style={{
                            fontSize: '12px',
                            color: 'var(--text2)',
                            marginTop: '4px',
                            fontWeight: 500,
                          }}
                        >
                          {new Date(order.createdAt).toLocaleDateString('uk-UA')} — Користувач ID: {order.userId}
                        </div>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                        <span className="status-badge">{order.status}</span>
                        <select
                          className="admin-status-select"
                          value={order.status}
                          onChange={(e) => onUpdateStatus(order.id, e.target.value)}
                          style={{
                            padding: '4px 8px',
                            borderRadius: '6px',
                            border: '1px solid var(--border)',
                            background: 'var(--bg)',
                            color: 'var(--text)',
                            fontSize: '13px',
                          }}
                        >
                          {ORDER_STATUS_OPTIONS.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="delivery-section" style={{ marginTop: 0, marginBottom: '12px' }}>
                      <div className="delivery-title">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="16" height="16">
                          <rect x="1" y="3" width="15" height="13" rx="2" />
                          <path d="M16 8h4l3 5v3h-7V8z" />
                          <circle cx="5.5" cy="18.5" r="2.5" />
                          <circle cx="18.5" cy="18.5" r="2.5" />
                        </svg>
                        Адреса доставки
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <div className="pf-group" style={{ flex: 1, marginBottom: 0 }}>
                          <label>Місто</label>
                          <input
                            type="text"
                            value={parts.city}
                            onChange={(e) => updatePart('city', e.target.value)}
                            onBlur={saveAddress}
                          />
                        </div>
                        <div className="pf-group" style={{ flex: 1, marginBottom: 0 }}>
                          <label>Вулиця</label>
                          <input
                            type="text"
                            value={parts.street}
                            onChange={(e) => updatePart('street', e.target.value)}
                            onBlur={saveAddress}
                          />
                        </div>
                        <div className="pf-group" style={{ flex: 1, marginBottom: 0 }}>
                          <label>Будинок / кв.</label>
                          <input
                            type="text"
                            value={parts.house}
                            onChange={(e) => updatePart('house', e.target.value)}
                            onBlur={saveAddress}
                          />
                        </div>
                      </div>
                    </div>

                    <div
                      style={{
                        background: 'var(--bg-soft)',
                        padding: '10px',
                        borderRadius: '10px',
                        fontSize: '13px',
                        marginBottom: '12px',
                      }}
                    >
                      {order.items?.map((item) => {
                        const hasRecipe =
                          item.prescriptionId !== null &&
                          item.prescriptionId !== undefined &&
                          item.prescriptionId !== 0;

                        return (
                          <div
                            key={item.productId}
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              marginBottom: '8px',
                              padding: '6px 10px',
                              borderRadius: '6px',
                              background: hasRecipe ? 'rgba(147, 51, 234, 0.06)' : 'transparent',
                              borderLeft: hasRecipe ? '3px solid #9333ea' : '3px solid transparent',
                            }}
                          >
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                              <span style={{ color: 'var(--text)', fontWeight: 500 }}>
                                {item.productName}{' '}
                                {hasRecipe && (
                                  <span style={{ color: '#9333ea', fontSize: '11px', fontWeight: 600 }}>
                                    (Рецептурний)
                                  </span>
                                )}
                              </span>
                              <span style={{ color: 'var(--text2)', fontSize: '12px' }}>
                                {Math.round(item.price)} грн × {item.quantity}
                              </span>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              {hasRecipe && (
                                <button
                                  type="button"
                                  className="btn-purple"
                                  style={{ padding: '4px 8px', fontSize: '11px', borderRadius: '6px' }}
                                  onClick={() =>
                                    setActiveRecipe({
                                      title: item.productName,
                                      prescriptionId: item.prescriptionId!,
                                    })
                                  }
                                >
                                  Рецепт
                                </button>
                              )}
                              <button
                                type="button"
                                title="Видалити товар"
                                onClick={() => onDeleteItem(order.id, item.productId)}
                                style={{
                                  background: 'none',
                                  border: 'none',
                                  color: 'var(--red)',
                                  cursor: 'pointer',
                                  fontSize: '14px',
                                  padding: '4px',
                                }}
                              >
                                ✕
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div
                      className="order-footer"
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        borderTop: '1px dashed var(--border)',
                        paddingTop: '10px',
                      }}
                    >
                      <div style={{ fontSize: '14px', color: 'var(--text2)', fontWeight: 600 }}>
                        Разом до сплати:
                      </div>
                      <div style={{ fontSize: '16px', color: 'var(--text)', fontWeight: 700 }}>
                        {Math.round(order.totalPrice)} грн
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {activeRecipe && (
        <div
          className="modal-overlay open"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(0,0,0,0.6)',
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            className="modal"
            style={{
              background: 'var(--bg)',
              padding: '20px',
              borderRadius: '12px',
              maxWidth: '500px',
              width: '90%',
              position: 'relative',
            }}
          >
            <button
              type="button"
              className="modal-close"
              style={{ position: 'absolute', top: '12px', right: '12px', border: 'none', fontSize: '20px' }}
              onClick={() => setActiveRecipe(null)}
            >
              ✕
            </button>
            <h3 style={{ marginTop: 0, marginBottom: '16px', fontSize: '16px', color: 'var(--text)' }}>
              Рецепт: {activeRecipe.title}
            </h3>
            <div style={{ textAlign: 'center', background: 'var(--bg-soft)', padding: '10px', borderRadius: '8px' }}>
              <img
                src={`/api/prescriptions/file/${activeRecipe.prescriptionId}`}
                alt="Рецепт"
                style={{ maxWidth: '100%', maxHeight: '450px', objectFit: 'contain' }}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};