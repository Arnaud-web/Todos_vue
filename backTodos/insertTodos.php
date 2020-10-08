<?php
$servername = "localhost";
$username = "root";
$password = "root";
$dbname = "todo";
$nom = "pas de reponse";
$data = array("valide"=> false,"nom"=> $nom);
if(isset($_POST)){
    $nom = "POST";
$data = array("valide"=> false,"nom"=> $_POST);
}
if(isset($_GET["nom"])){
    $name = $_GET["nom"];

    try {
        $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
        // set the PDO error mode to exception
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $sql = "INSERT INTO todolist (name, completed, last_id ) VALUES ('$name', false,1)";
        // use exec() because no results are returned
        $conn->exec($sql);
        $latest_id = $conn->lastInsertId();
        $sql = "UPDATE   todolist SET last_id = $latest_id ";
        $conn->exec($sql);
        $msg  = "New record created successfully"; 
        }
    catch(PDOException $e)
        {
        $msg  = $sql . " ". $e->getMessage();
        }
        $data = array("completed"=> false,"name"=> $nom,"messsge " => $msg);
        
    $conn = null;
}

$data = json_encode($data);
echo "[".$data."]"  ;