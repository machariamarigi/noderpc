Simple Node RPC project

## Running the app 
- Run the following command

```bash
$ node server.js
```

- Open your postman or your favorite api tool and send a request to `http://localhost:9090/rpc` with the following body:
```
{
    "createUser": {
        "name":"John Doe",
        "age":25
    }
}
```

- The server should create the new user and respond with the results.
