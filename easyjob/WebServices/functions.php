<?php


header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

  function generateToken($username, $password){
    $token = base64_encode($username).'&'.base64_encode($password);
    return $token; //retorna o token codificado em base64
  }

  function decodeToken($token){
    $data = array();

    $decodeKey = explode("&", $token);
    $data['user'] = base64_decode($decodeKey[0]);
    $data['password'] = base64_decode($decodeKey[1]);

    return $data;
  }
