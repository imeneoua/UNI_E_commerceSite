<?php
include 'database.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    
    //login
    if (isset($_POST['login'])) {
        
        // handle "Remember Me" BEFORE session_start()
        if (isset($_POST['remember'])) {
            $lifetime = 30 * 24 * 60 * 60;  // 30 days
            session_set_cookie_params($lifetime);
        } else {
            session_set_cookie_params(0);
        }
        
        session_start();
        
        $email = trim($_POST['email']);
        $password = $_POST['password'];
        
        if (empty($email) || empty($password)) {
            header('Location: index.html?error=empty_fields');
            exit();
        }
        
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            header('Location: index.html?error=invalid_email');
            exit();
        }
        
        $query = "SELECT account_id, email, password FROM account WHERE email = ?";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows === 0) {
            header('Location: index.html?error=invalid_login');
            exit();
        }
        
        $account = $result->fetch_assoc();
        
        if (!password_verify($password, $account['password'])) {
            header('Location: index.html?error=invalid_login');
            exit();
        }
        
        // Login success
        $_SESSION['account_id'] = $account['account_id'];
        $_SESSION['email'] = $account['email'];
        $_SESSION['logged_in'] = true;
        
        header('Location: main.html');
        exit();
    }
    
    
    // sign up
    if (isset($_POST['signin'])) {
        
        session_start();
        
        $email = trim($_POST['email']);
        $password = $_POST['password'];
        
        if (empty($email) || empty($password)) {
            header('Location: index.html?error=empty_fields');
            exit();
        }
        
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            header('Location: index.html?error=invalid_email');
            exit();
        }
        
        if (strlen($password) < 8) {
            header('Location: index.html?error=short_password');
            exit();
        }
        
        // chheck if email already exists
        $query = "SELECT account_id FROM account WHERE email = ?";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows > 0) {
            header('Location: index.html?error=email_exists');
            exit();
        }
        
        // hash password and insert
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
            header('Location: index.html?error=registration_failed');
            exit();
        }
    }
}
?>