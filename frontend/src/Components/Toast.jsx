import "../Stylesheets/Toast.scss";

export function Toast(props) {
    return <div id="toast">
        <div>
            <div dangerouslySetInnerHTML={{__html: props.text}}>
            </div>
            <div>
                <button onClick={props.closeToast}>Close</button>
            </div>
        </div>
    </div>
}