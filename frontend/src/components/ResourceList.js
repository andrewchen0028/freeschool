import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import url from "..";

function ResourceCard({ resource }) {
  return (
    <div className="card z-10">
      <a target="_blank" rel="noopener noreferrer" href={resource.url}
        className="text-blue-600 underline">{resource.url}</a>
    </div>
  );
}

function ResourceForm({ reload }) {
  const [resourceUrl, setResourceUrl] = useState("");
  const [errorFlag, setErrorFlag] = useState();
  const params = useParams();

  function handleChange(event) {
    setResourceUrl(event.target.value);
    setErrorFlag();
  }

  function handleSubmit(event) {
    event.preventDefault();

    axios.post(`${url}/${params.nodeId}/resource`, {
      url: resourceUrl.replace(" ", "-")
    }).then(() => {
      setResourceUrl("");
      reload();
    }).catch((error) => {
      setErrorFlag(error.response.status);
    });
  }

  return (
    <div className="card">
      <h4>Add resource</h4>
      {errorFlag === 400 && <p className="text-red-500">
        Resource already exists</p>}
      {errorFlag === 404 && <p className="text-red-500">
        Node no longer exists, try reloading the page</p>}
      <form onSubmit={handleSubmit}>
        <input type={"url"} className="card" placeholder="Title" value={resourceUrl}
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
          <ResourceCard resource={resource} key={resource.id} />
        ))
        : <p className="card">None</p>);
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