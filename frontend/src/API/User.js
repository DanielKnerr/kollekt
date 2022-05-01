import { sendGet, sendPost } from "./API";

export function registerUser(name, email, password) {
    return new Promise((resolve, reject) => {
        sendPost("register", { name: name, email: email, password: password }).then((data) => {
            let arr = data.split(",");

            if (data === "ok") {
                resolve();
            } else {
                reject(arr);
            }
        });
    });
}

export function logout() {
    return new Promise((resolve, reject) => {
        sendGet(`logout`).then((data) => {
            resolve()
        }).catch(() => reject());
    });
}
export function loginUser(email, password) {
    return new Promise((resolve, reject) => {
        sendGet(`login/${encodeURIComponent(email)}/${encodeURIComponent(password)}`).then((data) => {
            if (data === "ok") {
                setTimeout(() => {
                    resolve();
                }, 200);
            } else {
                reject();
            }
        });
    });
}

export function isAuthenticated() {
    return new Promise((resolve, reject) => {
        sendGet("isAuthenticated").then((data) => {
            resolve(data === "true");
        });
    });
}

export function addLabel(name, color, textColor) {
    return new Promise((resolve, reject) => {
        sendPost("addLabel", { name: name, color: color, textColor: textColor }).then((data) => {
            resolve();
        });
    });
}

export function updateLabel(labelID, name, color, textColor) {
    return new Promise((resolve, reject) => {
        sendPost("updateLabel", { labelID: labelID, name: name, color: color, textColor: textColor }).then((data) => {
            resolve();
        });
    });
}

export function deleteLabel(labelID) {
    return new Promise((resolve, reject) => {
        sendPost("deleteLabel", { labelID: labelID }).then((data) => {
            resolve();
        });
    });
}

export function getAllLabels() {
    return new Promise((resolve, reject) => {
        sendGet("getLabels").then((data) => {
            resolve(JSON.parse(data));
        });
    });
}