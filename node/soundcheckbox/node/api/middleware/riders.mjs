import jwt from "jsonwebtoken";
import config from "config";

export default function (req, res, next) {
    console.log('MIDLEWARE RIDERS')
    next();
};
