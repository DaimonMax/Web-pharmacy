'use client';

import React, { useState, useEffect } from 'react';
import { UserProfile } from '@/shared/types/user';

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  user?: UserProfile | null;
  onLogin?: (credentials: { email: string; pass: string }) => Promise<void> | void;
  onRegister?: (data: { name: string; phone: string; email: string; pass: string }) => Promise<void> | void;
  onLogout?: () => void;
}

export const AccountModal: React.FC<AccountModalProps> = ({
  isOpen,
  onClose,
  user = null,
  onLogin,
  onRegister,
  onLogout,
}) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [showLoginPass, setShowLoginPass] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPass, setRegPass] = useState('');
  const [showRegPass, setShowRegPass] = useState(false);
  const [regError, setRegError] = useState('');
  const [regLoading, setRegLoading] = useState(false);

  useEffect(() => {
    if (isOpen && !user) {
      setLoginEmail('');
      setLoginPass('');
      setLoginError('');
      setRegName('');
      setRegPhone('');
      setRegEmail('');
      setRegPass('');
      setRegError('');
      setActiveTab('login');
    }
  }, [isOpen, user]);

  if (!isOpen) return null;

  const handleLoginSubmit = async () => {
    setLoginError('');
    if (!loginEmail || !loginPass) {
      setLoginError('Заповніть усі поля');
      return;
    }
    setLoginLoading(true);
    try {
      await onLogin?.({ email: loginEmail, pass: loginPass });
    } catch (err: any) {
      setLoginError(err.message || 'Помилка входу');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleRegisterSubmit = async () => {
    setRegError('');
    if (!regName || !regPhone || !regEmail || !regPass) {
      setRegError('Заповніть усі поля');
      return;
    }
    if (regPass.length < 8) {
      setRegError('Пароль має бути не менше 8 символів');
      return;
    }
    setRegLoading(true);
    try {
      await onRegister?.({ name: regName, phone: `+380${regPhone}`, email: regEmail, pass: regPass });
    } catch (err: any) {
      setRegError(err.message || 'Помилка реєстрації');
    } finally {
      setRegLoading(false);
    }
  };

  const avatarInitial = user?.name ? user.name.charAt(0).toUpperCase() : '?';

  return (
    <div className={`modal-overlay ${isOpen ? 'open' : ''}`} id="accountOverlay">
      <div className="modal">
        <div className="modal-header">
          <h3>Акаунт</h3>
          <button className="modal-close" id="closeAccount" type="button" onClick={onClose}>
            ✕
          </button>
        </div>
        <div className="modal-body">
          {!user ? (
            <div id="accountLoggedOut">
              <div className="acc-tabs">
                <button
                  className={`acc-tab ${activeTab === 'login' ? 'active' : ''}`}
                  id="tabLogin"
                  type="button"
                  onClick={() => setActiveTab('login')}
                >
                  Увійти
                </button>
                <button
                  className={`acc-tab ${activeTab === 'register' ? 'active' : ''}`}
                  id="tabRegister"
                  type="button"
                  onClick={() => setActiveTab('register')}
                >
                  Реєстрація
                </button>
              </div>

              {activeTab === 'login' && (
                <div id="loginForm">
                  <div className="pf-group">
                    <label>E-mail</label>
                    <input
                      type="email"
                      id="loginEmail"
                      placeholder="your@email.com"
                      autoComplete="off"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                    />
                  </div>
                  <div className="pf-group">
                    <label>Пароль</label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type={showLoginPass ? 'text' : 'password'}
                        id="loginPass"
                        placeholder="••••••••"
                        autoComplete="off"
                        style={{ width: '100%', paddingRight: '38px' }}
                        value={loginPass}
                        onChange={(e) => setLoginPass(e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={() => setShowLoginPass(!showLoginPass)}
                        style={{
                          position: 'absolute',
                          right: '10px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          color: 'var(--text3)',
                          display: 'flex',
                          alignItems: 'center',
                        }}
                      >
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          width="18"
                          height="18"
                        >
                          {showLoginPass ? (
                            <>
                              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                              <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                              <line x1="1" y1="1" x2="23" y2="23" />
                            </>
                          ) : (
                            <>
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                              <circle cx="12" cy="12" r="3" />
                            </>
                          )}
                        </svg>
                      </button>
                    </div>
                  </div>
                  {loginError && <div className="pay-error" id="loginError">{loginError}</div>}
                  {loginLoading && <div className="api-loading" id="loginLoading">Вхід...</div>}
                  <button
                    className="btn-purple"
                    style={{ width: '100%', padding: '13px', marginTop: '8px' }}
                    id="loginBtn"
                    type="button"
                    onClick={handleLoginSubmit}
                  >
                    Увійти
                  </button>
                </div>
              )}

              {activeTab === 'register' && (
                <div id="registerForm">
                  <div className="pf-row">
                    <div className="pf-group">
                      <label>Ім&apos;я</label>
                      <input
                        type="text"
                        id="regName"
                        placeholder="Іван Петренко"
                        autoComplete="off"
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                      />
                    </div>
                    <div className="pf-group">
                      <label>Телефон</label>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span
                          style={{
                            padding: '10px 12px',
                            background: 'var(--bg-soft)',
                            border: '2px solid var(--border)',
                            borderRight: 'none',
                            borderRadius: '9px 0 0 9px',
                            fontSize: '14px',
                            color: 'var(--text2)',
                          }}
                        >
                          +380
                        </span>
                        <input
                          type="text"
                          id="regPhone"
                          placeholder="ХХХ-ХХХ-ХХХ"
                          maxLength={9}
                          autoComplete="off"
                          style={{ borderRadius: '0 9px 9px 0', width: '145px' }}
                          value={regPhone}
                          onChange={(e) => setRegPhone(e.target.value.replace(/\D/g, '').slice(0, 9))}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="pf-group">
                    <label>E-mail</label>
                    <input
                      type="email"
                      id="regEmail"
                      placeholder="your@email.com"
                      autoComplete="off"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                    />
                  </div>
                  <div className="pf-group">
                    <label>Пароль</label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type={showRegPass ? 'text' : 'password'}
                        id="regPass"
                        placeholder="Мінімум 8 символів"
                        autoComplete="off"
                        style={{ width: '100%', paddingRight: '38px' }}
                        value={regPass}
                        onChange={(e) => setRegPass(e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={() => setShowRegPass(!showRegPass)}
                        style={{
                          position: 'absolute',
                          right: '10px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          color: 'var(--text3)',
                          display: 'flex',
                          alignItems: 'center',
                        }}
                      >
                        <svg
                          id="regPassEyeIcon"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          width="18"
                          height="18"
                        >
                          {showRegPass ? (
                            <>
                              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                              <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                              <line x1="1" y1="1" x2="23" y2="23" />
                            </>
                          ) : (
                            <>
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                              <circle cx="12" cy="12" r="3" />
                            </>
                          )}
                        </svg>
                      </button>
                    </div>
                  </div>
                  {regError && <div className="pay-error" id="regError">{regError}</div>}
                  {regLoading && <div className="api-loading" id="regLoading">Реєстрація...</div>}
                  <button
                    className="btn-purple"
                    style={{ width: '100%', padding: '13px', marginTop: '8px' }}
                    id="registerBtn"
                    type="button"
                    onClick={handleRegisterSubmit}
                  >
                    Зареєструватися
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div id="accountLoggedIn">
              <div className="acc-profile">
                <div className="acc-avatar" id="accAvatar">
                  {avatarInitial}
                </div>
                <div className="acc-name" id="accName">
                  {user.name}
                  {user.isAdmin && (
                    <span
                      style={{
                        marginLeft: '8px',
                        fontSize: '11px',
                        background: 'var(--purple)',
                        color: '#fff',
                        padding: '2px 6px',
                        borderRadius: '4px',
                      }}
                    >
                      Admin
                    </span>
                  )}
                </div>
                <div className="acc-email" id="accEmail">
                  {user.email}
                </div>
              </div>
              <button
                className="btn-outline-purple"
                style={{ width: '100%', padding: '12px', marginTop: '20px' }}
                id="logoutBtn"
                type="button"
                onClick={onLogout}
              >
                Вийти з акаунту
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};