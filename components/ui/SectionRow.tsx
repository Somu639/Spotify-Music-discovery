"use client";

interface SectionRowProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  id?: string;
}

export function SectionRow({ title, subtitle, children, id }: SectionRowProps) {
  return (
    <section id={id} className="mb-8 scroll-mt-24 px-4 sm:px-8">
      <div className="mb-4 flex items-end justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-app-text hover:underline sm:text-2xl">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-0.5 text-sm text-app-muted">{subtitle}</p>
          )}
        </div>
      </div>
      <div className="-mx-1 flex gap-4 overflow-x-auto pb-2 spotify-scroll">
        {children}
      </div>
    </section>
  );
}
