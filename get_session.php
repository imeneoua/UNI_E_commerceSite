<?php
session_start();

header('Content-Type: application/json');

if (isset($_SESSION['logged_in']) && $_SESSION['logged_in'] === true) {
    echo json_encode([
        'logged_in' => true,
        'email'     => $_SESSION['email']
    ]);
} else {
    echo json_encode([
        'logged_in' => false,
        'email'     => ''
    ]);
}
?>