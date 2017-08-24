$(document).ready(function () {
	if ($('select').is('select')) {
		$('.n-select').fancySelect();
	}

	var typeElement = $('.n-button.big2.green');
	typeElement.each(function () {
		$(this).qtip({
			position: {
				my      : $(this).attr('data-my') || 'bottom center',
				at      : $(this).attr('data-at') || 'top center',
				viewport: $(window),
				target  : $(this),
				tooltip : 'topLeft',
				adjust  : {
					method: 'flip flip'
				}
			},
			style   : {
				tip: {
					corner: true
				}
			}
		});
	});

	if ($(".owl-carousel").is('div')) {
		$("#owl-homepage").owlCarousel({
			items   : 2,
			loop    : false,
			margin  : 10,
			lazyLoad: true,
			merge   : true,
			video   : true
		});
		$("#owl-gallery").owlCarousel({
			items   : 5,
			loop    : false,
			margin  : 7,
			lazyLoad: true,
			merge   : true,
			video   : true,
			dots    : false
		});
	}


	// попапы
	if ($('.bw-bg_popup').is('div')) {

		// попап с формой авторизации
		$('.j-login').on('click', function () {
			$('.bw-bg_popup').removeClass('active');
			$('.j-login-popup').addClass('active');
		});

		// попап с формой регистрации
		$('.j-register').on('click', function () {
			$('.bw-bg_popup').removeClass('active');
			$('.j-register-popup').addClass('active');
		});

		// попап с восстановления пароля
		$('.j-restore').on('click', function () {
			$('.bw-bg_popup').removeClass('active');
			$('.j-restore-popup').addClass('active');
		});

		// кнопка закрыть
		$('.js-close').on('click', function () {
			$('.bw-bg_popup').removeClass('active');
		});
	}

	$('#login_form_submit').bind('click', function () {

		$.ajax({
			url     : '/login',
			method  : 'GET',
			data    : $('#login_form').serialize(),
			dataType: 'json',
			success : function (response) {

				console.log(response);

				if (response.result == 1) {
					location.replace('/privateoffice');
				} else {
					$.showMessage({
						note  : 'Неверная пара логин-пароль',
						remove: true
					});
				}
			}
		});

		return false;
	});


	$('#restore_form_submit').bind('click', function () {
		$.ajax({
			url     : '/send-restore-email',
			method  : 'POST',
			data    : $('#restore_form').serialize(),
			dataType: 'json',
			success : function (response) {

				console.log(response);

				$.showMessage({
					note  : response.message,
					remove: true
				});
			}
		});

		return false;
	});

	$('#register_form_submit').bind('click', function () {

		if (!$('#terms_confirm').is(':checked')) {

			$.showMessage({note: 'Перед тем как продолжить, вы должны ознакомиться с пользовательским соглашением и принять его', remove: true});

			return false;
		}

		var email = $('#register_form').find('input[name=email]').val();
		var pass1 = $('#register_form').find('input[name=password]').val();
		var pass2 = $('#register_form').find('input[name=password_confirm]').val();

		console.log(pass1);
		console.log(pass2);

		if (pass1 == '' || pass2 == '' || email == '') {
			return $.showMessage({note: 'Заполните все поля формы', remove: true});
		}

		if (!validateEmail(email)) {
			return $.showMessage({note: 'Неправильный формат email', remove: true});
		}

		if (pass1 != pass2) {
			return $.showMessage({note: 'Введенные пароли не совпадают', remove: true});
		}

		if (pass1.length < 6) {
			return $.showMessage({note: 'Длинна пароля не может быть меньше 6 символов', remove: true});
		}

		$.ajax({
			url     : '/register',
			method  : 'GET',
			data    : $('#register_form').serialize(),
			dataType: 'json',
			success : function (response) {

				console.log(response);

				if (response.result == 1) {
					location.reload();
				} else {
					$.showMessage({
						note  : response.message,
						remove: true
					});
				}
			}
		});

		return false;
	});

	//
	//$('.js-message_delete').on('click', function () {
	//	$.showMessage({
	//		note  : 'Боже мой!. Нет, нет, чувак! Не делай этого!',
	//		remove: true
	//	});
	//});


	$('.l-show_image').on('click', function (e) {
		e.preventDefault();
		$('body').addClass('show_gallery');
		$('.b-gallery_content .b-image_content img').remove();
		$('<img src="' + $(this).attr('href') + '", alt="">').appendTo('.b-gallery_content .b-image_content');
	});
	$('.js-close_gallery').on('click', function () {
		$('body').removeClass('show_gallery');
	});

	$('.b-navbar a').on('click', function (e) {
		e = e || window.event;
		if ($(this).hasClass('active')) {
			return e.preventDefault();
		} else {
			return e;
		}
	});


	/// aaddds


	$('#restore_form_submit').bind('click', function () {

		//var email = $('#restore_form').find('input[name=email]').val();
		var pass1 = $('#restore_form').find('input[name=password]').val();
		var pass2 = $('#restore_form').find('input[name=password_confirm]').val();

		console.log(pass1);
		console.log(pass2);

		if (pass1 == '' || pass2 == '') {
			return $.showMessage({note: 'Заполните все поля формы', remove: true});
		}

		//if (!validateEmail(email)){
		//	return $.showMessage({note: 'Неправильный формат email', remove: true});
		//}

		if (pass1 != pass2) {
			return $.showMessage({note: 'Введенные пароли не совпадают', remove: true});
		}

		if (pass1.length < 6) {
			return $.showMessage({note: 'Длинна пароля не может быть меньше 6 символов', remove: true});
		}

		$.ajax({
			url     : '/restore/submit',
			method  : 'GET',
			data    : $('#restore_form').serialize(),
			dataType: 'json',
			success : function (response) {

				console.log(response);

				if (response.result == 1) {
					location.reload();
				} else {
					$.showMessage({
						note  : 'Неверная пара логин-пароль',
						remove: true
					});
				}
			}
		});

		return false;
	});

	$('.delete_config').bind('click', function () {

		if (!confirm('Вы действительно ходиту удалить этот алгоритм?')) {
			return false;
		}

		var configId = $(this).attr('data-config-id');

		$.ajax({
			url     : '/config/' + configId + '/delete',
			method  : 'GET',
			dataType: 'json',
			success : function (response) {

				console.log(response);

				if (response.result == 1) {
					location.reload();
				} else {
					$.showMessage({
						note  : 'Не удалось удалить конфиг',
						remove: true
					});
				}
			}
		});
	});

	$('.delete_settings').bind('click', function () {

		if (!confirm('Вы действительно ходиту удалить эту настройку?')) {
			return false;
		}

		var settingsId = $(this).attr('data-settings-id');

		$.ajax({
			url     : '/settings/' + settingsId + '/delete',
			method  : 'GET',
			dataType: 'json',
			success : function (response) {

				console.log(response);

				if (response.result == 1) {
					location.reload();
				} else {
					$.showMessage({
						note  : 'Не удалось удалить настройку',
						remove: true
					});
				}
			}
		});
	});

});

function validateEmail(email) {
	var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(email);
}