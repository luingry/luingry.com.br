<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

class ConnectionDB{

  private function setConnection(){

    try {
      $con = new PDO("mysql:host=mysql796.umbler.com;dbname=easyjob", "easyjob", "easyjob123456");
      $con->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
      $con->exec("SET NAMES 'utf8'");
      return $con;
    } catch (PDOException $e) {
      echo "Erro ao conectar-se: ".$e->getMessage();
    }
  }

  public function getConnection(){
    return $this->setConnection();
  }
}
