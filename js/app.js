cheet('↑ ↑ ↓ ↓ ← → ← → b a', function () {
  if($(".nav-logo").hasClass("cheat-enabled")){
  	$(".nav-logo").removeClass("cheat-enabled");
  	$(".secret").removeClass("secret-show")

  }else{
  	$(".nav-logo").addClass("cheat-enabled");
  	$(".secret").addClass("secret-show")
  }
});