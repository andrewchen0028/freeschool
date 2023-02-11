import axios from "axios";
import { ReactNode, useCallback, useEffect, useState } from "react";
import { url } from "..";
import { Card } from "./Cards";
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
            return (<Card item={sourceNode} type="inlink" key={sourceNode.id} />);
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
            return (<Card item={targetNode} type="outlink" key={targetNode.id} />);
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
            return (<Card item={resource} type="resource" key={resource.id} />);
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