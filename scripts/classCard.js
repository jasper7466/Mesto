'use strict';

export class Card
{
    /*entity = undefined;         // Ссылка на родительский узел структуры диалога
    img = undefined;            // Ссылка на элемент "Картинка"
    title = undefined;          // Ссылка на элемент "Название"
    likeButton = undefined;     // Ссылка на элемент "Лайк"
    likeCounter = undefined;    // Ссылка на элемент "Счётчик лайков"
    deleteButton = undefined;   // Ссылка на элемент "Удалить"
    
    likes = undefined;          // Количество лайков
    remover = undefined;        // Ссылка на функцию удаления с сервера
    id = undefined;             // Идентификатор карточки
    liker = undefined;          // Ссылка на функцию постановки лайка на сервере*/

    // Пользовательское событие, инициируемое при удалении карточки
    //removeEvent = undefined;

    // Конструктор класса
    constructor(
        name,
        link,
        likes = 0,
        removable = true,
        remover = undefined,
        id = undefined,
        liker = undefined,
        liked = false)
    {
        // Сохраняем данные
        this.likes = likes;
        this.remover = remover;
        this.id = id;
        this.liker = liker;

        // Создаём кастомное событие удаления карточки
        this.removeEvent = new CustomEvent('instance-remove', {bubbles: true});
        // Создаём дерево карточки
        this.create(name, link, removable);
        // Вешаем обработчики событий "Лайк" и "Удалить"
        this.likeButton.addEventListener('click', event => this.likeHandler(event));
        this.deleteButton.addEventListener('click', event => this.remove());

        if(liked)
        {
            this.likes--;
            this.like();
        }
    }

    // Метод "Лайк"
    likeHandler()
    {
        let prom = undefined;

        // Если задана функция удаления
        if (typeof this.liker === "function")
            prom = this.liker(this.isLiked(), this.id);

        // Попытка дождаться завершения асинхронной процедуры
        if (Promise.resolve(prom) === prom)
        {
            prom
                .then(() => {
                    this.like();
                })
                .catch((err) => {
                    console.log('Remote card like error');
                    console.log(err);
                })
                .finally(() => {});
        }
        else
        {
            this.like();
        }
    }

    // Метод "Удалить"
    remove()
    {
        if(!window.confirm("Вы действительно хотите удалить карточку?"))
            return;

        let prom = undefined;

        // Если задана функция удаления
        if (typeof this.remover === "function")
            prom = this.remover(this.id);

        // Попытка дождаться завершения асинхронной процедуры
        if (Promise.resolve(prom) === prom)
        {
            prom
                .then(() => {
                    // Инициируем событие "Произошло удаление карточки"
                    this.entity.dispatchEvent(this.removeEvent);
                    // Удаляем дерево карточки
                    this.entity.remove();
                    // Удаляем объект "Карточка"
                    delete this.entity;
                })
                .catch((err) => {
                    console.log('Remote card removing error');
                    console.log(err);
                })
                .finally(() => {});
        }
        else
        {
            // Снимаем все обработчики (на всякий случай, возможно, это лишнее)
            //this.likeButton.removeEventListener('click', event => this.like(event));
            //this.deleteButton.removeEventListener('click', event => this.remove(event));

            // Инициируем событие "Произошло удаление карточки"
            this.entity.dispatchEvent(this.removeEvent);
            // Удаляем дерево карточки
            this.entity.remove();
            // Удаляем объект "Карточка"
            delete this.entity;
        }
    }

    // Метод получения имени
    getName()
    {
        return(this.title.textContent);
    }

    // Метод получения ссылки
    getLink()
    {
        // Выделяем непосредственно ссылку
        return(this.img.style.backgroundImage.replace('url(','').replace(')',''));
    }

    // Метод проверки наличия "Лайка"
    isLiked()
    {
        return(this.likeButton.classList.contains('place-card__like-icon_liked'));
    }

    like()
    {
        if(this.isLiked())
        {
            this.likeButton.classList.remove('place-card__like-icon_liked');
            this.likes--;
        }
        else
        {
            this.likeButton.classList.add('place-card__like-icon_liked');
            this.likes++;
        }
        this.update();
    }

    // Метод обновления параметров карточки. Можно вызывать многократно.
    update(name = undefined, link = undefined)
    {
        if (name != undefined)
            this.title.textContent = name;
        if (link != undefined)
            this.img.style.backgroundImage = `url(${link})`;
        this.likeCounter.textContent = this.likes.toString();
    }

    // Метод формирования дерева карточки. Вызывать единожды - только из конструктора.
    create(name, link, removable)
    {
        // Создаём элементы
        this.entity = document.createElement('div');
        this.img = document.createElement('div');
        this.deleteButton = document.createElement('button');
        const description = document.createElement('div');
        this.title = document.createElement('h3');
        const likeContainer = document.createElement('div');
        this.likeButton = document.createElement('button');
        this.likeCounter = document.createElement('span');

        // Раздаём классы и свойства
        this.entity.classList.add('place-card');
            this.img.classList.add('place-card__image');
                this.deleteButton.classList.add('place-card__delete-icon');
                if(removable)
                    this.deleteButton.classList.add('place-card__delete-icon_active');
            description.classList.add('place-card__description');
                this.title.classList.add('place-card__name');
                likeContainer.classList.add('place-card__like-container')
                this.likeButton.classList.add('place-card__like-icon');
                this.likeCounter.classList.add('place-card__like-counter');

        // Формируем дерево
        likeContainer.appendChild(this.likeButton);
        likeContainer.appendChild(this.likeCounter);
        description.appendChild(this.title);
        description.appendChild(likeContainer);
        this.img.appendChild(this.deleteButton);
        this.entity.appendChild(this.img);
        this.entity.appendChild(description);
        
        // Заполняем атрибуты значениями
        this.update(name, link);
    }

    // Метод для монтирования карточки в указанный контейнер
    /*deploy(location)
    {
        location.appendChild(this.entity);
    }*/
}
