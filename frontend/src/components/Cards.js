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
      <div className="flex flex-row justify-between items-center">
        <div className="flex flex-row items-center">
          <div className="flex flex-col px-4">
            <button className="text-xl hover:font-bold hover:text-green-500">+</button>
            <div>420</div>
            <button className="text-xl hover:font-bold hover:text-red-500">-</button>
          </div>
          <div className="pr-4">
            {LinkComponent}
          </div>
        </div>
        <button className="px-4 border-2 border-slate py-2 h-min rounded-lg">
          Add Comment
        </button>
      </div>
    </div>
  )
}