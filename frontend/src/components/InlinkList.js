import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import url from "..";

// TODO-current: make Link default to "resources" upon opening source node
//    * probably requires some cleaning up / rewriting of state in
//      NodeWindow and its child components
function InlinkCard({ inlink }) {
  return (
    <div className="card z-10">
      from <Link to={`../../${inlink.sourceNodeId}`}>
        {inlink.sourceNodeId.replace("-", " ")}</Link>
    </div>
  )
}

// TODO-high: Make OutlinkList, probably merge with InlinkList
// TODO-medium: all "ItemList" variants can maybe be merged
export default function InlinkList() {
  const [cards, setCards] = useState([]);
  const params = useParams();

  const reload = useCallback(() => {
    axios.get(`${url}/${params.nodeId}/inlinks`).then((response) => {
      setCards(response.data.map((inlink) => {
        return <InlinkCard inlink={inlink} key={inlink.sourceNodeId} />
      }));
    });
  }, [params.nodeId]);

  useEffect(reload, [reload]);

  return (
    <div>
      {/* <InlinkForm reload={reload} /> */}
      {cards}
    </div>
  );
}