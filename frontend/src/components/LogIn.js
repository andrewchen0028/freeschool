import { useState } from "react";
import { useNavigate } from "react-router-dom";

import axios from "axios";
import url from "..";

export default function LogIn() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorFlag, setErrorFlag] = useState(0);

  const navigate = useNavigate();

  function handleUsernameChange(event) {
    setUsername(event.target.value);
    setErrorFlag(0);
  }

  function handlePasswordChange(event) {
    setPassword(event.target.value);
    setErrorFlag(0);
  }

  function handleSubmit(event) {
    event.preventDefault();

    axios.post(`${url}/login/`, {
      username: username,
      password: password
    }).then((response) => {
      console.log(response.data);
    }).catch((error) => {
      console.log(error);
      setErrorFlag(error.response.status);
    });
  }

  return (
    <div onClick={() => { navigate("/"); }}
      className="absolute top-0 left-0 h-screen w-screen z-10
        flex items-center justify-center
        bg-neutral-800 bg-opacity-80">
      <div className="card bg-white"
        onClick={(event) => { event.stopPropagation(); }}>
        <form onSubmit={handleSubmit} className="flex flex-row">
          <div className="flex flex-col">
            <input id="username" className="card"
              placeholder="Username" required="required"
              value={username} onChange={handleUsernameChange} />
            {/* TODO-high: make all errorflags default to 0,
            and switch to label-based error handling */}
            <label htmlFor="username" className="text-red-500"
              children={{
                0: <div />,
                409: <p children="Username is taken" />,
                500: <p children="Internal server error" />
              }[errorFlag]
                || <p>{`Unrecognized HTTP response: ${errorFlag}`}</p>} />
          </div>
          <div className="flex flex-col">
            <input className="card" placeholder="Password" required="required"
              value={password} onChange={handlePasswordChange} />
          </div>
          <button className="button" type="submit" children="Log in" />
        </form>
        <button className="button" children="(dev) log users"
          onClick={() => {
            axios.get(`${url}/users/`).then((response) => {
              console.log(response.data);
            });
          }} />
      </div>
    </div>
  );
}