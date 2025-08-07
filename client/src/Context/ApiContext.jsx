import { createContext } from "react";
import { supabase } from "../Utils/supabaseClient";
import { useErrorContext } from "../Hooks/useContext";

const API_KEY = process.env.REACT_APP_IMAGEBB_API

const ApiContext = createContext()
const ApiProvider = ({ children }) => {
    const { openError } = useErrorContext()

    const uploadImage = async (base64Image) => {
        const formData = new FormData()
        formData.append("key", API_KEY)
        formData.append("image", base64Image)

        const res = await fetch("https://api.imgbb.com/1/upload", {
            method: 'POST',
            body: formData
        })

        const data = await res.json()
        return data.data.url
    }

    const uploadMultiple = async (fileList) => {
        const uploads = fileList.map(file => {
            return new Promise((resolve, reject) => {
                const reader = new FileReader()
                reader.onloadend = async () => {
                    try {
                        const url = await uploadImage(reader.result.split(',')[1])
                        resolve(url)
                    } catch (err) {
                        reject(err)
                    }
                }
                reader.readAsDataURL(file)
            })
        })

        const urls = await Promise.all(uploads)
        return urls
    }

    const uploadColumns = async (table, columns) => {
        const { data, error } = await supabase.from(table).insert(columns).select('*')
        if (error) {
            openError('Error while uploading', 'There was a problem during item upload. Please check inputs and try again', error.message)
            return -1
        }

        return data
    }

    const sendCode = async (email, code) => {
        fetch(`${process.env.REACT_APP_SERVER_URL}/send-mail`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                to: email,
                subject: 'Your KIU Drop code',
                html: `
                    <div>
                        <h1 style="
                            margin: 0; 
                            text-align: center; 
                            background-color: #f0f0f0; 
                            border-radius: 8px; 
                            padding: 10px 0;
                        ">${code}</h1>
                    </div>
                `,
            }),
        }).then(res => {
            if (!res.ok) openError('Problem sending the code!', 'Please make sure you entered email correctly.', 'Server error ' + res.status)
            // return res.json()
        }).catch((err) => {
            openError('Cannot send the code!', 'There\'s something wrong with the server.', err.message)
        })
        // .then(data => console.log(data))
    }

    const data = { uploadImage, uploadMultiple, uploadColumns, sendCode }
    return <ApiContext.Provider value={data}>
        {children}
    </ApiContext.Provider>
}

export { ApiProvider }
export default ApiContext;