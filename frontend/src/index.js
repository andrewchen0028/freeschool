import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Graph from './components/Graph';
import NodeWindow from './components/NodeWindow';
import InlinkList from './components/InlinkList';
import ResourceList from './components/ResourceList';

import "./index.css";
import OutlinkList from './components/OutlinkList';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Graph />}>
        <Route path=":nodeId" element={<NodeWindow />}>
          <Route path="resources" element={<ResourceList />} />
          <Route path="inlinks" element={<InlinkList />} />
          <Route path="outlinks" element={<OutlinkList />} />
        </Route>
      </Route>
    </Routes>
  </BrowserRouter>
);

const url = "http://localhost:3001";
export default url;