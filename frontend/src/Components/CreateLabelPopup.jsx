import { Popup } from "./Popup";
import "../Stylesheets/CreateLabelPopup.scss";
import { RgbColorPicker } from "react-colorful";
import { useRef, useState } from "react";
import { Button } from "./Button";
import { addLabel, deleteLabel, updateLabel } from "../API/User";

export function CreateLabelPopup(props) {
    // wenn prop.label = null ist, dann ist es ein neues Label, sonst wird ein Label mit dieser ID bearbeitet
    let origColor = { r: 21, g: 76, b: 134 }, origName = "";
    if (props.label !== null) {
        for (let l of props.labels) {
            if (l.id === props.label) {
                origColor = l.color;
                origName = l.name;
            }
        }
    }

    let [color, setColor] = useState(origColor);
    let { r, g, b } = color;
    let isBrightColor = (r * 0.299 + g * 0.587 + b * 0.114) > 150;
    let textColor = isBrightColor ? "#000000" : "#ffffff";
    let brightenFactor = 5, brightenAdd = 40;
    let maxVal = 160;
    const f = (p) => ((color[p] * brightenFactor + brightenAdd) > maxVal) ? maxVal : color[p] * brightenFactor + brightenAdd;
    let brightPlaceholderColor = `rgb(${f("r")}, ${f("g")}, ${f("b")})`

    let nameRef = useRef();

    return <Popup close={props.close} innerClassName="createLabelPopup">
        <span>Choose a name:</span>
        <input defaultValue={origName} placeholder="Name" ref={nameRef} style={{
            backgroundColor: `rgb(${r}, ${g}, ${b})`,
            color: textColor,
            "--placeholder-color": isBrightColor ? `rgb(${r * 0.6}, ${g * 0.6}, ${b * 0.6})` : brightPlaceholderColor
        }} />
        <span>Choose a color:</span>
        <RgbColorPicker color={color} onChange={setColor} />
        <div>
            <Button color="text" text="Cancel" onClick={() => props.close()} />
            {props.label !== null ?
                <Button color="smallRed" text="Delete" onClick={async () => {
                    await deleteLabel(props.label)
                    await props.fetchNotes();
                    props.close(true);
                }} />
                : null}
            <Button color="primary" text={props.label === null ? "Create" : "Save"} onClick={() => {
                if (props.label === null) {
                    addLabel(nameRef.current.value, color, textColor).then(() => {
                        props.close(true);
                    });
                } else {
                    updateLabel(props.label, nameRef.current.value, color, textColor).then(() => {
                        props.close(true);
                    });
                }
            }} />
        </div>

    </Popup>
}