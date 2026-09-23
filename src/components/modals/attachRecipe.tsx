'use client';

import React, { useState } from 'react';
import { PrescriptionWithAttachment } from '@/shared/types/prescription';

interface AttachRecipeModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId?: number;
  productName?: string;
  recipes?: PrescriptionWithAttachment[];
  attachedRecipeId?: number | null;
  onSelectRecipe?: (recipeId: number) => void;
  onOpenUploadModal?: () => void;
}

export const AttachRecipeModal: React.FC<AttachRecipeModalProps> = ({
  isOpen,
  onClose,
  productId,
  productName = '',
  recipes = [],
  attachedRecipeId = null,
  onSelectRecipe,
  onOpenUploadModal,
}) => {

  if (!isOpen) return null;

  const handleUploadClick = () => {
    onClose();
    onOpenUploadModal?.();
  };

  const handleRecipeClick = (rx: PrescriptionWithAttachment, isUsed: boolean) => {
    if (isUsed) return;
    onSelectRecipe?.(rx.id);
  };

  return (
    <div className={`modal-overlay ${isOpen ? 'open' : ''}`} id="attachRecipeOverlay">
      <div className="modal">
        <div className="modal-header">
          <h3>Прикріпити рецепт</h3>
          <button className="modal-close" type="button" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="modal-body">
          {productName && (
            <p style={{ fontSize: '13px', color: 'var(--text2)', marginBottom: '12px' }} id="attachRecipeProductName">
              Товар: <strong>{productName}</strong>
            </p>
          )}

          {recipes.length === 0 ? (
            <div className="recipe-view-empty" id="attachRecipeEmpty">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                width="44"
                height="44"
                style={{ opacity: 0.3, marginBottom: '10px' }}
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
              <p>Рецептів немає</p>
              <span>Спочатку завантажте рецепт</span>
              <button
                className="btn-purple"
                style={{ marginTop: '14px' }}
                type="button"
                onClick={handleUploadClick}
              >
                Завантажити рецепт
              </button>
            </div>
          ) : (
            <>
              <div
                id="attachRecipeList"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                  maxHeight: '340px',
                  overflowY: 'auto',
                }}
              >
                {recipes.map((rx) => {
                  const isAttached = attachedRecipeId === rx.id;
                  const isUsed = Boolean(
                    rx.attachedProductId && rx.attachedProductId !== productId
                  );

                  return (
                    <div
                      key={rx.id}
                      className="recipe-view-card"
                      style={{
                        cursor: isUsed ? 'not-allowed' : 'pointer',
                        border: `2px solid ${isAttached ? 'var(--purple)' : 'var(--border)'}`,
                        opacity: isUsed ? 0.6 : 1,
                      }}
                      onClick={() => handleRecipeClick(rx, isUsed)}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div className="rvc-name">{rx.title}</div>

                        {isAttached && (
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="var(--purple)"
                            strokeWidth="2.5"
                            width="18"
                            height="18"
                          >
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        )}

                        {isUsed && (
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="var(--red)"
                            strokeWidth="2"
                            width="16"
                            height="16"
                          >
                            <rect x="3" y="11" width="18" height="11" rx="2" />
                            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                          </svg>
                        )}
                      </div>

                      <div style={{ fontSize: '12px', color: 'var(--text3)', marginTop: '4px' }}>
                        {rx.uploadedAt
                          ? new Date(rx.uploadedAt).toLocaleDateString('uk-UA')
                          : ''}
                      </div>

                      {isUsed && rx.attachedProductName && (
                        <div style={{ fontSize: '11px', color: 'var(--red)', marginTop: '4px' }}>
                          Прикріплено до: {rx.attachedProductName}
                        </div>
                      )}

                      {isAttached && (
                        <div style={{ fontSize: '11px', color: 'var(--purple)', marginTop: '4px' }}>
                          Прикріплено до цього товару
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};