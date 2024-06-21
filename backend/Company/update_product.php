<?php
require_once '../connect.php';

$dbcon = new DbConnector();
$conn = $dbcon->getConnection();

$display_message = '';

if (isset($_POST['update_product_id'])) {
    $update_product_id = $_POST['update_product_id'];
    $update_product_name = $_POST['update_product_name'];
    $update_product_price = $_POST['update_product_price'];

    if ($_FILES['update_product_image']['name']) {
        $update_product_image = $_FILES['update_product_image']['name'];
        $update_product_image_tmp_name = $_FILES['update_product_image']['tmp_name'];
        $update_product_image_folder = '../images/'.$update_product_image;
        move_uploaded_file($update_product_image_tmp_name, $update_product_image_folder);
    } else {
        $update_product_image = $_POST['current_product_image'];
    }

    try {
        $check_name_query = "SELECT * FROM `products` WHERE name=:name AND id != :id";
        $check_name_stmt = $conn->prepare($check_name_query);
        $check_name_stmt->execute([':name' => $update_product_name, ':id' => $update_product_id]);

        $check_image_query = "SELECT * FROM `products` WHERE image=:image AND id != :id";
        $check_image_stmt = $conn->prepare($check_image_query);
        $check_image_stmt->execute([':image' => $update_product_image, ':id' => $update_product_id]);

        if ($check_name_stmt->rowCount() > 0) {
            echo json_encode(["error" => "Product name already exists."]);
        } elseif ($check_image_stmt->rowCount() > 0) {
            echo json_encode(["error" => "Product image already exists."]);
        } else {
            $update_query = "UPDATE `products` SET name=:name, price=:price, image=:image WHERE id=:id";
            $update_stmt = $conn->prepare($update_query);
            $update_success = $update_stmt->execute([
                ':name' => $update_product_name,
                ':price' => $update_product_price,
                ':image' => $update_product_image,
                ':id' => $update_product_id
            ]);

            if ($update_success) {
                echo json_encode(["success" => "Product updated successfully."]);
            } else {
                echo json_encode(["error" => "Error updating the product."]);
            }
        }
    } catch (PDOException $e) {
        echo json_encode(["error" => $e->getMessage()]);
    }
}
?>
