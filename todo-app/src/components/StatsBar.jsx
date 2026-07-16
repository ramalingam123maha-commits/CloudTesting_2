export default function StatsBar({ activeCount, filter, hasCompleted, onClear }) {
  return (
    <div className="flex items-center justify-between px-4 py-3 bg-slate-50 text-xs text-slate-400 border-t border-slate-100">
      <span>
        <span className="font-semibold text-slate-600">{activeCount}</span>{' '}
        {activeCount === 1 ? 'item' : 'items'} left
      </span>
      {hasCompleted && (
        <button
          onClick={onClear}
          className="hover:text-red-500 transition-colors font-medium"
        >
          Clear completed
        </button>
      )}
    </div>
  )
}
