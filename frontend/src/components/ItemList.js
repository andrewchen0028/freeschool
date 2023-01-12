import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { useOutletContext, useParams } from "react-router-dom";
import url from "..";
import { InlinkCard, OutlinkCard, ResourceCard } from "./Cards";
import { InlinkForm, OutlinkForm, ResourceForm } from "./Forms";

// Use ItemList by defining a <Form /> and a <Card /> component, then setting
// the URL extension "ext" and exporting a new <ItemList /> variant.

// form: <ResourceForm />, <InlinkForm />, etc
// card: <ResourceCard />, <InlinkCard />, etc
// ext: "resources", "inlinks", etc
function ItemList({ Form, Card, ext }) {
  const [cards, setCards] = useState([]);

  const { nodeId } = useParams();
  const [addLink] = useOutletContext();

  const reload = useCallback(() => {
    axios.get(`${url}/${nodeId}/${ext}`).then((response) => {
      setCards(response.data.length > 0
        // Note: calling "item.id" requires all items to have an "id" field;
        // currently e.g. Node has "nodeId" and Link has a composite PK.
        // 
        // WARNING: using "index" parameter from map() is not recommended,
        // only used as a temporary solution here.
        // 
        // TODO-high: Give each DB model an "id" field. Then, replace "index"
        // with "item.id".`
        ? response.data.map((item, index) => {
          return (<Card item={item} key={index} />);
        }) : <div className="card">None</div>);
    });
  }, [nodeId, ext]);

  useEffect(reload, [reload]);

  return (
    <div>
      {<Form reload={reload} addLink={addLink} />}
      {cards}
    </div>
  );
}

export function InlinkList() {
  return <ItemList Form={InlinkForm} Card={InlinkCard} ext="inlinks" />;
}

export function OutlinkList() {
  return <ItemList Form={OutlinkForm} Card={OutlinkCard} ext="outlinks" />;
}

export function ResourceList() {
  return <ItemList Form={ResourceForm} Card={ResourceCard} ext="resources" />;
}