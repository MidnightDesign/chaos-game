const TARGET_SIZE = 5;
const POINT_SIZE = 1;
const SPEED = 5;
const TARGETS = 3;
const TARGET_COLOR = 'green';
const POINT_COLOR = 'white';
const BACKGROUND_COLOR = 'black';

interface Vector {
    x: number;
    y: number;
}

interface Game {
    canvas: HTMLCanvasElement;
    currentPosition: Vector;
    targets: Vector[];
}

function createCanvas(document: Document) {
    const canvas = document.createElement('canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    document.body.appendChild(canvas);
    getContext(canvas).fillStyle = BACKGROUND_COLOR;
    getContext(canvas).fillRect(0, 0, canvas.width, canvas.height);
    return canvas;
}

const getContext = (() => {
    const contextMap = new WeakMap<HTMLCanvasElement, CanvasRenderingContext2D>();
    return (canvas: HTMLCanvasElement) => {
        if (!contextMap.has(canvas)) {
            const context = canvas.getContext("2d");
            if (context === null) {
                throw 'Unable to get context.';
            }
            contextMap.set(canvas, context);
        }
        const context = contextMap.get(canvas);
        if (context === undefined) {
            throw '';
        }
        return context;
    };
})();


const getRandomNumber = (() => {
    let numbers: Uint32Array;

    function generateNumbers() {
        const numbers = new Uint32Array(1024);
        crypto.getRandomValues(numbers);
        return numbers;
    }

    return (min = 0, max?: number) => {
        if (numbers === undefined || numbers.length === 0) {
            numbers = generateNumbers();
        }
        let number = numbers[0];
        numbers = numbers.slice(1);
        if (max !== undefined) {
            number %= max + 1 - min;
        }
        number += min;
        return number;
    };
})();

function getRandomCanvasCoordinates(canvas: HTMLCanvasElement) {
    const x = getRandomNumber(0, canvas.width);
    const y = getRandomNumber(0, canvas.height);
    return {x, y};
}

function drawRect(context: CanvasRenderingContext2D, position: Vector, size = 1) {
    const halfSize = size / 2;
    context.fillRect(position.x - halfSize, position.y - halfSize, size, size);
}

function createTargets(canvas: HTMLCanvasElement, number: number) {
    const targets: Vector[] = [];
    const context = getContext(canvas);
    context.fillStyle = TARGET_COLOR;
    for (let i = 0; i < number; i++) {
        const vector = getRandomCanvasCoordinates(canvas);
        targets.push(vector);
        drawRect(context, vector, TARGET_SIZE);
    }
    return targets;
}

function addPoint(game: Game) {
    const target = game.targets[getRandomNumber(0, game.targets.length - 1)];
    const nextPosition = {
        x: (target.x + game.currentPosition.x) / 2,
        y: (target.y + game.currentPosition.y) / 2,
    };
    drawRect(getContext(game.canvas), nextPosition, POINT_SIZE);
    game.currentPosition = nextPosition;
}

function step(game: Game) {
    for (let i = 0; i < SPEED; i++) {
        addPoint(game);
    }
    setTimeout(() => step(game), 0);
}

((document) => {
    const canvas = createCanvas(document);
    const targets = createTargets(canvas, TARGETS);
    const currentPosition = getRandomCanvasCoordinates(canvas);
    getContext(canvas).fillStyle = POINT_COLOR;
    step({canvas, currentPosition, targets});
})(document);
