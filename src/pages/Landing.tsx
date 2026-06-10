import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Logo } from "@/layout/Logo"
import { fashionHero, fashionPortrait, workspaceImage } from "@/lib/unsplash"
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Star,
  Zap,
} from "lucide-react"

export function Landing() {
  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-foreground)] overflow-x-hidden">
      <Nav />
      <Hero />
      <Marquee />
      <Features />
      <Showcase />
      <Pricing />
      <Testimonials />
      <CTA />
      <Footer />
    </div>
  )
}

function Nav() {
  return (
    <header className="sticky top-0 z-40 bg-[var(--color-background)]/85 backdrop-blur-md hairline-b">
      <div className="mx-auto max-w-[1280px] h-16 px-6 flex items-center justify-between">
        <Logo />
        <nav className="hidden md:flex items-center gap-8 text-[13px] text-[var(--color-muted)]">
          <a href="#features" className="hover:text-[var(--color-foreground)] anim">
            Imkoniyatlar
          </a>
          <a href="#pricing" className="hover:text-[var(--color-foreground)] anim">
            Narx
          </a>
          <a href="#testimonials" className="hover:text-[var(--color-foreground)] anim">
            Mijozlar
          </a>
        </nav>
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" size="sm">
            <Link to="/login">Kirish</Link>
          </Button>
          <Button asChild size="sm">
            <Link to="/login">
              Boshlash <ArrowRight className="size-3" strokeWidth={2.25} />
            </Link>
          </Button>
        </div>
      </div>
    </header>
  )
}

