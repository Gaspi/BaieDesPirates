
function deleteAllResults() {
   currentDiv = document.body.lastChild
   while (currentDiv.id != "cont2" && currentDiv.id != "cont1") {
      document.body.removeChild( currentDiv )
      currentDiv = document.body.lastChild
   }
}


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



function fillTorrentResults(answerCode, titleResults, numberResults, mOffset, lines) {
   cont = document.createElement("div");
   cont.className = "container torrent";
   titleH = document.createElement("h2");
   statusH = document.createElement("h5");
   statusH.className = "errorsub";
   cont.appendChild(titleH);
   cont.appendChild(statusH);
   res1 = createTorrentTable();
   
   if (answerCode > 0) {
      statusH.style.color = "red";
      titleH.textContent = "Aucun résultat...";
      if (answerCode == 1) {
         statusH.textContent = "Aucune requête envoyée à PirateBay";
      } else if (answerCode == 2) {
         statusH.textContent = "Réponse erronée de PirateBay";
      }
   } else {
      statusH.style.color = "green"
      statusH.textContent = "Réponse correcte de PirateBay: " + numberResults + " résultats.";
      titleH.textContent = titleResults;
      for (var i = 0; i < numberResults; i++) {
         offset = mOffset + 3 + 5*i
         tr = document.createElement('tr');
         
         td = document.createElement('td');
         td.className  = "resCol0";
         td.textContent = lines[offset];
         tr.appendChild(td);

         td = document.createElement('td');
         td.className  = "resCol1";
         td.textContent = lines[offset+1];
         tr.appendChild(td);

         td = document.createElement('td');
         td.className  = "resCol2";
         a = document.createElement('a');
         a.textContent = lines[offset + 2];
         a.href = "http://www.piratebay.se" + lines[offset + 3];
         td.appendChild(a);
         tr.appendChild(td);
         
         td = document.createElement('td');
         td.className  = "resCol3";
         a = document.createElement('a');
         a.href = lines[offset + 4];
         img = document.createElement('img');
         img.className = "chest";
         img.src = "chest2.png";
         a.appendChild(img);
         td.appendChild(a);
         tr.appendChild(td);
         
         res1.appendChild(tr);
      }
   }
   
   cont.appendChild(res1);
   return cont;
}

function addSubtitlesResults(answerCode, titleResults, numberResult, mOffset, row) {
   var td;
   var choices = document.createElement("select")
   choices.id = "subtitle-choice"
   
   td1 = row.insertCell(0);
   var statusH = row.insertCell(1);
   statusH.colSpan = "2"
   statusH.className = "errorsub"
   
   td2 = row.insertCell(2)
   button = document.createElement("button")
   button.textContent = "Sous-titres"
   button.onclick = function(){ subtitlesRequest() };
   
   if (answerCode > 0) {
      statusH.style.color = "red"
      if (answerCode == 1) {
         statusH.textContent = "Aucune requête envoyée à TVSubtitles";
      } else if (answerCode == 2) {
         statusH.textContent = "Réponse erronée de TVSubtitles";
      }
   } else {
      statusH.style.color = "green";
      statusH.innerHTML += "Réponse correcte de TVSubtitles<br>" + numberResult + " résultats.";
      for (var i = 0; i < numberResults; i++) {
         offset = mOffset + 3 + 2*i
         opt = document.createElement('option');
         opt.text= lines[offset + 0]
         opt.value = lines[offset + 1]
         choices.appendChild(opt)
      }
   }
   td1.appendChild(choices)
   td2.appendChild( button )
}

function handleAnswer(lines) {
   cont2 = document.getElementById("cont2")
   requestCode = parseInt(lines[0])
   pbOffset    = parseInt(lines[1])
   stOffset    = parseInt(lines[2])
   
   deleteAllResults()
   
   errmsg = cont2.getElementsByClassName("errorsub")[0]
   if (requestCode > 0) {
      if (requestCode == 1) {
         errmsg.textContent = "La saison doit etre un entier !";
      } else if (requestCode == 2) {
         errmsg.textContent = "L'épisode doit etre un entier !";
      } else {
         errmsg.textContent = "Erreur inconnue...";
      }
      errmsg.style.color = 'red';
      errmsg.style.visibility = "visible";
      titleH.textContent = "Requête incorrecte !"
   } else {
      errmsg.style.visibility = "hidden";
      errmsg.textContent = "";
      answerCode = parseInt(lines[pbOffset+0])
      titleResults = lines[pbOffset+1]
      numberResults = parseInt( lines[pbOffset+2] )
      document.body.appendChild( fillTorrentResults(answerCode, titleResults, numberResults, pbOffset, lines) )
      
      answerCode = parseInt(lines[stOffset+0])
      titleResults = lines[stOffset+1]
      numberResults = parseInt( lines[stOffset+2] )
      searchTable = document.getElementById("searchTable")
      if (searchTable.rows.length > 2) {
         searchTable.deleteRow(2)
      }
      newRow = searchTable.insertRow(2)
      addSubtitlesResults(answerCode, titleResults, numberResults, stOffset, newRow)
   }
}

function createRequest() {
   name    = document.getElementById('name').value
   episode = document.getElementById('episode').value
   season  = document.getElementById('season').value
   return "/req/?name=" + name + "&episode=" + episode + "&season=" + season
}


function searchRequest() {
   var xmlhttp;
   if (window.XMLHttpRequest) {
       // code for IE7+, Firefox, Chrome, Opera, Safari
      xmlhttp=new XMLHttpRequest();
   } else {// code for IE6, IE5
      xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
   }
   xmlhttp.onreadystatechange= function() {
         if (xmlhttp.readyState==4 && xmlhttp.status==200) {
            lines = xmlhttp.responseText.split('\n');
            handleAnswer(lines);
         }
      }
   xmlhttp.open("GET", createRequest(), true);
   xmlhttp.send();
   
   var errmsg = document.getElementById("statusMsg");
   errmsg.style.color = 'orange';
   errmsg.style.visibility = "visible";
   errmsg.textContent = "Attente de réponse..."
}


