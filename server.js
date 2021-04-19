let http = require("http");
let url = require("url");
let methods = require("./methods");
let types = require("./types");

// simple routing mechanism
let routes = {
  // this is the rpc endpoint
  // every operation request will pass through here
  "/rpc": function (body) {
    return new Promise((resolve, reject) => {
      if (!body) {
        throw new Error("rpc request was expecting some data...!");
      }

      let _json = JSON.parse(body);
      let keys = Object.keys(_json);
      let promiseArr = [];

      for (let key of keys) {
        if (methods[key] && typeof methods[key].exec === "function") {
          let execPromise = methods[key].exec.call(null, _json[key]);
          if (!(execPromise instanceof Promise)) {
            throw new Error(`exec on ${key} did not return a promise`);
          }

          promiseArr.push(execPromise);
        }
      }

      Promise.all(promiseArr).then((iter) => {
        console.log(iter);

        let response = {};

        iter.forEach((val, index) => {
          response[keys[index]] = val;
        });

        resolve(response);
      });
    });
  },

  // docs endpoint
  // allows for clients to know what types and methods are available
  "./describe": function () {
    return new Promise((resolve) => {
      let typeDesc = {};
      let methodDesc = {};

      typeDesc = types;

      for (let method in methods) {
        let _method = JSON.parse(JSON.stringify(methods[method]));
        methodDesc[method] = _method;
      }

      resolve({
        types: typeDesc,
        methods: methodDesc,
      });
    });
  },
};

function requestListener(request, response) {
  let requestUrl = `http://${request.headers.host}${request.url}`;
  let parseUrl = url.parse(requestUrl, true);
  let pathName = parseUrl.pathname;

  response.setHeader("Content-Type", "application/json");

  let buff = null;

  request.on("data", (data) => {
    if (buff === null) {
      buff = data;
    } else {
      buff = buff + data;
    }
  });

  request.on("end", () => {
    console.log(pathName)
    let body = buff !== null ? buff.toString() : null;

    if (routes[pathName]) {
      let compute = routes[pathName].call(null, body);

      if (!compute instanceof Promise) {
        response.statusCode = 500;
        response.end("Server Error!");
        console.warn("rpc did not return promise");
      } else {
        compute
          .then((res) => {
            response.end(JSON.stringify(res));
          })
          .catch((err) => {
            console.error(err);
            response.statusCode = 500;
            response.end("Server Error!");
          });
      }
    } else {
      response.statusCode = 404;
      response.end(`${pathName} not found`);
    }
  });
}

let server = http.createServer(requestListener);
const PORT = process.env.PORT || 9090;
server.listen(PORT);
