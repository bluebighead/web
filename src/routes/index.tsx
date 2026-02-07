import { createBrowserRouter } from 'react-router-dom'
import App from '../App'
import Home from '../pages/Home'
import FileManager from '../pages/FileManager'
import Categories from '../pages/Categories'
import About from '../pages/About'
import NotFound from '../pages/NotFound'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <Home />,
        index: true,
      },
      {
        path: '/files',
        element: <FileManager />,
      },
      {
        path: '/categories',
        element: <Categories />,
      },
      {
        path: '/about',
        element: <About />,
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
])

export default router