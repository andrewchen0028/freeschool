import ReactDOM from 'react-dom/client';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import Graph from './components/Graph';
import NodeForm from './components/NodeForm';
import NodeWindow from './components/NodeWindow';
import CreateAccount from './components/CreateAccount';

import "./index.css";

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Navigate to={"base"} />} />
      <Route path=":superNodeTitle" element={<Graph />}>
        <Route path=":focusNodeTitle" element={<NodeWindow />} />
        <Route path="createNode" element={<NodeForm />} />
        <Route path="createAccount" element={<CreateAccount />} />
      </Route>
    </Routes>
  </BrowserRouter>
);

export const url = "http://localhost:3001";