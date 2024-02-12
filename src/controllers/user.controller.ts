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
                password: await Bun.password.hash(body.password, {
                  algorithm: "bcrypt",
                  cost: 4,
                }),
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

      .get(
        "/:id",
        async ({ body }) => {
          try {
            return await prisma.user.findUnique({
              where: {
                id: body.id,
              },
            });
          } catch (err) {
            throw err;
          }
        },
        {
          body: t.Object({
            id: t.Number(),
          }),
        }
      )

      .put(
        "/:id",
        async ({ body }) => {
          try {
            return await prisma.user.update({
              where: {
                id: body.id,
              },
              data: {
                name: body.name,
                email: body.email,
                password: body.password,
              },
            });
          } catch (err) {
            throw err;
          }
        },
        {
          body: t.Object({
            id: t.Number(),
            name: t.String(),
            email: t.String(),
            password: t.String(),
          }),
        }
      )

      .delete(
        "/:id",
        async ({ body }) => {
          try {
            return await prisma.user.delete({
              where: {
                id: body.id,
              },
            });
          } catch (err) {
            throw err;
          }
        },
        {
          body: t.Object({
            id: t.Number(),
          }),
        }
      )
  );
