import { validate } from "email-validator";
import { PasswordMeter } from "password-meter";
import { useRef, useState } from "react";
import { BiError } from "react-icons/bi";
import { Link } from "react-router-dom";
import { registerUser } from "../../API/User";
import { AuthPageContainer } from "../../Components/AuthPageContainer";
import { Button } from "../../Components/Button";
import { EmailInput, TextInput } from "../../Components/TextInput";

export function RegisterPage(props) {
    let [name, setName] = useState("");
    let [email, setEmail] = useState("");
    let [password, setPassword] = useState("");
    let [passwordRepeat, setPasswordRepeat] = useState("");

    let [defaultLook, setDefaultLook] = useState("");

    let errors = [];
    let [emailsInUse, setEmailsInUse] = useState(["tes@test.com"]);
    let nameLook = defaultLook, emailLook = defaultLook, passwordLook = defaultLook, passwordRepeatLook = "";

    if (email.length > 0) {
        let validEmail = validate(email);
        emailLook = validEmail ? "valid" : "error";
        if (!validEmail) errors.push("Invalid email");
        if (emailsInUse.indexOf(email) !== -1) {
            errors.push("E-Mail already in use")
            emailLook = "error";
        }
    }

    let passwordStrengthPercent = 0, passwordStrengthText = "None";
    if (password.length > 0) {
        let res = new PasswordMeter().getResult(password);
        passwordStrengthPercent = res.percent;
        let map = new Map();
        map.set("veryWeak", "Very weak");
        map.set("weak", "Weak");
        map.set("medium", "Medium");
        map.set("strong", "Strong");
        map.set("veryStrong", "Very strong");
        map.set("perfect", "Perfect");
        passwordStrengthText = map.get(res.status);
    }

    if (password.length > 0) {
        if (passwordStrengthPercent < 60) {
            errors.push("Password too weak")
            passwordLook = "error";
        } else {
            passwordLook = "valid";
        }
    }

    if (passwordRepeat.length > 0) {
        if (password !== passwordRepeat) {
            errors.push("Passwords don't match")
            passwordRepeatLook = "error";
        } else {
            passwordRepeatLook = "valid";
        }
    }

    if (name.length >= 2) {
        nameLook = "valid";
    } else if (emailLook === passwordLook && emailLook === passwordRepeatLook && emailLook === "valid") {
        nameLook = "error";
        errors.push("Invalid name")
    }

    if (defaultLook !== "") {
        // if (nameLook !== "valid") errors.push("Invalid name");
        // if (emailLook !== "valid") errors.push("Invalid email");
        // if (passwordLook !== "valid") errors.push("Invalid password");
        if (name.length === 0) errors.push("Invalid name");
        if (email.length === 0) errors.push("Invalid email");
        if (password.length === 0) errors.push("Invalid password");
    }

    return <AuthPageContainer>
        <span className="authPageHeading">Register</span>
        <span className="authPageSubtitle">Already have an account? <Link to="/login">Log In</Link></span>
        <TextInput title="Name" setter={setName} spellcheck={false} look={nameLook} />
        <TextInput title="E-Mail" setter={setEmail} spellcheck={false} look={emailLook} />
        <TextInput title="Password" setter={setPassword} type="password" spellcheck={false} look={passwordLook} />
        <TextInput title="Repeat Password" setter={setPasswordRepeat} type="password" spellcheck={false} look={passwordRepeatLook} />
        <div className="authPageInfoBox">
            <div>
                <span>Password Strength:</span>
                <span>{passwordStrengthText}</span>
            </div>
            <div>
                <div style={{ width: passwordStrengthPercent + "%" }} />
            </div>
            <div>
                {errors.map((error) =>
                    <div>
                        <BiError /> <span>{error}</span>
                    </div>
                )}
            </div>
        </div>
        <Button large text="Register" onClick={() => {
            if (password.length === 0 || email.length === 0 || name.length === 0) {
                setDefaultLook("error");
            }

            if ((nameLook === emailLook && emailLook === passwordLook && emailLook === passwordRepeatLook && emailLook === "valid")
            || (email === "demo" && password === "demo")) {
                let requestedEmail = email;
                registerUser(name, requestedEmail, password).then(() => {
                    // alert("Registrierung erfolgreich.");
                    props.login("/app");
                }).catch((errors) => {
                    let errorsList = [];
                    for (let err of errors) {
                        if (err === "email_in_use") {
                            let newEmailsInUse = emailsInUse.slice();
                            newEmailsInUse.push(requestedEmail)
                            setEmailsInUse(newEmailsInUse);
                        } else if (err === "invalid_email") {
                            errorsList.push("Ungültige E-Mail");
                        } else if (err === "invalid_password") {
                            errorsList.push("Ungültiges Passwort");
                        } else {
                            errorsList.push(err);
                        }
                    }

                    if (errorsList.length > 0) {
                        props.setToast(`Registrierung fehlgeschlagen:<ul>${errorsList.map((err) => `<li>${err}</li>`)
                            }</ul>`)
                    }
                });
            }
        }} />
    </AuthPageContainer>
}