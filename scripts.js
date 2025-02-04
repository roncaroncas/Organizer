let boardState = [];
let hideBoardState = [];

let gameContinuing = true
let totalBombs = 0

let xSize = 20
let ySize = 10

function includeHTMLforTopNav(){


  alert("Estou sendo executado! A")

  var divToModify = document.getElementbyId("topnav-placeholder")

  divToModify.in

  '<div id="topnav-placeholder"><span class="active" href="#home">Home</span><span href="#news">Friends</span><span href="#contact">Calendar</span><span style="float: right; text-align: right;">Profile</span></div>'

  alert("Estou sendo executado!")

  // Limpando a tabela antiga
  var table = document.getElementById("board");
  table.innerHTML = "";

  gameContinuing = true
  document.getElementById("resultado").textContent = "";
  
  //recriando tabela
  var row
  var cell

  for (let j=0; j<y; j++) {
    row = table.insertRow()
    for (let i=0; i<x; i++) {
      cell = row.insertCell();
      cell.id = i + "-" + j;
      cell.classList.add("clicavel");
      cell.setAttribute('onclick', "clickOnCell('" + cell.id + "')");
    } 
  }




}

function test(){
  window.alert("oi")
}

