let dp = 0; // Data pointer

let memorySize = 16;
let memoryFormat = 0;
let memory = Array(memorySize).fill(0);

let loops = [];

let delay = 250;
let stop = false;

function reset() {
    dp = 0;
    datapointer.point(0);

    memory = Array(memorySize).fill(0);
    loops = [];
    for(let i = 0; i < memoryTape.children.length; ++i) {
        memoryTape.children[i].innerHTML = 0;
    }
    output.innerHTML = "<b>Output:</b> <br>";

    stop = false;
}

function interpret(input,ip,callStack) {
    const instruction = input[ip];

    switch(instruction) {
        case "+":
            memory[dp] = ++memory[dp] % 256;

            memoryTape.children[dp].innerHTML = memoryFormat ? memory[dp] : memory[dp].toString(16).toUpperCase();
            break;
        case "-":
            memory[dp] = (--memory[dp] + 256) % 256;

            memoryTape.children[dp].innerHTML = memoryFormat ? memory[dp] : memory[dp].toString(16).toUpperCase();
            break;
        case "<":
            dp = Math.max(--dp,0);

            datapointer.point(dp);
            break;
        case ">":
            dp = Math.min(++dp,memorySize - 1);

            datapointer.point(dp);
            break;
        case "[":
            if(!memory[dp]) {
                let brackets = 0;
                while(true) {
                    ip++;
                    if(input[ip] == "[") ++brackets;
                    else if(input[ip] == "]" && brackets) --brackets;
                    else if(input[ip] == "]" && !brackets) break;
                }
            } else loops.push(ip);
            break;
        case "]":
            if(!memory[dp]) loops.splice(-1);
            else ip = loops.slice(-1)[0];
            break;
        case ".":
            output.innerHTML += String.fromCharCode(memory[dp]);
            break;
    }

    if(delay >= 50) {
        editor.innerHTML = input;
        editor.innerHTML = editor.innerText.slice(0, ip) + editor.innerText[ip].bold() + editor.innerText.slice(ip + 1);
    }

    ++ip;
    if(ip < input.length && !stop) {
        ++callStack;
        if(delay) setTimeout(() => interpret(input,ip,callStack), delay);
        else if(callStack < 5000) interpret(input,ip,callStack);
        else {
            callStack = 0;
            setTimeout(() => interpret(input,ip,callStack));
        }
    } else {
        setTimeout(() => editor.innerHTML = input, delay);
    }
}

function start(input) {
    interpret(input,0,0);
}

