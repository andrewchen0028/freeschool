import axios from "axios";
import { useState } from "react";
import { useParams } from "react-router-dom";
import url from "..";

export function InlinkForm({ reload, addLink }) {
  const [stagedSourceNodeId, stageSourceNodeId] = useState("");
  const [errorFlag, setErrorFlag] = useState();
  const { nodeId } = useParams();

  function handleChange(event) {
    stageSourceNodeId(event.target.value);
    setErrorFlag();
  }

  function handleSubmit(event) {
    event.preventDefault();

    axios.post(`${url}/${nodeId}/inlink`, {
      sourceNodeId: stagedSourceNodeId.replace(" ", "-")
    }).then(() => {
      addLink({
        source: stagedSourceNodeId.replace(" ", "-"),
        target: nodeId.replace(" ", "-")
      });
      stageSourceNodeId("");
      reload();
    }).catch((error) => {
      console.log(error);
      setErrorFlag(error.response.status);
    });
  }

  return (
    <div className="card">
      {errorFlag === 409 && <p className="text-red-500">
        {`Inlink from "${stagedSourceNodeId}" already exists`}</p>}
      {errorFlag === 404 && <p className="text-red-500">
        {`Source node "${stagedSourceNodeId}" not found`}</p>}
      <form onSubmit={handleSubmit}>
        <input className="card" placeholder="Source Node" required="required"
          value={stagedSourceNodeId} onChange={handleChange} />
        <button className="button" type="submit">Submit</button>
      </form>
    </div>
  );
}

export function OutlinkForm({ reload, addLink }) {
  const [stagedTargetNodeId, stageTargetNodeId] = useState("");
  const [errorFlag, setErrorFlag] = useState();
  const { nodeId } = useParams();

  function handleChange(event) {
    stageTargetNodeId(event.target.value);
    setErrorFlag();
  }

  function handleSubmit(event) {
    event.preventDefault();

    axios.post(`${url}/${nodeId}/outlink`, {
      targetNodeId: stagedTargetNodeId.replace(" ", "-")
    }).then(() => {
      addLink({
        source: nodeId.replace(" ", "-"),
        target: stagedTargetNodeId.replace(" ", "-")
      });
      stageTargetNodeId("");
      reload();
    }).catch((error) => {
      setErrorFlag(error.response.status);
    });
  }

  return (
    <div className="card">
      {errorFlag === 409 && <p className="text-red-500">
        {`Outlink to "${stagedTargetNodeId}" already exists`}</p>}
      {errorFlag === 404 && <p className="text-red-500">
        {`Target node "${stagedTargetNodeId}" not found`}</p>}
      <form onSubmit={handleSubmit}>
        <input className="card" placeholder="Target Node" required="required"
          value={stagedTargetNodeId} onChange={handleChange} />
        <button className="button" type="submit">Submit</button>
      </form>
    </div>
  );
}

export function ResourceForm({ reload }) {
  const [stagedResourceUrl, stageResourceUrl] = useState("");
  const [errorFlag, setErrorFlag] = useState();
  const { nodeId } = useParams();

  function handleChange(event) {
    stageResourceUrl(event.target.value);
    setErrorFlag();
  }

  function handleSubmit(event) {
    event.preventDefault();

    axios.post(`${url}/${nodeId}/resource`, {
      url: stagedResourceUrl
    }).then(() => {
      stageResourceUrl("");
      reload();
    }).catch((error) => {
      setErrorFlag(error.response.status);
    });
  }

  return (
    <div className="card">
      <h4>Add resource</h4>
      {errorFlag === 409 && <p className="text-red-500">
        Resource already exists</p>}
      {errorFlag === 404 && <p className="text-red-500">
        Node no longer exists, try reloading the page</p>}
      <form onSubmit={handleSubmit}>
        <input className="card" placeholder="Title" required="required"
          type={"url"} value={stagedResourceUrl} onChange={handleChange} />
        <button className="button" type="submit">Submit</button>
      </form>
    </div>
  );
}