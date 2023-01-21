import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import url from "..";

export function Card({ item, type }) {
  const [showCommentInput, setShowCommentInput] = useState(false);
  const { nodeId } = useParams();

  let LinkComponent = (<></>);
  switch (type) {
    case "inlinks":
      LinkComponent = (
        <>
          from <Link to={`../../${item.source}/${item.sourceNode.title}/node`}
            className="text-blue-600 underline">
            {item.sourceNode.title}
          </Link>
        </>
      ); break;
    case "outlinks":
      LinkComponent = (
        <>
          to <Link to={`../../${item.target}/${item.targetNode.title}/node`}
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
          <input type="submit" value="Submit" className="button p-1 m-0" />
        </div>
      </form>
    </>) :
    (<></>);

  const [comments, setComments] = useState([]);

  const loadComments = useCallback(() => {
    if (nodeId && type === "resources") {
      axios.get(`${url}/${nodeId}/${item.id}/comments`).then((response) => {
        setComments(response.data.map((comment, index) => {
          return (
            <div className={`card my-0`}>
              {comment.text}
            </div>
          )
        }
        ));
      })
    }
  }, [nodeId, type, item.id]);

  useEffect(loadComments, [loadComments]);

  return (
    <>
      <div className="card z-10 mb-0">
        <div className="flex flex-row justify-between items-center">
          <div className="flex flex-row items-center">
            <div className="flex flex-col items-center">
              <button className="upvote" onClick={() => { }}>+</button>
              <h4>0</h4>
              <button className="downvote" onClick={() => { }}>—</button>
            </div>
            <div className="px-4">
              {LinkComponent}
            </div>
          </div>
          <button className="px-4 border-2 border-slate py-2 h-min rounded-lg button"
            onClick={() => { setShowCommentInput(!showCommentInput) }}>
            Add Comment
          </button>
        </div>
        <div>
          {CommentInput}
        </div>
      </div>
      <div className="card mt-0 border-t-0">
        Comments:
        {comments}
      </div>
    </>
  )
}