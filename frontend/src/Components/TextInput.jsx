import { useState } from "react";
import "../Stylesheets/TextInput.scss";
import { BiCheck, BiError } from "react-icons/bi";

export function TextInput(props) {
    let [focused, setFocused] = useState(false);
    let type = "text", spellcheck = "true";

    if (props.type !== undefined) {
        type = props.type;
    }

    if (props.spellcheck !== undefined) {
        spellcheck = props.spellcheck;
    }

    let icon = null;
    let classNames = ["textInput"];

    if (focused) classNames.push("textInput--focused");

    if (props.look === "error") {
        classNames.push("textInput--error")
        icon = <BiError />;
    } else if (props.look === "valid") {
        classNames.push("textInput--valid")
        icon = <BiCheck />;
    }

    return <div className={classNames.join(" ")}>
        <span>{props.title}</span>
        <div>
            <input type={type} spellCheck={spellcheck} onChange={(e) => {
                props.setter(e.target.value);
            }} onFocus={() => {
                setFocused(true);
            }}  onBlur={() => {
                setFocused(false);
            }}/>
            { icon }
        </div>
    </div>
}

/*
export function EmailInput(props) {
    let type = "text", spellcheck = "true";

    if (props.type !== undefined) {
        type = props.type;
    }

    if (props.spellcheck !== undefined) {
        spellcheck = props.spellcheck;
    }

    let classNames = ["textInput"];

    let [validEmail, setValidEmail] = useState(null);
    if (validEmail === false) classNames.push("textInput--error");
    if (validEmail === true) classNames.push("textInput--valid");

    return <div className={classNames.join(" ")}>
        <span>{"E-Mail" + (validEmail === false ? " (invalid)" : "")}</span>
        <div>
            <input type={type} spellCheck={spellcheck} onChange={(e) => {
                props.setter(e.target.value);
                setValidEmail(validate(e.target.value));
            }} />
            { validEmail === false ? <BiError /> : (validEmail === true ? <BiCheck /> : null)}
        </div>
    </div>
}
*/