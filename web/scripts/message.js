(function ($) {
	$.showMessage = function (o) {
		var o = $.extend({
			time: 5000,
			speed: 'slow',
			note: null,
			className: null,
			remove: false,
			position: {left: 0, bottom: 0}
		}, o);
		var message = $('.bw-message');
		if (!message.length) {
			$('body').prepend('<div class="bw-message"></div>');
			message = $('.bw-message');
		}
		message.css('position', 'fixed').css(o.position);
		var messageTip = $('<div class="b-message"></div>');
		message.append(messageTip);
		if (o.className) messageTip.addClass(o.className);
		messageTip.html(o.note);
		if (o.remove) {
			var exit = $('<a class="l-remove" href="javascript:void(0)"></a>');
			messageTip.prepend(exit);
			exit.click(function () {
				messageTip.fadeOut(o.speed, function () {
					$(this).remove();
				})
			});
		}
		var tip = function(){
			messageTip.fadeOut(o.speed, function () {
				$(this).remove();
			});
		};
		var interval = setInterval(tip, o.time);
		messageTip.on('mouseover', function () {
			clearInterval(interval);
		}).on('mouseout', function () {
			interval = setInterval(tip, o.time);
		});
	};
})(jQuery);
