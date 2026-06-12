import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// Reset scroll to the top on every route change. Without this, react-router keeps
// the previous scroll position when you navigate to a new page.
export default function ScrollToTop() {
    const { pathname } = useLocation()
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [pathname])
    return null
}
