import React, { useEffect, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import { v4 as uuidv4 } from 'uuid';

const Manager = () => {
    const [form, setForm] = useState({ site: "", username: "", password: "" })
    const [passwordArray, setPasswordArray] = useState([]);

    // --- NEW: Helper to get or create a unique User ID ---
    const getUserId = () => {
        let id = localStorage.getItem("userId");
        if (!id) {
            id = uuidv4();
            localStorage.setItem("userId", id);
        }
        return id;
    };

    const getpasswords = async () => {
        let req = await fetch("https://passwordmanager-uzs5.onrender.com", {method:"GET",
            headers: {"Content-Type":"application/json", "user-id": getUserId() } // Send ID in header
        })
        let passwords = await req.json();
        setPasswordArray(passwords)
    }

    useEffect(() => {
        getpasswords();
    }, [])

    const savePassword = async () => {
        if (form.site.length > 3 && form.username.length > 3 && form.password.length > 3) {
            const newPassword = { ...form, id: uuidv4() };
            
            // Optimistic UI update
            setPasswordArray([...passwordArray, newPassword])

            await fetch("https://passwordmanager-uzs5.onrender.com", {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "user-id": getUserId() // Identification
                },
                body: JSON.stringify(newPassword)
            })
            setForm({ site: "", username: "", password: "" })
        } else {
            alert("Please enter valid details")
        }
    }

    const deletePassword = async (id) => {
        setPasswordArray(passwordArray.filter(item => item.id !== id))
        await fetch("https://passwordmanager-uzs5.onrender.com", {
            method: "DELETE",
            headers: { 
                "Content-Type": "application/json",
                "user-id": getUserId() 
            },
            body: JSON.stringify({ id })
        })
    }

    const editPassword = (id) => {
        setForm({ ...passwordArray.filter(i => i.id === id)[0], id: id })
        setPasswordArray(passwordArray.filter(item => item.id !== id))
    }

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const copyText = (text) => {
        navigator.clipboard.writeText(text)
        toast.success('Copied to Clipboard');
    }

    return (
        <>
            <ToastContainer />
            <div className="md:container md:mx-auto min-h-[89vh] p-4">
                <h1 className='text-4xl font-bold text-center'>
                    <span className="text-green-700">&lt;</span>PassOP <span className="text-green-700">/&gt;</span>
                </h1>
                <p className='text-green-700 text-lg text-center'>Your own password manager</p>
                
                <div className="flex flex-col p-4 gap-3 items-center">
                    <input value={form.site} onChange={handleChange} placeholder='Enter website URL' name="site" className='rounded-full border border-green-500 w-full py-1 px-4 text-black' type="text" />
                    <div className="flex w-full gap-2 text-black">
                        <input value={form.username} onChange={handleChange} placeholder='Enter username' name="username" className='rounded-full border border-green-500 w-full py-1 px-4' type="text" />
                        <input value={form.password} onChange={handleChange} placeholder='Enter password' name="password" className='rounded-full border border-green-500 w-full py-1 px-4' type="password" />
                    </div>
                    <button onClick={savePassword} className='bg-green-600 w-fit flex justify-center items-center rounded-full px-4 py-2 text-white'>
                        Add Password
                    </button>
                </div>

                <div className="passwords mt-8">
                    <h2 className='font-bold text-2xl mb-4'>Your Passwords</h2>
                    {passwordArray.length === 0 ? (
                        <div>No passwords to show</div>
                    ) : (
                        <table className="table-auto w-full rounded-xl overflow-hidden">
                            <thead className='bg-green-800 text-white'>
                                <tr>
                                    <th>Site</th>
                                    <th>Username</th>
                                    <th>Password</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody className='bg-green-100'>
                                {Array.isArray(passwordArray) && passwordArray.map((item, index) => (
                                    <tr key={index} className='border-b border-white'>
                                        <td className='p-2 text-center'><a href={item.site} target='_blank' rel="noreferrer">{item.site}</a></td>
                                        <td className='p-2 text-center'>{item.username}</td>
                                        <td className='p-2 text-center'>{"*".repeat(item.password.length)}</td>
                                        <td className='p-2 text-center'>
                                            <button onClick={() => editPassword(item.id)} className="mr-2 text-blue-600">Edit</button>
                                            <button onClick={() => deletePassword(item.id)} className="text-red-600">Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </>
    )
}

export default Manager


