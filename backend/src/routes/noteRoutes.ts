import { HttpMethod, HTTPRequestHandler } from "http-request-handler";
import Auth from "../models/Auth";
import UserModel from "../models/User";
import { userValid } from "./middleware";

export function initNoteRoutes(handler: HTTPRequestHandler) {
    handler.on(HttpMethod.HTTP_GET, "/notes", [userValid], async (request, response, data) => {
        if (data.isValid) {
            let user = await UserModel.getUserByID(data.userID);
            response.send(user.notes);
        }
    });

    handler.on(HttpMethod.HTTP_POST, "/addNote", [userValid], async (request, response, data) => {
        let json = JSON.parse(request.body);
        if (data.isValid) {
            await UserModel.addNote(data.userID, json.title, json.content);
        }
        response.ok();
    });

    handler.on(HttpMethod.HTTP_POST, "/addLabelToNote", [userValid], async (request, response, data) => {
        let json = JSON.parse(request.body);
        if (data.isValid) {
            await UserModel.addLabelToNote(data.userID, json.noteID, json.labelID);
        }
        response.ok();
    });

    handler.on(HttpMethod.HTTP_POST, "/removeLabelFromNote", [userValid], async (request, response, data) => {
        let json = JSON.parse(request.body);
        if (data.isValid) {
            await UserModel.removeLabelFromNote(data.userID, json.noteID, json.labelID);
        }
        response.ok();
    });

    handler.on(HttpMethod.HTTP_POST, "/updateNote", [userValid], async (request, response, data) => {
        let json = JSON.parse(request.body);
        if (data.isValid) {
            await UserModel.updateNote(data.userID, json.noteID, json.title, json.content, json.labels);
        }
        response.ok();
    });

    handler.on(HttpMethod.HTTP_POST, "/deleteNote", [userValid], async (request, response, data) => {
        let json = JSON.parse(request.body);
        if (data.isValid) {
            await UserModel.deleteNote(data.userID, json.noteID);
        }
        response.ok();
    });
}
