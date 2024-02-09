import { Elysia, t } from "elysia";
import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const userController = (app: Elysia) =>
  app.group("/users", (app) =>
    app
      .post(
        "/",
        async ({ body }) => {
          try {
            return await prisma.user.create({
              data: {
                name: body.name,
                email: body.email,
                password: body.password,
              },
            });
          } catch (err) {
            if (err instanceof Prisma.PrismaClientKnownRequestError) {
              if (err.code === "P2002") {
                throw new Error("Email already in use");
              }
            }
            throw err;
          }
        },
        {
          body: t.Object({
            name: t.String(),
            email: t.String(),
            password: t.String(),
          }),
        }
      )

      .get("/", async () => {
        try {
          return await prisma.user.findMany();
        } catch (err) {
          throw err;
        }
      })
      .get("/:id", "getOne")
      .put("/:id", "update")
      .delete("/:id", "delete")
  );
