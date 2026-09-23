'use client';

import React from 'react';

export const Footer: React.FC = () => {
  return (
    <>
      <section className="promo-strip">
        <div className="container">
          <div className="promo-strip-inner">
            <div className="ps-item">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="1.8"
                width="28"
                height="28"
              >
                <rect x="1" y="3" width="15" height="13" rx="2" />
                <path d="M16 8h4l3 5v3h-7V8z" />
                <circle cx="5.5" cy="18.5" r="2.5" />
                <circle cx="18.5" cy="18.5" r="2.5" />
              </svg>
              <div>
                <div className="ps-title">Швидка доставка</div>
                <div className="ps-text">За 2 години або наступного дня</div>
              </div>
            </div>

            <div className="ps-divider"></div>

            <div className="ps-item">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="1.8"
                width="28"
                height="28"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <div>
                <div className="ps-title">Лише оригінали</div>
                <div className="ps-text">Усі препарати сертифіковані</div>
              </div>
            </div>

            <div className="ps-divider"></div>

            <div className="ps-item">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="1.8"
                width="28"
                height="28"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <div>
                <div className="ps-title">Безпечна оплата</div>
                <div className="ps-text">Картка, готівка, розстрочка</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="container">
          <div className="footer-simple">
            <a href="#" className="logo footer-logo">
              <svg className="logo-svg" viewBox="0 0 48 48" fill="none">
                <rect width="48" height="48" rx="12" fill="url(#lgGrad3)" />
                <line
                  x1="24"
                  y1="5"
                  x2="24"
                  y2="43"
                  stroke="white"
                  strokeWidth="2.8"
                  strokeLinecap="round"
                />
                <circle cx="24" cy="7" r="3" fill="white" />
                <path
                  d="M24 12 C18 14 14 18 14 22 C14 26 18 28 22 28 C26 28 30 30 30 34 C30 38 26 40 22 40"
                  stroke="white"
                  strokeWidth="2.2"
                  fill="none"
                  strokeLinecap="round"
                />
                <ellipse
                  cx="20"
                  cy="40.5"
                  rx="3"
                  ry="1.8"
                  fill="white"
                  transform="rotate(-20 20 40.5)"
                />
                <circle cx="19.2" cy="39.8" r="0.7" fill="#6c3fc5" />
                <defs>
                  <linearGradient id="lgGrad3" x1="0" y1="0" x2="48" y2="48">
                    <stop stopColor="#6c3fc5" />
                    <stop offset="1" stopColor="#4a90d9" />
                  </linearGradient>
                </defs>
              </svg>
              <span className="logo-text" style={{ color: 'rgba(255,255,255,0.8)' }}>
                Æsculapius
              </span>
            </a>
            <div className="footer-info">
              <span>© 2026 Æsculapius. Усі права захищені.</span>
              <span>Ліцензія МОЗ №77-12345</span>
              <span>0 800 123-45-67</span>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};