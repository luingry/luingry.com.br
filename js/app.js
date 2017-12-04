cheet('↑ ↑ ↓ ↓ ← → ← → b a', function () {
  if($(".logo").hasClass("cheat-enabled")){
  	$(".logo").removeClass("cheat-enabled");
  }else{
  	$(".logo").addClass("cheat-enabled");
  }
});