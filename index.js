import data from './data.js'

let numberLaby = '15'
let numberEx = 'ex-2'
// let lab = data[numberLaby][numberEx]
let positionXY = {"posX": 0, "posY": 0}

function createLab(k, j) {
    const parent = document.getElementById("labyrinthe")
    parent.style.gridTemplateColumns = ("repeat(" + k + ", auto)");
    let lab = data[k]["ex-" + j];
    for (let i = 0; i < lab.length; i++) {
        const cell = document.createElement("div")
        parent.appendChild(cell)
        if (lab[i].walls[0]) {
            cell.classList.add('top')
        }
        if (lab[i].walls[1]) {
            cell.classList.add('right')
        }
        if (lab[i].walls[2]) {
            cell.classList.add('bottom')
        }
        if (lab[i].walls[3]) {
            cell.classList.add('left')
        }
        if (lab[i].entrance) {
            cell.classList.add('entrance', 'player')
        }
        if (lab[i].exit) {
            cell.classList.add('end')
        }
        cell.id = i;
    }
    return lab;
}

// bouton pour BFS
document.querySelector("#BFS").addEventListener('click', function () {
    let selectValue = document.getElementById("case").value;
    let selectExo = document.getElementById("exo").value;
    let mymaze = createLab(selectValue, selectExo);
    let position = {"posX": 0, "posY": 0}
    BFS(mymaze, position)
});


// bouton pour DFS
document.querySelector("#DFS").addEventListener('click', function () {
    let selectValue = document.getElementById("case").value;
    let selectExo = document.getElementById("exo").value;
    let mymaze = createLab(selectValue, selectExo);
    let position = {"posX": 0, "posY": 0}
    DFS(mymaze, position)
});

document.querySelector("#reset").addEventListener('click', function(){
    clear();
    clearVisited();
});

function clear() {
    const parent = document.getElementById("labyrinthe");
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
    parent.style.gridTemplateColumns = "";
    positionXY = {"posX": 0, "posY": 0};
}

function clearVisited(){
    for (let i = 0; i < mymaze.length; i++) {
        mymaze[i].visited = false;
    }
}

function getPos(mymaze, x, y) {
    for (let j = 0; j < mymaze.length; j++) {
        if (mymaze[j].posX === x && mymaze[j].posY === y) {
            return j;
        }
    }
}

function display(mymaze, f) {
    let posID = getPos(mymaze, f.posX, f.posY)
    let elem = document.getElementById(posID)
    elem.style.backgroundColor = "red"
}

function displayAnother(mymaze, f) {
    let posID = getPos(mymaze, f.posX, f.posY)
    let elem = document.getElementById(posID)
    elem.style.backgroundColor = "grey"
}

function delay(delayInms) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(2);
        }, delayInms);
    });
}

// fonction pour récupérer les voisins
function findNeighbours(tableau, X, Y) {
    let position = {"posX": X, "posY": Y}
    let actualsquare = tableau.find(square => square.posX === position.posX && square.posY === position.posY);
    let voisin = []
    if (actualsquare.walls[0] === false) {
        tableau.find(square => square.posX === position.posX && square.posY === position.posY).visited = true;
        voisin.push(tableau.find(nextsquare => nextsquare.posY === actualsquare.posY - 1 && nextsquare.posX === actualsquare.posX))
    }
    if (actualsquare.walls[1] === false) {
        tableau.find(square => square.posX === position.posX && square.posY === position.posY).visited = true
        voisin.push(tableau.find(nextsquare => nextsquare.posX === actualsquare.posX + 1 && nextsquare.posY === actualsquare.posY))
    }
    if (actualsquare.walls[2] === false) {
        tableau.find(square => square.posX === position.posX && square.posY === position.posY).visited = true;
        voisin.push(tableau.find(nextsquare => nextsquare.posX === actualsquare.posX && nextsquare.posY === actualsquare.posY + 1))
    }
    if (actualsquare.walls[3] === false) {
        tableau.find(square => square.posX === position.posX && square.posY === position.posY).visited = true;
        voisin.push(tableau.find(nextsquare => nextsquare.posX === actualsquare.posX - 1 && nextsquare.posY === actualsquare.posY))
    }
    return voisin
}

// Fonction de résolution BFS
async function oldBFS(tab, start) {
    let finish = tab[tab.length - 1]
    let q = []
    tab.path = [];
    q.push(start)

    while (q.length !== 0) {
        let n = q.shift();
        tab.path.push(n);
        n.visited = true;

        await delay(300)
        await display(n)

        if (n === finish) {
            console.log(n)
            return tab.path
        }
        for (let w of findNeighbours(tab, n.posX, n.posY)) {
            if (w.visited === undefined) {
                q.push(w)
            }
        }
    }

}