function Hero() {
  return (
    <section className="relative">
      <div className="mx-auto max-w-[1280px] px-6 pt-20 lg:pt-28 pb-24">
        <div className="grid lg:grid-cols-[1.15fr_1fr] gap-12 lg:gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 h-7 rounded-[3px] bg-[var(--color-brand-soft)] mb-8">
              <Zap className="size-3 text-[var(--color-brand)]" strokeWidth={2.5} />
              <span className="text-[11px] uppercase tracking-[0.16em] text-[var(--color-brand)] font-semibold">
                Bold CRM · 2026
              </span>
            </div>

            <h1 className="text-[56px] lg:text-[96px] leading-[0.93] font-semibold tracking-display text-balance">
              Biznesingiz uchun{" "}
              <span className="marker-y">yorqin</span>
              <br />
              boshqaruv.
            </h1>

            <p className="mt-8 text-[16px] text-[var(--color-muted)] max-w-[480px] leading-relaxed">
              DossCRM — sariq va qora estetikasi bilan ajralib turgan minimal CRM. Buyurtmalar,
              mahsulotlar va mijozlar. Tezlik bilan.
            </p>

            <div className="mt-10 flex items-center gap-3">
              <Button asChild size="lg">
                <Link to="/login">
                  Bepul boshlash <ArrowRight className="size-4" strokeWidth={2.25} />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <a href="#features">Imkoniyatlar →</a>
              </Button>
            </div>

            <div className="mt-14 grid grid-cols-3 gap-8 max-w-md">
              {[
                { v: "500+", l: "Brand" },
                { v: "1.2M+", l: "Buyurtma" },
                { v: "99.9%", l: "Uptime" },
              ].map((s) => (
                <div key={s.l}>
                  <div className="text-[32px] font-semibold tracking-tight text-[var(--color-brand)]">
                    {s.v}
                  </div>
                  <div className="text-[11px] uppercase tracking-[0.1em] text-[var(--color-muted)] mt-1">
                    {s.l}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -top-3 -left-3 right-6 bottom-6 stripe-y opacity-25" />
            <div className="absolute -top-4 right-0 bg-[var(--color-brand)] px-4 py-2 z-10">
              <span className="text-[11px] uppercase tracking-[0.16em] font-bold text-[var(--color-brand-foreground)]">
                Bu oydagi sotuv
              </span>
            </div>

            <div className="relative aspect-[4/5] overflow-hidden hairline bg-black">
              <img
                src={fashionHero("dosscrm-hero", 900, 1100)}
                alt="Streetwear editorial"
                className="absolute inset-0 w-full h-full object-cover"
                style={{ filter: "grayscale(100%) contrast(1.08) brightness(0.95)" }}
                loading="eager"
              />
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(180deg, transparent 50%, rgba(5,5,5,0.85) 100%)",
                }}
              />

              <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between gap-4">
                <div>
                  <div className="text-[56px] leading-none font-semibold text-white tracking-tight">
                    18.4M
                  </div>
                  <div className="text-[11px] uppercase tracking-[0.16em] text-white/60 mt-1.5">
                    so'm o'tgan oyga nisbatan
                  </div>
                </div>
                <div className="bg-[var(--color-brand)] text-[var(--color-brand-foreground)] text-[12px] font-bold px-2 py-1 flex items-center gap-0.5">
                  <ArrowUpRight className="size-3" strokeWidth={2.5} />
                  +12.3%
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Marquee() {
  const words = ["Atelier 21", "Vellum Studio", "Aria Boutique", "Noir & Co.", "Marigold", "Studio Nine"]
  return (
    <section className="hairline-t hairline-b py-8 overflow-hidden">
      <div className="flex items-center gap-10 whitespace-nowrap animate-[scroll_30s_linear_infinite]">
        {[...words, ...words, ...words].map((w, i) => (
          <span key={i} className="text-[24px] tracking-tight text-[var(--color-muted)] font-medium shrink-0 flex items-center gap-10">
            {w}
            <span className="size-1 rounded-full bg-[var(--color-brand)]" />
          </span>
        ))}
      </div>
      <style>{`@keyframes scroll { to { transform: translateX(-33.333%) } }`}</style>
    </section>
  )
}

function Features() {
  const items = [
    {
      n: "01",
      title: "Buyurtma boshqaruvi",
      desc: "Real vaqtda kuzating, status o'zgartiring, to'lov belgilang. Bir vositada hammasi.",
      img: workspaceImage("orders-dc", 800, 600),
    },
    {
      n: "02",
      title: "Mahsulot va ombor",
      desc: "Stok darajalari, kam qolgan mahsulotlar uchun ogohlantirish, oson korrektirovka.",
      img: workspaceImage("inventory-dc", 800, 600),
    },
    {
      n: "03",
      title: "Hisobot va tahlil",
      desc: "Sotuv trend, kategoriya, hudud va sotuvchi bo'yicha minimal vizualizatsiya.",
      img: workspaceImage("analytics-dc", 800, 600),
    },
  ]
  return (
    <section id="features" className="mx-auto max-w-[1280px] px-6 py-28">
      <div className="grid lg:grid-cols-[1fr_2fr] gap-14 mb-16 items-end">
        <div>
          <div className="text-[11px] uppercase tracking-[0.16em] text-[var(--color-brand)] font-semibold mb-3">
            ⬢ Imkoniyatlar
          </div>
        </div>
        <div>
          <h2 className="text-[44px] lg:text-[60px] leading-[1.0] font-semibold tracking-display text-balance">
            Faqat kerakli{" "}
            <span className="text-[var(--color-brand)]">vositalar</span>.
            <br />
            Ortiqcha narsasiz.
          </h2>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-px bg-[var(--color-border)] hairline">
        {items.map((item) => (
          <article
            key={item.n}
            className="bg-[var(--color-background)] anim hover:bg-[var(--color-surface)] group"
          >
            <div className="aspect-[5/4] overflow-hidden hairline-b relative">
              <img
                src={item.img}
                alt={item.title}
                className="w-full h-full object-cover anim group-hover:scale-[1.03]"
                style={{ filter: "grayscale(100%) contrast(1.05) brightness(0.85)" }}
                loading="lazy"
              />
              <div className="absolute top-3 left-3 bg-[var(--color-brand)] text-[var(--color-brand-foreground)] text-[10px] font-bold px-1.5 py-0.5 uppercase tracking-[0.12em]">
                {item.n}
              </div>
            </div>
            <div className="p-7">
              <h3 className="text-[22px] font-semibold mb-2.5 tracking-tight">{item.title}</h3>
              <p className="text-[13px] text-[var(--color-muted)] leading-relaxed">
                {item.desc}
              </p>
              <div className="mt-5 inline-flex items-center gap-1.5 text-[12px] font-medium text-[var(--color-brand)] anim group-hover:gap-2.5">
                Batafsil <ArrowRight className="size-3" strokeWidth={2.25} />
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

function Showcase() {
  return (
    <section className="hairline-t bg-[var(--color-surface)]">
      <div className="mx-auto max-w-[1280px] px-6 py-28">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="text-[11px] uppercase tracking-[0.16em] text-[var(--color-brand)] font-semibold mb-3">
              ⬢ Klaviatura uchun
            </div>
            <h2 className="text-[44px] lg:text-[60px] leading-[1.0] font-semibold tracking-display text-balance">
              ⌘K orqali{" "}
              <span className="marker-y">tezlik</span>.
            </h2>
            <p className="mt-6 text-[15px] text-[var(--color-muted)] max-w-md leading-relaxed">
              Sichqonsiz boshqaruv. Har joyga 2 ta tugmacha bilan o'ting, buyurtma yarating,
              mijoz qo'shing.
            </p>
            <ul className="mt-8 space-y-3.5">
              {[
                "Global ⌘K command palette",
                "Klaviatura yorliqlari har joyda",
                "50ms javob vaqti",
                "⌘[ orqali sidebar toggle",
              ].map((t) => (
                <li
                  key={t}
                  className="flex items-center gap-3 text-[14px] text-[var(--color-foreground-muted)]"
                >
                  <span className="size-4 grid place-items-center bg-[var(--color-brand)] text-[var(--color-brand-foreground)] rounded-[2px]">
                    <Check className="size-2.5" strokeWidth={3} />
                  </span>
                  {t}
                </li>
              ))}
            </ul>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 stripe-y opacity-15" />
            <div className="relative hairline bg-[var(--color-background)] rounded-[4px] overflow-hidden">
              <div className="px-3 h-9 flex items-center gap-1.5 hairline-b">
                <span className="size-2 rounded-full bg-white/15" />
                <span className="size-2 rounded-full bg-white/15" />
                <span className="size-2 rounded-full bg-[var(--color-brand)]" />
                <span className="ml-3 font-mono text-[11px] text-[var(--color-muted)]">
                  dosscrm.app/dashboard
                </span>
              </div>
              <div className="p-3">
                <div className="rounded-[3px] hairline bg-[var(--color-surface)] p-3">
                  <div className="flex items-center gap-2 pb-2.5 mb-2 hairline-b text-[11px] text-[var(--color-muted)]">
                    <span>Qidirish... sahifa, action...</span>
                    <kbd className="ml-auto text-[10px] font-mono px-1.5 py-0.5 rounded hairline">
                      ESC
                    </kbd>
                  </div>
                  <div className="space-y-1">
                    {[
                      { label: "Dashboard", path: "/dashboard", active: false },
                      { label: "Buyurtmalar", path: "/orders", active: true },
                      { label: "Mahsulotlar", path: "/products", active: false },
                      { label: "Ombor", path: "/inventory", active: false },
                    ].map((it) => (
                      <div
                        key={it.path}
                        className={`flex items-center gap-2 px-2.5 py-1.5 rounded text-[12px] ${
                          it.active
                            ? "bg-[var(--color-brand)] text-[var(--color-brand-foreground)] font-semibold"
                            : "text-[var(--color-foreground-muted)]"
                        }`}
                      >
                        <span className="size-1 rounded-full bg-current opacity-60" />
                        <span>{it.label}</span>
                        <span className="ml-auto font-mono text-[10px] opacity-70">
                          {it.path}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Pricing() {
  const plans = [
    {
      name: "Starter",
      price: "Bepul",
      sub: "Boshlash uchun ideal",
      features: ["100 buyurtma/oy", "1 foydalanuvchi", "Asosiy hisobotlar", "Email yordam"],
      cta: "Bepul boshlash",
      highlight: false,
    },
    {
      name: "Pro",
      price: "290k",
      sub: "Oyiga / so'mda",
      features: [
        "Cheksiz buyurtma",
        "10 foydalanuvchi",
        "Kengaytirilgan hisobot",
        "API kirish",
        "Prioritet yordam",
      ],
      cta: "14 kun bepul",
      highlight: true,
    },
    {
      name: "Studio",
      price: "890k",
      sub: "Oyiga / so'mda",
      features: [
        "Cheksiz hammasi",
        "Cheksiz foydalanuvchi",
        "Maxsus integratsiya",
        "Akkaunt menejer",
        "SLA kafolat",
      ],
      cta: "Aloqa",
      highlight: false,
    },
  ]
  return (
    <section id="pricing" className="mx-auto max-w-[1280px] px-6 py-28">
      <div className="grid lg:grid-cols-[1fr_2fr] gap-14 mb-16">
        <div>
          <div className="text-[11px] uppercase tracking-[0.16em] text-[var(--color-brand)] font-semibold">
            ⬢ Narx
          </div>
        </div>
        <div>
          <h2 className="text-[44px] lg:text-[60px] leading-[1.0] font-semibold tracking-display text-balance">
            Aniq narxlar.
            <br />
            <span className="text-[var(--color-muted)]">Yashirin to'lov yo'q.</span>
          </h2>
        </div>
      </div>
      <div className="grid md:grid-cols-3 gap-px bg-[var(--color-border)] hairline">
        {plans.map((p) => (
          <div
            key={p.name}
            className={`relative p-8 ${
              p.highlight ? "bg-[var(--color-brand)] text-[var(--color-brand-foreground)]" : "bg-[var(--color-background)]"
            }`}
          >
            {p.highlight && (
              <div className="absolute top-2 right-2 bg-black text-[var(--color-brand)] text-[10px] font-bold px-1.5 py-0.5 uppercase tracking-[0.12em]">
                ★ Tavsiya
              </div>
            )}
            <div className={`text-[11px] uppercase tracking-[0.16em] mb-6 font-semibold ${p.highlight ? "text-black/70" : "text-[var(--color-muted)]"}`}>
              {p.name}
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-[48px] font-semibold leading-none tracking-tight">
                {p.price}
              </span>
            </div>
            <div className={`text-[12px] mt-2 ${p.highlight ? "text-black/70" : "text-[var(--color-muted)]"}`}>{p.sub}</div>

            <Button
              asChild
              variant={p.highlight ? "accent" : "outline"}
              size="lg"
              className="w-full mt-7"
            >
              <Link to="/login">{p.cta}</Link>
            </Button>

            <ul className="mt-7 space-y-3">
              {p.features.map((f) => (
                <li
                  key={f}
                  className={`flex items-center gap-2.5 text-[13px] ${p.highlight ? "text-black/80" : "text-[var(--color-foreground-muted)]"}`}
                >
                  <Check className={`size-3.5 shrink-0 ${p.highlight ? "text-black" : "text-[var(--color-brand)]"}`} strokeWidth={2.25} />
                  {f}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}

function Testimonials() {
  const items = [
    {
      quote: "DossCRM interfeysi yorqin va kuchli. Sariq aksent juda yaqdi.",
      name: "Aziza Yusupova",
      role: "Atelier 21, Egasi",
      img: fashionPortrait("dc-t1", 80, 80),
    },
    {
      quote: "Klaviatura yorliqlari kunda 1 soat tejaydi. Eng tezkor CRM.",
      name: "Sherzod Karimov",
      role: "Vellum Studio, COO",
      img: fashionPortrait("dc-t2", 80, 80),
    },
    {
      quote: "Sotuvchilarim bir kunda o'rgandi. Dizayni ham, oddiyligi ham — top.",
      name: "Dilnoza Rahimova",
      role: "Aria Boutique, Menejer",
      img: fashionPortrait("dc-t3", 80, 80),
    },
  ]
  return (
    <section id="testimonials" className="hairline-t bg-[var(--color-surface)]">
      <div className="mx-auto max-w-[1280px] px-6 py-28">
        <div className="grid lg:grid-cols-[1fr_2fr] gap-14 mb-16">
          <div>
            <div className="text-[11px] uppercase tracking-[0.16em] text-[var(--color-brand)] font-semibold">
              ⬢ Mijozlarimiz
            </div>
          </div>
          <div>
            <h2 className="text-[44px] lg:text-[60px] leading-[1.0] font-semibold tracking-display text-balance">
              Nima <span className="marker-y">deyishadi</span>.
            </h2>
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-px bg-[var(--color-border)] hairline">
          {items.map((t) => (
            <blockquote
              key={t.name}
              className="bg-[var(--color-background)] p-8 flex flex-col"
            >
              <div className="flex items-center gap-0.5 mb-5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="size-3 fill-[var(--color-brand)] text-[var(--color-brand)]" />
                ))}
              </div>
              <p className="flex-1 text-[16px] leading-relaxed text-[var(--color-foreground)] tracking-tight">
                "{t.quote}"
              </p>
              <footer className="mt-8 flex items-center gap-3">
                <div
                  className="size-10 overflow-hidden hairline shrink-0"
                  style={{ filter: "grayscale(100%)" }}
                >
                  <img src={t.img} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="min-w-0">
                  <div className="text-[13px] font-semibold truncate">{t.name}</div>
                  <div className="text-[11px] text-[var(--color-muted)] mt-0.5 truncate">{t.role}</div>
                </div>
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  )
}

function CTA() {
  return (
    <section className="hairline-t relative overflow-hidden">
      <div className="absolute inset-0 stripe-y opacity-[0.08]" />
      <div className="relative mx-auto max-w-[1280px] px-6 py-28">
        <div className="grid lg:grid-cols-[1fr_auto] gap-10 items-end">
          <div>
            <div className="text-[11px] uppercase tracking-[0.16em] text-[var(--color-brand)] font-semibold mb-4">
              ⬢ Bepul boshlang
            </div>
            <h2 className="text-[52px] lg:text-[80px] leading-[0.96] font-semibold tracking-display text-balance">
              30 soniya.
              <br />
              <span className="marker-y">Karta talab qilinmaydi.</span>
            </h2>
          </div>
          <Button asChild size="lg" className="shrink-0 h-14 px-8 text-[15px]">
            <Link to="/login">
              Boshlash <ArrowRight className="size-4" strokeWidth={2.25} />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="hairline-t bg-[var(--color-background)]">
      <div className="mx-auto max-w-[1280px] px-6 py-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <Logo />
        <div className="flex flex-wrap items-center gap-7 text-[12px] text-[var(--color-muted)]">
          <a href="#features" className="hover:text-[var(--color-foreground)] anim">
            Imkoniyatlar
          </a>
          <a href="#pricing" className="hover:text-[var(--color-foreground)] anim">
            Narx
          </a>
          <a href="#" className="hover:text-[var(--color-foreground)] anim">
            Maxfiylik
          </a>
          <a href="#" className="hover:text-[var(--color-foreground)] anim">
            Shartlar
          </a>
        </div>
        <div className="text-[11px] text-[var(--color-muted)] font-mono">
          © 2026 RetDossCrm
        </div>
      </div>
    </footer>
  )
}
