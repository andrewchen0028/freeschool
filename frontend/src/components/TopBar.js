import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { useUserContext } from './UserContext';
import { useGraphContext } from './GraphContext';
import axios from 'axios';

import url from "..";

export default function TopBar({ resetGraph }) {
  const navigate = useNavigate();
  const [minNodeScore, setMinNodeScore] = useState(30);
  
  const currentUserId = useUserContext()[0]; // useUserContext returns [user, setUser]
  const currentGraph = useGraphContext()[0];

  const changeMinNodeScore = (e) => {
    setMinNodeScore(e.target.value);
    console.log(minNodeScore);
  }

  function LoginLogoutButton(props) {
    if (currentUserId === -1) {
      return (
        <button className="button z-10"
          onClick={() => { navigate(`logIn`); }}
          children="Log in" />
      );
    } else if (currentUserId >= 0) {
      return (
        <button className="button z-10"
          onClick={() => { navigate(`logIn`); }}
          children="Log out" />
      );
    } else {
      console.log("Error: currentUserId not -1 or >= 0 in TopBar.js");
    }
  }

  function LoggedInText() {
    const [loggedInText, setLoggedInText] = useState("");
    useEffect(() => {
      async function getUsername() {
        if (currentUserId === -1) {
          setLoggedInText("Not logged in");
        } else if (currentUserId >= 0) {
          axios.get(`${url}/${currentUserId}/username/`).then((response) => {
            setLoggedInText("Logged in as ".concat(response.data.username));
          });
        } else {
          console.error("_currentUserId not -1 or >= 0 in TopBar.js LoggedInText()")
        }
      }
      getUsername();
    }, []);
    return (
      <div className="text-sm z-10 px-2">
        {loggedInText}
      </div>
    );
  }

  function CurrentGraphText() {
    let graphTitle = "base";
    if (currentGraph.id !== -1) {
      graphTitle = currentGraph.title;
    }
    return (
      <div className="text-sm z-10 px-4 my-auto">
        Currently viewing {graphTitle} graph
      </div>
    )
  }

  return (
    <div className="absolute top-0 left-0 h-16 w-screen
    flex flex-row justify-between align-center">
      <div className="h-100% flex flex-col items-start">
        <div className="h-100%
      flex flex-row items-center">
          <button className="button z-10"
            onClick={resetGraph}>RESET</button>
          <div className="z-10 w-44">
            <label htmlFor="range" className="text-sm">Minimum node score: {minNodeScore}</label>
            <input id="range" type="range" min={-100} max={100} onChange={changeMinNodeScore} className="w-full bg-gray" />
          </div>
          <LoginLogoutButton />
          <button className="button z-10"
            onClick={() => { navigate(`createAccount`); }}
            children="Create Account" />
        </div>
        <LoggedInText />
      </div>
      <CurrentGraphText/>
    </div>
  );
}