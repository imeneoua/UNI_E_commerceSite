<?php
include 'database.php';
//check if "remember me" was checked

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    
    // LOGIN
    if (isset($_POST['login'])) {
        
        // Handle "Remember Me" BEFORE session_start()
        if (isset($_POST['remember'])) {
            // Remember for 30 days
            $lifetime = 30 * 24 * 60 * 60;
            session_set_cookie_params($lifetime);
        } else {
            // Session ends when browser closes
            session_set_cookie_params(0);
        }
        
        // NOW start the session
        session_start();
        
        $email = trim($_POST['email']);
        $password = $_POST['password'];
        
        if (empty($email) || empty($password)) {
            $_SESSION['error'] = "All fields required";
            header('Location: index.html');
            exit();
        }
        
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $_SESSION['error'] = "Invalid email";
            header('Location: index.html');
            exit();
        }
        
        $query = "SELECT account_id, email, password FROM account WHERE email = ?";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows === 0) {
            $_SESSION['error'] = "Invalid email or password";
            header('Location: index.html');
            exit();
        }
        
        $account = $result->fetch_assoc();
        
        if (!password_verify($password, $account['password'])) {
            $_SESSION['error'] = "Invalid email or password";
            header('Location: index.html');
            exit();
        }
        
        // Login success
        $_SESSION['account_id'] = $account['account_id'];
        $_SESSION['email'] = $account['email'];
        $_SESSION['logged_in'] = true;
        
        header('Location: main.html');
        exit();
    }
    
    
    // SIGN UP 
    if (isset($_POST['signin'])) {
        
        // Start session (no remember me for signup)
        session_start();
        
        $email = trim($_POST['email']);
        $password = $_POST['password'];
        
        if (empty($email) || empty($password)) {
            $_SESSION['error'] = "All fields required";
            header('Location: login.php');
            exit();
        }
        
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $_SESSION['error'] = "Invalid email format";
            header('Location: login.php');
            exit();
        }
        
        if (strlen($password) < 8) {
            $_SESSION['error'] = "Password must be at least 8 characters";
            header('Location: login.php');
            exit();
        }
        
        // Check if email exists
        $query = "SELECT account_id FROM account WHERE email = ?";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows > 0) {
            $_SESSION['error'] = "Email already registered";
            header('Location: login.php');
            exit();
        }
        
        // Hash password and insert
        $password_hash = password_hash($password, PASSWORD_BCRYPT);
        
        $query = "INSERT INTO account (email, password) VALUES (?, ?)";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("ss", $email, $password_hash);
        
        if ($stmt->execute()) {
            $account_id = $conn->insert_id;
            
            $_SESSION['account_id'] = $account_id;
            $_SESSION['email'] = $email;
            $_SESSION['logged_in'] = true;
            
            header('Location: main.html');
            exit();
        } else {
            $_SESSION['error'] = "Registration failed: " . $conn->error;
            header('Location: login.php');
            exit();
        }
    }
}
?>