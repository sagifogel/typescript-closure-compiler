$(document).ready(function(){	
    
    $("#carousel-example-generic").carousel({
        interval: 7000,
        pause: "hover"
    });
	
	$('.toc-item').click(function(){
		var active = $(this).parent().attr("id");//$( ".tocAccordion" ).accordion( "option", "active" );
		localStorage.setItem('activeTOCSection', active);
	});
	
	$('.panel:first-child').click(function(){
		localStorage.setItem('activeTOCSection', 0);
	});	
	
	$(window).resize(function() { setFooterPosition() });
	if(window.location.pathname.indexOf("/community/index") > -1 || window.location.pathname.indexOf("/docs/") > -1 ){
		setFooterPosition();
	}
	
});

	function setFooterPosition() {
		
		var pageH = $(window).height() - ($("footer").height()*2 + $("header").height() + $(".update-banner").height() );
		
		console.log(window.location.pathname);
		
		if(window.location.pathname.indexOf("/samples/index") > -1){
			//console.log("in samples");
			if($('.examples').height() <=   pageH ){				
				$('footer').css('position','absolute').css("bottom",0).css("width","100%");										
			}else {
				$('footer').css('position','relative').css("z-index",100);
			}
		}
		else if(window.location.pathname.indexOf("/community/index") > -1){
			//console.log("in community - "+ $('.community').height() + " <? "+ pageH);
			if($('.community').height() <=   pageH ){
				$('footer').css('position','absolute').css("bottom",0).css("width","100%");										
			}else {
				$('footer').css('position','relative').css("z-index",100);
			}					
		}		
		else if(window.location.pathname.indexOf("/docs/") > -1){
			console.log("in docs!");
			if($('.docs-container').height() <=   pageH ){
				$('footer').css('position','absolute').css("bottom",0).css("width","100%");
				console.log("docs: "+$('.examples').height() +" ---  window:" + $(window).height());										
			}else {
				$('footer').css('position','relative').css("z-index",100);
			}				
		}
		else{
			if($(document).height() < pageH ){
				$('footer').css('position','absolute').css("bottom",0).css("width","100%");	
			}else {
				$('footer').css('position','relative').css("z-index",100);
			}
		}	
	}
			

	function storageSupported() {
	  try {
	    return 'localStorage' in window && window['localStorage'] !== null;
	  } catch (e) {
	    return false;
	  }
	}
	
	function setDocTOC(){
				
		var activeTOCSection = localStorage.getItem('activeTOCSection');//Number(localStorage.getItem('activeTOCSection'));
		
		if (storageSupported() || activeTOCSection) {
		  $("#"+activeTOCSection).collapse('toggle');	 
		}
		
		if(activeTOCSection==0){
			$(".panel:first-child").toggleClass("selected");
		}

	}	

	//Twitter follow button
	window.twttr = (function(d, s, id) {
	var js, fjs = d.getElementsByTagName(s)[0],
		t = window.twttr || {};
	if (d.getElementById(id)) return t;
	js = d.createElement(s);
	js.id = id;
	js.src = "https://platform.twitter.com/widgets.js";
	fjs.parentNode.insertBefore(js, fjs);
	
	t._e = [];
	t.ready = function(f) {
		t._e.push(f);
	};
	
	return t;
	}(document, "script", "twitter-wjs"));