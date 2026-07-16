import { useState } from 'react'
import TodoInput from './components/TodoInput'
import TodoList from './components/TodoList'
import FilterBar from './components/FilterBar'
import StatsBar from './components/StatsBar'

const FILTERS = ['All', 'Active', 'Completed']

export default function App() {
  const [todos, setTodos] = useState([
    { id: 1, text: 'Build a React Todo App', completed: true },
    { id: 2, text: 'Style with Tailwind CSS', completed: false },
    { id: 3, text: 'Deploy to production', completed: false },
  ])
  const [filter, setFilter] = useState('All')

  const addTodo = (text) => {
    setTodos((prev) => [
      { id: Date.now(), text, completed: false },
      ...prev,
    ])
  }

  const toggleTodo = (id) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    )
  }

  const editTodo = (id, newText) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, text: newText } : t))
    )
  }

  const deleteTodo = (id) => {
    setTodos((prev) => prev.filter((t) => t.id !== id))
  }

  const clearCompleted = () => {
    setTodos((prev) => prev.filter((t) => !t.completed))
  }

  const filtered = todos.filter((t) => {
    if (filter === 'Active') return !t.completed
    if (filter === 'Completed') return t.completed
    return true
  })

  const activeCount = todos.filter((t) => !t.completed).length

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-100 via-purple-50 to-indigo-100 flex items-start justify-center pt-16 px-4 pb-12">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-5xl font-extrabold tracking-tight bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
            My Todos
          </h1>
          <p className="mt-2 text-slate-500 text-sm">Stay organised, get things done.</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl shadow-violet-100 overflow-hidden">
          <TodoInput onAdd={addTodo} />
          <FilterBar filters={FILTERS} active={filter} onChange={setFilter} />
          <TodoList
            todos={filtered}
            onToggle={toggleTodo}
            onEdit={editTodo}
            onDelete={deleteTodo}
          />
          <StatsBar
            activeCount={activeCount}
            filter={filter}
            hasCompleted={todos.some((t) => t.completed)}
            onClear={clearCompleted}
          />
        </div>
      </div>
    </div>
  )
}
