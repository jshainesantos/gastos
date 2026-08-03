import { LayoutDashboard, Plus, Clock, Tag, Settings } from 'lucide-react'
import type { Page } from '../../types'

interface Props {
  current: Page
  onNavigate: (page: Page) => void
}

const items: { page: Page; label: string; Icon: React.ElementType }[] = [
  { page: 'dashboard', label: 'Home', Icon: LayoutDashboard },
  { page: 'history', label: 'History', Icon: Clock },
  { page: 'add', label: 'Add', Icon: Plus },
  { page: 'categories', label: 'Tags', Icon: Tag },
  { page: 'settings', label: 'Settings', Icon: Settings },
]

export function BottomNav({ current, onNavigate }: Props) {
  const hideAdd = current === 'add'
  const visibleItems = hideAdd ? items.filter(i => i.page !== 'add') : items

  return (
    <nav
      className="fixed bottom-5 left-4 right-4 z-30"
      aria-label="Main navigation"
    >
      <ul
        className="flex items-center justify-around h-[64px] max-w-[400px] mx-auto px-2 rounded-2xl"
        style={{
          background: 'rgba(24, 24, 27, 0.85)',
          backdropFilter: 'blur(20px)',
          border: '1px solid var(--border-dim)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
        }}
      >
        {visibleItems.map(({ page, label, Icon }) => {
          const active = current === page
          const isAdd = page === 'add'
          return (
            <li key={page}>
              <button
                onClick={() => onNavigate(page)}
                aria-label={label}
                aria-current={active ? 'page' : undefined}
                className={`flex flex-col items-center gap-1 px-3 rounded-xl transition-all duration-200 cursor-pointer min-w-[48px] min-h-[48px] justify-center relative ${
                  isAdd
                    ? 'text-zinc-100'
                    : active
                    ? 'text-accent'
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                {isAdd ? (
                  <span
                    className="w-14 h-14 rounded-full flex items-center justify-center -mt-5"
                    style={{
                      background: 'linear-gradient(145deg, #818CF8, #6366F1)',
                      boxShadow: '0 0 0 4px rgba(24, 24, 27, 0.85), 0 8px 24px rgba(99,102,241,0.5)',
                    }}
                  >
                    <Icon size={22} strokeWidth={2.5} aria-hidden="true" className="text-white" />
                  </span>
                ) : (
                  <>
                    <Icon size={20} strokeWidth={active ? 2.5 : 2} aria-hidden="true" />
                    <span className={`text-[10px] font-medium tracking-tight ${active ? 'text-accent' : ''}`}>{label}</span>
                  </>
                )}
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
