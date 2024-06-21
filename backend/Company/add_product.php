<?php

// Enable CORS
if (isset($_SERVER['HTTP_ORIGIN'])) {
    header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Max-Age: 86400');    // cache for 1 day
}

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD'])) {
        header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
    }

    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS'])) {
        header("Access-Control-Allow-Headers: {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");
    }

    exit(0);
}

require_once 'connect.php';
header('Content-Type: application/json');

$dbcon = new DbConnector();
$conn = $dbcon->getConnection();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $product_name = trim($_POST['product_name']);
    $product_price = trim($_POST['product_price']);
    $product_image = $_FILES['product_image']['name'];

    // Sanitize inputs
    $product_name = htmlspecialchars($product_name);
    $product_price = htmlspecialchars($product_price);

    // Validate inputs
    if (!is_numeric($product_price) || empty($product_name) || empty($product_image)) {
        echo json_encode(['message' => 'Invalid input!']);
    } else {
        try {
            // Check for existing product
            $check_existing_query = $conn->prepare("SELECT * FROM `products` WHERE name = ? OR image = ?");
            $check_existing_query->execute([$product_name, $product_image]);

            if ($check_existing_query->rowCount() > 0) {
                echo json_encode(['message' => 'This product already exists!']);
            } else {
                $product_image_temp_name = $_FILES['product_image']['tmp_name'];
                $product_image_folder = '../images/' . $product_image;

                // Insert product
                $insert_query = $conn->prepare("INSERT INTO `products` (name, price, image) VALUES (?, ?, ?)");
                $insert_success = $insert_query->execute([$product_name, $product_price, $product_image]);

                if ($insert_success) {
                    move_uploaded_file($product_image_temp_name, $product_image_folder);
                    echo json_encode(['message' => 'Product inserted successfully.']);
                } else {
                    echo json_encode(['message' => 'There was an error inserting the product']);
                }
            }
        } catch (PDOException $e) {
            echo json_encode(['message' => 'Error: ' . $e->getMessage()]);
        }
    }
}
?>
