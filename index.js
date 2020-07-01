// Supports ES6
// import { create, Whatsapp } from 'sulla';
const { HLTV } = require('hltv')
const myHLTV = HLTV.createInstance({loadPage:(url) => fetch(url)})

var link = "https://www.hltv.org/matches/2316478/sk-vs-virtuspro-epicenter-2017";
var path = link.split('/');
var matchId = path[4];
var i=0;
var tempo = 1000;
var cron;
var ss = 0;
var partidaEncontrada = false;
var playerEncontrado = false;

const venom = require('venom-bot');




venom.create().then((client) => start(client));

function start(client) {

    client.onMessage((message) => {

        if(message.body.toLowerCase() ==='.help'){
            if(ss != 0){
                client.sendText(message.from,"Espere " + (30-ss) + " segundos para usar este comando novamente");
            }
            else if(ss == 0){
                startCountdown();
                client.sendText(message.from,"*Comandos Disponíveis:*\n\n *.score (nome do time)* - Mostra o placar de uma partida ao colocar o nome do time que está jogando.\n\n *.vetos (nome do time)* - Mostra os vetos de uma partida ao colocar o nome do time que está jogando.\n\n*.stats (nick do player)* - Mostra as informações de um jogador.");
            }
        }

        if(message.body.toLowerCase().includes('.stats')){

            var playerName = message.body.split(".stats ",2)[1];

            if(ss != 0){
                client.sendText(message.from,"Espere " + (30-ss) + " segundos para usar este comando novamente");
            }
            else if(ss == 0){
                startCountdown();
                procurarPlayer();
            }
        }

        async function procurarPlayer(){
            await HLTV.getPlayerByName({name: playerName}).then((res) =>{

                if(!res){
                    playerEncontrado = false;
                    client.sendText(message.from,"O jogador *" + playerName+ "* não foi encontrado");
                }
                else{
                    playerEncontrado = true;
                    
                    client.sendText(message.from,"Player: " + res.name + " \n\nIdade:"+ res.age +"\nRating: " + res.statistics.rating + "\nKills por round: "+ res.statistics.killsPerRound +"\nMapas jogados: "+ res.statistics.mapsPlayed +"\nHeadshots:"+ res.statistics.headshots+"\nMortes por round: " +res.statistics.deathsPerRound+"\nRounds contribuídos: " +res.statistics.roundsContributed + "\n\n*REDES SOCIAIS*\n\nTwitter: "+res.twitter+"\nTwitch: "+ res.twitch + "\nFacebook: " + res.facebook);
                }
                
            })
        }

        if(message.body.toLowerCase().includes('.score')){

            var TeamName = message.body.split(".score ",2)[1].trim();

            if(ss != 0){
                client.sendText(message.from,"Espere " + (30-ss) + " segundos para usar este comando novamente");
            }
            else if(ss == 0){
                startCountdown();
                ProcurarPartida();
            }
            
            async function ProcurarPartida(){
                await HLTV.getMatches().then((res) =>{
                    for(i=0;i<101;i++){

                        if(!res[i].team1){
                            i++;
                        }

                        else if(res[i].team1.name.toLowerCase() == TeamName){
                            matchId = res[i].id;
                            partidaEncontrada = true;
                            PegarPartida();
                            i = 101;
                        }
                        else if(res[i].team2.name.toLowerCase() == TeamName){
                            matchId = res[i].id;
                            partidaEncontrada = true
                            PegarPartida();
                            i = 101;
                        }
                        else if(i==100){
                            client.sendText(message.from,"Não foi encontrada nenhuma partida para esse time");
                            partidaEncontrada = false;
                        }
                    }
                    
                })
            }
        }
        if(message.body.toLowerCase().includes('.vetos')){

            var TeamName = message.body.split(".vetos ",2)[1];

            if(ss != 0){
                client.sendText(message.from,"Espere " + (30-ss) + " segundos para usar este comando novamente");
            }
            else if(ss == 0){
                startCountdown();
                ProcurarPartidaVetos();
            }

            async function ProcurarPartidaVetos(){
                await HLTV.getMatches().then((res) =>{
                    for(i=0;i<101;i++){

                        if(!res[i].team1){
                            i++;
                        }

                        else if(res[i].team1.name.toLowerCase() == TeamName){
                            matchId = res[i].id;
                            partidaEncontrada = true;
                            mostrarVetos();
                            i = 101;
                        }
                        else if(res[i].team2.name.toLowerCase() == TeamName){
                            matchId = res[i].id;
                            partidaEncontrada = true
                            mostrarVetos();
                            i = 101;
                        }
                        else if(i==99){
                            client.message(message.from,"Não foi encontrada nenhuma partida para esse time");
                            partidaEncontrada = false;
                        }
                    }
                    
                })
            }
            
        }

        async function PegarPartida(){
            await HLTV.getMatch({id:matchId}).then((res)=>{

                var PrimeiroMapa = res.maps[0].name;
                var Resultado1 = res.maps[0].result;

                if(res.maps[1]){
                    var SegundoMapa = res.maps[1].name;
                    var Resultado2 = res.maps[1].result;
                }

                if(res.maps[2]){
                    var TerceiroMapa = res.maps[2].name;
                    var Resultado3 = res.maps[2].result;
                }
                if(res.maps[3]){
                    var QuartoMapa = res.maps[3].name
                    var QuintoMapa = res.maps[4].name;
                    var Resultado4 = res.maps[3].result;
                    var Resultado5 = res.maps[4].result;
                }
                 
                var Time1 = res.team1;
                var Time2 = res.team2;
                var TotalDeMapas = res.maps.length;
        
                if(PrimeiroMapa === "cch"){
                    PrimeiroMapa = "cache";
                }
                if(SegundoMapa === "cch"){
                    SegundoMapa = "cache"
                }
                if(TerceiroMapa === "cch"){
                    TerceiroMapa = "cache"
                }
                if(QuartoMapa === "cch"){
                    QuartoMapa = "cache"
                }
                if(QuintoMapa === "cch"){
                    QuintoMapa = "cache"
                }

                if(res.live!=true){
                    client.sendText(message.from,"A partida não está ao vivo");
        
                    HLTV.getTeam({id: Time1.id}).then((carac) =>{
        
                        var Time1Ranking = carac.rank;
                        var Time2Ranking = carac.rank;
        
                        if(TotalDeMapas == 1){
                            client.sendText(message.from,Time1.name + " vs " + Time2.name + " - MD1\n\n" + "Mapas:\n\n\n" + "1) "+ PrimeiroMapa + " - " + Resultado1);
                        }
                        else if(TotalDeMapas == 2){
                            
                            client.sendText(message.from,Time1.name + " vs " + Time2.name + " - MD2\n\n" + "Mapas:\n\n\n" + "1) "+ PrimeiroMapa + " - " + Resultado1 + "\n 2) " + SegundoMapa + " - " + Resultado2);
                            
                        }
        
                        else if(TotalDeMapas == 3){;
                            
                            client.sendText(message.from,Time1.name + " vs " + Time2.name + " - MD3\n\n" + "Mapas:\n\n\n" + "1) "+ PrimeiroMapa + " - " + Resultado1 + "\n 2) " + SegundoMapa + " - " + Resultado2 + "\n3) " + TerceiroMapa + " - " + Resultado3);
                        }
                        else {
                            
        
                            client.sendText(message.from,Time1.name + " vs " + Time2.name + " - MD5\n\n" + "Mapas:\n\n" + "1) "+ PrimeiroMapa + " - " + Resultado1 + "\n 2) " + SegundoMapa + " - " + Resultado2 + "\n3) " + TerceiroMapa + " - " + Resultado3 + "\n4) " + QuartoMapa + " - " + Resultado4 + "\n5) " + QuintoMapa + " - " + Resultado5);
                        }
                    })
        
                        
                }
                else if(res.live = true){
                    PartidaLive();
                    async function PartidaLive(){
                        await HLTV.connectToScorebot({id: matchId, onScoreboardUpdate: (data, done) => {
                            // if you call done() the socket connection will close.
                        }, onConnect: (data, done) => {
                            console.log("Connected");
                        }, onScoreboardUpdate:(data,done) => {

                            var Formato;
                            var Mapas;
                            if(TotalDeMapas == 3){
                                Formato = "Melhor de 3";
                                Mapas = "\nMapas:\n1) " + PrimeiroMapa + " - "+ Resultado1 +"\n2) " + SegundoMapa+ " - "+Resultado2 + "\n3) " + TerceiroMapa + Resultado3;
                            }
                            
                            client.sendText(message.from,"A partida está ao vivo!\n\nFormato: "+ Formato + Mapas +  "\nRound - " + data.currentRound + "\n\nMapa Atual: " + data.mapName + "\n" + data.terroristTeamName + " 🔴 " + data.terroristScore + " x " + data.counterTerroristScore + " 🔵 " + data.ctTeamName);
                            done();
                            
                        }})
                    }
                        
                }
                        
            })
        }


        async function mostrarVetos(){
            await HLTV.getMatch({id:matchId}).then((res)=>{
        
                if(res.format.trim().toLowerCase() === "best of 5"){
                    client.sendText(message.from,"Formato: Melhor de 5 \nMapas: " + res.maps[0].name +", "+ res.maps[1].name +", "+ res.maps[2].name + ", " + res.maps[3].name + " e " + res.maps[4].name + "\n\nVetos:\n1- "+res.vetoes[0].team.name +" "+ res.vetoes[0].type +" " + res.vetoes[0].map +"\n" +"2- "+ res.vetoes[1].team.name +" "+ res.vetoes[1].type +" " + res.vetoes[1].map +"\n" +"3- "+res.vetoes[2].team.name +" "+ res.vetoes[2].type +" " + res.vetoes[2].map +"\n" +"4- "+res.vetoes[3].team.name +" "+ res.vetoes[3].type +" " + res.vetoes[3].map +"\n5-" +res.vetoes[4].team.name +" "+ res.vetoes[4].type +" " + res.vetoes[4].map +"\n6-" +res.vetoes[5].team.name +" "+ res.vetoes[5].type +" " + res.vetoes[5].map +"\n");
                }
                else if(res.format.trim().toLowerCase() == "best of 3"){
                    client.sendText(message.from,"Formato: Melhor de 3 \nMapas: " + res.maps[0].name +", "+ res.maps[1].name +" e "+ res.maps[2].name + "\n\nVetos:\n1- "+res.vetoes[0].team.name +" "+ res.vetoes[0].type +" " + res.vetoes[0].map +"\n" +"2- "+ res.vetoes[1].team.name +" "+ res.vetoes[1].type +" " + res.vetoes[1].map +"\n" +"3- "+res.vetoes[2].team.name +" "+ res.vetoes[2].type +" " + res.vetoes[2].map +"\n" +"4- "+res.vetoes[3].team.name +" "+ res.vetoes[3].type +" " + res.vetoes[3].map +"\n5-" +res.vetoes[4].team.name +" "+ res.vetoes[4].type +" " + res.vetoes[4].map +"\n6-" +res.vetoes[5].team.name +" "+ res.vetoes[5].type +" " + res.vetoes[5].map +"\n");
                }else if(res.format.trim().toLowerCase() == "best of 2"){
                    client.sendText(message.from,"Formato: Melhor de 2 \nMapas: " + res.maps[0].name +" e "+ res.maps[1].name + "\n\nVetos:\n1- "+res.vetoes[0].team.name +" "+ res.vetoes[0].type +" " + res.vetoes[0].map +"\n" +"2- "+ res.vetoes[1].team.name +" "+ res.vetoes[1].type +" " + res.vetoes[1].map +"\n" +"3- "+res.vetoes[2].team.name +" "+ res.vetoes[2].type +" " + res.vetoes[2].map +"\n" +"4- "+res.vetoes[3].team.name +" "+ res.vetoes[3].type +" " + res.vetoes[3].map +"\n5-" +res.vetoes[4].team.name +" "+ res.vetoes[4].type +" " + res.vetoes[4].map +"\n6-" +res.vetoes[5].team.name +" "+ res.vetoes[5].type +" " + res.vetoes[5].map +"\n")
                }else if(res.format.trim().toLowerCase() == "best of 1"){
                    client.sendText(message.from,"Formato: Melhor de 1 \n Mapas: " + res.maps[0].name + "\n\nVetos:\n1- "+res.vetoes[0].team.name +" "+ res.vetoes[0].type +" " + res.vetoes[0].map +"\n" +"2- "+ res.vetoes[1].team.name +" "+ res.vetoes[1].type +" " + res.vetoes[1].map +"\n" +"3- "+res.vetoes[2].team.name +" "+ res.vetoes[2].type +" " + res.vetoes[2].map +"\n" +"4- "+res.vetoes[3].team.name +" "+ res.vetoes[3].type +" " + res.vetoes[3].map +"\n5-" +res.vetoes[4].team.name +" "+ res.vetoes[4].type +" " + res.vetoes[4].map +"\n6-" +res.vetoes[5].team.name +" "+ res.vetoes[5].type +" " + res.vetoes[5].map +"\n");
                }
            })
        }
    });
    function startCountdown(){
        cron = setInterval(() => { timer(); },tempo);
    }

    function timer(){
        ss++;
        if(ss == 30){
            clearInterval(cron);
            ss = 0;
        }
    }
}



