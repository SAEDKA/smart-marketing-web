import { AppShell } from '@/components/app-shell';

const stats = [
  { label: 'المنشورات هذا الشهر', value: '0', note: 'ابدأ أول حملة لك' },
  { label: 'الوصول الكلي', value: '—', note: 'لا توجد بيانات بعد' },
  { label: 'نسبة التفاعل', value: '—', note: 'ستظهر بعد أول نشر' },
];

export default function DashboardPage() {
  return (
    <AppShell>
      <section className="rounded-3xl bg-gradient-to-l from-[#115e59] to-[#0f766e] p-7 text-white shadow-sm lg:p-10"><p className="text-sm font-medium text-teal-100">ابدأ تسويقك اليوم</p><h2 className="mt-3 max-w-xl text-3xl font-bold leading-tight lg:text-4xl">حوّل منتجاتك إلى حملات تسويقية مؤثرة بالذكاء الاصطناعي.</h2><p className="mt-4 max-w-lg text-sm leading-7 text-teal-50">أضف منتجاتك، اختر هدفك، ودع المنصة تساعدك في إعداد محتوى مناسب لعملائك.</p><button className="mt-7 rounded-xl bg-white px-5 py-3 text-sm font-bold text-teal-800 shadow-sm transition hover:bg-teal-50">إنشاء حملة جديدة</button></section>
      <section className="mt-8 grid gap-4 md:grid-cols-3">{stats.map((stat) => <article key={stat.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><p className="text-sm text-slate-500">{stat.label}</p><p className="mt-3 text-3xl font-bold">{stat.value}</p><p className="mt-2 text-xs text-slate-400">{stat.note}</p></article>)}</section>
      <section className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center"><div className="mx-auto grid size-12 place-items-center rounded-2xl bg-teal-50 text-xl text-teal-700">✦</div><h3 className="mt-4 text-lg font-bold">لوحة الإحصائيات جاهزة</h3><p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">ستظهر هنا نتائج حملاتك وتحليل SWOT بعد تنفيذ أول منشور.</p></section>
    </AppShell>
  );
}
