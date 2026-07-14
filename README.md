# NOKHBA — E-Commerce Web Platform

NOKHBA is a full-stack e-commerce web application that brings together three distinct product worlds — books, flowers, and study essentials — into one clean and intuitive shopping experience. Built from scratch during the OpenNova Hackathon, the project covers everything from user authentication to real-time cart management and database-backed order processing.

---

## The Idea

We wanted to build something that felt like a real store — not just a demo. NOKHBA lets users browse curated products across three categories, add items to a persistent cart, apply discount codes, and place orders that are saved to a database linked to their account. The name NOKHBA (نخبة) means "the elite" in Arabic — reflecting our focus on a curated, quality selection.

---

## Team Members

| Name             | Email                          |
| ---------------- | ------------------------------ |
| Grib Zeina       | zeinagrib850@gmail.com         |
| Kouni Douaa      | douaa.kh1617@gmail.com         |
| Adadoua Randa    | r.adadoua.fs@univ-boumerdes.dz |
| Bouyahiaoui Alae | alaebouya07@gmail.com |

---

## Project Structure

```
E_Commerce_Project/
├── index.html              # Authentication page (login + register)
├── main.html               # Main product catalog page
├── books.html              # Books category page
├── flowers.html            # Flowers category page
├── study-product.html      # Study products category page
├── style.css               # External CSS for the entire project
├── script.js               # External JavaScript for the entire project
├── login.php               # Handles login and registration
├── logout.php              # Destroys session and clears cart
├── save_order.php          # Saves checkout orders to the database
├── get_session.php         # Returns session info as JSON for JavaScript
├── database.php            # MySQL database connection
├── images/                 # All product images
└── ecommerce_db.sql        # Full database export
```

---

## Technologies Used

| Technology           | Usage                                             |
| -------------------- | ------------------------------------------------- |
| HTML5                | Page structure and semantic markup                |
| CSS3                 | Styling, animations, glassmorphism effects        |
| JavaScript (vanilla) | Cart logic, session check, form handling          |
| PHP 8                | Authentication, session management, order saving  |
| MySQL                | Database storage                                  |
| localStorage         | Client-side cart persistence between page reloads |
| WAMP                 | Local development server                          |

---

## What It Does

### Authentication

Users can register and log in from the same page. The two forms slide between each other with a smooth animation. Passwords are hashed with bcrypt before being stored — plain text passwords never touch the database. A Remember Me option keeps the session alive for 30 days. Errors are shown as toast notifications without exposing which field specifically was wrong.

### Product Catalog

The main page greets the user with a hero section and three category cards. Each card navigates to a dedicated category page. There is also a best sellers section showing 8 handpicked products. When the user is logged in, JavaScript fetches their session data from a PHP bridge file and replaces the Sign In button with a circle avatar showing the first letter of their email.

### Category Pages

Books, Flowers, and Study Products each have their own page with horizontal sliders organized by sub-category. Clicking a product opens a modal popup with the full description, rating, price, and a quantity selector. Products can be added to cart from either the card button or the popup.

### Shopping Cart

The cart lives as a slide-in sidebar with two panels — the item list and the order summary. It is powered entirely by JavaScript and localStorage, which means the cart persists between page reloads and works without any server calls until checkout. Users can adjust quantities, remove items, and apply promo codes in real time.

Promo codes available: `SAVE10` for 10% off, `BLOOM20` for 20% off, and `WELCOME` for 5% off.

### Checkout and Orders

When the user clicks Checkout, JavaScript serializes the cart as JSON and submits it to the server. PHP then looks up the real price of each item from the database — ignoring whatever price was in the browser — and saves one row per product into the orders table. This means prices cannot be tampered with from the client side. After a successful order, the cart is cleared and a confirmation toast appears.

### Logout

Logging out destroys the PHP session completely and clears the cart from localStorage. The user is redirected to the login page with a clean slate.

---

## Database Structure

Four tables power the backend:

**account** stores email and hashed password for each registered user.

**custumer** stores customer details linked to their account. A row is automatically created here every time a new account is registered.

**product** holds all 54 products with their name, price, category, image path, and description.

**orders** records every checkout. Each row represents one product from one order, linked to the customer and the product by foreign keys.

---

## Product Catalog — 54 Products

### Books

Fantasy, Horror, and Crime Fiction — 18 books including Harry Potter, Murder on the Orient Express, The Silent Patient, Fear, and more.

### Flowers

Romantic Bouquets, Home Decor Flowers, and Exotic & Luxury selections — 18 arrangements including Ghost Orchid, Cherry Blossom, Black Bacaara Rose, Lavender, and more.

### Study Products

Smart Desk Gadgets, Desk Organization, and Stationery & Paper — 18 items including the Retro Mechanical Keyboard, Mini Photo Printer, Morandi Gel Pens, and more.

---

## How to Run

1. Install and start WAMP
2. Copy the project folder to `C:\wamp64\www\`
3. Open phpMyAdmin and create a database called `ecommerce_db`
4. Import `ecommerce_db.sql`
5. Open `http://localhost/E_Commerce_project/index.html`

Default WAMP credentials are used — host: `localhost`, user: `root`, password: empty.

---

## Security Highlights

- Passwords hashed with bcrypt — never stored as plain text
- All SQL queries use prepared statements — SQL injection is not possible
- Prices are verified server-side on every checkout — client-side values are ignored
- Sessions are checked before every protected action
- Error messages are generic — they do not reveal which field was wrong

---

## A Few Technical Decisions Worth Mentioning

We kept PHP and HTML completely separate throughout the project. There is no mixed PHP and HTML templating — the two communicate only through form submissions and a single `fetch()` call to `get_session.php`. This was a deliberate choice to keep the code clean and the responsibilities clear.

The cart is fully client-side as it should be for performance and user experience. It only touches the server at the moment of checkout, which is when the data actually needs to be permanent.

Product prices are never trusted from the browser. Even if someone modified the JavaScript or the localStorage values, the server always fetches the real price from the database before saving the order.

---

_Built for the OpenNova Hackathon — 2026_
