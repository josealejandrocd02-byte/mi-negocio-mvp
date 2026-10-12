export type PlatformRole = 'SUPER_ADMIN' | 'USER';
export type StoreRole = 'STORE_ADMIN' | 'EMPLOYEE';
export type StoreStatus = 'ACTIVE' | 'SUSPENDED' | 'CLOSED';
export interface Usuario { id: string; full_name: string; email: string; platform_role: PlatformRole; is_active: boolean; created_at: string }
export interface Local { id: string; name: string; address: string; phone: string; status: StoreStatus; created_at: string }
export interface MiembroLocal { id: string; store_id: string; user_id: string; role: StoreRole; is_active: boolean; created_at: string }
export interface Categoria { id: string; store_id: string; name: string }
export interface Producto { id: string; store_id: string; category_id: string; name: string; price: number; stock_quantity: number; is_active: boolean; created_at: string }
export interface Venta { id: string; store_id: string; sold_by: string; total: number; created_at: string }
export interface DetalleVenta { id: string; sale_id: string; store_id: string; product_id: string; quantity: number; unit_price: number }
export interface DemoData { users: Usuario[]; stores: Local[]; memberships: MiembroLocal[]; categories: Categoria[]; products: Producto[]; sales: Venta[]; saleDetails: DetalleVenta[] }
export interface Session { userId: string; role: 'SUPER_ADMIN' | StoreRole; storeId: string }
export const newId = (prefix: string) => `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
