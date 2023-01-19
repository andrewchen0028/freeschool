import { useState } from "react";
import { Link } from "react-router-dom";

export function Card({ item, type }) {
  const [showCommentInput, setShowCommentInput] = useState(false);

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

  let CommentInput = showCommentInput ? 
  (<>
    <form className="card m-2">
      <label className="block w-full">
        Comment:
        <textarea name="comment" className="h-16 w-full border-2"></textarea>
      </label>
      <div className="flex flex-row justify-end">
        <input type="submit" value="Submit" className="button p-1 m-0"/>
      </div>
    </form>
  </>) :
  (<></>);

  return (
    <div className="card z-10">
      <div className="flex flex-row justify-between items-center">
        <div className="flex flex-row items-center">
          <div className="flex flex-col items-center">
            <button className="upvote" onClick={() => { }}>+</button>
            <h4>420</h4>
            <button className="downvote" onClick={() => { }}>—</button>
          </div>
          <div className="px-4">
            {LinkComponent}
          </div>
        </div>
        <button className="px-4 border-2 border-slate py-2 h-min rounded-lg button"
        onClick={() => {setShowCommentInput(!showCommentInput)}}>
          Add Comment
        </button>
      </div>
      <div>
        {CommentInput}
      </div>
    </div>
  )
}