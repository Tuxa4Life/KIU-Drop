import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import '../Styles/navbar.css'
import { useEffect, useState } from 'react';

const Navbar = () => {
    const navigate = useNavigate()
    const { pathname } = useLocation()

    const [scrolled, setScrolled] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 30)
        }

        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    })

    return <nav className={scrolled ? 'scrolled' : ''}>
        <ul>
            <li><NavLink to={'/'} className={({ isActive }) => isActive ? 'selected' : ''}>Home</NavLink></li>
            <li><NavLink to={'/explore'} className={({ isActive }) => isActive ? 'selected' : ''}>Explore</NavLink></li>
            <li><NavLink to={'/requests'} className={({ isActive }) => isActive ? 'selected' : ''}>Requests</NavLink></li>
            <li><NavLink to={'/list-item'} className={({ isActive }) => isActive || pathname === '/request-item' ? 'selected' : ''}>List Item</NavLink></li>
        </ul>

        <div className="logo-wrapper">
            <img onClick={() => navigate('/')} src="https://i.ibb.co/4RKz3C5R/logo.png" alt="Error: Logo cannot be loaded." />
        </div>

        <div className='misc'>
            <i className="paper plane icon"></i>
            <i onClick={() => navigate('/profile')} className="user icon"></i>
        </div>
    </nav>
}

export default Navbar;