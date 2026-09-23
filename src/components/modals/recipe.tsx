'use client';

import React, { useState, useRef } from 'react';
import { PrescriptionWithAttachment } from '@/shared/types/prescription';

interface RecipeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveRecipe?: (recipe: { title: string; file: File }) => void;
  existingRecipes?: PrescriptionWithAttachment[];
  onDeleteRecipe?: (id: number) => void;
}

export const RecipeModal: React.FC<RecipeModalProps> = ({
  isOpen,
  onClose,
  onSaveRecipe,
  existingRecipes = [],
  onDeleteRecipe,
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'view'>('upload');
  const [recipeTitle, setRecipeTitle] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [titleError, setTitleError] = useState(false);
  const [duplicateError, setDuplicateError] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleSave = () => {
    setTitleError(false);
    setDuplicateError(false);

    if (!recipeTitle.trim()) {
      setTitleError(true);
      return;
    }

    const isDuplicate = existingRecipes.some(
      (r) => r.title?.toLowerCase() === recipeTitle.trim().toLowerCase()
    );

    if (isDuplicate) {
      setDuplicateError(true);
      return;
    }

    if (selectedFile && onSaveRecipe) {
      onSaveRecipe({ title: recipeTitle, file: selectedFile });
    }

    setRecipeTitle('');
    setSelectedFile(null);
    onClose();
  };

  return (
    <div className={`modal-overlay ${isOpen ? 'open' : ''}`} id="recipeOverlay">
      <div className="modal" style={{ maxWidth: '520px' }}>
        <div className="modal-header">
          <h3>Рецепт</h3>
          <button className="modal-close" id="closeRecipe" type="button" onClick={onClose}>
            ✕
          </button>
        </div>
        <div className="modal-body">
          <p
            style={{ fontSize: '13px', color: 'var(--text2)', marginBottom: '12px' }}
            id="recipeModalSub"
          >
            Завантажте рецепт для цього товару
          </p>

          <div className="recipe-tabs">
            <button
              className={`recipe-tab ${activeTab === 'upload' ? 'active' : ''}`}
              id="rtabUpload"
              type="button"
              onClick={() => setActiveTab('upload')}
            >
              Завантажити
            </button>
            <button
              className={`recipe-tab ${activeTab === 'view' ? 'active' : ''}`}
              id="rtabView"
              type="button"
              onClick={() => setActiveTab('view')}
            >
              Переглянути
            </button>
          </div>

          {activeTab === 'upload' && (
            <div id="recipeUploadTab">
              <div
                className="recipe-upload-area"
                id="recipeUploadArea"
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  id="recipeFile"
                  accept="image/*"
                  style={{ display: 'none' }}
                  ref={fileInputRef}
                  onChange={handleFileChange}
                />
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  width="40"
                  height="40"
                  style={{ opacity: 0.5, marginBottom: '8px' }}
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="12" y1="18" x2="12" y2="12" />
                  <line x1="9" y1="15" x2="12" y2="12" />
                  <line x1="15" y1="15" x2="12" y2="12" />
                </svg>
                <div className="rua-text">Перетягніть фото сюди або</div>
                <button
                  className="btn-purple"
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Оберіть фото
                </button>
                <div className="rua-formats">Тільки фото</div>
              </div>

              <div style={{ width: '100%', marginBottom: '12px' }}>
                <input
                  type="text"
                  id="recipeTitle"
                  placeholder="Назва рецепту"
                  maxLength={50}
                  autoComplete="off"
                  value={recipeTitle}
                  onChange={(e) => setRecipeTitle(e.target.value)}
                  style={{
                    width: '100%',
                    marginTop: '12px',
                    border: '2px solid var(--border)',
                    borderRadius: '9px',
                    padding: '9px 12px',
                    fontSize: '14px',
                    fontFamily: 'inherit',
                    background: 'var(--bg-soft)',
                    color: 'var(--text)',
                    outline: 'none',
                  }}
                />
                {titleError && (
                  <div
                    id="recipeTitleError"
                    style={{ color: 'var(--red)', fontSize: '12px', marginTop: '4px' }}
                  >
                    Будь ласка, введіть назву рецепту
                  </div>
                )}
                {duplicateError && (
                  <div
                    id="recipeDuplicateError"
                    style={{ color: 'var(--red)', fontSize: '12px', marginTop: '4px' }}
                  >
                    Цей рецепт вже завантажено
                  </div>
                )}
              </div>

              {selectedFile && (
                <div className="recipe-uploaded" id="recipeUploaded">
                  <div className="ru-file">
                    <span id="ruFileName">{selectedFile.name}</span>
                    <button
                      className="ru-remove"
                      id="ruRemove"
                      type="button"
                      onClick={() => setSelectedFile(null)}
                    >
                      ✕
                    </button>
                  </div>
                </div>
              )}

              <button
                className="btn-purple"
                style={{ width: '100%', marginTop: '18px', padding: '12px' }}
                id="saveRecipeBtn"
                type="button"
                onClick={handleSave}
              >
                Зберегти рецепт
              </button>
            </div>
          )}

          {activeTab === 'view' && (
            <div id="recipeViewTab">
              {existingRecipes.length === 0 ? (
                <div className="recipe-view-empty" id="recipeViewEmpty">
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
                  <p>Рецептів ще немає</p>
                  <span>Перейдіть на вкладку «Завантажити»</span>
                </div>
              ) : (
                <div
                  id="recipeViewList"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                    maxHeight: '400px',
                    overflowY: 'auto',
                  }}
                >
                  {existingRecipes.map((rx) => {
                    const uploadDate = rx.uploadedAt ? new Date(rx.uploadedAt) : new Date();
                    const validUntil = new Date(uploadDate);
                    validUntil.setMonth(validUntil.getMonth() + 6);

                    return (
                      <div className="recipe-view-card" key={rx.id}>
                        <div className="rvc-header">
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            width="36"
                            height="36"
                          >
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                            <polyline points="14 2 14 8 20 8" />
                            <line x1="16" y1="13" x2="8" y2="13" />
                            <line x1="16" y1="17" x2="8" y2="17" />
                          </svg>
                          <div className="rvc-name">{rx.title || `Рецепт #${rx.id}`}</div>
                        </div>

                        <div className="rvc-details">
                          <div className="rvc-row">
                            <span>Статус</span>
                            {rx.attachedProductName ? (
                              <span style={{ color: 'var(--purple)', fontWeight: 600, fontSize: '12px' }}>
                                Для: {rx.attachedProductName}
                              </span>
                            ) : (
                              <span style={{ color: 'var(--text3)', fontSize: '12px' }}>
                                Не використано
                              </span>
                            )}
                          </div>
                          <div className="rvc-row">
                            <span>Завантажено</span>
                            <span>{uploadDate.toLocaleDateString('uk-UA')}</span>
                          </div>
                          <div className="rvc-row">
                            <span>Дійсний до</span>
                            <span>{validUntil.toLocaleDateString('uk-UA')}</span>
                          </div>
                        </div>

                        {rx.imagePath && (
                          <img
                            src={rx.imagePath}
                            style={{
                              width: '100%',
                              borderRadius: '8px',
                              marginTop: '10px',
                              objectFit: 'contain',
                              maxHeight: '200px',
                            }}
                            alt={rx.title || 'Рецепт'}
                          />
                        )}

                        <button
                          className="btn-outline-purple"
                          type="button"
                          style={{ width: '100%', marginTop: '14px' }}
                          onClick={() => onDeleteRecipe?.(rx.id)}
                        >
                          Видалити
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};