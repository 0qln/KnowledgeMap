import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import './index.css';
import Root from './routes/root/component.jsx';
import { loader as rootLoader } from './routes/root/loader.jsx';
import NodeView from './routes/nodes/view/component.jsx';
import { loader as nodeLoader } from './routes/nodes/view/loader.jsx';

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
