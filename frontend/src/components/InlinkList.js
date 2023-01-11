import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import url from "..";

function InlinkCard({ inlink }) {
  return (
    <div className="card z-10">
      from <Link to={`../../${inlink.sourceNodeId}`}>
        {inlink.sourceNodeId.replace("-", " ")}</Link>
    </div>
  )
}

function InlinkForm({ reload }) {
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
    <div className="card">
      {errorFlag === 400 && <p className="text-red-500">
        {`Inlink from "${sourceNodeId}" already exists`}</p>}
      {errorFlag === 404 && <p className="text-red-500">
        {`Source node "${sourceNodeId}" not found`}</p>}
      <form onSubmit={handleSubmit}>
        <input id="inlinkForm" className="card" placeholder="Source Node"
          value={sourceNodeId} required="required" onChange={handleChange} />
        <button className="button" type="submit">Submit</button>
      </form>
    </div>
  )
}

export default function InlinkList() {
  const [cards, setCards] = useState([]);
  const params = useParams();

  const reload = useCallback(() => {
    axios.get(`${url}/${params.nodeId}/inlinks`).then((response) => {
      setCards(response.data.length > 0
        ? response.data.map((inlink) => (
          <InlinkCard inlink={inlink} key={inlink.sourceNodeId} />
        ))
        : <h1 className="card">None</h1>);
    });
  }, [params.nodeId]);

  useEffect(reload, [reload]);

  return (
    <div>
      <InlinkForm reload={reload} />
      {cards}
    </div>
  );
}