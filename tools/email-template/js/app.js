
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

$(".save").on("click", function(e){
	e.preventDefault();
	if ($(e.target).hasClass("save")) {
		showTemplateNameModal();
	}
})
$(".load").on("click", function(e){
	e.preventDefault();
	if ($(e.target).hasClass("load")) {
		carregaUltimasInformacoesSalvas()
	}
})
$(".remover-todos").on("click", function(e){
	e.preventDefault();
	$(".fieldset-ids").children().remove();
	adicionaOuRemoveTextoNenhumProduto()
})
$("#email-width").keyup(function(e){
	validaCharInput(this.value, this, /[0-9]/)
	
	
})
$(".gerar").on("click", function(){
	if ($(".fieldset-ids>li.id-produto").length == 0) showErrorModal("Insira pelo menos 1 id para gerar o template.", "error")
	else{
		limpaPrevia();
		consultaAPIeRenderiza(coletaIds());
		carregaEstilos();
		carregaOpcoes();
		limpaErros();
	}
});

$(".backdrop").on("click", function(){
	hideTemplateNameModal();
	hideErrorModal();
});

	//VERIFICAR ONDE COLOCAR ESTA LINHA if( $(e.target).hasClass("save") ) salvaInformacoesNasVariaveisLocal()

$(".close-button").on("click", function(e){
	if( $(e.target).hasClass("close-button") ) closeModal($(e.target));
});

$("#id-produto-inserir").keyup(function(e){
	e.preventDefault();
	validaCharInput(this.value, this, /[0-9]/);
	if( e.keyCode == 13) {
		var id = this.value;
		if (id.length > 0) {
			if (!verificaDuplicatas(id)) geraCamposId(id);
			adicionaOuRemoveTextoNenhumProduto()

		}
		else{
			showErrorModal("Insira um ID", "error")
		}
		$(this).val('')
	}
});

$(".container-erros").on("click", function(e){
	if ($(e.target).hasClass("close-button")){
		limpaErros("force")
	}
});

function carregaEstilos(){

}

function limpaErros(mode){
	var elemento = $(".container-erros ul")
	if ($(".invalido").length == 0){
		$(elemento).html("")
		$(elemento).parent(".container-erros").removeClass("contem-erros");
	}
	if (mode == "force") $(elemento).parent(".container-erros").removeClass("contem-erros")
		
}

