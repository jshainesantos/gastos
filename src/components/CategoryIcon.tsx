import {
  Utensils,
  Car,
  ShoppingBag,
  Zap,
  Film,
  MoreHorizontal,
  Coffee,
  PawPrint,
  Sparkles,
  Plane,
  House,
  Gift,
  Dumbbell,
  Pill,
  Baby,
  Gamepad2,
  Music,
  Shirt,
  Bike,
  Wallet,
  type LucideProps,
} from 'lucide-react'

const ICON_MAP: Record<string, React.ComponentType<LucideProps>> = {
  utensils: Utensils,
  car: Car,
  'shopping-bag': ShoppingBag,
  zap: Zap,
  film: Film,
  'more-horizontal': MoreHorizontal,
  coffee: Coffee,
  'paw-print': PawPrint,
  sparkles: Sparkles,
  plane: Plane,
  house: House,
  gift: Gift,
  dumbbell: Dumbbell,
  pill: Pill,
  baby: Baby,
  'gamepad-2': Gamepad2,
  music: Music,
  shirt: Shirt,
  bike: Bike,
  wallet: Wallet,
}

interface Props {
  icon: string
  color: string
  size?: number
}

export function CategoryIcon({ icon, color, size = 16 }: Props) {
  const Icon = ICON_MAP[icon] ?? MoreHorizontal
  const pad = Math.round(size * 0.75)
  const total = size + pad * 2
  return (
    <span
      className="category-icon-bg flex items-center justify-center rounded-2xl flex-shrink-0"
      style={{ '--icon-color': color, width: total, height: total, minWidth: total, background: color + '28' } as React.CSSProperties}
    >
      <Icon size={size} style={{ color }} strokeWidth={1.8} aria-hidden="true" />
    </span>
  )
}
