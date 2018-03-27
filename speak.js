$(function(){
  var path = window.location.pathname.split( '/' );
  if(path[3] == "pages") {

    var say = function(toSpeak) {
      var stageSpeech = new SpeechSynthesisUtterance(toSpeak);
      window.speechSynthesis.speak(stageSpeech);
    }

    var pageContent = document.querySelector('#wiki_page_show .show-content');
    $(pageContent).before('<button type="button" id="playSpeech">Play</button>')

    $('#playSpeech').click(function(){
      say(pageContent.textContent);
    });

  }
});