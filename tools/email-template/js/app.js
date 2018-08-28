
var formprodutos = $("#produtos");
var formopcoes = $("#opcoes");

formprodutos.submit(function(e){
	e.preventDefault()
})
formopcoes.submit(function(e){
	e.preventDefault();
})

adicionaOuRemoveTextoNenhumProduto()

$("#produtos").on("click", function(e){
	e.stopPropagation();
	excluiCampoID(e.target);
	if ($(e.target).hasClass("botao-remover")) limpaErros();
});



$(".remover-todos").on("click", function(e){
	e.preventDefault();
	$(".fieldset-ids").children().remove();
	adicionaOuRemoveTextoNenhumProduto()
})
$("#email-width").keyup(function(e){
	validaCharInput(this.value, this, /[0-9]/)
	
	
})
$(".gerar").on("click", function(){
	if ($(".fieldset-ids>div.id-produto").length == 0) alert("Insira pelo menos 1 id para gerar o template.")
	else{
		limpaPrevia();
		consultaAPIeRenderiza(coletaIds());
		carregaEstilos();
		carregaOpcoes();
		limpaErros();
	}
});

$("#id-produto-inserir").keyup(function(e){
	e.preventDefault();
	validaCharInput(this.value, this, /[0-9]/);
	if( e.keyCode == 13) {
		var id = this.value;
		if (id.length > 0) {
			if (!verificaDuplicatas(id)) geraCamposId(id);
			else alert("ID repetido")
			adicionaOuRemoveTextoNenhumProduto()

		}
		else{
			alert("Insira um ID")
		}
		$(this).val('')
	}
});

$(".container-erros").on("click", function(e){
	if ($(e.target).hasClass("close-button")){
		limpaErros()
	}
})

function carregaEstilos(){

}

function limpaErros(){
	var elemento = $(".container-erros ul")
	if ($(".invalido").length == 0){
		$(elemento).html("")
		$(elemento).parent(".container-erros").removeClass("contem-erros");
	}
		
}

function adicionaOuRemoveTextoNenhumProduto(){
	if ($(".fieldset-ids").find("input").length == 0){
		$(".fieldset-ids").append($("<span>").html("Nenhum produto selecionado"))
	}else{
		$(".fieldset-ids span").remove()	
	}
}

function validaCharInput(valordigitado, elementoinput, regex){
	String(valordigitado);
	var arraychar = valordigitado.split("");
	var novovalor = "";

	if (!regex.test(arraychar[arraychar.length-1])){
		
		for (var i = 0; i < arraychar.length; i++) {
			if (!regex.test(arraychar[i])){
				arraychar.splice(i, i);
			}else{
				novovalor += arraychar[i];
			}
		}
		elementoinput.value = novovalor;
	}
}

function excluiCampoID(campo){
	if( $(campo).hasClass("botao-remover")){

		if ($(".invalido").length == 0) limpaErros();
		var classe = campo.attributes.class.value.split(" ");
		$(campo).parent(".id-produto").remove();
		adicionaOuRemoveTextoNenhumProduto();
	}
}

function limpaPrevia(){
	$(".previa tr.produtos").html("");
}

function verificaDuplicatas(id){
	var arrayid = [];
	var repetido = false;
	if ( $("input.id-produto").length == 0 ) {
		return repetido
	}
	else{
		$("input.id-produto").each(function(){
			arrayid.push(this.value)
		})
		for (var i = 0; i < arrayid.length; i++) {
			if (arrayid[i] == id) {
				repetido = true;
				return repetido;
				break
			}
		}
		
	}
}

function geraCamposId(id){
	var fieldsetids = $(".fieldset-ids");
	var inputtextid = $("<input disabled>").attr("type", "text").attr({id: "id-produto " + id, class:  "input id-produto " + id});
	var botaoremover = $("<div>").attr("class",  "botao-remover id-produto " + id);
	var blocoproduto = $("<div>").attr("class", "id-produto " + id)
	
	blocoproduto.append(inputtextid);
	blocoproduto.append(botaoremover);
	fieldsetids.append(blocoproduto);
	inputtextid.val(id)

}

