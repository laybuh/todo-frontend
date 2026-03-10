import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate, Link } from 'react-router-dom'

export default function Dashboard() {
    const [todos, setTodos] = useState([])
    const [title, setTitle] = useState('')
    const [filter, setFilter] = useState('all')
    const [username, setUsername] = useState('')
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
    const [deleteEmail, setDeleteEmail] = useState('')
    const [deleteError, setDeleteError] = useState('')
    const navigate = useNavigate()

    const token = localStorage.getItem('token')

    useEffect(() => {
        if (!token) {
            navigate('/login')
            return
        }

        const lastActive = localStorage.getItem('lastActive')
        if (lastActive && Date.now() - parseInt(lastActive) > 60 * 60 * 1000) {
            localStorage.removeItem('token')
            localStorage.removeItem('lastActive')
            navigate('/login')
            return
        }

        fetchTodos()
        const payload = JSON.parse(atob(token.split('.')[1]))
        setUsername(payload.username || 'there')
    }, [])

    useEffect(() => {
        const timeout = { current: null }

        const resetTimer = () => {
            localStorage.setItem('lastActive', Date.now().toString())
            clearTimeout(timeout.current)
            timeout.current = setTimeout(() => {
                localStorage.removeItem('token')
                localStorage.removeItem('lastActive')
                navigate('/login')
            }, 60 * 60 * 1000)
        }

        window.addEventListener('mousemove', resetTimer)
        window.addEventListener('keydown', resetTimer)
        window.addEventListener('click', resetTimer)

        resetTimer()

        return () => {
            clearTimeout(timeout.current)
            window.removeEventListener('mousemove', resetTimer)
            window.removeEventListener('keydown', resetTimer)
            window.removeEventListener('click', resetTimer)
        }
    }, [])

    const fetchTodos = async () => {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/todos`, {
            headers: { authorization: token }
        })
        setTodos(res.data)
    }

    const addTodo = async (e) => {
        e.preventDefault()
        if (!title.trim()) return
        await axios.post(`${import.meta.env.VITE_API_URL}/todos`, { title }, {
            headers: { authorization: token }
        })
        setTitle('')
        fetchTodos()
    }

    const deleteTodo = async (id) => {
        await axios.delete(`${import.meta.env.VITE_API_URL}/todos/${id}`, {
            headers: { authorization: token }
        })
        fetchTodos()
    }

    const toggleComplete = async (id, completed) => {
        await axios.put(`${import.meta.env.VITE_API_URL}/todos/${id}`, { completed: !completed }, {
            headers: { authorization: token }
        })
        fetchTodos()
    }

    const handleLogout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('lastActive')
        navigate('/login')
    }

    const handleDeleteAccount = async () => {
        try {
            await axios.delete(`${import.meta.env.VITE_API_URL}/auth/delete-account`, {
                headers: { authorization: token },
                data: { email: deleteEmail }
            })
            localStorage.removeItem('token')
            localStorage.removeItem('lastActive')
            navigate('/login')
        } catch (err) {
            setDeleteError(err.response?.data?.error || 'Something went wrong.')
        }
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
                    <button className="logout-btn delete-account-btn" onClick={() => setShowDeleteConfirm(true)}>Delete account</button>
                    <button className="logout-btn" onClick={handleLogout}>Sign out</button>
                </div>
            </div>

            {showDeleteConfirm && (
                <div className="delete-modal-overlay">
                    <div className="delete-modal">
                        <h2>Delete account</h2>
                        <p>Enter your email to confirm. This cannot be undone.</p>
                        <input
                            type="email"
                            placeholder="Your email"
                            value={deleteEmail}
                            onChange={e => {
                                setDeleteEmail(e.target.value)
                                setDeleteError('')
                            }}
                        />
                        {deleteError && <p className="error">{deleteError}</p>}
                        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                            <button className="delete-account-btn logout-btn" onClick={handleDeleteAccount}>Yes, delete</button>
                            <button className="logout-btn" onClick={() => {
                                setShowDeleteConfirm(false)
                                setDeleteEmail('')
                                setDeleteError('')
                            }}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}

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