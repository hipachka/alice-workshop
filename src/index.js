const micro = require('micro');
const replies = require('./replies');

const server = micro(async (req, res) => {
  const { request, session, state } = await micro.json(req);
  const sessionState = state && state.session || {};
  const response = session.new
    ? replies.welcome()
    : checkAnswer(sessionState, request.command);
  return {
    response,
    session_state: sessionState,
    version: '1.0'
  };
});


const ops = {
  '+': function(a, b) { return +a + +b; },
  '-': function(a, b) { return a - b; },
  '*': function(a, b) { return a * b; },
  '/': function(a, b) { return a / b; }
};


function checkAnswer(sessionState, command) {
  let question = sessionState.question;
  if (!question) {
    question = generateQuestion(sessionState);
    return replies.firstQuestion(question);
  }

  if (isCorrectAnswer(question, command)) {
    question = generateQuestion(sessionState);
    return replies.correctAnswer(question);
  }

  if (/сдаюсь/i.test(command)) {
    // const answer = question.number1 + question.number2;
    const answer = ops[question.delimiter](question.number1, question.number2);
    question = generateQuestion(sessionState);
    return replies.capitulate(answer, question);
  }

  return replies.incorrectAnswer(question);
}

function isCorrectAnswer(question, command) {

  const matches = command.match(/[0-9]+/);
  // const correctAnswer = question.number1 + question.number2;
  const correctAnswer = ops[question.delimiter](question.number1, question.number2);
  return matches && Number(matches[0]) === correctAnswer;
}

function generateQuestion(sessionState) {

  const questionAction = getRandomElement(
    ['+', '*']);

  const question = {
    number1: Math.ceil(Math.random() * 10),
    number2: Math.ceil(Math.random() * 10),
    delimiter: questionAction,
  };
  sessionState.question = question;
  return question;
}

const PORT = 3000;
server.listen(PORT, () => console.log(`Server started on http://localhost:${PORT}, tunnel: http://localhost:4040`));


function getRandomElement(arr) {
  const index = Math.floor(Math.random() * arr.length);
  return arr[index];
}
