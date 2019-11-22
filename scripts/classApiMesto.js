'use strict';

class ApiMesto
{
    //IP = undefined;             // IP-адрес сервера
    //cohortId = undefined;       // Идентификатор потока
    auth = undefined;           // Токен
    userInfoURL = undefined;        // URL для запросов данных пользователя
    itemCollectionURL = undefined;  // URL для запросов набора карточек
    //baseSettings = undefined;       // Объект с настойками запроса

    constructor(ip, cohort, auth)
    {
        //this.IP = ip;
        //this.cohortId = cohort;
        this.auth = auth;
        this.userInfoURL = `http://${ip}/${cohort}/users/me`;
        this.itemCollectionURL = `http://${ip}/${cohort}/cards`;
    }

    // Внутренний метод для отправки запросов
    sendRequest(URL, method = 'GET', content = undefined)
    {
        // Формируем настройку отправки
        const settings = {
            method: method,
            headers:
            {
                authorization: this.auth,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(content)
        };
        
        // Создаём промис, в котором инициируем запрос

        /*
            Можно лучше: 
            Делать new Promise((resolve, reject) здесь не обязательно 
            можно записать немного короче так:
            return fetch(URL, settings)
                .then((res) => {
                    if (res.ok) return res.json();
                    return Promise.reject(`Error: ${res.status}`);
                })
                .catch((err) => {
                    console.log('Request failed: ', err);
                    return Promise.reject(err);
                });
        */

        const prom = new Promise((resolve, reject) => {
            fetch(URL, settings)
                .then((res) => {
                    if(res.ok)
                        return res.json();
                    return Promise.reject(`Error: ${res.status}`);
                })
                .then((data) => {
                    resolve(data);
                })
                .catch((err) => {
                    console.log('Request failed: ', err);
                    reject(err);
                });
        });

        // Возвращаем промис
        return prom;
    }

    // Метод отправки запроса для получения данных пользователя
    getUserInfo()
    {
        return this.sendRequest(this.userInfoURL);
    }

    // Метод отправки запроса для обновления данных пользователя
    setUserInfo(name, about)
    {
        const data = {name, about};
        return this.sendRequest(this.userInfoURL, 'PATCH', data);
    }

    // Метод отправки запроса на получение набора карточек
    getItems()
    {
        return this.sendRequest(this.itemCollectionURL);
    }

    // Метод добавления карточки на сервер
    uploadCard(name, link)
    {
        const data = {name, link};
        return this.sendRequest(this.itemCollectionURL, 'POST', data);
    }

    // Метод удаления карточки с сервера по идентификатору
    deleteCard(id)
    {
        return this.sendRequest(this.itemCollectionURL + '/' + id, 'DELETE');
    }

    like(status, id)
    {
        if(status)
            return this.sendRequest(this.itemCollectionURL + '/like/' + id, 'DELETE');
        else
            return this.sendRequest(this.itemCollectionURL + '/like/' + id, 'PUT');
    }

    updateAvatar(avatar)
    {
        const data = {avatar};
        return this.sendRequest(this.userInfoURL + '/avatar', 'PATCH', data);
    }

}