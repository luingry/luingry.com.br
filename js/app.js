cheet('↑ ↑ ↓ ↓ ← → ← → b a', function () {
  if($(".logo").hasClass("cheat-enabled")){
  	$(".logo").removeClass("cheat-enabled");
  	$(".logo").addClass("pulse");
  }else{
  	$(".logo").removeClass("pulse");
  	$(".logo").addClass("cheat-enabled");
  	;
  }
});