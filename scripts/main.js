'use strict';

import "../pages/index.css";

import {ApiMesto} from './classApiMesto.js';
import {AnyContentHolder} from './classAnyContentHolder.js';
import {DataInputPopup, ImagePopup } from './classPopup.js';
import {addPlaceFieldSet, editProfileFieldSet} from './resources.js';
import {Card} from './classCard.js';

//import "./classCard.js";

const token = '63ee3dea-32a2-44d1-86e6-300604d8869b';           // Токен
let me = undefined;                                             // Идентификатор пользователя
const cohortId = 'cohort4';                                     // Идентификатор потока
const IP = 'praktikum.tk';                                      // IP сервера
const protocol = NODE_ENV === 'development' ? 'http': 'https';  // IP сервера



const cardHolder = document.querySelector('.places-list');                  // Родительский узел-хранитель для создаваемых объектов
const dialogHolder = document.querySelector('.root');                       // Родительский узел-хранитель создаваемых диалогов

const buttonAddPlace = document.querySelector('.user-info__button');        // Кнопка "Добавить место"
const buttonEditProfile = document.querySelector('.user-info__edit');       // Кнопка "Редактировать профиль"
const avatar = document.querySelector('.user-info__photo');                 // Фото профиля

// Создаём экземпляр класса ApiMesto, в конструктор передаём
// 1. IP сервера
// 2. Идентификатор потока
// 3. Токен
const api = new ApiMesto(protocol, IP, cohortId, token);

// Создаём контейнер, ему в конструктор передаём:
// 1. Тип хранимых элементов (ссылка на конструктор класса элемента)
// 2. Ссылку на узел-контейнер в структуре документа
// 3. Начальный набор элементов в виде массива объектов
const cardsContainer = new AnyContentHolder((...rest) => new Card (...rest), cardHolder, /*initialCards*/);

// Связующая функция для добавления карточек
function uploadCard(name, link)
{
    const prom = api.uploadCard(name, link);
    prom
        .then( (res) => {
            // Кладём карточку в локальный контейнер только в случае успешной выгрузки
            cardsContainer.addItem(
                name,
                link,
                0,
                true,
                (...rest) => api.deleteCard(...rest),
                res._id,
                (...rest) => api.like(...rest),
                false
                );
        })
        .catch((err) => {
            console.log('Card upload error.');
        })
    return prom;
}

// Создаём окно диалога добавления карточки, ему в конструктор передаём:
// 1. Заголовок окна
// 2. Массив объектов, описывающих набор полей формы (см. resources.js)
// 3. Ссылку на узел-контейнер в структуре документа
// 4. Текст для кнопки отправки формы
// 5. Ссылку на функцию, которая знает что дальше нужно делать с полученными из формы данными
const addCardDialog = new DataInputPopup('Новое место', addPlaceFieldSet, dialogHolder, '+', (...rest) => uploadCard(...rest));

// Аналогично создаём окно диалога для редактирования профиля. Всё как для предыдущего диалога, за исключением функции-обработчика для отправляемых данных
// В данном случае форма при сработке submit'а попытается вернуть данные туда, откуда они были подгружены (см. resources.js, поле "source")
const editProfileDialog = new DataInputPopup('Редактировать профиль', editProfileFieldSet, dialogHolder, 'Сохранить', (a, b) => api.setUserInfo(a, b));

// Создаём окно просмотрщика изображений, на вход передаём только ссылку на контейнер
const imageDialog = new ImagePopup(dialogHolder);

// Создаём окно для смены фото профиля
const avatarDialog = new DataInputPopup(
    'Редактировать профиль',
    [{
        placeholder: 'Ссылка на аватар',
        source: undefined,
        checkList:
        {
            empty:      true,
            minLength:  -1,
            maxLength:  -1,
            url:        true
        }
    }],
    dialogHolder,
    'Сохранить',
    (...rest) => updateAvatar(...rest)
    );

// Функция-обработчик данных от формы смены фото
function updateAvatar(link)
{
    api.updateAvatar(link);
    avatar.style.backgroundImage = `url(${link})`;
}

// Подписываем методы отображения диалогов на клики по кнопкам
buttonAddPlace.addEventListener('click', (event) => addCardDialog.show(event));
buttonEditProfile.addEventListener('click', (event) => editProfileDialog.show(event));
avatar.addEventListener('click', (event) => avatarDialog.show(event));

// Подписываем контейнер карточек на прослушку кликов и вручную указываем желаемую цель
cardsContainer.container.addEventListener('click', event => {
    if(event.target.classList.contains('place-card__image'))
        // Выделяем и передаём ссылку на изображение
        imageDialog.show(event.target.style.backgroundImage.split('"')[1]);
    event.stopPropagation();
});

// Загрузка информации о пользователе с сервера
// Инициируем запрос данных пользователя, получаем промис
const userInfo = api.getUserInfo();

// Обрабатываем данные
userInfo
    .then((data) => {
        // Директивно заполняем форму и имитируем её "submit", для этого в класс DataInputPopup добавлен метод directUpdate()
        editProfileDialog.directUpdate(data.name, data.about);
        // Фото профиля устанавливаем вручную
        //console.log(data.avatar);
        //console.log(avatar.stylebackgroundImage);
        avatar.style.backgroundImage = `url(${data.avatar})`;
        me = data._id;
    })
    .catch((err) => {
        console.log('Error!');
    })

// Загрузка карточек с сервера
// Инициируем запрос карточек, получаем промис
const cards = api.getItems();

cards.catch((err) => {
    console.log('Card download error.');
})

cards.then((cardSet) => {
    // Добавляем карточки
    cardSet.forEach((item) => {
        
        let removable = false;
        let liked = false;

        if(item.owner._id === me)
            removable = true;
        if(item.likes.map(person => person._id).includes(me))
            liked = true;

        cardsContainer.addItem(
            item./*owner.*/name,
            item.link,
            item.likes.length,
            removable,
            (...rest) => api.deleteCard(...rest),
            item._id,
            (...rest) => api.like(...rest),
            liked
        );
    });
});