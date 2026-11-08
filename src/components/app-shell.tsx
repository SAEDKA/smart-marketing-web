import Link from 'next/link';

const navigation = [
  { label: 'نظرة عامة', href: '/dashboard', icon: '⌂' },
  { label: 'المنتجات', href: '/dashboard/products', icon: '▣' },
  { label: 'الحملات', href: '/dashboard/campaigns', icon: '↗' },
  { label: 'الإحصائيات', href: '/dashboard/analytics', icon: '▥' },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f6f8fb] text-slate-900">
      <aside className="fixed inset-y-0 right-0 hidden w-72 border-l border-slate-200 bg-white px-6 py-8 lg:block">
        <Link href="/dashboard" className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-xl bg-[#0f766e] text-xl text-white shadow-sm">✦</span>
          <span><span className="block text-lg font-bold">سوق بذكاء</span><span className="block text-xs text-slate-500">Smart Marketing</span></span>
        </Link>
        <nav className="mt-12 space-y-2" aria-label="التنقل الرئيسي">
          {navigation.map((item) => <Link key={item.href} href={item.href} className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-teal-50 hover:text-teal-800"><span className="grid size-7 place-items-center rounded-lg bg-slate-100 text-xs">{item.icon}</span>{item.label}</Link>)}
        </nav>
        <div className="absolute inset-x-6 bottom-8 rounded-2xl bg-slate-900 p-4 text-white"><p className="text-xs font-semibold text-teal-300">نصيحة اليوم</p><p className="mt-2 text-sm leading-6 text-slate-200">المحتوى المنتظم يبني حضوراً أقوى لعلامتك التجارية.</p></div>
      </aside>
      <main className="min-h-screen lg:mr-72">
        <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-5 lg:px-10"><div><p className="text-xs font-medium text-slate-400">لوحة التحكم</p><h1 className="mt-1 text-xl font-bold">مرحباً بك من جديد</h1></div><div className="flex items-center gap-3"><span className="hidden text-left text-sm sm:block"><span className="block font-semibold">صاحب المشروع</span><span className="block text-xs text-slate-400">حساب تجريبي</span></span><span className="grid size-10 place-items-center rounded-full bg-teal-100 font-bold text-teal-800">ص</span></div></header>
        <div className="p-6 lg:p-10">{children}</div>
      </main>
    </div>
  );
}
