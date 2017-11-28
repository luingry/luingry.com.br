<?php

  require_once 'connectionDB.php';
  require_once 'functions.php';

  $db = new connectionDB();
  $data = json_decode(file_get_contents("php://input"));


  if(isset($data->autoLogin)){
    $value = decodeToken($data->autoLoginKey);

    if(!empty($_GET['f'])){
      if($_GET['f'] === 'getProfile'){

        $stmt = $db->getConnection()->prepare("SELECT DATE_FORMAT(DATACADASTRO, '%d/%m/%Y %T') AS DATACADASTRO, EMAIL, NOME, DATE_FORMAT(ULTIMOACESSO, '%d/%m/%Y %T') AS ULTIMOACESSO, USUARIO, EMPRESA FROM USUARIOS WHERE USUARIO = '".$value['user']."' AND SENHA = '".$value['password']."'");
        $stmt->execute();
        $rs = $stmt->fetch(PDO::FETCH_ASSOC);
        echo json_encode($rs, JSON_UNESCAPED_UNICODE);

      }else if ($_GET['f'] === 'updatePersonalProfile') {

        $sql = "UPDATE USUARIOS SET NOME = '{$data->NOME}', EMAIL = '{$data->EMAIL}' ";
        $sql .= "WHERE USUARIO = '".$value['user']."'";
        $stmt = $db->getConnection()->prepare($sql);
        $stmt->execute();

        if($stmt){
          echo '{"STATUS" : true}';
        }else{
          echo '{"STATUS" : false}';
        }
      }

    }

  }else{
    echo '{"MSG" : "ERRO AO RECEBER OS DADOS"}';
  }
