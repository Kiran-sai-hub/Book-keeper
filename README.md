# BookKeeper

Hey there! Welcome to **BookKeeper**, your new favorite personal book management application.

If you're anything like me, you probably have a growing list of books you've read, books you're currently devouring, and a never-ending wishlist of books you *want* to read. Keeping track of them all can get a bit overwhelming. That's exactly why I built BookKeeper—a clean, minimal, and intuitive way to manage your personal library.

## Features

- **User Authentication:** Secure sign-up and login so your library stays private to you.
- **Book Management:** Add, edit, view, and remove books from your collection.
- **Track Reading Progress:** Easily categorize books by whether you've read them, are currently reading them, or want to read them.
- **Clean UI:** A modern, distraction-free interface built with Next.js.
- **Fast & Responsive:** Snappy performance across devices so you can update your reading list on the go.

## Tech Stack

I chose a robust and modern stack to build this out:

**Frontend:**
- **[Next.js](https://nextjs.org/)** for a lightning-fast React framework (App Router).
- **[React](https://reactjs.org/)** for building the user interface.
- **[Lucide React](https://lucide.dev/)** for those crisp, clean icons you'll see around the app.

**Backend:**
- **[Node.js](https://nodejs.org/) & [Express.js](https://expressjs.com/)** for the API server.
- **[MongoDB](https://www.mongodb.com/) & [Mongoose](https://mongoosejs.com/)** for the database.
- **[JSON Web Tokens (JWT)](https://jwt.io/) & [bcrypt](https://www.npmjs.com/package/bcrypt)** for robust and secure authentication.

## Getting Started

Want to run BookKeeper locally? Awesome! Here's how you can get it up and running on your machine.

### Prerequisites

Make sure you have these installed:
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [MongoDB](https://www.mongodb.com/try/download/community) (Running locally or a MongoDB Atlas URI)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/bookkeeper.git
   cd bookkeeper
   ```

2. **Set up the Backend:**
   ```bash
   # Make sure you are in the root directory
   npm install
   
   # Duplicate the .env.example file and rename it to .env
   cp .env.example .env
   
   # Note: Open .env and fill in your environmental variables!
   # (e.g., PORT=5001, MONGO_URI, JWT_SECRET, etc.)
   
   # Start the development server
   npm run dev
   ```
   *The backend should now be running on `http://localhost:5001`.*

3. **Set up the Frontend:**
   ```bash
   # Open a new terminal tab and navigate to the frontend directory
   cd frontend
   
   # Install dependencies
   npm install
   
   # Start the frontend development server
   npm run dev
   ```
   *The frontend should now be running on `http://localhost:3000`.*


## Project Structure

Just a quick lay of the land to help you navigate:

- `/` (Root): Contains the backend Node/Express setup (routes, db, auth logic, server.js).
- `/frontend`: Contains the complete Next.js frontend application.
- `/backend/routes`: API endpoints handling secure routing and book tracking.

## License

This project is licensed under the [ISC License](LICENSE).

---