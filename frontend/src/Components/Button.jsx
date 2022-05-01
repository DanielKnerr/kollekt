import "../Stylesheets/Button.scss";

export function Button(props) {
    let classNames = ["button"];
    if (props.large) classNames.push("button--large");
    if (props.color === "secondary") classNames.push("button--secondary");
    else if (props.color === "text") classNames.push("button--text");
    else if (props.color === "smallPrimary") classNames.push("button--smallPrimary");
    else if (props.color === "smallRed") classNames.push("button--smallRed");
    else classNames.push("button--primary");

    let style = {};
    if (props.noColorTransition) {
        style = {
            transition: "background-color 0.0s"
        };
    }

    return <button className={classNames.join(" ")} onClick={props.onClick} style={style}>
        {props.text}
    </button>
}