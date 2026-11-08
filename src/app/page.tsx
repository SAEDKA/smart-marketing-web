import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f6f8fb] px-6 py-8 text-slate-900" dir="rtl">
      <nav className="mx-auto flex max-w-6xl items-center justify-between">
        <Link href="/" className="flex items-center gap-3 text-lg font-bold"><span className="grid size-10 place-items-center rounded-xl bg-teal-700 text-white">✦</span>سوق بذكاء</Link>
        <Link href="/login" className="rounded-xl bg-teal-700 px-5 py-3 text-sm font-bold text-white hover:bg-teal-800">تسجيل الدخول</Link>
      </nav>
      <section className="mx-auto grid max-w-6xl items-center gap-12 py-24 lg:grid-cols-2 lg:py-36"><div><p className="font-semibold text-teal-700">التسويق الذكي للشركات الصغيرة</p><h1 className="mt-5 text-5xl font-bold leading-tight tracking-tight lg:text-6xl">خلي منتجك يوصل للناس الصح.</h1><p className="mt-6 max-w-xl text-lg leading-9 text-slate-600">منصة واحدة تساعدك على إنشاء حملاتك التسويقية، نشرها، وفهم نتائجها باستخدام الذكاء الاصطناعي.</p><div className="mt-8 flex flex-wrap gap-3"><Link href="/login" className="rounded-xl bg-teal-700 px-6 py-3 font-bold text-white hover:bg-teal-800">ابدأ الآن</Link><Link href="/dashboard" className="rounded-xl border border-slate-200 bg-white px-6 py-3 font-bold text-slate-700 hover:border-teal-200 hover:text-teal-700">معاينة لوحة التحكم</Link></div></div><div className="rounded-[2rem] bg-gradient-to-br from-teal-700 to-slate-900 p-7 text-white shadow-xl"><div className="rounded-2xl bg-white/10 p-6 backdrop-blur"><p className="text-sm text-teal-100">ملخص الأداء</p><p className="mt-3 text-5xl font-bold">+24%</p><p className="mt-2 text-sm text-slate-200">تحسن في تفاعل الحملات</p><div className="mt-8 grid grid-cols-3 gap-3">{['محتوى', 'نشر', 'تحليل'].map((item) => <div key={item} className="rounded-xl bg-white/10 p-4 text-center text-sm">{item}</div>)}</div></div></div></section>
    </main>
  );
}
