import React, { useEffect, useState } from 'react'

const Manager = () => {
    const [form, setForm] = useState({ site: "", username: "", password: "" })
    const [passwordArray, setPasswordArray] = useState([]);
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

    // Simple UUID generator
    const generateId = () => {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    };

    // Helper to get or create a unique User ID
    const getUserId = () => {
        let id = localStorage.getItem("userId");
        if (!id) {
            id = generateId();
            localStorage.setItem("userId", id);
        }
        return id;
    };

    // Toast notification function
    const showToast = (message, type = 'success') => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
    };

    const getpasswords = async () => {
        try {
            let req = await fetch("https://passwordmanager-uzs5.onrender.com", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "user-id": getUserId()
                }
            })
            let passwords = await req.json();
            setPasswordArray(passwords)
        } catch (error) {
            showToast('Failed to load passwords', 'error');
        }
    }

    useEffect(() => {
        getpasswords();
    }, [])

    const savePassword = async () => {
        if (form.site.length > 3 && form.username.length > 3 && form.password.length > 3) {
            const newPassword = { ...form, id: generateId() };
            
            // Optimistic UI update
            setPasswordArray([...passwordArray, newPassword])

            try {
                await fetch("https://passwordmanager-uzs5.onrender.com", {
                    method: "POST",
                    headers: { 
                        "Content-Type": "application/json",
                        "user-id": getUserId()
                    },
                    body: JSON.stringify(newPassword)
                })
                setForm({ site: "", username: "", password: "" })
                showToast('Password saved successfully!');
            } catch (error) {
                showToast('Failed to save password', 'error');
            }
        } else {
            showToast('Please enter valid details (min 3 characters)', 'error');
        }
    }

    const deletePassword = async (id) => {
        setPasswordArray(passwordArray.filter(item => item.id !== id))
        try {
            await fetch("https://passwordmanager-uzs5.onrender.com", {
                method: "DELETE",
                headers: { 
                    "Content-Type": "application/json",
                    "user-id": getUserId() 
                },
                body: JSON.stringify({ id })
            })
            showToast('Password deleted successfully!');
        } catch (error) {
            showToast('Failed to delete password', 'error');
        }
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
        showToast('Copied to clipboard!');
    }

    return (
        <>
            {/* Toast Notification */}
            {toast.show && (
                <div className={`fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg text-white z-50 ${
                    toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'
                }`}>
                    {toast.message}
                </div>
            )}

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
                    <button onClick={savePassword} className='bg-green-600 hover:bg-green-700 w-fit flex justify-center items-center rounded-full px-4 py-2 text-white transition-colors'>
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
                                    <th className='py-2'>Site</th>
                                    <th className='py-2'>Username</th>
                                    <th className='py-2'>Password</th>
                                    <th className='py-2'>Actions</th>
                                </tr>
                            </thead>
                            <tbody className='bg-green-100'>
                                {Array.isArray(passwordArray) && passwordArray.map((item, index) => (
                                    <tr key={index} className='border-b border-white'>
                                        <td className='p-2 text-center'>
                                            <a href={item.site} target='_blank' rel="noreferrer" className='text-blue-600 hover:underline'>
                                                {item.site}
                                            </a>
                                        </td>
                                        <td className='p-2 text-center'>
                                            <span onClick={() => copyText(item.username)} className='cursor-pointer hover:text-green-700'>
                                                {item.username}
                                            </span>
                                        </td>
                                        <td className='p-2 text-center'>
                                            <span onClick={() => copyText(item.password)} className='cursor-pointer hover:text-green-700'>
                                                {"*".repeat(item.password.length)}
                                            </span>
                                        </td>
                                        <td className='p-2 text-center'>
                                            <button onClick={() => editPassword(item.id)} className="mr-2 text-blue-600 hover:text-blue-800">Edit</button>
                                            <button onClick={() => deletePassword(item.id)} className="text-red-600 hover:text-red-800">Delete</button>
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
