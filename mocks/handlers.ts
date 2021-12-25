import { addWeeks, format } from "date-fns";
import { rest, RestRequest } from "msw";
import {
  BookAddRequest,
  BookAddResponse,
  BookBorrowRequest,
  BookBorrowResponse,
  BookCopiesParams,
  BookCopiesResponse,
  BookInfoParams,
  BookInfoResponse,
  BookListResponse,
  BookReturnRequest,
  BookReturnResponse,
  CommentAddParams,
  CommentAddRequest,
  CommentAddResponse,
  CommentListParams,
  CommentListResponse,
  LoginRequest,
  LoginResponse,
  ModifyUserParams,
  ModifyUserRequest,
  ModifyUserResponse,
  NotificationReadParams,
  NotificationReadResponse,
  NotificationRequest,
  NotificationResponse,
  NotificationSendRequest,
  NotificationSendResponse,
  PaginationBaseRequest,
  TransactionListResponse,
  UserBorrowInfoParams,
  UserBorrowInfoResponse,
  UserInfoParams,
  UserInfoResponse,
  UserListResponse,
} from "../common/interface";
import message from "../common/message.json";
import {
  books,
  comments,
  copies,
  notifications,
  transactions,
  users,
} from "./data";

function mockPaginatedData<T>(
  data: Array<T>,
  { offset, pageLimit }: PaginationBaseRequest,
  repeat: number = 5
) {
  if (data.length > 0 && offset >= data.length * repeat) {
    throw new Error(message.pageOutOfRange);
  }
  const pageCount = Math.ceil((data.length * repeat) / pageLimit);
  return {
    pageCount,
    data: Array(repeat)
      .fill(data)
      .flat()
      .slice(offset, pageLimit + offset),
  };
}

function resolvePageQuery(req: RestRequest) {
  const offset = parseInt(req.url.searchParams.get("offset") || "a");
  const pageLimit = parseInt(req.url.searchParams.get("pageLimit") || "a");
  if (isNaN(offset) || isNaN(pageLimit)) {
    throw new Error(message.invalidPageQuery);
  }
  return { offset, pageLimit };
}