function adicionaOuRemoveTextoNenhumProduto(){
	if ($(".fieldset-ids").find(".input").length == 0){
		$(".fieldset-ids").append($("<span>").html("Nenhum produto selecionado"));
	}else{
		$(".fieldset-ids>span").remove();
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
	if ( $(".input.id-produto").length == 0 ) {
		return repetido
	}
	else{
		$(".input.id-produto").each(function(){
			arrayid.push($(this).text())
		})
		for (var i = 0; i < arrayid.length; i++) {
			if (arrayid[i] == id) {
				repetido = true;
				showErrorModal("ID repetido", "error")
				return repetido;
				break
			}
		}
		
	}
}

function geraCamposId(id){
	var fieldsetids = $(".fieldset-ids");
	var inputtextid = $("<span>").attr({id: "id-produto " + id, class: "input id-produto " + id});

	var botaoremover = $("<div>").attr("class",  "botao-remover id-produto " + id).html('<i class="far fa-trash-alt"></i>');
	var blocoproduto = $("<li>").attr("class", "id-produto " + id)
	
	blocoproduto.append(inputtextid);
	blocoproduto.append(botaoremover);
	fieldsetids.append(blocoproduto);
	inputtextid.html(id);
	enableSorting();

}

function enableSorting(){
	$(".fieldset-ids").sortable();
}

function coletaIds(){
	var idsprodutos = [];
	inputidproduto = $(".input.id-produto");
	inputidproduto.each(function(){
		if( $(this).text() > 0 ){
			idsprodutos.push($(this).text());
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
	var inputsbuscados = $(".input.id-produto");
	var idsbuscados = [];
	var produtosnaoencontrados = [];
	
	for (var i = 0; i < inputsbuscados.length; i++) {
		idsbuscados.push($(inputsbuscados[i]).text());
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
	if (width == "" || width == 0 || typeof width == "undefined" || width == "default") return width = 600
	else return width;

}

function adicionaErroAoProdutoBuscado(idbuscado){
	showErrorModal("<span>Os IDs destacados em vermelho não foram encontrados por algum dos seguintes motivos: <br><b>1</b> - ID inválido<br><b>2</b> - Produto sem estoque<br><b>3</b> - Produto inativo</span>", "error");

	if (idbuscado == 0){
		$(".input.id-produto").parent("li.id-produto").addClass("invalido");
	}
	if (idbuscado > 0){
		$(".input.id-produto." + idbuscado).parent(".id-produto").addClass("invalido");

	}

}

function salvaInformacoesNasVariaveisLocal(){
	var products_fetched = [];
	for (var i = 0; i < $(".input.id-produto").length; i++) {
		products_fetched.push($(".input.id-produto")[i].text())
	}
	var template = [
		{
			"configs": {
			"width": $("#email-width").val() == 0 ? "default" : $("#email-width").val(),
			"products_returned": $("div.previa tr.produtos").html(),
			"products_fetched": products_fetched
			},
		}
	];

	localStorage.setItem("template_e-mail", JSON.stringify(template));
	hideTemplateNameModal();
}

function carregaUltimasInformacoesSalvas(){
	$(".fieldset-ids").html("");
	limpaErros()
	var response = JSON.parse(localStorage.getItem("template_e-mail"))[0];
	var configs = response.configs;
	var produtos = response.configs.produtos;
	var products_fetched = response.configs.products_fetched
	$("#email-width").val(verificaWidth(configs.width));
	$(".previa table").css({width: verificaWidth(configs.width), margin: "auto"})
	$("div.previa tr.produtos").html(produtos)
	for(var i = 0; i < products_fetched.length; i++){
		if (!verificaDuplicatas(products_fetched[i])) geraCamposId(products_fetched[i])
	}
	adicionaOuRemoveTextoNenhumProduto()
}

function showTemplateNameModal(){
	$(".backdrop").removeClass("hidden").animate({opacity: 1}, 100, "linear");
	$(".template-name-container").removeClass("hidden").animate({opacity: 1}, 100, "linear");

}

function hideTemplateNameModal(){
	$(".template-name-container").animate({opacity: 0}, 200, "linear", function(e){
		$(this).addClass("hidden")
	})
	$(".backdrop").animate({opacity: 0}, 200, "linear", function(e){
		$(this).addClass("hidden")
	})	
}

function showErrorModal(message, type){
	var errocontainer = $(".error-message-container");
	var messagecontentcontainer = $(errocontainer).find(".message-content");
	$(messagecontentcontainer).html(message);
	$(".backdrop").removeClass("hidden").animate({opacity: 1}, 100, "linear");
	$(errocontainer).removeClass("hidden").animate({opacity: 1}, 100, "linear");
	if (type == "warning") $(errocontainer).addClass("warning");
	if (type == "error") $(errocontainer).addClass("error");
}

function hideErrorModal(){
	$(".error-message-container").animate({opacity: 0}, 200, "linear", function(e){
		$(this).addClass("hidden");
		$(this).find(".message-content").html("");
		$(this).removeClass("warning");
		$(this).removeClass("error");
	});
	$(".backdrop").animate({opacity: 0}, 200, "linear", function(e){
		$(this).addClass("hidden")
	});
}

function closeModal(closebutton){
	$(closebutton).parent().removeClass("warning");
	$(closebutton).parent().removeClass("error");
	$(closebutton).parent().animate({opacity: 0}, 200, "linear", function(e){
		$(this).addClass("hidden")
	})
	$(".backdrop").animate({opacity: 0}, 200, "linear", function(e){
		$(this).addClass("hidden")
	})
}