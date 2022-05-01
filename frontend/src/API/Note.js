import { sendGet, sendPost } from "./API";

export function addNote(title, content) {
    return new Promise((resolve, reject) => {
        sendPost("addNote", {title: title, content: content}).then((data) => {
            resolve();
        });
    });
}

export function getAllNotes() {
    return new Promise((resolve, reject) => {
        sendGet("notes").then((data) => {
            resolve(JSON.parse(data));
        });
    });
}

export function addLabelToNote(noteID, labelID) {
    return new Promise((resolve, reject) => {
        sendPost("addLabelToNote", {noteID: noteID, labelID: labelID}).then((data) => {
            resolve();
        });
    });
}

export function removeLabelFromNote(noteID, labelID) {
    return new Promise((resolve, reject) => {
        sendPost("removeLabelFromNote", {noteID: noteID, labelID: labelID}).then((data) => {
            resolve();
        });
    });
}

export function updateNote(noteID, title, content, labels) {
    return new Promise((resolve, reject) => {
        sendPost("updateNote", {noteID: noteID, title: title, content: content, labels: labels}).then((data) => {
            resolve();
        });
    });
}

export function deleteNote(noteID) {
    return new Promise((resolve, reject) => {
        sendPost("deleteNote", {noteID: noteID}).then((data) => {
            resolve();
        });
    });
}