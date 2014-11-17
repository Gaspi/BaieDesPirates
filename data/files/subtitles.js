

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
   var errmsg = document.getElementById("statusMsg");
   
   requestCode = parseInt(lines[0])
   offset      = parseInt(lines[1])
   
   if (requestCode > 0) {
      errmsg.style.color = 'red';
      errmsg.style.visibility = "visible";
      errmsg.textContent = "Error: " + requestCode;
   } else {
      errmsg.style.visibility = "hidden";
      errmsg.textContent = "";
      answerCode = parseInt(lines[offset+0])
      titleResults = lines[offset+1]
      numberResults = parseInt( lines[offset+2] )
      deleteSubtitleRow()
      document.body.appendChild( fillSubtitlesResults(answerCode, titleResults, numberResults, offset, lines) )
   }
}

function deleteSubtitleRow() {
   searchTable = document.getElementById("searchTable")
   if (searchTable.rows.length > 2) {
      searchTable.deleteRow(2)
   }
}

function createSubtitleTable() {
   return createTable("results resultsSubtitle", ["Score", "Taille", "Nom du fichier", "Lien"])
}


function fillSubtitlesResults(answerCode, titleResults, numberResults, offset, lines) {
   cont = document.createElement("div");
   cont.className = "container subtitles";
   titleH = document.createElement("h2");
   statusH = document.createElement("h5");
   statusH.className = "errorsub";
   cont.appendChild(titleH);
   cont.appendChild(statusH);
   
   if (answerCode > 0) {
      statusH.style.color = "red";
      titleH.textContent = "Aucun résultat...";
      if (answerCode == 1) {
         statusH.textContent = "Aucune requête envoyée à TVSubtitles";
      } else if (answerCode == 2) {
         statusH.textContent = "Réponse erronée de TVSubtitles";
      }
   } else {
      statusH.style.color = "green"
      statusH.textContent = "Réponse correcte de TVSubtitles: " + numberResults + " résultats.";
      titleH.textContent = titleResults;
      
      res1 = createSubtitleTable()
      for (var i = 0; i < numberResults; i++) {
         Roffset = offset + 3 + 4*i
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
         a.onlick = function(){ subtitlesRequest() };
         img = document.createElement('img');
         img.className = "chest";
         img.src = "chest2.png";
         a.appendChild(img);
         td.appendChild(a);
         tr.appendChild(td);
         
         res1.appendChild(tr);
      }
      cont.appendChild(res1);
   }
   return cont;
}





function createSubtitlesRequest(code) {
   name    = document.getElementById('name').value;
   episode = document.getElementById('episode').value;
   season  = document.getElementById('season').value;
   return "/sub/?name=" + name + "&episode=" + episode + "&season=" + season + "&code=" + code;
}




















