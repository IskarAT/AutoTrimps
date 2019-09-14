MODULES["automaps"] = {};
//These can be changed (in the console) if you know what you're doing:
MODULES["automaps"].mapCutoff = 3;                                        //
MODULES["automaps"].worldCutoff = 9;                                      //above this the game will farm.
MODULES["automaps"].maxMapBonus = 10;                                     // Max map stacks
MODULES["automaps"].healthCutoff = 4;					  // HP ratio against cell 100
MODULES["automaps"].maxMapBonusAfterZ = MODULES["automaps"].maxMapBonus;  //Max Map Bonus After Zone uses this many stacks; starts at 10

//Initialize Global Vars (dont mess with these ones, nothing good can come from it).
var shouldDoMaps = false;
var needPrestige = false;
var doMaxMapBonus = false;
var needToVoid = false;
var doVoids = false;
var mapAtZoneReached = false;
var windStacking = false;
var spireMapBonusOverride = false;

// Biome, difficulty, extra levels, loot, perfect sliders, size, special modifier; We default into Perfect slider gardens with Prestigious mod and no extra levels
var defaultMapPreset = {
				loot: 9,
				difficulty: 9,
				size: 9,
				biome: "Plentiful",
				specMod: "p",
				perf: true,
				extra: 0
}; // move it to customVars?

var preSpireFarming = false;
var spireMapBonusFarming = false;
var spireTime = 0;

var actualEnemyHealth = 0;
var actualEnemyDamage = 0;
var actualTrimpDamage = 0;
var newHDratio = 0;
var healthRatio = 0;
var spireHD = 0;
var spireHealth = 1;
var challengeHPmod = 1;
var localQuestID = -2;

