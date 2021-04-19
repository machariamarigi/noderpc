"use strict"

let users = {}
let tasks = {}

function clone(obj) {
    // simple way to deep clone an object in JS
    return JSON.parse(JSON.stringify(obj))
}

// function to hand CRUD operations
function proc(container) {
    return {
        save(obj) {
            let _obj = clone(obj)

            if(!_obj.id) {
                _obj.id = (Math.random() * 10000000) | 0
            }

            container[_obj.id.toString()] = _obj

            return clone(_obj)
        },

        fetchUser(id) {
            return clone(container[id.toString()])
        },

        fetchAll() {
            let _bunch = []
            for (let item in container) {
                _bunch.push(clone(container[item]))
            }

            return _bunch
        },

        unset(id) {
            delete container[id]
        }
    }
}

let db = {
    users: proc(users),
    tasks: proc(tasks)
}

module.exports = db
