import { Link } from "react-router-dom";

import { Node, Resource } from "@prisma/client";

export function InlinkCard({ item: sourceNode }: { item: Node }) {
  return (
    <div className="card z-10">
      from <Link to={`../../${sourceNode.id}/${sourceNode.title}`}
        className="text-blue-600 underline">
        {sourceNode.title}
      </Link>
    </div>
  );
}

export function OutlinkCard({ item: targetNode }: { item: Node }) {
  return (
    <div className="card z-10">
      to <Link to={`../../${targetNode.id}/${targetNode.title}`}
        className="text-blue-600 underline">
        {targetNode.title}
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