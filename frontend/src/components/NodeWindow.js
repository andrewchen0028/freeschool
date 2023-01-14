import axios from "axios";
import { useEffect, useState } from "react";
import { Outlet, useNavigate, useOutletContext, useParams } from "react-router-dom";
import url from "..";

function NodeWindowSideBar() {
  const navigate = useNavigate();

  return (<div className="bg-neutral-800 bg-opacity-80 flex-grow"
    onClick={() => { navigate(`/`); }} />);
}


function NodeWindowHeader() {
  const { nodeId } = useParams();
  const [nodeMetadata, setNodeMetadata] = useState();

  function vote(type) {
    axios.post(`${url}/${nodeId}/vote/${type}`).then(reload);
  }

  function reload() {
    axios.get(`${url}/${nodeId}`).then((response) => {
      setNodeMetadata(response.data);
    });
  }

  useEffect(reload, [nodeId]);

  return (!nodeMetadata ? <div /> :
    <div className="flex items-center gap-2 text-xl">
      {/* VOTE BUTTONS */}
      <div className="p-2 flex flex-col items-center">
        <button className="upvote" onClick={() => { vote("upvote") }}>+</button>
        <h2>{nodeMetadata.score}</h2>
        <button className="downvote" onClick={() => { vote("downvote") }}>—</button>
      </div>

      {/* TITLE */}
      <h2>{nodeMetadata.nodeId.replace("-", " ")}</h2>

    </div >
  );
}


// Note that <ItemListSelectors /> doesn't currently know about "params.nodeId"
// like <NodeWindowHeader /> does. Therefore, <ItemListSelectors /> won't reset
// to "resources" upon jumping to another node through "inlinks/outlinks".
// 
// TODO-low: Currently, if the user opens a NodeWindow and manually types a URL
// extension (e.g. "inlinks"), the NodeWindow/ItemListSelector auto-redirects
// to "resources". Make it not do this.
function ItemListSelectors() {
  const [itemType, setItemType] = useState("resources");

  const navigate = useNavigate();

  useEffect(() => { navigate(itemType); }, [itemType, navigate]);

  return (
    <div className="card flex gap-2">
      {/* TODO-low: implement sorted ItemLists */}
      <div>
        <label htmlFor="sortmode">Sort: </label>
        <select name="sortmode" id="sortmode">
          <option defaultChecked value="best">Best</option>
          <option value="top">Top</option>
          <option value="new">New</option>
        </select>
      </div>

      <div>
        <label htmlFor="itemtype">View: </label>
        <select name="itemtype" id="itemtype"
          onChange={(event) => { setItemType(`${event.target.value}`); }}>
          <option value="resources">Resources</option>
          <option value="inlinks">Inlinks</option>
          <option value="outlinks">Outlinks</option>
        </select>
      </div>
    </div>
  )
}

// TODO-bugfix: Display 404 if node not found. Currently NodeWindow gives zero
//              warning of this situation, and interacting with the buttons on
//              the page will silent-crash the backend.
export default function NodeWindow() {
  const [, addLink] = useOutletContext();

  return (
    <div className="absolute top-0 left-0 h-screen w-screen z-10 flex">
      <NodeWindowSideBar />
      <div className="w-3/5 bg-white overflow-y-scroll">
        <NodeWindowHeader />
        <ItemListSelectors />
        <Outlet context={[addLink]} />
      </div>
      <NodeWindowSideBar />

    </div>
  );
}