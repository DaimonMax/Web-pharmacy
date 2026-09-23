'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useAuth } from '@/context/authContext';
import {
  fetchPrescriptions,
  uploadPrescription as uploadPrescriptionApi,
  deletePrescription as deletePrescriptionApi,
} from '@/lib/apiServices/prescriptionsApi';
import { Prescription } from '@/shared/types/prescription'; 

type AttachedMap = Record<number, number>;

const ATTACHED_STORAGE_KEY = 'attachedRx';

function loadAttachedFromStorage(): AttachedMap {
  try {
    const raw = localStorage.getItem(ATTACHED_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as AttachedMap) : {};
  } catch {
    return {};
  }
}

function saveAttachedToStorage(map: AttachedMap) {
  localStorage.setItem(ATTACHED_STORAGE_KEY, JSON.stringify(map));
}

interface PrescriptionsContextValue {
  prescriptions: Prescription[];
  isLoading: boolean;
  refresh: () => Promise<void>;
  upload: (title: string, file: File) => Promise<void>;
  remove: (id: number) => Promise<void>;

  attachedPrescriptions: AttachedMap;
  attach: (productId: number, prescriptionId: number) => void;
  getAttachedPrescriptionId: (productId: number) => number | undefined;
  isAttached: (productId: number) => boolean;
}

const PrescriptionsContext = createContext<PrescriptionsContextValue | null>(null);

export const PrescriptionsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [attachedPrescriptions, setAttachedPrescriptions] = useState<AttachedMap>({});

  const refresh = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await fetchPrescriptions();
      setPrescriptions(data);
    } catch {
      setPrescriptions([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) {
      refresh();
      setAttachedPrescriptions(loadAttachedFromStorage());
    } else {
      setPrescriptions([]);
      setAttachedPrescriptions({});
      localStorage.removeItem(ATTACHED_STORAGE_KEY);
    }
  }, [user, refresh]);

  const attach = useCallback((productId: number, prescriptionId: number) => {
    setAttachedPrescriptions((prev) => {
      const next = { ...prev, [productId]: prescriptionId };
      saveAttachedToStorage(next);
      return next;
    });
  }, []);

  const upload = useCallback(
    async (title: string, file: File) => {
      await uploadPrescriptionApi(title, file);
      await refresh();
    },
    [refresh]
  );

  const remove = useCallback(
    async (id: number) => {
      await deletePrescriptionApi(id);
      await refresh();
      setAttachedPrescriptions((prev) => {
        const next = Object.fromEntries(
          Object.entries(prev).filter(([, rxId]) => rxId !== id)
        ) as AttachedMap;
        saveAttachedToStorage(next);
        return next;
      });
    },
    [refresh]
  );

  const getAttachedPrescriptionId = useCallback(
    (productId: number) => attachedPrescriptions[productId],
    [attachedPrescriptions]
  );

  const isAttached = useCallback(
    (productId: number) => attachedPrescriptions[productId] !== undefined,
    [attachedPrescriptions]
  );

  return (
    <PrescriptionsContext.Provider
      value={{
        prescriptions,
        isLoading,
        refresh,
        upload,
        remove,
        attachedPrescriptions,
        attach,
        getAttachedPrescriptionId,
        isAttached,
      }}
    >
      {children}
    </PrescriptionsContext.Provider>
  );
};

export function usePrescriptions(): PrescriptionsContextValue {
  const ctx = useContext(PrescriptionsContext);
  if (!ctx) throw new Error('usePrescriptions must be used within PrescriptionsProvider');
  return ctx;
}