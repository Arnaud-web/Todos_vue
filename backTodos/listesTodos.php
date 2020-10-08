<?php

$servername = "localhost";
$username = "root";
$password = "root";
$dbname = "todo";

try {
    $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $stmt = $conn->prepare("SELECT id, name, completed FROM todolist  ");
    $stmt->execute();

    // set the resulting array to associative
    $result = $stmt->setFetchMode(PDO::FETCH_ASSOC);
    // $dataLast = $stmt->fetch();
    $data = $stmt->fetchAll();
        // $data= json_encode($data);
        // var_dump ($data);
        // $dataLast = json_encode($dataLast);
    // $dataLast = $stmt->fetch();
    // $donne= json_encode($dataLast);
// $donne = [$datas,"last" => $dataLast];


}
catch(PDOException $e) {
    echo "Error: " . $e->getMessage();
}
$donner = ["allData"=> $data, "LastData" => 'null'];
$conn = null;
// echo ($data) . $dataLast;
$donner = json_encode($donner);
echo $donner;
?>