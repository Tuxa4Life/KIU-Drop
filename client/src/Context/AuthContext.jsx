import { createContext, useEffect, useState } from "react";
import { supabase } from "../Utils/supabaseClient";
import { useNavigate } from "react-router-dom";
import { useErrorContext } from "../Hooks/useContext";

const AuthContext = createContext()
const AuthProvider = ({ children }) => {
    const navigate = useNavigate()
    const { openError } = useErrorContext()

    const [user, setUser] = useState({})
    const [loggedIn, setLoggedIn] = useState(false)

    useEffect(() => {
        const id = localStorage.getItem('uid')
        if (id) {
            getLocalUser(id)
        }
    }, [])

    const getLocalUser = async (id) => {
        const { data, error } = await supabase
            .from('users')
            .select('id, name, email, phone, verified, picture')
            .eq('id', id)

        if (error) {
            openError('Error!', `Couldn't fetch user with id: ${id}`, error.message)
            return
        }

        if (data && data[0]) {
            setUser(data[0])
            setLoggedIn(true)
        }
    }

    const loginUser = async (email, password) => {
        const { data: userExists, error: emailError } = await supabase
            .from('users')
            .select('id, name, email, phone, verified, password, picture')
            .eq('email', email)

        if (emailError || userExists.length === 0) {
            openError('User is not registered', 'User with this email is not registered on the website. \nPlease register first.', emailError?.message || '')
            return
        }

        const user = userExists[0] || {}
        if (user.password !== password) {
            return -1
        }

        setUser({
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            verified: user.verified,
            picture: user.picture
        })
        setLoggedIn(true)
        localStorage.setItem('uid', user.id)
        navigate('/')
    }

    const logOut = async () => {
        await supabase.auth.signOut()
        setLoggedIn(false)
        localStorage.removeItem('uid')
        setUser({})
        navigate('/')
    }

    const registerUser = async (name, email, phone, password) => {
        const { data, error } = await supabase
            .from('users')
            .insert([{ name, email, phone, password, verified: false }])
            .select()

        if (error) {
            openError(
                'Error with registering.',
                'User with this email is already registered. \nTry logging in.',
                error.message
            )
            return -1
        }

        setUser(data[0])
        setLoggedIn(true)
        localStorage.setItem('uid', data[0].id)
    }

    const registerUserFull = async (id, name, email, phone, password, verified, picture) => {
        const { data, error } = await supabase.from('users').insert([{ id, name, email, phone, password, verified, picture }]).select()

        if (error) {
            openError(
                'Error with registering.',
                'User with this email is already registered. \nTry logging in.',
                error.message
            )
            return -1
        }

        setUser(data[0])
        setLoggedIn(true)
        localStorage.setItem('uid', data[0].id)
    }

    const getUser = async (id) => {
        const { error, data } = await supabase
            .from('users')
            .select('id, name, email, verified, phone, picture')
            .eq('id', id)

        if (error) {
            openError('Error!', `Couldn't fetch user with id: ${id}`, error.message)
            return
        }

        return data
    }

    const updatePicture = async (url) => {
        const { data, error } = await supabase.from('users').update({ picture: url }).eq('id', user.id)

        if (error) {
            openError('Error uploading!', `Could not update profile picture.`, error.message)
            return
        }

        return data
    }

    const signInWithGoogle = async () => {
        await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/auth/provider`
            }
        })
    }

    const getSession = async () => {
        const { data: { session }, error } = await supabase.auth.getSession()
        if (error) {
            openError('Problem Signing in!', 'Cannot sign in with Google account.', error.message)
            return
        }

        const response = await supabase.from('users').select('*').eq('id', session.user.id)
        if (response.data.length !== 0) {
            loginUser(response.data[0].email, response.data[0].password)
            return
        }

        const { avatar_url, full_name, email } = session.user.user_metadata
        const data = {
            id: session.user.id,
            picture: avatar_url,
            name: full_name,
            email: email,
            phone: null,
            verified: false
        }

        return data
    }

    const data = { user, loggedIn, registerUser, registerUserFull, loginUser, logOut, getUser, updatePicture, signInWithGoogle, getSession }

    return <AuthContext.Provider value={data}>{children}</AuthContext.Provider>
}


export { AuthProvider }
export default AuthContext;