export const ENDPOINT = "http://knerr.xyz:3001/api/";

// von https://www.w3schools.com/js/js_cookies.asp
function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

export async function sendPost(url, data) {
    return new Promise((resolve, reject) => {
        fetch(ENDPOINT + url, {
            method: "POST",
            credentials: "include",
            headers: {
                "CSRF": getCookie("token"),
                "Content-Type": "text/plain",
            },
            body: JSON.stringify(data)
        }).then(async (resp) => {
            resolve(await resp.text());
        }).catch((e) => {
            console.log("Fehler in sendPost");
        });
    });
}

export async function sendGet(url) {
    return new Promise((resolve, reject) => {
        fetch(ENDPOINT + url, {
            method: "GET",
            credentials: "include",
            headers: {
                "CSRF": getCookie("token"),
                "Content-Type": "text/plain"
            }
        }).then(async (resp) => {
            resolve(await resp.text());
        }).catch((e) => {
            console.log("Fehler in sendGet");
        });
    });
}