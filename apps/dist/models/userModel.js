"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserById = exports.getAllUsers = void 0;
const users = [
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Doe', email: 'jane@example.com' }
];
const getAllUsers = () => {
    return users;
};
exports.getAllUsers = getAllUsers;
const getUserById = (id) => {
    return users.find(user => user.id === id);
};
exports.getUserById = getUserById;
