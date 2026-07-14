# NOKHBA — E-Commerce Web Platform

NOKHBA is a full-stack e-commerce web platform built for the **OpenNova Hackathon**. It brings together three curated product categories — Books, Flowers, and Study Products — behind a single storefront with real user accounts, a persistent shopping cart, and a secure checkout flow.

The stack is deliberately simple and transparent: vanilla HTML, CSS, and JavaScript on the front end, PHP on the back end, and MySQL for storage — no frameworks, no build step. Under the hood it handles the details that separate a real store from a mockup: bcrypt-hashed passwords, prepared SQL statements against injection, server-side price verification at checkout (so the cart total can never be tampered with client-side), and session-based auth that syncs live across static HTML pages via a small JSON endpoint.

---

## Team Members

| Name | Email |
|------|-------|
| Grib Zeina | alaebouya07@gmail.com |
| Kouni Douaa | douaa.kh1617@gmail.com |
| Adadoua Randa | r.adadoua.fs@univ-boumerdes.dz |
| Bouyahiaoui Alae | zeinagrib850@gmail.com |

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

## Database Structure

The database `ecommerce_db` contains 4 tables as required by the assignment.

### account
Stores login credentials for each user.

| Column | Type | Description |
|--------|------|-------------|
| account_id | INT AUTO_INCREMENT | Primary key |
| email | VARCHAR(255) | Unique email address |
| password | VARCHAR(255) | Hashed password using bcrypt |

### custumer
Stores customer information linked to their account.

| Column | Type | Description |
|--------|------|-------------|
| customer_id | INT AUTO_INCREMENT | Primary key |
| account_id | INT | Foreign key referencing account |
| name | VARCHAR(255) | Customer full name |
| address | TEXT | Delivery address |
| phone | VARCHAR(255) | Phone number |

### product
Stores all 54 products across 3 categories.

| Column | Type | Description |
|--------|------|-------------|
| product_id | INT AUTO_INCREMENT | Primary key |
| name | VARCHAR(255) | Product name |
| price | DECIMAL(10,2) | Product price in DA |
| category | VARCHAR(255) | Product category |
| image | VARCHAR(255) | Image file path |
| description | TEXT | Short description |

### orders
Saves every checkout order.

| Column | Type | Description |
|--------|------|-------------|
| order_id | INT AUTO_INCREMENT | Primary key |
| customer_id | INT | Foreign key referencing custumer |
| product_id | INT | Foreign key referencing product |
| quantity | INT | Quantity ordered |
| order_date | DATETIME | Date and time of order |
| total_price | DECIMAL(10,2) | Total price for this item |

---

## Technologies Used

| Technology | Usage |
|-----------|-------|
| HTML5 | Page structure and semantic markup |
| CSS3 | Styling, animations, glassmorphism effects |
| JavaScript (vanilla) | Cart logic, session check, form handling |
| PHP 8 | Authentication, session management, order saving |
| MySQL | Database storage |
| localStorage | Client-side cart persistence between page reloads |
| WAMP | Local development server |

---

## Features

### Authentication

The login and registration forms are on the same page with a smooth slide animation between them. Passwords are never stored as plain text — they are hashed using PHP's `password_hash()` function with bcrypt. When the user checks Remember Me, the session cookie is set to last 30 days. If not checked, the session ends when the browser closes. Errors like wrong password or email not found are passed back through the URL and displayed as toast notifications by JavaScript.

### Main Page

The main page shows a hero section, three category cards that navigate to Books, Flowers, and Study Products, and a best sellers grid with 8 featured products. When the user is logged in, JavaScript calls `get_session.php` — a small PHP file that reads the session and returns JSON — and replaces the Sign In button with a circle showing the first letter of the user's email. The profile dropdown has a smooth animation and includes a Logout link.

### Category Pages

Each category page has a horizontal product slider built with CSS `overflow-x: auto`. The arrow buttons use JavaScript to scroll the strip. Clicking a product card opens a popup modal with the full description, price, rating, and a quantity selector. The user can add to cart from both the card button and the popup.

