import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

// import url from "..";
import { useEffect, useState } from "react";

export default function TopBar() {
  const navigate = useNavigate();

  // Track the titles of the subgraphs we've visited
  const [graphTitles, setGraphTitles] = useState<string[]>([]);

  const params = useParams();
  useEffect(() => {
    const newGraphTitles = [...graphTitles];
    if (graphTitles.length === 0 || params.superNodeTitle !== graphTitles.at(-1)) {
      if (params.superNodeTitle === undefined) {
        newGraphTitles.push("base");
      } else {
        newGraphTitles.push(params.superNodeTitle);
      }
      setGraphTitles(newGraphTitles);
    }
  }, [params]);

  function popSubgraph() {
    if (graphTitles.length < 2) {
      console.error("goBack() called when graphTitles length < 2");
      return;
    }
    const newGraphTitles = [...graphTitles].slice(0, -1);
    setGraphTitles(newGraphTitles);
    navigate(`../${newGraphTitles.at(-1)}`);
  }
  function GoBackButton() {
    if (graphTitles.length < 2) return <></>;
    else {
      return <button onClick={() => popSubgraph()} className="text-sm text-blue-600 underline">
        Previous subgraph: {graphTitles.at(-2)}
      </button>
    }
  }

  return (
    <div className="absolute top-0 left-0 h-16 w-screen drop-shadow-lg min-h-max
      flex flex-row justify-between align-center z-100">
      <div className="h-100% flex flex-col items-start">
        <div className="h-100%
        flex flex-row items-center">
          <div className="z-10 ml-10 w-40">
            <label htmlFor="range" className="text-sm">Minimum node score: 30</label>
            <input id="range" type="range" min={-100} max={100} className="w-full bg-gray" />
          </div>
          <button className="button z-10"
            onClick={() => { navigate(`createUser`); }}
            children="Create Account" />
        </div>
      </div>
      <div className="flex flex-col z-10 p-2 mr-10 h-100% w-100% items-end">
        <div className="text-sm my-auto">
          Currently viewing {graphTitles.at(-1)} graph
        </div>
        <GoBackButton />
      </div>
    </div>
  );
}