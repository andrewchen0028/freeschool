import { useState } from 'react';
import { useNavigate } from "react-router-dom";

export default function TopBar({ resetGraph }) {
  const navigate = useNavigate();
  const [minNodeScore, setMinNodeScore] = useState(30);

  const changeMinNodeScore = (e) =>
  {
    setMinNodeScore(e.target.value);
    console.log(minNodeScore);
  }

  return (
    <div className="absolute top-0 left-0 h-16 w-screen
      flex flex-row items-center">
      <button className="button z-10"
        onClick={resetGraph}>RESET</button>
      <div className="z-10 w-44">
        <label htmlFor="range" className="text-sm">Minimum node score: {minNodeScore}</label>
        <input id="range" type="range" min={-100} max={100} onChange={changeMinNodeScore} className="w-full bg-gray" />
      </div>
      <button className="button z-10"
        onClick={() => { navigate(`createUser`); }}
        children="Create User" />
    </div>
  );
}