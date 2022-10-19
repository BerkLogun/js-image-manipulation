const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
const image1 = new Image();

// Convert image to Base64 format

function encodeImageFileAsURL(){
    var selectedImage = document.getElementById('inputFileToLoad').files;

    if(selectedImage.length > 0){
        var fileToLoad = selectedImage[0];
        var fileReader = new FileReader();

        fileReader.onload = function(fileLoadedEvent){
            srcData = fileLoadedEvent.target.result;
            image1.src = srcData;
        }
        fileReader.readAsDataURL(fileToLoad);
    }



}


const inputSlider = document.getElementById('resolution');
const inputLabel = document.getElementById('inputLabel');

inputSlider.addEventListener('change', handleSlider);

// Class for each individual cell to scale the Ascii image

class Cell {
    constructor(x, y, symbol, color) {
        this.x = x;
        this.y = y;
        this.symbol = symbol;
        this.color = color;
    }

    draw(ctx){
        ctx.fillStyle = 'white';
        ctx.fillText(this.symbol, this.x+0.2, this.y+0.2);
        ctx.fillStyle = this.color;
        ctx.fillText(this.symbol, this.x, this.y);
    }
}


class AsciiEffect {
    #imageCellArray = [];
    #pixels = [];
    #ctx;
    #width;
    #height;

    constructor(ctx, width, height) {
        this.#ctx = ctx;
        this.#width = width;
        this.#height = height;
        this.#ctx.drawImage(image1, 0, 0, this.#width, this.#height);
        this.#pixels = this.#ctx.getImageData(0, 0, this.#width, this.#height);
        console.log(this.#pixels.data);
    }

    #convertToSymbol(avg) {
        if(avg >= 250) return '@';
        else if(avg > 220) return '%';
        else if(avg > 190) return '#';
        else if(avg > 160) return '*';
        else if(avg > 130) return '+';
        else if(avg > 100) return '=';
        else if(avg > 70) return '-';
        else if(avg > 40) return ':';
        else if(avg > 10) return '.';
        else return '';

    }


    #scanImage(cellSize) {
        this.#imageCellArray = [];
        for(let y = 0; y < this.#pixels.height; y += cellSize) {
            for(let x = 0; x < this.#pixels.width; x += cellSize) {
                const posX = x * 4;
                const posY = y * 4;
                const pos = (posY * this.#pixels.width) + posX;

                if(this.#pixels.data[pos+3] > 128){
                    const r = this.#pixels.data[pos];
                    const g = this.#pixels.data[pos+1];
                    const b = this.#pixels.data[pos+2];
                    const total = r + g + b;
                    const avg = total / 3;
                    const color = `rgb(${r},${g},${b})`;
                    const symbol = this.#convertToSymbol(avg);
                    this.#imageCellArray.push(new Cell(x,y,symbol,color));

                }
            }
        }
        console.log(this.#imageCellArray);
    }

    #drawAscii(){
        this.#ctx.clearRect(0, 0, this.#width, this.#height);
        for(let i = 0; i < this.#imageCellArray.length; i++){
            this.#imageCellArray[i].draw(this.#ctx);
        }
    }

    draw(cellSize){
        this.#scanImage(cellSize);
        this.#drawAscii();
    }
}

let effect;

function handleSlider(){
    if(inputSlider.value == 1){ 
        inputLabel.innerHTML = 'original image';
        ctx.drawImage(image1, 0, 0, image1.width, image1.height);
    }else {
        inputLabel.innerHTML ='Resolution: ' + inputSlider.value + 'px';
        ctx.font = parseInt(inputSlider.value) * 1.5 + 'px Verdana';
        effect.draw(parseInt(inputSlider.value));
    }
}

image1.onload = function initialize(){
    canvas.width = image1.width;
    canvas.height = image1.height;
    effect = new AsciiEffect(ctx, image1.width, image1.height);
    HandleSlider();


}

