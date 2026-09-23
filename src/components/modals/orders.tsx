'use client';

import React, { useState } from 'react';
import { Order } from '@/shared/types/order'; 
import { AdminOrder, ORDER_STATUS_LABELS, ORDER_STATUS_OPTIONS } from '@/lib/apiServices/ordersApi';
import { getPrescriptionFileUrl } from '@/lib/apiServices/prescriptionsApi';

interface OrdersModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
  isAdmin?: boolean;
  onUpdateStatus?: (orderId: number, status: string) => void;
  onFetchOrderDetails?: (orderId: number) => Promise<Order>; // Опциональный асинхронный фетч деталей
  isLoading?: boolean;
  error?: string | null;
}

export const OrdersModal: React.FC<OrdersModalProps> = ({
  isOpen,
  onClose,
  orders,
  isAdmin = false,
  onUpdateStatus,
  onFetchOrderDetails,
  isLoading = false,
  error = null,
}) => {
  const [activeRecipe, setActiveRecipe] = useState<{ title: string; url: string } | null>(null);
  const [expandedOrders, setExpandedOrders] = useState<Record<number, boolean>>({});
  const [orderDetailsMap, setOrderDetailsMap] = useState<Record<number, Order>>({});
  const [loadingDetailsMap, setLoadingDetailsMap] = useState<Record<number, boolean>>({});
  const [errorDetailsMap, setErrorDetailsMap] = useState<Record<number, string | null>>({});

  if (!isOpen) return null;

  const toggleOrderDetails = async (orderId: number) => {
    const isCurrentlyExpanded = !!expandedOrders[orderId];
    
    setExpandedOrders((prev) => ({ ...prev, [orderId]: !isCurrentlyExpanded }));

    if (!isCurrentlyExpanded && onFetchOrderDetails && !orderDetailsMap[orderId]) {
      setLoadingDetailsMap((prev) => ({ ...prev, [orderId]: true }));
      setErrorDetailsMap((prev) => ({ ...prev, [orderId]: null }));

      try {
        const fullOrder = await onFetchOrderDetails(orderId);
        setOrderDetailsMap((prev) => ({ ...prev, [orderId]: fullOrder }));
      } catch (err: any) {
        setErrorDetailsMap((prev) => ({
          ...prev,
          [orderId]: err?.message || 'Помилка завантаження деталей',
        }));
      } finally {
        setLoadingDetailsMap((prev) => ({ ...prev, [orderId]: false }));
      }
    }
  };

  return (
    <>
      <div className={`modal-overlay ${isOpen ? 'open' : ''}`} id={isAdmin ? 'adminPanelOverlay' : 'ordersModalOverlay'}>
        <div className={`modal ${isAdmin ? 'modal-xl' : 'modal-lg'}`}>
          <div className="modal-header">
            <h3>{isAdmin ? 'Адмін-панель' : 'Мої замовлення'}</h3>
            <button className="modal-close" type="button" onClick={onClose}>
              ✕
            </button>
          </div>

          <div className="modal-body" id={isAdmin ? 'adminOrdersList' : 'ordersList'}>
            {isLoading ? (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <div className="loader">Завантаження</div>
                <p style={{ color: 'var(--text3)', marginTop: '10px' }}>
                  {isAdmin ? 'Завантаження списку замовлень...' : 'Шукаємо ваші замовлення'}
                </p>
              </div>
            ) : error ? (
              <div style={{ textAlign: 'center', color: 'var(--red)', padding: '40px' }}>
                <p>Помилка завантаження: {error}</p>
              </div>
            ) : orders.length === 0 ? (
              isAdmin ? (
                <p style={{ textAlign: 'center', color: 'var(--text2)', padding: '20px 0' }}>
                  Замовлень поки немає
                </p>
              ) : (
                <div className="empty-orders" style={{ textAlign: 'center', padding: '50px 20px' }}>
                  <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'center' }}>
                    <svg
                      width="64"
                      height="64"
                      viewBox="0 0 64 64"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M4 16L32 4L60 16L32 28L4 16Z"
                        fill="#D2B48C"
                        stroke="#2C3E50"
                        strokeWidth="2.5"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M4 16V48L32 60L60 48V16L32 28L4 16Z"
                        fill="#D2B48C"
                        stroke="#2C3E50"
                        strokeWidth="2.5"
                        strokeLinejoin="round"
                      />
                      <line
                        x1="32"
                        y1="28"
                        x2="32"
                        y2="60"
                        stroke="#2C3E50"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                      />
                      <circle cx="32" cy="16" r="8" fill="white" stroke="#2C3E50" strokeWidth="2.5" />
                    </svg>
                  </div>
                  <h4 style={{ marginBottom: '10px', color: 'var(--text)' }}>
                    У вас ще немає замовлень
                  </h4>
                  <p
                    style={{
                      color: 'var(--text2)',
                      fontSize: '14px',
                      maxWidth: '300px',
                      margin: '0 auto',
                    }}
                  >
                    Ваша історія покупок порожня. Як тільки ви зробите перше замовлення, воно з'явиться тут.
                  </p>
                  <button
                    type="button"
                    onClick={onClose}
                    style={{
                      marginTop: '25px',
                      padding: '10px 20px',
                      background: 'var(--purple)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontWeight: 600,
                    }}
                  >
                    Перейти до покупок
                  </button>
                </div>
              )
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {orders.map((orderItem) => {
                  const adminOrder = isAdmin ? (orderItem as AdminOrder) : null;
                  const isExpanded = expandedOrders[orderItem.id];
                  
                  const currentOrderData = orderDetailsMap[orderItem.id] || orderItem;
                  const isLoadingDetails = loadingDetailsMap[orderItem.id];
                  const detailsError = errorDetailsMap[orderItem.id];

                  return (
                    <div className="order-card" key={orderItem.id} style={{ marginBottom: '10px' }}>
                      <div
                        className="order-header"
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
                        }}
                      >
                        <div>
                          <div className="order-id" style={{ fontWeight: 700, fontSize: '16px' }}>
                            Замовлення №{orderItem.id}
                          </div>
                          <div
                            className="order-date"
                            style={{
                              marginBottom: 0,
                              marginTop: '4px',
                              fontSize: '12px',
                              color: 'var(--text2)',
                            }}
                          >
                            {new Date(orderItem.createdAt).toLocaleDateString('uk-UA')}
                          </div>
                          {adminOrder?.user && (
                            <div style={{ fontSize: '12px', marginTop: '4px' }}>
                              👤 {adminOrder.user.name} ({adminOrder.user.phone})
                            </div>
                          )}
                        </div>

                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'flex-end',
                          }}
                        >
                          {isAdmin && onUpdateStatus ? (
                            <select
                              value={orderItem.status}
                              onChange={(e) => onUpdateStatus(orderItem.id, e.target.value)}
                              style={{
                                marginTop: '2px',
                                padding: '4px 8px',
                                borderRadius: '6px',
                                fontSize: '13px',
                              }}
                            >
                              {ORDER_STATUS_OPTIONS.map((statusValue) => (
                                <option key={statusValue} value={statusValue}>
                                  {ORDER_STATUS_LABELS[statusValue]}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <span className="status-badge">
                              {ORDER_STATUS_LABELS[orderItem.status] ?? orderItem.status}
                            </span>
                          )}

                          <button
                            type="button"
                            onClick={() => toggleOrderDetails(orderItem.id)}
                            style={{
                              color: 'var(--purple)',
                              cursor: 'pointer',
                              fontSize: '14px',
                              fontWeight: 500,
                              marginTop: '10px',
                              border: 'none',
                              borderBottom: '1px dashed var(--purple)',
                              lineHeight: 1.2,
                              background: 'transparent',
                              padding: 0,
                            }}
                          >
                            {isExpanded ? 'Сховати деталі' : 'Деталі замовлення'}
                          </button>
                        </div>
                      </div>

                      {isExpanded && (
                        <div
                          id={`details-${orderItem.id}`}
                          style={{
                            marginTop: '18px',
                            paddingTop: '15px',
                            borderTop: '1px solid var(--border)',
                          }}
                        >
                          {isLoadingDetails ? (
                            <div style={{ fontSize: '12px', textAlign: 'center', color: 'var(--text3)' }}>
                              Завантаження...
                            </div>
                          ) : detailsError ? (
                            <p style={{ color: 'var(--red)', fontSize: '12px' }}>
                              Помилка: {detailsError}
                            </p>
                          ) : (
                            <>
                              {!currentOrderData.items || currentOrderData.items.length === 0 ? (
                                <p style={{ fontSize: '12px', color: 'var(--text3)' }}>
                                  Інформація про товари відсутня
                                </p>
                              ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                  {currentOrderData.items.map((item) => (
                                    <div
                                      key={item.productId}
                                      style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        fontSize: '15px',
                                        color: 'var(--text2)',
                                      }}
                                    >
                                      <span>
                                        {item.productName} x{item.quantity}
                                        {item.prescriptionId != null && (
                                          <button
                                            type="button"
                                            onClick={() =>
                                              setActiveRecipe({
                                                title: `Рецепт для: ${item.productName}`,
                                                url: getPrescriptionFileUrl(item.prescriptionId!),
                                              })
                                            }
                                            style={{
                                              marginLeft: '8px',
                                              fontSize: '12px',
                                              color: 'var(--purple)',
                                              background: 'none',
                                              border: 'none',
                                              cursor: 'pointer',
                                              textDecoration: 'underline',
                                            }}
                                          >
                                            Переглянути рецепт
                                          </button>
                                        )}
                                      </span>
                                      <span>{Math.round(item.price * item.quantity)} грн</span>
                                    </div>
                                  ))}
                                </div>
                              )}

                              {currentOrderData.deliveryAddress && (
                                <div
                                  style={{
                                    marginTop: '15px',
                                    padding: '15px',
                                    background: 'var(--bg-soft)',
                                    borderRadius: '10px',
                                    textAlign: 'center',
                                  }}
                                >
                                  <div
                                    style={{
                                      fontSize: '12px',
                                      color: 'var(--text3)',
                                      textTransform: 'uppercase',
                                      letterSpacing: '1px',
                                      marginBottom: '4px',
                                      fontWeight: 700,
                                    }}
                                  >
                                    Адреса доставки
                                  </div>
                                  <div
                                    style={{
                                      fontSize: '15px',
                                      color: 'var(--text)',
                                      lineHeight: 1.4,
                                      fontWeight: 500,
                                    }}
                                  >
                                    {currentOrderData.deliveryAddress}
                                  </div>
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      )}

                      <div
                        className="order-footer"
                        style={{
                          marginTop: '15px',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <div style={{ fontSize: '15px', color: 'var(--text)', fontWeight: 600 }}>
                          Разом:
                        </div>
                        <div style={{ fontSize: '18px', color: 'var(--text)', fontWeight: 800 }}>
                          {Math.round(Number(orderItem.totalPrice || 0))} грн
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {activeRecipe && (
        <div
          className="modal-overlay open"
          id="adminRecipeViewOverlay"
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
              boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
            }}
          >
            <button
              className="modal-close"
              type="button"
              style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                border: 'none',
                fontSize: '20px',
                cursor: 'pointer',
              }}
              onClick={() => setActiveRecipe(null)}
            >
              ✕
            </button>
            <h3
              id="adminRecipeTitle"
              style={{
                marginTop: 0,
                marginBottom: '16px',
                fontSize: '16px',
                color: 'var(--text)',
              }}
            >
              {activeRecipe.title}
            </h3>
            <div
              style={{
                textAlign: 'center',
                background: 'var(--bg-soft)',
                padding: '10px',
                borderRadius: '8px',
              }}
            >
              <img
                id="adminRecipeImg"
                src={activeRecipe.url}
                alt="Фото рецепта"
                style={{
                  maxWidth: '100%',
                  maxHeight: '450px',
                  objectFit: 'contain',
                  borderRadius: '6px',
                }}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};