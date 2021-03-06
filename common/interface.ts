export interface UserInfo {
  userId: string;
  name: string;
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
  receiver: string;
  date: string;
  message: string;
  isRead: boolean;
}

export interface TransactionInfo {
  isbn: string;
  copyId: string;
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
export type UserInfoSuccessResponse = Omit<UserInfo, "userId">;
export type UserInfoResponse = UserInfoSuccessResponse | ErrorResponse;

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

export interface LoginSuccessResponse {
  isAdmin: boolean;
}
export type LoginResponse = LoginSuccessResponse | ErrorResponse;

export interface UserListSuccessResponse extends PaginationBaseResponse {
  users: UserInfo[];
}
export type UserListResponse = UserListSuccessResponse | ErrorResponse;

export interface BookInfoSuccessResponse extends Omit<BookInfo, "isbn"> {
  borrowed?: boolean; // whether the book is borrowed by the current user
}
export type BookInfoResponse = BookInfoSuccessResponse | ErrorResponse;
export interface BookInfoParams {
  isbn: string;
}

// NOTE: The url param type is hard to use and defined just for clarification
export type BookCopiesUrlParams =
  | { borrowedOnly: boolean }
  | { availableOnly: boolean }
  | undefined;
export interface BookCopiesSuccessResponse {
  copies: string[];
}
export type BookCopiesResponse = BookCopiesSuccessResponse | ErrorResponse;
export interface BookCopiesParams {
  isbn: string;
}

export interface BookListSuccessResponse extends PaginationBaseResponse {
  books: BookInfo[];
}
export type BookListResponse = BookListSuccessResponse | ErrorResponse;

export interface BookAddRequest
  extends Partial<Omit<BookInfo, "isbn" | "available">> {
  isbn: string;
}
export type BookAddResponse = ErrorResponse | undefined;

export interface BookBorrowRequest {
  copyId: string;
  userId: string;
}
export type BookBorrowResponse =
  | ErrorResponse
  | {
      dueDate: string; // this is calculated by the server
    };

export interface BookReturnRequest {
  copyId: string;
}
export type BookReturnResponse = ErrorResponse | undefined;

export interface CommentListSuccessResponse extends PaginationBaseResponse {
  comments: CommentInfo[];
}
export type CommentListResponse = CommentListSuccessResponse | ErrorResponse;
export interface CommentListParams {
  isbn: string;
}

export interface CommentAddRequest {
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
export interface NotificationSuccessResponse {
  notifications: NotificationInfo[];
}
export type NotificationResponse = NotificationSuccessResponse | ErrorResponse;

export interface NotificationReadParams {
  id: string;
}
export type NotificationReadResponse = ErrorResponse | undefined;

export interface NotificationSendRequest {
  receiverId: string;
  message: string;
}
export type NotificationSendResponse = ErrorResponse | undefined;

export interface UserBorrowInfoParams {
  userId: string;
}
export interface UserBorrowInfoSuccessResponse {
  transactions: TransactionInfo[];
}
export type UserBorrowInfoResponse =
  | UserBorrowInfoSuccessResponse
  | ErrorResponse;

export interface TransactionListSuccessResponse extends PaginationBaseResponse {
  transactions: TransactionInfo[];
}
export type TransactionListResponse =
  | TransactionListSuccessResponse
  | ErrorResponse;

export interface FinePaidCheckParams {
  userId: string;
}
export interface FinePaidCheckSuccessResponse {
  isPaid: boolean;
}
export type FinePaidCheckResponse =
  | FinePaidCheckSuccessResponse
  | ErrorResponse;

/* General auxialiary types */
// this is attached in url params
export interface PaginationBaseRequest {
  offset: number;
  pageLimit: number;
}

interface PaginationBaseResponse {
  total: number;
}

export interface ErrorResponse {
  error: string; // error message
}
