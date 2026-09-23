export interface Product{
    id: number
    name: string
    description: string
    composition: string
    manufacturer: string
    price: number
    categoryId: number
    varietyId: number
    isRecipeRequired: boolean
    imageUrl?: string
    isForChildren: boolean
}