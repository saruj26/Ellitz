<?php
require_once '../connect.php';

$dbcon = new DbConnector();
$conn = $dbcon->getConnection();

if (isset($_GET['delete'])) {
    $delete_id = $_GET['delete'];

    try {
        $delete_query = "DELETE FROM `products` WHERE id=:id";
        $delete_stmt = $conn->prepare($delete_query);
        $delete_stmt->execute([':id' => $delete_id]);

        if ($delete_stmt->rowCount() > 0) {
            echo json_encode(["success" => "Product deleted successfully."]);
        } else {
            echo json_encode(["error" => "Product not deleted."]);
        }
    } catch (PDOException $e) {
        echo json_encode(["error" => $e->getMessage()]);
    }
}
?>
