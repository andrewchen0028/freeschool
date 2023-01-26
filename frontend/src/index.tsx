import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Graph } from './components/Graph';
import { NodeForm } from './components/NodeForm';

import "./index.css";

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Graph />}>
        <Route path="createNode" element={<NodeForm />} />
      </Route>
    </Routes>
  </BrowserRouter>
);

export const url = "http://localhost:3001";