var mobList = [];

for (var i in locationList) {
	for (var j in locationList[i].mobList) {
		mobList.push({
			label   : locationList[i].mobList[j].getFullName(),
			category: locationList[i].name
		});
	}
}

//
//var mobList = [

//	{label: "Гнилой зомби", category: "Мертвый Каньон"},
//	{label: "Приспешник", category: "Мертвый Каньон"},
//	{label: "Адепт", category: "Мертвый Каньон"},
//	{label: "Чернокнижник", category: "Мертвый Каньон"},
//	{label: "Оборотень", category: "Мертвый Каньон"},
//	{label: "Планомер", category: "Мертвый Каньон"},
//	{label: "Наймит", category: "Мертвый Каньон"},
//	{label: "", category: ""}
//];

var tasksData = {

	hunt       : {
		is_quest   : false,
		name       : 'Охота',
		description: 'Напасть на моба указанное количество раз',
		params     : [
			{
				name       : 'Имя моба',
				description: 'Начните вводить имя моба',
				type       : 'input-text-autocomplete-mob-names'
			},
			{
				name       : 'Количество',
				description: 'Количество нападений на моба',
				type       : 'input-text-numbers'
			}
		]
	},
	duel       : {
		is_quest   : false,
		name       : 'Дуэль',
		description: 'Бой 1 на 1 с равным противником',
		params     : [
			{
				name       : 'Количество',
				description: 'Количество дуэлей, которые нужно создать',
				type       : 'input-text-numbers'
			}
		]
	},
	//open_battle: {
	//	is_quest   : false,
	//	name       : 'Открытый бой',
	//	description: 'Создать открытый для вмешательства бой',
	//	params     : [
	//		{
	//			name       : 'Количество',
	//			description: 'Количество боев, которые нужно создать',
	//			type       : 'input-text-numbers'
	//		},
	//		{
	//			name       : 'Ждать завершения',
	//			description: 'Ждать / Не ждать завершения текущего боя, перед созданием следующего (в случае если персонаж погиб в бою)',
	//			type       : 'select',
	//			options    : ['Не ждать завершения боя', 'Ждать завершения боя']
	//		}
	//	]
	//},
	wall       : {
		is_quest   : false,
		name       : 'Стенка на стенку',
		description: 'Зарегистрироваться в турнире "Стенка на Стенку"',
		params     : [
			{
				name       : 'Количество',
				description: 'Количество турниров, которые нужно провести',
				type       : 'input-text-numbers'
			}
			//,
			//{
			//	name       : 'Ждать завершения',
			//	description: 'Ждать / Не ждать завершения текущего турнира, перед подачей регистриции в следующий (в случае если персонаж погиб в бою)',
			//	type       : 'select',
			//	options    : ['Не ждать завершения боя', 'Ждать завершения боя']
			//}
		]
	},
	survive    : {
		is_quest   : false,
		name       : 'Выживание',
		description: 'Зарегистрироваться в турнире "Выживание"',
		params     : [
			{
				name       : 'Количество',
				description: 'Количество турниров, которые нужно провести',
				type       : 'input-text-numbers'
			}
		]
	},
	robbery    : {
		is_quest   : false,
		name       : 'Грабежи',
		description: 'Нападение в грабежах',
		params     : [
			{
				name       : 'Количество',
				description: 'Количество нападений, которые нужно провести',
				type       : 'input-text-numbers'
			}
		]
	},
	sleep      : {
		is_quest   : false,
		name       : 'Пауза',
		description: 'Задержка в секундах. Бот не будет выполнять никаких действий',
		params     : [
			{
				name       : 'Задержка в сек.',
				description: 'Задержка в секундах. Бот не будет выполнять никаких действий',
				type       : 'input-text-numbers'
			}
		]
	},
	//move       : {
	//	is_quest   : false,
	//	name       : 'Переход',
	//	description: 'Переход в указанную локацию',
	//	params     : [
	//		{
	//			name       : 'Название локации',
	//			description: 'Начните вводить название локации',
	//			type       : 'input-text-autocomplete-location-names'
	//		}
	//	]
	//},
	quest_vigor: {
		is_quest   : true,
		name       : 'Покупка Вигора',
		description: 'Переходи в стагород, покупает вигор в магазине',
		params     : []
	}
};

