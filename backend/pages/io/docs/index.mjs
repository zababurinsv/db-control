import modules from "/modules/index.mjs";
const style = `
#root,body,html{height:100%}body{-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;font-family:Open Sans,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Oxygen,Ubuntu,Cantarell,Fira Sans,Droid Sans,Helvetica Neue,sans-serif;margin:0}code{font-family:source-code-pro,Menlo,Monaco,Consolas,Courier New,monospace}@media screen and (max-width:720px){.row-wrap{align-items:flex-start;flex-direction:column}.align{flex:1 1 80%;margin-left:16px}.title{padding:16px 32px 8px}.search{padding:8px 32px 16px;width:95%}.search input{width:100%}}@media screen and (min-width:720px){.row-wrap{flex-direction:row;justify-content:center}.align{flex:1 1 40%;margin-left:0;padding-bottom:8px;padding-top:8px}.title{padding-right:0}.search,.title{padding-left:48px}.search{padding-right:48px}}
@import 'https://fonts.googleapis.com/css?family=Open+Sans|Titillium+Web|Source+Code+Pro&display=swap'
@-webkit-keyframes loading_ng405l{0%{transform:rotate(0);-webkit-transform:rotate(0);}100%{transform:rotate(360deg);-webkit-transform:rotate(360deg);}}@-moz-keyframes loading_ng405l{0%{transform:rotate(0);-webkit-transform:rotate(0);}100%{transform:rotate(360deg);-webkit-transform:rotate(360deg);}}@-o-keyframes loading_ng405l{0%{transform:rotate(0);-webkit-transform:rotate(0);}100%{transform:rotate(360deg);-webkit-transform:rotate(360deg);}}@keyframes loading_ng405l{0%{transform:rotate(0);-webkit-transform:rotate(0);}100%{transform:rotate(360deg);-webkit-transform:rotate(360deg);}}@-webkit-keyframes loading-circle_fv6wzy{0%{stroke-dashoffset:600;}100%{stroke-dashoffset:0;}}@-moz-keyframes loading-circle_fv6wzy{0%{stroke-dashoffset:600;}100%{stroke-dashoffset:0;}}@-o-keyframes loading-circle_fv6wzy{0%{stroke-dashoffset:600;}100%{stroke-dashoffset:0;}}@keyframes loading-circle_fv6wzy{0%{stroke-dashoffset:600;}100%{stroke-dashoffset:0;}}.css-11r1ktn,[data-css-11r1ktn]{animation:loading_ng405l 2s linear infinite;-webkit-animation:loading_ng405l 2s linear infinite;}@-webkit-keyframes openAnimation_158oy86{from{opacity:0;transform:translateY(-120%);-webkit-transform:translateY(-120%);}to{transform:translateY(0);-webkit-transform:translateY(0);}}@-moz-keyframes openAnimation_158oy86{from{opacity:0;transform:translateY(-120%);-webkit-transform:translateY(-120%);}to{transform:translateY(0);-webkit-transform:translateY(0);}}@-o-keyframes openAnimation_158oy86{from{opacity:0;transform:translateY(-120%);-webkit-transform:translateY(-120%);}to{transform:translateY(0);-webkit-transform:translateY(0);}}@keyframes openAnimation_158oy86{from{opacity:0;transform:translateY(-120%);-webkit-transform:translateY(-120%);}to{transform:translateY(0);-webkit-transform:translateY(0);}}@-webkit-keyframes closeAnimation_1olw4g9{from{transform:scale(1);opacity:1;-webkit-transform:scale(1);}to{transform:scale(0.9);opacity:0;-webkit-transform:scale(0.9);}}@-moz-keyframes closeAnimation_1olw4g9{from{transform:scale(1);opacity:1;-webkit-transform:scale(1);}to{transform:scale(0.9);opacity:0;-webkit-transform:scale(0.9);}}@-o-keyframes closeAnimation_1olw4g9{from{transform:scale(1);opacity:1;-webkit-transform:scale(1);}to{transform:scale(0.9);opacity:0;-webkit-transform:scale(0.9);}}@keyframes closeAnimation_1olw4g9{from{transform:scale(1);opacity:1;-webkit-transform:scale(1);}to{transform:scale(0.9);opacity:0;-webkit-transform:scale(0.9);}}.css-1yiw7zu,[data-css-1yiw7zu]{display:-webkit-box; display: -moz-box; display: -ms-flexbox; display: -webkit-flex; display: flex;flex-direction:column;align-items:center;height:0;transition:all 240ms cubic-bezier(0.0, 0.0, 0.2, 1);-webkit-box-orient:vertical;-webkit-box-direction:normal;-webkit-flex-direction:column;-webkit-box-align:center;-webkit-align-items:center;-webkit-transition:all 240ms cubic-bezier(0.0, 0.0, 0.2, 1);-moz-transition:all 240ms cubic-bezier(0.0, 0.0, 0.2, 1);}.css-1yiw7zu[data-state="entering"],[data-css-1yiw7zu][data-state="entering"], .css-1yiw7zu[data-state="entered"], [data-css-1yiw7zu][data-state="entered"]{animation:openAnimation_158oy86 240ms cubic-bezier(0.175, 0.885, 0.320, 1.175) both;-webkit-animation:openAnimation_158oy86 240ms cubic-bezier(0.175, 0.885, 0.320, 1.175) both;}.css-1yiw7zu[data-state="exiting"],[data-css-1yiw7zu][data-state="exiting"]{animation:closeAnimation_1olw4g9 120ms cubic-bezier(0.4, 0.0, 1, 1) both;-webkit-animation:closeAnimation_1olw4g9 120ms cubic-bezier(0.4, 0.0, 1, 1) both;}.css-1sugtjn,[data-css-1sugtjn]{max-width:560px;margin:0 auto;top:0;left:0;right:0;position:fixed;z-index:30;pointer-events:none;}.css-1ktdej1,[data-css-1ktdej1]{top:0;position:absolute;display:-webkit-box; display: -moz-box; display: -ms-flexbox; display: -webkit-flex; display: flex;align-items:center;justify-content:center;line-height:1;-webkit-box-align:center;-webkit-align-items:center;-webkit-box-pack:center;-webkit-justify-content:center;}.css-1rdjc1y,[data-css-1rdjc1y]{cursor:pointer;}.css-1rdjc1y:hover,[data-css-1rdjc1y]:hover,.css-1rdjc1y[data-simulate-hover],[data-css-1rdjc1y][data-simulate-hover]{opacity:0.8;}@-webkit-keyframes openAnimation_u4xxlz{from{transform:translateY(100%);-webkit-transform:translateY(100%);}to{transform:translateY(0);-webkit-transform:translateY(0);}}@-moz-keyframes openAnimation_u4xxlz{from{transform:translateY(100%);-webkit-transform:translateY(100%);}to{transform:translateY(0);-webkit-transform:translateY(0);}}@-o-keyframes openAnimation_u4xxlz{from{transform:translateY(100%);-webkit-transform:translateY(100%);}to{transform:translateY(0);-webkit-transform:translateY(0);}}@keyframes openAnimation_u4xxlz{from{transform:translateY(100%);-webkit-transform:translateY(100%);}to{transform:translateY(0);-webkit-transform:translateY(0);}}@-webkit-keyframes fadeInAnimation_1ont4t{from{opacity:0;}to{opacity:1;}}@-moz-keyframes fadeInAnimation_1ont4t{from{opacity:0;}to{opacity:1;}}@-o-keyframes fadeInAnimation_1ont4t{from{opacity:0;}to{opacity:1;}}@keyframes fadeInAnimation_1ont4t{from{opacity:0;}to{opacity:1;}}@-webkit-keyframes fadeOutAnimation_1q9hkiq{from{opacity:1;}to{opacity:0;}}@-moz-keyframes fadeOutAnimation_1q9hkiq{from{opacity:1;}to{opacity:0;}}@-o-keyframes fadeOutAnimation_1q9hkiq{from{opacity:1;}to{opacity:0;}}@keyframes fadeOutAnimation_1q9hkiq{from{opacity:1;}to{opacity:0;}}@-webkit-keyframes openAnimation_1cql8cr{from{transform:scale(0.8);opacity:0;-webkit-transform:scale(0.8);}to{transform:scale(1);opacity:1;-webkit-transform:scale(1);}}@-moz-keyframes openAnimation_1cql8cr{from{transform:scale(0.8);opacity:0;-webkit-transform:scale(0.8);}to{transform:scale(1);opacity:1;-webkit-transform:scale(1);}}@-o-keyframes openAnimation_1cql8cr{from{transform:scale(0.8);opacity:0;-webkit-transform:scale(0.8);}to{transform:scale(1);opacity:1;-webkit-transform:scale(1);}}@keyframes openAnimation_1cql8cr{from{transform:scale(0.8);opacity:0;-webkit-transform:scale(0.8);}to{transform:scale(1);opacity:1;-webkit-transform:scale(1);}}@-webkit-keyframes closeAnimation_1y9xgi8{from{transform:scale(1);opacity:1;-webkit-transform:scale(1);}to{transform:scale(0.8);opacity:0;-webkit-transform:scale(0.8);}}@-moz-keyframes closeAnimation_1y9xgi8{from{transform:scale(1);opacity:1;-webkit-transform:scale(1);}to{transform:scale(0.8);opacity:0;-webkit-transform:scale(0.8);}}@-o-keyframes closeAnimation_1y9xgi8{from{transform:scale(1);opacity:1;-webkit-transform:scale(1);}to{transform:scale(0.8);opacity:0;-webkit-transform:scale(0.8);}}@keyframes closeAnimation_1y9xgi8{from{transform:scale(1);opacity:1;-webkit-transform:scale(1);}to{transform:scale(0.8);opacity:0;-webkit-transform:scale(0.8);}}@-webkit-keyframes pulseAnimation_1przkct{0%{transform:scale(1);-webkit-transform:scale(1);}50%{transform:scale(1.9);-webkit-transform:scale(1.9);}100%{transform:scale(1);-webkit-transform:scale(1);}}@-moz-keyframes pulseAnimation_1przkct{0%{transform:scale(1);-webkit-transform:scale(1);}50%{transform:scale(1.9);-webkit-transform:scale(1.9);}100%{transform:scale(1);-webkit-transform:scale(1);}}@-o-keyframes pulseAnimation_1przkct{0%{transform:scale(1);-webkit-transform:scale(1);}50%{transform:scale(1.9);-webkit-transform:scale(1.9);}100%{transform:scale(1);-webkit-transform:scale(1);}}@keyframes pulseAnimation_1przkct{0%{transform:scale(1);-webkit-transform:scale(1);}50%{transform:scale(1.9);-webkit-transform:scale(1.9);}100%{transform:scale(1);-webkit-transform:scale(1);}}.css-dnt51r,[data-css-dnt51r]{animation:pulseAnimation_1przkct 1.8s cubic-bezier(0, 0, 0.58, 1) both infinite;-webkit-animation:pulseAnimation_1przkct 1.8s cubic-bezier(0, 0, 0.58, 1) both infinite;}.css-q4k7k7,[data-css-q4k7k7]{border:none;background-color:transparent;-webkit-appearance:none;-moz-appearance:none;-webkit-font-smoothing:antialiased;}.css-q4k7k7:focus,[data-css-q4k7k7]:focus,.css-q4k7k7[data-simulate-focus],[data-css-q4k7k7][data-simulate-focus]{outline:none;}.css-q4k7k7::placeholder,[data-css-q4k7k7]::placeholder,.css-q4k7k7[data-simulate-placeholder],[data-css-q4k7k7][data-simulate-placeholder]{color:rgba(67, 90, 111, 0.7);}@-webkit-keyframes rotate360InAnimation_e4x7vx{from{transform:translateX(100%) rotate(0deg);-webkit-transform:translateX(100%) rotate(0deg);}to{transform:translateX(-100%) rotate(-360deg);-webkit-transform:translateX(-100%) rotate(-360deg);}}@-moz-keyframes rotate360InAnimation_e4x7vx{from{transform:translateX(100%) rotate(0deg);-webkit-transform:translateX(100%) rotate(0deg);}to{transform:translateX(-100%) rotate(-360deg);-webkit-transform:translateX(-100%) rotate(-360deg);}}@-o-keyframes rotate360InAnimation_e4x7vx{from{transform:translateX(100%) rotate(0deg);-webkit-transform:translateX(100%) rotate(0deg);}to{transform:translateX(-100%) rotate(-360deg);-webkit-transform:translateX(-100%) rotate(-360deg);}}@keyframes rotate360InAnimation_e4x7vx{from{transform:translateX(100%) rotate(0deg);-webkit-transform:translateX(100%) rotate(0deg);}to{transform:translateX(-100%) rotate(-360deg);-webkit-transform:translateX(-100%) rotate(-360deg);}}@-webkit-keyframes rotate360OutAnimation_1swhwyo{from{transform:translateX(-100%) rotate(0deg);-webkit-transform:translateX(-100%) rotate(0deg);}to{transform:translateX(100%) rotate(360deg);-webkit-transform:translateX(100%) rotate(360deg);}}@-moz-keyframes rotate360OutAnimation_1swhwyo{from{transform:translateX(-100%) rotate(0deg);-webkit-transform:translateX(-100%) rotate(0deg);}to{transform:translateX(100%) rotate(360deg);-webkit-transform:translateX(100%) rotate(360deg);}}@-o-keyframes rotate360OutAnimation_1swhwyo{from{transform:translateX(-100%) rotate(0deg);-webkit-transform:translateX(-100%) rotate(0deg);}to{transform:translateX(100%) rotate(360deg);-webkit-transform:translateX(100%) rotate(360deg);}}@keyframes rotate360OutAnimation_1swhwyo{from{transform:translateX(-100%) rotate(0deg);-webkit-transform:translateX(-100%) rotate(0deg);}to{transform:translateX(100%) rotate(360deg);-webkit-transform:translateX(100%) rotate(360deg);}}@-webkit-keyframes leftRotate360InAnimation_1uxpfmf{from{transform:translateX(-100%) rotate(0deg);-webkit-transform:translateX(-100%) rotate(0deg);}to{transform:translateX(100%), rotate(360deg);-webkit-transform:translateX(100%), rotate(360deg);}}@-moz-keyframes leftRotate360InAnimation_1uxpfmf{from{transform:translateX(-100%) rotate(0deg);-webkit-transform:translateX(-100%) rotate(0deg);}to{transform:translateX(100%), rotate(360deg);-webkit-transform:translateX(100%), rotate(360deg);}}@-o-keyframes leftRotate360InAnimation_1uxpfmf{from{transform:translateX(-100%) rotate(0deg);-webkit-transform:translateX(-100%) rotate(0deg);}to{transform:translateX(100%), rotate(360deg);-webkit-transform:translateX(100%), rotate(360deg);}}@keyframes leftRotate360InAnimation_1uxpfmf{from{transform:translateX(-100%) rotate(0deg);-webkit-transform:translateX(-100%) rotate(0deg);}to{transform:translateX(100%), rotate(360deg);-webkit-transform:translateX(100%), rotate(360deg);}}@-webkit-keyframes leftRotate360OutAnimation_znl0n0{from{transform:translateX(100%) rotate(0deg);-webkit-transform:translateX(100%) rotate(0deg);}to{transform:translateX(-100%), rotate(360deg);-webkit-transform:translateX(-100%), rotate(360deg);}}@-moz-keyframes leftRotate360OutAnimation_znl0n0{from{transform:translateX(100%) rotate(0deg);-webkit-transform:translateX(100%) rotate(0deg);}to{transform:translateX(-100%), rotate(360deg);-webkit-transform:translateX(-100%), rotate(360deg);}}@-o-keyframes leftRotate360OutAnimation_znl0n0{from{transform:translateX(100%) rotate(0deg);-webkit-transform:translateX(100%) rotate(0deg);}to{transform:translateX(-100%), rotate(360deg);-webkit-transform:translateX(-100%), rotate(360deg);}}@keyframes leftRotate360OutAnimation_znl0n0{from{transform:translateX(100%) rotate(0deg);-webkit-transform:translateX(100%) rotate(0deg);}to{transform:translateX(-100%), rotate(360deg);-webkit-transform:translateX(-100%), rotate(360deg);}}@-webkit-keyframes topRotate360InAnimation_1iarriy{from{transform:translateY(-200%) rotate(0deg);-webkit-transform:translateY(-200%) rotate(0deg);}to{transform:translateY(0%), rotate(360deg);-webkit-transform:translateY(0%), rotate(360deg);}}@-moz-keyframes topRotate360InAnimation_1iarriy{from{transform:translateY(-200%) rotate(0deg);-webkit-transform:translateY(-200%) rotate(0deg);}to{transform:translateY(0%), rotate(360deg);-webkit-transform:translateY(0%), rotate(360deg);}}@-o-keyframes topRotate360InAnimation_1iarriy{from{transform:translateY(-200%) rotate(0deg);-webkit-transform:translateY(-200%) rotate(0deg);}to{transform:translateY(0%), rotate(360deg);-webkit-transform:translateY(0%), rotate(360deg);}}@keyframes topRotate360InAnimation_1iarriy{from{transform:translateY(-200%) rotate(0deg);-webkit-transform:translateY(-200%) rotate(0deg);}to{transform:translateY(0%), rotate(360deg);-webkit-transform:translateY(0%), rotate(360deg);}}@-webkit-keyframes topRotate360OutAnimation_w5ju0m{from{transform:translateY(0%) rotate(0deg);-webkit-transform:translateY(0%) rotate(0deg);}to{transform:translateY(-200%), rotate(360deg);-webkit-transform:translateY(-200%), rotate(360deg);}}@-moz-keyframes topRotate360OutAnimation_w5ju0m{from{transform:translateY(0%) rotate(0deg);-webkit-transform:translateY(0%) rotate(0deg);}to{transform:translateY(-200%), rotate(360deg);-webkit-transform:translateY(-200%), rotate(360deg);}}@-o-keyframes topRotate360OutAnimation_w5ju0m{from{transform:translateY(0%) rotate(0deg);-webkit-transform:translateY(0%) rotate(0deg);}to{transform:translateY(-200%), rotate(360deg);-webkit-transform:translateY(-200%), rotate(360deg);}}@keyframes topRotate360OutAnimation_w5ju0m{from{transform:translateY(0%) rotate(0deg);-webkit-transform:translateY(0%) rotate(0deg);}to{transform:translateY(-200%), rotate(360deg);-webkit-transform:translateY(-200%), rotate(360deg);}}@-webkit-keyframes bottomRotate360InAnimation_1k0qqcf{from{transform:translateY(200%) rotate(0deg);-webkit-transform:translateY(200%) rotate(0deg);}to{transform:translateY(0%), rotate(360deg);-webkit-transform:translateY(0%), rotate(360deg);}}@-moz-keyframes bottomRotate360InAnimation_1k0qqcf{from{transform:translateY(200%) rotate(0deg);-webkit-transform:translateY(200%) rotate(0deg);}to{transform:translateY(0%), rotate(360deg);-webkit-transform:translateY(0%), rotate(360deg);}}@-o-keyframes bottomRotate360InAnimation_1k0qqcf{from{transform:translateY(200%) rotate(0deg);-webkit-transform:translateY(200%) rotate(0deg);}to{transform:translateY(0%), rotate(360deg);-webkit-transform:translateY(0%), rotate(360deg);}}@keyframes bottomRotate360InAnimation_1k0qqcf{from{transform:translateY(200%) rotate(0deg);-webkit-transform:translateY(200%) rotate(0deg);}to{transform:translateY(0%), rotate(360deg);-webkit-transform:translateY(0%), rotate(360deg);}}@-webkit-keyframes bottomRotate360OutAnimation_1m9tq8h{from{transform:translateY(0%) rotate(0deg);-webkit-transform:translateY(0%) rotate(0deg);}to{transform:translateY(200%), rotate(360deg);-webkit-transform:translateY(200%), rotate(360deg);}}@-moz-keyframes bottomRotate360OutAnimation_1m9tq8h{from{transform:translateY(0%) rotate(0deg);-webkit-transform:translateY(0%) rotate(0deg);}to{transform:translateY(200%), rotate(360deg);-webkit-transform:translateY(200%), rotate(360deg);}}@-o-keyframes bottomRotate360OutAnimation_1m9tq8h{from{transform:translateY(0%) rotate(0deg);-webkit-transform:translateY(0%) rotate(0deg);}to{transform:translateY(200%), rotate(360deg);-webkit-transform:translateY(200%), rotate(360deg);}}@keyframes bottomRotate360OutAnimation_1m9tq8h{from{transform:translateY(0%) rotate(0deg);-webkit-transform:translateY(0%) rotate(0deg);}to{transform:translateY(200%), rotate(360deg);-webkit-transform:translateY(200%), rotate(360deg);}}@-webkit-keyframes anchoredLeftSlideInAnimation_1hg44x7{from{transform:translateX(-100%);-webkit-transform:translateX(-100%);}to{transform:translateX(0);-webkit-transform:translateX(0);}}@-moz-keyframes anchoredLeftSlideInAnimation_1hg44x7{from{transform:translateX(-100%);-webkit-transform:translateX(-100%);}to{transform:translateX(0);-webkit-transform:translateX(0);}}@-o-keyframes anchoredLeftSlideInAnimation_1hg44x7{from{transform:translateX(-100%);-webkit-transform:translateX(-100%);}to{transform:translateX(0);-webkit-transform:translateX(0);}}@keyframes anchoredLeftSlideInAnimation_1hg44x7{from{transform:translateX(-100%);-webkit-transform:translateX(-100%);}to{transform:translateX(0);-webkit-transform:translateX(0);}}@-webkit-keyframes anchoredLeftSlideOutAnimation_rnri27{from{transform:translateX(0);-webkit-transform:translateX(0);}to{transform:translateX(-100%);-webkit-transform:translateX(-100%);}}@-moz-keyframes anchoredLeftSlideOutAnimation_rnri27{from{transform:translateX(0);-webkit-transform:translateX(0);}to{transform:translateX(-100%);-webkit-transform:translateX(-100%);}}@-o-keyframes anchoredLeftSlideOutAnimation_rnri27{from{transform:translateX(0);-webkit-transform:translateX(0);}to{transform:translateX(-100%);-webkit-transform:translateX(-100%);}}@keyframes anchoredLeftSlideOutAnimation_rnri27{from{transform:translateX(0);-webkit-transform:translateX(0);}to{transform:translateX(-100%);-webkit-transform:translateX(-100%);}}@-webkit-keyframes anchoredRightSlideInAnimation_1y6fmrc{from{transform:translateX(100%);-webkit-transform:translateX(100%);}to{transform:translateX(0);-webkit-transform:translateX(0);}}@-moz-keyframes anchoredRightSlideInAnimation_1y6fmrc{from{transform:translateX(100%);-webkit-transform:translateX(100%);}to{transform:translateX(0);-webkit-transform:translateX(0);}}@-o-keyframes anchoredRightSlideInAnimation_1y6fmrc{from{transform:translateX(100%);-webkit-transform:translateX(100%);}to{transform:translateX(0);-webkit-transform:translateX(0);}}@keyframes anchoredRightSlideInAnimation_1y6fmrc{from{transform:translateX(100%);-webkit-transform:translateX(100%);}to{transform:translateX(0);-webkit-transform:translateX(0);}}@-webkit-keyframes anchoredRightSlideOutAnimation_8h6vp3{from{transform:translateX(0);-webkit-transform:translateX(0);}to{transform:translateX(100%);-webkit-transform:translateX(100%);}}@-moz-keyframes anchoredRightSlideOutAnimation_8h6vp3{from{transform:translateX(0);-webkit-transform:translateX(0);}to{transform:translateX(100%);-webkit-transform:translateX(100%);}}@-o-keyframes anchoredRightSlideOutAnimation_8h6vp3{from{transform:translateX(0);-webkit-transform:translateX(0);}to{transform:translateX(100%);-webkit-transform:translateX(100%);}}@keyframes anchoredRightSlideOutAnimation_8h6vp3{from{transform:translateX(0);-webkit-transform:translateX(0);}to{transform:translateX(100%);-webkit-transform:translateX(100%);}}@-webkit-keyframes anchoredTopSlideInAnimation_8z9rxa{from{transform:translateY(-100%);-webkit-transform:translateY(-100%);}to{transform:translateY(0);-webkit-transform:translateY(0);}}@-moz-keyframes anchoredTopSlideInAnimation_8z9rxa{from{transform:translateY(-100%);-webkit-transform:translateY(-100%);}to{transform:translateY(0);-webkit-transform:translateY(0);}}@-o-keyframes anchoredTopSlideInAnimation_8z9rxa{from{transform:translateY(-100%);-webkit-transform:translateY(-100%);}to{transform:translateY(0);-webkit-transform:translateY(0);}}@keyframes anchoredTopSlideInAnimation_8z9rxa{from{transform:translateY(-100%);-webkit-transform:translateY(-100%);}to{transform:translateY(0);-webkit-transform:translateY(0);}}@-webkit-keyframes anchoredTopSlideOutAnimation_ns0rt0{from{transform:translateY(0);-webkit-transform:translateY(0);}to{transform:translateY(-100%);-webkit-transform:translateY(-100%);}}@-moz-keyframes anchoredTopSlideOutAnimation_ns0rt0{from{transform:translateY(0);-webkit-transform:translateY(0);}to{transform:translateY(-100%);-webkit-transform:translateY(-100%);}}@-o-keyframes anchoredTopSlideOutAnimation_ns0rt0{from{transform:translateY(0);-webkit-transform:translateY(0);}to{transform:translateY(-100%);-webkit-transform:translateY(-100%);}}@keyframes anchoredTopSlideOutAnimation_ns0rt0{from{transform:translateY(0);-webkit-transform:translateY(0);}to{transform:translateY(-100%);-webkit-transform:translateY(-100%);}}@-webkit-keyframes anchoredBottomSlideInAnimation_1axypox{from{transform:translateY(100%);-webkit-transform:translateY(100%);}to{transform:translateY(0);-webkit-transform:translateY(0);}}@-moz-keyframes anchoredBottomSlideInAnimation_1axypox{from{transform:translateY(100%);-webkit-transform:translateY(100%);}to{transform:translateY(0);-webkit-transform:translateY(0);}}@-o-keyframes anchoredBottomSlideInAnimation_1axypox{from{transform:translateY(100%);-webkit-transform:translateY(100%);}to{transform:translateY(0);-webkit-transform:translateY(0);}}@keyframes anchoredBottomSlideInAnimation_1axypox{from{transform:translateY(100%);-webkit-transform:translateY(100%);}to{transform:translateY(0);-webkit-transform:translateY(0);}}@-webkit-keyframes anchoredBottomSlideOutAnimation_1fdetvy{from{transform:translateY(0);-webkit-transform:translateY(0);}to{transform:translateY(100%);-webkit-transform:translateY(100%);}}@-moz-keyframes anchoredBottomSlideOutAnimation_1fdetvy{from{transform:translateY(0);-webkit-transform:translateY(0);}to{transform:translateY(100%);-webkit-transform:translateY(100%);}}@-o-keyframes anchoredBottomSlideOutAnimation_1fdetvy{from{transform:translateY(0);-webkit-transform:translateY(0);}to{transform:translateY(100%);-webkit-transform:translateY(100%);}}@keyframes anchoredBottomSlideOutAnimation_1fdetvy{from{transform:translateY(0);-webkit-transform:translateY(0);}to{transform:translateY(100%);-webkit-transform:translateY(100%);}}.css-13qcn8a,[data-css-13qcn8a]{background-color:#fff;border-radius:9999px;}.css-17bhmw6,[data-css-17bhmw6]{transition:all 500ms cubic-bezier(0.175, 0.885, 0.320, 1.175);opacity:0;display:-webkit-box; display: -moz-box; display: -ms-flexbox; display: -webkit-flex; display: flex;position:absolute;align-items:center;justify-content:center;padding-left:4px;-webkit-transition:all 500ms cubic-bezier(0.175, 0.885, 0.320, 1.175);-moz-transition:all 500ms cubic-bezier(0.175, 0.885, 0.320, 1.175);-webkit-box-align:center;-webkit-align-items:center;-webkit-box-pack:center;-webkit-justify-content:center;}.css-17bhmw6[data-checked="true"],[data-css-17bhmw6][data-checked="true"]{opacity:1;transform:scale(1);-webkit-transform:scale(1);}.css-17bhmw6> svg,[data-css-17bhmw6]> svg{transition:all 500ms cubic-bezier(0.175, 0.885, 0.320, 1.175);transform:scale(0);-webkit-transition:all 500ms cubic-bezier(0.175, 0.885, 0.320, 1.175);-moz-transition:all 500ms cubic-bezier(0.175, 0.885, 0.320, 1.175);-webkit-transform:scale(0);}.css-17bhmw6[data-checked="true"] > svg,[data-css-17bhmw6][data-checked="true"] > svg{transform:scale(1);-webkit-transform:scale(1);}.css-1rprxtl,[data-css-1rprxtl]{transition:-webkit-transform 200ms ease-in-out,transform 200ms ease-in-out;transform:translateX(0%);-webkit-transition:-webkit-transform 200ms ease-in-out,transform 200ms ease-in-out;-moz-transition:transform 200ms ease-in-out;-webkit-transform:translateX(0%);}.css-1rprxtl[data-checked="true"],[data-css-1rprxtl][data-checked="true"]{transform:translateX(50%);-webkit-transform:translateX(50%);}.css-b61p4k:hover,[data-css-b61p4k]:hover,.css-b61p4k[data-simulate-hover],[data-css-b61p4k][data-simulate-hover]{color:#2952CC;}.css-b61p4k:active,[data-css-b61p4k]:active,.css-b61p4k[data-simulate-active],[data-css-b61p4k][data-simulate-active]{color:#1F3D99;}.css-b61p4k:focus,[data-css-b61p4k]:focus,.css-b61p4k[data-simulate-focus],[data-css-b61p4k][data-simulate-focus]{box-shadow:0 0 0 2px #ADC2FF;}.css-178dftq,[data-css-178dftq]{fill:#696f8c;}.css-12rdf6g,[data-css-12rdf6g]{-moz-appearance:none;-webkit-appearance:none;-webkit-font-smoothing:antialiased;}.css-12rdf6g::placeholder,[data-css-12rdf6g]::placeholder,.css-12rdf6g[data-simulate-placeholder],[data-css-12rdf6g][data-simulate-placeholder]{color:#8f95b2;}.css-12rdf6g:disabled,[data-css-12rdf6g]:disabled,.css-12rdf6g[data-simulate-disabled],[data-css-12rdf6g][data-simulate-disabled]{cursor:not-allowed;background-color:#F4F5F9;color:#696f8c;}.css-12rdf6g:focus,[data-css-12rdf6g]:focus,.css-12rdf6g[data-simulate-focus],[data-css-12rdf6g][data-simulate-focus]{z-index:2;box-shadow:0 0 0 2px #D6E0FF;border-color:#ADC2FF;}.css-12rdf6g[aria-invalid="true"]:not(:focus),[data-css-12rdf6g][aria-invalid="true"]:not(:focus){border-color:#D14343;}.css-xm294u,[data-css-xm294u]{fill:#FFB020;}.css-12b25td,[data-css-12b25td]{-webkit-font-smoothing:antialiased;-webkit-appearance:none;-moz-appearance:none;}.css-12b25td::-moz-focus-inner ,[data-css-12b25td]::-moz-focus-inner {border:0;}.css-12b25td:not([disabled]):focus,[data-css-12b25td]:not([disabled]):focus,.css-12b25td[data-simulate-notdisabledfocus],[data-css-12b25td][data-simulate-notdisabledfocus]{box-shadow:0 0 0 2px #D6E0FF;}.css-12b25td[disabled],[data-css-12b25td][disabled]{cursor:not-allowed;pointer-events:none;color:#c1c4d6;border-color:#E6E8F0;}.css-12b25td:not([disabled]):hover,[data-css-12b25td]:not([disabled]):hover,.css-12b25td[data-simulate-notdisabledhover],[data-css-12b25td][data-simulate-notdisabledhover]{border:1px solid #8f95b2;background-color:#FAFBFF;}.css-12b25td:not([disabled]):active,[data-css-12b25td]:not([disabled]):active, .css-12b25td:not([disabled])[aria-expanded="true"], [data-css-12b25td]:not([disabled])[aria-expanded="true"], .css-12b25td:not([disabled])[data-active], [data-css-12b25td]:not([disabled])[data-active]{background-color:#F4F5F9;}.css-ber32g[data-isselectable="true"]:focus,[data-css-ber32g][data-isselectable="true"]:focus, .css-ber32g[aria-expanded="true"][aria-haspopup="true"], [data-css-ber32g][aria-expanded="true"][aria-haspopup="true"]{outline:none;background:#EBF0FF;box-shadow:inset 0 0 0 1px #3366FF;}.css-c4d79v,[data-css-c4d79v]{fill:currentColor;}.css-1ipoqbj,[data-css-1ipoqbj]{stroke-dashoffset:600;stroke-dasharray:300;stroke-width:12;stroke-miterlimit:10;stroke-linecap:round;animation:loading-circle_fv6wzy 1.6s cubic-bezier(0.4, 0.15, 0.6, 0.85) infinite;stroke:rgba(67, 90, 111, 0.47);fill:transparent;-webkit-animation:loading-circle_fv6wzy 1.6s cubic-bezier(0.4, 0.15, 0.6, 0.85) infinite;}.css-h0rce1,[data-css-h0rce1]{fill:#52BD95;}.css-9r9n92[data-isselectable="true"],[data-css-9r9n92][data-isselectable="true"]{cursor:pointer;}.css-9r9n92[data-isselectable="true"]:not([aria-current="true"]):not([aria-checked="true"]):not(:focus):not(:active):hover,[data-css-9r9n92][data-isselectable="true"]:not([aria-current="true"]):not([aria-checked="true"]):not(:focus):not(:active):hover{background-color:#F9FAFC;}.css-9r9n92[data-isselectable="true"]:not([aria-checked="true"]):not([aria-current="true"]):focus,[data-css-9r9n92][data-isselectable="true"]:not([aria-checked="true"]):not([aria-current="true"]):focus, .css-9r9n92[aria-selected="true"], [data-css-9r9n92][aria-selected="true"]{background-color:#F9FAFC;}.css-9r9n92[aria-current="true"],[data-css-9r9n92][aria-current="true"], .css-9r9n92[data-isselectable="true"]:active, [data-css-9r9n92][data-isselectable="true"]:active{background-color:#F3F6FF;}.css-9r9n92[aria-current="true"],[data-css-9r9n92][aria-current="true"], .css-9r9n92[aria-checked="true"], [data-css-9r9n92][aria-checked="true"]{background-color:#F3F6FF;}.css-1tyjqqv,[data-css-1tyjqqv]{-webkit-font-smoothing:antialiased;-webkit-appearance:none;-moz-appearance:none;}.css-1tyjqqv::-moz-focus-inner ,[data-css-1tyjqqv]::-moz-focus-inner {border:0;}.css-1tyjqqv:not([disabled]):focus,[data-css-1tyjqqv]:not([disabled]):focus,.css-1tyjqqv[data-simulate-notdisabledfocus],[data-css-1tyjqqv][data-simulate-notdisabledfocus]{box-shadow:0 0 0 2px #D6E0FF;}.css-1tyjqqv[disabled],[data-css-1tyjqqv][disabled]{cursor:not-allowed;pointer-events:none;color:#c1c4d6;opacity:0.6;}.css-1tyjqqv:not([disabled]):hover,[data-css-1tyjqqv]:not([disabled]):hover,.css-1tyjqqv[data-simulate-notdisabledhover],[data-css-1tyjqqv][data-simulate-notdisabledhover]{background-color:#F4F5F9;}.css-1tyjqqv:not([disabled]):active,[data-css-1tyjqqv]:not([disabled]):active, .css-1tyjqqv:not([disabled])[aria-expanded="true"], [data-css-1tyjqqv]:not([disabled])[aria-expanded="true"], .css-1tyjqqv:not([disabled])[data-active], [data-css-1tyjqqv]:not([disabled])[data-active]{background-color:#edeff5;}
.ub-bg_nrwqn2 {
  background: #FAFBFF;
}
.ub-bg_nrwqn2 {
  padding-bottom: 2vw;
}
.ub-h_100prcnt {
  height: 100%;
}
.ub-box-szg_border-box {
  box-sizing: border-box;
}
.ub-bg_11ev722 {
  background: white;
}
.ub-bs_17bru36 {
  box-shadow: 0 0 1px rgba(67, 90, 111, 0.3), 0 2px 4px -2px rgba(67, 90, 111, 0.47);
}
.ub-b-btm_1px-solid-E6E8F0 {
  border-bottom: 1px solid #E6E8F0;
}
.ub-dspl_flex {
  display: -webkit-box;
  display: -moz-box;
  display: -ms-flexbox;
  display: -webkit-flex;
  display: flex;
}
.ub-flx_1-1-60prcnt {
  flex: 1 1 60%;
}
.ub-fnt-sze_14px {
  font-size: 14px;
}
.ub-f-wght_400 {
  font-weight: 400;
}
.ub-ln-ht_20px {
  line-height: 20px;
}
.ub-ltr-spc_-0-05px {
  letter-spacing: -0.05px;
}
.ub-fnt-fam_b77syt {
  font-family: "SF UI Text", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
}
.ub-color_3366FF {
  color: #3366FF;
}
.ub-txt-deco_none {
  text-decoration: none;
}
.ub-bblr_4px {
  border-bottom-left-radius: 4px;
}
.ub-bbrr_4px {
  border-bottom-right-radius: 4px;
}
.ub-btlr_4px {
  border-top-left-radius: 4px;
}
.ub-btrr_4px {
  border-top-right-radius: 4px;
}
.ub-tstn_jgs65e {
  transition: 120ms all ease-in-out;
}
.ub-flx-drct_row {
  flex-direction: row;
  -webkit-box-orient: horizontal;
  -webkit-box-direction: normal;
}
.ub-algn-itms_center {
  align-items: center;
  -webkit-box-align: center;
}
.ub-mt_0px {
  margin-top: 0px;
}
.ub-mb_0px {
  margin-bottom: 0px;
}
.ub-color_101840 {
  color: #101840;
}
.ub-fnt-fam_1r2by5s {
  font-family: Titillium Web;
}
.ub-f-wght_600 {
  font-weight: 600;
}
.ub-fnt-sze_24px {
  font-size: 24px;
}
.ub-ln-ht_32px {
  line-height: 32px;
}
.ub-ltr-spc_-0-2px {
  letter-spacing: -0.2px;
}
.ub-ml_16px {
  margin-left: 16px;
}
.ub-mr_16px {
  margin-right: 16px;
}
.ub-just-cnt_center {
  justify-content: center;
  -webkit-box-pack: center;
}
.ub-pst_relative {
  position: relative;
}
.ub-dspl_inline-flex {
  display: -webkit-inline-box;
  display: -moz-inline-box;
  display: -ms-inline-flexbox;
  display: -webkit-inline-flex;
  display: inline-flex;
}
.ub-h_24px {
  height: 24px;
}
.ub-w_100prcnt {
  width: 100%;
}
.ub-flx_1-1-100prcnt {
  flex: 1 1 100%;
}
.ub-w_24px {
  width: 24px;
}
.ub-ptr-evts_none {
  pointer-events: none;
}
.ub-pst_absolute {
  position: absolute;
}
.ub-z-idx_3 {
  z-index: 3;
}
.ub-w_12px {
  width: 12px;
}
.ub-h_12px {
  height: 12px;
}
.ub-b-btm_1px-solid-transparent {
  border-bottom: 1px solid transparent;
}
.ub-b-lft_1px-solid-transparent {
  border-left: 1px solid transparent;
}
.ub-b-rgt_1px-solid-transparent {
  border-right: 1px solid transparent;
}
.ub-b-top_1px-solid-transparent {
  border-top: 1px solid transparent;
}
.ub-otln_iu2jf4 {
  outline: none;
}
.ub-ln-ht_16px {
  line-height: 16px;
}
.ub-fnt-sze_12px {
  font-size: 12px;
}
.ub-color_474d66 {
  color: #474d66;
}
.ub-pl_24px {
  padding-left: 24px;
}
.ub-pr_12px {
  padding-right: 12px;
}
.ub-tstn_n1akt6 {
  transition: box-shadow 80ms ease-in-out;
}
.ub-bg-clr_white {
  background-color: white;
}
.ub-b-btm-clr_d8dae5 {
  border-bottom-color: #d8dae5;
}
.ub-b-lft-clr_d8dae5 {
  border-left-color: #d8dae5;
}
.ub-b-rgt-clr_d8dae5 {
  border-right-color: #d8dae5;
}
.ub-b-top-clr_d8dae5 {
  border-top-color: #d8dae5;
}
.ub-ltr-spc_0 {
  letter-spacing: 0;
}
.ub-algn-itms_left {
  align-items: left;
  -webkit-box-align: left;
}
.ub-pl_48px {
  padding-left: 48px;
}
.ub-pr_48px {
  padding-right: 48px;
}
.ub-pb_8px {
  padding-bottom: 8px;
}
.ub-pt_8px {
  padding-top: 8px;
}
.ub-mr_4px {
  margin-right: 4px;
}
.ub-flx-srnk_0 {
  flex-shrink: 0;
}
.ub-mr_8px {
  margin-right: 8px;
}
.ub-w_10px {
  width: 10px;
}
.ub-h_10px {
  height: 10px;
}
.ub-ml_48px {
  margin-left: 48px;
}
.ub-mr_48px {
  margin-right: 48px;
}
.ub-mt_24px {
  margin-top: 24px;
}
.ub-mb_16px {
  margin-bottom: 16px;
}
.ub-color_425A70 {
  color: #425A70;
}
.ub-fnt-sze_20px {
  font-size: 20px;
}
.ub-ln-ht_24px {
  line-height: 24px;
}
.ub-ltr-spc_-0-07px {
  letter-spacing: -0.07px;
}
.ub-txt-trns_uppercase {
  text-transform: uppercase;
}
.ub-mt_16px {
  margin-top: 16px;
}
.ub-mb_8px {
  margin-bottom: 8px;
}
.ub-flx-wrap_nowrap {
  flex-wrap: nowrap;
  -webkit-box-lines: nowrap;
}
.ub-ver-algn_middle {
  vertical-align: middle;
}
.ub-b-btm_1px-solid-c1c4d6 {
  border-bottom: 1px solid #c1c4d6;
}
.ub-b-lft_1px-solid-c1c4d6 {
  border-left: 1px solid #c1c4d6;
}
.ub-b-rgt_1px-solid-c1c4d6 {
  border-right: 1px solid #c1c4d6;
}
.ub-b-top_1px-solid-c1c4d6 {
  border-top: 1px solid #c1c4d6;
}
.ub-usr-slct_none {
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
.ub-crsr_pointer {
  cursor: pointer;
}
.ub-wht-spc_nowrap {
  white-space: nowrap;
}
.ub-min-w_32px {
  min-width: 32px;
}
.ub-pl_16px {
  padding-left: 16px;
}
.ub-pr_16px {
  padding-right: 16px;
}
.ub-ml_4px {
  margin-left: 4px;
}
.ub-ovflw-x_auto {
  overflow-x: auto;
}
.ub-ovflw-y_auto {
  overflow-y: auto;
}
.ub-flx_1 {
  flex: 1;
}
.ub-b-top_1px-solid-edeff5 {
  border-top: 1px solid #edeff5;
}
.ub-b-rgt_1px-solid-edeff5 {
  border-right: 1px solid #edeff5;
}
.ub-b-btm_1px-solid-edeff5 {
  border-bottom: 1px solid #edeff5;
}
.ub-b-lft_1px-solid-edeff5 {
  border-left: 1px solid #edeff5;
}
.ub-bg_wivy90 {
  background: #F9FAFC;
}
.ub-pr_0 {
  padding-right: 0;
}
.ub-h_56px {
  height: 56px;
}
.ub-color_696f8c {
  color: #696f8c;
}
.ub-pb_0 {
  padding-bottom: 0;
}
.ub-pl_0 {
  padding-left: 0;
}
.ub-pt_0 {
  padding-top: 0;
}
.ub-flx_1-1-2prcnt {
  flex: 1 1 2%;
}
.ub-ovflw-x_visible {
  overflow-x: visible;
}
.ub-ovflw-y_visible {
  overflow-y: visible;
}
.ub-pl_8px {
  padding-left: 8px;
}
.ub-pr_8px {
  padding-right: 8px;
}
.ub-txt-algn_center {
  text-align: center;
}
.ub-w_16px {
  width: 16px;
}
.ub-h_16px {
  height: 16px;
}
.ub-flx_1-1-10prcnt {
  flex: 1 1 10%;
}
.ub-flx_1-1-5prcnt {
  flex: 1 1 5%;
}
.ub-pl_4px {
  padding-left: 4px;
}
.ub-pr_4px {
  padding-right: 4px;
}
.ub-flx_1-1-40prcnt {
  flex: 1 1 40%;
}
.ub-flx-drct_column {
  flex-direction: column;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
}
.ub-ln-ht_0 {
  line-height: 0;
}
.ub-mt_8px {
  margin-top: 8px;
}
.ub-h_64px {
  height: 64px;
}
.ub-ovflw-x_hidden {
  overflow-x: hidden;
}
.ub-ovflw-y_hidden {
  overflow-y: hidden;
}
.ub-h_32px {
  height: 32px;
}
.ub-bg-clr_transparent {
  background-color: transparent;
}
.ub-flx_none {
  flex: none;
}
.ub-w_32px {
  width: 32px;
}
.ub-ml_0px {
  margin-left: 0px;
}
.ub-mr_0px {
  margin-right: 0px;
}
.ub-w_14px {
  width: 14px;
}
.ub-h_14px {
  height: 14px;
}
.ub-txt-ovrf_ellipsis {
  text-overflow: ellipsis;
}
.ub-color_D9822B {
  color: #D9822B;
}
.ub-color_D14343 {
  color: #D14343;
}
.ub-color_1070CA {
  color: #1070CA;
}
`;

const template = async (self, sharedWorker = {}) => {
  return new Promise(async (resolve, reject) => {
    let component = {};
    component.this = self;
    component.this.style.width = "100%";
    component.this.attachShadow({ mode: "open" });
    component.props = modules(component.this.shadowRoot);
    let styleSheet = document.createElement("style");
    styleSheet.textContent = style;
    component.this.shadowRoot.appendChild(styleSheet);
    component.this.classList.remove("skeleton-box");
    component.this.innerHTML = "";
    resolve(component);
  });
};

export const NewKindControl = (props = {}) => {
  return new Promise((resolve) => {
    try {
      const index = class extends HTMLElement {
        constructor() {
          super();
          template(this, props).catch(error => console.warn("error", error));
        }
      };
      customElements.define("newkind-control", index);
      resolve(props);
    } catch (e) {
      console.error("error", e);
    }
  });
};
