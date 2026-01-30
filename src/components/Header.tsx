import { NavLink } from 'react-router-dom'

function Header() {
  return (
    <>
      <nav className='flex justify-between mx-16 mt-4 mb-8 bg-accent'>
        <div className='flex gap-10 items-center'>
          <p className='text-xl font-bold'>MyTrader</p>
          <img className='w-16 h-16' src="https://i.ibb.co/5hfDkcJx/fixmytown.jpg" alt="" />
        </div>
        <div className='flex gap-1.5'>
          <NavLink to='/login' className='text-lg px-6 py-2 duration-200 hover:bg-blue-100 rounded-full flex items-center'>
            Login
          </NavLink>
          <NavLink to='/market' className='text-lg px-6 py-2 duration-200 hover:bg-blue-100 rounded-full flex items-center'>
            Market
          </NavLink>
          <NavLink to='/watchlists' className='text-lg px-6 py-2 duration-200 hover:bg-blue-100 rounded-full flex items-center'>
            Watchlists
          </NavLink>
          <NavLink to='/profile' className='text-lg px-6 py-2 duration-200 hover:bg-blue-100 rounded-full flex items-center'>
            Profile
          </NavLink>
        </div>
      </nav>
    </>
  )
}

export default Header