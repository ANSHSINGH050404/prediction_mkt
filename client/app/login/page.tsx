'use client'
import UserContext from '@/context/UserContext'
import { API_BASE_URL } from '@/lib/api'
import { useRouter } from 'next/navigation'
import React, { useState ,useContext} from 'react'


const  LoginPage = () => {
    const navigate = useRouter();
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [name, setName] = useState('')
    const [loading, setLoading] = useState(false)

    const { setUser } = useContext(UserContext) as { setUser?: (user: {  name: string }) => void };

    

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        setLoading(true);
        e.preventDefault();
        // Handle login logic here
        try {
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password, name })
            });

            if (response.ok) {
                navigate.push('/');
            } else {
                throw new Error('Login failed');
            }
           
            setUser?.({  name });
        } catch (error) {
            console.error('Error logging in:', error);
        } finally {
            setLoading(false);
        }
    };

  return (
    <div>
        <h1>Login Page</h1>

        <input type="text" placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="text" placeholder='Name' value={name} onChange={(e) => setName(e.target.value)} />
        <input type="password" placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} />
        <button onClick={(e) => handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>)}>Login</button>
    </div>
  )
}

export default  LoginPage
