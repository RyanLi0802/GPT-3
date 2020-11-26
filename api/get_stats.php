<?php
    include 'common.php';

    try {
        $rows = $db->query("SELECT * FROM Stats");
    }
    catch (PDOException $ex) {
        db_error_message("Can not query the database.", $ex);
    }


    header("Content-type: application/json");
    $output = array();
    foreach ($rows as $row) {
        $stats = array(
            "qid" => $row["qid"],
            "answer" => $row["answer"],
            "option1" => $row["option1"],
            "option2" => $row["option2"]
        );
        array_push($output, $stats);
    }

    echo json_encode($output);
?>