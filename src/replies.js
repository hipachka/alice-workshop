/**
 * Приветственное сообщение при входе в навык.
 */
exports.welcome = () => {
  const greeting = getRandomElement(['Здарова', 'Братишка', 'Привяу']);
  return {
    text: `${greeting}. Я Суслик твой учитель математики. Начинаем урок?`,
    tts: `<speaker audio="alice-music-harp-1.opus">${greeting}. Я ваш новый учитель математики. Начинаем урок?`,
    buttons: [
      { title: 'Начинаем', hide: true },
    ],
    end_session: false
  };
};

const ops = {
  '+': function(a, b) { return +a + +b; },
  '-': function(a, b) { return a - b; },
  '*': function(a, b) { return a * b; },
  '/': function(a, b) { return a / b; }
};

/**
 * Первый вопрос пользователю.
 *
 * @param {Number} number1
 * @param {Number} number2
 */
exports.firstQuestion = ({ number1, number2, delimiter }) => {

  return {
    text: `Сколько будет ${number1} ${delimiter} ${number2} = ?`,
    tts: `Сколько будет ${getTextQuestion(number1,number2,delimiter)}`,
    buttons: [capitulateButton],
    end_session: false
  };
};

/**
 * Реакция на неправильный ответ.
 *
 * @param {Number} number1
 * @param {Number} number2
 */
exports.incorrectAnswer = ({ number1, number2, delimiter }) => {
  const no = getRandomElement(['Неверно', 'Неправильно', 'Нет']);

  return {
    text: `${no}. Попробуй еще раз: ${number1} ${delimiter} ${number2} = ?`,
    tts: `${no}. Попробуй еще раз: ${getTextQuestion(number1,number2,delimiter)}`,
    buttons: [capitulateButton],
    end_session: false
  };
};

/**
 * Реакция на правильный ответ.
 *
 * @param {Number} number1
 * @param {Number} number2
 */
exports.correctAnswer = ({ number1, number2, delimiter }) => {
  const yes = getRandomElement(['Молодя', 'Мальойня', 'Да', 'Здорово']);

  return {
    text: `${yes}! Следующий вопрос: ${number1} ${delimiter} ${number2} = ?`,
    tts: `<speaker audio="alice-sounds-human-crowd-6.opus">${yes}! Следующий вопрос: ${getTextQuestion(number1,number2,delimiter)}`,
    buttons: [capitulateButton],
    end_session: false
  };
};

/**
 * Реакция на "сдаюсь".
 *
 * @param {Number} answer
 * @param {Number} number1
 * @param {Number} number2
 */
exports.capitulate = (answer, { number1, number2, delimiter }) => {

  return {
    text: `Правильный ответ ${answer}. Задам другой пример: ${number1} ${delimiter} ${number2} = ?`,
    tts: `<speaker audio="alice-sounds-game-loss-3.opus">Правильный ответ ${answer}. Задам другой пример: ${getTextQuestion(number1,number2,delimiter)}`,
    buttons: [capitulateButton],
    end_session: false
  };
};

const capitulateButton = {
  title: 'Сдаюсь', hide: true
};

function getRandomElement(arr) {
  const index = Math.floor(Math.random() * arr.length);
  return arr[index];
}


function getTextQuestion(number1, number2, delimiter) {

  if(delimiter === '*'){
    delimiter = 'умножить на';
  }

  return number1 + delimiter + number2;
}

