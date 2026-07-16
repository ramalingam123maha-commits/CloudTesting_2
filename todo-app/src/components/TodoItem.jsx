import { useState, useRef, useEffect } from 'react'

export default function TodoItem({ todo, onToggle, onEdit, onDelete }) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(todo.text)
  const inputRef = useRef(null)

  useEffect(() => {
    if (editing) inputRef.current?.focus()
  }, [editing])

  const commitEdit = () => {
    const trimmed = draft.trim()
    if (trimmed && trimmed !== todo.text) onEdit(todo.id, trimmed)
    else setDraft(todo.text)
    setEditing(false)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') commitEdit()
    if (e.key === 'Escape') { setDraft(todo.text); setEditing(false) }
  }

  return (
    <li className="flex items-center gap-3 px-4 py-3 group hover:bg-slate-50 transition-colors">
      {/* Checkbox */}
      <button
        onClick={() => onToggle(todo.id)}
        aria-label={todo.completed ? 'Mark as active' : 'Mark as completed'}
        className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
          todo.completed
            ? 'bg-violet-500 border-violet-500'
            : 'border-slate-300 hover:border-violet-400'
        }`}
      >
        {todo.completed && (
          <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
            <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>

      {/* Text / Edit input */}
      {editing ? (
        <input
          ref={inputRef}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commitEdit}
          onKeyDown={handleKeyDown}
          className="flex-1 rounded border border-violet-400 px-2 py-0.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-300"
        />
      ) : (
        <span
          onDoubleClick={() => !todo.completed && setEditing(true)}
          className={`flex-1 text-sm select-none transition-all ${
            todo.completed ? 'line-through text-slate-400' : 'text-slate-700'
          }`}
          title={todo.completed ? '' : 'Double-click to edit'}
        >
          {todo.text}
        </span>
      )}

      {/* Action buttons */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        {!todo.completed && !editing && (
          <button
            onClick={() => setEditing(true)}
            aria-label="Edit task"
            className="p-1.5 rounded-md text-slate-400 hover:text-violet-600 hover:bg-violet-50 transition-colors"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11.5 2.5a1.414 1.414 0 012 2L5 13H2v-3L11.5 2.5z" />
            </svg>
          </button>
        )}
        <button
          onClick={() => onDelete(todo.id)}
          aria-label="Delete task"
          className="p-1.5 rounded-md text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 4h10M6 4V2h4v2M5 4l.5 9h5L11 4" />
          </svg>
        </button>
      </div>
    </li>
  )
}
