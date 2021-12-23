Web frontend for database course design. Checkout backend at [database-course-design-model](https://github.com/zsz12251665/database-course-design-model).

## Development

```bash
pnpm install
pnpm dev
```

## Todo

- User
  - [x] User login
  - [ ] Token authentication
  - [x] Book list and comments
  - [x] Modify profile
  - [x] Read notifications
  - [x] View borrow records
  - [ ] Pay fine
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
  - [ ] Resturcture api queries and handlers of response
  - [ ] Split huge page components
  - [ ] Tests

## API List

- [ ] `GET /api/notifications`
- [ ] `POST /api/notifications`
- [ ] `POST /api/notifications/:id`
- [ ] `GET /api/user/:userId/borrow`
- [ ] `GET /api/user/:userId`
- [ ] `POST /api/user/:userId`
- [ ] `GET /api/user`
- [ ] `POST /api/login`
- [ ] `GET /api/books/:isbn/comments`
- [ ] `POST /api/books/:isbn/comments`
- [ ] `GET /api/books/:isbn/info`
- [ ] `GET /api/books`
- [ ] `POST /api/books`
- [ ] `GET /api/transactions`
- [ ] `POST /api/borrow`
- [ ] `POST /api/return`
