import Link from "next/link";

const links = [
  ["Dashboard", "/admin"],
  ["Products", "/admin/products"],
  ["Categories", "/admin/categories"],
  ["Orders", "/admin/orders"],
];

export function AdminSidebar() {
  return (
    <aside className="border-b border-black bg-neutral-50 p-4 lg:min-h-screen lg:w-64 lg:border-b-0 lg:border-r">
      <p className="font-serif text-3xl font-black uppercase">Admin</p>
      <nav className="mt-8 flex gap-4 text-xs font-bold uppercase tracking-[0.16em] lg:flex-col">
        {links.map(([label, href]) => (
          <Link key={href} href={href} className="border border-black px-4 py-3">
            {label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}

