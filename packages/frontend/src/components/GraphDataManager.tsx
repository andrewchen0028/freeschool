import { Outlet, useOutletContext } from "react-router-dom";
import { addLinkFunction, addNodeFunction } from "./Graph";

export default function GraphDataManager() {
  const [addNode, addLink] = useOutletContext<[
    addNodeFunction,
    addLinkFunction
  ]>();
  return (
    <div>
      <Outlet context={[addNode, addLink]} />
    </div>
  );
}