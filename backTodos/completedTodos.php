<?php

$servername = "localhost";
$username = "root";
$password = "root";
$dbname = "todo";
$name = '';
$completed = '';
if(isset($_GET["id"])){
    $id = $_GET["id"];


try {
    $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
    // set the PDO error mode to exception
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // sql to delete a record
    if(isset($_GET["completed"])){
        $completed = $_GET["completed"];
            $sql = "UPDATE todolist SET completed = $completed WHERE id=$id";

            // use exec() because no results are returned
            $conn->exec($sql);
            $msg = "records UPDATED successfully";
    }
    if(isset($_GET["name"])){
        $name = $_GET["name"];
            $sql = "UPDATE todolist SET name = '$name' WHERE id=$id";

            // use exec() because no results are returned
            $conn->exec($sql);
            $msg = "records UPDATED successfully";
    }
    } catch(PDOException $e)
    {
    $msg= $sql . "<br>" . $e->getMessage();
    }
    $data = array("completed"=> $completed,"name"=>$name,"id"=> $id,"messsge " => $msg );
    
$conn = null;
}


$data = json_encode($data);
echo "[".$data."]"  ;
?>
