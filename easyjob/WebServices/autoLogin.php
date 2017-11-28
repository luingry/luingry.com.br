<?php
  require_once 'connectionDB.php';
  require_once 'functions.php';

  $db = new ConnectionDB();

  $data = json_decode(file_get_contents("php://input"));
  if(isset($data->autoLoginKey)){
    //fazer tratamento de dados
    $decodeKey = explode("&", $data->autoLoginKey);
    $user = base64_decode($decodeKey[0]);
    $password = base64_decode($decodeKey[1]);

    $stmt = $db->getConnection()->prepare("SELECT USUARIO, SENHA, ULTIMOACESSO FROM USUARIOS WHERE usuario = '{$user}' AND SENHA = '{$password}'");
    $stmt->execute();

    if($stmt->rowCount() == 1){
      $rs = $stmt->fetch(PDO::FETCH_ASSOC);
      //passando token para login automatico
      $atualizaAcesso = $db->getConnection()->prepare("UPDATE USUARIOS SET ULTIMOACESSO = NOW() WHERE USUARIO = '{$user}'");
      $atualizaAcesso->execute();
      $token = generateToken($rs['USUARIO'], $rs['SENHA']);
      echo '{"TOKEN" : "'.$token.'"}';
    }
  }
