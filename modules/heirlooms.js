////////////////////////////////////////
//Heirloom Functions////////////////////
////////////////////////////////////////

// Trimmed hard because it was a bloody mess and I only really need to have high quality Cores

function autoHeirlooms() {
    if(!heirloomsShown && game.global.heirloomsExtra.length > 0){
      for(var extra in game.global.heirloomsExtra) {
        var theLoom = game.global.heirloomsExtra[extra];
          if(game.global.heirloomsCarried.length < game.global.maxCarriedHeirlooms && theLoom.type == 'Core' && theLoom.rarity > 6) {
            // We found a Magmatic / Plagued (or potentially higher) core, carry it; if new tied is added, I will expand it. Unlikely for a few months at least
            selectHeirloom(extra, 'heirloomsExtra');
            carryHeirloom();
          }
        }
      }  
}
