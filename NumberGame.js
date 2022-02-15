
target_num = 0
useable_nums = []
var modal = document.getElementById("myModal");;
var span = document.getElementsByClassName("close")[0];;

document.addEventListener('DOMContentLoaded', function() {
    target_num = Math.floor(Math.random() * 901+100);
    document.getElementById("target").innerHTML = target_num;

    num_displays = document.getElementsByClassName("grid-item");
    for(let i = 0; i < 5; i++){
    	R = Math.floor(Math.random() * 10) * 5+5;
    	useable_nums.push(R);
    	num_displays[i].innerHTML = R;
    }

}, false);


function solve(){
	eq = document.getElementById("equation").value;
	var regex = /\d+/g;
	var matches = eq.match(regex);
	
	useable_copy = useable_nums

	for(const match in matches){
		console.log(matches[match])
		if(!useable_copy.includes(parseInt(matches[match]))){
			console.log("Invalid number " + matches[match]);
			document.getElementById("error-text").innerHTML = "Invalid number " + matches[match];
			return;
		}
	}
	const result = parsePlusSeparatedExpression(eq, '+');

	congrats = document.getElementById("congratulations");
	if(Math.abs(result-target_num) == 0){
		congrats.innerHTML = "Wow you got it perfectly!"
		ocument.getElementById("modal-answer2").innerHTML = "";
	}else if(Math.abs(result-target_num) < 50){
		congrats.innerHTML = "So close!"
		document.getElementById("modal-answer2").innerHTML = "Which is " + Math.abs(result-target_num) + " away!";
	}else{
		congrats.innerHTML = "Wow you suck!"
		document.getElementById("modal-answer2").innerHTML = "Which is " + Math.abs(result-target_num) + " away!";
	}
	
	document.getElementById("modal-answer").innerHTML = "You got " + result + ".";

	modal.style.display = "block";
}

// split expression by operator considering parentheses
const split = (expression, operator) => {
	const result = [];
	let braces = 0;
	let currentChunk = "";
	for (let i = 0; i < expression.length; ++i) {
		const curCh = expression[i];
		if (curCh == '(') {
			braces++;
		} else if (curCh == ')') {
			braces--;
		}
		if (braces == 0 && operator == curCh) {
			result.push(currentChunk);
			currentChunk = "";
		} else currentChunk += curCh;
	}
	if (currentChunk != "") {
		result.push(currentChunk);
	}
	return result;
};
// this will only take strings containing * operator [ no + ]
const parseMultiplicationSeparatedExpression = (expression) => {
	const numbersString = split(expression, '*');
	const numbers = numbersString.map(noStr => {
		if (noStr[0] == '(') {
			const expr = noStr.substr(1, noStr.length - 2);
			// recursive call to the main function
			return parsePlusSeparatedExpression(expr);
		}
		return +noStr;
	});
	const initialValue = 1.0;
	const result = numbers.reduce((acc, no) => acc * no, initialValue);
	return result;
};
// both * -
const parseMinusSeparatedExpression = (expression) => {
	const numbersString = split(expression, '-');
	const numbers = numbersString.map(noStr => parseMultiplicationSeparatedExpression(noStr));
	const initialValue = numbers[0];
	const result = numbers.slice(1).reduce((acc, no) => acc - no, initialValue);
	return result;
};
// * - + 
const parsePlusSeparatedExpression = (expression) => {
	const numbersString = split(expression, '+');
	const numbers = numbersString.map(noStr => parseMinusSeparatedExpression(noStr));
	const initialValue = 0.0;
	const result = numbers.reduce((acc, no) => acc + no, initialValue);
	return result;
};

window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}