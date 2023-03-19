import axios from "axios";
import { NodeObject } from "force-graph";
import { ChangeEvent, FormEvent, useState, useContext } from 'react';
import { useNavigate, useOutletContext, useParams } from 'react-router-dom';
import { url } from "..";
import { Node } from "shared-data";
import { addNodeFunction } from "./Graph";
import { UserContext } from "./UserContext";

export default function NodeForm() {
  const [title, setTitle] = useState("");
  const [errorFlag, setErrorFlag] = useState(0);

  const { superNodeTitle } = useParams();
  const { userContext } = useContext(UserContext);

  const [addNode] = useOutletContext<[addNodeFunction]>();
  const navigate = useNavigate();

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    setTitle(event.target.value);
    setErrorFlag(0);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // TODO-BUGFIX: doesn't correctly handle addNode on empty subgraph
    if (userContext.nodePubkey !== "") {
      axios.post(`${url}/node`, { title: title, superNodeTitle: superNodeTitle, author: userContext.nodePubkey }).then((response) => {
        let node: Node = response.data;
        addNode({ id: node.id, title: node.title } as NodeObject);
        navigate(`../${node.title}`);
      }).catch((error) => { setErrorFlag(error.response.status); });
    } else {
      console.log("Not logged in; can't post");
    }
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
      <div className="card bg-black-denim"
        onClick={(event) => { event.stopPropagation(); }}>
        {{
          409: <p className="text-red-500"
            children={`Node "${title}" already exists`} />,
          500: <p className="text-red-500"
            children="Internal server error" />
        }[errorFlag]}
        <div className="px-4 pt-2 text-xl">
          Create node
        </div>
        <form onSubmit={handleSubmit} className="mt-0">
          <input className="text-input" placeholder="Node Title" required={true}
            value={title} onChange={handleChange} />
          <button className="button" type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
}