import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate, Link } from 'react-router-dom'

export default function Dashboard() {
    const [todos, setTodos] = useState([])
    const [title, setTitle] = useState('')
    const [filter, setFilter] = useState('all')
    const [username, setUsername] = useState('')
    const navigate = useNavigate()

    const token = localStorage.getItem('token')

    useEffect(() => {
        if (!token) {
            navigate('/login')
            return
        }
        fetchTodos()
        const payload = JSON.parse(atob(token.split('.')[1]))
        setUsername(payload.username || 'there')
    }, [])

    const fetchTodos = async () => {
        const res = await axios.get('http://localhost:5000/todos', {
            headers: { authorization: token }
        })
        setTodos(res.data)
    }

    const addTodo = async (e) => {
        e.preventDefault()
        if (!title.trim()) return
        await axios.post('http://localhost:5000/todos', { title }, {
            headers: { authorization: token }
        })
        setTitle('')
        fetchTodos()
    }

    const deleteTodo = async (id) => {
        await axios.delete(`http://localhost:5000/todos/${id}`, {
            headers: { authorization: token }
        })
        fetchTodos()
    }

    const toggleComplete = async (id, completed) => {
        await axios.put(`http://localhost:5000/todos/${id}`, { completed: !completed }, {
            headers: { authorization: token }
        })
        fetchTodos()
    }

    const handleLogout = () => {
        localStorage.removeItem('token')
        navigate('/login')
    }

    const filtered = todos.filter(t => {
        if (filter === 'active') return !t.completed
        if (filter === 'completed') return t.completed
        return true
    })

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <div className="brand">
                    <Link to="/login" style={{ textDecoration: 'none' }}>
                        <p className="app-name">dospace</p>
                    </Link>
                    <p className="app-tagline">Your space. Your tasks.</p>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <Link to="/change-password" className="logout-btn">Change password</Link>
                    <button className="logout-btn" onClick={handleLogout}>Sign out</button>
                </div>
            </div>

            <div className="dashboard-main">
                <h1>Hi, {username}!</h1>

                <form className="add-form" onSubmit={addTodo}>
                    <input
                        type="text"
                        placeholder="Add a new task..."
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                    />
                    <button type="submit">Add</button>
                </form>

                <div className="filter-tabs">
                    <button className={filter === 'all' ? 'active' : ''} onClick={() => setFilter('all')}>All</button>
                    <button className={filter === 'active' ? 'active' : ''} onClick={() => setFilter('active')}>Active</button>
                    <button className={filter === 'completed' ? 'active' : ''} onClick={() => setFilter('completed')}>Completed</button>
                </div>

                <div className="todo-list">
                    {filtered.length === 0 && <p className="empty">No tasks here.</p>}
                    {filtered.map(todo => (
                        <div className={`todo-item ${todo.completed ? 'done' : ''}`} key={todo.id}>
                            <input
                                type="checkbox"
                                checked={!!todo.completed}
                                onChange={() => toggleComplete(todo.id, todo.completed)}
                            />
                            <span>{todo.title}</span>
                            <button className="delete-btn" onClick={() => deleteTodo(todo.id)}>✕</button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}