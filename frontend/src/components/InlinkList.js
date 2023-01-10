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
    <div>
      {errorFlag === 400 && <h2>
        {`Inlink from "${sourceNodeId}" already exists`}</h2>}
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

// TODO-high: Make OutlinkList, probably merge with InlinkList
// TODO-medium: all "ItemList" variants can maybe be merged
export default function InlinkList() {
  const [cards, setCards] = useState([]);
  const params = useParams();

  const reload = useCallback(() => {
    axios.get(`${url}/${params.nodeId}/inlinks`).then((response) => {
      setCards(response.data.map((inlink) => {
        return <InlinkCard inlink={inlink} key={inlink.sourceNodeId} />
      }));
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