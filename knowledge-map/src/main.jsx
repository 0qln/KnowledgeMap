import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import './index.css';
import Root, { loader as rootLoader } from './routes/root.jsx';
import NodeView, { loader as nodeLoader } from './routes/nodes/view.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    loader: rootLoader,
    children: [
      {
        path: "/nodes/:id",
        element: <NodeView />,
        loader: nodeLoader,
      }
    ]
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
