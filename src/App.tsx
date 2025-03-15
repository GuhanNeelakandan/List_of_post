import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import PostList from './Components/Post/PostList'

import './../node_modules/bootstrap/dist/css/bootstrap.min.css'

function App() {

  return (
    <>
      <PostList/>
    </>
  )
}

export default App
