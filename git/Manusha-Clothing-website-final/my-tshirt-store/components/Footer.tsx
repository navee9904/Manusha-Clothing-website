import Link from "next/link";

const columns = [
  { title: "Brand", links: ["MANUSHA", "Black and white essentials", "Colombo / Worldwide"] },
  { title: "Shop", links: ["Oversized Tees", "Graphic Tees", "Plain Basics", "Limited Drops"] },
  { title: "Help", links: ["Shipping", "Returns", "Sizing", "Contact"] },
  { title: "Social", links: ["Instagram", "TikTok", "Pinterest", "YouTube"] },
];

export function Footer() {
  return (
    <footer id="about" className="border-t border-black bg-white px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {columns.map((column) => (
          <div key={column.title}>
            <h2 className="text-xs font-black uppercase tracking-[0.24em]">{column.title}</h2>
            <div className="mt-5 grid gap-3 text-sm text-neutral-700">
              {column.links.map((item) => (
                <Link key={item} href={column.title === "Shop" ? "/shop" : "#"} className="hover:text-black">
                  {item}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="mx-auto mt-12 max-w-7xl border-t border-[#E0E0E0] pt-6 text-xs font-black uppercase tracking-[0.2em]">
        MANUSHA
      </div>
    </footer>
  );
}
