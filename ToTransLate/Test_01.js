console.log("테스트 입니다!");

function greet(name) {
    return `안녕하세요, ${name}!`;
}

const greeting = greet("테스트");
console.log(greeting);

const messages = {
    welcome: "어서오세요!",
    goodbye: "안녕히가세요!",
    thankYou: "감사합니다!"
};

console.log(messages.welcome);
console.log(messages.goodbye);
console.log(messages.thankYou);