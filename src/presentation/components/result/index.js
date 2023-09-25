//Здесь будет собираться весь визуал для вывода результата: 1) изображение 2) инфо-бокс 3) кнопка "Try again"
//Стили
import "./styles.scss";

//Компоненты
import { getCharacter } from "../../../infrastructure/getCharacter";
import { Image } from "../../ui-kit/image";
import { Button } from "../../ui-kit/button";
import { InfoBox } from "../info-box";
import { ErrorMsg } from "../error-msg";

//Изображения
import errorImage from "../../../assets/img/error-img.gif";
import resultImage from "../../../assets/img/result-img.png";

class Result {
  #resultInfo;

  constructor() {
    //Создаём главный див-обёртку для всей информации, добавляемой с помощью скрипта. Мы его приклеим в основном index.js в наш див "wrapper", который лежит в шаблоне public/index.html.
    this.wrapper = document.createElement("div");
    this.wrapper.className = "populate";
    this.wrapper.setAttribute("id", "result-container");
  }

  //Метод, который будет получать новый объект персонажа из API и перерисовывать содержание главного дива-обёртки
  updateInfo = async () => {
    this.#resultInfo = await getCharacter();

    this.render();
  };

  render() {
    //Очищаем наполнение при каждом новом запуске рендера
    this.wrapper.innerHTML = "";

    //Если пока нет данных персонажа, возвращяем пустой див-обёртку. Например, при первой загрузке страницы мы приклеим этот див пустым, и положим в него изначальные изображение с кнопкой в основном index.js
    if (!this.#resultInfo)
      return this.wrapper;

    //Если получаем информацию о персонаже
    if (this.#resultInfo.name) {
      //Создаём изображение персонажа из полученного ранее объекта
      const characterImage = new Image(this.#resultInfo.image, "character-img");

      //Создаём рамку с информацией о персонаже. Если добавим ещё свойств, нужно будет добавить их здесь в конструктор
      const characterInfoBox = new InfoBox(
        this.#resultInfo.name,
        this.#resultInfo.house,
        this.#resultInfo.species,
        this.#resultInfo.ancestry,
        this.#resultInfo.yearOfBirth,
        this.#resultInfo.actor
      );

      const resultImageElement = new Image(resultImage, "result-img");

      //Добавляем изображение, рамку с инфой и новую кнопку в главный див-обёртку
      this.wrapper.appendChild(characterImage.render());
      this.wrapper.appendChild(characterInfoBox.render());
      this.wrapper.appendChild(resultImageElement.render());
      this.wrapper.appendChild(new Button(this.updateInfo, "TRY AGAIN").render());
    }
    //Если получаем ошибку
    else if (this.#resultInfo.message) {
      //Создаём рамку с информацией об ошибке
      const errorInfoBox = new ErrorMsg(this.#resultInfo.message);

      //Создаём изображение для сообщения об ошибке
      const errorImageElement = new Image(errorImage, "error-img");

      //Добавляем рамку с инфой, изображение и новую кнопку в главный див-обёртку
      this.wrapper.appendChild(errorInfoBox.render());
      this.wrapper.appendChild(errorImageElement.render());
      this.wrapper.appendChild(new Button(this.updateInfo, "TRY AGAIN").render());
    }
    //Если ещё что-то не так
    else {
      //Создаём рамку с информацией об ошибке
      const errorInfoBox = new ErrorMsg("Some weird error, we are not sure...");

      //Создаём изображение для сообщения об ошибке
      const errorImageElement = new Image(errorImage, "error-img");

      //Добавляем рамку с инфой, изображение и новую кнопку в главный див-обёртку
      this.wrapper.appendChild(errorInfoBox.render());
      this.wrapper.appendChild(errorImageElement.render());
      this.wrapper.appendChild(new Button(this.updateInfo, "TRY AGAIN").render());
    }

    return this.wrapper;
  }
}

export { Result };