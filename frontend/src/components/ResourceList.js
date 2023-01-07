
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import url from "..";

function ResourceCard({ resource }) {
  return (
    <div className="rounded-sm bg-white m-2 p-2 shadow-md z-10">
      {resource.resourceId.replace("-", " ")}
    </div>
  );
}

export default function ResourceList() {
  const [cards, setCards] = useState([]);
  const params = useParams();

  useEffect(function initializeResourceList() {
    axios.get(`${url}/${params.id}`).then((response) => {
      setCards(response.data.map((resource) => {
        return <ResourceCard resource={resource} key={resource.resourceId} />;
      }));
    });
  }, [params.id, params.title]);

  return (
    <div>
      {cards}
      <button className="shadow-md m-2 p-2 border" onClick={async () => {
        await axios.post(`${url}/${params.id}/resource`);
      }}>DEBUG ONLY: post resource</button>
    </div>
  );
}