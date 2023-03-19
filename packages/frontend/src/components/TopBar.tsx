import { useNavigate, useParams } from "react-router-dom";
import { useContext } from 'react';
import { UserContext } from "./UserContext";
import axios from "axios";

// import url from "..";
import { useEffect, useState } from "react";

export default function TopBar() {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

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

  function LoggedInText() {
    return (
      <div className="z-10 ml-10 max-w-32">
        {user.id === -1 ? "Not logged in" : `Logged in as ${user.username}`}
      </div>
    );
  }
  function LoginButton() {
    if (user.id === -1) return (
      <button className="button z-10"
        onClick={() => { navigate(`logIn`); }}
        children="Log In" />
    );
    else return (<></>)
  }
  function LogoutButton() {
    if (user.id !== -1) return (
      <button className="button z-10"
        onClick={() => {
          user.id = -1;
          user.username = "";
          window.location.reload();
        }}
        children="Log Out" />
    );
    else return (<></>)
  }
  function CreateAccountButton() {
    if (user.id === -1) return (
      <button className="button ml-0 z-10"
        onClick={() => { navigate(`createAccount`); }}
        children="Create Account" />
    );
    else return (<></>)
  }

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
        Previous graph: {graphTitles.at(-2)}
      </button>
    }
  }

  return (
    <div className="absolute top-0 left-0 h-20 w-screen drop-shadow-lg
      flex flex-row justify-between align-center z-2 bg-black-denim">
      <div className="h-100% flex flex-col items-start">
        <div className="h-100%
        flex flex-row items-center my-auto">
          <LoggedInText />
          <LogoutButton />
          <LoginButton />
          <CreateAccountButton />
        </div>
      </div>
      <div className="flex flex-col z-10 my-auto mr-10 h-100% w-100% items-end">
        <div className="text-sm my-auto">
          Currently viewing {graphTitles.at(-1)} graph
        </div>
        <GoBackButton />
      </div>
    </div>
  );
}