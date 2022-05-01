import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { loginUser } from "../../API/User";
import { AuthPageContainer } from "../../Components/AuthPageContainer";
import { Button } from "../../Components/Button";
import { TextInput } from "../../Components/TextInput";

export function LogInPage(props) {
    // state ist die location zum redirect nach successful login
    // null wenn nix
    const { state } = useLocation();

    let [email, setEmail] = useState("");
    let [password, setPassword] = useState("");

    return <AuthPageContainer>
        <span className="authPageHeading">Log In</span>
        <span className="authPageSubtitle">Don't have an account? <Link to="/register">Register</Link></span>
        <TextInput title="E-Mail" setter={setEmail} spellcheck={false} />
        <TextInput title="Password" type="password" setter={setPassword} spellcheck={false} />
        <div className="authPageButtons">
            <Button color="text" text="Demo-Account" onClick={() => {
                loginUser("demo", "demo").then(() => {
                    if (state !== null) props.login(state);
                    else props.login("/app");
                }).catch(() => {
                    alert("Fehler beim Einloggen.");
                });
            }} />
            <Button text="Log In" onClick={() => {
                loginUser(email, password).then(() => {
                    if (state !== null) props.login(state);
                    else props.login("/app");
                }).catch(() => {
                    alert("Fehler beim Einloggen.");
                })
            }} />
        </div>
    </AuthPageContainer>
}