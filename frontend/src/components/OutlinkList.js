import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import url from "..";

function OutlinkCard({ outlink }) {
  return (
    <div className="card z-10">
      to <Link to={`../../${outlink.targetNodeId}`}
        className="text-blue-600 underline">
        {outlink.targetNodeId.replace("-", " ")}</Link>
    </div>
  )
}

function OutlinkForm({ reload }) {
  const [targetNodeId, setTargetNodeId] = useState("");
  const [errorFlag, setErrorFlag] = useState();
  const params = useParams();

  function handleChange(event) {
    setTargetNodeId(event.target.value);
    setErrorFlag();
  }

  function handleSubmit(event) {
    event.preventDefault();

    axios.post(`${url}/${params.nodeId}/outlink`, {
      targetNodeId: targetNodeId.replace(" ", "-")
    }).then(() => {
      setTargetNodeId("");
      reload();
    }).catch((error) => {
      setErrorFlag(error.response.status);
    });
  }

  return (
    // TODO-low: replace hacky <p> error labels with proper labels
    // (Also relevant for other ItemLists)
    <div className="card">
      {errorFlag === 400 && <p className="text-red-500">
        {`Outlink to "${targetNodeId}" already exists`}</p>}
      {errorFlag === 404 && <p className="text-red-500">
        {`Target node "${targetNodeId}" not found`}</p>}
      <form onSubmit={handleSubmit}>
        <input id="outlinkForm" className="card" placeholder="Target Node"
          value={targetNodeId} required="required" onChange={handleChange} />
        <button className="button" type="submit">Submit</button>
      </form>
    </div>
  )
}

export default function OutlinkList() {
  const [cards, setCards] = useState([]);
  const params = useParams();

  const reload = useCallback(() => {
    axios.get(`${url}/${params.nodeId}/outlinks`).then((response) => {
      setCards(response.data.length > 0
        ? response.data.map((outlink) => (
          <OutlinkCard outlink={outlink} key={outlink.targetNodeId} />
        ))
        : <p className="card">None</p>);
    });
  }, [params.nodeId]);

  useEffect(reload, [reload]);

  return (
    <div>
      <OutlinkForm reload={reload} />
      {cards}
    </div>
  );
}