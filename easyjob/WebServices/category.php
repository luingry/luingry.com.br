<?php

require_once 'connectionDB.php';

$db = new connectionDB();

$data = json_decode(file_get_contents("php://input"));

switch ($data->getFunction) {
	case 'categorias':
		$stmt = $db->getConnection()->prepare("SELECT CODCATEGORIA, NOME AS CATEGORIA FROM CATEGORIA");
		$stmt->execute();
		$list = array();
		while($result = $stmt->fetch(PDO::FETCH_ASSOC)){
			$list[] = $result;
		}
		print_r(json_encode($list, JSON_UNESCAPED_UNICODE));
		break;

	case 'funcoes':
		$stmt = $db->getConnection()->prepare("SELECT CODSUBCATEGORIA, NOME AS SUBCATEGORIA FROM SUBCATEGORIA WHERE CODCATEGORIA = '".$data->codcategoria."'");
		$stmt->execute();
		$list = array();
		while($result = $stmt->fetch(PDO::FETCH_ASSOC)){
			$list[] = $result;
		}
		print_r(json_encode($list, JSON_UNESCAPED_UNICODE));
		break;

	case 'addFuncao':
		//fazer insert da funcao
	break;

	case 'removeFuncao':
		//fazer funcao para remover funcao
	break;

	case 'alterStar':
		//fazer funcao para alterar o valor das estrelas
	break;

	default:
		echo '{"ERROR" : "Houve problemas na requisição."}';
		break;
}
