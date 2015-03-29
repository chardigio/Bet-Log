$(document).ready(function(){
		$("button").on(click, function(){
			alert('gera');
			var html = "<p>Group name</p><input type="text" name="groupname"/>";
			$(this).append(html);
		});                                     
});
