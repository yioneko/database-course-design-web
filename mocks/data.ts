import {
  BookInfo,
  BorrowDetails,
  CommentInfo,
  NotificationDetails,
} from "../api/types";

export const users = {
  user: {
    userId: 123,
    name: "User",
    isAdmin: false,
    password: "123456",
  },
  admin: {
    userId: 456,
    name: "Admin",
    isAdmin: true,
    password: "123456",
  },
};

export const books: BookInfo[] = [
  {
    isbn: "978-1119366447",
    title: "Professional JavaScript for Web Developers",
    author: "Matt Frisbie",
    available: 0,
  },
  {
    isbn: "978-1260084504",
    title: "Database System Concepts",
    author: "Abraham Silberschatz, Henry Korth, S. Sudarshan",
    available: 2,
  },
  {
    isbn: "979-8749522310",
    title: "Alice in Wonderland",
    author: "Lewis Carroll",
    available: 1,
  },
];

export const comments: Record<string, CommentInfo[]> = {
  "978-1119366447": [
    {
      comment: "Great book!",
      username: "user",
      date: "1970-01-01",
    },
  ],
  "978-1260084504": [
    {
      comment: "TOOOOO difficult",
      username: "admin",
      date: "2021-11-20",
    },
  ],
  "979-8749522310": [],
};

export const borrowed: BorrowDetails[] = [
  {
    isbn: "978-1119366447",
    title: "Professional JavaScript for Web Developers",
    author: "Matt Frisbie",
    userId: 123,
    date: "2020-01-01",
    dueDate: "2020-01-31",
    isReturned: true,
    fine: 0,
  },
  {
    isbn: "978-1119366447",
    title: "Professional JavaScript for Web Developers",
    author: "Matt Frisbie",
    userId: 123,
    date: "2021-02-02",
    dueDate: "2021-02-31",
    isReturned: false,
    fine: 99999.99,
  },
  {
    isbn: "978-1260084504",
    title: "Alice in Wonderland",
    author: "Lewis Carroll",
    userId: 456,
    date: "2014-02-19",
    dueDate: "2016-06-12",
    isReturned: false,
    fine: 9999,
  },
];

export const notifications: NotificationDetails[] = [
  {
    id: 1,
    sender: "Admin",
    receiver: "User",
    date: "1970-01-01",
    content: "You have a new message",
    isRead: true,
  },
  {
    id: 2,
    sender: "Admin",
    receiver: "User",
    date: "2021-10-10",
    content: "Please return the book",
    isRead: false,
  },
  {
    id: 3,
    sender: "Admin",
    receiver: "User",
    date: "2021-11-20",
    content: "Test",
    isRead: false,
  },
];
