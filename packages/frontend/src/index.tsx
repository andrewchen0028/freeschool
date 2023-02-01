import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import Graph from './components/Graph';
import NodeWindow from './components/NodeWindow';
import { InlinkList, OutlinkList, ResourceList } from './components/ItemList';

import "./index.css";
import NodeForm from './components/NodeForm';
import UserForm from './components/UserForm';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement);

root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Navigate to="/subgraph/-1/base" />} />
      <Route path="/subgraph/:superNodeId/:superNodeTitle" element={<Graph />}>
        <Route path="createNode" element={<NodeForm />} />
        <Route path="createAccount" element={<UserForm />} />
        <Route path="node/:nodeId/:nodeTitle" element={<NodeWindow />} />
      </Route>
    </Routes>
  </BrowserRouter>
);

export const url = "http://localhost:3001";