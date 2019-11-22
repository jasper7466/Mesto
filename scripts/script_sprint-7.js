// Получаем доступ к необходимым элементам
const cardsContainer = document.querySelector('.places-list');              // Контейнер карточек

const buttonAddPlace = document.querySelector('.user-info__button');        // Кнопка "Добавить место"
const dialogAddPlace = document.querySelector('.popup__add-place');         // Диалог "Добавить место"
const formAddPlace = document.forms.addPlace;                               // Форма "Добавить место"
//const buttonSubmitPlace = document.querySelector('.popup__button-place');   // Кнопка "Подтвердить место"

const buttonEditProfile = document.querySelector('.user-info__edit');       // Кнопка "Редактировать профиль"
const dialogEditProfile = document.querySelector('.popup__edit-profile');   // Диалог "Редактировать профиль"
const formEditProfile = document.forms.editProfile;                         // Форма "Редактировать профиль"
//const buttonSubmitProfile = document.querySelector('.popup__button-profile'); // Кнопка "Подтвердить профиль"

const dialogShowImage = document.querySelector('.popup__image');            // Диалог "Просмотр изображения места"

const buttonCloseDialog = document.querySelectorAll('.popup__close');       // Массив кнопок "Закрыть диалог" из всех диалогов

const fieldId = document.querySelector('.user-info__name');                 // Поле "Имя"
const fieldAbout = document.querySelector('.user-info__job');               // Поле "О себе"

function addCard(name, link)    // Добавление карточки
{
    // Создаём элементы
    const card = document.createElement('div');
    const img = document.createElement('div');
    const deleteButton = document.createElement('button');
    const description = document.createElement('div');
    const title = document.createElement('h3');
    const likeButton = document.createElement('button');

    // Раздаём классы и свойства
    card.classList.add('place-card');
        img.classList.add('place-card__image');
        img.style.backgroundImage = `url(${link})`;
            deleteButton.classList.add('place-card__delete-icon');
        description.classList.add('place-card__description');
            title.classList.add('place-card__name');
            title.textContent = name;
            likeButton.classList.add('place-card__like-icon');

    // Формируем дерево
    description.appendChild(title);
    description.appendChild(likeButton);
    img.appendChild(deleteButton);
    card.appendChild(img);
    card.appendChild(description);

    // Вставляем в контейнер
    cardsContainer.appendChild(card);
}

function showAddDialog(event)    // Открытие диалогового окна "Добавить место"
{
    dialogAddPlace.classList.toggle('popup_is-opened');
    event.stopPropagation();
}

function showImageDialog(event)
{
    // Пишем в src картинки ссылку из бэкграунда карточки, предварительно убрав "url(" и ")". Выглядит коряво... наверное, можно лучше
    dialogShowImage.querySelector('.popup__img').src = event.target.style.backgroundImage.split('"')[1];
    // + у картинок, которые не очень большие в высоту - почему-то появляется белая полоса в 3px внизу, не смог разобраться из-за чего :(
    dialogShowImage.classList.toggle('popup_is-opened');        // Отображаем диалог
    event.stopPropagation();
}

function showEditDialog(event)    // Открытие диалогового окна "Редактировать профиль"
{
    // Подтягиваем значения полей
    formEditProfile.elements.id.value = fieldId.textContent;
    formEditProfile.elements.about.value = fieldAbout.textContent;

    // Формируем "липовый event", чтобы при открытии диалога можно было на всякий случай
    // валидировать считанные значения полей + активировать (или нет) кнопку, т.к. все кнопки
    // блокируются при вызове функции закрытия формы
    const e = {};
    e.target = formEditProfile.firstChild;  // Нужно передать любой input из формы
    inputCheck(e);   // Вызов валидации полей формы

    // Показываем форму
    dialogEditProfile.classList.toggle('popup_is-opened');
}

function closeDialog(event)    // Закрытие диалогового окна (любого popup)
{
    // Вычленяем из event ссылки на нужные объекты
    const popup = event.target.closest('.popup');
    const form = popup.querySelector('form');
    const button = popup.querySelector('.button');

    popup.classList.toggle('popup_is-opened');  // Прячем окно, из которого всплыло событие
    form.reset();                               // Сбрасываем форму
    button.setAttribute('disabled', true);      // Блокируем кнопулю
    button.classList.add('popup__button_disabled');

    event.stopPropagation();
}

function cardClickHandler(event)    // Обработчик кнопок "Лайк", "Удалить" и нажатия на изображение карточки
{
    if (event.target.classList.contains('place-card__like-icon'))
        event.target.classList.toggle('place-card__like-icon_liked');

    if (event.target.classList.contains('place-card__delete-icon'))
        event.target.closest('.place-card').remove();

    if (event.target.classList.contains('place-card__image'))
    {
        showImageDialog(event);
    }
    
    event.stopPropagation();
}

