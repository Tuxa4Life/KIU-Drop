import { useEffect, useState } from 'react';
import { useAuthContext } from '../Hooks/useContext'
import { useNavigate } from 'react-router-dom';
import '../Styles/auth.css'

const Auth = () => {
    const { signInWithGoogle } = useAuthContext()

    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [number, setNumber] = useState('')
    const [password, setPassword] = useState('')

    const [error, setError] = useState(false)
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const { loggedIn } = useAuthContext()
    useEffect(() => {
            if (loggedIn) navigate('/profile')
        }, [loggedIn])

    const submit = (e) => {
        e.preventDefault()
        if (loading) return
        setError(false)

        const emailRegex = /^[^@\s]+\.[^@\s]+@kiu\.edu\.ge$/
        const passwordRegex = /^[\w!@#$%^&*()_+\-=\]{};':"\\|,.<>?]{8,}$/
        const mobileRegex = /^(5\d{8})?$/

        if (!(emailRegex.test(email) && passwordRegex.test(password) && mobileRegex.test(number))) {
            setError(true)
            return
        }

        setLoading(true)
        const data = {
            id: undefined,
            picture: undefined,
            name: username,
            password: password,
            email: email,
            phone: number || null,
            verified: false
        }

        localStorage.setItem('data', JSON.stringify(data))
        navigate('/auth/confirm-mail')

        // registerUser(username, email, number || null, password).then((data) => {
        //     setLoading(false)
        //     if (data !== -1) {
        //        
        //     }
        // })
    }

    return <div className="auth-container">
        <h1 className="ui header">Welcome to KIU Drop!</h1>

        <form onSubmit={submit} className={`ui form card ${error ? 'warning' : ''}`}>
            <div className="field">
                <label>Username <span title='required'>*</span></label>
                <input required value={username} onChange={e => setUsername(e.target.value)} type="text" placeholder="Username" />
            </div>
            <div className="field">
                <label>University email <span title='required'>*</span></label>
                <input required value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="University email" />
            </div>
            <div className="field">
                <label>Phone number</label>
                <input value={number} onChange={e => setNumber(e.target.value.replace(/\D/g, ''))} type="text" placeholder="Phone number (optional)" />
            </div>
            <div className="field">
                <label>Password <span title='required'>*</span></label>
                <input required value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="Password" />
                <div className="meta">Passwords are being hashed for privacy.</div>
            </div>

            <div className="ui warning message">
                <div className="header">Could you check listed items!</div>
                <ul className="list">
                    <li>The KIU email or phone number must be valid.</li>
                    <li>Password must include at least 8 symbols.</li>
                </ul>
            </div>

            <button className={`ui button primary ${loading ? 'loading disabled' : ''}`} type="submit">Register</button>
            <div className="ui horizontal divider">Or</div>
            <button onClick={() => navigate('/login')} className={`ui button primary inverted ${loading ? 'disabled' : ''}`} type="button">Login</button>
            <button type='button' className='ui button secondary inverted' style={{ marginTop: '10px' }} onClick={signInWithGoogle}>Sign in with Google</button>
        </form>
    </div>
}

export default Auth;