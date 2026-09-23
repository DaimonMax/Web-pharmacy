import { apiRequest } from '@/lib/api-client';
import { Prescription } from '@/shared/types/prescription'; 

export function fetchPrescriptions(): Promise<Prescription[]> {
  return apiRequest<Prescription[]>('/prescriptions');
}

export function uploadPrescription(title: string, file: File): Promise<{ message: string }> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('title', title);
  return apiRequest<{ message: string }>('/prescriptions/upload', {
    method: 'POST',
    body: formData,
  });
}

export function deletePrescription(id: number): Promise<{ message: string }> {
  return apiRequest<{ message: string }>(`/prescriptions/${id}`, {
    method: 'DELETE',
  });
}

export function getPrescriptionFileUrl(id: number): string {
  return `/api/prescriptions/file/${id}`;
}