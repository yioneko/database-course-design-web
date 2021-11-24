import { rest } from "msw";
import {
  AddCommentRequest,
  LoginRequest,
  ModifyUserRequest,
} from "../api/types";
import { books, borrowed, comments, users, notifications } from "./data";

export const handlers = [
  rest.get("/api/notifications", (req, res, ctx) => {
    const userId = parseInt(req.url.searchParams.get("userId") ?? "a");
    const maybeUser = isNaN(userId)
      ? undefined
      : Object.values(users).find((info) => info.userId === userId);
    if (!maybeUser) {
      return res(
        ctx.status(404),
        ctx.json({
          error: "User not found",
        })
      );
    } else {
      return res(
        ctx.status(200),
        ctx.json(notifications.filter((v) => v.receiver === maybeUser.name))
      );
    }
  }),

  rest.post("/api/notifications/:id", (req, res, ctx) => {
    const { id } = req.params;
    Object.assign(
      notifications.find((v) => v.id === parseInt(id)) ?? {},
      req.body
    );

    return res(ctx.status(200));
  }),

  rest.get("/api/user/:userId/borrow", (req, res, ctx) => {
    const { userId } = req.params;
    return res(
      ctx.status(200),
      ctx.json(borrowed.filter((v) => v.userId + "" === userId))
    );
  }),

  rest.get("/api/user/:userId", (req, res, ctx) => {
    const { userId } = req.params;
    const maybeUser = Object.values(users).find(
      (info) => info.userId + "" === userId
    );
    if (!maybeUser) {
      return res(
        ctx.status(404),
        ctx.json({
          error: "User not found",
        })
      );
    } else {
      return res(ctx.status(200), ctx.json(maybeUser));
    }
  }),

  rest.post<ModifyUserRequest>("/api/user/:userId", (req, res, ctx) => {
    const { userId } = req.params;
    const body = req.body;

    const maybeUser = Object.values(users).find(
      (info) => info.userId + "" === userId
    );
    if (!maybeUser) {
      return res(
        ctx.status(404),
        ctx.json({
          error: "User not found",
        })
      );
    } else {
      if ("name" in body) {
        maybeUser.name = body.name;
      } else if ("password" in body) {
        if (body.password !== maybeUser.password) {
          return res(
            ctx.status(400),
            ctx.json({
              error: "Wrong password",
            })
          );
        } else {
          maybeUser.password = body.newPassword;
        }
      }
      return res(ctx.status(200));
    }
  }),

  rest.post<LoginRequest>("/api/login", (req, res, ctx) => {
    const { userId, password } = req.body;
    const maybeUser = Object.values(users).find(
      (info) => info.userId === userId && info.password === password
    );
    if (!maybeUser) {
      return res(
        ctx.status(401),
        ctx.json({
          error: "Invalid username or password",
        })
      );
    } else {
      return res(
        ctx.status(200),
        ctx.json({ isAdmin: maybeUser.isAdmin, token: "TOKEN" })
      );
    }
  }),

  rest.get("/api/books/:isbn/comments", (req, res, ctx) => {
    const isbn = req.params.isbn as string;

    if (comments.hasOwnProperty(isbn)) {
      return res(
        ctx.status(200),
        ctx.json({ comments: Array(5).fill(comments[isbn]).flat() })
      );
    } else {
      return res(ctx.status(404), ctx.json({ error: "Book not found" }));
    }
  }),

  // TODO: implement comment adding
  rest.post<AddCommentRequest>("/api/books/:isbn/comments", (req, res, ctx) => {
    const isbn = req.params.isbn as string;

    return res(ctx.status(200));
  }),

  rest.get("/api/books/:isbn/info", (req, res, ctx) => {
    const userId = parseInt(req.url.searchParams.get("userId") ?? "a");
    const isbn = req.params.isbn as string;

    const maybeBook = books.find((book) => book.isbn === isbn);
    const maybeBorrowed = isNaN(userId)
      ? undefined
      : borrowed.findIndex((v) => v.userId === userId && v.isbn === isbn) >= 0;

    if (maybeBook) {
      return res(
        ctx.status(200),
        ctx.json({
          ...maybeBook,
          borrowed: maybeBorrowed,
        })
      );
    } else {
      return res(ctx.status(404), ctx.json({ error: "Book not found" }));
    }
  }),

  rest.get("/api/books", (req, res, ctx) => {
    const page = parseInt(req.url.searchParams.get("page") ?? "0");
    const filter = req.url.searchParams.get("filter") ?? "";

    const retBooks = books
      .filter((book) => book.title.includes(filter))
      .map((book) => ({ ...book, isbn: book.isbn }));

    return res(
      ctx.status(200),
      ctx.json(
        retBooks.length > 0
          ? {
              books: retBooks,
              nextPage: page >= 2 ? undefined : page + 1,
            }
          : {
              books: [],
            }
      )
    );
  }),
];
