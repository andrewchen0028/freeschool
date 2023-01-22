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

  const [commentCards, setCommentCards] = useState([]);

  const loadComments = useCallback(() => {
    if (nodeId && type === "resources") {
      axios.get(`${url}/${nodeId}/${item.id}/comments`).then((response) => {
        // Map comment ids to comment data
        const commentIds = new Map();
        for (const comment of response.data) {
          commentIds.set(comment.id, {
            text: comment.text,
            score: comment.score,
          })
        }
        // Map comment ids to their children ids
        const commentChildren = new Map();
        for (const comment of response.data) {
          // If comment.id is not in commentsWithChildren, add it
          if (!commentChildren.has(comment.id)) { commentChildren.set(comment.id, []) };
          // Push comment.id to commentsWithChildren[comment.parentCommentId]
          const parentId = comment.parentCommentId;
          if (parentId !== null) {
            if (commentChildren.has(parentId)) {
              commentChildren.set(parentId, (commentChildren.get(parentId)).concat([comment.id]));
            } else {
              commentChildren.set(parentId, [comment.id]);
            }
          }
        }
        // Generate cards
        const newCommentCards = [];
        // dfs function adds a card for current comment and all its children
        const addedCommentIds = new Set();
        function dfs(commentId, commentData, nestingLayer) {
          if (addedCommentIds.has(commentId)) return;
          addedCommentIds.add(commentId);
          newCommentCards.push(
            <div className="border-l-2 p-2 py-0.5 items-center" key={commentId} style={{ marginLeft: `${nestingLayer}em` }}>
              {commentData.text}
              <div className="flex pb-1 flex items-center gap-2">
                <button className="downvote p-0" onClick={() => {  }}>-</button>
                <h6>{commentIds.get(commentId).score}</h6>
                <button className="upvote p-0" onClick={() => {  }}>+</button>
              </div>
            </div>
          )
          for (const childId of commentChildren.get(commentId)) {
            dfs(childId, commentIds.get(childId), nestingLayer + 1);
          }
        }
        // Run DFS on each comment - here, "comment" is a pair (key, value in commentIds Map)
        for (const comment of commentIds) {
          dfs(comment[0], comment[1], 0);
        }
        setCommentCards(newCommentCards);
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
        {commentCards}
      </div>
    </>
  )
}