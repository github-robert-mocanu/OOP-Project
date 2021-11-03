"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@octokit/core");
const wait = function (seconds) {
    return new Promise(function (resolve) {
        setTimeout(resolve, seconds * 1000);
    });
};
class User {
    constructor(n, authCode) {
        this.name = n;
        this.octokit = new core_1.Octokit({
            auth: authCode,
        });
    }
}
class Project {
    constructor(n) {
        this.name = n;
    }
}
class Column {
    constructor(n, p, position) {
        this.name = n;
        this.project = p;
        this.position = position;
    }
}
class Card {
    constructor(n, note, c, position) {
        this.name = n;
        this.note = note;
        this.column = c;
        this.position = position;
    }
}
class Deploy {
    static project(project, user) {
        return __awaiter(this, void 0, void 0, function* () {
            project.projectData = yield user.octokit.request("POST /user/projects", {
                name: project.name,
            });
            project.user = user;
            console.log(project.projectData.status);
        });
    }
    static column(column) {
        return __awaiter(this, void 0, void 0, function* () {
            yield wait(2 * column.position);
            column.columnData = yield column.project.user.octokit.request(`POST /projects/${column.project.projectData.data.id}/columns`, {
                project_id: column.project.projectData.data.id,
                name: column.name,
            });
        });
    }
    static card(card) {
        return __awaiter(this, void 0, void 0, function* () {
            yield wait(2 * card.column.position + card.position);
            card.cardData = yield card.column.project.user.octokit.request(`POST /projects/columns/${card.column.columnData.data.id}/cards`, {
                column_id: card.column.columnData.data.id,
                note: card.note,
            });
            console.log(card.cardData);
        });
    }
}
const robert = new User("robert", "authCode");
const hello = new Project("Hello Project");
const column1 = new Column("To do", hello, 1);
const column2 = new Column("In progress", hello, 2);
const column3 = new Column("Done", hello, 3);
const card1 = new Card("Hey Column", "Hello there, hope it works", column1, 1);
Deploy.project(hello, robert);
Deploy.column(column1);
Deploy.column(column2);
Deploy.column(column3);
Deploy.card(card1);
