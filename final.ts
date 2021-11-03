import { Octokit } from "@octokit/core";

const wait = function (seconds: any) {
  return new Promise(function (resolve) {
    setTimeout(resolve, seconds * 1000);
  });
};

class User {
  name: string;
  octokit: Octokit;
  constructor(n: string, authCode: string) {
    this.name = n;
    this.octokit = new Octokit({
      auth: authCode,
    });
  }
}


class Project {
  name: string;
  info: any;
  user: any;

  constructor(n: string) {
    this.name = n;
  }
}

class Column {
  name: string;
  project: Project;
  info: any;
  position: number;

  constructor(n: string, p: Project, position: number) {
    this.name = n;
    this.project = p;
    this.position = position;
  }
}

class Card {
  name: string;
  note: string;
  column: Column;
  info: any;
  position: number;

  constructor(n: string, note: string, c: Column, position: number) {
    this.name = n;
    this.note = note;
    this.column = c;
    this.position = position;
  }
}

abstract class Deploy {
  static async project(project: Project, user: User) {
    project.info = await user.octokit.request("POST /user/projects", {
      name: project.name,
    });

    project.user = user;
    console.log(project.info.status);
  }

  static async column(column: Column) {
    await wait(2 * column.position);
    column.info = await column.project.user.octokit.request(
      `POST /projects/${column.project.info.data.id}/columns`,
      {
        project_id: column.project.info.data.id,
        name: column.name,
      }
    );
  }

  static async card(card: Card) {
    await wait(2 * card.column.position + card.position);
    card.info = await card.column.project.user.octokit.request(
      `POST /projects/columns/${card.column.info.data.id}/cards`,
      {
        column_id: card.column.info.data.id,
        note: card.note,
      }
    );

    console.log(card.info);
  }
}

const robert = new User("robert", "authcode");
const hello = new Project("Hello Project");

const column1 = new Column("To do", hello, 1);
const column2 = new Column("In progress", hello, 2);
const column3 = new Column("Done", hello, 3);

const card1 = new Card("Hey Column", "Hello there, hope it works", column1, 1);

Deploy.project(hello, robert)
Deploy.column(column1)
Deploy.column(column2)
Deploy.column(column3)
Deploy.card(card1)
