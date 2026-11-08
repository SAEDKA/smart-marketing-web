'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api-client';
import { saveAccessToken } from '@/lib/auth-storage';

type LoginResponse = { accessToken: string };

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError(''); setLoading(true);
    try { const result = await api.post<LoginResponse>('/auth/login', { email, password }); saveAccessToken(result.accessToken); router.push('/dashboard'); }
    catch (requestError) { setError(requestError instanceof Error ? requestError.message : 'تعذر تسجيل الدخول'); }
    finally { setLoading(false); }
  }

  return (
    <main className="grid min-h-screen bg-[#f6f8fb] lg:grid-cols-2" dir="rtl"><section className="hidden bg-[#115e59] p-12 text-white lg:flex lg:flex-col lg:justify-between"><div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-xl bg-white/15 text-xl">✦</span><span className="text-lg font-bold">سوق بذكاء</span></div><div className="max-w-lg"><p className="text-sm text-teal-100">منصة التسويق للشركات الصغيرة</p><h1 className="mt-4 text-5xl font-bold leading-tight">خلّي تسويقك أذكى وأسهل.</h1><p className="mt-6 leading-8 text-teal-50">خطط لحملاتك، أنشئ محتوى مناسباً، وتابع نتائجك من مكان واحد.</p></div><p className="text-xs text-teal-100">Smart Marketing Platform</p></section><section className="flex items-center justify-center p-6 sm:p-12"><div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-7 shadow-sm sm:p-10"><p className="text-sm font-medium text-teal-700">مرحباً بعودتك</p><h2 className="mt-2 text-3xl font-bold">تسجيل الدخول</h2><p className="mt-3 text-sm leading-6 text-slate-500">أدخل بيانات حسابك للوصول إلى لوحة التحكم.</p><form className="mt-8 space-y-5" onSubmit={handleSubmit}><label className="block text-sm font-medium">البريد الإلكتروني<input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-teal-600 focus:ring-4 focus:ring-teal-50" placeholder="name@example.com" /></label><label className="block text-sm font-medium">كلمة المرور<input required minLength={8} type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-teal-600 focus:ring-4 focus:ring-teal-50" placeholder="••••••••" /></label>{error ? <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}<button disabled={loading} className="w-full rounded-xl bg-teal-700 px-4 py-3 font-bold text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-60">{loading ? 'جارٍ الدخول...' : 'دخول'}</button></form><p className="mt-6 text-center text-sm text-slate-500">لا تملك حساباً؟ <Link href="/register" className="font-bold text-teal-700 hover:text-teal-800">أنشئ حساباً</Link></p></div></section></main>
  );
}
