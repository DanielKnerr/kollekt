import { HTTPRequestHandler, HttpMethod } from "http-request-handler";
import Auth from "../models/Auth";
import UserModel from "../models/User";
import { userValid } from "./middleware";

function validateEmailAndPassword(email: any, password: any) {
    if (email === "demo" && password === "demo") return;

    let errors = [];
    if (email.length < 4) {
        errors.push("invalid_email");
    }

    if (password.length < 4) {
        errors.push("invalid_password");
    }

    if (errors.length > 0) {
        throw new Error(errors.join(","));
    }
}

export function initUserRoutes(handler: HTTPRequestHandler) {
    handler.on(HttpMethod.HTTP_POST, "/register", [], async (request, response) => {
        try {
            let json = JSON.parse(request.body);
            validateEmailAndPassword(json.email, json.password);
            let email: string = <string>json.email;
            let password: string = <string>json.password;
            let name: string = <string>json.name;

            if (await UserModel.exists(email)) {
                throw new Error("email_in_use");
            } else {
                await UserModel.createAccount(name, email, password);

                try {
                    let sessionKey = await Auth.authenticate(email, password);
                    response.setCookie("token", sessionKey, {
                        Secure: true,
                        Path: "/",
                        SameSite: "None"
                    });
                    response.send("ok");
                } catch (e) {
                    throw new Error("failed to authenticate")
                }
            }
        } catch (e) {
            if (e instanceof Error) {
                let err = <Error>e;
                response.send(err.message, 500);
                console.log(err.message);
            } else {
                response.send("unknown_error", 500);
            }
        }
    });

    handler.on(HttpMethod.HTTP_GET, "/isAuthenticated", [userValid], (request, response, data) => {
        response.send(data.isValid);
    });

    handler.on(HttpMethod.HTTP_GET, "/login/:email/:password", [], async (request, response) => {
        let email = decodeURIComponent(request.urlParameters.email);
        let password = decodeURIComponent(request.urlParameters.password);

        try {
            let sessionKey = await Auth.authenticate(email, password)
            response.setCookie("token", sessionKey, {
                Secure: true,
                Path: "/",
                SameSite: "None"
            });
            response.send("ok");
        } catch (e) {
            response.send("invalid", 500);
        }
    });

    handler.on(HttpMethod.HTTP_GET, "/logout", [userValid], async (request, response, data) => {
        if (data.isValid) {
            Auth.logoutUser(data.userID);
            response.send("ok");
        }
    });
}