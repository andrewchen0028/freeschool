import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Graph from './components/Graph';
import NodeWindow from './components/NodeWindow';

import { InlinkList, OutlinkList, ResourceList } from './components/ItemList';

import "./index.css";
import NodeForm from './components/NodeForm';
import CreateAccount from './components/CreateAccount';
import LogIn from './components/LogIn';

import { UserContext, UserContextProvider } from './components/UserContext';
import { GraphContextProvider } from './components/GraphContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <UserContextProvider>
    <GraphContextProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Graph />}>
            <Route path="createNode" element={<NodeForm />} />
            <Route path="createAccount" element={<CreateAccount />} />
            <Route path="logIn" element={<LogIn />} />
            <Route path=":nodeId/:nodeTitle" element={<Graph />}>
              <Route path="node" element={<NodeWindow />}>
                <Route path="resources" element={<ResourceList />} />
                <Route path="inlinks" element={<InlinkList />} />
                <Route path="outlinks" element={<OutlinkList />} />
              </Route>
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </GraphContextProvider>
  </UserContextProvider>
);

const url = "http://localhost:3001";
export default url;