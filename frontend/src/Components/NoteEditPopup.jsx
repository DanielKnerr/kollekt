import { useRef, useState } from "react";
import "../Stylesheets/NoteEditPopup.scss";
import { useOutsideAlerter } from "../util";
import { Button } from "./Button";
import { ImCross } from "react-icons/im";
import { Popup } from "./Popup";
import { CreateLabelPopup } from "./CreateLabelPopup";
import { deleteNote, updateNote } from "../API/Note";

function Label(props) {
    return <div className="noteEditPopup__label"
        onClick={props.onClick}
        style={{
            backgroundColor: `rgb(${props.label.color.r}, ${props.label.color.g}, ${props.label.color.b})`,
            color: props.label.textColor
        }}>
        <span>{props.label.name}</span> <ImCross />
    </div>
}

function SelectableLabel(props) {
    return <div className="noteEditPopup__labelSelection__label" onClick={props.onClick}>
        <div style={{
            backgroundColor: `rgb(${props.label.color.r}, ${props.label.color.g}, ${props.label.color.b})`,
            color: props.label.textColor
        }}>
            + {props.label.name}
        </div>
    </div>
}

export function NoteEditPopup(props) {
    let [createLabel, setCreateLabel] = useState(false);

    let wrapperRef = useRef();
    let createLabelRef = useRef(createLabel);
    createLabelRef.current = createLabel;
    useOutsideAlerter(wrapperRef, (outside) => {
        if (outside && !createLabelRef.current) {
            console.log("close bc click outside");
            props.close();
        }
    });

    let note = {};
    for (let n of props.notes) {
        if (n.id === props.noteID) {
            note = n;
        }
    }

    let [noteLabels, setNoteLabels] = useState(note.labels);
    let [addLabelOpen, setAddLabelOpen] = useState(false);
    let titleRef = useRef(), contentRef = useRef();

    const findLabelByID = (labelID) => {
        for (let label of props.labels) {
            if (label.id === labelID) return label;
        }
        return { color: {} };
    };

    return <>
        {createLabel ? <CreateLabelPopup label={null} labels={props.labels} close={(added) => {
            if (added === true) {
                props.fetchLabels();
            }
            setCreateLabel(false)
        }} /> : null}
        <Popup close={() => {
            props.close();
        }} innerClassName="noteEditPopup" style={{
            visibility: createLabel ? "hidden" : "unset"
        }}>
            <input id="noteEditPopup__title" placeholder="Title" defaultValue={note.title} ref={titleRef} />
            <textarea id="noteEditPopup__content" placeholder="Content" defaultValue={note.content} ref={contentRef} />
            <div id="noteEditPopup__labels">
                <div>
                    <span>Labels</span>
                </div>
                <div>
                    {noteLabels.length === 0 ?
                        <span>No Labels</span>
                        : noteLabels.map((labelID) =>
                            <Label label={findLabelByID(labelID)} onClick={async () => {
                                let newNoteLabels = noteLabels.slice();
                                let idx = newNoteLabels.indexOf(labelID);
                                if (idx !== -1) {
                                    newNoteLabels.splice(idx, 1);
                                }
                                setNoteLabels(newNoteLabels);
                            }} />
                        )
                    }
                    <Button text={addLabelOpen ? "Close Dialog" : "Add Label"} color={addLabelOpen ? "smallRed" : "text"} noColorTransition onClick={() => {
                        setAddLabelOpen(!addLabelOpen);
                    }} />
                </div>
            </div>
            {
                addLabelOpen ?
                    <div id="noteEditPopup__labelSelection">
                        <div>
                            <span>Add a label:</span>
                        </div>
                        <div>
                            {
                                props.labels.map((label) => {
                                    if (noteLabels.indexOf(label.id) === -1) {
                                        return <SelectableLabel label={label} onClick={async () => {
                                            let newNoteLabels = noteLabels.slice();
                                            newNoteLabels.push(label.id);
                                            setNoteLabels(newNoteLabels);
                                        }} />
                                    } else {
                                        return null;
                                    }
                                })
                            }
                            <Button text="Create Label" color="text" onClick={() => {
                                setCreateLabel(true);
                            }} />
                        </div>
                    </div>
                    : null
            }
            <div id="noteEditPopup__buttons">
                <Button text="Delete" color="smallRed" onClick={async () => {
                    await deleteNote(note.id);
                    props.fetchNotes();
                    props.close()
                }} />
                <div id="noteEditPopup__buttons__space" />
                <Button text="Cancel" color="text" onClick={() => props.close()} />
                <Button text="Save" color="primary" onClick={async () => {
                    await updateNote(note.id, titleRef.current.value, contentRef.current.value, noteLabels);
                    props.fetchNotes();
                    props.close();
                }} />
            </div>
        </Popup>
    </>
}