// const labyrinthe = require('./labyrinthes.json')

import data from './data.js'

let numberLaby = '25'
let numberEx = 'ex-0'
console.log(data)

let firstLab = data[numberLaby][numberEx]
console.log(firstLab)
// console.log(labyrinthe[numberLaby][numberEx])

// Object.values(firstLab).forEach(function(item) {
//     console.log(item.posX)
// })

const parent = document.getElementById("labyrinthe")

Object.values(firstLab).forEach(function(item) {
    const cell = document.createElement('div')
    parent.appendChild(cell);
    // cell.setAttribute('class','cases')
        if (item.walls[0]){
            cell.classList.add('top')
        }
        if(item.walls[1]){
            cell.classList.add('right')
        }
        if(item.walls[2]){
            cell.classList.add('bottom')
        }
        if(item.walls[3]){
            cell.classList.add('left')
        }
        if(item.entrance){
            cell.classList.add('entrance')
        }
        if(item.exit){
            cell.classList.add('end')
        }
})