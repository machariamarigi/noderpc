"use strict";

let db = require("./db");

let methods = {
  createUser: {
    description: "creates new user and returns details about the user",
    params: ["user:the user object"],
    returns: ["user"],
    exec(userObj) {
      return new Promise((resolve) => {
        if (typeof userObj !== "object") {
          throw new Error("was expecting an object");
        }

        let _userObj = JSON.parse(JSON.stringify(userObj));
        _userObj.id = (Math.random() * 10000000) | 0;
        resolve(db.users.save(userObj));
      });
    },
  },

  fetchAllUsers: {
    released: false,
    description: "fetches the entire list of users",
    params: [],
    returns: ["userscollection"],
    exec() {
      return new Promise((resolve) => {
        resolve(db.users.fetchAll());
      });
    },
  },
};

module.exports = methods;
