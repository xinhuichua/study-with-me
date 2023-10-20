if ("webkitSpeechRecognition" in window) {
    let speechRecognition = new webkitSpeechRecognition(); //this is an in-built Web Speech API 
    let final_transcript = "";
  
    speechRecognition.continuous = true;
    speechRecognition.interimResults = true;
  
    speechRecognition.onstart = () => {
      document.querySelector("#status").style.display = "block";
    };
    speechRecognition.onerror = () => {
      document.querySelector("#status").style.display = "none";
      console.log("Speech Recognition Error");
    };
    speechRecognition.onend = () => {
      document.querySelector("#status").style.display = "none";
      console.log("Speech Recognition Ended");
    };
  
    speechRecognition.onresult = (event) => {
      let interim_transcript = "";
  
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          final_transcript += event.results[i][0].transcript;
        } else {
          interim_transcript += event.results[i][0].transcript;
        }
      }
      document.querySelector("#final").innerHTML = final_transcript; //if put noteBody, it doesn't save after stop 
      document.querySelector("#interim").innerHTML = interim_transcript;
    };
  
    document.querySelector("#start").onclick = () => {
      speechRecognition.start();
    };
    document.querySelector("#stop").onclick = () => {
      speechRecognition.stop();
      let noteBody = document.getElementById('noteBody');
      noteBody.value += ` ${final_transcript}` //add the speech recognition content into the textarea
      final_transcript = "" //clear the transcript contents 
      interim_transcript = ""
      document.querySelector("#final").innerHTML = final_transcript; //this would ensure that the words will clear automatically after stopping
    };
  } else {
    console.log("Speech Recognition Not Available");
  }