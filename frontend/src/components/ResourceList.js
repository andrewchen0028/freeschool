import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import url from "..";

function ResourceCard({ resource }) {
  return (
    <div className="card z-10">
      {resource.resourceId.replace("-", " ")}
    </div>
  );
}

function ResourceForm({ reload }) {
  const [resourceId, setResourceId] = useState("");
  const [duplicateFlag, setDuplicateFlag] = useState(false);
  const params = useParams();

  function handleChange(event) {
    setResourceId(event.target.value);
    setDuplicateFlag(false);
  }

  function handleSubmit(event) {
    event.preventDefault();
    axios.post(`${url}/${params.nodeId}/resource`, {
      resourceId: resourceId.replace(" ", "-")
    }).then(() => {
      setResourceId("");
      reload();
    }).catch(() => {
      setResourceId("");
      setDuplicateFlag(true);
    });
  }

  return (
    <div className="card">
      {duplicateFlag && <p className="text-red-500">Resource name taken</p>}
      <form onSubmit={handleSubmit}>
        <input className="card" placeholder="Title" value={resourceId}
          required="required" onChange={handleChange} />
        <button className="button" type="submit">Submit</button>
      </form>
    </div>
  );

}


export default function ResourceList() {
  const [cards, setCards] = useState([]);
  const params = useParams();

  const reload = useCallback(() => {
    axios.get(`${url}/${params.nodeId}/resources`).then((response) => {
      setCards(response.data.length > 0
        ? response.data.map((resource) => (
          <ResourceCard resource={resource} key={resource.resourceId} />
        ))
        : <h1 className="card">None</h1>);
    });
  }, [params.nodeId]);

  useEffect(reload, [reload]);

  return (
    <div>
      <ResourceForm reload={reload} />
      {cards}
    </div>
  );
}