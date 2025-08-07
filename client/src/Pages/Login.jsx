import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuthContext } from "../Hooks/useContext"

const Login = () => {
    const { loginUser, loggedIn, signInWithGoogle } = useAuthContext()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const [error, setError] = useState(false)
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const submit = (e) => {
        e.preventDefault()

        setLoading(true)
        loginUser(email, password).then((error) => {
            if (error === -1) setError(true)
            setLoading(false)
        })
    }

    useEffect(() => {
        if (loggedIn) navigate('/profile')
    }, [loggedIn])

    return <div className="auth-container">
        <h1 className="ui header">Welcome to KIU Drop!</h1>

        <form onSubmit={submit} className={`ui form card ${error ? 'warning' : ''}`}>
            <div className="field">
                <label>Email or phone number <span title='required'>*</span></label>
                <input required value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="University email or phone number" />
            </div>
            <div className="field">
                <label>Password <span title='required'>*</span></label>
                <input required value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="Password" />
            </div>

            <div className="ui warning message">
                <div className="header">Could you check listed items!</div>
                <ul className="list">
                    <li>Incorrect password.</li>
                </ul>
            </div>

            <button className={`ui button primary ${loading ? 'loading disabled' : ''}`} type="submit">Login</button>
            <div className="ui horizontal divider">Or</div>
            <button onClick={() => navigate('/auth')} className={`ui button primary inverted ${loading ? 'disabled' : ''}`} type="button">Register</button>
        
            <button type="button" className='ui button secondary inverted' style={{marginTop: '10px'}} onClick={signInWithGoogle}>Sign in with Google</button>
        </form>
    </div>
}

export default Login;