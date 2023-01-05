import { useNavigate, useParams } from "react-router-dom";

import ResourceList from "./ResourceList";

function NodeWindowSideDiv() {
  const navigate = useNavigate();

  return (
    <div className="bg-neutral-800 h-screen flex-grow"
      onClick={() => { navigate(`/`); }} />
  );
}

function NodeWindowBackground() {
  const params = useParams();
  return (
    <div className="w-3/5 h-screen bg-white overflow-y-scroll">
      <div className="rounded-sm bg-white m-2 p-2 shadow-md h-16
        flex items-center gap-2 text-xl font-bold">
        <h1 className="p-2">{params.title.replace("-", " ")}</h1>
      </div>

      <ResourceList />

    </div>
  );
}

export default function NodeWindow() {
  return (
    <div className="absolute top-0 left-0 h-screen w-screen z-10
      flex justify-between">
      <NodeWindowSideDiv />
      <NodeWindowBackground />
      <NodeWindowSideDiv />
    </div>
  );
}