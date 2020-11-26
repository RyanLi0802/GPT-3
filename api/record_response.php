<?php
    include 'common.php';

    $responses = $_POST["responses"];

    for ($i = 0; $i < count($responses); $i++) {
        $option = "option" . $responses[$i];
        $qid = $i + 1;
        try {
            $rows = $db->query("SELECT $option FROM Stats" .
                              " WHERE qid = $qid;");
        }
        catch (PDOException $ex) {
            db_error_message("Can not query the database.", $ex);
        }

        foreach ($rows as $row) {
            $curr_val = $row[$option];
        }

        $curr_val++;

        try {
            $db->query("UPDATE `Stats` SET $option = $curr_val " . 
                        "WHERE qid = $qid");
        }
        catch (PDOException $ex) {
            db_error_message("Can not query the database.", $ex);
        }
    }

    header("Content-type: text/plain");
    echo "success";
?>