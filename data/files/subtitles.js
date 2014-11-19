
function Subtitle(lines) {
   this.requestCode   = parseInt(lines[0]);
   this.offset        = parseInt(lines[1]);
   this.answerCode    = parseInt(lines[this.offset+0]);
   this.titleResults  =          lines[this.offset+1];
   this.numberResults = parseInt(lines[this.offset+2] );
   this.lines = lines;
};

Subtitle.prototype.setErrmsg = function(errmsg) {
   errmsg.style.color = 'red';
   errmsg.style.visibility = "visible";
   errmsg.textContent = "Error: " + this.requestCode;
}

Subtitle.prototype.error = function(){
   return (this.requestCode > 0);
}


Subtitle.prototype.getDiv = function(){
   var self = this;
   lines = this.lines;
   cont = stdDiv(this);
   titleH  = cont.getElementsByTagName('h2')[0];
   statusH = cont.getElementsByTagName('h5')[0];
   if (this.answerCode > 0) {
      statusH.style.color = "red";
      titleH.textContent = "Aucun résultat...";
      if (this.answerCode == 1) {
         statusH.textContent = "Aucune requête envoyée à TVSubtitles";
      } else if (this.answerCode == 2) {
         statusH.textContent = "Réponse erronée de TVSubtitles";
      }
   } else {
      if (this.numberResults == 0) {
         statusH.style.color = "red";
         statusH.textContent = "Réponse de TVSubtitles: aucun résultats.";
      } else {
         statusH.style.color = "green";
         statusH.textContent = "Réponse correcte de TVSubtitles: " + this.numberResults + " résultats.";
      }
      titleH.textContent = this.titleResults;
      
      res1 = createSubtitleTable()
      for (var i = 0; i < this.numberResults; i++) {
         Roffset = this.offset + 3 + 4*i
         tr = document.createElement('tr');
         
         td = document.createElement('td');
         td.className  = "resCol0";
         td.textContent = lines[Roffset];
         tr.appendChild(td);
         
         td = document.createElement('td');
         td.className  = "resCol1";
         td.textContent = lines[Roffset+1];
         tr.appendChild(td);
         
         td = document.createElement('td');
         td.className  = "resCol2";
         td.textContent = lines[Roffset + 2];
         tr.appendChild(td);
         
         td = document.createElement('td');
         td.className  = "resCol3";
         a = document.createElement('a');
         a.href = "http://www.tvsubtitles.net/download-" + lines[Roffset + 3] + ".html";
         img = document.createElement('img');
         img.className = "chest";
         img.src = "chest.png";
         img.addEventListener("click", function() {deleteDiv(self);} )
         a.appendChild(img);
         td.appendChild(a);
         tr.appendChild(td);
         
         res1.appendChild(tr);
      }
      cont.appendChild(res1);
   }
   return cont;
}




function subtitlesRequest() {
   choices = document.getElementById("subtitle-choice")
   choices = choices.options[ choices.selectedIndex ]
   code = choices.value
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
            handleSubtitlesAnswer(lines);
         }
      }
   
   var errmsg = document.getElementById("statusMsg");
   errmsg.style.color = 'orange';
   errmsg.style.visibility = "visible";
   errmsg.textContent = "Attente de réponse..."
   
   xmlhttp.open("GET", createSubtitlesRequest(code), true);
   xmlhttp.send();
}


function handleSubtitlesAnswer(lines) {
   subtitle = new Subtitle(lines);
   var errmsg = document.getElementById("statusMsg");
   if ( subtitle.error() ) {
      subtitle.setErrmsg(errmgs);
   } else {
      errmsg.style.visibility = "hidden";
      errmsg.textContent = "";
      deleteSubtitleRow();
      content.push( subtitle );
      update();
   }
}

function deleteSubtitleRow() {
   searchTable = document.getElementById("searchTable")
   if (searchTable.rows.length > 2) {
      searchTable.deleteRow(2);
   }
}


function createSubtitlesRequest(code) {
   name    = document.getElementById('name').value;
   episode = document.getElementById('episode').value;
   season  = document.getElementById('season').value;
   return "/sub/?name=" + name + "&episode=" + episode + "&season=" + season + "&code=" + code;
}




















