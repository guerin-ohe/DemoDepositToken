"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const ejs_1 = __importDefault(require("ejs"));
const appRoutes_1 = __importDefault(require("./routes/appRoutes"));
const app = (0, express_1.default)();
// static file render configuration
app.use(express_1.default.static(path_1.default.join(__dirname, '../public')));
// render engine configuration
app.set('view engine', 'ejs');
app.set('views', './src/views');
ejs_1.default.clearCache();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(appRoutes_1.default);
exports.default = app;
