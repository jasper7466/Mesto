const presets = [
	[
		"@babel/env",
		{
			useBuiltIns: "usage", // эта настройка babel-polyfill, если стоит значение usage, то будут подставлятся полифилы для версий браузеров которые указали ниже.
			corejs: "3.4.1", // явно проставить версию corejs
			"targets":
			{ // указать цели, для полифилов
				"esmodules": true, // es модули 
				"ie": "11" // Internet Explorer 11
			}
		},
	],
];

module.exports = { presets };