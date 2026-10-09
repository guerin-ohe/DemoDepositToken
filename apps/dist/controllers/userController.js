"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserById = exports.getUsers = void 0;
const userModel_1 = require("../models/userModel");
const getUsers = (req, res) => {
    const users = (0, userModel_1.getAllUsers)();
    res.render('users', { users });
};
exports.getUsers = getUsers;
const getUserById = (req, res) => {
    console.log(`INPUT : ${req.params.id[1]}`);
    const userId = Number(req.params.id[1]);
    console.log(`GET : ${userId.toString()}`);
    const user = (0, userModel_1.getUserById)(userId);
    res.render('user', { user });
};
exports.getUserById = getUserById;
