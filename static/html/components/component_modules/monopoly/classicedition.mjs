import mInterface from './interface.mjs'
export default {
	get:(obj, payload,  ...rest)=>{
		return  new Promise((resolve, reject) => {
			function out(obj) {
				resolve(obj)
			}
			function wrr(obj) {
				reject(obj)
			}
			switch (obj['type']) {
				case 'square':
					(async (obj,payload,  rest)=>{
						let square = {}
						square.name = rest[0];
						square.pricetext = rest[1];
						square.color = rest[2];
						square.owner = 0;
						square.mortgage = false;
						square.house = 0;
						square.hotel = 0;
						square.groupNumber = rest[4] || 0;
						square.price = (rest[3]|| 0);
						square.baserent = (rest[5] || 0);
						square.rent1 = (rest[6] || 0);
						square.rent2 = (rest[7] || 0);
						square.rent3 = (rest[8] || 0);
						square.rent4 = (rest[9] || 0);
						square.rent5 = (rest[10] || 0);
						square.landcount = 0;

						if (rest[4] === 3 || rest[4] === 4) {
							square.houseprice = 50;
						} else if (rest[4] === 5 || rest[4] === 6) {
							square.houseprice = 100;
						} else if (rest[4] === 7 || rest[4] === 8) {
							square.houseprice = 150;
						} else if (rest[4] === 9 || rest[4] === 10) {
							square.houseprice = 200;
						} else {
							square.houseprice = 0;
						}

						out(square)
					})(obj, payload, rest)
					break
				case 'card':
					(async (obj,payload, rest)=>{
						let card = {}
						card.text = rest[0];
						card.action = rest[1];
						out(card)
					})(obj, payload, rest)
					break
				case 'corrections':
					(async (obj, payload, rest)=>{
						payload['this'].getElementById("cell1name").textContent = "Mediter-ranean Avenue";
						payload['this'].getElementById("enlarge5token").innerHTML += '<img src="/static/html/components/main-manager/images/train_icon.png"  width="50%" alt="" style="position: relative; bottom: 1.953vw;" />';
						payload['this'].getElementById("enlarge15token").innerHTML += '<img src="/static/html/components/main-manager/images/train_icon.png"  width="50%" alt="" style="position: relative; top: -1.953vw;" />';
						payload['this'].getElementById("enlarge25token").innerHTML += '<img src="/static/html/components/main-manager/images/train_icon.png"  width="50%" alt="" style="position: relative; top: -1.953vw;" />';
						payload['this'].getElementById("enlarge35token").innerHTML += '<img src="/static/html/components/main-manager/images/train_icon.png"  width="50%" alt="" style="position: relative; top: -1.953vw;" />';
						payload['this'].getElementById("enlarge12token").innerHTML += '<img src="/static/html/components/main-manager/images/electric_icon.png"  width="35%" alt="" style="position: relative; top: -1.953vw;" />';
						payload['this'].getElementById("enlarge28token").innerHTML += '<img src="/static/html/components/main-manager/images/water_icon.png"  width="50%" alt="" style="position: relative; top: -1.953vw;" />';
					out(payload)
					})(obj,payload,  rest)
					break
				case 'utiltext':
					(async (obj,payload, rest)=>{
						out( '&nbsp;&nbsp;&nbsp;&nbsp;If one "Utility" is owned rent is 4 times amount shown on dice.<br /><br />&nbsp;&nbsp;&nbsp;&nbsp;If both "Utilitys" are owned rent is 10 times amount shown on dice.');
					})(obj, payload, rest)
					break
				case 'transtext':
					(async (obj, payload, rest)=>{
						out('<div style="font-size: 1.367vw; line-height: 1.5;">Rent<span style="float: right;">$25.</span><br />If 2 Railroads are owned<span style="float: right;">50.</span><br />If 3 &nbsp; &nbsp; " &nbsp; &nbsp; " &nbsp; &nbsp; "<span style="float: right;">100.</span><br />If 4 &nbsp; &nbsp; " &nbsp; &nbsp; " &nbsp; &nbsp; "<span style="float: right;">200.</span></div>')
					})(obj, payload, rest)
					break
				case 'luxurytax':
					(async (obj, payload, rest)=>{
						await mInterface['get']({type:'addAlert', value:`${payload['player'][payload['turn']].name} paid $100 for landing on Luxury Tax.` },payload)
						payload['player'][payload['turn']].pay(100, 0, payload);
						document.querySelector('#landed').style.display = 'flex'
						document.querySelector('#landed').innerText = "You landed on Luxury Tax. Pay $100."
					})(obj, payload, rest)
					break
				case 'citytax':
					(async (obj, payload, rest)=>{
						await mInterface['get']({type:'addAlert', value:`${payload['player'][payload['turn']].name} paid $200 for landing on City Tax.` },payload)
						payload['player'][payload['turn']].pay(200, 0, payload);
						document.querySelector('#landed').style.display = 'flex'
						document.querySelector('#landed').innerText = "You landed on City Tax. Pay $200."
					})(obj, payload, rest)
					break
				default:
					break
			}

		})
	}
}