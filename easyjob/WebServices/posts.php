<?php

  require_once 'connectioDB.php';


  $db = new ConnectioDB();

  $data = json_decode(file_get_contents("php://input"));

  
