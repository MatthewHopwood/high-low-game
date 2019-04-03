var GameCanvas;
var ctx;
var Cards = [];
var Buttons = [];
var currentIndex = 0;
var GameMode = 'ingame';
var Won = false;
var allowInput = true;

function Card(x, y)
{
    this.x = x;
    this.y = y;
    this.value = 0;
    this.width = 90;
    this.height = 100;
    this.number = 1 + Math.random() * 9.99 | 0;
    this.shown = false;
    this.update = function()
    {
        this.draw();
    }
    this.draw = function()
    {
        ctx.fillStyle = 'rgb(0, 150, 255)';
        ctx.fillRect(this.x, this.y, this.width, this.height);

        if (this.shown)
        {        
            ctx.font = '40px Arial';
            ctx.textAlign = 'center';
            ctx.fillStyle = 'rgb(0, 0, 0)';
            ctx.fillText(this.number, this.x + this.width / 2, this.y + this.height / 1.5);
        }    
    
    }
    this.show = function()
    {
        this.shown = true;
    }
    Cards.push(this);
}

function Button(x, y, colour, higher)
{
    this.x = x;
    this.y = y;
    this.higher = higher;
    this.touched = false;
    this.width = 300;
    this.height = 150;
    this.colour = colour;
    this.update = function()
    {
        this.draw();
    }
    this.draw = function()
    {
        ctx.fillStyle = this.colour;
        ctx.fillRect(this.x, this.y, this.width, this.height);

        if(!this.higher)
        {
            ctx.font = '60px Arial';
            ctx.textAlign = 'center';
            ctx.fillStyle = 'rgb(255, 255, 255)';
            ctx.fillText('Lower', this.x + this.width / 2, this.y + this.height / 1.5);
        }
        else
        {
            ctx.font = '60px Arial';
            ctx.textAlign = 'center';
            ctx.fillStyle = 'rgb(255, 255, 255)';
            ctx.fillText('Higher', this.x + this.width / 2, this.y + this.height / 1.5);
        }
    }

    //checking to see if clicked position is within the parameters.

    this.isTouched = function(x, y)
    {
        if (x > this.x && x < this.x + this.width && y > this.y && y < this.y + this.height)
        {
            return true;
        }
        else 
        {
            return false;
        }
    }
    this.Touched = function()
    {
        if (allowInput == true)
        {
            TakeTurn(this.higher);
        }
        else
        {
            return;
        }
    }
    Buttons.push(this);
}

function TakeTurn(higherPressed)
{
    Cards[currentIndex].show();

    if (currentIndex > 0)
    {
        if (higherPressed)
        {
            if (Cards[currentIndex].number <= Cards[currentIndex - 1].number)
            {
               GameOver();
               allowInput = false;
                return;
            }
        }
        else
        {
            if (Cards[currentIndex].number >= Cards[currentIndex - 1].number)
            {
                GameOver();
                allowInput = false;
                 return;
            }
        }
    }

    currentIndex++;

    if (currentIndex == Cards.length)
    {
       GameOver();
       Won = true;
    }
}
function StartGame()
{
    GameCanvas = document.getElementById('game_canvas');
    ctx = GameCanvas.getContext('2d');

    window.addEventListener('click', MouseClick, true);

    for (var x = 100; x < 8 * 100 + 100; x += 100)
    {
        new Card(x, 100);
    }

    for (var t = 0; t < Cards.length - 1; t++)
    {
        if (Cards[t].number == Cards[t+1].number)
        {
            Cards[t].number = 1 + Math.random() * 9.99 | 0;
        }
    }

    TakeTurn();

    Buttons[0] = new Button(100, 350, 'rgb(0, 0 ,255)', false);
    Buttons[1] = new Button(600, 350, 'rgb(255, 0, 0)', true);


    MainLoop();
}

function restartGame()
{
    Cards = [];
    Buttons = [];
    currentIndex = 0;
    GameMode = 'ingame';
    Won = false;
    allowInput = true;
    StartGame();
}

$("#restart").on("click", function() {
    restartGame();
})


function MouseClick(Event)
{
    var x = Event.layerX;
    var y = Event.layerY;

    for (var t = 0; t < Buttons.length; t++)
    {
        if (Buttons[t].isTouched(x, y))
        {
            Buttons[t].Touched();
        }
    }
}

function GameOver()
{
    GameMode = 'GameOver';

    if (Won)
    {
        ctx.font = '100px Arial';
        ctx.fillStyle = 'rgb(0, 0, 0)';
        ctx.fillText('You Win!', 500, 320);
    }
    else
    {
        ctx.font = '100px Arial';
        ctx.fillStyle = 'rgb(0, 0, 0)';
        ctx.fillText('You Lose!', 500, 320);
    }
}

function MainLoop()
{
    ctx.clearRect(0, 0, 1000, 600)

    if (GameMode == 'GameOver')
    {
        GameOver();
    }

    for (var t = 0; t < Cards.length; t++)
    {
        Cards[t].update();
    }

    for (var t1 = 0; t1 < Buttons.length; t1++)
    {
        Buttons[t1].update();
    }


    setTimeout(MainLoop, 16);
}

window.onload = function(e)
{
    console.log('Game Started');
    StartGame();
}