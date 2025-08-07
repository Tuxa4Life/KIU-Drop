import { useEffect, useState } from "react"
import { useAuthContext } from "../Hooks/useContext"
import { useNavigate } from "react-router-dom"

const ProviderStep = () => {
    const { getSession } = useAuthContext()
    const [data, setData] = useState({})
    const [kiuEmail, setKiuEmail] = useState('')
    const [error, setError] = useState(false)

    const [dimmer, setDimmer] = useState(true)
    const [loading, setLoading] = useState(false)

    const navigate = useNavigate()

    useEffect(() => {
        const aux = async () => {
            const response = await getSession()
            setData(response)
        }

        aux()
        setDimmer(false)
    }, [])

    const submit = async (e) => {
        e.preventDefault()
        setError(false)
        setLoading(true)

        const emailRegex = /^[^@\s]+\.[^@\s]+@kiu\.edu\.ge$/
        if (!emailRegex.test(kiuEmail)) {
            setError(true)
            setLoading(false)
            return
        }

        const output = { ...data, email: kiuEmail, password: 'FROMPROVIDER' }
        // await registerUserFull(output.id, output.name, output.email, output.phone, 'FROMPROVIDER', output.verified, output.picture)
        localStorage.setItem('data', JSON.stringify(output))
        setLoading(false)
        navigate('/auth/confirm-mail')
    }

    return <div className="auth-container">
        <h1 className="ui header">To continue, enter you KIU email.</h1>

        <form onSubmit={submit} className={`ui form card ${error ? 'warning' : ''}`}>
            <div className="field">
                <label>KIU Email <span title='required'>*</span></label>
                <input required type="email" placeholder="example@kiu.edu.ge" value={kiuEmail} onChange={e => setKiuEmail(e.target.value)} />
            </div>

            <div className="ui warning message">
                <div className="header">Could you check listed items!</div>
                <ul className="list">
                    <li>Email that you provide must be vaild.</li>
                </ul>
            </div>

            <div className="ui buttons">
                <button onClick={() => navigate('/auth')} className='ui button' type="button">Back</button>
                <button className={`ui button primary ${loading ? 'loading disabled' : ''}`} type="submit">Continue</button>
            </div>
        </form>

        {
            dimmer && <div className="ui segment" style={{ position: 'fixed', top: '0', left: '0', width: '100%', height: '100dvh' }}>
                <div className="ui active inverted dimmer">
                    <div className="ui text loader">Loading</div>
                </div>
                <p></p>
            </div>
        }

    </div>
}

export default ProviderStep