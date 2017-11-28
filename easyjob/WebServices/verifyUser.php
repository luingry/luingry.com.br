<?php
  require_once 'connectionDB.php';
  require_once 'functions.php';
  $db = new ConnectionDB();

  $data = json_decode(file_get_contents("php://input"));

  if(isset($data->username) && isset($data->password)){
    //fazer tratamento de dados
    $password = md5($data->password);
    //$sql = "SELECT * FROM USUARIOS WHERE usuario = '{$data->username}' AND SENHA = '{$password}'";
    $sql = "SELECT * FROM USUARIOS WHERE usuario = '".$data->username."' AND SENHA = '".$password."'";
    $stmt = $db->getConnection()->prepare($sql);
    $stmt->execute();

    if($stmt->rowCount() == 1){
      $rs = $stmt->fetch(PDO::FETCH_ASSOC);
      //passando token para login automatico
      $result['TOKEN'] = generateToken($rs['USUARIO'], $rs['SENHA'], $rs['ULTIMOACESSO']);
      print_r(json_encode($result, JSON_UNESCAPED_UNICODE));
    }
  }
