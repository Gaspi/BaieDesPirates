


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

