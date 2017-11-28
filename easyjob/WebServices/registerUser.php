<?php

  require_once 'connectionDB.php';

    $db = new ConnectionDB();

    $data = json_decode(file_get_contents("php://input"));

    if (isset($data->user)) {
      $stmt = $db->getConnection()->prepare("SELECT * FROM USUARIOS WHERE USUARIO = '{$data->user}'");
      $stmt->execute();

      if($stmt->rowCount() === 0){
        $stmt = $db->getConnection()->prepare("SELECT * FROM USUARIOS WHERE EMAIL = '{$data->email}'");
        $stmt->execute();
        if($stmt->rowCount() === 0){
          $password = md5($data->senha);
          $sql = "INSERT INTO USUARIOS (NOME, EMAIL, EMPRESA, USUARIO, SENHA, ULTIMOACESSO)";
          $sql .= "VALUES('{$data->nome}', '{$data->email}', '{$data->opcao}', '{$data->user}', '{$password}', NOW())";
          $stmt = $db->getConnection()->prepare($sql);
          $stmt->execute();

        }else{
            echo '{"existInDB" : true, "message" : "Esse E-mail já foi cadastrado. Por gentileza, tente outro."}';
        }
      }else{
        echo '{"existInDB" : true, "message" : "Já existe esse usuário. Por gentileza, tente outro."}';
      }
    }else {
      header('Location: index.php');
    }
