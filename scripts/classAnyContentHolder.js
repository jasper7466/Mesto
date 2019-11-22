'use strict';

class AnyContentHolder          // Контейнер для чего-либо
{
    collection = [];            // Массив добавленных объектов
    container = undefined;      // Ссылка на узел контейнера
    creator = undefined;        // Ссылка на функцию-конструктор элементов контейнера

    // Конструктор. Принимает на вход функцию создания элемента, ссылку на узел и дефолтный набор элементов
    constructor(creator, location, initial)  
    {
        this.creator = creator;         // Сохраняем ссылку на конструктор хранимых элементов
        this.container = location;      // Запоминаем ссылку внутрь объекта
        // Подписываемся на пользовательское событие, инициируемое элементом при его удалени извне, чтобы не хранить в коллекции несуществующие сущности
        this.container.addEventListener('instance-remove', event => this.pullOff(event));
        // Добавление набора объектов и размещения их в контейнере
        if(Array.isArray(initial) && initial.length)                                // Проверяем, что это массив и он не пуст
            initial.forEach( (item) => { this.addItem(...Object.values(item)); })   // Вызываем метод добавления экземпляра объекта для всех объектов из массива
    }

    // Метод добавления отдельного объекта и его размещения в контейнере
    addItem(/*name, link*/)
    {
        const newItem = this.creator(...arguments); // Передаём аргументы в конструктор класса типа хранимых объектов
        this.collection.push(newItem);              // Кладём в "коллекцию" свежесозданный экземпляр
        this.container.appendChild(newItem.entity); // Размещаем в контейнере
    }

    // Метод удаления экземпляра из коллекции
    pullOff(event)
    {
        this.collection = this.collection.filter(obj => obj.entity !== event.target.entity);
    }

    // Метод полной очистки контейнера
    clear()
    {
        this.collection.forEach( (item) => {item.remove()})
    }
}
