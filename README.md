# Mesto
Учебный проект "Mesto"


### Шпаргалка по работе с Webpack

##### Установка сборщика (Webpack)

`npm init` - **добаляет дефолтный конфигурационный файл package.json**
`npm i webpack --save-dev` - **устанавливает  пакет webpack в проект, записывает его в зависимости для разработки
`npm i webpack-cli --save-dev` - **устанавливает пакет интерфейса командной строки для webpack'а**
`npm i webpack-dev-server --save-dev` - **устанавливает пакет локального сервера**

##### Установка транспилятора (Babel)

`npm i babel-loader --save-dev` - **устанавливает пакет транспилятора**

Дополнительные пакеты для работы с транспилятором:

`npm i @babel/cli --save-dev`
`npm i @babel/core --save-dev`
`npm i @babel/preset-env --save-dev`
`npm i core-js@3.4.1 --save`

`npm install --save babel-polyfill` - **устанавливает полифилы для транспилятора**

##### Установка минификатора

`npm i mini-css-extract-plugin --save-dev` - **устанавливает пакет минификатора**
`npm i css-loader --save-dev` - **устанавливает пакет CSS-загрузчика**

##### Установка "горячей" перезагрузки

`npm i webpack-md5-hash --save-dev` - **устанавливает пакет подсчёта хеша**

##### Установка обработчика CSS-загрузчика

`npm i postcss-loader --save-dev` - **устанавливает пакет подключения плагина PostCSS к Webpack'у**
`npm i autoprefixer --save-dev` - **установщик вендорных префиксов**
`npm i cssnano --save-dev` - **минификатор CSS**

##### Деплой

`npm install gh-pages --save-dev` - **выкладывает проект на gh-pages**

`npm install html-webpack-plugin`



