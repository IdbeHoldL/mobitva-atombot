var mMob = function (name) {

	this.name = name;
	this.level = 0;

	this.setLocation = function (location) {
		this.location = location;
	};

	this.getImageName = function () {
		return 'моб_' + this.location.nameNode + '_' + this.name;
	};

	this.getFullName = function () {
		return this.name;
		//return this.name + ' [' + this.level + ']';
	}
};

var mLocation = function (name, isRed) {

	this.name = name;

	this.nameNode = name;

	this.signImageName = 'табличка_локации_' + name;

	this.linkImageNames = [];
	this.linkImageNames.push('ссылка_локации_' + name);

	if (isRed) {
		this.linkImageNames.push('ссылка_локации_красная_' + name);
	}

	this.isRed = isRed;
	this.mobList = [];
	this.locationNamesList = [];

	/**
	 *
	 * @param mob
	 * @returns {mLocation}
	 */
	this.addMob = function (mob) {
		mob.setLocation(this);
		this.mobList.push(mob);
		return this;
	};

	/**
	 *
	 * @param locationName
	 * @returns {mLocation}
	 */
	this.addLocation = function (locationName) {
		this.locationNamesList.push(locationName);
		return this;
	}
};


//var loc = {
//	'Вирастоль': {
//		mobs     : ['Хулиган', 'Харя-в-Раме','Чуба-Гуру'],
//		locations: ['Проселок', 'Ярмарка']
//	},
//	'Проселок': {
//		mobs     : ['Свин', 'Разбойник','Дикий Пес'],
//		locations: ['Тракт', 'Вирастоль', 'Чернолесье']
//	},
//	'Проселок': {
//		mobs     : ['Хулиган',],
//		locations: ['Стагород',]
//	}
//};


/**
 *
 * @type {mLocation[]}
 */
