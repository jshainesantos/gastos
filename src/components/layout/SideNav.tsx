import { LayoutDashboard, Plus, Clock, Tag, Settings } from 'lucide-react'
import type { Page } from '../../types'

interface Props {
  current: Page
  onNavigate: (page: Page) => void
}

const navItems: { page: Page; label: string; Icon: React.ElementType }[] = [
  { page: 'dashboard', label: 'Home', Icon: LayoutDashboard },
  { page: 'history', label: 'History', Icon: Clock },
  { page: 'categories', label: 'Tags', Icon: Tag },
  { page: 'settings', label: 'Settings', Icon: Settings },
]

export function SideNav({ current, onNavigate }: Props) {
  return (
    <nav
      className="hidden lg:flex flex-col fixed left-0 top-0 h-full w-60 z-30 py-6 px-4"
      style={{
        background: 'var(--bg-nav)',
        backdropFilter: 'blur(20px)',
        borderRight: '1px solid var(--border-dim)',
      }}
      aria-label="Main navigation"
    >
      <div className="px-3 mb-8">
        <span className="text-lg font-bold tracking-tight text-zinc-100">gastos</span>
      </div>

      <button
        onClick={() => onNavigate('add')}
        aria-label="Add Expense"
        className="flex items-center gap-3 px-4 py-3 rounded-2xl mb-6 text-white font-semibold text-sm transition-all active:scale-[0.98] cursor-pointer"
        style={{
          background: 'linear-gradient(145deg, #818CF8, #6366F1)',
          boxShadow: '0 4px 16px rgba(99,102,241,0.35)',
        }}
      >
        <Plus size={18} strokeWidth={2.5} aria-hidden="true" />
        Add Expense
      </button>

      <ul className="flex flex-col gap-1">
        {navItems.map(({ page, label, Icon }) => {
          const active = current === page
          return (
            <li key={page}>
              <button
                onClick={() => onNavigate(page)}
                aria-current={active ? 'page' : undefined}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                  active
                    ? 'text-accent bg-accent-dim'
                    : 'text-zinc-400 hover:text-zinc-100 hover:bg-white/5'
                }`}
              >
                <Icon size={18} strokeWidth={active ? 2.5 : 2} aria-hidden="true" />
                {label}
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
