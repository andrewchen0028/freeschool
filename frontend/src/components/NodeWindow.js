import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import url from "..";

import ResourceList from "./ResourceList";

function NodeWindowHeader() {
  const params = useParams();
  const [nodeMetadata, setNodeMetadata] = useState();

  useEffect(() => {
    axios.get(`${url}/${params.nodeId}`).then((response) => {
      setNodeMetadata(response.data);
    });
  }, [params.nodeId]);

  return (!nodeMetadata ? <div /> :
    <div className="card flex items-center gap-2 text-xl">
      <h1>{nodeMetadata.score}</h1 >
      <h1 className="p-2">{nodeMetadata.nodeId.replace("-", " ")}</h1>
    </div >
  );
}

function NodeWindowSideBar() {
  const navigate = useNavigate();

  return (<div className="bg-neutral-800 flex-grow"
    onClick={() => { navigate(`/`); }} />);
}

export default function NodeWindow() {
  return (
    <div className="absolute top-0 left-0 h-screen w-screen z-10 flex">
      <NodeWindowSideBar />
      <div className="w-3/5 bg-white overflow-y-scroll">
        <NodeWindowHeader />
        <ResourceList />
      </div>
      <NodeWindowSideBar />

    </div>
  );
}