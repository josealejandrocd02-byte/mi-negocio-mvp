import { useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider, useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight, BriefcaseBusiness, Coffee, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { getData } from '@/services/mock/store';
import type { Session } from '@/types';
import { Workspace } from '@/pages/Workspace';
import './index.css';

const client = new QueryClient({ defaultOptions: { queries: { staleTime: 0, refetchOnWindowFocus: false, retry: 1 } } });
const loginSchema = z.object({ email: z.string().email('Ingresa un correo válido'), password: z.string().min(1, 'La contraseña es obligatoria'), role: z.enum(['SUPER_ADMIN','STORE_ADMIN','EMPLOYEE']), storeId: z.string().min(1) });
type LoginValues = z.infer<typeof loginSchema>;

function Login({ onLogin }: { onLogin: (session: Session) => void }) {
  const navigate = useNavigate();
  const { data } = useQuery({ queryKey: ['demo-data'], queryFn: getData });
  const { register, handleSubmit, watch, setValue, formState: { errors, isSubmitting } } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema), defaultValues: { email: 'valeria@minegocio.bo', password: 'demo123', role: 'SUPER_ADMIN', storeId: 'store-cafe' },
  });
  const role = watch('role');
  const [showPassword, setShowPassword] = useState(false);
  const [feedback, setFeedback] = useState('');
  const submit = handleSubmit(async values => {
    setFeedback('');
    const membership = values.role === 'SUPER_ADMIN'
      ? undefined
      : data?.memberships.find(m => m.store_id === values.storeId && m.role === values.role && m.is_active);
    const account = values.role === 'SUPER_ADMIN'
      ? data?.users.find(u => u.platform_role === 'SUPER_ADMIN' && u.is_active)
      : data?.users.find(u => u.id === membership?.user_id && u.is_active);
    if (!account) { setFeedback('No hay un perfil de demostración activo para esta selección.'); return; }
    const session: Session = { userId: account.id, role: values.role, storeId: values.storeId };
    localStorage.setItem('mi-negocio-session', JSON.stringify(session)); onLogin(session);
    navigate(values.role === 'SUPER_ADMIN' ? '/admin/dashboard' : '/app/dashboard');
  });
  return <main className="min-h-[100dvh] bg-[#f7f8fc] md:grid md:grid-cols-[1fr_1fr]">
    <section className="relative hidden overflow-hidden bg-[#20234a] p-12 text-white md:flex md:flex-col md:justify-between lg:p-16">
      <div className="absolute -right-28 -top-24 h-[430px] w-[430px] rounded-full border border-white/10" /><div className="absolute -right-10 -top-8 h-[290px] w-[290px] rounded-full border border-white/10" />
      <div className="relative flex items-center gap-3"><span className="grid h-11 w-11 place-items-center rounded-xl bg-indigo-500"><BriefcaseBusiness size={22}/></span><span className="font-[Manrope] text-xl font-extrabold">mi negocio</span></div>
      <div className="relative max-w-lg pb-10"><p className="mb-5 text-xs font-bold uppercase tracking-[.2em] text-indigo-300">Tu negocio, en orden</p><h1 className="font-[Manrope] text-5xl font-extrabold leading-[1.08] tracking-tight">Cada día más claro. Cada venta más simple.</h1><p className="mt-6 max-w-md text-base leading-7 text-indigo-100/75">Una sola herramienta para cuidar tus productos, ventas y equipo. Hecha para el ritmo real de tu local.</p><div className="mt-12 flex items-center gap-3 text-sm text-indigo-100/70"><ShieldCheck size={17}/> Datos de demostración, sin riesgo para tu negocio</div></div>
      <div className="relative flex items-center gap-2 text-xs text-indigo-200/60"><Coffee size={14}/> Diseñado para comercios bolivianos</div>
    </section>
    <section className="flex min-h-[100dvh] items-center justify-center px-5 py-10 md:px-10">
      <div className="w-full max-w-[420px] animate-rise">
        <div className="mb-9 flex items-center gap-3 md:hidden"><span className="grid h-10 w-10 place-items-center rounded-xl bg-indigo-600 text-white"><BriefcaseBusiness size={20}/></span><span className="font-[Manrope] text-lg font-extrabold">mi negocio</span></div>
        <p className="text-sm font-semibold text-indigo-600">Bienvenido de nuevo</p><h2 className="mt-2 font-[Manrope] text-3xl font-extrabold tracking-tight text-slate-900">Inicia sesión</h2><p className="mt-2 text-sm text-slate-500">Ingresa a tu espacio de trabajo demo.</p>
        <form onSubmit={submit} className="mt-8 space-y-5">
          <div><label className="mn-label" htmlFor="email">Correo electrónico</label><input id="email" data-testid="input-email" type="email" className="mn-input" placeholder="nombre@negocio.bo" {...register('email')}/>{errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}</div>
          <div><label className="mn-label" htmlFor="password">Contraseña</label><div className="relative"><input id="password" data-testid="input-password" type={showPassword?'text':'password'} className="mn-input pr-11" {...register('password')}/><button type="button" data-testid="button-toggle-password" onClick={()=>setShowPassword(!showPassword)} className="absolute right-3 top-2.5 text-slate-400">{showPassword?<EyeOff size={17}/>:<Eye size={17}/>}</button></div>{errors.password && <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>}</div>
          <div><label className="mn-label" htmlFor="demo-role">Rol de demostración</label><select id="demo-role" data-testid="select-demo-role" className="mn-input" {...register('role',{onChange:e=>{const selected=e.target.value as LoginValues['role'];if(selected==='SUPER_ADMIN')return;const member=data?.memberships.find(m=>m.role===selected&&m.is_active);if(member)setValue('storeId',member.store_id);}})}><option value="SUPER_ADMIN">Superadministrador</option><option value="STORE_ADMIN">Administrador de local</option><option value="EMPLOYEE">Empleado</option></select></div>
          {role !== 'SUPER_ADMIN' && <div><label className="mn-label" htmlFor="demo-store">Local</label><select id="demo-store" data-testid="select-demo-store" className="mn-input" {...register('storeId')}>{data?.stores.map(store=><option key={store.id} value={store.id}>{store.name}</option>)}</select></div>}
          <button disabled={isSubmitting || !data} data-testid="button-login" className="mn-btn mn-btn-primary w-full !h-11">{isSubmitting?'Ingresando…':'Entrar al demo'}<ArrowRight size={16}/></button>
          <div className="min-h-5 text-xs text-red-600" data-testid="text-login-feedback">{feedback||(!data?'Cargando datos demo…':'')}</div>
        </form>
        <div className="mt-6 rounded-xl border border-indigo-100 bg-indigo-50/70 p-4 text-xs leading-5 text-indigo-900"><strong>Acceso de demostración:</strong> Usa cualquier correo válido y una contraseña no vacía. El rol elegido abre un perfil ficticio. Los datos se guardan solo en este navegador.</div>
      </div>
    </section>
  </main>;
}

function AppRoutes() {
  const [session, setSession] = useState<Session | null>(() => { try { return JSON.parse(localStorage.getItem('mi-negocio-session') || 'null') as Session | null; } catch { return null; } });
  return <Routes>
    <Route path="/login" element={session ? <Navigate to={session.role==='SUPER_ADMIN'?'/admin/dashboard':'/app/dashboard'} replace/> : <Login onLogin={setSession}/>}/>
    <Route path="/*" element={session ? <Workspace session={session} setSession={setSession}/> : <Navigate to="/login" replace/>}/>
  </Routes>;
}
export default function App() {
  return <QueryClientProvider client={client}><TooltipProvider><BrowserRouter><AppRoutes/></BrowserRouter><Toaster/></TooltipProvider></QueryClientProvider>;
}
