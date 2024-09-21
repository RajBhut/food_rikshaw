import {Routes , Route ,BrowserRouter} from 'react-router-dom'
import React from 'react'
import Home from './Home'
import Login from './Login'
import About from './About'
import Layout from './Layout'
export default function Routs() {
  return (
   <>
   <BrowserRouter>
  <Routes>
    <Route path='/login' element = {<Login/>}/>
<Route path='/' element={
 
<Layout>

  <Home/>
</Layout>


  }/>
<Route path='/about' element ={<About/>}/>
 
  </Routes>
   </BrowserRouter>
   </>
  )
}
