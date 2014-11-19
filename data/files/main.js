/*
TODO:

Change behavior:
  -> Select subtitle:
    -> foreach PirateBay result div, add a subtitle result with the right parameter underneath
  -> Results from query update list of divs then divs are all reprinted

Parameters should look and update the folder where subtitles are saved

//*/


content = []

function deleteAllResults() {
   currentDiv = document.body.lastChild
   while (currentDiv.id != "cont2" && currentDiv.id != "cont1") {
      document.body.removeChild( currentDiv )
      currentDiv = document.body.lastChild
   }
}

function addAllResults() {
   for (var i = 0; i < content.length; i++) {
      document.body.appendChild( content[i].getDiv() );
   }
}

function update() {
   deleteAllResults();
   addAllResults();
}

function stdDiv(c) {
   cont = document.createElement("div");
   cont.className = "container";
   
   titleH = document.createElement("h2");
   cont.appendChild(titleH);
   
   statusH = document.createElement("h5");
   statusH.className = "errorsub";
   cont.appendChild(statusH);
   
   close = document.createElement("img");
   close.className = "exit-button";
   close.src = "exit.png";
   close.addEventListener("click", function() {deleteDiv(c);} )
   cont.appendChild(close)
   return cont;
}

function deleteDiv(d){
   var i = content.indexOf(d);
   if (i >= 0) {
      content.splice(i,1);
      update();
   }
}

function exitRequest() {
   var xmlhttp;
   if (window.XMLHttpRequest) {
       // code for IE7+, Firefox, Chrome, Opera, Safari
      xmlhttp=new XMLHttpRequest();
   } else {// code for IE6, IE5
      xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
   }
   xmlhttp.onreadystatechange=function() {
      if (xmlhttp.readyState==4 && xmlhttp.status==200) {
         close()
      }
   }
   xmlhttp.open("GET","/close",true);
   xmlhttp.send();
}



document.onkeydown = function (evt) {
   var keyCode = evt ? (evt.which ? evt.which : evt.keyCode) : event.keyCode;
   if (keyCode == 13) {
      document.getElementById('go-button').click();
   }
   if (keyCode == 27) {
      res = document.getElementById("resultats");
      if (res.style.visibility == "visible") {
         res.style.animation = "hideRes 500ms 2";
         res.style.WebkitAnimation = "hideRes 500ms 2";
         setTimeout(function() { res.style.visibility = "hidden"; }, 500);
      } else {
         res.style.visibility = "visible";
         res.style.animation = "showRes 500ms 2";
         res.style.WebkitAnimation = "showRes 500ms 2";
      }
   } else {
      return true;
   }
};


// Basic table creation
function createTable(classe, a) {
   res = document.createElement("table");
   res.className = classe;
   tr = document.createElement("tr");
   for (var i = 0; i < a.length; i++) {
      th = document.createElement("th");
      th.className = "col" + i;
      th.textContent = a[i];
      tr.appendChild(th);
   }
   res.appendChild(tr);
   return res;
}

function createTorrentTable() {
   return createTable("results resultsTorrent", ["Score", "Taille", "Nom du fichier", "Lien"])
}

function createSubtitleTable() {
   return createTable("results resultsSubtitle", ["Score", "Taille", "Nom du fichier", "Lien"])
}
