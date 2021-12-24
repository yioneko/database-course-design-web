Web frontend for database course design. Checkout backend at [database-course-design-model](https://github.com/zsz12251665/database-course-design-model).

## Development

```bash
pnpm install
pnpm prepare # install git pre-commit hook
pnpm dev # start development server
```

## Todo

- User
  - [x] User login
  - [ ] Token authentication
  - [x] Book list and comments
  - [x] Modify profile
  - [x] Read notifications
  - [x] View borrow records
  - [x] Pay fine (faked)
- Admin
  - [ ] System overview
  - [x] View books, transactions, users
  - [x] Add books
  - [x] Borrow & return books
  - [x] Send notification to users
  - [ ] Notification management
  - [ ] Comment management
  - [ ] Filter for all tables
  - [ ] Inplace edit for all tables
- Code quality
  - [ ] Tests

## API List

- Notification
  - [x] `GET  /api/notifications`
  - [x] `POST /api/notifications`
  - [x] `POST /api/notifications/:id`
- User
  - [x] `GET  /api/user/:userId/borrow`
  - [x] `GET  /api/user/:userId`
  - [x] `POST /api/user/:userId`
  - [x] `GET  /api/user`
  - [x] `POST /api/login`
- Book
  - [ ] `GET  /api/books/:isbn/comments`
  - [ ] `POST /api/books/:isbn/comments`
  - [ ] `GET  /api/books/:isbn/info`
  - [ ] `GET  /api/books`
  - [ ] `POST /api/books`
- Transaction
  - [x] `GET  /api/transactions`
  - [x] `POST /api/borrow`
  - [x] `POST /api/return`
