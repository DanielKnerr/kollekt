import { MiddlewareFunction } from "http-request-handler";
import Auth from "../models/Auth";

export const userValid: MiddlewareFunction = (request, response, data, resolve, reject) => {
    let isValid = (request.cookies.token !== undefined) && Auth.isValid(request.cookies.token);
    let userID = null;

    if (isValid) {
        userID = Auth.getUserIDBySessionKey(request.cookies.token);
    }

    resolve({
        isValid: isValid,
        userID: userID
    });
}