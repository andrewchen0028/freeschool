import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import url from "..";

function OutlinkCard({ outlink }) {
  return (
    <div className="card z-10">
      to <Link to={`../../${outlink.targetNodeId}`}>
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
    <div>
      {errorFlag === 400 &&
        <h2>{`Outlink to "${targetNodeId}" already exists`}</h2>}
      {errorFlag === 404 &&
        <h2>{`Target node "${targetNodeId}" not found`}</h2>}
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
        : <h1 className="card">None</h1>);
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