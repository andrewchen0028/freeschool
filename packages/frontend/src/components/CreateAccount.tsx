import { useState } from "react";
import { useNavigate } from "react-router-dom";

import axios from "axios";
import { url } from "..";

export default function CreateAccount() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [emailErrorFlag, setEmailErrorFlag] = useState(0);
    const [usernameErrorFlag, setUsernameErrorFlag] = useState(0);
    const [passwordErrorFlag, setPasswordErrorFlag] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();

    function handleUsernameChange(event: any) {
        setUsername(event.target.value);
        setUsernameErrorFlag(0);
    }

    function handleEmailChange(event: any) {
        setEmail(event.target.value);
        setEmailErrorFlag(0);
    }

    function handlePasswordChange(event: any) {
        setPassword(event.target.value);
    }

    function handleConfirmPasswordChange(event: any) {
        setConfirmPassword(event.target.value);
        setPasswordErrorFlag("");
    }

    function handleShowPassword(event: any) {
        setShowPassword(!showPassword);
    }

    function handleSubmit(event: any) {
        event.preventDefault();

        if (password !== confirmPassword) {
            setPasswordErrorFlag("Passwords don't match");
            return;
        }

        axios.post(`${url}/createAccount`, {
            username: username,
            email: email,
            password: password
        }).then((response) => {
            console.log(response.data);
        }).catch((error) => {
            console.log(error);
            setEmailErrorFlag(error.response.status);
        });
    }

    return (
        <div onClick={() => { navigate("/"); }}
            className="absolute top-0 left-0 h-screen w-screen z-10
        flex items-center justify-center
        bg-neutral-800 bg-opacity-80">
            <div className="card bg-black-denim flex flex-col"
                onClick={(event) => { event.stopPropagation(); }}>
                <h3 className="mx-3 mt-4 p-2">
                    New to Freeschool? <br /> Let's get you started!
                </h3>
                <form onSubmit={handleSubmit} className="flex flex-col">
                    <input id="username" className="text-input mb-0"
                        placeholder="Username" required={true}
                        value={username} onChange={handleUsernameChange} />
                    {/* TODO-high: make all errorflags default to 0,
            and switch to label-based error handling */}
                    <label htmlFor="username" className="text-red-500"
                        children={{
                            0: <div />,
                            409: <p children="Username is taken" />,
                            500: <p children="Internal server error" />
                        }[usernameErrorFlag]
                            || <p>{`Unrecognized HTTP response: ${emailErrorFlag}`}</p>} />
                    <input className="text-input mb-0" placeholder="Email" required={true}
                        value={email} onChange={handleEmailChange} />
                    <label htmlFor="email" className="text-red-500"
                        children={{
                            0: <div />,
                            409: <p children="Email already in use" />,
                            500: <p children="Internal server error" />
                        }[emailErrorFlag]
                            || <p>{`Unrecognized HTTP response: ${emailErrorFlag}`}</p>} />
                    <input className="text-input mb-0" placeholder="Password" required={true}
                        value={password} onChange={handlePasswordChange} />
                    <input className="text-input password-text" placeholder="Confirm Password" required={true}
                        value={confirmPassword} onChange={handleConfirmPasswordChange} />
                    <p className="text-red-500 self-center" > {passwordErrorFlag} </p>
                    <button className="button mb-0" type="submit" children="Create Account" />
                </form>
                <button className="button" children="Show Password" onClick={handleShowPassword}/>
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