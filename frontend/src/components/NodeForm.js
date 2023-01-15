import axios from "axios";
import { useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import url from "..";

export default function NodeForm() {
  const [stagedTitle, stageTitle] = useState("");
  const [errorFlag, setErrorFlag] = useState();

  const [addNode] = useOutletContext();
  const navigate = useNavigate();

  function handleChange(event) {
    stageTitle(event.target.value);
    setErrorFlag();
  }

  function handleSubmit(event) {
    event.preventDefault();

    axios.post(`${url}/node`, {
      title: stagedTitle
    }).then((response) => {
      let node = response.data;
      addNode({ id: node.id, title: node.title });
      navigate(`../${node.id}/${node.title}`);
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
        {errorFlag}
        <form onSubmit={handleSubmit}>
          <input className="card" placeholder="Node Title" required="required"
            value={stagedTitle} onChange={handleChange} />
          <button className="button" type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
}