MODULES["autofight"] = {};
//These can be changed (in the console) if you know what you're doing:
MODULES["autofight"].breedTimerCutoff1 = 2;
MODULES["autofight"].breedTimerCutoff2 = 0.5;

var skipFight = 0;
var deathsThisZone = 0;
var oldWolrdZone;
var currentWorldZone;

function betterAutoFight() {
    // So yeah, first go at an improved Autofight; it's pretty crude but handles what I want OK-ish
    var customVars = MODULES["autofight"];
    var genBreedTime = 45; // Initialize in case of fuckup
    if(typeof game.global.GeneticistassistSetting !== "undefined") genBreedTime = game.global.GeneticistassistSetting+1;
    if (game.global.autoBattle && !game.global.pauseFight) 
        pauseFight(); //Disable built-in autofight
    if (game.global.gridArray.length === 0 || game.global.preMapsActive || !game.upgrades.Battle.done) return;  //sanity check. stops error message on z1 right after portal
    if (game.global.mapsUnlocked && game.global.skipFight == 0 && game.global.lastClearedCell < 0 && game.global.world%5 == 1 && !game.global.fighting && !(game.global.mapsActive || game.global.preMapsActive)) {mapsClicked(); skipFight++; return;} // Stop killing another group after omnipotrimp if fight cycle happens before automaps
    
    var targetBreed = (game.global.spireActive ? 15 : 0); // Default instant autofighting
    var currentBreedTime = (game.jobs.Amalgamator.owned > 0) ? Math.floor((new Date().getTime() - game.global.lastSoldierSentAt) / 1000) : Math.floor(game.global.lastBreedTime / 1000);
    var newSquadRdy = false;
    
    if (game.global.universe == 2) targetBreed = 0
    else {
     if (!(game.global.world < 230 || getCurrentEnemy().name == "Liquimp")) targetBreed = (game.global.spireActive ? genBreedTime : 3); // So this is a first hot-fix to Spire instakills, as well as enforcing at least x seconds worth of breeding
    
     // Now check how many times we have died this zone and add time up to 45s total
     // Yes, this will slow me down during very high bleeds but screw it, better then die over and over because there's no geneticist bonus
     // Should also help to get at least some Anticipation attack bonus back in very high zones where I die on bleed cells
     currentWorldZone = game.global.world;
     if(typeof oldWolrdZone === "undefined") oldWolrdZone = currentWorldZone;
     if(oldWolrdZone != currentWorldZone) {
      // We beat the current zone, so reset counters
      deathsThisZone = 0;
      oldWolrdZone = currentWorldZone;
     }
     targetBreed += 2*deathsThisZone; // +2s per death
     targetBreed = (targetBreed>genBreedTime ? genBreedTime : targetBreed); // Set anything over GenBreed back down a notch
    
    } // Here ends U2 override for instant fighting
    
    // If we met targetBreed, check if we have enough trimps to not stagger breed timer too much. If soldier size is negligable, just send it anyway
    if (targetBreed <= currentBreedTime && (game.resources.trimps.owned*1.2 > game.resources.trimps.realMax() || (game.resources.trimps.maxSoldiers/game.resources.trimps.owned) < 0.01)) {
        newSquadRdy = true;
    }
    //Manually click fight instead of using builtin auto-fight
    if (!game.global.fighting) {
        if (newSquadRdy || game.global.soldierHealth > 0 || game.global.world == 1) {
            fightManual();
            if(deathsThisZone <= 20) deathsThisZone++; // Well, it's not ideal but close enough
        }
    skipFight = 0;
    }
}
