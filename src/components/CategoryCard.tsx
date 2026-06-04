"use client";
import Link from "next/link";

const categoryDetails: Record<string, { image: string; tag: string; desc: string }> = {
  "Mithila Art": {
    image: "https://images.unsplash.com/photo-1579783900862-c7f8fb00d3d4?q=80&w=600",
    tag: "GI Tagged",
    desc: "Ancient Mithila wall painting heritage",
  },
  Handlooms: {
    image: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=600",
    tag: "100% Pure Silk",
    desc: "Famous Bhagalpuri handwoven silk",
  },
  Spices: {
    image: "https://images.unsplash.com/photo-1599940824399-b87987ceb72a?q=80&w=600",
    tag: "Organic",
    desc: "Aromatic herbs & ground spices",
  },
  Sweets: {
    image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?q=80&w=600",
    tag: "Freshly Made",
    desc: "Nalanda's legendary Silao Khaja",
  },
  Handicrafts: {
    image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=600",
    tag: "Artisan Made",
    desc: "Sikki grass & stone sculptures",
  },
  Electronics: {
    image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?q=80&w=600",
    tag: "Local Service",
    desc: "Patna assembled premium audio & tech",
  },
};

export default function CategoryCard({
  name,
  icon,
  index = 0,
  isInView = true,
}: {
  name: string;
  icon: string;
  index?: number;
  isInView?: boolean;
}) {
  const details = categoryDetails[name] || {
    image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=600",
    tag: " Bihar Heritage",
    desc: "Explore regional heritage products",
  };

  return (
    <Link
      href={`/shop?category=${encodeURIComponent(name)}`}
      className={`
        group relative block rounded-3xl overflow-hidden aspect-[3/4]
        border border-black/5 dark:border-white/5
        shadow-md hover:shadow-2xl hover:-translate-y-2
        transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]
        cursor-pointer
        ${isInView ? "animate-fade-in-up" : "opacity-0"}
      `}
      style={{ animationDelay: `${index * 80}ms` }}
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center scale-100 group-hover:scale-110 transition-transform duration-700 ease-out"
        style={{ backgroundImage: `url(${details.image})` }}
      />

      {/* Modern Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-900/40 to-transparent opacity-85 group-hover:opacity-90 transition-opacity duration-500" />

      {/* Top Tag Badge */}
      <div className="absolute top-4 left-4 z-10">
        <span className="text-[10px] font-bold tracking-wider uppercase bg-white/10 dark:bg-black/40 backdrop-blur-md text-white/90 border border-white/20 px-2.5 py-1 rounded-full">
          {details.tag}
        </span>
      </div>

      {/* Content Container */}
      <div className="absolute inset-x-0 bottom-0 p-5 z-10 flex flex-col justify-end min-h-[50%]">
        {/* Category Header */}
        <div className="flex items-center gap-2 mb-1">
          <span className="text-2xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)] group-hover:scale-125 transition-transform duration-300">
            {icon}
          </span>
          <h3 className="text-white font-extrabold text-lg leading-tight tracking-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
            {name}
          </h3>
        </div>

        {/* Short Description */}
        <p className="text-white/70 text-xs font-medium line-clamp-2 transform translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
          {details.desc}
        </p>

        {/* Call to action text */}
        <div className="mt-3 flex items-center gap-1 text-[11px] font-bold text-amber-400 opacity-80 group-hover:opacity-100 transition-opacity duration-300">
          <span>Explore Shop</span>
          <svg
            className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform duration-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="3"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>

      {/* Shimmer Border Effect */}
      <div className="absolute inset-0 border-2 border-transparent group-hover:border-amber-400/30 rounded-3xl pointer-events-none transition-colors duration-500" />
    </Link>
  );
}
