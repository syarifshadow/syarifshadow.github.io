/*CUSTOM*/
$(document).ready(function() {
	//TWITTER FEED    //replace "rohithpaul" with your Twitter ID
	$('.twitter_feed').jTweetsAnywhere({
		username: 'rohithpaul',
		count: 1
	});
	
	$('.flexslider').flexslider({
		slideshowSpeed: 7000,           //Set the speed of the slideshow cycling, in milliseconds
        animationDuration: 600         //Set the speed of animations, in milliseconds
	});
	
	
	// hide #back-top first
	$("#back-top").hide();
	
	// fade in #back-top
	$(function () {
		$(window).scroll(function () {
			if ($(this).scrollTop() > 100) {
				$('#back-top').fadeIn();
			} else {
				$('#back-top').fadeOut();
			}
		});

		// scroll body to 0px on click
		$('.toTop').click(function () {
			$('body,html').animate({
				scrollTop: 0
			}, 800);
			return false;
		});
	});
	
	//Menu
	$(".navigate_btn").toggle(function() {
		 $('.full_nav').slideDown(300);
		 $('body,html').animate({
				scrollTop: 0
			}, 300);
		 $('#search_box').slideUp(300); 	
		 }, function(){
		 $('.full_nav').slideUp(300);		 
	});
	$(".search_btn").toggle(function() {
		 $('#search_box').slideDown(300); 
		 $('body,html').animate({
				scrollTop: 0
			}, 300);		 
		 $('.full_nav').slideUp(300); 	
		 }, function(){
		 $('#search_box').slideUp(300);		 
	});	
	
	
});

