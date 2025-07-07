"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.environment = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const environment = process.env.NODE_ENV || 'development';
exports.environment = environment;
dotenv_1.default.config({ path: `.env.${environment}` });
