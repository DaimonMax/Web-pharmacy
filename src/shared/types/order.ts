import { OrderItem } from './orderItem';

export interface Order{
    id: number
    userId: number
    createdAt: Date
    status: string
    totalPrice: number
    items: OrderItem[]
    deliveryAddress: string
}