<?php

$servername = "localhost";
$username = "root";
$password = "root";
$dbname = "todo";

try {
    $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $stmt = $conn->prepare("SELECT id FROM todolist  ORDER BY id DESC");
    $stmt->execute();

    // set the resulting array to associative
    $result = $stmt->setFetchMode(PDO::FETCH_ASSOC);
    $data = $stmt->fetch();
    $data= json_encode($data);
        // var_dump ($data);

}
catch(PDOException $e) {
    echo "Error: " . $e->getMessage();
}
$conn = null;
echo $data
?>