import { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useUserContext } from './UserContext';
import axios from 'axios';

import url from "..";

export default function TopBar({ resetGraph }) {
  const navigate = useNavigate();
  const [minNodeScore, setMinNodeScore] = useState(30);
  
  const currentUserId = useUserContext()[0]; // useUserContext returns [user, setUser]

  const changeMinNodeScore = (e) => {
    setMinNodeScore(e.target.value);
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
      console.error("Error: currentUserId not -1 or >= 0 in TopBar.js");
    }
  }

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
  }, [currentUserId]);

  const [graphTitle, setGraphTitle] = useState("base");

  const params = useParams();
  const location = useLocation();
  useEffect(() => {
    // TODO: Find a less janky way of checking that we've changed subgraph and not just clicked into a NodeWindow (we know that when we click into node X's NodeWindow we can't be viewing X's subgraph)
    if (!(location.pathname.endsWith('node') || location.pathname.endsWith('resources') || location.pathname.endsWith('inlinks') || location.pathname.endsWith('outlinks'))) {
      if (!params.superNodeTitle) {
        setGraphTitle('base');
      } else {
        setGraphTitle(params.superNodeTitle);
      } 
    }
  }, [params, location]);

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
        <div className="text-sm z-10 px-2">
        {loggedInText}
      </div>
      </div>
      <div className="text-sm z-10 px-4 my-auto">
        Currently viewing {graphTitle} graph
      </div>
    </div>
  );
}