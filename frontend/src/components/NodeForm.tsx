import axios from "axios";
import React, { useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { url } from "..";

import { AddNodeFunction } from "../../../types";

export function NodeForm() {
  const [title, setTitle] = useState<string>("");
  const [errorFlag, setErrorFlag] = useState<number>(0);

  const [addNode] = useOutletContext<[AddNodeFunction]>();
  const navigate = useNavigate();

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setTitle(event.target.value);
    setErrorFlag(0);
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    axios.post(`${url}/node`, {
      title: title
    }).then((response) => {
      let node = response.data;
      addNode({ id: node.id, title: node.title });
      // navigate(`../${node.id}/${node.title}`);
    }).catch((error) => {
      setErrorFlag(error.response.status);
    });
  }

  return (
    // This is a hacky but shorter implementation of NodeWindowSideBar
    // of which we would need four (left right top bottom) in this case
    // because NodeForm doesn't cover h-screen.
    // 
    // The use of "onClick" and "stopPropogation" here means that the
    // action "click NodeForm, drag cursor to outside, release cursor
    // outside NodeForm" registers as a click outside of NodeForm and
    // navigates to the home page, which should not happen.
    // 
    // TODO-low: Find a way to make consistent SideBar elements.
    <div onClick={() => { navigate(`/`); }}
      className="absolute top-0 left-0 h-screen w-screen z-10
        flex items-center justify-center
        bg-neutral-800 bg-opacity-80">
      <div className="card bg-white"
        onClick={(event) => { event.stopPropagation(); }}>
        {
          {
            409: <p className="text-red-500"
              children={`Node "${title}" already exists`} />,
            500: <p className="text-red-500"
              children="Internal server error" />
          }[errorFlag]
        }
        <form onSubmit={handleSubmit}>
          <input className="card" placeholder="Node Title" required={true}
            value={title} onChange={handleChange} />
          <button className="button" type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
}