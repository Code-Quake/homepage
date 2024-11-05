import { createServer } from "https";
import { parse } from "url";
import next from "next";
import fs from "fs";

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

const httpsOptions = {
  key: fs.readFileSync("./key.pem"),
  cert: fs.readFileSync("./cert.pem"),
};

app.prepare().then(() => {
  createServer(httpsOptions, (req, res) => {
    const parsedUrl = parse(req.url!, true);
    handle(req, res, parsedUrl);
  }).listen(3100, (err?: Error) => {
    if (err) throw err;
    console.log("> Ready on https://home.codequake.local:3100/");
  });
});
