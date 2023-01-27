import axios from "axios";
import { useState } from "react";
import { useParams } from "react-router-dom";
import url from "..";

export function InlinkForm({ reload, addLink }) {
  const [sourceNodeTitle, setSourceNodeTitle] = useState("");
  const [errorFlag, setErrorFlag] = useState();
  const { nodeId } = useParams();

  function handleChange(event) {
    setSourceNodeTitle(event.target.value);
    setErrorFlag();
  }

  function handleSubmit(event) {
    event.preventDefault();

    axios.post(`${url}/${nodeId}/inlink`, {
      sourceNodeTitle: sourceNodeTitle
    }).then((response) => {
      addLink({
        source: response.data.source,
        target: response.data.target,
      });
      setSourceNodeTitle("");
      reload();
    }).catch((error) => {
      console.log(error);
      setErrorFlag(error.response.status);
    });
  }

  return (
    <div className="card">
      {
        {
          404: <p className="text-red-500"
            children={`Source node "${sourceNodeTitle}" not found`} />,
          409: <p className="text-red-500"
            children={`Inlink from "${sourceNodeTitle}" already exists`} />,
          500: <p className="text-red-500"
            children="Internal server error" />
        }[errorFlag]
      }
      <form onSubmit={handleSubmit}>
        <input className="card" placeholder="Source Node" required="required"
          value={sourceNodeTitle} onChange={handleChange} />
        <button className="button" type="submit">Submit</button>
      </form>
    </div>
  );
}

export function OutlinkForm({ reload, addLink }) {
  const [targetNodeTitle, setTargetNodeTitle] = useState("");
  const [errorFlag, setErrorFlag] = useState();
  const { nodeId } = useParams();

  function handleChange(event) {
    setTargetNodeTitle(event.target.value);
    setErrorFlag();
  }

  function handleSubmit(event) {
    event.preventDefault();

    axios.post(`${url}/${nodeId}/outlink`, {
      targetNodeTitle: targetNodeTitle
    }).then((response) => {
      addLink({
        source: response.data.source,
        target: response.data.target,
      });
      setTargetNodeTitle("");
      reload();
    }).catch((error) => {
      setErrorFlag(error.response.status);
    });
  }

  return (
    <div className="card">
      {
        {
          404: <p className="text-red-500"
            children={`Target node "${targetNodeTitle}" not found`} />,
          409: <p className="text-red-500"
            children={`Outlink to "${targetNodeTitle}" already exists`} />,
          500: <p className="text-red-500"
            children="Internal server error" />
        }[errorFlag]
      }
      <form onSubmit={handleSubmit}>
        <input className="card" placeholder="Target Node" required="required"
          value={targetNodeTitle} onChange={handleChange} />
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
      {
        {
          404: <p className="text-red-500"
            children={`Node no longer exists, try reloading the page`} />,
          409: <p className="text-red-500"
            children={`Resource already exists`} />,
          500: <p className="text-red-500"
            children="Internal server error" />
        }[errorFlag]
      }
      <form onSubmit={handleSubmit}>
        <input className="card" placeholder="Title" required="required"
          type={"url"} value={stagedResourceUrl} onChange={handleChange} />
        <button className="button" type="submit">Submit</button>
      </form>
    </div>
  );
}