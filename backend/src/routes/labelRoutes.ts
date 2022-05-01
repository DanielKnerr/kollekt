import { HTTPRequestHandler, HttpMethod } from "http-request-handler";
import UserModel from "../models/User";
import { userValid } from "./middleware";

export function initLabelRoutes(handler: HTTPRequestHandler) {
    handler.on(HttpMethod.HTTP_POST, "/addLabel", [userValid], async (request, response, data) => {
        let json = JSON.parse(request.body);
        if (data.isValid) {
            await UserModel.addLabel(data.userID, json.name, json.color, json.textColor);
        }
        response.ok();
    });

    handler.on(HttpMethod.HTTP_POST, "/updateLabel", [userValid], async (request, response, data) => {
        let json = JSON.parse(request.body);
        if (data.isValid) {
            await UserModel.updateLabel(data.userID, json.labelID, json.name, json.color, json.textColor);
        }
        response.ok();
    });

    handler.on(HttpMethod.HTTP_POST, "/deleteLabel", [userValid], async (request, response, data) => {
        let json = JSON.parse(request.body);
        if (data.isValid) {
            await UserModel.deleteLabel(data.userID, json.labelID);
        }
        response.ok();
    });

    handler.on(HttpMethod.HTTP_GET, "/getLabels", [userValid], async (request, response, data) => {
        if (data.isValid) {
            response.send((await UserModel.getUserByID(data.userID)).labels);
        } else {
            response.ok();
        }
    });
}