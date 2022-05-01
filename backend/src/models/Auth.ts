import UserModel from "./User";
import bcrypt from "bcrypt";
import crypto from "crypto";
import fs from "fs";

const TOKENS_FILE = "tokens.json";

type SessionKey = {
    key: string,
    userID: string,
    created: number
};

export default class Auth {
    static sessionKeys: SessionKey[] = [];

    static init() {
        if (fs.existsSync(TOKENS_FILE)) {
            this.sessionKeys = JSON.parse(fs.readFileSync(TOKENS_FILE).toString());
        }
    }

    static save() {
        let str = JSON.stringify(this.sessionKeys);
        fs.writeFileSync(TOKENS_FILE, str);
    }

    static removeSessionKeysByID(userID: string) {
        this.sessionKeys = this.sessionKeys.filter((sessionKey) => sessionKey.userID !== userID)
    }

    static addSessionKeyForID(userID: string): string {
        let newKey: SessionKey = {
            userID: userID,
            created: Date.now(),
            key: crypto.randomBytes(32).toString('hex')
        };

        this.sessionKeys.push(newKey);
        return newKey.key;
    }

    static getUserIDBySessionKey(key: string): string {
        for (let sessionKey of this.sessionKeys) {
            if (sessionKey.key === key) return sessionKey.userID;
        }
        throw new Error("");
    }

    static isValid(key: string): boolean {
        try {
            this.getUserIDBySessionKey(key);
            return true;
        } catch (e) {
            return false;
        }
    }

    static logoutUser(userID: string): void {
        this.sessionKeys = this.sessionKeys.filter((value) =>
            value.userID !== userID
        );
    }

    static async authenticate(email: string, password: string): Promise<string> {
        let user = await UserModel.getUserByEmail(email);
        let correct = await bcrypt.compare(password, user.passwordHash);

        if (!correct) {
            throw new Error();
        } else {
            this.removeSessionKeysByID(user._id.toString());
            let newKey = this.addSessionKeyForID(user._id.toString());
            return newKey;
        }
    }
}