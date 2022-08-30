import dictionary from '/static/html/components/component_modules/speechDictionary/dictionary.mjs'
import change from "/static/html/components/component_modules/speechChange/change.mjs"

export default {
    set:async (obj, type, ...rest)=>{
        return new Promise(async (resolve, reject) => {
            let out = (obj)=>{
                resolve(obj)
            }
            let err = (obj)=>{
                reject(obj)
            }
            switch(obj['type']){
                case 'sessionStorage':
                    (async (obj, type, rest)=>{
                        await session['set']({type:'item', key:`item_${obj['key']}`, value:obj['value']})
                    })(obj, type, rest)
                    out(true)
                    break
                default:
                    err(`новая функция ${obj['type']} `)
                    break
            }
        })
    },
    get:async (obj, type, ...rest)=>{
        return new Promise(async (resolve, reject) => {
            let out = (obj)=>{
                resolve(obj)
            }
            let err = (obj)=>{
                reject(obj)
            }
            switch(obj['type']){
                case 'speech':
                    (async (obj, type, rest)=>{
                        let object = {}
                        object['select_dialect'] = obj['dialect']
                        object['select_language'] = obj['language']
                        object['langs'] = []
                        object['langs'] =  [['Afrikaans',       ['af-ZA']],
                            ['Bahasa Indonesia',['id-ID']],
                            ['Bahasa Melayu',   ['ms-MY']],
                            ['Català',          ['ca-ES']],
                            ['Čeština',         ['cs-CZ']],
                            ['Deutsch',         ['de-DE']],
                            ['English',         ['en-AU', 'Australia'],
                                ['en-CA', 'Canada'],
                                ['en-IN', 'India'],
                                ['en-NZ', 'New Zealand'],
                                ['en-ZA', 'South Africa'],
                                ['en-GB', 'United Kingdom'],
                                ['en-US', 'United States']],
                            ['Español',         ['es-AR', 'Argentina'],
                                ['es-BO', 'Bolivia'],
                                ['es-CL', 'Chile'],
                                ['es-CO', 'Colombia'],
                                ['es-CR', 'Costa Rica'],
                                ['es-EC', 'Ecuador'],
                                ['es-SV', 'El Salvador'],
                                ['es-ES', 'España'],
                                ['es-US', 'Estados Unidos'],
                                ['es-GT', 'Guatemala'],
                                ['es-HN', 'Honduras'],
                                ['es-MX', 'México'],
                                ['es-NI', 'Nicaragua'],
                                ['es-PA', 'Panamá'],
                                ['es-PY', 'Paraguay'],
                                ['es-PE', 'Perú'],
                                ['es-PR', 'Puerto Rico'],
                                ['es-DO', 'República Dominicana'],
                                ['es-UY', 'Uruguay'],
                                ['es-VE', 'Venezuela']],
                            ['Euskara',         ['eu-ES']],
                            ['Français',        ['fr-FR']],
                            ['Galego',          ['gl-ES']],
                            ['Hrvatski',        ['hr_HR']],
                            ['IsiZulu',         ['zu-ZA']],
                            ['Íslenska',        ['is-IS']],
                            ['Italiano',        ['it-IT', 'Italia'],
                                ['it-CH', 'Svizzera']],
                            ['Magyar',          ['hu-HU']],
                            ['Nederlands',      ['nl-NL']],
                            ['Norsk bokmål',    ['nb-NO']],
                            ['Polski',          ['pl-PL']],
                            ['Português',       ['pt-BR', 'Brasil'],
                                ['pt-PT', 'Portugal']],
                            ['Română',          ['ro-RO']],
                            ['Slovenčina',      ['sk-SK']],
                            ['Suomi',           ['fi-FI']],
                            ['Svenska',         ['sv-SE']],
                            ['Türkçe',          ['tr-TR']],
                            ['български',       ['bg-BG']],
                            ['Pусский',         ['ru-RU']],
                            ['Српски',          ['sr-RS']],
                            ['한국어',            ['ko-KR']],
                            ['中文',             ['cmn-Hans-CN', '普通话 (中国大陆)'],
                                ['cmn-Hans-HK', '普通话 (香港)'],
                                ['cmn-Hant-TW', '中文 (台灣)'],
                                ['yue-Hant-HK', '粵語 (香港)']],
                            ['日本語',           ['ja-JP']],
                            ['Lingua latīna',   ['la']]];

                        object['one_line'] = /\n/g;
                        object['two_line'] = /\n\n/g;
                        object['first_char'] = /\S/;
                        object['current_style'] = {};

                        function updateCountry() {
                            // console.assert(false,object['select_dialect'] )

                            for (let i = object['select_dialect'].options.length - 1; i >= 0; i--) {
                                object['select_dialect'].remove(i);
                            }
                            // console.assert(false,object['langs'] )
                            let list =  object['langs'][object['select_language'].selectedIndex];
                            for (var i = 1; i < list.length; i++) {
                                object['select_dialect'].options.add(new Option(list[i][1], list[i][0]));
                            }
                            object['select_dialect'].style.visibility = list[1].length == 1 ? 'hidden' : 'visible';
                        }

                        function upgrade() {
                            obj['this'].shadowRoot.querySelector('#start_button').style.visibility = 'hidden';
                            showInfo('info_upgrade');
                        }
                        function showInfo(s) {
                            let info = obj['this'].shadowRoot.querySelector('#info')
                            if (s) {
                                for (var child = info.firstChild; child; child = child.nextSibling) {
                                    if (child.style) {
                                        child.style.display = child.id == s ? 'inline' : 'none';
                                    }
                                }
                                info.style.visibility = 'visible';
                            } else {
                                info.style.visibility = 'hidden';
                            }
                        }
                        for (let i = 0; i < object['langs'].length; i++) { object['select_language'].options[i] = new Option(object['langs'][i][0], i); }
                        object['select_language'].selectedIndex = 26;
                        updateCountry();
                        object['select_dialect'].selectedIndex = 0;
                        object['start_button'] = obj['this'].shadowRoot.querySelector('#start_button');
                        object['copy_button'] = obj['this'].shadowRoot.querySelector('#copy_button');
                        object['email_button'] = obj['this'].shadowRoot.querySelector('#email_button');
                        object['final_span'] = obj['this'].shadowRoot.querySelector('#final_span');
                        object['interim_span'] = obj['this'].shadowRoot.querySelector('#interim_span');
                        object['start_img'] = obj['this'].shadowRoot.querySelector('#start_img');
                        object['copy_info'] = obj['this'].shadowRoot.querySelector('#copy_info');
                        object['email_info'] = obj['this'].shadowRoot.querySelector('#email_info');

                        object['select_language'].addEventListener('change',updateCountry)
                        object['start_button'].addEventListener('click',startButton)
                        object['copy_button'].addEventListener('click',copyButton)
                        object['email_button'].addEventListener('click',emailButton)

                        showInfo('info_start');
                        object['create_email'] = false;
                        object['final_transcript'] = '';
                        object['recognizing'] = false;
                        object['ignore_onend'] = {};
                        object['start_timestamp'] = {};

                        function startButton(event) {
                            if (object['recognizing']) {
                                object['recognition'].stop();
                                return;
                            }
                            object['final_transcript'] = '';
                            object['recognition'].lang = object['select_dialect'].value;
                            object['recognition'].start();
                            object['ignore_onend']  = false;
                            object['final_span'].innerHTML = '';
                            object['interim_span'].innerHTML = '';
                            object['start_img'].src = '/js/module/mic-slash.gif';
                            showInfo('info_allow');
                            showButtons('none');
                            object['start_timestamp']  = event.timeStamp;
                        }
                        function copyButton() {
                            if (object['recognizing']) {
                                object['recognizing'] = false;
                                object['recognition'].stop();
                            }
                            object['copy_button'] .style.display = 'none';
                            object['copy_info'].style.display = 'inline-block';
                            showInfo('');
                        }
                        function emailButton() {
                            if (object['recognizing']) {
                                object['create_email'] = true;
                                object['recognizing'] = false;
                                object['recognition'].stop();
                            } else {
                                createEmail();
                            }
                            object['email_button'].style.display = 'none';
                            object['email_info'].style.display = 'inline-block';
                            showInfo('');
                        }
                        function showButtons(style) {
                            if (style == object['current_style']) {
                                return;
                            }
                            object['current_style'] = style;
                            object['copy_button'].style.display = style;
                            object['email_button'].style.display = style;
                            object['copy_info'].style.display = 'none';
                            object['email_info'].style.display = 'none';
                        }
                        function createEmail() {
                            let n =    object['final_transcript'].indexOf('\n');
                            if (n < 0 || n >= 80) {
                                n = 40 +    object['final_transcript'].substring(40).indexOf(' ');
                            }
                            let subject = encodeURI(   object['final_transcript'].substring(0, n));
                            let body = encodeURI(   object['final_transcript'].substring(n + 1));
                            window.location.href = 'mailto:?subject=' + subject + '&body=' + body;
                        }
                        if (!('webkitSpeechRecognition' in window)) {
                            upgrade();
                        } else {
                            object['start_button'].style.display = 'inline-block';
                            object['recognition'] = new webkitSpeechRecognition();
                            object['recognition'].continuous = true;
                            object['recognition'].interimResults = true;

                            object['recognition'].onstart = async function () {
                                console.assert(false)
                                await dictionary['get']({type:'dictionary'})

                                object['recognizing'] = true;
                                showInfo('info_speak_now');
                                object['start_img'].src = '/static/html/components/web-speech/images/mic-animate.gif';

                            };
                            object['recognition'].onerror = function (event) {
                                if (event.error === 'no-speech') {
                                    ;object['start_img'].src = '/static/html/components/web-speech/images/mic.gif'
                                    showInfo('info_no_speech');
                                    object['ignore_onend'] = true;
                                }
                                if (event.error === 'audio-capture') {
                                    object['start_img'].src = '/static/html/components/web-speech/images/mic-slash.gif';
                                    showInfo('info_no_microphone');
                                    object['ignore_onend'] = true;
                                }
                                if (event.error === 'not-allowed') {
                                    if (event.timeStamp - obj['start_timestamp'] < 100) {
                                        showInfo('info_blocked');
                                    } else {
                                        showInfo('info_denied');
                                    }
                                    object['ignore_onend'] = true;
                                }
                            };
                            object['recognition'].onend = function () {

                                console.log('~~~~~~~~~~recognition end~~~~~~~~~')
                                object['recognizing'] = false;
                                if (object['ignore_onend']) {
                                    return;
                                }
                                object['start_img'].src = '/static/html/components/web-speech/images/mic.gif';
                                if (!object['final_transcript'] ) {
                                    showInfo('info_start');
                                    return;
                                }
                                showInfo('');
                                if (window.getSelection) {
                                    window.getSelection().removeAllRanges();
                                    let range = document.createRange();
                                    range.selectNode(obj['this'].shadowRoot.querySelector('#final_span'));
                                    window.getSelection().addRange(range);
                                }
                                if (object['create_email']) {
                                    object['create_email'] = false;
                                    createEmail();
                                }

                                change(obj['this'].parentNode, {type:'reset'})

                            };
                            object['recognition'].onresult = function(event) {
                                console.log('~~~~~~~~~~~~~ onresult ~~~~~~~~~~~~~~~~', event)
                                object['interim_transcript'] = ''
                                for (let i = event.resultIndex; i < event.results.length; ++i) {
                                    if (event.results[i].isFinal) {
                                        dictionary['set']({type:'isFinal', data: event.results[i][0].transcript, this:obj['this']})
                                        object['final_transcript']  += event.results[i][0].transcript;
                                    } else {
                                        dictionary['set']({type:'isRaw', data: event.results[i][0].transcript, this:obj['this']})
                                        object['interim_transcript'] += event.results[i][0].transcript;
                                    }
                                }
                                object['final_transcript'] = capitalize(object['final_transcript']);
                                object['final_span'].innerHTML = linebreak(object['final_transcript']);
                                object['interim_span'].innerHTML = linebreak(object['interim_transcript']);
                                if (object['final_transcript'] || object['interim_transcript']) {
                                    // console.log('~~~~~~~~~~~~~~~~~',object)
                                    showButtons('inline-block');
                                }
                            };
                            function linebreak(s) {
                                return s.replace(object['two_line'], '<p></p>').replace(object['one_line'], '<br>');
                            }
                            function capitalize(s) {
                                return s.replace(object['first_char'], function (m) {
                                    return m.toUpperCase();
                                });
                            }
                        }
                    })(obj, type, rest)
                    break
                default:
                    err(`новая функция ${obj['type']} `)
                    break
            }

        })
    },
    put:async (obj, type, ...rest)=>{
        return new Promise(async (resolve, reject) => {
            let out = (obj)=>{
                resolve(obj)
            }
            let err = (obj)=>{
                reject(obj)
            }
            switch(obj['type']){
                case 'getAll':
                    ((obj, type, rest)=>{



                    })(obj, type, rest)
                    break
                default:
                    err(`новая функция ${obj['type']} `)
                    break
            }

        })
    },
    delete:async (obj, type, ...rest)=>{
        return new Promise(async (resolve, reject) => {
            let out = (obj)=>{
                resolve(obj)
            }
            let err = (obj)=>{
                reject(obj)
            }
            switch(obj['type']){
                case 'getAll':
                    ((obj, type, rest)=>{
                        out(sessionStorage.removeItem(obj['key']))
                    })(obj, type, rest)
                    break
                default:
                    err(`новая функция ${obj['type']} `)
                    break
            }

        })
    },
    clearn:async (obj, type, ...rest)=>{
        return new Promise(async (resolve, reject) => {
            let out = (obj)=>{
                resolve(obj)
            }
            let err = (obj)=>{
                reject(obj)
            }
            switch(obj['type']){
                case 'sessionStorage':
                    ((obj, type, rest)=>{
                        let keys =  Object.keys(sessionStorage)
                        for(let i=0; i < keys.length; i++){
                            if(keys[i].split('_').length > 1){

                            }else{
                                session['delete']({type:'item', key:keys[i]})
                            }
                        }
                        out(true)
                    })(obj, type, rest)
                    break
                default:
                    err(`новая функция ${obj['type']} `)
                    break
            }
        })
    }
}