import data from './data.js'

let numberLaby = '6'
let numberEx = 'ex-1'
let position = 0;
let firstLab = data[numberLaby][numberEx]
let x = firstLab[position].posX
let y = firstLab[position].posY
let visitedCells = [];
const parent = document.getElementById("labyrinthe")
parent.style.gridTemplateColumns = ("repeat(" + numberLaby + ", auto)");

function createLab() {
    for (let i = 0; i < firstLab.length; i++) {
        const cell = document.createElement("div")
        parent.appendChild(cell)
        const littleCell = document.createElement('div')
        cell.appendChild(littleCell);
        if (firstLab[i].walls[0]) {
            cell.classList.add('top')
        }
        if (firstLab[i].walls[1]) {
            cell.classList.add('right')
        }
        if (firstLab[i].walls[2]) {
            cell.classList.add('bottom')
        }
        if (firstLab[i].walls[3]) {
            cell.classList.add('left')
        }
        if (firstLab[i].entrance) {
            cell.classList.add('entrance', 'player')
        }
        if (firstLab[i].exit) {
            cell.classList.add('end')
        }
        cell.id = i;
    }
}

let previousPos = position;

function getPos(x, y) {
    for (let j = 0; j < firstLab.length; j++) {
        if (firstLab[j].posX === x && firstLab[j].posY === y) {
            return j;
        }
    }
}

function changePosition() {
    if (!firstLab[position].walls[0] && !visitedCells.includes(getPos(x, y - 1))) {
        y -= 1;
    } else if (!firstLab[position].walls[1] && !visitedCells.includes(getPos(x + 1, y))) {
        x += 1;
    } else if (!firstLab[position].walls[2] && !visitedCells.includes(getPos(x, y + 1))) {
        y += 1;
    } else if (!firstLab[position].walls[3] && !visitedCells.includes(getPos(x - 1, y))) {
        x -= 1;
    }

    document.getElementById(position).classList.remove("player");
    visitedCells.push(position);
    document.getElementById(position).classList.add("visited");

    position = getPos(x, y);

    document.getElementById(position).classList.add("player");
}

createLab();
while (!document.getElementById(position).classList.contains("end")) {
    changePosition();
}