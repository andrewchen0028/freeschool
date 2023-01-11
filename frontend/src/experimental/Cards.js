import { Link } from "react-router-dom";
import url from "..";

export function InlinkCard({ inlink }) {
  return (
    <div className="card z-10">
      from <Link to={`${url}/${inlink.sourceNodeId}`}>
        {inlink.sourceNodeId.replace("-", " ")}
      </Link>
    </div>
  );
}