'use client';

import React, { useState, useEffect } from 'react';
import { Product } from '@/shared/types/product';
import { useAuth } from '@/context/authContext';
import { useCart } from '@/context/cartContext';
import { useWishlist } from '@/context/wishlistContext';
import { usePrescriptions } from '@/context/prescriptionContext';
import { useCatalog } from '@/context/catalogContext';
import { ProductCard } from '@/components/additional_markup/productCard';
import { DailyDealCard } from '@/components/additional_markup/dailydeal';
import { ActiveFiltersBar } from '@/components/additional_markup/activeFiltersbar';
import { getIcon, getProductImg } from '@/shared/utils/icons';

interface MainContentProps {
  currentView?: 'meds' | 'advice' | 'wishlist' | 'kids';
  onNavigateToCatalog?: () => void;
  onOpenProduct: (product: Product) => void;
  onRequireRecipe: (product: Product) => void;
  onRequireAuth: () => void;
}

export const MainContent: React.FC<MainContentProps> = ({
  currentView = 'meds',
  onNavigateToCatalog,
  onOpenProduct,
  onRequireRecipe,
  onRequireAuth,
}) => {
  const { visibleProducts, isLoading, hasMore, showMore, dailyDeal } = useCatalog();
  const { wishlistItems, isItemsLoading, refreshItems } = useWishlist();
  const { user } = useAuth();
  const { items: cartItems, add: addToCart } = useCart();
  const { attachedPrescriptions } = usePrescriptions();

  useEffect(() => {
    if (currentView === 'wishlist') {
      refreshItems();
    }
  }, [currentView]);

  const [timeLeft, setTimeLeft] = useState({ hours: '00', minutes: '00', seconds: '00' });

  useEffect(() => {
    if (!dailyDeal) return;

    const updateTimer = () => {
      const nowSeconds = Math.floor(Date.now() / 1000);
      const diff = dailyDeal.expiresAt - nowSeconds;

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
    const timerId = setInterval(updateTimer, 1000);
    return () => clearInterval(timerId);
  }, [dailyDeal?.expiresAt]);

  return (
    <main id="mainContent">
      {currentView === 'meds' && (
        <div id="viewMeds">
          <section className="products-section">
            <div className="container">
              <ActiveFiltersBar />

              <div className="products-row" id="productsRow">
                {visibleProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onOpenProduct={onOpenProduct}
                    onRequireRecipe={onRequireRecipe}
                    onRequireAuth={onRequireAuth}
                  />
                ))}
              </div>

              {!isLoading && visibleProducts.length === 0 && (
                <div className="no-products" id="noProducts">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    width="48"
                    height="48"
                    style={{ marginBottom: '12px', opacity: 0.4 }}
                  >
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.35-4.35" />
                  </svg>
                  <p>Товарів не знайдено</p>
                  <span>Спробуйте змінити фільтри</span>
                </div>
              )}

              {hasMore && (
                <div className="show-more-wrap">
                  <button className="btn-outline-purple" id="showMore" type="button" onClick={showMore}>
                    Показати більше
                  </button>
                </div>
              )}
            </div>
          </section>

          {dailyDeal && (
            <section className="flash-section" id="flashSection">
              <div className="container">
                <div className="flash-section-header">
                  <h2 className="section-title" style={{ marginBottom: 0 }}>
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      width="22"
                      height="22"
                      style={{ verticalAlign: 'middle', marginRight: '6px' }}
                    >
                      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                    </svg>
                    Товар дня
                  </h2>
                  <p className="flash-section-sub">
                    Спеціальна пропозиція, яка оновлюється кожні 24 години
                  </p>
                </div>
                <div className="flash-inner">
                  <div className="flash-left">
                    <div className="flash-label">
                      <div>
                        <div className="flash-title">Залишилось часу</div>
                        <div className="flash-sub">До оновлення пропозиції</div>
                      </div>
                    </div>
                    <div className="flash-timer">
                      <div className="timer-block">
                        <span className="timer-num" id="timerH">
                          {timeLeft.hours}
                        </span>
                        <span className="timer-lbl">год</span>
                      </div>
                      <div className="timer-sep">:</div>
                      <div className="timer-block">
                        <span className="timer-num" id="timerM">
                          {timeLeft.minutes}
                        </span>
                        <span className="timer-lbl">хв</span>
                      </div>
                      <div className="timer-sep">:</div>
                      <div className="timer-block">
                        <span className="timer-num" id="timerS">
                          {timeLeft.seconds}
                        </span>
                        <span className="timer-lbl">сек</span>
                      </div>
                    </div>
                  </div>
                  <div className="flash-product" id="flashProduct">
                    <DailyDealCard
                      deal={{ id: 0, productId: dailyDeal.product.id, expiresAtUnix: dailyDeal.expiresAt }}
                      product={dailyDeal.product}
                      onOpenProduct={onOpenProduct}
                      onRequireRecipe={onRequireRecipe}
                      onRequireAuth={onRequireAuth}
                      cartItems={cartItems}
                      attachedPrescriptions={attachedPrescriptions}
                      user={user}
                      onAddToCart={addToCart}
                      getProductImg={getProductImg}
                      getIcon={getIcon}
                    />
                  </div>
                </div>
              </div>
            </section>
          )}
        </div>
      )}

      {currentView === 'advice' && (
        <div id="viewAdvice">
          <section className="advice-section">
            <div className="container">
              <div className="advice-inner">
                <div className="advice-text-col">
                  <div className="advice-tag">Поради для здоров&apos;я</div>
                  <h2 className="advice-title">Як залишатися здоровим щодня</h2>
                  <div className="advice-list">
                    <div className="advice-item">
                      <div className="adv-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="22" height="22">
                          <path d="M12 2 C12 2 5 10 5 15 a7 7 0 0 0 14 0 C19 10 12 2 12 2z" />
                        </svg>
                      </div>
                      <div>
                        <strong>Пийте достатньо води</strong>
                        <p>Щонайменше 8 склянок на день підтримують обмін речовин, шкіру та роботу нирок.</p>
                      </div>
                    </div>
                    <div className="advice-item">
                      <div className="adv-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="22" height="22">
                          <path d="M12 2a10 10 0 1 0 10 10" />
                          <path d="M12 6v6l4 2" />
                        </svg>
                      </div>
                      <div>
                        <strong>Збалансоване харчування</strong>
                        <p>Додавайте до раціону овочі, фрукти та білки. Уникайте надмірного споживання цукру.</p>
                      </div>
                    </div>
                    <div className="advice-item">
                      <div className="adv-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="22" height="22">
                          <circle cx="12" cy="5" r="2" />
                          <path d="M12 7 L12 14 M9 10 L12 12 L15 10 M10 21 L12 14 L14 21" />
                        </svg>
                      </div>
                      <div>
                        <strong>Рухайтеся щодня</strong>
                        <p>30 хвилин ходьби або легкого фізнавантаження значно покращують роботу серця.</p>
                      </div>
                    </div>
                    <div className="advice-item">
                      <div className="adv-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="22" height="22">
                          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                          <polyline points="9 22 9 12 15 12 15 22" />
                        </svg>
                      </div>
                      <div>
                        <strong>Повноцінний сон</strong>
                        <p>7–9 годин сну відновлюють організм, зміцнюють імунітет і покращують концентрацію.</p>
                      </div>
                    </div>
                    <div className="advice-item">
                      <div className="adv-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="22" height="22">
                          <circle cx="12" cy="12" r="9" />
                          <line x1="12" y1="8" x2="12" y2="12" />
                          <line x1="12" y1="16" x2="12.01" y2="16" />
                        </svg>
                      </div>
                      <div>
                        <strong>Приймайте вітаміни</strong>
                        <p>Особливо D3, Омега-3 та Магній у зимовий та осінній сезон для підтримки імунітету.</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="advice-visual-col">
                  <div className="advice-photos-grid">
                    <div className="advice-photo-item">
                      <img src="/images/for site/Food.jpg" alt="Харчування" />
                      <span>Харчування</span>
                    </div>
                    <div className="advice-photo-item">
                      <img src="/images/for site/Gogo.jpg" alt="Активність" />
                      <span>Активність</span>
                    </div>
                    <div className="advice-photo-item">
                      <img src="/images/for site/Son.jpg" alt="Сон" />
                      <span>Сон</span>
                    </div>
                    <div className="advice-photo-item">
                      <img src="/images/for site/Water.jpg" alt="Вода" />
                      <span>Гідратація</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      )}

      {currentView === 'wishlist' && (
        <div id="viewWishlist">
          <section className="products-section">
            <div className="container">
              <h2 className="section-title">Обране</h2>
              {isItemsLoading ? (
                <p style={{ textAlign: 'center', color: 'var(--text2)', padding: '20px 0' }}>Завантаження...</p>
              ) : wishlistItems.length === 0 ? (
                <div className="wish-empty" id="wishEmpty">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.2"
                    width="64"
                    height="64"
                    style={{ opacity: 0.3, marginBottom: '16px' }}
                  >
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                  <p>Ви ще нічого не додали до обраного</p>
                  <button className="btn-purple" style={{ marginTop: '16px' }} type="button" onClick={onNavigateToCatalog}>
                    Перейти до каталогу
                  </button>
                </div>
              ) : (
                <div className="products-row" id="wishlistRow">
                  {wishlistItems.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onOpenProduct={onOpenProduct}
                      onRequireRecipe={onRequireRecipe}
                      onRequireAuth={onRequireAuth}
                    />
                  ))}
                </div>
              )}
            </div>
          </section>
        </div>
      )}

      {currentView === 'kids' && (
        <div id="viewKids">
          <section className="products-section">
            <div className="container">
              <h2 className="section-title">Дитячі товари</h2>
              <div className="kids-banner">
                <div className="kids-banner-text">
                  <div className="kids-banner-tag">Безпечно для дітей</div>
                  <h3>Все найкраще для здоров&apos;я вашої дитини</h3>
                  <p>Перевірені препарати та товари для дітей від 0 до 14 років</p>
                </div>
                <svg viewBox="0 0 80 80" fill="none" width="80" height="80" style={{ opacity: 0.6 }}>
                  <circle cx="40" cy="25" r="14" stroke="var(--purple)" strokeWidth="2.5" />
                  <path
                    d="M16 70 C16 52 64 52 64 70"
                    stroke="var(--purple)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                  <path
                    d="M30 28 C30 32 33 35 40 35 C47 35 50 32 50 28"
                    stroke="var(--purple)"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <div className="products-row" id="kidsRow">
                {visibleProducts
                  .filter((p) => p.isForChildren)
                  .map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onOpenProduct={onOpenProduct}
                      onRequireRecipe={onRequireRecipe}
                      onRequireAuth={onRequireAuth}
                    />
                  ))}
              </div>
            </div>
          </section>
        </div>
      )}
    </main>
  );
};