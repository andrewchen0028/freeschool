import { Link } from "react-router-dom";

export function InlinkCard({ item: inlink }) {
  return (
    <div className="card z-10">
      from <Link to={`../../${inlink.sourceNodeId}`}
        className="text-blue-600 underline">
        {inlink.sourceNodeId.replace("-", " ")}
      </Link>
    </div>
  );
}

export function OutlinkCard({ item: outlink }) {
  return (
    <div className="card z-10">
      to <Link to={`../../${outlink.targetNodeId}`}
        className="text-blue-600 underline">
        {outlink.targetNodeId.replace("-", " ")}
      </Link>
    </div>
  );
}

export function ResourceCard({ item: resource }) {
  return (
    <div className="card z-10">
      <a target="_blank" rel="noopener noreferrer" href={resource.url}
        className="text-blue-600 underline">{resource.url}</a>
    </div>
  );
}