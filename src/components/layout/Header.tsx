interface Props {
  title: string
  subtitle?: string
  right?: React.ReactNode
}

export function Header({ title, subtitle, right }: Props) {
  return (
    <header className="px-5 pt-12 pb-4 flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tighter text-zinc-50">{title}</h1>
        {subtitle && <p className="text-sm text-zinc-500 mt-0.5 font-medium">{subtitle}</p>}
      </div>
      {right && <div className="mt-1">{right}</div>}
    </header>
  )
}
