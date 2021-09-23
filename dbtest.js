const generateRandomNumber = (min, max) =>  {
  return Math.floor(Math.random() * (max - min) + min);
};

var i = 0;
var num = 0;
var non = 0;

while(i < 5){
    non = non + 1;
    num = generateRandomNumber(1, 100);
    if(num == 50){
        i = i + 1;
    }
}