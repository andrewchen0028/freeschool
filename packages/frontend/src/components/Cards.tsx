import { Node, Resource } from '@prisma/client';
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { url } from "..";

export function Card({ item, type }: { item: Resource | Node, type: string }) {
  const [showCommentInput, setShowCommentInput] = useState(false);
  const { focusNodeTitle } = useParams();

  let CardBody = (<></>);
  switch (type) {
    case "inlink":
      const sourceNode = item as Node;
      CardBody = (
        <>
          from <Link to={`../${sourceNode.title}`}
            className="text-blue-600 underline">
            {sourceNode.title}
          </Link>
        </>
      ); break;
    case "outlink":
      const targetNode = item as Node;
      CardBody = (
        <>
          from <Link to={`../${targetNode.title}`}
            className="text-blue-600 underline">
            {targetNode.title}
          </Link>
        </>
      ); break;
    case "resource":
      const resource = item as Resource;
      CardBody = (
        <a target="_blank" rel="noopener noreferrer" href={resource.url}
          className="text-blue-600 underline">{resource.url}</a>
      ); break;
    default: break;
  }

  function CommentInput() {
    return showCommentInput ?
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
  }
  
  // ResourceComment type which only contains the information needed on frontned: text, score, children
  type FrontendResourceComment = {
    text: string;
    score: number;
    childrenIds: Set<number>;
  };

  const [commentCards, setCommentCards]= useState<JSX.Element[]>([]);
  const loadComments = useCallback(() => {
    if (focusNodeTitle && type === "resource") {
      axios.get(`${url}/${focusNodeTitle}/${item.id}/comments`).then((response) => {
        // Map comment ids to comment data
        const comments = new Map<number, FrontendResourceComment>();
        for (const comment of response.data) {
          comments.set(comment.id, {
            text: comment.text,
            score: comment.score,
            childrenIds: new Set<number>(),
          })
        }
        // Map comment ids to their children ids
        for (const comment of response.data) {
          // Push comment.id to commentsWithChildren[comment.parentCommentId]
          const parentId = comment.parentCommentId;
          if (parentId !== null) {
            comments.get(parentId)?.childrenIds.add(comment.id);
          }
        }
        // Generate cards
        const newCommentCards: JSX.Element[] = [];
        // dfs function adds a card for current comment and all its children
        const addedCommentIds = new Set();
        function dfs(commentId: number, commentData: FrontendResourceComment, nestingLayer: number) {
          if (addedCommentIds.has(commentId)) return;
          addedCommentIds.add(commentId);
          newCommentCards.push(
            <div className="border-l border-gray-500 p-2 py-0.5 items-center" key={commentId} style={{ marginLeft: `${nestingLayer}em` }}>
              {commentData.text}
              <div className="flex pb-1 flex items-center gap-2">
                <button className="downvote p-0" onClick={() => {  }}>-</button>
                <h6>{comments.get(commentId)!.score}</h6>
                <button className="upvote p-0" onClick={() => {  }}>+</button>
              </div>
            </div>
          )
          for (const childId of comments.get(commentId)!.childrenIds) {
            dfs(childId, comments.get(childId)!, nestingLayer + 1);
          }
        }
        // Run DFS on each comment - here, "comment" is a pair (key, value in commentIds Map)
        for (const comment of comments) {
          dfs(comment[0], comment[1], 0);
        }
        setCommentCards(newCommentCards);
      })
    }
  }, [focusNodeTitle, type, item.id]);

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
              {CardBody}
            </div>
          </div>
          <button className="px-4 border-2 border-slate py-2 h-min rounded-lg button"
            onClick={() => { setShowCommentInput(!showCommentInput) }}>
            Add Comment
          </button>
        </div>
        <CommentInput/>
      </div>
      <div className="card mt-0 border-t-0">
        Comments:
        {commentCards}
      </div>
    </>
  )
}