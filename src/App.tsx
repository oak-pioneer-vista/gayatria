import { useMemo, useState } from "react"
import { Search } from "lucide-react"
import { Icon, type IconifyIcon } from "@iconify/react"
import {
  nurseIcon,
  physicalTherapyIcon,
  elderlyIcon,
  criticalCareIcon,
} from "@/health-icons"
import { Button } from "@/components/ui/button"

const searchSuggestions = [
  "Injections",
  "IV Therapy",
  "Wound dressing",
  "Back pain",
  "Joint pain",
  "Post-surgery care",
  "Physiotherapy",
  "Stroke recovery",
  "Diabetes management",
  "BP monitoring",
  "Vaccination",
  "Sample collection",
  "Catheter care",
  "Stoma care",
  "Tracheostomy care",
  "Elderly care",
  "Bedridden patient care",
  "ICU care at home",
]

type Service = {
  title: string
  description: string
  priceFrom: number
  icon: IconifyIcon
  tint: string
}

const services: Service[] = [
  {
    title: "Nursing Care",
    description: "Professional medical care at home",
    priceFrom: 300,
    icon: nurseIcon,
    tint: "bg-brand/15 text-brand",
  },
  {
    title: "Physiotherapy",
    description: "Expert rehabilitation & recovery",
    priceFrom: 735,
    icon: physicalTherapyIcon,
    tint: "bg-sky-50 text-sky-700",
  },
  {
    title: "Nursing Aide",
    description: "Daily living assistance and vital monitoring",
    priceFrom: 500,
    icon: elderlyIcon,
    tint: "bg-amber-50 text-amber-700",
  },
  {
    title: "Specialized Care",
    description: "ICU & critical condition management",
    priceFrom: 1200,
    icon: criticalCareIcon,
    tint: "bg-rose-50 text-rose-700",
  },
]

