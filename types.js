"use strict";

let types = {
  user: {
    description: "details of the user",
    props: {
      name: ["string", "required"],
      age: ["number"],
      email: ["string", "required"],
      password: ["string", "required"],
    },
  },
  task: {
    description: "a task entered by a user to be done at a later time",
    props: {
      userid: ["string", "required"],
      content: ["string", "required"],
      expires: ["date", "required"],
    },
  },
};

module.exports = types;
