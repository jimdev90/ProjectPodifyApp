import { RequestHandler, Request } from "express";
import formidable, { Files } from 'formidable';
import path from 'path';
import fs from 'fs';

export interface RequestWithFiles extends Request {
    files?: Files
}

const fileParser: RequestHandler = (req: RequestWithFiles, res, next) => {
    if (!req.headers["content-type"]?.startsWith("multipart/form-data;"))
        return res.status(422).json({ error: "Only accepts form-data!" });

    const form = formidable({ multiples: false });

    form.parse(req, (err, fields, files) => {
        if (err) return next(err);
        req.body = fields;
        req.files = files;

        next();
    });

}

export default fileParser;