# Currency Calculator and Exchange Rates Tracker

This project consists of two main directories: `server` and `client`.

- The **server** directory contains the backend code, which handles server communication and database interactions.

* The **client** directory contains the frontend React application.

The project includes two main sections: user and admin.

- **User section**: Displays currency calculations.
- **Admin section**: After successful signup and login, the admin gains access to the admin dashboard, where they can:

  - Perform currency calculations using various currencies from a list.
  - Select currencies to add to their list.
  - Manage the visibility of chosen currencies (show/hide) or remove them from the list. Only the currencies marked as visible by the admin will appear on the user's homepage.

## Server Directory

Inside the `server` directory, follow these steps to set up the backend:

1. Initialize Node.js project and create `package.json`:

`npm init-y`

2. Install the required dependencies together or separately:

`npm install express nodemon cors dotenv jsonwebtoken bcrypt cookie-parser mongoose`

Or install them one by one:

`npm install express`
`npm install nodemon`
`npm install cors`
...

3. If this is a shared project, install all dependencies from `package.json`:

`npm install`

4. To start a server:

`npm start`

5. To stop the server in the terminal, use the `CTRL + C` .

## Client Directory

Inside the `client` directory, set up the React app by following these steps:

1. Initialize the React project:

`npx create-react-app .`

2. Install the necessary dependencies need to be installed together:

`npm install axios react-cookie react-router-dom react-select`

Or one by one:

`npm install axios`
`npm install react-cookie`
...

3. For styling, install MDB and Font Awesome:

`npm install mdb-react-ui-kit`
`npm install @fortawesome/fontawesome-free`

4. If it is a shared project, install all dependencies from `package.json`:

`npm install`

5. To run the React app:

`npm start`

6. To stop the React app in the terminal, use the `CTRL + C` .
