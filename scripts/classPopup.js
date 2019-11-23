'use strict';

class Popup // Базовый класс всплывающих окон
{
    constructor()
    {
        this.entity = undefined;     // Родительский узел структуры диалога
        this.fieldCollection = [];   // Массив объектов, описывающих поля ввода
        this.close = undefined;      // Кнопка закрытия
        this.form = undefined;       // Форма
    }

    // Метод "показать форму"
    show()
    {
        // Проверяем, нужно ли подтягивать в поля ввода значения из указанного источника, если да - подгружаем значения
        if(this.hasOwnProperty('fieldCollection') && Array.isArray(this.fieldCollection) && this.fieldCollection.length >= 1)
        {
            this.fieldCollection.forEach( (item) => {
                if(item.source != undefined)
                {
                    item.input.value = item.source.textContent;
                    // Т.к. валидность подгружаемых данных не гарантируется - сразу делаем валидацию поля с отображением ошибок ввода
                    this.validate(item);
                }
            });
        }
        this.entity.classList.add('popup_is-opened');
    }

    // Метод "скрыть форму"
    hide()
    {
        this.entity.classList.remove('popup_is-opened');
    }
}

export class DataInputPopup extends Popup      // Класс окон для ввода данных
{
    //entity = undefined;         // Родительский узел структуры окна
    //close = undefined;          // Кнопка закрытия
    //title = undefined;          // Название диалога
    //form = undefined;           // Форма
    //button = undefined;         // Кнопка "submit"
    //submitCaption = undefined;  // Надпись для кнопки "submit"
    //dataHandler = undefined;    // Ссылка на функцию обработчика события "submit"
    //fieldCollection = [];       // Массив объектов, описывающих поля ввода

    constructor(title, fieldSet, location, submitCaption, dataHandler)
    {
        // Дёргаем конструктор родительского класса
        super();
        
        // Сохраняем ссылку на функцию-обработчик данных при отправке формы
        this.dataHandler = dataHandler;
        
        // Сохраняем надпись для кнопки
        this.submitCaption = submitCaption;

        // Создаём элементы, раздаём им классы/слушатели и формируем дерево
        this.entity = document.createElement('div');
        this.entity.classList.add('popup');

        const content = document.createElement('div');
        content.classList.add('popup__content');
        this.entity.appendChild(content);

        const close = document.createElement('button');
        close.classList.add('popup__close');
        //close.src = "<%=require('../images/close.svg')%>";  <- так не работает, пришлось переделать через стили (в bacground-image, по аналогии кнпки delete у карточек
        close.addEventListener('click', event => this.hide(event));
        content.appendChild(close);

        this.title = document.createElement('h3');
        this.title.classList.add('popup__title');
        this.title.textContent = title;
        content.appendChild(this.title);

        this.form = document.createElement('form');
        this.form.classList.add('popup__form');
        this.form.addEventListener('submit', (event) => this.submit(event));
        content.appendChild(this.form);

        fieldSet.forEach( (item) => {

            const input = document.createElement('input');
            input.type = 'text';
            input.classList.add('popup__input');
            input.placeholder = item.placeholder;
            input.addEventListener('input', event => this.check(event));

            const error = document.createElement('span');
            error.classList.add('popup__error');

            const newField = {};
            newField.input = input;
            newField.error = error;
            newField.source = item.source;
            newField.checkList = item.checkList;

            this.form.appendChild(input);
            this.form.appendChild(error);

            this.fieldCollection.push(newField);
        })

        this.button = document.createElement('button');
        this.button.classList.add('button');
        this.button.classList.add('popup__button');
        this.button.classList.add('popup__button_disabled');
        this.button.textContent = submitCaption;
        this.button.disabled = true;
        this.form.appendChild(this.button);

        location.appendChild(this.entity);
    }

    // Обработчик события "submit"
    submit(event)
    {
        // Промис, который возможно понадобится далее
        let prom = undefined;

        // Сообщаем пользователю о протекании процесса
        this.button.textContent = 'Загрузка...';
        // Отключаем поведение по умолчанию
        event.preventDefault();
        
        // Если в конструктор была передана ссылка на функцию обработки введённых данных - парсим набор полей и передаём их значения в эту функцию в порядке следования
        if(this.dataHandler != undefined)
            prom = this.dataHandler(...this.fieldCollection.map(field => field.input.value));
        
        // Попытка дождаться завершения асинхронной процедуры (если был получен промис)
        if (Promise.resolve(prom) === prom)
        {
            prom
                .then(() => {
                    // Попробуем вернуть значения полей туда, откуда мы их взяли (в случае, если указан источник)
                    this.update();
                })
                .catch(() => {
                    console.log('Data processing error');
                })
                .finally(() => {
                    this.hide();
                });
        }
        else
        {
            // Попробуем вернуть значения полей туда, откуда мы их взяли (в случае, если указан источник)
            this.update();
            // Прячем форму
            this.hide();
        }
    }

    // Метод для непосредственного прямого заполнения формы и инициирования процедуры обработки данных
    directUpdate()
    {
        const args = Array.from(arguments);
        const size = args.length;

        if(size)
        {
            try
            {
                // Пробуем заполнить поля формы аргументами
                for(let i = 0; i < size; i++)
                {
                    this.fieldCollection[i].input.value = args[i];
                }
                // Вручную формируем событие "submit"
                const event = new Event('submit', {'bubbles' : true, 'cancelable' : true});
                // и инициируем его сработку, чтобы запустилась процедура обработки введённых данных
                this.form.dispatchEvent(event);
                // Из минусов такого решения: пропускается этап валидации (приходится понадеяться, что переданные данные заведомо корректны) и неоптимальность (лишнее действие по заполнению полей формы и имитации её подтверждения + бесполезная отправка PATCH запроса с обновлёнными данными).
                // Из плюсов: код, отвечающий за обрабтку данных, находится в одном месте. Его будет легко контролировать и модфицировать при необходимости.
            }
            catch(err)
            {
                console.log(`Too many arguments (${size}). Selected form contains only ${this.fieldCollection.size} fields`);
                console.log(err);
            }
        }
    }

