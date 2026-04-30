<?php
session_start();
include 'database.php';

// 1. Check if user is logged in
if (!isset($_SESSION['logged_in']) || $_SESSION['logged_in'] !== true) {
    header('Location: index.html?error=not_logged_in');
    exit();
}

// 2. Check if it's a POST request
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: main.html');
    exit();
}

// 3. Get cart JSON from POST
$cart_json = $_POST['cart_data'] ?? '';

if (empty($cart_json)) {
    header('Location: main.html?error=empty_cart');
    exit();
}

// 4. Decode cart JSON into PHP array
$cart = json_decode($cart_json, true);

if (!$cart || count($cart) === 0) {
    header('Location: main.html?error=empty_cart');
    exit();
}

// 5. Get customer id from session
$customer_id = $_SESSION['customer_id'] ?? $_SESSION['account_id'];
$order_date  = date('Y-m-d H:i:s');

// 6. Loop through each cart item and save to orders table
foreach ($cart as $item) {

    $title    = $item['title'];
    $quantity = (int) $item['qty'];

    // find product_id and real price from DB by product name
    $find = $conn->prepare("SELECT product_id, price FROM product WHERE name = ?");
    $find->bind_param("s", $title);
    $find->execute();
    $result = $find->get_result();

    // if product not found in DB, skip it
    if ($result->num_rows === 0) continue;

    $product     = $result->fetch_assoc();
    $product_id  = (int) $product['product_id'];
    $total_price = (float) $product['price'] * $quantity;

    // insert one row per cart item into orders table
    $stmt = $conn->prepare(
        "INSERT INTO orders (customer_id, product_id, quantity, order_date, total_price)
         VALUES (?, ?, ?, ?, ?)"
    );
    $stmt->bind_param("iiisd",
        $customer_id,
        $product_id,
        $quantity,
        $order_date,
        $total_price
    );
    $stmt->execute();
}

// 7. Redirect to main page with success message
header('Location: main.html?success=order_placed');
exit();
?>