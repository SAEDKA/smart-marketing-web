import Link from 'next/link';

export default function RegisterPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f6f8fb] px-6 py-12" dir="rtl">
      <section className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto grid size-12 place-items-center rounded-2xl bg-teal-50 text-xl text-teal-700">✦</div>
        <h1 className="mt-5 text-2xl font-bold">إنشاء حساب</h1>
        <p className="mt-3 text-sm leading-6 text-slate-500">صفحة التسجيل جاهزة للربط مع API التسجيل في المهمة التالية.</p>
        <Link href="/login" className="mt-7 inline-block rounded-xl bg-teal-700 px-5 py-3 text-sm font-bold text-white hover:bg-teal-800">العودة لتسجيل الدخول</Link>
      </section>
    </main>
  );
}
