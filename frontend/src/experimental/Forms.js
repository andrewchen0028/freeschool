import axios from "axios";
import { useState } from "react";
import { useParams } from "react-router-dom";

export function InlinkForm({ reload }) {
  const [sourceNodeId, setSourceNodeId] = useState("");
  const [errorFlag, setErrorFlag] = useState();
  const params = useParams();

  function handleChange(event) {
    setSourceNodeId(event.target.value);
    setErrorFlag();
  }

  function handleSubmit(event) {
    event.preventDefault();

    axios.post(`${url}/${params.nodeId}/inlink`, {
      sourceNodeId: sourceNodeId.replace(" ", "-")
    }).then(() => {
      setSourceNodeId("");
      reload();
    }).catch((error) => {
      setErrorFlag(error.response.status);
    });
  }

  return (
    <div>
      {errorFlag === 400 &&
        <h2>{`Inlink from "${sourceNodeId}" already exists`}</h2>}
      {errorFlag === 404 &&
        <h2>{`Source node "${sourceNodeId}" not found`}</h2>}
      <form onSubmit={handleSubmit}>
        <input id="inlinkForm" className="card" placeholder="Source Node"
          value={sourceNodeId} required="required" onChange={handleChange} />
        <button className="button" type="submit">Submit</button>
      </form>
    </div>
  )
}