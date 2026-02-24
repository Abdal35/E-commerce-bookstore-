import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const db = new Database("bookstore.db");

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'user',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    slug TEXT UNIQUE NOT NULL
  );

  CREATE TABLE IF NOT EXISTS books (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    description TEXT,
    price REAL NOT NULL,
    image_url TEXT,
    category_id INTEGER,
    stock INTEGER DEFAULT 0,
    rating REAL DEFAULT 0,
    format TEXT DEFAULT 'Paperback',
    is_featured INTEGER DEFAULT 0,
    FOREIGN KEY (category_id) REFERENCES categories(id)
  );

  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    total REAL NOT NULL,
    status TEXT DEFAULT 'pending',
    address TEXT,
    payment_method TEXT DEFAULT 'COD',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER,
    book_id INTEGER,
    quantity INTEGER,
    price REAL,
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (book_id) REFERENCES books(id)
  );
`);

// Seed initial categories if empty
const catCount = db.prepare("SELECT COUNT(*) as count FROM categories").get() as { count: number };
if (catCount.count === 0) {
  const categories = [
    { name: 'Fiction', slug: 'fiction' },
    { name: 'Non-Fiction', slug: 'non-fiction' },
    { name: 'Science', slug: 'science' },
    { name: 'Self-Help', slug: 'self-help' },
    { name: 'Children', slug: 'children' },
    { name: 'Business', slug: 'business' },
    { name: 'Technology', slug: 'technology' }
  ];
  const insertCat = db.prepare("INSERT INTO categories (name, slug) VALUES (?, ?)");
  categories.forEach(c => insertCat.run(c.name, c.slug));
}

// Seed initial books if empty
const bookCount = db.prepare("SELECT COUNT(*) as count FROM books").get() as { count: number };
if (bookCount.count === 0) {
  const books = [
    { title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', price: 15.99, image_url: 'https://picsum.photos/seed/gatsby/400/600', category_id: 1, stock: 50, rating: 4.5, is_featured: 1 },
    { title: 'Sapiens', author: 'Yuval Noah Harari', price: 22.50, image_url: 'https://picsum.photos/seed/sapiens/400/600', category_id: 2, stock: 30, rating: 4.8, is_featured: 1 },
    { title: 'Atomic Habits', author: 'James Clear', price: 18.00, image_url: 'https://picsum.photos/seed/habits/400/600', category_id: 4, stock: 100, rating: 4.9, is_featured: 1 },
    { title: 'Clean Code', author: 'Robert C. Martin', price: 35.00, image_url: 'https://picsum.photos/seed/cleancode/400/600', category_id: 7, stock: 20, rating: 4.7, is_featured: 0 },
    { title: 'The Hobbit', author: 'J.R.R. Tolkien', price: 12.99, image_url: 'https://picsum.photos/seed/hobbit/400/600', category_id: 1, stock: 45, rating: 4.6, is_featured: 1 },
    { title: 'Thinking, Fast and Slow', author: 'Daniel Kahneman', price: 19.99, image_url: 'https://picsum.photos/seed/thinking/400/600', category_id: 2, stock: 25, rating: 4.4, is_featured: 0 }
  ];
  const insertBook = db.prepare("INSERT INTO books (title, author, price, image_url, category_id, stock, rating, is_featured) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
  books.forEach(b => insertBook.run(b.title, b.author, b.price, b.image_url, b.category_id, b.stock, b.rating, b.is_featured));
}

async function startServer() {
  const app = express();
  const PORT = 3000;
  const JWT_SECRET = process.env.JWT_SECRET || "lumina-secret-key";

  app.use(express.json());
  app.use(cookieParser());

  // Auth Middleware
  const authenticate = (req: any, res: any, next: any) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ error: "Unauthorized" });
    try {
      req.user = jwt.verify(token, JWT_SECRET);
      next();
    } catch (err) {
      res.status(401).json({ error: "Invalid token" });
    }
  };

  // API Routes
  app.get("/api/books", (req, res) => {
    const { category, search, featured, maxPrice } = req.query;
    let query = "SELECT b.*, c.name as category_name FROM books b LEFT JOIN categories c ON b.category_id = c.id WHERE 1=1";
    const params: any[] = [];

    if (category) {
      query += " AND c.slug = ?";
      params.push(category);
    }
    if (search) {
      query += " AND (b.title LIKE ? OR b.author LIKE ?)";
      params.push(`%${search}%`, `%${search}%`);
    }
    if (featured === 'true') {
      query += " AND b.is_featured = 1";
    }
    if (maxPrice) {
      query += " AND b.price <= ?";
      params.push(Number(maxPrice));
    }

    const books = db.prepare(query).all(...params);
    res.json(books);
  });

  app.get("/api/books/:id", (req, res) => {
    const book = db.prepare("SELECT b.*, c.name as category_name FROM books b LEFT JOIN categories c ON b.category_id = c.id WHERE b.id = ?").get(req.params.id);
    if (!book) return res.status(404).json({ error: "Book not found" });
    res.json(book);
  });

  app.get("/api/categories", (req, res) => {
    const categories = db.prepare("SELECT * FROM categories").all();
    res.json(categories);
  });

  // Auth Routes
  app.post("/api/auth/register", async (req, res) => {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
      const result = db.prepare("INSERT INTO users (name, email, password) VALUES (?, ?, ?)").run(name, email, hashedPassword);
      const token = jwt.sign({ id: result.lastInsertRowid, email, name }, JWT_SECRET);
      res.cookie("token", token, { httpOnly: true, secure: true, sameSite: 'none' });
      res.json({ user: { id: result.lastInsertRowid, name, email } });
    } catch (err) {
      res.status(400).json({ error: "Email already exists" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    const { email, password } = req.body;
    const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email) as any;
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const token = jwt.sign({ id: user.id, email: user.email, name: user.name, role: user.role }, JWT_SECRET);
    res.cookie("token", token, { httpOnly: true, secure: true, sameSite: 'none' });
    res.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  });

  app.post("/api/auth/logout", (req, res) => {
    res.clearCookie("token");
    res.json({ message: "Logged out" });
  });

  app.get("/api/auth/me", (req, res) => {
    const token = req.cookies.token;
    if (!token) return res.json({ user: null });
    try {
      const user = jwt.verify(token, JWT_SECRET);
      res.json({ user });
    } catch (err) {
      res.json({ user: null });
    }
  });

  // Order Routes
  app.post("/api/orders", authenticate, (req: any, res) => {
    const { items, total, address, paymentMethod } = req.body;
    const userId = req.user.id;

    const transaction = db.transaction(() => {
      const orderResult = db.prepare("INSERT INTO orders (user_id, total, address, payment_method) VALUES (?, ?, ?, ?)").run(userId, total, address, paymentMethod);
      const orderId = orderResult.lastInsertRowid;

      const insertItem = db.prepare("INSERT INTO order_items (order_id, book_id, quantity, price) VALUES (?, ?, ?, ?)");
      const updateStock = db.prepare("UPDATE books SET stock = stock - ? WHERE id = ?");

      for (const item of items) {
        insertItem.run(orderId, item.id, item.quantity, item.price);
        updateStock.run(item.quantity, item.id);
      }
      return orderId;
    });

    try {
      const orderId = transaction();
      res.json({ orderId, message: "Order placed successfully" });
    } catch (err) {
      res.status(500).json({ error: "Failed to place order" });
    }
  });

  app.get("/api/orders/my", authenticate, (req: any, res) => {
    const orders = db.prepare("SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC").all(req.user.id);
    res.json(orders);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static("dist"));
    app.get("*", (req, res) => {
      res.sendFile(path.resolve("dist/index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
