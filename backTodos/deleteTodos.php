<?php

$servername = "localhost";
$username = "root";
$password = "root";
$dbname = "todo";
if(isset($_GET["id"])){
    $id = $_GET["id"];

try {
    $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
    // set the PDO error mode to exception
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // sql to delete a record
    $sql = "DELETE FROM todolist WHERE id=$id";

    // use exec() because no results are returned
    $conn->exec($sql);
    $msg = "Record deleted successfully";
    }
catch(PDOException $e)
    {
    $msg= $sql . "<br>" . $e->getMessage();
    }
    $data = array("completed"=> '',"name"=> $id,"messsge " => $msg);
$conn = null;
}

$data = json_encode($data);
echo "[".$data."]"  ;
?>