function SearchBar() {
  const [query, setQuery] = useState("")
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return []
    return searchSuggestions
      .filter((s) => s.toLowerCase().includes(q))
      .slice(0, 8)
  }, [query])

  const showDropdown = open && matches.length > 0

  const choose = (val: string) => {
    setQuery(val)
    setOpen(false)
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showDropdown) {
      if (e.key === "ArrowDown" && matches.length === 0 && query === "") {
        setOpen(true)
      }
      return
    }
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setActiveIndex((i) => (i + 1) % matches.length)
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setActiveIndex((i) => (i - 1 + matches.length) % matches.length)
    } else if (e.key === "Enter") {
      e.preventDefault()
      choose(matches[activeIndex])
    } else if (e.key === "Escape") {
      setOpen(false)
    }
  }

  return (
    <div className="relative w-full max-w-md">
      <form
        onSubmit={(e) => {
          e.preventDefault()
          if (matches[activeIndex]) choose(matches[activeIndex])
        }}
        className="flex items-center gap-2 rounded-full border border-border bg-background p-1.5 shadow-sm focus-within:border-brand/40 focus-within:ring-2 focus-within:ring-brand/15"
      >
        <Search className="ml-3 size-4 shrink-0 text-muted-foreground" aria-hidden />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setOpen(true)
            setActiveIndex(0)
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 120)}
          onKeyDown={onKeyDown}
          placeholder="Search Injections, Back pain..."
          role="combobox"
          aria-expanded={showDropdown}
          aria-autocomplete="list"
          aria-controls="search-suggestions"
          aria-activedescendant={
            showDropdown ? `search-suggestion-${activeIndex}` : undefined
          }
          className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
        <button
          type="submit"
          className="rounded-full bg-brand px-5 py-2 text-sm font-medium text-white transition-colors hover:brightness-95"
        >
          Find
        </button>
      </form>

      {showDropdown && (
        <ul
          id="search-suggestions"
          role="listbox"
          className="absolute top-full right-0 left-0 z-20 mt-2 overflow-hidden rounded-2xl border border-border bg-popover shadow-lg shadow-black/5"
        >
          {matches.map((s, i) => (
            <li
              key={s}
              id={`search-suggestion-${i}`}
              role="option"
              aria-selected={i === activeIndex}
              onMouseDown={(e) => {
                e.preventDefault()
                choose(s)
              }}
              onMouseEnter={() => setActiveIndex(i)}
              className={`flex cursor-pointer items-center gap-2 px-4 py-2 text-sm ${
                i === activeIndex ? "bg-brand/10 text-foreground" : "text-foreground"
              }`}
            >
              <Search className="size-3.5 shrink-0 text-muted-foreground" aria-hidden />
              <span>{s}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-border/40 bg-background/70 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-3">
        <a href="/" className="flex items-center" aria-label="Gayatria — home">
          <img
            src="/logo/gayatria-logo.svg"
            alt="Gayatria"
            className="h-[2.3rem] w-auto"
          />
        </a>

        <nav className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <a href="#login">Login</a>
          </Button>
          <Button size="sm" className="rounded-lg" asChild>
            <a href="#signup">Sign up</a>
          </Button>
        </nav>
      </div>
    </header>
  )
}

function ServiceCard({ service }: { service: Service }) {
  const { title, description, priceFrom, icon, tint } = service
  return (
    <div className="group relative flex flex-col gap-3 overflow-hidden rounded-2xl border border-white/60 bg-white/55 p-3 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.15)] ring-1 ring-inset ring-white/40 backdrop-blur-xl backdrop-saturate-150 transition-all hover:-translate-y-0.5 hover:bg-white/70 hover:shadow-[0_12px_40px_-12px_rgba(0,0,0,0.2)]">
      <div className="relative">
        <div className={`flex aspect-[4/3] items-center justify-center rounded-xl ${tint}`}>
          <Icon icon={icon} className="size-16" />
        </div>
        <div className="absolute top-2 right-2 rounded-lg bg-brand px-2.5 py-1.5 text-right text-white shadow-sm">
          <div className="text-[10px] leading-none opacity-80">From</div>
          <div className="text-sm font-semibold leading-tight">₹{priceFrom}</div>
          <div className="text-[10px] leading-none opacity-80">/ session</div>
        </div>
      </div>
      <div className="px-1 pb-1">
        <h3 className="text-base font-semibold">{title}</h3>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
    </div>
  )
}

function App() {
  return (
    <div className="min-h-svh bg-background">
      <Header />
      <main>
        <section className="mx-auto grid max-w-7xl gap-12 px-6 py-16 lg:grid-cols-2 lg:gap-16 lg:py-24">
        <div className="flex flex-col justify-center gap-6">

          <h1 className="font-heading text-5xl font-semibold leading-[1.05] tracking-tight md:text-6xl">
            India's first
            <br />
            <span className="text-brand">unified care platform</span> for homes
          </h1>

          <p className="max-w-lg text-base text-muted-foreground">
            Expert nursing, therapy, and personal care brought to your home with empathy and clinical skill.
          </p>

          <SearchBar />

          <div className="flex flex-wrap gap-3">
            <Button size="lg" className="rounded-xl">
              Explore Services
            </Button>
            <Button size="lg" variant="outline" className="rounded-xl">
              Chat with Expert
            </Button>
          </div>

        </div>

        <div className="relative grid grid-cols-1 gap-4 sm:grid-cols-2 lg:self-center">
          <div aria-hidden className="pointer-events-none absolute -inset-10 -z-10">
            <div className="absolute -top-4 left-4 size-72 rounded-full bg-brand/40 blur-3xl" />
            <div className="absolute right-0 bottom-0 size-64 rounded-full bg-amber-200/50 blur-3xl" />
            <div className="absolute top-1/3 right-1/3 size-56 rounded-full bg-sky-200/40 blur-3xl" />
          </div>
          {services.map((s) => (
            <ServiceCard key={s.title} service={s} />
          ))}
        </div>
        </section>
      </main>
    </div>
  )
}

export default App
