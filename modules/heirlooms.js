////////////////////////////////////////
//Heirloom Functions////////////////////
////////////////////////////////////////

// Trimmed hard because it was a bloody mess and I only really need to have high quality Cores

function autoHeirlooms() {
    if(!heirloomsShown && game.global.heirloomsExtra.length > 0){
      for(var extra in game.global.heirloomsExtra) {
        var theLoom = game.global.heirloomsExtra[extra];
          if(game.global.heirloomsCarried.length < game.global.maxCarriedHeirlooms && ((theLoom.type == 'Core' && theLoom.rarity >= 6) || (theLoom.rarity >= 10))) {
            // We found a rarity 6 core (maximum as of March 2019), carry it; Unlikely for a few months to reach new spire for rarity 7
            selectHeirloom(extra, 'heirloomsExtra');
            carryHeirloom();
          }
        }
      }  
}
