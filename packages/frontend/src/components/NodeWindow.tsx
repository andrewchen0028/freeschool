import axios from "axios";
import { useEffect, useState, useContext } from 'react';
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { InlinkList, OutlinkList, ResourceList } from "./ItemList";
import { url } from "..";

import { UserContext } from "./UserContext";
import { Node } from "@prisma/client";
import { addLinkFunction } from "./Graph";

function NodeWindowSideBar() {
  const navigate = useNavigate();

  return (<div className="bg-neutral-800 bg-opacity-80 flex-grow"
    onClick={() => { navigate(`..`); }} />);
}


function NodeWindowHeader({ focusNodeTitle }: { focusNodeTitle: string }) {
  const [nodeMetadata, setNodeMetadata] = useState<Node | undefined>();
  const [nodeUpvoted, setNodeUpvoted] = useState<boolean>(true);
  const { userContext } = useContext(UserContext);

  function vote() {
    axios.post(`${url}/${focusNodeTitle}/upvote`).then(reload);
  }

  function reload() {
    axios.get(`${url}/${focusNodeTitle}/node/${userContext.nodePubkey}`).then((response) => {
      setNodeMetadata(response.data);
    });
  }

  useEffect(reload, [focusNodeTitle]);

  return (nodeMetadata ?
    <div className="flex items-center gap-2 text-xl pt-4">
      {/* VOTE BUTTONS */}
      <div className="p-2 flex flex-row items-center">
        <h2>{nodeMetadata.score}</h2>
        <button className="upvote" onClick={() => { vote() }}>+</button>
      </div>

      {/* TITLE */}
      <h2>{nodeMetadata.title}</h2>

    </div > : <div />
  );
}


// Note that <ItemListSelectors /> doesn't currently know about "params.nodeId"
// like <NodeWindowHeader /> does. Therefore, <ItemListSelectors /> won't reset
// to "resources" upon jumping to another node through "inlinks/outlinks".
function ItemListSelectors({ setItemType }: {
  setItemType: React.Dispatch<React.SetStateAction<string>>
}) {
  return (
    <div className="card flex gap-2">
      {/* TODO-low: implement sorted ItemLists */}
      <div>
        <label htmlFor="sortmode">Sort by: </label>
        <select className="pr-1" name="sortmode" id="sortmode">
          <option defaultChecked value="best">Best</option>
          <option value="top">Top</option>
          <option value="new">New</option>
        </select>
      </div>

      <div>
        <label htmlFor="itemtype">View: </label>
        <select className="pr-1" name="itemtype" id="itemtype"
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
  const [itemType, setItemType] = useState("resources");
  const [, addLink] = useOutletContext<[undefined, addLinkFunction]>();
  const { focusNodeTitle } = useParams();

  return (focusNodeTitle
    ? <div className="absolute top-0 left-0 h-screen w-screen z-10 flex">
      <NodeWindowSideBar />
      <div className="w-4/5 bg-black-denim overflow-y-scroll scrollbar">
        <NodeWindowHeader focusNodeTitle={focusNodeTitle} />
        <ItemListSelectors setItemType={setItemType} />
        {{
          "resources": <ResourceList focusNodeTitle={focusNodeTitle} />,
          "inlinks": <InlinkList addLink={addLink} focusNodeTitle={focusNodeTitle} />,
          "outlinks": <OutlinkList addLink={addLink} focusNodeTitle={focusNodeTitle} />
        }[itemType]}
      </div>
      <NodeWindowSideBar />
    </div>
    : <div children={"Error: opened NodeWindow but focusNodeTitle was undefined"} />
  );
}