    // Метод выгрузки данных из формы в источник
    update()
    {
        try
        {
            this.fieldCollection.forEach( (item) => {
                if (item.source != undefined)
                    item.source.textContent = item.input.value;
            });
        }
        catch(err)
        {
            console.log("Data upload error.");
            console.log(err);
        }
    }

    // Метод валидации конкретного поля. Если установлен флаг "silent" - ошибка валидации не будет подсвечена в форме
    validate(field, silent = false)
    {
        let error = '';    // Текст выводимой ошибки
        const minLength = field.checkList.minLength;
        const maxLength = field.checkList.maxLength;
        const length = field.input.value.length;
        
        if(field.checkList.empty)
            error = field.input.value.length == 0 ? 'Это обязательное поле' : '';

        if(field.checkList.url)
            error = this.checkURL(field.input.value) ? '' : 'Здесь должна быть ссылка';

        if(minLength >= 1 && maxLength >= 1)
        {
            const underfill = length < minLength;
            const overfill = length > maxLength;
            error = (underfill || overfill) ? `Должно быть от ${minLength} до ${maxLength} символов` : '';
        }

        if(!silent)
            field.error.textContent = error;

        return(error == '' ? true : false);
    }

    // Метод проверки поля (а по факту - всех полей сразу), который выступает в качестве обработчика событий ввода
    check(event)
    {
        // Валидируем текущее поле, где произошёл ввод, в случае ошибки - блокируем кнопку отправки формы и показываем сообщение ошибки
        if(!this.validate(this.fieldCollection.find( (item) => { return(item.input == event.target ? true : false) } ), false))
            this.lock();
        // Для разблокировки отправки формы - проверяем все поля в "тихом" режиме
        if(this.checkAll(true))
            this.unlock();
    }

    // Метод проверки всех полей. В "тихом" режиме блокирует кнопку "submit", но не раздражает пользователя предупреждениями на тех полях, куда он ещё не добрался
    checkAll(mode = false)
    {
        return(this.fieldCollection.every(item => this.validate(item, mode))/* ? this.unlock() : this.lock()*/);
    }

    checkURL(url) {    // Функция проверки ссылок
        var regURL = /^(?:(?:https?|ftp|telnet):\/\/(?:[a-z0-9_-]{1,32}(?::[a-z0-9_-]{1,32})?@)?)?(?:(?:[a-z0-9-]{1,128}\.)+(?:com|net|org|mil|edu|arpa|ru|gov|biz|info|aero|inc|name|[a-z]{2})|(?!0)(?:(?!0[^.]|255)[0-9]{1,3}\.){3}(?!0|255)[0-9]{1,3})(?:\/[a-z0-9.,_@%&?+=\~\/-]*)?(?:#[^ \'\"&<>]*)?$/i;
        return regURL.test(url);
    }

    // Метод блокировки кнопки отправки
    lock()
    {
        this.button.disabled = true;
        this.button.classList.add('popup__button_disabled');
    }
    
    // Метод разблокировки кнопки отправки
    unlock()
    {
        this.button.disabled = false;
        this.button.classList.remove('popup__button_disabled');
    }

    // Дополненный метод "показать форму"
    show()
    {
        // Наследуем часть кода метода из базового класса
        super.show();

        // Возвращаем стандартное именование для кнопки
        this.button.textContent = this.submitCaption;

        // Делаем "тихую" валидацию всех полей для разблокировки кнопки "submit" в случае, если значения полей были загружены из источников
        if(this.checkAll(true))
            this.unlock();
    }

    // Дополненный Метод "скрыть форму"
    hide()
    {
        // Наследуем часть кода метода из базового класса
        super.hide();
        
        this.form.reset();
        this.fieldCollection.forEach((field) => field.error.textContent = '');  // Чистим всплывшие ошибки
        this.button.enabled = false;
        this.button.classList.add('popup__button_disabled');
    }
}

export class ImagePopup extends Popup      // Класс окон для отображения картинок
{
    //entity = undefined;     // Родительский узел структуры диалога
    //image = undefined;      // Картинка
    
    constructor(location)
    {
        // Дёргаем конструктор родительского класса
        super();

        // Создаём элементы, раздаём им классы/слушатели и формируем дерево
        this.entity = document.createElement('div');
        this.entity.classList.add('popup');

        const content = document.createElement('div');
        content.classList.add('popup__content');
        content.classList.add('popup__content_image');
        this.entity.appendChild(content);

        const close = document.createElement('button');
        close.classList.add('popup__close');
        //close.src = "<%=require('../images/close.svg')%>";
        close.addEventListener('click', event => this.hide(event));
        content.appendChild(close);

        this.image = document.createElement('img');
        this.image.classList.add('popup__img');
        content.appendChild(this.image);
        
        location.appendChild(this.entity);
    }

    // Дополненный метод "показать форму"
    show(link)
    {
        // Наследуем часть кода метода из базового класса
        super.show();

        this.image.src = link;
    }
}