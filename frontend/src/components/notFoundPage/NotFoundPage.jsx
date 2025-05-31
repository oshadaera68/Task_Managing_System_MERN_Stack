import React from 'react'
import notfound from '../../assets/404.webp'
import './NotFoundPage.css'
function NotFoundPage() {
  return (
    <div>
        <div className="flex items-center justify-center left-72 top-72 right-72">
            <img src={notfound} alt="not found" className='w-80 h-80'/>
        </div>

        <div className='flex items-center justify-center'>
            <h1 className='text-2xl font-bold'>Page Not Found</h1>
        </div>
    </div>
  )
}
export default NotFoundPage


