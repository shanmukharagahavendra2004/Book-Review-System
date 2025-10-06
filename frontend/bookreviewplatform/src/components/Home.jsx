import React from 'react'
import {Link} from 'react-router-dom';
const Home = () => {
  return (
    <div>
        <div className="bg-violet-500 text-white text-center  flex justify-between">
            <div>
            <h1 className="text-4xl font-thin p-2 ml-10">Book Review Platform</h1> 
            </div>
            <div className="p-2 flex items-center mr-10">
                <Link to='/signin'><button className="text-white text-xl font-thin bg-black border-2 border-white p-2">Signin</button></Link>
                 <Link to='/login'><button className="text-white text-xl font-thin bg-black border-2 border-white p-2 ml-2">Login</button></Link>
            </div>
        </div>
    </div>
  )
}

export default Home