import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import ErrorPage from "./error-page";
import { LiveGrad } from './components/live/liveGrad.tsx';
import Mnist from './components/mnist/mnist.tsx';
import HomePage from './Home.tsx';

const router = createBrowserRouter([
  {
    path: "/scratchy-grad",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
    {
      path: "/scratchy-grad/", index: true, element: <HomePage/>
    },
    {
      path: "/scratchy-grad/live/",element: <LiveGrad />
    },
    {
      path: "/scratchy-grad/mnist/",element: <Mnist />
    }
  ]
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
