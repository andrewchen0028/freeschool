
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import url from "..";

function ResourceCard({ resource }) {
  return (
    <div className="rounded-sm bg-white m-2 p-2 shadow-md z-10">
      {resource.title}
    </div>
  );
}

export default function ResourceList() {
  const [cards, setCards] = useState([]);
  const params = useParams();

  useEffect(function initializeResourceList() {
    axios.get(`${url}/${params.id}/${params.title}`).then((response) => {
      setCards(response.data.map((resource) => {
        return <ResourceCard resource={resource} key={resource.id} />;
      }));
    });
  }, [params.id, params.title]);

  return (
    <div>
      {cards}
    </div>
  );
}