async function BFS(tab, start) {
    // Get the finish cell from the tab array
    let finish = tab[tab.length - 1]
    // Create an empty queue
    let queue = []
    // Push the start cell to the queue
    let newTab = tab;
    newTab.path = [];
    queue.push(start)
    // While the queue is not empty
    while (queue.length > 0) {
        // Get the first cell in the queue
        let current = queue.shift()
        newTab.path.push(current);
        current.visited = true;

        await delay(20)
        await displayAnother(tab, current);
        // If the current cell is the finish cell, break the loop
        if (current === finish) {
            break
        }
        // Get the neighbours of the current cell
        let neighbours = findNeighbours(tab, current.posX, current.posY)
        // Iterate through each neighbour
        for (let i = 0; i < neighbours.length; i++) {
            // If the neighbour has not been visited
            if (!neighbours[i].visited) {
                // Mark the neighbour as visited
                neighbours[i].visited = true
                // Set the current cell as the neighbour's previous cell
                neighbours[i].prev = current
                // Push the neighbour to the queue
                queue.push(neighbours[i])
            }
        }
    }
    // Create an empty path array
    let path = []
    // Start with the finish cell
    let current = finish
    // Iterate until the current cell is the start cell
    while (current !== start) {
        // Push the current cell to the path array
        path.push(current)
        // Go to the current cell's previous cell
        current = current.prev
    }
    // Push the start cell to the path array
    path.push(start)
    // Reverse the path array
    path.reverse()
    // Iterate through the path array
    for (let i = 0; i < path.length; i++) {
        // Wait for 50ms
        await delay(50)
        console.log(path[i])
        // Color the current cell in green
        display(tab, path[i])
    }
}

// Fonction de résolution DFS
async function oldDFS(tab, start) {
    let finish = tab[tab.length - 1]
    let q = []
    tab.path = [];
    q.push(start)

    while (q.length !== 0) {
        let n = q.pop();
        tab.path.push(n);
        n.visited = true;
        await delay(300)
        display(n)

        if (n === finish) {
            console.log(n)
            return tab.path
        }
        for (let w of findNeighbours(tab, n.posX, n.posY)) {
            if (w.visited === undefined) {
                q.push(w)
            }
        }
    }
}

async function DFS(tab, start) {
    // Declare a variable 'finish' which is the last element of the 'tab' array.
    let finish = tab[tab.length - 1]
    // Declare a variable 'queue' which is an empty array, and push the 'start' position to it.
    let queue = []
    let newTab = tab;
    newTab.path = [];
    queue.push(start)

    // A while loop is used here, which will continue until the 'queue' is empty.
    while (queue.length > 0) {
        // The first element of the queue is popped and assigned to a variable called 'current'.
        let current = queue.pop();
        newTab.path.push(current);
        current.visited = true;

        await delay(10)
        await displayAnother(tab, current);
        // Check if 'current' is the finish cell, if yes it break the loop.
        if (current === finish) {
            break
        }
        // The 'findNeighbours(tab, current.posX, current.posY)' function is called to get the neighbours of the current cell
        let neighbours = findNeighbours(tab, current.posX, current.posY)
        // iterates through them.
        for (let i = 0; i < neighbours.length; i++) {
            // If a neighbour has not been visited before
            if (!neighbours[i].visited) {
                // it sets its 'visited' property to true
                neighbours[i].visited = true
                // and sets its 'prev' property to the current cell.
                neighbours[i].prev = current
                //Then it pushes the neighbour to the queue so that it can be processed in the next iteration of the while loop.
                queue.push(neighbours[i])
            }
        }
    }
    // Once the loop is finished, it creates an empty array called path
    let path = []
    // then it starts a new loop where it starts from the finish cell,
    let current = finish
    // and it goes through each cell's prev property until it reaches the start cell.
    while (current !== start) {
        //It pushes each cell to the path array in reverse order
        path.push(current)
        current = current.prev
    }
    path.push(start)
    path.reverse()
    console.log(path)
    // so that it starts with the start cell and ends with the finish cell.
    // Finally, it iterates through the path array
    for (let i = 0; i < path.length; i++) {
        // and for each cell, it calls the 'await delay(50)' function
        await delay(50)
        // with a delay of 50ms to pause the execution of the function
        // before calling the 'display(path[i])' function to color it in green.
        display(tab, path[i])
    }
}


// createLab();
// // (BFS(lab, positionXY))
// console.log(DFS(lab,positionXY))