import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";

export default function TopBar() {
  const navigate = useNavigate();
  const [graphTitle, setGraphTitle] = useState("base");

  return (
    <div className="absolute top-0 left-0 h-16 w-screen
      flex flex-row items-center">
      <div className="z-10 ml-10 w-40">
        <label htmlFor="range" className="text-sm">Minimum node score: 30</label>
        <input id="range" type="range" min={-100} max={100} className="w-full bg-gray" />
      </div>
      <button className="button z-10"
        onClick={() => { navigate(`createUser`); }}
        children="Create User" />
    </div>
  );
}