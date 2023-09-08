const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let canvasWidth = 400; // Default canvas width
let canvasHeight = 400; // Default canvas height

if (/Mobi|Android/i.test(navigator.userAgent)) {
    // If user is on a mobile device, adjust canvas size
    canvasWidth = window.innerWidth;
    canvasHeight = window.innerHeight;
}

canvas.width = canvasWidth;
canvas.height = canvasHeight;

const character = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    width: 30,
    height: 30,
};

const objectTypes = {
    beansField: "beansField",
    waterWell: "waterWell",
    grinder: "grinder",
    coffeePot: "coffeePot",
};

const objects = [
    createRandomObject(objectTypes.beansField),
    createRandomObject(objectTypes.waterWell),
    createRandomObject(objectTypes.grinder),
    createRandomObject(objectTypes.coffeePot),
];

const winningConditions = {
    beansField: false,
    waterWell: false,
    grinder: false,
    coffeePot: false,
};

const taskInstructions = {
    beansField: "You've harvested coffee beans! Now, go fetch some water.",
    waterWell: "You've fetched water! Time to grind the coffee beans.",
    grinder: "You've ground the coffee beans! Brew some coffee in the coffee pot.",
    coffeePot: "Congratulations! You've brewed coffee and won the game!",
};

const instructionText = document.createElement("div");
instructionText.style.position = "absolute";
instructionText.style.top = "20px";
instructionText.style.left = "50%";
instructionText.style.transform = "translateX(-50%)";
instructionText.style.fontSize = "20px";
instructionText.style.fontWeight = "bold";
instructionText.style.textAlign = "center";
instructionText.style.width = "100%";
instructionText.textContent = "Thirsty? Go harvest some beans🫘"; // Set initial text
document.body.appendChild(instructionText);

function updateInstructions(taskType) {
    instructionText.textContent = taskInstructions[taskType];
}

function gameLoop() {
    clearCanvas();
    drawCharacter();
    drawObjects();
    checkCollisions();
    requestAnimationFrame(gameLoop);
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function drawCharacter() {
    ctx.fillStyle = "blue";
    ctx.fillRect(character.x, character.y, character.width, character.height);
}

function drawObjects() {
    for (const obj of objects) {
        // Draw object icon
        const img = document.getElementById(obj.type);
        ctx.drawImage(img, obj.x, obj.y, obj.width, obj.height);

        // Draw object label
        ctx.font = "12px Arial";
        ctx.fillStyle = "black";
        ctx.fillText(objectTypes[obj.type], obj.x, obj.y - 5);
    }
}

function checkCollisions() {
    for (const obj of objects) {
        if (
            character.x < obj.x + obj.width &&
            character.x + character.width > obj.x &&
            character.y < obj.y + obj.height &&
            character.y + character.height > obj.y
        ) {
            handleCollision(obj);
            break;
        }
    }
}

function handleCollision(obj) {
    switch (obj.type) {
        case "beansField":
            if (!obj.harvested) {
                obj.harvested = true;
                winningConditions.beansField = true;
                updateInstructions(obj.type);
            }
            break;
        case "waterWell":
            if (!obj.fetchedWater && winningConditions.beansField) {
                obj.fetchedWater = true;
                winningConditions.waterWell = true;
                updateInstructions(obj.type);
            }
            break;
        case "grinder":
            if (!obj.groundBeans && winningConditions.waterWell) {
                obj.groundBeans = true;
                winningConditions.grinder = true;
                updateInstructions(obj.type);
            }
            break;
        case "coffeePot":
            if (!obj.brewedCoffee && winningConditions.grinder) {
                obj.brewedCoffee = true;
                winningConditions.coffeePot = true;
                updateInstructions(obj.type);
                checkWinCondition();
            }
            break;
    }
}

function showTaskInstruction(taskType) {
    const instruction = taskInstructions[taskType];
    alert(instruction);
}

function checkWinCondition() {
    const win = Object.values(winningConditions).every((condition) => condition);
    if (win) {
        alert("You've won the game! You made coffee!");
        resetGame();
    }
}

function resetGame() {
    for (const obj of objects) {
        obj.harvested = false;
        obj.fetchedWater = false;
        obj.groundBeans = false;
        obj.brewedCoffee = false;
    }

    winningConditions.beansField = false;
    winningConditions.waterWell = false;
    winningConditions.grinder = false;
    winningConditions.coffeePot = false;

    shuffleObjects();
}

function createRandomObject(type) {
    const width = 50;
    const height = 50;
    const x = Math.random() * (canvas.width - width);
    const y = Math.random() * (canvas.height - height);
    return { x, y, width, height, type, harvested: false, fetchedWater: false, groundBeans: false, brewedCoffee: false };
}

function shuffleObjects() {
    objects.sort(() => Math.random() - 0.5);
}

document.addEventListener("keydown", (e) => {
    const speed = 5;
    switch (e.key) {
        case "ArrowUp":
            if (character.y > 0) character.y -= speed;
            break;
        case "ArrowDown":
            if (character.y < canvas.height - character.height) character.y += speed;
            break;
        case "ArrowLeft":
            if (character.x > 0) character.x -= speed;
            break;
        case "ArrowRight":
            if (character.x < canvas.width - character.width) character.x += speed;
            break;
    }
});

let touchStartX = 0;
let touchStartY = 0;

canvas.addEventListener("touchstart", (e) => {
    e.preventDefault();
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
});

canvas.addEventListener("touchmove", (e) => {
    e.preventDefault();
    const touchX = e.touches[0].clientX;
    const touchY = e.touches[0].clientY;
    
    const deltaX = touchX - touchStartX;
    const deltaY = touchY - touchStartY;
    
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX > 0 && character.x < canvas.width - character.width) {
            character.x += 5; // Adjust the speed as needed
        } else if (deltaX < 0 && character.x > 0) {
            character.x -= 5; // Adjust the speed as needed
        }
    } else {
        if (deltaY > 0 && character.y < canvas.height - character.height) {
            character.y += 5; // Adjust the speed as needed
        } else if (deltaY < 0 && character.y > 0) {
            character.y -= 5; // Adjust the speed as needed
        }
    }
});

shuffleObjects(); // Shuffle objects initially
gameLoop();
