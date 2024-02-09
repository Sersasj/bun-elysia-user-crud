import { Elysia } from "elysia";
import { userController } from "./controllers/user.controller";
import { swagger } from "@elysiajs/swagger";

new Elysia()
  .get("/", () => {
    console.log("Hello Elysia");
    return "Hello Elysia";
  })
  .use(swagger())
  .use(userController)
  .listen(3000);

console.log("Server running on http://localhost:3000");
