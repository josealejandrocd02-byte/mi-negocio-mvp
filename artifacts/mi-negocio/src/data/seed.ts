import type { DemoData } from '@/types';

const ago = (days: number, hour = 10) => { const d = new Date(); d.setDate(d.getDate() - days); d.setHours(hour, 20, 0, 0); return d.toISOString(); };
export function createSeed(): DemoData {
  const stores = [
    { id: 'store-cafe', name: 'Café Central', address: 'Av. 16 de Julio 145, La Paz', phone: '2 231 4088', status: 'ACTIVE' as const, created_at: ago(220) },
    { id: 'store-napoli', name: 'Pizzería Napoli', address: 'Calle España 384, Cochabamba', phone: '4 425 7731', status: 'ACTIVE' as const, created_at: ago(154) },
    { id: 'store-market', name: 'Minimarket San Martín', address: 'Av. San Martín 92, Santa Cruz', phone: '3 334 1902', status: 'SUSPENDED' as const, created_at: ago(98) },
  ];
  const users = [
    { id: 'u-super', full_name: 'Valeria Rojas', email: 'valeria@minegocio.bo', platform_role: 'SUPER_ADMIN' as const, is_active: true, created_at: ago(240) },
    { id: 'u-cafe-admin', full_name: 'Martín Salazar', email: 'martin@cafecentral.bo', platform_role: 'USER' as const, is_active: true, created_at: ago(210) },
    { id: 'u-napoli-admin', full_name: 'Lucía Fernández', email: 'lucia@napoli.bo', platform_role: 'USER' as const, is_active: true, created_at: ago(150) },
    { id: 'u-market-admin', full_name: 'Diego Vargas', email: 'diego@sanmartin.bo', platform_role: 'USER' as const, is_active: true, created_at: ago(92) },
    { id: 'u-emp-1', full_name: 'Camila Mendoza', email: 'camila@cafecentral.bo', platform_role: 'USER' as const, is_active: true, created_at: ago(80) },
    { id: 'u-emp-2', full_name: 'Andrés Paredes', email: 'andres@cafecentral.bo', platform_role: 'USER' as const, is_active: true, created_at: ago(50) },
    { id: 'u-emp-3', full_name: 'Sofía Quiroga', email: 'sofia@napoli.bo', platform_role: 'USER' as const, is_active: true, created_at: ago(45) },
    { id: 'u-emp-4', full_name: 'Pablo Arias', email: 'pablo@sanmartin.bo', platform_role: 'USER' as const, is_active: false, created_at: ago(32) },
  ];
  const memberships = [
    ['u-cafe-admin','store-cafe','STORE_ADMIN'], ['u-napoli-admin','store-napoli','STORE_ADMIN'], ['u-market-admin','store-market','STORE_ADMIN'],
    ['u-emp-1','store-cafe','EMPLOYEE'], ['u-emp-2','store-cafe','EMPLOYEE'], ['u-emp-3','store-napoli','EMPLOYEE'], ['u-emp-4','store-market','EMPLOYEE'],
  ].map(([user_id, store_id, role], i) => ({ id: `m-${i}`, user_id, store_id, role: role as 'STORE_ADMIN'|'EMPLOYEE', is_active: i !== 6, created_at: ago(90 - i * 7) }));
  const catNames = [['Café y bebidas','Panadería','Repostería','Snacks','Pizza','Bebidas','Abarrotes'],['Pizzas','Bebidas','Entradas','Postres'],['Abarrotes','Bebidas','Limpieza']];
  const categories = stores.flatMap((s, si) => catNames[si].map((name, i) => ({ id: `cat-${si}-${i}`, store_id: s.id, name })));
  const rawProducts: [number,string,number,number][] = [
    [0,'Capuccino',18,28],[0,'Latte vainilla',22,16],[0,'Americano',15,42],[0,'Té de cedrón',12,8],[0,'Croissant',11,5],[0,'Torta de chocolate',24,3],[0,'Sándwich de palta',26,12],[0,'Jugo de naranja',16,17],
    [1,'Napolitana mediana',68,14],[1,'Pepperoni familiar',112,9],[1,'Cuatro quesos',96,6],[1,'Limonada',18,24],[1,'Pan de ajo',22,2],[1,'Brownie',16,11],
    [2,'Arroz 1 kg',12,35],[2,'Aceite vegetal',19,18],[2,'Leche entera',8.5,4],[2,'Agua mineral',6,21],[2,'Detergente',24,7],[2,'Azúcar 1 kg',9,0],
  ];
  const products = rawProducts.map(([si,name,price,stock],i) => ({ id:`prod-${i}`, store_id:stores[si].id, category_id:categories.filter(c=>c.store_id===stores[si].id)[i % catNames[si].length].id, name, price, stock_quantity:stock, is_active:true, created_at:ago(60-i) }));
  const sales: DemoData['sales'] = []; const saleDetails: DemoData['saleDetails'] = [];
  const staff = [['u-cafe-admin','u-emp-1','u-emp-2'],['u-napoli-admin','u-emp-3'],['u-market-admin']];
  for (let i=0;i<15;i++) {
    const si = i < 7 ? 0 : i < 12 ? 1 : 2, store = stores[si], id = `sale-${i+1}`;
    const eligible = products.filter(p=>p.store_id===store.id);
    const count = 1 + (i%3);
    let total = 0;
    for (let j=0;j<count;j++) { const p = eligible[(i+j*3)%eligible.length], qty = 1 + ((i+j)%2); total += p.price*qty; saleDetails.push({ id:`sd-${i}-${j}`, sale_id:id, store_id:store.id, product_id:p.id, quantity:qty, unit_price:p.price }); }
    sales.push({ id, store_id:store.id, sold_by:staff[si][i%staff[si].length], total, created_at:ago(i%7, 9+(i%9)) });
  }
  return { users, stores, memberships, categories, products, sales, saleDetails };
}