export const handlers = [
  rest.get<NotificationRequest, NotificationResponse>(
    "/api/notifications",
    (req, res, ctx) => {
      const userId = req.url.searchParams.get("userId") ?? "";
      const maybeUser = Object.values(users).find(
        (info) => info.userId === userId
      );
      if (!maybeUser) {
        return res(
          ctx.status(404),
          ctx.json({
            error: message.userNF,
          })
        );
      } else {
        return res(
          ctx.status(200),
          ctx.json({
            notifications: notifications.filter(
              (v) => v.receiver === maybeUser.name
            ),
          })
        );
      }
    }
  ),

  rest.post<NotificationSendRequest, NotificationSendResponse>(
    "/api/notifications",
    (req, res, ctx) => {
      const notification = { ...req.body };
      const maybeReceiver = Object.values(users).find(
        (info) => info.userId === notification.receiverId
      );
      if (!maybeReceiver) {
        return res(
          ctx.status(404),
          ctx.json({
            error: message.userNF,
          })
        );
      } else {
        notifications.push({
          id: "" + notifications.length,
          receiver: maybeReceiver.name,
          date: format(new Date(), "yyyy-MM-dd"),
          message: notification.message,
          isRead: false,
        });
        return res(ctx.status(200));
      }
    }
  ),

  rest.post<undefined, NotificationReadResponse, NotificationReadParams>(
    "/api/notifications/:id",
    (req, res, ctx) => {
      const { id } = req.params;
      Object.assign(notifications.find((v) => v.id === id) ?? {}, req.body);

      return res(ctx.status(200));
    }
  ),

  rest.get<undefined, UserBorrowInfoResponse, UserBorrowInfoParams>(
    "/api/user/:userId/borrow",
    (req, res, ctx) => {
      const { userId } = req.params;
      return res(
        ctx.status(200),
        ctx.json({
          transactions: transactions.filter((v) => v.userId + "" === userId),
        })
      );
    }
  ),

  rest.get<undefined, UserInfoResponse, UserInfoParams>(
    "/api/user/:userId",
    (req, res, ctx) => {
      const { userId } = req.params;
      const maybeUser = Object.values(users).find(
        (info) => info.userId + "" === userId
      );
      if (!maybeUser) {
        return res(
          ctx.status(404),
          ctx.json({
            error: message.userNF,
          })
        );
      } else {
        return res(ctx.status(200), ctx.json(maybeUser));
      }
    }
  ),

  rest.post<ModifyUserRequest, ModifyUserResponse, ModifyUserParams>(
    "/api/user/:userId",
    (req, res, ctx) => {
      const { userId } = req.params;
      const body = req.body;

      const maybeUser = Object.values(users).find(
        (info) => info.userId + "" === userId
      );
      if (!maybeUser) {
        return res(
          ctx.status(404),
          ctx.json({
            error: message.userNF,
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
                error: message.wrongPwd,
              })
            );
          } else {
            maybeUser.password = body.newPassword;
          }
        }
        return res(ctx.status(200));
      }
    }
  ),

  rest.get<undefined, UserListResponse>("/api/user", (req, res, ctx) => {
    try {
      const paginated = mockPaginatedData(
        Object.values(users),
        resolvePageQuery(req)
      );
      return res(
        ctx.status(200),
        ctx.json({ users: paginated.data, pageCount: paginated.pageCount })
      );
    } catch (err) {
      return res(ctx.status(400), ctx.json({ error: (err as Error).message }));
    }
  }),

  rest.post<LoginRequest, LoginResponse>("/api/login", (req, res, ctx) => {
    const { userId, password } = req.body;
    const maybeUser = Object.values(users).find(
      (info) => info.userId === userId && info.password === password
    );
    if (!maybeUser) {
      return res(
        ctx.status(401),
        ctx.json({
          error: message.wrongNameOrPwd,
        })
      );
    } else {
      return res(
        ctx.status(200),
        // TODO: token
        ctx.json({ isAdmin: maybeUser.isAdmin })
      );
    }
  }),

  rest.get<undefined, CommentListResponse, CommentListParams>(
    "/api/books/:isbn/comments",
    (req, res, ctx) => {
      const isbn = req.params.isbn;

      if (comments.hasOwnProperty(isbn)) {
        try {
          const paginated = mockPaginatedData(
            comments[isbn],
            resolvePageQuery(req),
            100
          );
          return res(
            ctx.status(200),
            ctx.json({
              comments: paginated.data,
              pageCount: paginated.pageCount,
            })
          );
        } catch (err) {
          return res(
            ctx.status(400),
            ctx.json({ error: (err as Error).message })
          );
        }
      } else {
        return res(ctx.status(404), ctx.json({ error: message.bookNF }));
      }
    }
  ),

  // TODO: implement comment adding
  rest.post<CommentAddRequest, CommentAddResponse, CommentAddParams>(
    "/api/books/:isbn/comments",
    (_req, res, ctx) => {
      return res(ctx.status(200));
    }
  ),

  rest.get<undefined, BookInfoResponse, BookInfoParams>(
    "/api/books/:isbn/info",
    (req, res, ctx) => {
      const userId = req.url.searchParams.get("userId");
      const isbn = req.params.isbn;

      const maybeBook = books.find((book) => book.isbn === isbn);
      const maybeBorrowed =
        transactions.findIndex((v) => v.userId === userId && v.isbn === isbn) >=
        0;

      if (maybeBook) {
        return res(
          ctx.status(200),
          ctx.json({
            ...maybeBook,
            borrowed: maybeBorrowed,
          })
        );
      } else {
        return res(ctx.status(404), ctx.json({ error: message.bookNF }));
      }
    }
  ),

  rest.get<undefined, BookCopiesResponse, BookCopiesParams>(
    "/api/books/:isbn/copies",
    (req, res, ctx) => {
      const isbn = req.params.isbn;

      // TODO: implement filter by params
      // const borrowedOnly = req.url.searchParams.get("borrowedOnly") === "true";
      // const availableOnly = req.url.searchParams.get("availableOnly") === "true";

      const copiesForBooks = copies
        .filter((v) => v.isbn === isbn)
        .map(({ copyId }) => copyId);

      if (copiesForBooks.length > 0) {
        return res(
          ctx.status(200),
          ctx.json({
            copies: copiesForBooks,
          })
        );
      } else {
        return res(ctx.status(404), ctx.json({ error: message.bookNF }));
      }
    }
  ),

  rest.get<undefined, BookListResponse>("/api/books", (req, res, ctx) => {
    try {
      const filter = req.url.searchParams.get("filter") ?? "";

      const paginated = mockPaginatedData(
        books.filter((book) => book.title.includes(filter)),
        resolvePageQuery(req)
      );
      return res(
        ctx.status(200),
        ctx.json({ books: paginated.data, pageCount: paginated.pageCount })
      );
    } catch (err) {
      return res(ctx.status(400), ctx.json({ error: (err as Error).message }));
    }
  }),

  rest.post<BookAddRequest, BookAddResponse>("/api/books", (req, res, ctx) => {
    const { isbn, title, author } = req.body;

    const maybeBook = books.find((book) => book.isbn === isbn);
    if (maybeBook) {
      copies.push({ copyId: copies.length + 1 + "", isbn });
      maybeBook.available += 1;
    } else if (title === undefined || author === undefined) {
      return res(
        ctx.status(400),
        ctx.json({
          error: message.requireTitleAndAuthor,
        })
      );
    } else {
      books.push({
        isbn,
        title,
        author,
        available: 1,
      });
    }
    return res(ctx.status(200));
  }),

  rest.get<undefined, TransactionListResponse>(
    "/api/transactions",
    (req, res, ctx) => {
      try {
        const paginated = mockPaginatedData(
          transactions,
          resolvePageQuery(req)
        );
        return res(
          ctx.status(200),
          ctx.json({
            transactions: paginated.data,
            pageCount: paginated.pageCount,
          })
        );
      } catch (err) {
        return res(
          ctx.status(400),
          ctx.json({ error: (err as Error).message })
        );
      }
    }
  ),

  rest.post<BookBorrowRequest, BookBorrowResponse>(
    "/api/borrow",
    (req, res, ctx) => {
      const { userId, copyId } = req.body;

      const maybeUser = Object.values(users).find(
        (info) => info.userId === userId
      );
      const maybeBook = books.find(
        (book) =>
          book.isbn === copies.find((copy) => copy.copyId === copyId)?.isbn
      );

      if (!maybeUser) {
        return res(
          ctx.status(404),
          ctx.json({
            error: message.userNF,
          })
        );
      } else if (!maybeBook) {
        return res(
          ctx.status(404),
          ctx.json({
            error: message.bookNF,
          })
        );
      } else if (maybeBook.available <= 0) {
        return res(
          ctx.status(400),
          ctx.json({
            error: message.bookNotAvailable,
          })
        );
      } else {
        transactions.push({
          userId,
          ...maybeBook,
          copyId,
          date: format(new Date(), "yyyy-MM-dd"),
          dueDate: format(addWeeks(new Date(), 3), "yyyy-MM-dd"),
          fine: 0,
        });
        maybeBook.available -= 1;
        return res(ctx.status(200));
      }
    }
  ),

  rest.post<BookReturnRequest, BookReturnResponse>(
    "/api/return",
    (req, res, ctx) => {
      const { copyId } = req.body;

      const maybeTransaction = transactions.find(
        (transaction) =>
          transaction.copyId === copyId && transaction.returnDate === undefined
      );
      if (!maybeTransaction) {
        return res(
          ctx.status(404),
          ctx.json({
            error: message.bookNotBorrowed,
          })
        );
      } else {
        const maybeBook = books.find(
          (book) => book.isbn === maybeTransaction.isbn
        );
        if (!maybeBook) {
          return res(
            ctx.status(404),
            ctx.json({
              error: message.bookNF,
            })
          );
        } else {
          maybeBook.available += 1;
          maybeTransaction.returnDate = format(new Date(), "yyyy-MM-dd");
          return res(ctx.status(200));
        }
      }
    }
  ),
];
