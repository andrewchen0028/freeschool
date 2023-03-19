import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";

import axios from "axios";
import { url } from "..";

import { UserContext } from "./UserContext";
import { User } from "shared-data";

export default function LogIn() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorFlag, setErrorFlag] = useState(0);

    const navigate = useNavigate();
    const { userContext } = useContext(UserContext);

    function handleUsernameChange(event: any) {
        setUsername(event.target.value);
        setErrorFlag(0);
    }

    function handlePasswordChange(event: any) {
        setPassword(event.target.value);
        setErrorFlag(0);
    }

    function handleSubmit(event: any) {
        event.preventDefault();

        axios.post(`${url}/logIn`, {
            username: username,
            password: password
        }).then((response) => {
            userContext.user.id = response.data.id;
            userContext.user.username = response.data.username;
            navigate("/");
        }).catch((error) => {
            setErrorFlag(error.response.status);
        });
    }

    return (
        <div onClick={() => { navigate("/"); }}
            className="absolute top-0 left-0 h-screen w-screen z-10
        flex items-center justify-center
        bg-neutral-800 bg-opacity-80">
            <div className="card bg-black-denim flex flex-col"
                onClick={(event) => { event.stopPropagation(); }}>
                <form onSubmit={handleSubmit} className="flex flex-row">
                    <input id="username" className="text-input"
                        placeholder="Username" required={true}
                        value={username} onChange={handleUsernameChange} />
                    {/* TODO-high: make all errorflags default to 0,
            and switch to label-based error handling */}
                    <label htmlFor="username" className="text-red-500"
                        children={{
                            0: <div />,
                            401: <p children="Incorrect username or password" />,
                        }[errorFlag]
                            || <p>{`Unrecognized HTTP response: ${errorFlag}`}</p>} />
                    <input className="text-input" placeholder="Password" required={true}
                        value={password} onChange={handlePasswordChange} />
                    <button className="button" type="submit" children="Log In" />
                </form>
                {/* <button className="button w-48" children="(dev) log users"
                    onClick={() => {
                        axios.get(`${url}/users/`).then((response) => {
                            console.log(response.data);
                        });
                    }} /> */}
            </div>
        </div>
    );
}