<?php
include 'database.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    
    //login
    if (isset($_POST['login'])) {

        // handle "Remember Me" brfore session_start()
        if (isset($_POST['remember'])) {
            $lifetime = 30 * 24 * 60 * 60; // 30 days (save sessin)
            session_set_cookie_params($lifetime);
        } else {
            session_set_cookie_params(0);
        }

        session_start();

        $email    = trim($_POST['email']);
        $password = $_POST['password'];

        // validate fieldss
        if (empty($email) || empty($password)) {
            header('Location: index.html?error=empty_fields');
            exit();
        }

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            header('Location: index.html?error=invalid_email');
            exit();
        }

        //check it the account exists
        $stmt = $conn->prepare("SELECT account_id, email, password FROM account WHERE email = ?");
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows === 0) {
            header('Location: index.html?error=invalid_login');
            exit();
        }

        $account = $result->fetch_assoc();

        //verify password
        if (!password_verify($password, $account['password'])) {
            header('Location: index.html?error=invalid_login');
            exit();
        }

        // get customer_id linked to this account
        $stmt2 = $conn->prepare("SELECT customer_id FROM custumer WHERE account_id = ?");
        $stmt2->bind_param("i", $account['account_id']);
        $stmt2->execute();
        $cust_result = $stmt2->get_result();
        $cust_row    = $cust_result->fetch_assoc();

        if (!session_regenerate_id(true)) {
            error_log('Failed to regenerate the session ID after login.');
            header('Location: index.html?error=server_error');
            exit();
        }

        //save session
        $_SESSION['account_id']  = $account['account_id'];
        $_SESSION['customer_id'] = $cust_row['customer_id'] ?? $account['account_id'];
        $_SESSION['email']       = $account['email'];
        $_SESSION['logged_in']   = true;

        header('Location: main.html');
        exit();
    }


    // regiister( sign up)
    if (isset($_POST['action']) && $_POST['action'] === 'register') {

        session_start();

        $email    = trim($_POST['email']);
        $password = $_POST['password'];

        // validate fields
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

        // check if email already exists
        $stmt = $conn->prepare("SELECT account_id FROM account WHERE email = ?");
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            header('Location: index.html?error=email_exists');
            exit();
        }

        //hash password and insert into account table
        $password_hash = password_hash($password, PASSWORD_BCRYPT);

        $stmt = $conn->prepare("INSERT INTO account (email, password) VALUES (?, ?)");
        $stmt->bind_param("ss", $email, $password_hash);

        if ($stmt->execute()) {
            $account_id = $conn->insert_id;

            // also insert into custumer table (linked to account)
            $stmt2 = $conn->prepare(
                "INSERT INTO custumer (account_id, name, address, phone) VALUES (?, '', '', '')"
            );
            $stmt2->bind_param("i", $account_id);
            $stmt2->execute();
            $customer_id = $conn->insert_id;

            if (!session_regenerate_id(true)) {
                error_log('Failed to regenerate the session ID after registration.');
                header('Location: index.html?error=server_error');
                exit();
            }
            
            // save session
            $_SESSION['account_id']  = $account_id;
            $_SESSION['customer_id'] = $customer_id;
            $_SESSION['email']       = $email;
            $_SESSION['logged_in']   = true;

            header('Location: main.html');
            exit();

        } else {
            header('Location: index.html?error=registration_failed');
            exit();
        }
    }
}
?>