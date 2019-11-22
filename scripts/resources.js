'use strict';

const initialCards = [  // Базовый набор карточек
    {
      name: 'Архыз',
      link: 'https://pictures.s3.yandex.net/frontend-developer/cards-compressed/arkhyz.jpg'
    },
    {
      name: 'Челябинская область',
      link: 'https://pictures.s3.yandex.net/frontend-developer/cards-compressed/chelyabinsk-oblast.jpg'
    },
    {
      name: 'Иваново',
      link: 'https://pictures.s3.yandex.net/frontend-developer/cards-compressed/ivanovo.jpg'
    },
    {
      name: 'Камчатка',
      link: 'https://pictures.s3.yandex.net/frontend-developer/cards-compressed/kamchatka.jpg'
    },
    {
      name: 'Холмогорский район',
      link: 'https://pictures.s3.yandex.net/frontend-developer/cards-compressed/kholmogorsky-rayon.jpg'
    },
    {
      name: 'Байкал',
      link: 'https://pictures.s3.yandex.net/frontend-developer/cards-compressed/baikal.jpg'
    },
    {
      name: 'Нургуш',
      link: 'https://pictures.s3.yandex.net/frontend-developer/cards-compressed/khrebet-nurgush.jpg'
    },
    {
      name: 'Тулиновка',
      link: 'https://pictures.s3.yandex.net/frontend-developer/cards-compressed/tulinovka.jpg'
    },
    {
      name: 'Остров Желтухина',
      link: 'https://pictures.s3.yandex.net/frontend-developer/cards-compressed/zheltukhin-island.jpg'
    },
    {
      name: 'Владивосток',
      link: 'https://pictures.s3.yandex.net/frontend-developer/cards-compressed/vladivostok.jpg'
     }
  ];

export const addPlaceFieldSet = [
    {
        placeholder: 'Название',
        source: undefined,
        checkList:
        {
            empty:      true,
            minLength:  2,
            maxLength:  30,
            url:        false
        }
    },
    {
        placeholder: 'Ссылка на картинку',
        source: undefined,
        checkList:
        {
            empty:      false,
            minLength:  -1,
            maxLength:  -1,
            url:        true
        }
    }
];

export const editProfileFieldSet = [
  {
      placeholder: '',
      source: document.querySelector('.user-info__name'),
      checkList:
      {
          empty:      true,
          minLength:  2,
          maxLength:  30,
          url:        false
      }
  },
  {
      placeholder: '',
      source: document.querySelector('.user-info__job'),
      checkList:
      {
          empty:      true,
          minLength:  2,
          maxLength:  30,
          url:        false
      }
  }
];