//AutoMap - function originally created by Belaith (in 1971)
//anything/everything to do with maps
function autoMap() {
    var customVars = MODULES["automaps"];
    // Start: Map initialization and weird cases handle part
	
    // Exit and do nothing if we are prior to zone 6 (maps haven't been unlocked):
    if (!game.global.mapsUnlocked || game.global.soldierCurrentAttack == 0) {   //if we have no damage, why bother running anything? (this fixes weird bugs)
        updateAutoMapsStatus();
        return;
    }

    // Map  at zone xxx, run through the list and if we reached one of the settings, turn OFF before we do things to settings
    if (game.global.universe == 1 && game.options.menu.mapAtZone.enabled && game.options.menu.mapAtZone.setZone.length) {
	for (var i = 0; i < game.options.menu.mapAtZone.setZone.length; i++) {
	 if (game.global.world == game.options.menu.mapAtZone.setZone[i].world) 
	 {
	  autoTrimpSettings.AutoMaps.enabled = false; // We have reached our world, turn off Automaps and let GS Automaps do its thing
	  mapAtZoneReached = true;
	  return;
	 }
	} 
    } else if (game.global.universe == 2 && game.options.menu.mapAtZone.enabled && game.options.menu.mapAtZone.setZoneU2.length) {
	for (var i = 0; i < game.options.menu.mapAtZone.setZoneU2.length; i++) {
	 if (game.global.world == game.options.menu.mapAtZone.setZoneU2[i].world) 
	 {
	  autoTrimpSettings.AutoMaps.enabled = false; // We have reached our world, turn off Automaps and let GS Automaps do its thing
	  mapAtZoneReached = true;
	  return;
	 }
	} 
    } else mapAtZoneReached = false;
	
    // Do things to settings
    if (game.options.menu.mapLoot.enabled != 1) toggleSetting('mapLoot');
    // Control in-map right-side-buttons for people who can't control themselves. If you wish to use these buttons manually, turn off autoMaps temporarily.
    if (game.options.menu.repeatUntil.enabled != 0) toggleSetting('repeatUntil');
    if (game.options.menu.exitTo.enabled != 0) toggleSetting('exitTo');
    if (game.options.menu.repeatVoids.enabled != 0) toggleSetting('repeatVoids'); // I'll probably change this

    // If we are in mapology and we have no credits, exit
    if (game.global.challengeActive == "Mapology" && game.challenges.Mapology.credits < 1) {
        updateAutoMapsStatus();
        return;
    }
    // Run UI update
    updateAutoMapsStatus();
	
    // Use map presets
    var useMapPresets = true; // for now true, later we'll make it into a setting
    
    // Get Wind farm and other settings; cannot move to global vars in case user changes them
    const forceWind = getPageSetting('ForceWind');
    const windModifier = getPageSetting('WindModifier');
    const ignoreWindSpire = getPageSetting('WindSpire');
    var skipSpire = ignoreWindSpire && game.global.spireActive;
    var VoidDailyOffset = (game.global.challengeActive == "Daily")?getPageSetting('VoidDailyOffset'):0; // During a daily, add offset to voidmaps
    var powerRaiding = getPageSetting('MaxStacksForSpire');
	
    //FIND VOID MAPS LEVEL:
    needToVoid = false;
    doVoids = false;
    windStacking = false;
    var voidMapLevelSetting = (game.global.universe == 1)?getPageSetting('VoidMaps'):getPageSetting('VoidMapsU2') + VoidDailyOffset;
    var voidsuntil = getPageSetting('RunNewVoidsUntil');
    //decimal void maps are possible, using string function to avoid false float precision (0.29999999992). javascript can compare ints to strings anyway.
    var voidMapLevelSettingZone = (voidMapLevelSetting+"").split(".")[0];
    var voidMapLevelSettingMap = (voidMapLevelSetting+"").split(".")[1];
    if (voidMapLevelSettingMap === undefined)
        voidMapLevelSettingMap = 90;  // Run voids at cell 90, if not defined by user otherwise
    if (voidMapLevelSettingMap.length == 1) voidMapLevelSettingMap += "0";  //entering 187.70 becomes 187.7, this will bring it back to 187.70
    if (game.global.totalVoidMaps > 0 && (game.global.world == voidMapLevelSettingZone || (game.global.world > voidMapLevelSettingZone && game.global.world < voidsuntil))) needToVoid = true; // We reached void map level or are still inside the Until setting; Todo: Add setting for "Only run on poison" and handle it here
    
    // Stop: Map initialization
    
    // Check Equality and if we use toggling
    if (game.global.universe == 2 && !game.portal.Equality.radLocked && getPageSetting('Equality')) {
     if (game.portal.Equality.scalingActive && game.global.world > getPageSetting('EqualityWhen')) {
      game.portal.Equality.scalingActive = false; // Scaling is active but we want to turn if off
     } else if (!game.portal.Equality.scalingActive && game.global.world < getPageSetting('EqualityWhen')) {
      game.portal.Equality.scalingActive = true;
     }
    }
	
    // Are we running quest? If so, see which one
    if (game.global.challengeActive == "Quest") localQuestID = getQuestID();
     else localQuestID = -2;
	
    // Start: HD ratio initialization
    // Challenge modifier reset, until we get a function for it
    challengeHPmod = 1;
    // Damage section; calculates max damage, not average; then we remove stance modifiers
    actualTrimpDamage = calculateDamage(game.global.soldierCurrentAttack, true, true, true);
    
    // Crit is only returned by the damage function if 3rd argument is false
    var playerCritChance = getPlayerCritChance();
    var baseMulti = 5;
    if (game.talents.crit.purchased) baseMulti++;
    if (Fluffy.isRewardActive("megaCrit")) baseMulti += 2;
    
    // Math incoming
    if (playerCritChance < 1) {
     // Normal crit calculation
     actualTrimpDamage = (actualTrimpDamage * (1-playerCritChance) + (actualTrimpDamage * playerCritChance * getPlayerCritDamageMult()));
    } else {
     // We have over 100% crit chance, so multiply the damage with crit multiplier
     actualTrimpDamage *= getPlayerCritDamageMult();
     // Now let's calculate how many additional dmg tiers we have
     var tier = 0;
     for(playerCritChance;playerCritChance>1;playerCritChance--, tier++) {
      // Empty for? I mean... sure, we do increments in the cycle itself :D
     }
     // Now let's multiply damage by the crit base per each tier that is guaranteed (compounding)
     actualTrimpDamage *= Math.pow(baseMulti,tier-1);
     // Now apply the crit formula, as usual but with baseMulti instead; also remember, that crit chance is now between <0;1)
     actualTrimpDamage = (actualTrimpDamage * (1-playerCritChance) + (actualTrimpDamage * playerCritChance * baseMulti));
    }
	
    if (game.global.formation == 0) {
      // Do nothing, X stance
    } else if (game.global.formation == 2) {
      // Dominance
      actualTrimpDamage /= 4;
    } else {
      // Heap, Barrier, Scryer
      actualTrimpDamage *= 2;
    }
	
    // Add empowerements
    if (getEmpowerment() == "Poison") actualTrimpDamage *= (1 + (game.empowerments.Poison.level / 70) * (game.empowerments.Poison.retainLevel / 40)); // Magic with poison, no real science or math behind it. Just made it to roughly stick to my current dmg increase and could be improved later
    //if(getEmpowerment() == "Ice") actualTrimpDamage *= 2; // Note for self: Chilled from ice goes to Attack, I just did not notice...
	
    // Add plaguebringer as a rough estimation
    if (game.heirlooms.Shield.plaguebringer !== undefined) actualTrimpDamage *= (1 + game.heirlooms.Shield.plaguebringer.currentBonus/100);
	
    // Add Gamma Burst
    if (game.heirlooms.Shield.plaguebringer !== undefined && game.heirlooms.Shield.gammaBurst.currentBonus) {
	var gammaBurstDamage = game.heirlooms.Shield.gammaBurst.currentBonus/100;
	gammaBurstDamage /= 7; // Released every 6th attack but let's give it a little less impact on H:D
	gammaBurstDamage /= (game.global.universe == 1)?1:10; // U2 has 10% efficiency
	actualTrimpDamage *= gammaBurstDamage;
    }
	
    // Map handler
    if (game.global.mapsActive) {
      if (game.global.titimpLeft > 0) actualTrimpDamage /= 2;
      actualTrimpDamage *= (1 + game.global.mapBonus * 0.2);
      // Handling of void power
      if (game.talents.voidPower.purchased && game.global.voidBuff){
        var voidBonus = (game.talents.voidPower2.purchased) ? ((game.talents.voidPower3.purchased) ? 65 : 35) : 15;
	var voidMaster = 1;
	if (game.talents.voidMastery.purchased) voidMaster = 5;
        
	actualTrimpDamage *= (100 / voidBonus);
	actualTrimpDamage /= voidMaster;
      }
    }
  
    // Health section; computes Omnipotrimp at cell 100, unless stated otherwise
    // possible optimization: Compute when entering new zone or upon loading
    if (!game.global.mapsActive) {
      actualEnemyHealth = game.global.getEnemyHealth(100, "Omnipotrimp"); // Omnipotrimps and Improbabilities have the same stats before corruption
      actualEnemyDamage = game.global.getEnemyAttack(100, "Omnipotrimp", false);
    } else {
      // We have loaded the game while in a map; getEnemyHealth while in maps computes it from map level, which was causing weird behavior. This safeguard is to approximate H:D ratior before we fix it in world
      if (actualEnemyHealth == 0) actualEnemyHealth = game.global.getEnemyHealth(100, "Omnipotrimp");
      if (actualEnemyDamage == 0) actualEnemyDamage = game.global.getEnemyAttack(100, "Omnipotrimp", false);
    }
    
    // Now add corruption into the mix for U1
    if (game.global.universe == 1 && game.global.world > 150)
     actualEnemyHealth *= mutations.Corruption.statScale(10);
     
    // Challenge modifier section
    if (game.global.challengeActive == "Daily" && game.global.dailyChallenge.badHealth !== undefined) { // If daily doesn't affect HP, it is undefined
      if (dailyModifiers.badHealth.getMult(game.global.dailyChallenge.badHealth.strength) !== undefined)
      challengeHPmod = dailyModifiers.badHealth.getMult(game.global.dailyChallenge.badHealth.strength);
    } else if (game.global.challengeActive == "Obliterated") {
     var hpOblitMult = 1e12;
     var oblitZoneModifier = Math.floor(game.global.world / 10);
     hpOblitMult *= Math.pow(10, oblitZoneModifier);
     challengeHPmod *= hpOblitMult;
    } else if (game.global.challengeActive == "Coordinate") {
     challengeHPmod *= getBadCoordLevel();       
    } else if (game.global.challengeActive == "Eradicated") {
     var eradicZoneModifier = Math.floor(game.global.world / 2);
     var hpEradicMult = Math.pow(3, eradicZoneModifier);
     challengeHPmod *= game.challenges.Eradicated.scaleModifier * hpEradicMult;
    }
    // add else ifs to handle all challenge mods and later check if we need to add handle to damage buff from challenges
    if (!game.global.mapsActive && !game.global.preMapsActive)
    // Now add challenge modifier. If we are in maps though, HP is not recalculated so it would cause updating old HP over and over
    actualEnemyHealth *= challengeHPmod;
    
    // Spire health override
    if (game.global.spireActive) {
      spireHealth = game.global.gridArray[game.global.lastClearedCell+1].maxHealth;
    }
  
    // Now that we have both HP and Damage, we know how many hits on average will survive Omnipotrimp at the end of the zone (not counting in poison ticks)
    if (game.global.soldierHealth == 0 && newHDratio !== undefined && healthRatio !== undefined) 
    {/* we are dead so do nothing because it screws up with damage calculation */}
    else {
     newHDratio = actualEnemyHealth/actualTrimpDamage;
     spireHD = spireHealth/actualTrimpDamage;
     var effectiveHealth = (game.global.universe == 2)?game.global.soldierEnergyShieldMax:0;
     effectiveHealth += game.global.soldierHealthMax;
     if (game.global.mapsActive && game.talents.mapHealth.purchased) effectiveHealth /=2; // Safe mapping mastery
     healthRatio = effectiveHealth/actualEnemyDamage;
    }
    // Stop: HD ratio initialization
    
    // Start: Decide map mode
    // Check for prestiges
    var prestigeList = ['Supershield','Dagadder','Megamace','Polierarm','Axeidic','Greatersword','Harmbalest','Bootboost','Hellishmet','Pantastic','Smoldershoulder','Bestplate','GambesOP'];
    var numUnbought = 0;
    needPrestige = false;
    doMaxMapBonus = false;
    for (var i=0,len=prestigeList.length; i < len; i++) {
      var p = prestigeList[i];
      if (game.mapUnlocks[p].last <= game.global.world - 5)
        numUnbought++;
    }
    if (numUnbought > 0) {
      if (game.talents.blacksmith3.purchased && game.global.world < Math.floor((getHighestLevelCleared(false, true) + 1) * 0.9)) {
	  needPrestige = false;
        } else needPrestige = true; // We have prestiges available -> Get 'em
    }
    else if (game.global.mapBonus < customVars.maxMapBonus) { // No prestiges are needed, max map bonus
      if ((newHDratio > customVars.worldCutoff || healthRatio < customVars.healthCutoff) && !game.global.mapsActive && !game.global.preMapsActive) { // We are in world, so cutoff is 6; Later: Replace with custom variable
        doMaxMapBonus = true;
      }
      else if ((newHDratio > customVars.mapCutoff || healthRatio < customVars.healthCutoff) && (game.global.mapsActive || game.global.preMapsActive)) { // We are in maps or premaps, so activate grace period to get better bonus since our next army is very likely still breeding
        doMaxMapBonus = true;
      }
      else if (spireMapBonusOverride || (needToVoid && powerRaiding == 2 && game.global.world%10 == 0)) doMaxMapBonus = true; // If we are in MOD 0 map and preparing to run voids, just grab full map bonus first; It gives resources and enables power raiding even below HD cutoff
    }
	
    // Check for Quest in U2
    if (game.global.universe == 2) {
     switch(localQuestID) {
	case -1:
	// Turn AutoStructure back on, when quests are done
	if (!game.global.autoStructureSettingU2.enabled) toggleAutoStructure(false);
	case -2:
	// Nothing to do, just break
	break;
	case 5:
	// No Map quest
	needPrestige = false;
	doMaxMapBonus = false;
	break;
	case 6:
	// Smithy quest, so buy a smithy
	safeBuyBuilding('Smithy');
	break;
	case 3:
	// Look at H:D ratio, if overkilling then do nothing, else run maps for stacks
	if (newHDratio > 0.001) doMaxMapBonus = true;
	break;
	case 4:
	// Look at healthRatio, if above certain value, do nothing. Else maps for HP
	if (healthRatio < 25) doMaxMapBonus = true;
	break;
	case 0:
	case 1:
	// We are getting resources, so turn off Autostructure except when getting science
	if (game.global.autoStructureSettingU2.enabled && game.challenges.Quest.resource != "science") toggleAutoStructure(false);
	case 2:
	// Quest for maps or resources, so run maps until completion
	doMaxMapBonus = true;
	break;
	}
     if (game.global.mapBonus == customVars.maxMapBonus) doMaxMapBonus = false;
    }
	
    // Map bonus is maxed, only thing to do now are voids after reaching set cell; it's not an else because we could be missing max map bonus, which would break the logic
    if (needToVoid) {
      if (game.global.lastClearedCell+1 >= voidMapLevelSettingMap) doVoids = true;
    }
    // Variables are initialized, let's set map mode, then apply overrides if triggered
    shouldDoMaps = needPrestige || doMaxMapBonus || doVoids || spireMapBonusOverride;
    
    // Override section for special cases
    //Farm X Minutes Before Spire:
    //preSpireFarming = game.global.spireActive && newHDratio > 0.0001 && (spireTime = (new Date().getTime() - game.global.zoneStarted) / 1000 / 60) < getPageSetting('MinutestoFarmBeforeSpire');
    spireMapBonusFarming = game.global.spireActive && getPageSetting('MaxStacksForSpire') && game.global.mapBonus < customVars.maxMapBonus && (newHDratio > (0.006 / game.global.world) || spireHD > 1); // Only get map bonus if we lack damage    
    if (/*preSpireFarming ||*/ spireMapBonusFarming && !game.global.fighting) {
        shouldDoMaps = true;
	spireMapBonusOverride = true;
        if (game.global.mapBonus < customVars.maxMapBonus) doMaxMapBonus = true;
    }
    if (spireMapBonusOverride && (!game.global.spireActive || game.global.mapBonus >= 9)) spireMapBonusOverride = false;
  
    // If we are on a wind zone and HD ratio is less than set modifier -> don't map; This will also stop prestige mode but for now we want this!
    if(getEmpowerment() == "Wind" && !skipSpire && forceWind && windModifier > Math.floor(newHDratio)) {
      if (!doVoids) {
	doMaxMapBonus = false;
	needPrestige = false;
	shouldDoMaps = false; // OK, in theory we could set Voids to a wind zone... this should run them properly
        windStacking = true;
      }
    }
  
    //MaxMapBonusAfterZone (idea from awnv)
    var maxMapBonusZ = getPageSetting('MaxMapBonusAfterZone');
    if (maxMapBonusZ >= 0 && game.global.mapBonus < customVars.maxMapBonusAfterZ && game.global.world >= maxMapBonusZ) {
        shouldDoMaps = true;
        doMaxMapBonus = true;
    }
  

    // Stop: Decide map mode
    
    // Big-ass map section - sort, check, create and run them; Will encompass this in if statement for performance reasons because why calculate stuff when mapping is turned off?
    if (shouldDoMaps) {
      var siphonLevel = (game.global.universe == 1)?(game.portal.Siphonology.level):0;
      var desiredMapLevel = 0;
      var extraLevels = 0;
      if (needPrestige || doVoids) { // Technically we shouldn't need doVoids here but who knows how I'll write the find function :)
        desiredMapLevel = game.global.world;
      } else if(powerRaiding == 2 && (game.global.spireActive || needToVoid)) {
	if(game.global.world < 50)
	extraLevels = 0;
	else
	extraLevels = ((5-game.global.world%10)>=0)?(5-game.global.world%10):(0); // Same as selecting extra levels for power raiding
        desiredMapLevel = game.global.world;
      } else {
        desiredMapLevel = (game.global.world - siphonLevel);
      }
      // Now let's go through map array and see if we find our map
      var pickedMap = "none";
      // Override for running Melting point (free Smithy) before voidmaps
      if (doVoids && getPageSetting('SmithFree') && game.global.universe == 2 && game.mapUnlocks.SmithFree.canRunOnce && game.global.world > 50 && game.global.challengeActive != 'Melt') {
       for (var i = 0; i < game.global.mapsOwnedArray.length; i++) {
        if (game.global.mapsOwnedArray[i].name == 'Melting Point') {
	 pickedMap = game.global.mapsOwnedArray[i];
	 break;
	}
       }
      } else
      if (/*getCurrentMapObject() === undefined*/true) {
        for (var i = 0; i < game.global.mapsOwnedArray.length; i++) {
          if (game.global.mapsOwnedArray[i].noRecycle) {
            if (doVoids && game.global.mapsOwnedArray[i].location == "Void") {
              pickedMap = game.global.mapsOwnedArray[i];
              break; // We found a voidmap and we want to run it, let's break
            } else if (game.global.world > 21 && game.global.mapsOwnedArray[i].location == "Prismatic" && game.global.mapsOwnedArray[i].name == "Prismatic Palace" && game.upgrades.Prismalicious.allowed == 0) {
	     pickedMap = game.global.mapsOwnedArray[i]; // Run Prismatic Palace once
	    } else if (game.global.challengeActive == 'Melt' && game.global.world == 51 && game.global.mapsOwnedArray[i].location == "Melting" && game.global.mapsOwnedArray[i].name == "Melting Point") {
	     pickedMap = game.global.mapsOwnedArray[i]; // Run xx to end Melt challenge at z51
	    }
            continue; // found unique map; While we could run them, they are way bigger and have more HP than created ones -> nope
          }
          if (!doVoids && game.global.mapsOwnedArray[i].level == (desiredMapLevel + extraLevels)) { // During power raiding, look for higher lvl map without changing the variable; outside of power raiding, it is 0
            pickedMap = game.global.mapsOwnedArray[i];
            break; // We found our map, let's break
          }
        }
      }
      // Create map, if no suitable is found
      if (pickedMap == "none") {
        var tempMapPreset;
        // create a map; creating map selects it, so we can run it after
        
        // If map presets are saved and option is turned on, use map presets; Preset1 until zone xxx, then preset2 until zone yyy, then finally preset3 until zzz; If no preset or option disabled, use default
        if (useMapPresets && game.global.universe == 1) {
          tempMapPreset = game.global.mapPresets.p1; // for now only preset 1
        } else if (useMapPresets && game.global.universe == 2) {
          tempMapPreset = game.global.mapPresets2.p1;
        } else {
	  tempMapPreset = defaultMapPreset;   
	}
        // When in prestige mode, set map level to world level, else use siphonology level
        if (needPrestige) {
          document.getElementById("mapLevelInput").value = desiredMapLevel; //game.global.world;
        } else {
          document.getElementById("mapLevelInput").value = desiredMapLevel; //game.global.world - siphonLevel;
        }
        // Initialize other slider values and call cost update because the sliders changed
        sizeAdvMapsRange.value = tempMapPreset.size;
        lootAdvMapsRange.value = tempMapPreset.loot;
        difficultyAdvMapsRange.value = tempMapPreset.difficulty;
        biomeAdvMapsSelect.value = tempMapPreset.biome;
        advSpecialSelect.value = tempMapPreset.specMod;
        advPerfectCheckbox.checked = tempMapPreset.perf;
        // Power raiding for Spire and Void maps, if applicable
	if(powerRaiding == 2 && (game.global.spireActive || needToVoid) && game.global.world > 50) {
	  document.getElementById("mapLevelInput").value = game.global.world; // Shitty override is shitty, I know
	  if(game.global.spireActive) {
	    advExtraLevelSelect.value = 5; // Spire is always a MOD 0 zone (200, 300 ... xx00)
	  } else {
	    advExtraLevelSelect.value = ((5-game.global.world%10)>=0)?(5-game.global.world%10):(0); // This should always make it raid a MOD 5 zone
	  }
	}
        // document.getElementById('advExtraLevelSelect').value;
        
        // Presets are loaded, now let's get map cost
        updateMapCost();
        // Handle too costly map
        /* awesome cost handle code */
        
	var mapErrCode;
        // Attempt to buy the map, recycle all if too many and retry
	mapErrCode = buyMap();
        if (mapErrCode == -2) {
          recycleBelow(true);
          debug("Too many maps, recycling now: ", "maps", 'th-large');
          buyMap();
        } else if (mapErrCode == -3) {
	  // We can't afford the map, so let's tick some shit off to decrease price
	  advPerfectCheckbox.checked = false;
	  advSpecialSelect.value = "";
	  biomeAdvMapsSelect.value = "Random";
	  // Try again
	  mapErrCode = buyMap();
	  while(mapErrCode == -3 && (sizeAdvMapsRange.value !=0 || lootAdvMapsRange.value != 0 || difficultyAdvMapsRange.value != 0)) {
	   // Removing more costly options did not help, so let's fiddle with sliders
	   sizeAdvMapsRange.value -= 1;
	   lootAdvMapsRange.value -= 1;
	   difficultyAdvMapsRange.value -= 1;
	   mapErrCode = buyMap();
	}
       }
      }
      
      // Run Maps Logic section
      var repeatButton = false; // Let's prevent repeat button flickering, am I right?
      if (game.global.mapsActive) {
        // We are running a map, handle repeat button
        if (shouldDoMaps && !getCurrentMapObject().noRecycle) repeatButton = true; // We want to do maps on repeat but it wasn't on; except when running non-recyclables; this is the default option and will get overwritten if we want to turn it off
        if (needPrestige) {
          if (numUnbought < 2 || getCurrentMapObject().level != game.global.world) {
            // We have repeat button ON and either not running correct level or unbought prestiges is either 1 or none -> no repeat
            repeatButton = false;
          }
          else if (numUnbought == 2) {
            if (getCurrentMapObject() !== undefined && getCurrentMapObject().bonus !== undefined) {
              if (getCurrentMapObject().bonus == "p") repeatButton = false; // Two unboughts but Prestigious map mod
            }
          }
        }
        if (doMaxMapBonus && game.global.mapBonus >= 9) {
	  repeatButton = false;
	  doMaxMapBonus = false;
	  shouldDoMaps = false;
	}
        
        if(pickedMap != getCurrentMapObject()) repeatButton = false; // Fixes loading AT into unwanted map, so that we can run desired one instead
        
        if (mapAtZoneReached) repeatButton = true;
        // Don't forget to check/click the repeat button as we want it!
        if (game.global.repeatMap && !repeatButton) {
          debug("Repeat clicked: " + game.global.repeatMap + " " + repeatButton, "maps", 'th-large');
	  repeatClicked();
        } else if (!game.global.repeatMap && repeatButton) {
	  debug("Repeat clicked: " + game.global.repeatMap + " " + repeatButton, "maps", 'th-large');
	  repeatClicked();
	}
      }
      else if (game.global.preMapsActive) {
        // Handle recycling/abandoning of current but unfinished map
        if (!game.global.currentMapId == "") recycleMap(getMapIndex(game.global.lookingAtMap));
        // If we are about to run voidmaps, wait for 45s breed
	if (doVoids && game.global.soldierHealth == 0 && game.global.universe == 1) {
	 var currentBreedTime = (game.jobs.Amalgamator.owned > 0) ? Math.floor((new Date().getTime() - game.global.lastSoldierSentAt) / 1000) : Math.floor(game.global.lastBreedTime / 1000);
	 if(currentBreedTime < 45) return;
	}
	      
	// Run selected map
        selectMap(pickedMap.id);
        runMap();
      } else {
        // We are in world; no need to check shouldDoMaps because we know it is true in this part of code
        mapsClicked();
        }
    } else {
      if (game.global.preMapsActive) mapsClicked(); // maybe add flag resetting here instead?
      if (game.global.repeatMap) repeatClicked();
    }
}

