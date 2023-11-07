import pkg from "json-server";
const { create, router: _router, defaults, bodyParser } = pkg;
const server = create();
const router = _router("./db.json");
const middlewares = defaults();

server.use(middlewares);
server.use(bodyParser);

server.use("/api", router);

server.listen(3001, () => {
  console.log("JSON Server is running on port 3001");
});
