<?php
    $db_host = getenv('DB_HOST');
    $db_name = getenv('DB_NAME') ?: 'ecommerce_db';
    $db_user = getenv('DB_USER');
    $db_pass = getenv('DB_PASSWORD');

    $missing_variables = [];
    foreach ([
        'DB_HOST' => $db_host,
        'DB_USER' => $db_user,
        'DB_PASSWORD' => $db_pass
    ] as $variable => $value) {
        if ($value === false || trim($value) === '') {
            $missing_variables[] = $variable;
        }
    }

    if ($missing_variables) {
        error_log('Database configuration is incomplete. Set: ' . implode(', ', $missing_variables));
        http_response_code(500);
        exit('Database configuration error. Check the server logs.');
    }

    try {
        $conn = mysqli_connect($db_host, $db_user, $db_pass, $db_name);
    } catch (mysqli_sql_exception $exception) {
        $conn = false;
    }

    if (!$conn) {
        error_log('Database connection failed. Verify DB_HOST, DB_NAME, DB_USER, DB_PASSWORD and that the database server is reachable.');
        http_response_code(500);
        exit('Database connection unavailable. Check the server logs.');
    }
?>