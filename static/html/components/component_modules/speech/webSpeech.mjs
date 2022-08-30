import dictionary from"/static/html/components/component_modules/speech/dictionary.mjs";import change from"/static/html/components/component_modules/speech/change.mjs";let object={};export default async e=>new Promise((t,o)=>{object.select_dialect=e.this.shadowRoot.querySelector("#select_dialect"),object.select_language=e.this.shadowRoot.querySelector("#select_language"),object.langs=[],object.langs=[["Afrikaans",["af-ZA"]],["Bahasa Indonesia",["id-ID"]],["Bahasa Melayu",["ms-MY"]],["Català",["ca-ES"]],["Čeština",["cs-CZ"]],["Deutsch",["de-DE"]],["English",["en-AU","Australia"],["en-CA","Canada"],["en-IN","India"],["en-NZ","New Zealand"],["en-ZA","South Africa"],["en-GB","United Kingdom"],["en-US","United States"]],["Español",["es-AR","Argentina"],["es-BO","Bolivia"],["es-CL","Chile"],["es-CO","Colombia"],["es-CR","Costa Rica"],["es-EC","Ecuador"],["es-SV","El Salvador"],["es-ES","España"],["es-US","Estados Unidos"],["es-GT","Guatemala"],["es-HN","Honduras"],["es-MX","México"],["es-NI","Nicaragua"],["es-PA","Panamá"],["es-PY","Paraguay"],["es-PE","Perú"],["es-PR","Puerto Rico"],["es-DO","República Dominicana"],["es-UY","Uruguay"],["es-VE","Venezuela"]],["Euskara",["eu-ES"]],["Français",["fr-FR"]],["Galego",["gl-ES"]],["Hrvatski",["hr_HR"]],["IsiZulu",["zu-ZA"]],["Íslenska",["is-IS"]],["Italiano",["it-IT","Italia"],["it-CH","Svizzera"]],["Magyar",["hu-HU"]],["Nederlands",["nl-NL"]],["Norsk bokmål",["nb-NO"]],["Polski",["pl-PL"]],["Português",["pt-BR","Brasil"],["pt-PT","Portugal"]],["Română",["ro-RO"]],["Slovenčina",["sk-SK"]],["Suomi",["fi-FI"]],["Svenska",["sv-SE"]],["Türkçe",["tr-TR"]],["български",["bg-BG"]],["Pусский",["ru-RU"]],["Српски",["sr-RS"]],["한국어",["ko-KR"]],["中文",["cmn-Hans-CN","普通话 (中国大陆)"],["cmn-Hans-HK","普通话 (香港)"],["cmn-Hant-TW","中文 (台灣)"],["yue-Hant-HK","粵語 (香港)"]],["日本語",["ja-JP"]],["Lingua latīna",["la"]]],object.one_line=/\n/g,object.two_line=/\n\n/g,object.first_char=/\S/,object.current_style={};for(let e=0;e<object.langs.length;e++)object.select_language.options[e]=new Option(object.langs[e][0],e);object.select_language.selectedIndex=26,n(),object.select_dialect.selectedIndex=0,object.start_button=e.this.shadowRoot.querySelector("#start_button"),object.copy_button=e.this.shadowRoot.querySelector("#copy_button"),object.email_button=e.this.shadowRoot.querySelector("#email_button"),object.final_span=e.this.shadowRoot.querySelector("#final_span"),object.interim_span=e.this.shadowRoot.querySelector("#interim_span"),object.start_img=e.this.shadowRoot.querySelector("#start_img"),object.copy_info=e.this.shadowRoot.querySelector("#copy_info"),object.email_info=e.this.shadowRoot.querySelector("#email_info"),object.info=e.this.shadowRoot.querySelector("#info"),object.select_language.addEventListener("change",n),object.start_button.addEventListener("click",function(e){if(object.recognizing)return void object.recognition.stop();object.final_transcript="",object.recognition.lang=object.select_dialect.value,object.recognition.start(),object.ignore_onend=!1,object.final_span.innerHTML="",object.interim_span.innerHTML="",object.start_img.src="/static/html/components/telegram-speech/images/mic-slash.gif",s("info_allow"),a("none"),object.start_timestamp=e.timeStamp}),object.copy_button.addEventListener("click",function(){object.recognizing&&(object.recognizing=!1,object.recognition.stop());object.copy_button.style.display="none",object.copy_info.style.display="inline-block",s("")}),object.email_button.addEventListener("click",function(){object.recognizing?(object.create_email=!0,object.recognizing=!1,object.recognition.stop()):c();object.email_button.style.display="none",object.email_info.style.display="inline-block",s("")}),console.log("~~~~~~~~~~~~~~~~~~~~",object.select_language);for(let e=0;e<object.langs.length;e++)object.select_language.options[e]=new Option(object.langs[e][0],e);function n(){for(let e=object.select_dialect.options.length-1;e>=0;e--)object.select_dialect.remove(e);console.log("~~~~~~~~~updateCountry~~~~~~~~~~~",object.select_language);let e=object.langs[object.select_language.selectedIndex];for(let t=1;t<e.length;t++)object.select_dialect.options.add(new Option(e[t][1],e[t][0]));console.log("~~~~~~~~~updateCountry~~~~~~~~~~~",object.select_dialect),object.select_dialect.style.visibility=1==e[1].length?"hidden":"visible"}function i(e){return e.replace(object.two_line,"<p></p>").replace(object.one_line,"<br>")}function c(){let e=object.final_transcript.indexOf("\n");(e<0||e>=80)&&(e=40+object.final_transcript.substring(40).indexOf(" "));let t=encodeURI(object.final_transcript.substring(0,e)),o=encodeURI(object.final_transcript.substring(e+1));window.location.href="mailto:?subject="+t+"&body="+o}function s(e){if(e){for(let t=object.info.firstChild;t;t=t.nextSibling)t.style&&(t.style.display=t.id==e?"inline":"none");object.info.style.visibility="visible"}else object.info.style.visibility="hidden";console.log("~~~~~~~~~showInfo~~~~~~~~~~~",object.info)}function a(e){e!=object.current_style&&(object.current_style=e,object.copy_button.style.display=e,object.email_button.style.display=e,object.copy_info.style.display="none",object.email_info.style.display="none")}console.log("~~~~~~~~~select_language~~~~~~~~~~~",object.select_language),object.select_language.selectedIndex=6,n(),object.select_dialect.selectedIndex=6,s("info_start"),object.create_email=!1,object.final_transcript="",object.recognizing=!1,object.ignore_onend={},object.start_timestamp={},"webkitSpeechRecognition"in window?(object.start_button.style.display="inline-block",object.recognition=new webkitSpeechRecognition,object.recognition.continuous=!0,object.recognition.interimResults=!0,object.recognition.onstart=function(){object.recognizing=!0,s("info_speak_now"),console.log("~~~~~~~~onstart~~~~~~",object.recognizing),object.start_img.src="/static/html/components/telegram-speech/images/mic-animate.gif"},object.recognition.onerror=function(e){console.log("~~~~~~~~onerror~~~~~~",e),"no-speech"==e.error&&(object.start_img.src="/static/html/components/telegram-speech/images/mic.gif",s("info_no_speech"),object.ignore_onend=!0),"audio-capture"==e.error&&(object.start_img.src="/static/html/components/telegram-speech/images/mic.gif",s("info_no_microphone"),object.ignore_onend=!0),"not-allowed"==e.error&&(e.timeStamp-object.start_timestamp<100?s("info_blocked"):s("info_denied"),object.ignore_onend=!0)},object.recognition.onend=function(){if(console.log("~~~~~~~~onend~~~final_transcript~~~",object.final_transcript),object.recognizing=!1,!object.ignore_onend)if(object.start_img.src="/static/html/components/telegram-speech/images/mic.gif",object.final_transcript){if(s(""),window.getSelection){window.getSelection().removeAllRanges();let t=document.createRange();t.selectNode(e.this.shadowRoot.getElementById("final_span")),window.getSelection().addRange(t)}object.create_email&&(object.create_email=!1,c())}else s("info_start")},object.recognition.onresult=function(e){console.log("~~~~~~~~onresult~~~~~~",e);let t="";for(let o=e.resultIndex;o<e.results.length;++o)e.results[o].isFinal?object.final_transcript+=e.results[o][0].transcript:t+=e.results[o][0].transcript;object.final_transcript=object.final_transcript.replace(object.first_char,function(e){return e.toUpperCase()}),object.final_span.innerHTML=i(object.final_transcript),object.interim_span.innerHTML=i(t),(object.final_transcript||t)&&a("inline-block")}):(object.start_button.style.visibility="hidden",console.log("~~~~~~~~~upgrade~~~~~start_button~~~~~~",object.start_button),s("info_upgrade")),object.class=class{constructor(e){}self(){return object}},t(object)});