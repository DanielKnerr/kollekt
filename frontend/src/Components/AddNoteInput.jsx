import { useRef, useState } from "react";
import "../Stylesheets/AddNoteInput.scss";
import { HiPlus } from "react-icons/hi";
import { addNote } from "../API/Note";
import { useOutsideAlerter } from "../util";

// https://stackoverflow.com/a/1431110
function setCharAt(str, index, chr) {
    if (index > str.length - 1) return str;
    return str.substring(0, index) + chr + str.substring(index + 1);
}

export function AddNoteInput(props) {
    const animDuration = 100;
    const slowAnimDuration = 250;

    let addNoteText = "Add Note";
    let contentText = "Content ";

    let [isOpen, setOpen] = useState(false);
    let [animState, setAnimState] = useState(0);
    let titleRef = useRef(), contentRef = useRef();
    let [placeholder, setPlaceholder] = useState(addNoteText);

    let isOpenRef = useRef(), placeholderRef = useRef();
    isOpenRef.current = isOpen;
    placeholderRef.current = placeholder;

    let classNames = ["addNoteInput"];
    if (animState > 0) classNames.push("addNoteInput--open");
    if (animState > 1) classNames.push("addNoteInput--open-center");

    const transitionText = (newText) => {
        let i = 0;
        let interval = setInterval(() => {
            setPlaceholder(setCharAt(placeholderRef.current, i, newText[i]));
            i++;
            if (i === newText.length) {
                clearInterval(interval);
            }
        }, 40);
    }

    const playOpenAnimation = () => {
        setAnimState(1);
        setTimeout(() => {
            transitionText(contentText);
            setAnimState(2);
            contentRef.current.focus();
        }, animDuration);
        setOpen(true);
    }

    const playCloseAnimation = () => {
        setAnimState(1);
        setTimeout(() => {
            setAnimState(0);
        }, slowAnimDuration);
        setOpen(false);
        transitionText(addNoteText);
    }

    const wrapperRef = useRef();
    useOutsideAlerter(wrapperRef, (outside) => {
        if (isOpenRef.current && outside) {
            if (titleRef.current.value.trim().length === 0 && contentRef.current.value.trim().length === 0) {
                playCloseAnimation();
            }
        } else if (!isOpenRef.current && !outside) {
            playOpenAnimation();
        }
    });

    let close = () => {
        titleRef.current.value = "";
        contentRef.current.value = "";
        playCloseAnimation();
    };

    return <div
        className={classNames.join(" ")}
        ref={wrapperRef}
    >
        <input
            placeholder="Title"
            className="addNoteInput__title"
            ref={titleRef} />
        <textarea
            placeholder={placeholder}
            className="addNoteInput__content"
            ref={contentRef}
            onFocus={() => {
                if (!isOpen) {
                    playOpenAnimation();
                }
            }}
        />
        <div
            className="addNoteInput__button"
        >
            <button className="addNoteInput__button__cancel" onClick={() => {
                close();
            }}>Cancel</button>
            <button className="addNoteInput__button__add" onClick={async () => {
                await addNote(titleRef.current.value, contentRef.current.value);
                props.fetchNotes();
                close();
            }}><HiPlus />
                <span>Add</span>
            </button>
        </div>
    </div>
}