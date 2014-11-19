
function PirateBay(lines) {
   this.lines = lines;
   this.requestCode     = parseInt(lines[0]);
   this.pbOffset        = parseInt(lines[1]);
   this.stOffset        = parseInt(lines[2]);
   this.answerCode      = parseInt(lines[this.pbOffset+0]);
   this.titleResults    =          lines[this.pbOffset+1];
   this.numberResults   = parseInt(lines[this.pbOffset+2]);
   this.stAnswerCode   = parseInt(lines[this.stOffset+0])
   this.stTitleResults =          lines[this.stOffset+1]
   this.stNumberResults= parseInt(lines[this.stOffset+2])
};

PirateBay.prototype.setErrmsg = function(errmsg) {
   if (this.requestCode == 1) {
      errmsg.textContent = "La saison doit etre un entier !";
   } else if (this.requestCode == 2) {
      errmsg.textContent = "L'épisode doit etre un entier !";
   } else {
      errmsg.textContent = "Erreur inconnue...";
   }
   errmsg.style.color = 'red';
   errmsg.style.visibility = "visible";
}

PirateBay.prototype.error = function(){
   return (this.requestCode > 0);
}


PirateBay.prototype.getDiv = function(){
   lines = this.lines
   cont = stdDiv(this);
   titleH  = cont.getElementsByTagName('h2')[0]
   statusH = cont.getElementsByTagName('h5')[0]
   
   res1 = createTorrentTable();
   
   if ( this.answerCode > 0) {
      statusH.style.color = "red";
      titleH.textContent = "Aucun résultat...";
      if ( this.answerCode == 1) {
         statusH.textContent = "Aucune requête envoyée à PirateBay";
      } else if (this.answerCode == 2) {
         statusH.textContent = "Réponse erronée de PirateBay";
      }
   } else {
      statusH.style.color = "green"
      statusH.textContent = "Réponse correcte de PirateBay: " + this.numberResults + " résultats.";
      titleH.textContent = this.titleResults;
      for (var i = 0; i < this.numberResults; i++) {
         offset = this.pbOffset + 3 + 5*i
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
         img.src = "chest.png";
         a.appendChild(img);
         td.appendChild(a);
         tr.appendChild(td);
         
         res1.appendChild(tr);
      }
   }
   
   cont.appendChild(res1);
   return cont;
}


PirateBay.prototype.addSubtitleSelect = function() {
   searchTable = document.getElementById("searchTable")
   if (searchTable.rows.length > 2) {
      searchTable.deleteRow(2)
   }
   row = searchTable.insertRow(2)
   
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
   
   if ( this.stAnswerCode > 0) {
      statusH.style.color = "red"
      if (this.stAnswerCode == 1) {
         statusH.textContent = "Aucune requête envoyée à TVSubtitles";
      } else if (this.stAnswerCode == 2) {
         statusH.textContent = "Réponse erronée de TVSubtitles";
      }
   } else {
      statusH.style.color = "green";
      statusH.innerHTML += "Réponse correcte de TVSubtitles<br>" + this.stNumberResults + " résultats.";
      for (var i = 0; i < this.stNumberResults; i++) {
         offset = this.stOffset + 3 + 2*i
         opt = document.createElement('option');
         opt.text  = this.lines[offset + 0]
         opt.value = this.lines[offset + 1]
         choices.appendChild(opt)
      }
   }
   td1.appendChild(choices)
   td2.appendChild( button )
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



function createRequest() {
   name    = document.getElementById('name').value
   episode = document.getElementById('episode').value
   season  = document.getElementById('season').value
   return "/req/?name=" + name + "&episode=" + episode + "&season=" + season
}

function handleAnswer(lines) {
   piratebay = new PirateBay(lines);
   var errmsg = document.getElementById("statusMsg");
   if ( piratebay.error() ) {
      piratebay.setErrmsg(errmsg)
      titleH.textContent = "Requête incorrecte !"
   } else {
      errmsg.style.visibility = "hidden";
      errmsg.textContent = "";
      piratebay.addSubtitleSelect();
      content.push( piratebay )
      update();
   }
}

