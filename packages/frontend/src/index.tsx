import ReactDOM from 'react-dom/client';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Graph from './components/Graph';
import { InlinkList, OutlinkList, ResourceList } from './components/ItemList';
import NodeWindow from './components/NodeWindow';

import "./index.css";

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement);

// E.g.
//  - Start from subgraph "Calculus 1" (freeschool.com/Calculus-1)
//  - Left-click "Limits": it tries to navigate to (freeschool.com/Limits/resources)
// => It should navigate to (freeschool.com/Calculus-1/Limits/resources)
// => Equivalently for base (freeschool.com/base/Calculus-1/resources)

root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Navigate to={"base"} />} />
      <Route path=":superNodeTitle" element={<Graph />}>
        <Route path=":focusNodeTitle" element={<NodeWindow />}>
          {/* <Route path="resources" element={<ResourceList />} />
          <Route path="inlinks" element={<InlinkList />} />
          <Route path="outlinks" element={<OutlinkList />} /> */}
        </Route>
      </Route>
    </Routes>
  </BrowserRouter>
);

export const url = "http://localhost:3001";