var locationList = [
	(
		(new mLocation('Вирастоль', false))
			.addMob(new mMob('Хулиган'))
			.addMob(new mMob('Харя-в-Раме'))
			.addMob(new mMob('Чуба-Гуру'))
			.addMob(new mMob('Лоботряс'))
			.addLocation('Проселок')
	),
	(
		(new mLocation('Проселок', false))
			.addMob(new mMob('Свин'))
			.addMob(new mMob('Разбойник'))
			.addMob(new mMob('Дикий пес'))
			.addLocation('Тракт')
			.addLocation('Вирастоль')
			.addLocation('Чернолесье')
	),
	(
		(new mLocation('Тракт', false))
			.addMob(new mMob('Бешеный репей'))
			.addMob(new mMob('Кабан'))
			.addMob(new mMob('Бандит'))
			.addMob(new mMob('Голодный пес'))
			.addMob(new mMob('Чумовой Гриб'))
			.addMob(new mMob('НеПокойник'))
			.addLocation('Стагород')
			.addLocation('Гати')
			.addLocation('Проселок')
			.addLocation('Мавкина Роща')
			.addLocation('Погост')
	),


	(
		(new mLocation('Мавкина Роща', true))
			.addMob(new mMob('Злой Куст'))
			.addMob(new mMob('Дикий Вепрь'))
			.addMob(new mMob('Заброда'))
			.addLocation('Тракт')
			.addLocation('Ящеркин Хутор')
	),
	(
		(new mLocation('Стагород', false))
			.addMob(new mMob('Блудный Репей'))
			.addMob(new mMob('Безумец'))
			.addLocation('Тракт')
			.addLocation('Зябкое Ущелье')
			.addLocation('Поместье Раввика')
			.addLocation('Слободка')
			.addLocation('Коллектор')
			.addLocation('Верхний Город')
	),
	(
		(new mLocation('Зябкое Ущелье', false))
			.addMob(new mMob('Мародер'))
			.addMob(new mMob('Волкодлак'))
			.addMob(new mMob('Зомби'))
			.addMob(new mMob('Бронезомби'))
			.addMob(new mMob('Воин Ночи'))
			.addLocation('Стагород')
			.addLocation('Мертвый Каньон')
			.addLocation('Малые Пупыри')
	),
	(
		(new mLocation('Мертвый Каньон', true))
			.addMob(new mMob('Гнилой Зомби'))
			.addMob(new mMob('Приспешник'))
			.addMob(new mMob('Адепт'))
			.addMob(new mMob('Чернокнижник'))
			.addMob(new mMob('Оборотень'))
			.addMob(new mMob('Планомер'))
			.addMob(new mMob('Наймит'))
			.addLocation('Зябкое Ущелье')
			.addLocation('Пещера Древних')
			.addLocation('Лес Духов')
			.addLocation('Пещера Стеклодувов')
	),
	(
		(new mLocation('Лес Духов', true))
			.addMob(new mMob('Мелкий Дух'))
			.addMob(new mMob('Меднолобик'))
			.addMob(new mMob('Дух Дерева'))
			.addMob(new mMob('Дух Кабана'))
			.addMob(new mMob('Дух Волка'))
			.addMob(new mMob('Призрак Рыцаря'))
			.addLocation('Мертвый Каньон')
			.addLocation('Плачущее Озеро')
			.addLocation('Дубовая Чаща')
	),
	(
		(new mLocation('Плачущее Озеро', true))
			.addMob(new mMob('Утопленник'))
			.addMob(new mMob('Рыбарь'))
			.addMob(new mMob('Ухорез'))
			.addLocation('Лес Духов')
			.addLocation('Отмель')
	)


	// новые локации
	,
	(
		(new mLocation('Врата', true))
			.addMob(new mMob('Шустрик'))
			.addMob(new mMob('Мертвый Мечник'))
			.addMob(new mMob('Мертвая Гончая'))
			.addMob(new mMob('Мертвый Копейщик'))
			.addLocation('Тьма')
			.addLocation('Главный бастион')
	),
	(
		(new mLocation('Гати', true))
			.addMob(new mMob('Гребняк'))
			.addMob(new mMob('Злоцвет'))
			.addMob(new mMob('Разбойник'))
			.addMob(new mMob('Дикий пес'))
			.addMob(new mMob('Страдалец'))
			.addLocation('Тракт')
			.addLocation('Гнилая Топь')
	),
	(
		(new mLocation('Главный бастион', true))
			.addMob(new mMob('Трупная лоза'))
			.addMob(new mMob('Громовая плесень'))
			.addMob(new mMob('Темный маг'))
			.addMob(new mMob('Темный гвардеец'))
			.addLocation('Врата')
	),
	(
		(new mLocation('Дубовая Чаща', true))
			.addMob(new mMob('Ивовая лоза'))
			.addMob(new mMob('Чага'))
			.addMob(new mMob('Друид'))
			.addMob(new mMob('Черноволк'))
			.addMob(new mMob('Секач'))
			.addMob(new mMob('Лесоруб'))
			.addMob(new mMob('Зилёный'))
			.addMob(new mMob('Перерожденный'))
			.addLocation('Лес Духов')
			.addLocation('Перевал')
			.addLocation('Холм Фиглей')
			.addLocation('Питомник Друидов')
	),
	(
		(new mLocation('Левый бастион', true))
			.addMob(new mMob('Темный пехотинец'))
			.addMob(new mMob('Лоза защитница'))
			.addLocation('Тьма')
			.addLocation('Арсенал')
	),
	(
		(new mLocation('Лунное Логово', true))
			.addMob(new mMob('Оборотень'))
			.addMob(new mMob('Гару'))
			.addMob(new mMob('Обормотень'))
			.addLocation('Сумеречные Земли')
			.addLocation('Развилки')
	),
	(
		(new mLocation('Окраины Тьмы', true))
			.addMob(new mMob('Гиблая Тень'))
			.addMob(new mMob('Мертвый Латник'))
			.addMob(new mMob('Адепт Тьмы'))
			.addMob(new mMob('Гончая Праха'))
			.addMob(new mMob('Воин Мрака'))
			.addMob(new mMob('Демон Славы'))
			.addLocation('Пепелище')
			.addLocation('Тьма')
	),
	(
		(new mLocation('Отмель', true))
			.addMob(new mMob('Злой Камыш'))
			.addMob(new mMob('Озёрный Дед'))
			.addLocation('Плачущее Озеро')
	),
	(
		(new mLocation('Пепелище', true))
			.addMob(new mMob('Пепельный Волк'))
			.addMob(new mMob('Погорелец'))
			.addMob(new mMob('Гарпия'))
			.addMob(new mMob('Трупоед'))
			.addMob(new mMob('Горелый Рыцарь'))
			.addLocation('Развилки')
			.addLocation('Окраины Тьмы')
	),
	(
		(new mLocation('Перевал', true))
			.addMob(new mMob('Эдельвейс'))
			.addMob(new mMob('Горная Ведьма'))
			.addMob(new mMob('Гурк'))
			.addMob(new mMob('Йети'))
			.addMob(new mMob('Скальный Хрон'))
			.addLocation('Дубовая Чаща')
			.addLocation('Пещера Цвергов')
			.addLocation('Сумеречные Земли')
	),
	(
		(new mLocation('Пещера Древних', true))
			.addLocation('Мертвый Каньон')
	),
	(
		(new mLocation('Пещера Цвергов', true))
			.addMob(new mMob('Тролль'))
			.addLocation('Перевал')
	),
	(
		(new mLocation('Подземелья', true))
			.addMob(new mMob('Темный Страж'))
			.addMob(new mMob('Темный рыцарь'))
			.addMob(new mMob('Подземник'))
			.addLocation('Правый бастион')
	),
	(
		(new mLocation('Правый бастион', true))
			.addMob(new mMob('Темный пехотинец'))
			.addMob(new mMob('Колючая лоза'))
			.addLocation('Тьма')
			.addLocation('Подземелья')
	),
	(
		(new mLocation('Развилки', true))
			.addMob(new mMob('Крестьянин'))
			.addMob(new mMob('Хулиган'))
			.addMob(new mMob('Поселенец'))
			.addMob(new mMob('Боец'))
			.addMob(new mMob('Охотник'))
			.addLocation('Цитадель Крови')
			.addLocation('Пепелище')
			.addLocation('Лунное Логово')
	),
	(
		(new mLocation('Сумеречные Земли', true))
			.addMob(new mMob('Дикий Чеснок'))
			.addMob(new mMob('Крукроу'))
			.addMob(new mMob('Вурдулак'))
			.addMob(new mMob('Вовкулак'))
			.addMob(new mMob('Оборотень'))
			.addMob(new mMob('Вампир'))
			.addMob(new mMob('Зомби'))
			.addMob(new mMob('Ловец Волков'))
			.addLocation('Туннель Древних')
			.addLocation('Перевал')
			.addLocation('Цитадель Крови')
			.addLocation('Лунное Логово')
	),
	(
		(new mLocation('Тьма', true))
			.addMob(new mMob('Ядовитая лоза'))
			.addLocation('Окраины Тьмы')
			.addLocation('Врата')
			.addLocation('Левый бастион')
			.addLocation('Правый бастион')
	),
	(
		(new mLocation('Цитадель Крови', true))
			.addMob(new mMob('Пьявка'))
			.addMob(new mMob('Донор'))
			.addMob(new mMob('Кровосос'))
			.addMob(new mMob('Кровоголик'))
			.addMob(new mMob('Страж Темницы'))
			.addMob(new mMob('Гриб-Кровавик'))
			.addLocation('Сумеречные Земли')
			.addLocation('Башня Эритро')
			.addLocation('Башня Лейко')
			.addLocation('Башня Тромбо')
			.addLocation('Развилки')
	)











	/* Добавлено 2016-03-17 */

	,
	(
		(new mLocation('Кремнев', false))
			.addMob(new mMob('Хулиган'))
			.addMob(new mMob('Сектант'))
			.addMob(new mMob('Охламон'))
			.addMob(new mMob('Лоботряс'))
			.addLocation('Гати')
			.addLocation('Ярмарка')
	),
	(
		(new mLocation('Чернолесье', false))
			.addMob(new mMob('Гребник'))
			.addMob(new mMob('Подколдуй'))
			.addMob(new mMob('Вепрь'))
			.addMob(new mMob('Волчара'))
			.addMob(new mMob('Браконьер'))
			.addMob(new mMob('Упырь'))
			.addLocation('Проселок')
			.addLocation('Гнилая Топь')
			.addLocation('Ящеркин Хутор')
	),
	(
		(new mLocation('Гнилая Топь', false))
			.addMob(new mMob('Грибодун'))
			.addMob(new mMob('Репьявка'))
			.addMob(new mMob('Вепрь'))
			.addMob(new mMob('Волчара'))
			.addMob(new mMob('Браконьер'))
			.addMob(new mMob('Колдун'))
			.addMob(new mMob('Мертвяк'))
			.addLocation('Гати')
			.addLocation('Чернолесье')
			.addLocation('Ящеркин Хутор')
	),
	(
		(new mLocation('Ящеркин Хутор', false))
			.addMob(new mMob('Командировочный'))
			.addLocation('Гнилая Топь')
			.addLocation('Чернолесье')
			.addLocation('Мавкина Роща')
	),
	(
		(new mLocation('Погост', true))
			.addMob(new mMob('Беспокойник'))
			.addMob(new mMob('Оборотень'))
			.addMob(new mMob('Злобный Дух'))
			.addLocation('Тракт')
	),
	(
		(new mLocation('Слободка', false))
			.addMob(new mMob('Слободской'))
			.addMob(new mMob('Вор'))
			.addMob(new mMob('Громила'))
			.addLocation('Стагород')
			.addLocation('Лавка Контрабанды')
	),
	(
		(new mLocation('Лавка контрабанды', false))
			.addLocation('Слободка')
	),
	(
		(new mLocation('Верхний Город', false))
			.addLocation('Стагород')
	),
	(
		(new mLocation('Мастер Рун', false))
			.addLocation('Верхний Город')
	),
	(
		(new mLocation('Малые Пупыри', false))
			.addMob(new mMob('Хряк'))
			.addMob(new mMob('Мертвяк'))
			.addMob(new mMob('Дезертир'))
			.addLocation('Зябкое Ущелье')
	),
	(
		(new mLocation('Пещера Стеклодувов', true))
			.addMob(new mMob('Подземный Стеклодув'))
			.addLocation('Мертвый Каньон')
	),
	(
		(new mLocation('Пещера Стеклодувов', false))
			.addMob(new mMob('Подземный Стеклодув'))
			.addLocation('Мертвый Каньон')
	),
	(
		(new mLocation('Поместье Раввика', false))
			.addMob(new mMob('Куст-Сторож'))
			.addLocation('Стагород')
			.addLocation('Потайной ход')
			.addLocation('Терем Раввика')
	),
	(
		(new mLocation('Терем Раввика', false))
			.addMob(new mMob('Салага'))
			.addMob(new mMob('Боевик'))
			.addMob(new mMob('Диверсант'))
			.addLocation('Поместье Раввика')
	),
	(
		(new mLocation('Потайной ход', false))
			.addLocation('Поместье Раввика')
			.addLocation('Похоронный Зал')
	),
	(
		(new mLocation('Похоронный Зал', false))
			.addMob(new mMob('Мертвоцвет'))
			.addMob(new mMob('Великий Мертвый'))
			.addMob(new mMob('Магистр'))
			.addLocation('Северный Коридор')
			.addLocation('Южный Коридор')
			.addLocation('Потайной ход')
			.addLocation('Древний Храм')
	),
	(
		(new mLocation('Древний Храм', false))
			.addMob(new mMob('Сектант'))
			.addMob(new mMob('Гранит'))
			.addLocation('Похоронный Зал')
	),
	(
		(new mLocation('Северный Коридор', false))
			.addMob(new mMob('Подлый Труп'))
			.addLocation('Коридор Катакомб')
			.addLocation('Похоронный Зал')
	),
	(
		(new mLocation('Коридор Катакомб', false))
			.addMob(new mMob('Старый Труп'))
			.addMob(new mMob('Падальщик'))
			.addLocation('Коллектор')
			.addLocation('Северный Коридор')
			.addLocation('Южный Коридор')
	),
	(
		(new mLocation('Коллектор', false))
			.addMob(new mMob('Помоечный Пес'))
			.addMob(new mMob('Чернокнижник'))
			.addLocation('Стагород')
			.addLocation('Коридор Катакомб')
	),
	(
		(new mLocation('Лавка для Воинов', false))
			.addLocation('Верхний Город')
	),
	(
		(new mLocation('Все для Витязя', false))
			.addLocation('Верхний Город')
	),
	(
		(new mLocation('Храм Битвы', false))
			.addMob(new mMob('Настоятель'))
			.addLocation('Верхний Город')
	),
	(
		(new mLocation('Холм Фиглей', false))
			.addMob(new mMob('По-фигль'))
			.addLocation('Дубовая Чаща')
	),
	(
		(new mLocation('Питомник Друидов', false))
			.addMob(new mMob('Бешеный Огурец'))
			.addMob(new mMob('Вертуий Плющ'))
			.addMob(new mMob('Грибозомби'))
			.addLocation('Дубовая Чаща')
	),
	(
		(new mLocation('Туннель Древних', false))
			.addMob(new mMob('Кости Солдата'))
			.addMob(new mMob('Бродячие Кости'))
			.addMob(new mMob('Индрик'))
			.addMob(new mMob('Древний повредитель'))
			.addMob(new mMob('Древний вертун'))
			.addMob(new mMob('Древний броненосец'))
			.addMob(new mMob('Мертвый Воин'))
			.addLocation('Мертвый Каньон')
			.addLocation('1-й этаж Башни')
			.addLocation('Грот Земли')
			.addLocation('Термопилы')
			.addLocation('Сумеречные Земли')
	),
	(
		(new mLocation('1-й этаж Башни', false))
			.addMob(new mMob('Боевой Пёс'))
			.addLocation('2-й этаж Башни')
			.addLocation('Туннель Древних')
	),
	(
		(new mLocation('2-й этаж Башни', false))
			.addMob(new mMob('Бездельник'))
			.addLocation('3-й этаж Башни')
			.addLocation('1-й этаж Башни')
	),
	(
		(new mLocation('3-й этаж Башни', false))
			.addMob(new mMob('Агент'))
			.addLocation('4-й этаж Башни')
			.addLocation('2-й этаж Башни')
	),
	(
		(new mLocation('4-й этаж Башни', false))
			.addLocation('3-й этаж Башни')
	),
	(
		(new mLocation('Грот Земли', false))
			.addMob(new mMob('Дух Земли'))
			.addLocation('Туннель Древних')
	),
	(
		(new mLocation('Термопилы', false))
			.addMob(new mMob('Хряк Моряк'))
			.addMob(new mMob('Цирцея'))
			.addMob(new mMob('Гопалит'))
			.addMob(new mMob('Спаддранец'))
			.addMob(new mMob('Циклоп'))
			.addLocation('Туннель Древних')
	),
	(
		(new mLocation('Башня Эритро', false))
			.addMob(new mMob('Эритро Цит'))
			.addLocation('Цитадель Крови')
	),
	(
		(new mLocation('Башня Лейко', false))
			.addMob(new mMob('Лейко Цит'))
			.addLocation('Цитадель Крови')
	),
	(
		(new mLocation('Башня Тромбо', false))
			.addMob(new mMob('Тромбо Цит'))
			.addLocation('Цитадель Крови')
	),
	(
		(new mLocation('Арсенал', false))
			.addLocation('Левый бастион')
			.addLocation('Комната')
	),
	(
		(new mLocation('Комната', false))
			.addMob(new mMob('Боевой Тролль'))
			.addLocation('Арсенал')
	),
	(
		(new mLocation('Южный Коридор', false))
			.addMob(new mMob('Боевой Пёс'))
			.addLocation('Коридор Катакомб')
			.addLocation('Похоронный Зал')
	)
];


function getLocationNames(onlyRed) {

	if (typeof  onlyRed === 'undefined') {
		onlyRed = false;
	}
	var locationNamesArray = [];

	for (var i in locationList) {
		if (!onlyRed) {
			locationNamesArray.push(locationList[i].name)
		} else {
			if (locationList[i].isRed) {
				locationNamesArray.push(locationList[i].name)
			}
		}

	}

	return locationNamesArray.join(',');
}

function getMobNames(locationName) {
	var mobNamesArray = [];

	for (var i in locationList) {

		if (locationName == locationList[i].name) {

			for (var k in locationList[i].mobList) {
				mobNamesArray.push(locationList[i].mobList[k].name);
			}
		}
	}

	return mobNamesArray.join(',');
}