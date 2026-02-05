import { NavLink } from 'react-router-dom'

function Header() {
  return (
    <>
      <nav className='flex justify-between items-center px-8 py-4 bg-slate-900 text-white shadow-md mb-4 mt-3'>
  <div className='flex items-center gap-3 hover:opacity-90 cursor-pointer transition-opacity'>
    <img 
      className='w-24 h-18 rounded-lg border border-slate-700 object-cover ml-10' 
      src="./logo.png" 
      alt="Logo" 
    />
  </div>
  <div className='flex items-center gap-2'>
    <NavLink to='/login' className='text-xl font-medium px-4 py-2 duration-200 hover:bg-slate-800 rounded-md transition-colors'>
      Login
    </NavLink>
    <NavLink to='/market' className='text-xl font-medium px-4 py-2 duration-200 hover:bg-slate-800 rounded-md transition-colors'>
      Market
    </NavLink>
    <NavLink to='/watchlists' className='text-xl font-medium px-4 py-2 duration-200 hover:bg-slate-800 rounded-md transition-colors'>
      Watchlists
    </NavLink>
    <NavLink to='/profile' className='bg-blue-600 hover:bg-blue-500 text-white text-xl font-semibold px-5 py-2 rounded-full transition-all shadow-lg shadow-blue-900/20 ml-2'>
      Profile
    </NavLink>
  </div>
</nav>
    </>
  )
}

export default Header