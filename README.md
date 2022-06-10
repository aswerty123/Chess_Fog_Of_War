# Chess_Fog_Of_War
GA SEI Project 1

### Objectives
To created a chess game ( Fog of War Variant) you can only see the squares that have your own pieces and its possible moves. so you can't see your opponent pieces unless it is your piece's line of sight (possible moves).

MVP is to recreate a physical chessboard that can move the pieces  anywhere in the chessboard.

### The technologies used
Created a PVP chess game using JS, HTML and CSS files.

### the approach taken
First Step: 
Generate a Chess Board with individual square div that have its own id i.e. a1, b1, etc. and span was included to physically show the div id on the element in the web. Double for loop was used to generate the checkerboard.

Second Step:
Generate the chess pieces(images) onto the chess board by appending it on the div based on its id using 2 object (object with the position number and piece type & object with the piece type and the piece image). each image have the piece-type attribute that state the color and the type of piece.

Third Step:
Create a function to update the current status of each square, if there is the chess piece on it  and what kind of pieces is on the square div. this information will be stored in an object within an object. the id will be the key name to retrieve the information easier.

Fourth Step:
Attached Event listeners to all of the squares and use e.currentTarget to manipulate the pieces on the chessboard. create different functions to add class names to the clicked, mouseeneter and mouseleave depending on the pieces that is on the div. will update the current status after every click.

Fifth Step:
Create function that stores only the possible moves for every pieces and store it in an object within an object. The function for the rook, bishop, queen (rook bishop), knight, king and pawn was made. this function will update the possible move every time either player made a move

function to showpossible move helps to show possible moves and the click function was ammended such that the player can only clicked on the selected piece to deselect it or have to click on the possible moves.

### Installation instructions
use Visual studio live go live extension to try out the chess game using the JS, HTML and CSS files.

### Unsolved problems

Have not yet created the function for check, checkmate, en passant, castling and conversion of pawn piece when it reaches the other side of the board. 

### Future considerations

Might come back to make a chess game of Fog of War Variant since it is possible since there is an object that shows the possible moves of every pieces each time any player make a move. so need to find a way to only show squares with white pieces and its possible move when it is white's turn and vice versa.

### Reference YouTube Video and Code
I used Tudor Todorescu chess code as reference for my code, you can check out his video in youtube and his code in github
 [I have coded Chess.com with JavaScript - YouTube](https://www.youtube.com/watch?v=aqNvMSuLuE0&t=4039s)
 [GitHub - tudorfis/chess](https://github.com/tudorfis/chess)
