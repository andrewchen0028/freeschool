import axios from "axios";
import { ChangeEvent, FormEvent, useState } from "react";
import { useParams } from "react-router-dom";
import { url } from "..";
import { addLinkFunction } from "./Graph";

export function InlinkForm({ reload, addLink }: {
  reload: () => void,
  addLink: addLinkFunction
}) {
  const [sourceNodeTitle, setSourceNodeTitle] = useState("");
  const [errorFlag, setErrorFlag] = useState(0);
  const { focusNodeTitle } = useParams();

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    setSourceNodeTitle(event.target.value);
    setErrorFlag(0);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    axios.post(`${url}/${focusNodeTitle}/inlink`, {
      sourceNodeTitle: sourceNodeTitle
    }).then((response) => {
      addLink({
        source: response.data.source,
        target: response.data.target,
      });
      setSourceNodeTitle("");
      reload();
    }).catch((error) => {
      console.warn(error);
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
        <input className="text-input" placeholder="Source Node" required={true}
          value={sourceNodeTitle} onChange={handleChange} />
        <button className="button" type="submit">Submit</button>
      </form>
    </div>
  );
}

export function OutlinkForm({ reload, addLink }: {
  reload: () => void,
  addLink: addLinkFunction
}) {
  const [targetNodeTitle, setTargetNodeTitle] = useState("");
  const [errorFlag, setErrorFlag] = useState(0);
  const { focusNodeTitle } = useParams();

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    setTargetNodeTitle(event.target.value);
    setErrorFlag(0);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    axios.post(`${url}/${focusNodeTitle}/outlink`, {
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
        <input className="text-input" placeholder="Target Node" required={true}
          value={targetNodeTitle} onChange={handleChange} />
        <button className="button" type="submit">Submit</button>
      </form>
    </div>
  );
}

export function ResourceForm({ reload }: { reload: () => void }) {
  const [stagedResourceUrl, stageResourceUrl] = useState("");
  const [errorFlag, setErrorFlag] = useState(0);
  const { nodeId } = useParams();

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    stageResourceUrl(event.target.value);
    setErrorFlag(0);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
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
        <input className="text-input" placeholder="Title" required={true}
          type={"url"} value={stagedResourceUrl} onChange={handleChange} />
        <button className="button" type="submit">Submit</button>
      </form>
    </div>
  );
}