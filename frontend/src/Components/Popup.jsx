import "../Stylesheets/Popup.scss";

export function Popup(props) {
    return <div className="popupOuter" style={props.style ? props.style : {}}>
        <div className={"popup " + (props.innerClassName ? props.innerClassName : "")}>
            {props.children}
        </div>
    </div>
}