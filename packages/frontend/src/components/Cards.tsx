import { Link } from "react-router-dom";

import { IOLink } from "shared-data";

export function InlinkCard({ item: inlink }: { item: IOLink }) {
  return (
    <div className="card z-10">
      from <Link to={`../../${inlink.source?.id}/${inlink.source?.title}`}
        className="text-blue-600 underline">
        {inlink.source?.title}
      </Link>
    </div>
  );
}

export function OutlinkCard({ item: outlink }: { item: IOLink }) {
  return (
    <div className="card z-10">
      to <Link to={`../../${outlink.target?.id}/${outlink.target?.title}`}
        className="text-blue-600 underline">
        {outlink.target?.title}
      </Link>
    </div>
  );
}

export function ResourceCard({ item: resource }: { item: any }) {
  return (
    <div className="card z-10">
      <a target="_blank" rel="noopener noreferrer" href={resource.url}
        className="text-blue-600 underline">{resource.url}</a>
    </div>
  );
}