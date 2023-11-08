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
    path: "/tensor-ts",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
    {
      path: "/tensor-ts/", index: true, element: <HomePage/>
    },
    {
      path: "/tensor-ts/live/",element: <LiveGrad />
    },
    {
      path: "/tensor-ts/mnist/",element: <Mnist />
    }
  ]
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
