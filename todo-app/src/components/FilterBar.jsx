export default function FilterBar({ filters, active, onChange }) {
  return (
    <div className="flex items-center justify-center gap-1 px-4 py-2 border-b border-slate-100 bg-slate-50">
      {filters.map((f) => (
        <button
          key={f}
          onClick={() => onChange(f)}
          className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-all ${
            active === f
              ? 'bg-violet-600 text-white shadow-sm'
              : 'text-slate-500 hover:text-violet-600 hover:bg-violet-50'
          }`}
        >
          {f}
        </button>
      ))}
    </div>
  )
}
