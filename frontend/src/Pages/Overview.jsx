import "../Stylesheets/Overview.scss";
import { AddNoteInput } from "../Components/AddNoteInput";
import Masonry from "react-masonry-css";
import { useState } from "react";
import { NoteEditPopup } from "../Components/NoteEditPopup";
import { TopBar } from "../Components/TopBar";

function NoteElement(props) {
    return <div className="overview__note" onClick={props.onClick}>
        {
            props.data.title.length > 0 ? <span className="overview__note__title">{props.data.title}</span> : null
        }
        <span className="overview__note__content">{props.data.content}</span>
    </div>
}

export function OverviewPage(props) {
    let [notePopup, setNotePopup] = useState(null);

    return <div id="overview">
        <TopBar>
                <AddNoteInput fetchNotes={props.fetchNotes} />
        </TopBar>
        <Masonry
            breakpointCols={4}
            className="overview__grid"
            columnClassName="overview__grid__col">
            {
                props.notes.map((note) => {
                    return <NoteElement data={note} key={note.id} onClick={() => {
                        setNotePopup(note.id);
                    }} />
                })
            }
        </Masonry>
        {
            notePopup !== null ? <NoteEditPopup notes={props.notes} fetchNotes={props.fetchNotes} fetchLabels={props.fetchLabels} labels={props.labels} noteID={notePopup} close={() => setNotePopup(null)} /> : null
        }
    </div>
}