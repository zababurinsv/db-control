import classicEdition from './classicedition.mjs'
import monopoly from './monopoly.mjs'
export default {
    get:(obj, payload, ...rest)=>{
        return  new Promise((resolve, reject) => {
            function out(obj) {
                resolve(obj)
            }
            function err(obj) {
                reject(obj)
            }
            switch (obj['type']) {
                case 'classic':
                    (async (obj, payload, rest)=>{
                        payload['square'][0] = await classicEdition['get']({type:'square'},payload,"GO", "COLLECT $200 SALARY AS YOU PASS.", "#FFFFFF") ;
                        payload['square'][1] = await classicEdition['get']({type:'square'},payload,"Mediterranean Avenue", "$60", "#8B4513", 60, 3, 2, 10, 30, 90, 160, 250) ;
                        payload['square'][2] = await classicEdition['get']({type:'square'},payload,"Community Chest", "FOLLOW INSTRUCTIONS ON TOP CARD", "#FFFFFF");
                        payload['square'][3] = await classicEdition['get']({type:'square'},payload,"Baltic Avenue", "$60", "#8B4513", 60, 3, 4, 20, 60, 180, 320, 450);
                        payload['square'][4] = await classicEdition['get']({type:'square'},payload,"City Tax", "Pay $200", "#FFFFFF");
                        payload['square'][5] = await classicEdition['get']({type:'square'},payload,"Reading Railroad", "$200", "#FFFFFF", 200, 1);
                        payload['square'][6] = await classicEdition['get']({type:'square'},payload,"Oriental Avenue", "$100", "#87CEEB", 100, 4, 6, 30, 90, 270, 400, 550);
                        payload['square'][7] = await classicEdition['get']({type:'square'},payload,"Chance", "FOLLOW INSTRUCTIONS ON TOP CARD", "#FFFFFF");
                        payload['square'][8] = await classicEdition['get']({type:'square'},payload,"Vermont Avenue", "$100", "#87CEEB", 100, 4, 6, 30, 90, 270, 400, 550);
                        payload['square'][9] = await classicEdition['get']({type:'square'},payload,"Connecticut Avenue", "$120", "#87CEEB", 120, 4, 8, 40, 100, 300, 450, 600);
                        payload['square'][10] = await classicEdition['get']({type:'square'},payload,"Just Visiting", "", "#FFFFFF");
                        payload['square'][11] = await classicEdition['get']({type:'square'},payload,"St. Charles Place", "$140", "#FF0080", 140, 5, 10, 50, 150, 450, 625, 750);
                        payload['square'][12] = await classicEdition['get']({type:'square'},payload,"Electric Company", "$150", "#FFFFFF", 150, 2);
                        payload['square'][13] = await classicEdition['get']({type:'square'},payload,"States Avenue", "$140", "#FF0080", 140, 5, 10, 50, 150, 450, 625, 750);
                        payload['square'][14] = await classicEdition['get']({type:'square'},payload,"Virginia Avenue", "$160", "#FF0080", 160, 5, 12, 60, 180, 500, 700, 900);
                        payload['square'][15] = await classicEdition['get']({type:'square'},payload,"Pennsylvania Railroad", "$200", "#FFFFFF", 200, 1);
                        payload['square'][16] = await classicEdition['get']({type:'square'},payload,"St. James Place", "$180", "#FFA500", 180, 6, 14, 70, 200, 550, 750, 950);
                        payload['square'][17] = await classicEdition['get']({type:'square'},payload,"Community Chest", "FOLLOW INSTRUCTIONS ON TOP CARD", "#FFFFFF");
                        payload['square'][18] = await classicEdition['get']({type:'square'},payload,"Tennessee Avenue", "$180", "#FFA500", 180, 6, 14, 70, 200, 550, 750, 950);
                        payload['square'][19] = await classicEdition['get']({type:'square'},payload,"New York Avenue", "$200", "#FFA500", 200, 6, 16, 80, 220, 600, 800, 1000);
                        payload['square'][20] = await classicEdition['get']({type:'square'},payload,"Free Parking", "", "#FFFFFF");
                        payload['square'][21] = await classicEdition['get']({type:'square'},payload,"Kentucky Avenue", "$220", "#FF0000", 220, 7, 18, 90, 250, 700, 875, 1050);
                        payload['square'][22] = await classicEdition['get']({type:'square'},payload,"Chance", "FOLLOW INSTRUCTIONS ON TOP CARD", "#FFFFFF");
                        payload['square'][23] = await classicEdition['get']({type:'square'},payload,"Indiana Avenue", "$220", "#FF0000", 220, 7, 18, 90, 250, 700, 875, 1050);
                        payload['square'][24] = await classicEdition['get']({type:'square'},payload,"Illinois Avenue", "$240", "#FF0000", 240, 7, 20, 100, 300, 750, 925, 1100);
                        payload['square'][25] = await classicEdition['get']({type:'square'},payload,"B&O Railroad", "$200", "#FFFFFF", 200, 1);
                        payload['square'][26] = await classicEdition['get']({type:'square'},payload,"Atlantic Avenue", "$260", "#FFFF00", 260, 8, 22, 110, 330, 800, 975, 1150);
                        payload['square'][27] = await classicEdition['get']({type:'square'},payload,"Ventnor Avenue", "$260", "#FFFF00", 260, 8, 22, 110, 330, 800, 975, 1150);
                        payload['square'][28] = await classicEdition['get']({type:'square'},payload,"Water Works", "$150", "#FFFFFF", 150, 2);
                        payload['square'][29] = await classicEdition['get']({type:'square'},payload,"Marvin Gardens", "$280", "#FFFF00", 280, 8, 24, 120, 360, 850, 1025, 1200);
                        payload['square'][30] = await classicEdition['get']({type:'square'},payload,"Go to Jail", "Go directly to Jail. Do not pass GO. Do not collect $200.", "#FFFFFF");
                        payload['square'][31] = await classicEdition['get']({type:'square'},payload,"Pacific Avenue", "$300", "#008000", 300, 9, 26, 130, 390, 900, 110, 1275);
                        payload['square'][32] = await classicEdition['get']({type:'square'},payload,"North Carolina Avenue", "$300", "#008000", 300, 9, 26, 130, 390, 900, 110, 1275);
                        payload['square'][33] = await classicEdition['get']({type:'square'},payload,"Community Chest", "FOLLOW INSTRUCTIONS ON TOP CARD", "#FFFFFF");
                        payload['square'][34] = await classicEdition['get']({type:'square'},payload,"Pennsylvania Avenue", "$320", "#008000", 320, 9, 28, 150, 450, 1000, 1200, 1400);
                        payload['square'][35] = await classicEdition['get']({type:'square'},payload,"Short Line", "$200", "#FFFFFF", 200, 1);
                        payload['square'][36] = await classicEdition['get']({type:'square'},payload,"Chance", "FOLLOW INSTRUCTIONS ON TOP CARD", "#FFFFFF");
                        payload['square'][37] = await classicEdition['get']({type:'square'},payload,"Park Place", "$350", "#0000FF", 350, 10, 35, 175, 500, 1100, 1300, 1500);
                        payload['square'][38] = await classicEdition['get']({type:'square'},payload,"LUXURY TAX", "Pay $100", "#FFFFFF");
                        payload['square'][39] = await classicEdition['get']({type:'square'},payload,"Boardwalk", "$400", "#0000FF", 400, 10, 50, 200, 600, 1400, 1700, 2000);




                        payload['communityChestCards'][0] = await classicEdition['get']({type:'card'},payload,"Get out of Jail, Free. This card may be kept until needed or sold.",async function(obj, payload) {

                            //console.assert(false, obj)

                            obj['player'].communityChestJailCard = true;
                            await monopoly['get']({type:'updateOwned',player:obj['player'] },payload)

                        });
                        payload['communityChestCards'][1] = await classicEdition['get']({type:'card'},payload,"You have won second prize in a beauty contest. Collect $10.",async function(obj, payload){



                            await monopoly['get']({type:'addamount', amount:10,cause:'Community Chest' ,player:obj },payload)

                        });
                        payload['communityChestCards'][2] = await classicEdition['get']({type:'card'},payload,"From sale of stock, you get $50.",async function(obj, payload){


                            await monopoly['get']({type:'addamount', amount:50,cause:'Community Chest' ,player:obj },payload)

                        });
                        payload['communityChestCards'][3] = await classicEdition['get']({type:'card'},payload,"Life insurance matures. Collect $100.", async function(obj, payload){



                            await monopoly['get']({type:'addamount', amount:100,cause:'Community Chest' ,player:obj },payload)

                        });
                        payload['communityChestCards'][4] = await classicEdition['get']({type:'card'},payload,"Income tax refund. Collect $20.",async function(obj, payload){



                            await monopoly['get']({type:'addamount', amount:20,cause:'Community Chest' ,player:obj },payload)

                        });
                        payload['communityChestCards'][5] = await classicEdition['get']({type:'card'},payload,"Holiday fund matures. Receive $100.",async function(obj, payload){



                          await  await monopoly['get']({type:'addamount', amount:100,cause:'Community Chest' ,player:obj },payload)

                        });
                        payload['communityChestCards'][6] = await classicEdition['get']({type:'card'},payload,"You inherit $100.", async function(obj, payload){


                            await await monopoly['get']({type:'addamount', amount:100,cause:'Community Chest' ,player:obj },payload)

                        });
                        payload['communityChestCards'][7] = await classicEdition['get']({type:'card'},payload,"Receive $25 consultancy fee.",async function(obj, payload){


                            await await monopoly['get']({type:'addamount', amount:25,cause:'Community Chest' ,player:obj },payload)

                        });
                        payload['communityChestCards'][8] = await classicEdition['get']({type:'card'},payload,"Pay hospital fees of $100.",async function(obj, payload) {

                            //console.assert(false, obj)

                            await await monopoly['get']({type:'subtractamount', amount:100,cause:'Community Chest' ,player:obj },payload)

                        });
                        payload['communityChestCards'][9] = await classicEdition['get']({type:'card'},payload,"Bank error in your favor. Collect $200.",async function(obj, payload) {


                            await await monopoly['get']({type:'addamount', amount:200,cause:'Community Chest',player:obj },payload)

                        });
                        payload['communityChestCards'][10] = await classicEdition['get']({type:'card'},payload,"Pay school fees of $50.",async function(obj, payload){

                            //console.assert(false, obj)

                            await await monopoly['get']({type:'subtractamount', amount:50,cause:'Community Chest' ,player:obj },payload)

                        });
                        payload['communityChestCards'][11] = await classicEdition['get']({type:'card'},payload,"Doctor's fee. Pay $50.",async function(obj, payload){

                            //console.assert(false, obj)

                            await await monopoly['get']({type:'subtractamount', amount:50,cause:'Community Chest' ,player:obj },payload)

                        });
                        payload['communityChestCards'][12] = await classicEdition['get']({type:'card'},payload,"It is your birthday. Collect $10 from every player.",async function(obj, payload){

                            //console.assert(false, obj)

                            await await monopoly['get']({type:'subtractamount', amount:10,cause:'Community Chest' ,player:obj },payload)

                        });
                        payload['communityChestCards'][13] = await classicEdition['get']({type:'card'},payload,"Advance to \"GO\" (Collect $200).",async function(obj, payload){

                            //console.assert(false, payload)

                            await await monopoly['get']({type:'advance', destination:0 ,player:obj },payload)

                        });
                        payload['communityChestCards'][14] = await classicEdition['get']({type:'card'},payload,"You are assessed for street repairs. $40 per house. $115 per hotel.",async function(obj, payload){

                            //console.assert(false, obj)

                            await await monopoly['get']({type:'streetrepairs', houseprice:40, hotelprice:115 ,player:obj },payload)

                        });
                        payload['communityChestCards'][15] = await classicEdition['get']({type:'card'},payload,"Go to Jail. Go directly to Jail. Do not pass \"GO\". Do not collect $200.",async function(obj, payload){

                            //console.assert(false, obj)

                            await await monopoly['get']({type:'gotojail',player:obj },payload)
                        });

                        payload['chanceCards'][0] = await classicEdition['get']({type:'card'},payload,"GET OUT OF JAIL FREE. This card may be kept until needed or traded.",async function(obj, payload) {

                            console.assert(false, payload)
                            payload['player'][payload['turn']]['chanceJailCard'] = true
                            obj.chanceJailCard = true;
                            await await monopoly['get']({type:'updateOwned', player:obj },payload)

                        });
                        payload['chanceCards'][1] = await classicEdition['get']({type:'card'},payload,"Make General Repairs on All Your Property. For each house pay $25. For each hotel $100.",async function(obj, payload){

                            //console.assert(false, obj)

                            await await monopoly['get']({type:'streetrepairs', houseprice:25, hotelprice:100 ,player:obj },payload)

                        });
                        payload['chanceCards'][2] = await classicEdition['get']({type:'card'},payload,"Speeding fine $15.",async function(obj, payload){

                            //console.assert(false, obj)

                            await await monopoly['get']({type:'subtractamount', amount:15, cause:'Chance' ,player:obj },payload)

                        });
                        payload['chanceCards'][3] = await classicEdition['get']({type:'card'},payload,"You have been elected chairman of the board. Pay each player $50.",async function(obj, payload){

                            //console.assert(false, obj)

                            await await monopoly['get']({type:'payeachplayer', amount:50, cause:'Chance' ,player:obj },payload)

                        });
                        payload['chanceCards'][4] = await classicEdition['get']({type:'card'},payload,"Go back three spaces.",async function(obj, payload){

                            //console.assert(false, obj)

                            await await monopoly['get']({type:'gobackthreespaces',player:obj },payload)

                        });
                        payload['chanceCards'][5] = await classicEdition['get']({type:'card'},payload,"ADVANCE TO THE NEAREST UTILITY. IF UNOWNED, you may buy it from the Bank. IF OWNED, throw dice and pay owner a total ten times the amount thrown.",async function(obj, payload){

                            //console.assert(false, obj)

                            await await monopoly['get']({type:'advanceToNearestUtility',player:obj },payload)

                        });
                        payload['chanceCards'][6] = await classicEdition['get']({type:'card'},payload,"Bank pays you dividend of $50.",async function(obj, payload){


                            await await monopoly['get']({type:'addamount', amount: 50, cause: 'Chance',player:obj },payload)

                        });
                        payload['chanceCards'][7] = await classicEdition['get']({type:'card'},payload,"ADVANCE TO THE NEAREST RAILROAD. If UNOWNED, you may buy it from the Bank. If OWNED, pay owner twice the rental to which they are otherwise entitled.",async function(obj, payload){

                            //console.assert(false, obj)

                            await await monopoly['get']({type:'advanceToNearestRailroad',player:obj },payload)

                        });
                        payload['chanceCards'][8] = await classicEdition['get']({type:'card'},payload,"Pay poor tax of $15.",async function(obj, payload){


                            //console.assert(false, payload)

                            await await monopoly['get']({type:'subtractamount', amount: 15, cousr: 'Chance',player:obj },payload)

                        });
                        payload['chanceCards'][9] = await classicEdition['get']({type:'card'},payload,"Take a trip to Reading Rail Road. If you pass \"GO\" collect $200.",async function(obj, payload){

                            //console.assert(false, obj)

                            await await monopoly['get']({type:'advance', destination: 5,player:obj },payload)

                        });
                        payload['chanceCards'][10] = await classicEdition['get']({type:'card'},payload,"ADVANCE to Boardwalk.", async function(obj, payload){

                            //console.assert(false, obj)

                            await await monopoly['get']({type:'advance', destination: 39,player:obj },payload)

                        });
                        payload['chanceCards'][11] = await classicEdition['get']({type:'card'},payload,"ADVANCE to Illinois Avenue. If you pass \"GO\" collect $200.",async function(obj, payload){

                            //console.assert(false, obj)

                            await await monopoly['get']({type:'advance', destination: 24,player:obj },payload)

                        });
                        payload['chanceCards'][12] = await classicEdition['get']({type:'card'},payload,"Your building loan matures. Collect $150.",async function(obj, payload){



                            await await monopoly['get']({type:'addamount', amount: 150, cause: 'Chance',player:obj },payload)

                        });
                        payload['chanceCards'][13] = await classicEdition['get']({type:'card'},payload,"ADVANCE TO THE NEAREST RAILROAD. If UNOWNED, you may buy it from the Bank. If OWNED, pay owner twice the rental to which they are otherwise entitled.",async function(obj, payload){

                            //console.assert(false, obj)

                            await await monopoly['get']({type:'advanceToNearestRailroad',player:obj },payload)

                        });
                        payload['chanceCards'][14] = await classicEdition['get']({type:'card'},payload,"ADVANCE to St. Charles Place. If you pass \"GO\" collect $200.",async function(obj, payload){

                            //console.assert(false, obj)

                            await await monopoly['get']({type:'advance', destination: 11,player:obj },payload)

                        });
                        payload['chanceCards'][15] = await classicEdition['get']({type:'card'},payload,"Go to Jail. Go Directly to Jail. Do not pass \"GO\". Do not collect $200.",async function(obj, payload){

                            //console.assert(false, obj)

                            await await monopoly['get']({type:'gotojail',player:obj },payload)

                        });

                        // //console.assert(false,payload )

                        out(payload)
                    })(obj,payload, rest)
                    break
                default:
                    break
            }

        })
    }
}