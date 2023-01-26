import { Link } from "react-router-dom";

type Node = { id: number, score: number, title: string }
type Resource = { url: string }
type Inlink = { source: number, sourceNode: Node }
type Outlink = { target: number, targetNode: Node }

export function InlinkCard({ item: inlink }: { item: Inlink }) {
  return (
    <div className="card z-10">
      from <Link to={`../../${inlink.source}/${inlink.sourceNode.title}`}
        className="text-blue-600 underline">
        {inlink.sourceNode.title}
      </Link>
    </div>
  );
}

export function OutlinkCard({ item: outlink }: { item: Outlink }) {
  return (
    <div className="card z-10">
      to <Link to={`../../${outlink.target}/${outlink.targetNode.title}`}
        className="text-blue-600 underline">
        {outlink.targetNode.title}
      </Link>
    </div>
  );
}


export function ResourceCard({ item: resource }: { item: Resource }) {
  return (
    <div className="card z-10">
      <a target="_blank" rel="noopener noreferrer" href={resource.url}
        className="text-blue-600 underline">{resource.url}</a>
    </div>
  );
}