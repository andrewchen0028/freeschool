import { Link } from "react-router-dom";

import { Node, Resource } from "@prisma/client";

export function InlinkCard({ sourceNode }: { sourceNode: Node }) {
  return (
    <div className="card z-10">
      from <Link to={`../${sourceNode.title}`}
        className="text-blue-600 underline"
        children={sourceNode.title} />
    </div>
  );
}

export function OutlinkCard({ targetNode }: { targetNode: Node }) {
  return (
    <div className="card z-10">
      to <Link to={`../${targetNode.title}`}
        className="text-blue-600 underline"
        children={targetNode.title} />
    </div>
  );
}

export function ResourceCard({ resource }: { resource: Resource }) {
  return (
    <div className="card z-10">
      <a target="_blank" rel="noopener noreferrer" href={resource.url}
        className="text-blue-600 underline">{resource.url}</a>
    </div>
  );
}