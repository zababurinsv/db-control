({messageToSend:"",messageResponses:["Why did the web developer leave the restaurant? Because of the table layout.","How do you comfort a JavaScript bug? You console it.",'An SQL query enters a bar, approaches two tables and asks: "May I join you?"',"What is the most used language in programming? Profanity.","What is the object-oriented way to become wealthy? Inheritance.","An SEO expert walks into a bar, bars, pub, tavern, public house, Irish pub, drinks, beer, alcohol"],init:function(){this.cacheDOM(),this.bindEvents(),this.render()},cacheDOM:function(){this.$chatHistory=$(".chat-history"),this.$button=$("button"),this.$textarea=$("#message-to-send"),this.$chatHistoryList=this.$chatHistory.find("ul")},bindEvents:function(){this.$button.on("click",this.addMessage.bind(this)),this.$textarea.on("keyup",this.addMessageEnter.bind(this))},render:function(){if(this.scrollToBottom(),""!==this.messageToSend.trim()){var t=Handlebars.compile($("#message-template").html()),e={messageOutput:this.messageToSend,time:this.getCurrentTime()};this.$chatHistoryList.append(t(e)),this.scrollToBottom(),this.$textarea.val("");var s=Handlebars.compile($("#message-response-template").html()),i={response:this.getRandomItem(this.messageResponses),time:this.getCurrentTime()};setTimeout(function(){this.$chatHistoryList.append(s(i)),this.scrollToBottom()}.bind(this),1500)}},addMessage:function(){this.messageToSend=this.$textarea.val(),this.render()},addMessageEnter:function(t){13===t.keyCode&&this.addMessage()},scrollToBottom:function(){this.$chatHistory.scrollTop(this.$chatHistory[0].scrollHeight)},getCurrentTime:function(){return(new Date).toLocaleTimeString().replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/,"$1$3")},getRandomItem:function(t){return t[Math.floor(Math.random()*t.length)]}}).init(),{options:{valueNames:["name"]},init:function(){var t=new List("people-list",this.options),e=$('<li id="no-items-found">No items found</li>');t.on("updated",function(t){0===t.matchingItems.length?$(t.list).append(e):e.detach()})}}.init();