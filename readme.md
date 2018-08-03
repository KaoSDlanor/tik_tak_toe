# tik_tak_toe

### How To Execute
This example has been written in JavaScript using Node JS.

In order to execute this example please perform the following:
 * Install Node JS (Tested on v8.11.2 but should work on 6 onwards) from https://nodejs.org/en/download/
 * Ensure that the install directory for Node JS is in your PATH environment variable (if you opted for an installer this should be the case)
 * Re-launch your command interpreter if it is already running to ensure it has the updated environment
 * Navigate to the folder which contains this file in your command interpreter
 * Execute "node.exe ." (without the parenthesis)

### Assumptions Made
 * A recursive game loop function is required to simplify the game 

This is something that I need to be careful with because JavaScript has a maximum call stack so if our game loop calls itself too many times it will eventually crash

I have chosen to code the game so that it prompts for a new game after a player wins because it forces me to use good practice when initializing my state (the initialization code must be separate and reliable so I can call it again later) and utilizing it (I cannot create permanent additional references to parts of the state because they will desync if I set a new state) but this also requires me to ensure that I reset the call stack

I reset the call stack by calling built in asyncronous functions and to be doubly sure I use process.nextTick to call the game loop function (which calls it in a new stack once the current event loop is over)

 * The most efficient way to detect a winning game state is by storing the game state in a string (or converting it into one) and then using regular expressions to detect a string that represents a won game while at the same time detecting which player has won

The primary drawback to using RegEx is the fact that its readability is inherently low which also impacts the maintainability of your application

I have attempted to combat this drawback by using a separate RegEx check for each win condition defined in the challenge rather than a single long expression and by including comments indicating exactly what each expression is intended to match

### Disadvantages To The Chosen Approach
In this example I have chosen to work with JavaScript because it is the language I am the most familiar with however I confess that it is not the ideal choice because Node JS is not designed with console applications in mind. I could have created a web application but that would be needlessly complicated as web applications exist for their friendly GUI and designing a console would defeat the purpose