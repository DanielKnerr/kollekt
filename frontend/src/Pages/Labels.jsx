import "../Stylesheets/Labels.scss";
import { TopBar } from "../Components/TopBar";
import { Button } from "../Components/Button";
import { useState } from "react";
import { CreateLabelPopup } from "../Components/CreateLabelPopup";

export function Labels(props) {
    let [labelPopup, setLabelPopup] = useState(-1);

    return <div id="labels">
        <TopBar />
        <span id="labels__heading">Labels</span>
        {
            props.labels.length > 0 ?
                props.labels.map((label) => <div className="labels__label" style={{
                    color: label.textColor,
                    backgroundColor: `rgb(${label.color.r}, ${label.color.g}, ${label.color.b})`
                }} onClick={() => {
                    setLabelPopup(label.id);
                }}>{label.name}</div>)
                : <span id="labels__noLabels">No Labels</span>
        }

        <Button color="primary" text="Create new Label" onClick={() => {
            setLabelPopup(null);
        }} />
        {
            (labelPopup !== -1) ? <CreateLabelPopup close={(changed) => {
                if (changed === true) props.fetchLabels();
                setLabelPopup(-1);
            }} label={labelPopup} fetchNotes={props.fetchNotes} labels={props.labels} /> : null
        }
    </div>
}