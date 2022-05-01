import { Link } from "react-router-dom";
import { loginUser } from "../../API/User";
import { AuthPageContainer } from "../../Components/AuthPageContainer";
import { Button } from "../../Components/Button";
import "../../Stylesheets/Auth/Entry.scss";

export function EntryPage(props) {
    return <AuthPageContainer>
        <div className="entryPage">
            <Link to="/login">Log In</Link>
            <div />
            <Link to="/register">Register</Link>
        </div>
        <div id="authPage__demo">
            <Button color="text" text="mit Demo-Account einloggen" onClick={() => {
                loginUser("demo", "demo").then(() => {
                    props.login("/app");
                }).catch(() => {
                    alert("Fehler beim Einloggen.");
                });
            }} />
        </div>
    </AuthPageContainer>
}