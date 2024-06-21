<?php
require_once '../connect.php';

$dbcon = new DbConnector();
$conn = $dbcon->getConnection();

try {
    $stmt = $conn->query("SELECT * FROM `products`");
    $products = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($products);
} catch (PDOException $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
?>
