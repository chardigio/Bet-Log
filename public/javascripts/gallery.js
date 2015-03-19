/*$(document).ready(function(){
	$("div").click(function(e){
		console.log('f');
	
		//$(this).addClass("col-md-12");
	});
});
*/
$(document).ready(function(){
        $("div").click(function(){
                $(this).toggleClass("col-xs-4","col-xs-12", 500);
        });
});
