var Player = require('./Player');

var player = {
    getPositionList : function(playerCount) {
         var blinds = ['SB', 'BB']
          
          var UTG = ['UTG', 'UTG', 'UTG'];
        
          var MP = ['MP', 'MP', 'MP'];
          
          var LP = ['CO', 'Button'];
          
          if (playerCount < 10) {
              MP.pop();
          }
          
          if (playerCount < 9) {
              UTG.pop();
          }
        
          if(playerCount < 8) {
              MP.pop();
          }
        
          if(playerCount < 7) {
              UTG.pop();
          }
        
          if(playerCount < 6) {
              MP.pop();
          }
        
          if(playerCount < 5) {
              UTG.pop();
          }
        
          if(playerCount < 4) {
              LP.shift();
          }
        
          if(playerCount < 3) {
              LP.shift();
          }
          
          //numerate UTG 
          UTG  = UTG.map(function(s, i) {
            if (i > 0) {
               return s = s + '+' + i;
            } else {
              return s;
            }
          }); 
                  
          //numerate MP 
          if (MP.length > 1) {
            MP = MP.map(function(s, i) {
                return s = s + (i + 1);
            });
          }
        
          return blinds.concat(UTG, MP, LP);
    },
     playerList: function(playerCount) {
         var playerList = [], player;
         for(var i=0; i<playerCount; i++) {
             player = new Player(i);
             playerList.push(player);
         }
       
         playerList[0].isHero = true;
         return playerList;
     },
     expandReducePlayerList: function(playerList, newCount) {
        console.log('expand playerList from ' + playerList.length + ' to ' + newCount);
        var i; 
        var originalCount = playerList.length;
        //easy to add new players
        if(newCount >= originalCount) {
           for(i=0; i < (newCount - originalCount); i++) {
               playerList.push(new Player());
           }
        } else {
        
           //reduce the number of players 
           // we try to remove ones which have not been altered
           var numberToRemove = playerList.length - newCount;
           var numberRemoved = 0;
           var safeToRemove;
         
           i = playerList.length;
           while(--i >= 0 && numberRemoved < numberToRemove) {
               safeToRemove = playerList[i].isHero == false && playerList[i].chips == DEFAULT_CHIP_COUNT;
              if(safeToRemove) {
                 playerList.splice(i, 1)
                 numberRemoved++
              }
           }
           
           //could not do safe removal, so we remove ones who are not heroes
           i = playerList.length;
           while (--i > 0 && numberRemoved < numberToRemove) { 
              if(!playerList[i].isHero) {
                 playerList.splice(i, 1)
                 numberRemoved++
              }
           }
           
          
        }    
         player.renumberPlayerPositions(playerList);
      
        
    }, renumberPlayerPositions: function(playerList) {
         playerList.forEach(function(p, i) {
            p.position = i;
         });
    } 
 }

 module.exports = player;
 