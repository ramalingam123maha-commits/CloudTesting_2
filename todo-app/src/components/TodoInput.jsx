import { useState } from 'react'

export default function TodoInput({ onAdd }) {
  const [value, setValue] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    const trimmed = value.trim()
    if (!trimmed) return
    onAdd(trimmed)
    setValue('')
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 p-4 border-b border-slate-100">
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="What needs to be done?"
        className="flex-1 rounded-lg border border-slate-200 px-4 py-2.5 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition"
      />
      <button
        type="submit"
        className="bg-violet-600 hover:bg-violet-700 active:scale-95 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-all"
      >
        Add
      </button>
    </form>
  )
}