function getTaskFormField(fieldData) {


	switch (fieldData.type) {
		case 'input-text-autocomplete-mob-names' :
			return $('<input/>')
				.addClass('n-input_text')
				.addClass('autocomplete_mob_names')
				.attr('placeholder', fieldData.name)
				.attr('title', fieldData.description)
				.attr('size', 20);
			break;
		case 'input-text-autocomplete-location-names' :
			return $('<input/>')
				.addClass('n-input_text')
				.addClass('autocomplete_location_names')
				.attr('placeholder', fieldData.name)
				.attr('title', fieldData.description)
				.attr('size', 20);
			break;
		case 'input-text-numbers' :
			return $('<input/>')
				.addClass('n-input_text')
				.addClass('input_numbers')
				.attr('placeholder', fieldData.name)
				.attr('title', fieldData.description)
				.attr('size', 5);
			break;
		//
		//<select class="n-select">
		//<option>Element 1</option>
		//<option>Element 2</option>
		//<option>Element 3</option>
		//<option>Element 4</option>
		//</select>

		case 'select' :
			var $select = $('<select/>').addClass('n-select');
			for (var i in fieldData.options) {
				$select.append($('<option/>').val(i).text(fieldData.options[i]))
			}
			return $select;
			//return $('<div>').addClass('b-state').append($select);
			break;
	}

	console.log('Unknown field type : ' + fieldData.type);
	return false;
}

function addTask(taskType, taskParams) {


	taskType = (typeof taskType !== 'undefined') ? taskType : '';
	taskParams = (typeof taskParams !== 'undefined') ? taskParams : [];

	// если передан неизвестный тип задачи
	if (typeof tasksData[taskType] === 'undefined') {
		console.log('Неизвестный тип задачи : ' + taskType);
		return false;
	}

	var $dl = $('<dl/>')
		.addClass('b-pole_form')
		.addClass('small')
		.attr('data-task', taskType);

	var $dt = $('<dt/>');
	var $dd = $('<dd/>');


	// добавляем label с названием задачи
	$dt.append($('<label/>')
		.addClass('n-label')
		.text(tasksData[taskType].name)
		.attr('title', tasksData[taskType].description));

	// добавляемполя формы
	for (var i in tasksData[taskType].params) {
		var $field = getTaskFormField(tasksData[taskType].params[i]);
		if (!$field) {
			return false;
		}
		$field.attr('data-param', i);

		$field.val(taskParams[i]); /////////

		$dd.append($('<div>').addClass('b-state').append($field));
	}

	$dd.append($('<a/>').addClass('r-close delete_task'));

	var $li = $('<li/>').append($dl
		.append($dt)
		.append($dd));


	$('#task_list').append($li);


	$('.autocomplete_mob_names').catcomplete({
		delay    : 0,
		minLength: 2,
		source   : mobList
	});

	if ($('select').is('select')) {
		$('.n-select').fancySelect();
	}

	$('.delete_task').unbind('click').bind('click', function () {
		$(this).parent().parent().parent().remove();
	});

	return false;
}

function saveTaskList() {


	if (!$('#config_name').val()) {
		$.showMessage({note: 'Введите название алгоритма', remove: true});
		return;
	}

	var tasks = [];

	if (!$('#task_list').find('dl[data-task]').length) {
		$.showMessage({note: 'Добавьте хотя бы одну задачу', remove: true});
		return;
	}

	$('#task_list').find('dl[data-task]').each(function () {

		var taskParams = [];
		//task.push($(this).attr('data-task'));

		$(this).find('[data-param]').each(function () {
			var index = $(this).attr('data-param')
			taskParams[index] = $(this).val();
		});

		tasks.push([$(this).attr('data-task'), taskParams]);
	});


	$.ajax({
		url     : '/config/submit',
		method  : 'GET',
		data    : {
			id  : $('#config_id').val(),
			name: $('#config_name').val(),
			data: JSON.stringify(tasks)
		},
		dataType: 'json',
		success : function (response) {

			console.log(response);

			if (response.result == 1 && (typeof response.config_id != 'undefined')) {
				$('#config_id').val(response.config_id);
				$.showMessage({note: 'Алгоритм успешно сохранен', remove: true});
			} else {
				$.showMessage({note: 'Не удалось сохранить алгориитм', remove: true});
			}
		}
	});
	//
	//return JSON.stringify(tasks);
	//return tasks;
}

$(function () {
	for (var i in tasksData) {
		$('#available_tasks')
			.append($('<dl/>').addClass('b-pole_form small')
				.append($('<dt/>')
					.append($('<label/>').addClass('n-label').text(tasksData[i].name)))
				.append($('<dd/>')
					.append($('<a/>').attr('href', '#').attr('data-task-name', i).addClass('n-button black add_task_button').text('Добавить').attr('title', tasksData[i].description))));
	}

	$('.add_task_button').bind('click', function () {
		return addTask($(this).attr('data-task-name'))
	});
});