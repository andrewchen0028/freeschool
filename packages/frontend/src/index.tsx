import ReactDOM from 'react-dom/client';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import Graph from './components/Graph';
import NodeWindow from './components/NodeWindow';

import "./index.css";

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Navigate to={"base"} />} />
      <Route path=":superNodeTitle" element={<Graph />}>
        <Route path=":focusNodeTitle" element={<NodeWindow />} />
      </Route>
    </Routes>
  </BrowserRouter>
);

export const url = "http://localhost:3001";