### Shopping Cart

The cart sidebar slides in from the right using a CSS transition. It shows two panels side by side — the item list on the left and the order summary on the right. The quantity controls update in real time, items can be removed, and promo codes can be applied. All cart data is stored in `localStorage`, which means it persists between page reloads but is cleared when the user logs out.

Available promo codes: `SAVE10` (10% off), `BLOOM20` (20% off), `WELCOME` (5% off).

### Checkout and Orders

When the user clicks Checkout, JavaScript converts the cart to JSON and submits it to `save_order.php` via a hidden form. PHP then reads each item, looks up the real price from the database — never trusting the price sent from the browser — and inserts one row per item into the orders table. After a successful checkout, the cart is cleared from localStorage and a success toast is shown.

### Logout

Logout calls `logout.php` which runs `session_unset()` and `session_destroy()` to fully clear the PHP session. JavaScript then removes the cart from localStorage and redirects to the login page.

---

## How to Run Locally

1. Make sure WAMP is installed and running
2. Copy the project folder to `C:\wamp64\www\`
3. Open phpMyAdmin at `http://localhost/phpmyadmin`
4. Create a database called `ecommerce_db`
5. Import `ecommerce_db.sql` using the Import tab
6. Open `http://localhost/E_Commerce_project/index.html` in your browser

The database connection uses default WAMP credentials — host: `localhost`, user: `root`, password: empty.

---

## Product Categories

### Books — 18 products

**Fantasy:** Amareta, Laws of Jartin, Searraush, Harry Potter, The Name of The Wind, Dead Until Dark

**Horror:** Write Lest The Devil Devour Me, It Happens at Night in the Locked Room, Fear, I Am Rotting with Fear, The Abyss, The Far Lady's House

**Crime Fiction:** The Streets Murderer, Murder on the Orient Express, The Silent Patient, And Then There Were None, Blood on the Red Carpet, A Study In Scarlet

### Flowers — 18 products

**Romantic Bouquets:** Red Roses, White Lilies, Pink Peonies, Red Tulips, Purple Orchids, Sunflowers

**Home Decor:** Lavender, Hydrangea, White Daisy, Yellow Chrysanthemum, Red Anthurium, Gardenia

**Exotic & Luxury:** Black Bacaara Rose, Ghost Orchid, Bird of Paradise, Blue Poppy, King Protea, Cherry Blossom

### Study Products — 18 products

**Smart Desk Gadgets:** Retro Mechanical Keyboard, Sunset Projection Lamp, Digital Flip Clock, Wireless Bluetooth Mouse, Aesthetic Desk Humidifier, Mini Photo Printer

**Desk Organization:** Aesthetic Storage Crate, Acrylic Monitor Stand, Pegboard Desk Organizer, Minimalist Pen Holder, Transparent Desk Mat, Kawaii Storage Drawers

**Stationery & Paper:** Morandi Gel Pens, Vintage Scrapbook Paper, Aesthetic Spiral Planner, Flower Petal Washi Tape, Clear Acrylic Clipboard, Pastel Sticky Notes

---

## Security

Passwords are hashed with bcrypt and never stored as plain text. All database queries use prepared statements with bound parameters, which makes SQL injection impossible. Product prices are always fetched from the database on the server side during checkout — a user cannot change the price by editing the HTML or JavaScript. The session is verified before every protected action, and error messages never reveal which specific field was wrong to avoid giving information to potential attackers.

---

## Notes

- The table name `custumer` contains a typo — this is kept intentionally to match the existing database schema that was already in use during development.
- PHP and HTML files are kept completely separate as required. PHP never mixes with HTML templates. The only connection between them is through form submissions and the `get_session.php` fetch call.
- The `get_session.php` file exists because `main.html` is a plain HTML file and cannot read PHP sessions directly. JavaScript calls this file using `fetch()` to check whether the user is logged in.
- Cart logic is fully client-side using JavaScript and localStorage, as specified in the assignment requirements.

---


