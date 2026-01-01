import React from 'react'

const Navbar = () => {
  return (
    <nav className='bg-slate-800 text-white'>
        <div className="mycontainer flex justify-between items-center h-14 px-4 py-5">
        <div className="logo font-bold text-2xl"><span className="text-green-700">&lt;</span>PassOP <span className="text-green-700">/&gt;</span></div>
       {/* <ul>
            <li className='flex gap-4'>
                <a className='hover:font-bold' href="/">Home</a>
                <a className='hover:font-bold' href="#">About</a>
                <a className='hover:font-bold' href="#">Contact</a>

            </li>
        </ul>*/}
        <button className='text-white bg-green-500 rounded-md my-5 flex gap-4 justify-center items-center'><img className='invert w-10 p-1' src="/icons/github.svg" alt="github logo" /><span className='font-bold px-1'>Github</span></button>
        </div>


      
    </nav>
  )
}

export default Navbar