function getQuestID() {
 if (game.challenges.Quest.questComplete) return -1; // Signal that Quest in this one is completed
 return game.challenges.Quest.questId;
}

//update the UI with stuff from automaps.
function updateAutoMapsStatus() {
    //automaps status
    var status = document.getElementById('autoMapStatus');
    var minSp = getPageSetting('MinutestoFarmBeforeSpire');
    if (!autoTrimpSettings.AutoMaps.enabled && game.options.menu.mapAtZone.enabled && mapAtZoneReached) status.innerHTML = 'Map at zone reached!';
    else if (!autoTrimpSettings.AutoMaps.enabled) status.innerHTML = 'Off';
    else if (game.global.challengeActive == "Mapology" && game.challenges.Mapology.credits < 1) status.innerHTML = 'Out of Map Credits';
    else if (preSpireFarming) {
        var secs = Math.floor(60 - (spireTime*60)%60).toFixed(0)
        var mins = Math.floor(minSp - spireTime).toFixed(0);
        var hours = minSp - (spireTime / 60).toFixed(2);
        var spiretimeStr = (spireTime>=60) ? 
            (hours + 'h') : (mins + 'm:' + (secs>=10 ? secs : ('0'+secs)) + 's');
        status.innerHTML = 'Farming for Spire ' + spiretimeStr + ' left';
    }
    else if (spireMapBonusFarming) status.innerHTML = 'Getting Spire Map Bonus';
    else if (windStacking) status.innerHTML = 'Windstacking with H:D: ' + newHDratio.toFixed(2);
    else if (doMaxMapBonus) status.innerHTML = 'Mapping for bonus';
    else if (!game.global.mapsUnlocked) status.innerHTML = '&nbsp;';
    else if (needPrestige && !doVoids) status.innerHTML = 'Prestige';
    else if (doVoids) status.innerHTML = 'Void Maps: ' + game.global.totalVoidMaps;
    else if (game.global.spireActive && spireHD > 1) status.innerHTML = 'Spire H/D: ' + spireHD.toFixed(2);
    else if (newHDratio < 0.01) status.innerHTML = 'Overkilling';
    else status.innerHTML = 'H/D: ' + newHDratio.toFixed(2);

    //hider he/hr% status
    if (game.global.universe == 1) {
    var area51 = document.getElementById('hiderStatus');
    var getPercent = (game.stats.heliumHour.value() / (game.global.totalHeliumEarned - (game.global.heliumLeftover + game.resources.helium.owned)))*100;
    var lifetime = (game.resources.helium.owned / (game.global.totalHeliumEarned-game.resources.helium.owned))*100;
    area51.innerHTML = 'He/Hr: ' + getPercent.toFixed(3) + '%<br>&nbsp;&nbsp;&nbsp;He: ' + lifetime.toFixed(3) +'%';
    } else {
    var area51 = document.getElementById('hiderStatus');
    var getPercent = (game.stats.heliumHour.value() / (game.global.totalRadonEarned - (game.global.radonLeftover + game.resources.radon.owned)))*100;
    var lifetime = (game.resources.radon.owned / (game.global.totalRadonEarned-game.resources.radon.owned))*100;
    area51.innerHTML = 'Ra/Hr: ' + getPercent.toFixed(3) + '%<br>&nbsp;&nbsp;&nbsp;Ra: ' + lifetime.toFixed(3) +'%';
    }
}
