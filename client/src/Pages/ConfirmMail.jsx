import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApiContext, useAuthContext, useErrorContext } from "../Hooks/useContext";

const ConfirmMail = () => {
    const [dimmer, setDimmer] = useState(true)
    const [error, setError] = useState(false)
    const [loading, setLoading] = useState(false)

    const [data, setData] = useState({})

    const [code, setCode] = useState('')
    const [input, setInput] = useState('')

    const { openError } = useErrorContext()
    const { sendCode } = useApiContext()
    const { registerUserFull } = useAuthContext()

    const navigate = useNavigate()

    useEffect(() => {
        const data = JSON.parse(localStorage.getItem('data') || -1)
        localStorage.removeItem('data')
        setData(data)

        if (data === -1) {
            openError('Error!', 'There was a problem saving data. Please try again')
            navigate('/auth')
            return
        }

        const generatedCode = Math.floor(100 + Math.random() * 900).toString() + Math.floor(100 + Math.random() * 900).toString()
        setCode(generatedCode)


        setTimeout(() => {
            setDimmer(false)
            if (generatedCode === '') {
                openError('Error!', 'There was problem generating a code.', 'Idk why this is happening. your device is slow ig...')
                navigate('/auth')
                return
            }
            sendCode(data.email, generatedCode.slice(0, 3) + ' ' + generatedCode.slice(3))
        }, 1000)
    }, [])

    const submit = async (e) => {
        e.preventDefault()
        setError(false)
        setLoading(true)

        if (input.replace(' ', '') !== code) {
            setError(true)
            setLoading(false)
            return
        }

        console.log('correct!')
        await registerUserFull(data.id, data.name, data.email, data.phone, data.password, data.verified, data.picture).then(() => {
            setLoading(false)
            navigate('/profile')
        })
    } 

    return <div className="auth-container">

        <form onSubmit={submit} className={`ui form card ${error ? 'warning' : ''}`}>
            <p className="ui header" style={{textAlign: 'center'}}>To validate the email <br /> we have sent you a code on <br /> {data?.email || 'your email'}.</p>
            <div className="field">
                <label>Code<span title='required'>*</span></label>
                <input required type="text" placeholder="XXX XXX" value={input} onChange={e => setInput(e.target.value)} />
                <div className="meta">
                    The code might be sent to your junk mail.
                </div>
            </div>

            <div className="ui warning message">
                <div className="header">Could you check listed items!</div>
                <ul className="list">
                    <li>The code you've provided is incorrect!</li>
                </ul>
            </div>

            <div className="ui buttons">
                <button onClick={() => navigate('/auth')} className='ui button' type="button">Back</button>
                <button className={`ui button primary ${loading ? 'loading disabled' : ''}`} type="submit">Submit</button>
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

export default ConfirmMail;