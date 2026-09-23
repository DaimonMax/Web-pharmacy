export interface Prescription{
    id: number
    userId: number
    imagePath: string
    photoHash: string
    title: string
    uploadedAt: Date | string;
}

export interface PrescriptionWithAttachment extends Prescription {
  attachedProductId?: number | null;
  attachedProductName?: string | null;
}