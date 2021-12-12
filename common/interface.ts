export interface UserResponse {
  userId: number;
  name: string;
  isAdmin: boolean;
}

export interface ModifyNameRequest {
  name: string;
}

export interface ModifyPasswordRequest {
  password: string;
  newPassword: string;
}

export type ModifyUserRequest = ModifyNameRequest | ModifyPasswordRequest;

export interface LoginRequest {
  userId: number;
  password: string;
}

export interface LoginResponse {
  isAdmin: boolean;
  token: string;
}

export interface BooksRequest {
  page: number;
  filter?: string;
}

export interface BookInfo {
  isbn: string;
  title: string;
  author: string;
  available: number;
}

export type BookAddRequest = Partial<Omit<BookInfo, "isbn" | "available">> & {
  isbn: string;
};

export interface BooksResponse {
  books: BookInfo[];
  nextPage?: number;
}

export interface BookInfoResponse {
  title: string;
  author: string;
  available: number;
  borrowed?: boolean;
}

export interface CommentRequest {
  isbn: string;
}

export interface CommentInfo {
  comment: string;
  username: string;
  date: string;
}

export interface CommentResponse {
  comments: CommentInfo[];
}

// TODO: Token?
export interface AddCommentRequest {
  isbn: string;
  userId: number;
  comment: string;
  date: string;
}

export interface NotificationDetails {
  id: number;
  sender: string;
  receiver: string;
  date: string;
  content: string;
  isRead: boolean;
}

export interface SendNotificationRequest {
  senderId: number;
  receiverId: number;
  content: string;
}

export interface Transaction {
  isbn: string;
  title: string;
  author: string;
  userId: number;
  date: string;
  dueDate: string;
  returnDate?: string;
  fine: number;
}

export interface MetaData {
  books: {
    total: number;
    pages: number;
  };
  users: {
    total: number;
    pages: number;
  };
  transactions: {
    total: number;
    pages: number;
  };
}

export interface BorrowRequest {
  isbn: string;
  userId: number;
  dueDate: string;
}

export interface ReturnRequest {
  isbn: string;
  userId: number;
}