function submitPlaceHandler(event)   // Обработчик события "submit" для нового места
{
    event.preventDefault();

    const button = event.target.parentElement.querySelector('.button');

    addCard(formAddPlace.elements.name.value, formAddPlace.elements.link.value);
    closeDialog(event);
}

function submitProfileHandler(event)   // Обработчик события "submit" для профиля
{
    event.preventDefault();
    fieldId.textContent = formEditProfile.elements.id.value;
    fieldAbout.textContent = formEditProfile.elements.about.value;
    closeDialog(event);
}

function checkURL(url) {    // Функция проверки ссылок
    var regURL = /^(?:(?:https?|ftp|telnet):\/\/(?:[a-z0-9_-]{1,32}(?::[a-z0-9_-]{1,32})?@)?)?(?:(?:[a-z0-9-]{1,128}\.)+(?:com|net|org|mil|edu|arpa|ru|gov|biz|info|aero|inc|name|[a-z]{2})|(?!0)(?:(?!0[^.]|255)[0-9]{1,3}\.){3}(?!0|255)[0-9]{1,3})(?:\/[a-z0-9.,_@%&?+=\~\/-]*)?(?:#[^ \'\"&<>]*)?$/i;
    return regURL.test(url);
}

function inputCheck(event)   // Валидация форм
{
    const form = event.target.parentElement;
    const fields = Array.from(form.querySelectorAll('input'));    // Получаем массив всех полей формы, в которой произошёл ввод
    const button = event.target.parentElement.querySelector('.button');                 // Получаем нужную кнопку "submit"

    fields.forEach(function(field) {            // Проверяем все поля
        if(field.name != 'link')                // Обычные поля ввода
        {
            if (field.value.length === 0)
            {
                button.classList.add('popup__button_disabled');
                button.setAttribute('disabled', true);
                field.nextElementSibling.textContent = "Это обязательное поле";
                return(true);
            }
            if (field.value.length < 2 || field.value.length > 30)
            {
                button.classList.add('popup__button_disabled');
                button.setAttribute('disabled', true);
                field.nextElementSibling.textContent = "Должно быть от 2 до 30 символов";
                return(true);
            }
        }
        else    // Поля для ввода ссылок
        {
            if (!checkURL(field.value))
            {
                button.classList.add('popup__button_disabled');
                button.setAttribute('disabled', true);
                field.nextElementSibling.textContent = "Здесь должна быть ссылка";
                return(true);
            }
        }

        button.classList.remove('popup__button_disabled');
        button.removeAttribute('disabled');
        field.nextElementSibling.textContent = "";
        return(false)
    });

    //if(event.key == 'Enter' && !button.contains('popup__button_disabled'))  // Обработка submit'а по нажатию Enter - и без этого кода срабатывает... ¯\_(ツ)_/¯
    //  form.submit();

    try { event.stopPropagation(); }    // Ловим исключение, т.к. event не всегда "настоящий"
    catch(error) { console.log('It is ok =)');}
}

initialCards.forEach(function(item) {addCard(item.name, item.link)});   // Добавление базового набора карточек

// Развешиваем подписки на события

buttonAddPlace.addEventListener('click', showAddDialog);
buttonEditProfile.addEventListener('click', showEditDialog);
buttonCloseDialog.forEach(function(item) {item.addEventListener('click', closeDialog)});

cardsContainer.addEventListener('click', cardClickHandler);

formAddPlace.addEventListener('input', inputCheck);
formAddPlace.addEventListener('submit', submitPlaceHandler);

formEditProfile.addEventListener('input', inputCheck);
formEditProfile.addEventListener('submit', submitProfileHandler);


/**
 * 
 * Очень хорошая работа. Мне кажется таких работ единицы. 
 * 
 * Согласно требованиям я должен работу вернуть вам с требование не использовать innerHTML, а заменить на textContent
 * но я хочу отнести это в как можно лучше. Но вы обязательно должны исправить
 * 
 * Чтобы я сделал лучше 
 * функция  inputCheck(event)
 * Разбил бы на мелкие функции с отдельной обязанностью проверки. В программировании это называется цепочка вызовов
 * https://learn.javascript.ru/task/chain-calls
 * 
 * Все названия "Должно быть от 2 до 30 символов" вынес бы в отдельный объект
 * 
 * Правильно что вынесли initialCards в отдельный файл, логику надо отделять от данных
 * 
 * Ждём вас в следующем спринте
 * 
 * @koras
 * 
 * 
 */