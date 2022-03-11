<?php
    header('Content-Type: application/json');
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, POST');
    header("Access-Control-Allow-Headers: X-Requested-With");


    include("db.php");
    $statLoad = $_GET['data'];

    if($statLoad == 1){
        $newChildT = [];
        $getItems = $conn->query("SELECT * FROM data ORDER BY id");

        $i =0;
        while($row = $getItems->fetch_assoc()) {
            $myObj =new stdClass();
            $myObj->state = $row['status'];
            $myObj->itemId = $row['id'];
            $myObj->color = $row['color'];
            $myObj->name = $row['name'];
            $newChildT[$i] = $myObj;	
            $i++;	
        }

        echo json_encode($newChildT, JSON_PRETTY_PRINT);
    }else if($statLoad == 2){
        $id = $_GET['id'];
        $stat = $_GET['stat'];

        $newChildT = [];
        $myObj =new stdClass();
        $myObj->id = $id;
        $myObj->stat = $stat;
        $newChildT[0] = $myObj;

        $updateItems = $conn->query("UPDATE data  SET status=$stat WHERE id=$id");

        echo json_encode($newChildT, JSON_PRETTY_PRINT);

    }else if($statLoad == 3){
        $id = $_GET['id'];
        $color = $_GET['color'];

        $newChildT = [];
        $myObj =new stdClass();
        $myObj->id = $id;
        $myObj->color = $color;
        $newChildT[0] = $myObj;

        $updateItems = $conn->query("UPDATE data  SET color='$color' WHERE id=$id");

        echo json_encode($newChildT, JSON_PRETTY_PRINT);

    }
?>