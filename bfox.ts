/*
Copyright (c) 2015 darkf

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

class VM {
	code: string;
	input: string;
	output: string;

	ip: number;
	dataPtr: number;
	inputPtr: number;
	numCells: number;
	tape: Int32Array;

	constructor(numCells: number) {
		this.numCells = numCells;
		this.reset();
	}

	reset() {
		this.tape = new Int32Array(this.numCells);
		this.ip = 0;
		this.dataPtr = 0;
		this.inputPtr = 0;
		this.input = "";
		this.output = "";
	}

	setInput(input: string) {
		this.input = input;
	}

	load(code: string) {
		this.code = code.split("").filter(function(c) { return "[]+-<>,.".indexOf(c) !== -1; }).join("");;
	}

	exec(ch: string) {
		switch(ch) {
			case '+':
				this.tape[this.dataPtr]++;
				break;
			case '-':
				this.tape[this.dataPtr]--;
				break;
			case '.':
				this.output += String.fromCharCode(this.tape[this.dataPtr]);
				break;
			case ',':
				if(this.inputPtr >= this.input.length)
					this.tape[this.dataPtr] = 0;
				else
					this.tape[this.dataPtr] = this.input[this.inputPtr++].charCodeAt(0);
				break;
			case '>':
				this.dataPtr++;
				break;
			case '<':
				this.dataPtr--;
				break;
			case '[':
				if(this.tape[this.dataPtr] === 0) {
					// jump to matching ]
					var balance = 1
					for(var i = this.ip; i < this.code.length; i++) {
						if(this.code[i] === '[')
							balance++;
						else if(this.code[i] === ']') {
							balance--;

							if(balance === 0) {
								this.ip = i + 1;
								break;
							}
						}
					}
				}
				break;
			case ']':
				// jump to matching [
				var balance = 1
				for(var i = this.ip - 2; i >= 0; i--) {
					if(this.code[i] === '[') {
						balance--;

						if(balance === 0) {
							this.ip = i;
							break;
						}
					}
					else if(this.code[i] === ']') {
						balance++;
					}
				}
				break;

			default:
				//console.log("ignored " + ch);
				break;
		}
	}

	step() {
		if(this.ip >= this.code.length)
			return false

		this.exec(this.code[this.ip++]);

		return true
	}

	run() {
		while(this.step()) { }
	}
}