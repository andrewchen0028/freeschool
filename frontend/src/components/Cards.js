import { Link } from "react-router-dom";

export function Card({ item, type }) {
  let LinkComponent = (<></>);
  switch (type) {
    case "inlinks":
      LinkComponent = (
        <>
          from <Link to={`../../${item.source}/${item.sourceNode.title}`}
            className="text-blue-600 underline">
            {item.sourceNode.title}
          </Link>
        </>
      ); break;
    case "outlinks":
      LinkComponent = (
        <>
          to <Link to={`../../${item.target}/${item.targetNode.title}`}
            className="text-blue-600 underline">
            {item.targetNode.title}
          </Link>
        </>
      ); break;
    case "resources":
      LinkComponent = (
        <a target="_blank" rel="noopener noreferrer" href={item.url}
          className="text-blue-600 underline">{item.url}</a>
      ); break;
    default: break;
  }
  return (
    <div className="card z-10">
      {LinkComponent}
    </div>
  )
}