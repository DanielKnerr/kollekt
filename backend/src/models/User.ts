import { Collection, ObjectId } from "mongodb";
import bcrypt from "bcrypt";
const saltRounds = 10;

type Note = {
    title: string,
    content: string,
    favorite: boolean,
    lastEdit: number,
    labels: string[],
    id: number
};

type Label = {
    name: string,
    id: number,
    color: string,
    textColor: string
};

type User = {
    _id: ObjectId,
    email: string,
    passwordHash: string,
    name: string,
    labels: Label[],
    notes: Note[]
};

type NewUser = Omit<User, "_id">;

export default class UserModel {
    private static collection: Collection;

    static init(collection: Collection) {
        this.collection = collection;
    }

    static async exists(email: string): Promise<boolean> {
        let arr = await this.collection.find({
            email: email
        }).toArray();

        return arr.length > 0;
    }

    static async getUserByID(userID: string): Promise<User> {
        let res = await this.collection.find({
            _id: new ObjectId(userID)
        }).toArray();

        if (res.length === 0) {
            throw new Error("");
        } else {
            return (res[0] as unknown) as User;
        }
    }

    static async getUserByEmail(email: string): Promise<User> {
        let res = await this.collection.find({
            email: email
        }).toArray();

        if (res.length === 0) {
            throw new Error("");
        } else {
            return (res[0] as unknown) as User;
        }
    }

    static async createAccount(name: string, email: string, password: string) {
        let salt = await bcrypt.genSalt(saltRounds);
        let hash = await bcrypt.hash(password, salt);

        let user: NewUser = {
            email: email,
            passwordHash: hash,
            name: name,
            labels: [],
            notes: []
        };

        await this.collection.insertOne(user);
    }

    static async addNote(userID: string, title: string, content: string) {
        let user = await this.getUserByID(userID);
        let maxID = -1;
        for (let note of user.notes) {
            if (note.id > maxID) maxID = note.id;
        }

        let note: Note = {
            title: title,
            content: content,
            lastEdit: Date.now(),
            favorite: false,
            labels: [],
            id: maxID + 1
        };

        await this.collection.updateOne({
            _id: new ObjectId(userID)
        }, {
            $push: {
                notes: note
            }
        });
    }

    static async addLabel(userID: string, name: string, color: string, textColor: string) {
        let user = await this.getUserByID(userID);
        let maxID = -1;
        for (let label of user.labels) {
            if (label.id > maxID) maxID = label.id;
        }

        let label: Label = {
            name: name,
            color: color,
            textColor: textColor,
            id: maxID + 1
        };

        await this.collection.updateOne({
            _id: new ObjectId(userID)
        }, {
            $push: {
                labels: label
            }
        });
    }

    static async updateLabel(userID: string, labelID: number, name: string, color: string, textColor: string) {
        await this.collection.updateOne({
            "_id": new ObjectId(userID)
        }, {
            "$set": {
                "labels.$[outer].name": name,
                "labels.$[outer].color": color,
                "labels.$[outer].textColor": textColor,
            }
        }, {
            "arrayFilters": [
                { "outer.id": labelID }
            ]
        });
    }

    static async deleteLabel(userID: string, labelID: number) {
        // @ts-ignore
        await this.collection.updateMany({
            "_id": new ObjectId(userID)
        }, {
            // @ts-ignore
            $pull: {
                "notes.$[outer].labels": {
                    $in: [labelID]
                },
                "labels": {
                    "id": labelID
                }
            }
        }, {
            "arrayFilters": [
                {
                    "outer.labels": {
                        $in: [labelID]
                    }
                }
            ]
        });
    }

    static async addLabelToNote(userID: string, noteID: string, labelID: string) {
        // siehe https://stackoverflow.com/questions/29634150/updating-nested-array-inside-array-mongodb

        await this.collection.updateOne({
            _id: new ObjectId(userID),
            "notes": {
                "$elemMatch": {
                    "id": noteID
                }
            }
        }, {
            "$push": {
                "notes.$[outer].labels": labelID
            }
        }, {
            "arrayFilters": [
                { "outer.id": noteID }
            ]
        });
    }

    static async removeLabelFromNote(userID: string, noteID: string, labelID: string) {
        // remove
        await this.collection.updateOne({
            "_id": new ObjectId(userID),
            "notes": {
                "$elemMatch": {
                    "id": noteID
                }
            }
        }, {
            "$pull": {
                "notes.$[outer].labels": {
                    $in: [labelID]
                }
            }
        }, {
            "arrayFilters": [
                { "outer.id": noteID }
            ]
        });
    }

    static async updateNote(userID: string, noteID: string, title: string, content: string, labels: number[]) {
        await this.collection.updateOne({
            "_id": new ObjectId(userID),
            "notes": {
                "$elemMatch": {
                    "id": noteID
                }
            }
        }, {
            "$set": {
                "notes.$[outer].title": title,
                "notes.$[outer].content": content,
                "notes.$[outer].labels": labels,
            }
        }, {
            "arrayFilters": [
                { "outer.id": noteID }
            ]
        });
    }

    static async deleteNote(userID: string, noteID: string) {
        await this.collection.updateMany({
            "_id": new ObjectId(userID)
        }, {
            // @ts-ignore
            "$pull": {
                notes: {
                    // @ts-ignore
                    id: noteID
                }
            }
        });
    }
}