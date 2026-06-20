import { LayoutDashboard, PlusCircle, Clock, Tag, Settings } from 'lucide-react'
import type { Page } from '../../types'

interface Props {
  current: Page
  onNavigate: (page: Page) => void
}

const items: { page: Page; label: string; Icon: React.ElementType }[] = [
  { page: 'dashboard', label: 'Home', Icon: LayoutDashboard },
  { page: 'history', label: 'History', Icon: Clock },
  { page: 'add', label: 'Add', Icon: PlusCircle },
  { page: 'categories', label: 'Tags', Icon: Tag },
  { page: 'settings', label: 'Settings', Icon: Settings },
]

export function BottomNav({ current, onNavigate }: Props) {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-30"
      style={{ background: 'rgba(11,11,14,0.92)', backdropFilter: 'blur(20px)', borderTop: '1px solid rgba(255,255,255,0.06)' }}
      aria-label="Main navigation"
    >
      <ul className="flex items-center justify-around h-[68px] max-w-[430px] mx-auto px-2">
        {items.map(({ page, label, Icon }) => {
          const active = current === page
          const isAdd = page === 'add'
          return (
            <li key={page}>
              <button
                onClick={() => onNavigate(page)}
                aria-label={label}
                aria-current={active ? 'page' : undefined}
                className={`flex flex-col items-center gap-1 px-3 rounded-xl transition-all duration-200 cursor-pointer min-w-[52px] min-h-[52px] justify-center relative ${
                  isAdd
                    ? 'text-zinc-100'
                    : active
                    ? 'text-accent'
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                {isAdd ? (
                  <span className="w-10 h-10 rounded-2xl bg-accent flex items-center justify-center shadow-lg shadow-accent/20">
                    <Icon size={20} strokeWidth={2.5} aria-hidden="true" />
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
