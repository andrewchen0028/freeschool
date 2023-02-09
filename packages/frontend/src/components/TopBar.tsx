import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

// import url from "..";
import { useEffect, useState } from "react";

export default function TopBar() {
  const navigate = useNavigate();

  const [graphTitle, setGraphTitle] = useState("base");
  const params = useParams();
  useEffect(() => {
    if (!params.superNodeTitle) {
      setGraphTitle("base");
    } else {
      setGraphTitle(params.superNodeTitle);
    }
  }, [params]);

  return (
    <div className="absolute top-0 left-0 h-16 w-screen
    flex flex-row justify-between align-center">
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
      <div className="text-sm z-10 px-4 my-auto">
        Currently viewing {graphTitle} graph
      </div>
    </div>
  );
}