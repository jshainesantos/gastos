interface Props {
  title: string
  subtitle?: string
  left?: React.ReactNode
  right?: React.ReactNode
}

export function Header({ title, subtitle, left, right }: Props) {
  return (
    <header className="px-5 pt-12 pb-4 flex items-start justify-between gap-2">
      {left && <div className="flex-shrink-0">{left}</div>}
      <div className="flex-1">
        <h1 className="text-2xl font-bold tracking-tighter text-zinc-50">{title}</h1>
        {subtitle && <p className="text-sm text-zinc-500 mt-0.5 font-medium">{subtitle}</p>}
      </div>
      {right && <div className="flex-shrink-0">{right}</div>}
    </header>
  )
}
