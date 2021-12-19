export interface UserInfo {
  userId: string;
  name: string;
  password: string;
  isAdmin: boolean;
}

export interface BookInfo {
  isbn: string;
  title: string;
  author: string;
  available: number;
}

export interface CommentInfo {
  comment: string;
  username: string;
  date: string;
}

export interface NotificationInfo {
  id: string;
  sender: string;
  receiver: string;
  date: string;
  message: string;
  isRead: boolean;
}

export interface TransactionInfo {
  isbn: string;
  title: string;
  author: string;
  userId: string;
  date: string;
  dueDate: string;
  returnDate?: string;
  fine: number;
}

/*
 * Interfaces of requests & responses
 * Some request types are undefined because they are presented in api routes
 */
export interface UserInfoParams {
  userId: string;
}
export type UserInfoResponse =
  | Omit<UserInfo, "userId" | "passowrd">
  | ErrorResponse;

export interface ModifyNameRequest {
  name: string;
}
export interface ModifyPasswordRequest {
  password: string;
  newPassword: string;
}
// collapse two types of modification requests
export type ModifyUserRequest = ModifyNameRequest | ModifyPasswordRequest;
export interface ModifyUserParams {
  userId: string;
}
export type ModifyUserResponse = ErrorResponse | undefined;

export interface LoginRequest {
  userId: string;
  password: string;
}
export type LoginResponse =
  | {
      isAdmin: boolean;
    }
  | ErrorResponse;

interface UserListSuccessResponse extends PaginationBaseResponse {
  users: UserInfo[];
}
export type UserListResponse = UserListSuccessResponse | ErrorResponse;

interface BookInfoSuccessResponse extends Omit<BookInfo, "isbn"> {
  borrowed?: boolean; // whether the book is borrowed by the current user
}
export type BookInfoResponse = BookInfoSuccessResponse | ErrorResponse;
export interface BookInfoParams {
  isbn: string;
}

interface BookListSuccessResponse extends PaginationBaseResponse {
  books: BookInfo[];
}
export type BookListResponse = BookListSuccessResponse | ErrorResponse;

export interface BookAddRequest
  extends Partial<Omit<BookInfo, "isbn" | "available">> {
  isbn: string;
}
export type BookAddResponse = ErrorResponse | undefined;

export interface BookBorrowRequest {
  isbn: string;
  userId: string;
}
export type BookBorrowResponse =
  | ErrorResponse
  | {
      dueDate: string; // this is calculated by the server
    };

export interface BookReturnRequest {
  isbn: string;
  userId: string;
}
export type BookReturnResponse = ErrorResponse | undefined;

interface CommentListSuccessResponse extends PaginationBaseResponse {
  comments: CommentInfo[];
}
export type CommentListResponse = CommentListSuccessResponse | ErrorResponse;
export interface CommentListParams {
  isbn: string;
}

export interface CommentAddRequest {
  isbn: string;
  userId: number;
  comment: string;
  date: string;
}
export type CommentAddResponse = ErrorResponse | undefined;
export interface CommentAddParams {
  isbn: string;
}

export interface NotificationRequest {
  userId: string;
}
export type NotificationResponse =
  | {
      notifications: NotificationInfo[];
    }
  | ErrorResponse;

export interface NotificationReadParams {
  id: string;
}
export type NotificationReadResponse = ErrorResponse | undefined;

export interface NotificationSendRequest {
  senderId: string;
  receiverId: string;
  message: string;
}
export type NotificationSendResponse = ErrorResponse | undefined;

export interface UserBorrowInfoParams {
  userId: string;
}
export type UserBorrowInfoResponse =
  | {
      transactions: TransactionInfo[];
    }
  | ErrorResponse;

interface TransactionListSuccessResponse extends PaginationBaseResponse {
  transactions: TransactionInfo[];
}
export type TransactionListResponse =
  | TransactionListSuccessResponse
  | ErrorResponse;

/* General auxialiary types */
// this is attached in url params
export interface PaginationBaseRequest {
  offset: number;
  pageLimit: number;
}

interface PaginationBaseResponse {
  pageCount: number;
}

interface ErrorResponse {
  error: string; // error message
}
