import React, { useEffect } from 'react'
import { useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import {v4 as uuidv4} from 'uuid';

const Manager = () =>{
    var[form,setForm]=useState({site:"",username:"",password:""})
        var [passwordArray,setPasswordArray]=useState([]);
        const getpasswords=async()=>{
          let req=await fetch("https://passwordmanager-uzs5.onrender.com")
         
          let passwords=await req.json();
          
           
            setPasswordArray((passwords))}


        
    useEffect(()=>{
        
        getpasswords();
        
       
        }
       
        ,[])

    const savePassword=async()=>{
        console.log(form)
        if(form.site.length>3 && form.username.length>3 && form.site.length>3){
          // 
        await fetch("https://passwordmanager-uzs5.onrender.com",{method:"DELETE",headers:{"Content-Type":"application/json"},body:JSON.stringify({id:form.id})})
       setPasswordArray([...passwordArray,{...form,id:uuidv4()}])
       await fetch("https://passwordmanager-uzs5.onrender.com",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({...form,id:uuidv4()})})
        //console.log(passwordArray)
        //localStorage.setItem("passwords",JSON.stringify([...passwordArray,{...form,id:uuidv4()}]))
        setForm({site:"",username:"",password:""})}
        else{
          {alert("Please enter valid password")}
        }

    }
     const deletePassword=async(id)=>{

        setPasswordArray(passwordArray.filter(item=>item.id!==id))
        //localStorage.setItem("passwords",JSON.stringify(passwordArray.filter(item=>item.id!==id)))
        let res=await fetch("https://passwordmanager-uzs5.onrender.com",{method:"DELETE",headers:{"Content-Type":"application/json"},body:JSON.stringify({...form,id})})
       
         
    }
    const editPassword=(id)=>{
      setForm({...passwordArray.filter(i=>i.id==id)[0],id:id})
      setPasswordArray(passwordArray.filter(item=>item.id!==id))


    }
    const handleChange=(e)=>{
        setForm({...form,[e.target.name]:e.target.value})
    }
   const copyText=(text)=>{
    navigator.clipboard.writeText(text)
    toast('Copied to Clipboard', {
position: "top-right",
autoClose: 5000,
hideProgressBar: false,
closeOnClick: false,
pauseOnHover: true,
draggable: true,
progress: undefined,
theme: "light",

});
   }
    
  return (<>
    <ToastContainer
position="top-right"
autoClose={5000}
hideProgressBar={false}
newestOnTop={false}
closeOnClick={false}
rtl={false}
pauseOnFocusLoss
draggable
pauseOnHover
theme="light"
transition="Bounce"
/><ToastContainer/>
    <div>
    <div>
      <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"><div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-fuchsia-400 opacity-20 blur-[100px]"></div></div>
    </div>
    <div className="pd-2 md:p-0 md:container md:mx-auto min-h-[89vh">
        <h1 className='text-4xl text font-bold text-center'><span className="text-green-700">&lt;</span>PassOP <span className="text-green-700">/&gt;</span></h1>
        <p className='text-green-700 text-lg text-center'>Your own password manager</p>
    <div className="text-white  flex flex-col p-4 gap-3 items-center ">
        <input value={form.site}onChange={handleChange} placeholder='Enter website URL' name="site" className='rounded-full border border-green-500 w-full py-1 px-4 text-black' type="text" id="site" />
         <div className="flex w-full gap-2 text-black">
            <input value={form.username} onChange={handleChange} placeholder='Enter username' name="username" className='rounded-full border border-green-500 w-full py-1 px-4' type="text" id="username" />
             <div className="relative">
            <input value={form.password} onChange={handleChange} placeholder='Enter password' name="password" className='rounded-full border border-green-500 w-full py-1 px-4' type="password" id="password" /><span className='absolute right-0'>show</span></div>
        </div>
    
        <button onClick={savePassword} className='bg-green-600 w-fit flex justify-center items-center rounded-full px-2 py-2 '><lord-icon
    src="https://cdn.lordicon.com/efxgwrkc.json"
    trigger="hover"
    >
</lord-icon>Add Password</button>
    </div>
    <div className="passwords">
        <h2 className='font-bold'>Your Passwords</h2>
        {passwordArray.length===0 && <div>No passwords to show</div>}
        {passwordArray.length!=0 &&
        <table className="table-auto w-full rounded-xl overflow-hidden">
  <thead className='bg-green-800 text-white'>
    <tr>
      <th>Site</th>
      <th>Username</th>
      <th>Password</th>
      <th>Actions</th>
    </tr>
  </thead>
  <tbody className='bg-green-100 border'>
    {passwordArray.map((item,index)=>{
  
   return( <tr className='border-1 ' key={index}>
      <td className='text-center w-32 break-all'><div className='flex gap:6 py-3' ><img className=' ' src="/icons/content_copy.png" alt="" onClick={()=>{copyText(item.site)}} /><a  href={item.site} target='_blank'>{item.site} </a></div></ td>
      <td className='text-center w-32 break-all'><div className='flex gap:1'><img  src="/icons/content_copy.png" alt="" onClick={()=>{copyText(item.username)}} />{item.username}</div> </td >
      <td className='text-center w-32 brak-all'><div className='flex gap:1'><img  src="/icons/content_copy.png" alt="" onClick={()=>{copyText(item.password)}} />{"*".repeat(item.password.length)}</div></td >
      <td className='text-center w-32 break-all '><div className='flex gap:1'><img className=' w-5' src="/icons/deleteicon.png" alt="" onClick={()=>{deletePassword(item.id)}}/>&nbsp;<img className='w-5' src="/icons/editicon.png" alt="" onClick={()=>{editPassword(item.id)}}/></div></td >
    </tr>)})}
   
  </tbody>
</table>}</div>
    </div>
</div>
 </> )
}

export default Manager

