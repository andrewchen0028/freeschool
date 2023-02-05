import { Link } from "react-router-dom";

import { Node, Resource } from "@prisma/client";

/**
 * TODO-CURRENT:
 *  - InlinkCard needs to know sourceNode's supernode as well?
 *    Otherwise, where is the Link supposed to point?
 *  - Especially consider if sourceNode has a different supernode.
 */
export function InlinkCard({ sourceNode }: { sourceNode: Node }) {
  return (
    <div className="card z-10">
      from <Link to={`../../${sourceNode.title}/resources`}
        className="text-blue-600 underline">
        {sourceNode.title}
      </Link>
    </div>
  );
}

export function OutlinkCard({ targetNode }: { targetNode: Node }) {
  return (
    <div className="card z-10">
      to <Link to={`../../${targetNode.title}/resources`}
        className="text-blue-600 underline">
        {targetNode.title}
      </Link>
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