function coletaIds(){
	var idsprodutos = [];
	inputidproduto = $(".id-produto");
	inputidproduto.each(function(){
		if( this.value > 0 ){
			idsprodutos.push(this.value);
		}
	})
	return String(idsprodutos);
};

function consultaAPIeRenderiza(idsprodutos){
	$.get("https://www.famasom.com.br/web_api/products",{
		id: idsprodutos,
		stock: ">0"
	}).done(function(data){
		var produtos = data.Products;
		console.log(produtos)
		if (produtos.length == 0){
			adicionaErroAoProdutoBuscado(0)
		}else{
			for (var i = 0; i < produtos.length; i++) {
				adicionaProdutoNaPrevia(produtos[i].Product)
			}
			verificaSeProdutoRetornouNaConsulta(produtos)
		}
	}).fail(function(response){
		console.log(response)
	})

}

function adicionaProdutoNaPrevia(produto){
	var containerprodutos = $(".previa .produtos");
	var containerproduto = $("<div>").attr("class", "produto " + produto.id);
	var nomeproduto = produto.name;
	var urlimagem = produto.ProductImage[0].https;
	var tagtitulo = $("<p>").addClass("titulo-produto").html(nomeproduto);
	var tagimagem = $("<img>").attr("src", urlimagem).addClass("imagem-produto");

	containerprodutos.append(containerproduto);
	containerproduto.append(tagimagem);
	containerproduto.append(tagtitulo);
}

function verificaSeProdutoRetornouNaConsulta(produtos){
	var inputsbuscados = $("input.id-produto");
	var idsbuscados = [];
	var produtosnaoencontrados = [];
	
	for (var i = 0; i < inputsbuscados.length; i++) {
		idsbuscados.push(inputsbuscados[i].value);
	}
	for (var i = 0; i < idsbuscados.length; i++) {
		window.idnaoencontrado = true;
		for (var a = 0; a < produtos.length; a++) {
			if ( idsbuscados[i] == produtos[a].Product.id ) {
				window.idnaoencontrado = false;
				break;
			}
		}
		if (window.idnaoencontrado == true) produtosnaoencontrados.push(idsbuscados[i])
	}

	for (var i = 0; i < produtosnaoencontrados.length; i++) {
		adicionaErroAoProdutoBuscado(produtosnaoencontrados[i]);
	}


}

function carregaOpcoes(){
	var tabela = $(".previa table");
	var width = $("#email-width").val();	
	tabela.css({"width": verificaWidth(width),"margin": "0 auto"});
}

function verificaWidth(width){
	if (width == "" || width == 0 || typeof width == "undefined") return width = 600
	else return width;

}

function adicionaErroAoProdutoBuscado(idbuscado){
	var blocoerro = $("<li>").addClass("mensagem-erro").html("<span>Os IDs destacados em vermelho não foram encontrados por algum dos seguintes motivos: <br><b>1</b> - ID inválido<br><b>2</b> - Produto sem estoque<br><b>3</b> - Produto inativo</span>");

	if (idbuscado == 0){
		$("input.id-produto").parent("div.id-produto").addClass("invalido")
		$(".container-erros").find("ul").html("");
		$(".container-erros").addClass("contem-erros");
		$(".container-erros").find("ul").append(blocoerro);
	}
	if (idbuscado > 0){
		$("input.id-produto." + idbuscado).parent(".id-produto").addClass("invalido");
		$(".container-erros").find("ul").html("");
		$(".container-erros").addClass("contem-erros");
		$(".container-erros").find("ul").append(blocoerro);
	}
}

function salvaInformacoesNasVariaveisLocal(){

	var template = [
		{
			"Configurações": {
			width: $("#email-width").val()
			},
		},
		{
			"Produtos_buscados": "array de produtos buscados aqui"
		}
	];
	console.log(template);

	localStorage.setItem("template_e-mail", JSON.stringify(template));
}

function carregaUltimasInformacoesSalvas(){
	var template = JSON.parse(localStorage.getItem("template_e-mail"));
	console.log(template);
	$("#email-width").val(template.configuracoes.width);
}