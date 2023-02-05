import axios from "axios";
import { ReactNode, useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { url } from "..";
import { InlinkCard, OutlinkCard, ResourceCard } from "./Cards";
import { InlinkForm, OutlinkForm, ResourceForm } from "./Forms";
import { addLinkFunction } from "./Graph";
import { Node, Resource } from "@prisma/client";


export function InlinkList({ addLink, focusNodeTitle }: {
  addLink: addLinkFunction,
  focusNodeTitle: string
}) {
  const [cards, setCards] = useState<ReactNode[]>([]);

  const reload = useCallback(() => {
    if (focusNodeTitle) {
      axios.get(`${url}/${focusNodeTitle}/inlinks`).then((response) => {
        setCards(response.data.length > 0
          ? response.data.map((sourceNode: Node) => {
            return (<InlinkCard sourceNode={sourceNode} key={sourceNode.id} />);
          }) : <div className="card">None</div>);
      });
    }
  }, [focusNodeTitle]);

  useEffect(reload, [reload]);

  return (
    <div>
      {<InlinkForm reload={reload} addLink={addLink} />}
      {cards}
    </div>
  );
}

export function OutlinkList({ addLink, focusNodeTitle }: {
  addLink: addLinkFunction,
  focusNodeTitle: string
}) {
  const [cards, setCards] = useState<ReactNode[]>([]);

  const reload = useCallback(() => {
    if (focusNodeTitle) {
      axios.get(`${url}/${focusNodeTitle}/outlinks`).then((response) => {
        setCards(response.data.length > 0
          ? response.data.map((targetNode: Node) => {
            return (<OutlinkCard targetNode={targetNode} key={targetNode.id} />);
          }) : <div className="card">None</div>);
      });
    }
  }, [focusNodeTitle]);

  useEffect(reload, [reload]);

  return (
    <div>
      {<OutlinkForm reload={reload} addLink={addLink} />}
      {cards}
    </div>
  );
}

export function ResourceList({ focusNodeTitle }: { focusNodeTitle: string }) {
  const [cards, setCards] = useState<ReactNode[]>([]);

  const reload = useCallback(() => {
    if (focusNodeTitle) {
      axios.get(`${url}/${focusNodeTitle}/resources`).then((response) => {
        setCards(response.data.length > 0
          ? response.data.map((resource: Resource) => {
            return (<ResourceCard resource={resource} key={resource.id} />);
          }) : <div className="card">None</div>);
      });
    }
  }, [focusNodeTitle]);

  useEffect(reload, [reload]);

  return (
    <div>
      {<ResourceForm reload={reload} />}
      {cards}
    </div>
  );
}