function calcBaseDamageinX2() {
    //baseDamage
    baseDamage = calcOurDmg(game.global.soldierCurrentAttack,false);
    //baseBlock
    baseBlock = getBattleStats("block");
    //baseHealth
    baseHealth = getBattleStats("health");
    //stances are not needed, if you do need it, call the function with (,true)
}

//Autostance - function originally created by Belaith (in 1971)
//Automatically swap formations (stances) to avoid dying
function autoStance() {
    // Function init a premature exits
    if (game.global.gridArray.length === 0) return true;
    if (!getPageSetting('AutoStance')) return true;
    if (!game.upgrades.Formations.done) return true;
    
    // If we are dead, go to D. When not unlocked, just use X for eternity
    if (game.upgrades.Dominance.done) {
     if (game.global.soldierHealth <= 0) {
      setFormation(2);
      return;
     }    
    } else {
     setFormation("0");
     return;
    }
    
    // Initialize variables
    var enemy = getCurrentEnemy();
    if (typeof enemy === 'undefined') return true;
    var enemyHealth = enemy.health;
    var enemyDamage = 0; // Eventually total sum of maxBadDamage and bonusDamage
    var prettifiedDmg = calculateDamage(enemy.attack, true, false, false, enemy).split("-"); // bad guy standalone damage
    var minBadDamage = Number(prettifiedDmg[0]); // Technically we neither need or use it. But what the hell, might as well have it...
    var maxBadDamage = Number(prettifiedDmg[1]) * 1.05; // we will add 5% on top as extra due to precision of returned number  
    var bonusDmg = 0; // %based damage from bleeds, reflects etc.
    
    // Apply bonus damage from mutations, if applicable; for example strong enemies do not count, damage is already returned multiplied, double attack does apply because they attack twice
    if (enemy.corrupted == 'corruptCrit') maxBadDamage *= 5;
    else if (enemy.corrupted == 'healthyCrit') maxBadDamage *= 7;
    else if (enemy.corrupted == 'corruptDbl' || enemy.corrupted == 'healthyDbl') maxBadDamage *= 2;
    else if (enemy.corrupted == 'corruptBleed') bonusDmg += (game.global.soldierHealth * 0.2);
    else if (enemy.corrupted == 'healthyBleed') bonusDmg += (game.global.soldierHealth * 0.3);

    // Now apply challenge/daily section
    // Awesome daily bleed% and dmg increase/reflect code as += bonusDmg; as usual, TBD
        
    // Now apply block and broken planet pierce
    if (maxBadDamage < game.global.soldierCurrentBlock) {
        if (!game.global.mapsActive && !game.global.preMapsActive) (game.talents.pierce.purchased ? maxBadDamage *= 0.015 : maxBadDamage *= 0.020);
        else maxBadDamage = 0; // We are in maps, so no pierce  
    } // Imaginary else clause; While technically I should now subtract block from damage, it has a couple special cases I'd have to handle and net gain is 0.00000nothing
    
    // Bad guy max dmg and bonus damage from other source computed, so time to do a total sum
    enemyDamage = maxBadDamage + bonusDmg;
    
    
    // Some special cases, where we want to force a stance
    // If no challenge is active and we are deep in magma (so block >> HP), just force D stance in Void maps because we cannot die anyway
    // If a challenge is active, just follow normal stance-dance (I was too lazy to check for bleed cases)
    if (game.global.currentMapId) {
     var mapLocation = game.global.mapsOwnedArray[getMapIndex(game.global.currentMapId)].location;
     if (mapLocation == "Void" && (game.global.challengeActive == "" || game.global.challengeActive == "Daily")) {
      if (game.talents.scry2.purchased) {
       setFormation(4); // Force S in voids; later add control for that (when I overhaul scryer UI)
       return true;
      } else {
       setFormation(2);
       return true;   
      }
     }
    } 
    
    // Start empowerments overrides
    var activeEmpowerment = getEmpowerment();
    const forceIce = getPageSetting('ForceIce');
    const forceWind = getPageSetting('ForceWind');
    const ignoreWindSpire = getPageSetting('WindSpire');
    var skipSpire = ignoreWindSpire && game.global.spireActive;
    
    // Force D when Ice empowerment is active with > 35 power (= healthy sharpie cannot kill us)
    if (activeEmpowerment == "Ice" && game.empowerments.Ice.level > 30 && forceIce) {
        setFormation(2);
        return;
    }
    
    // Force B in Wind world zones (not maps!) to achieve max wind stacks
    // Note: We'll use barrier instead of health because we want to go D stance after, if possible. Also scryer is useless in high zones because of stance-dancing -> no additional looot or DE
    if (newHDratio > 0.5 && forceWind && activeEmpowerment == "Wind" && !game.global.mapsActive && game.empowerments.Wind.currentDebuffPower < game.empowerments.Wind.maxStacks && !skipSpire) {
        // if we are in X/H stance, switch to H to avoid trimp death, else B stance
        if (game.global.formation == "0" || game.global.formation == 1) {
            // If we got killed by omnipotrimp in X/H stance, new one was not calculated yet. So, check HP and go B if we safely can
            if (10*game.global.soldierHealth >= 9*game.global.soldierHealthMax) {
                setFormation(3);
                return;
            }
            setFormation(1);
            return;
        } else {
            // Check if we're about to die on the next hit in B and if yes, go to H
            if (5*game.global.soldierHealth < enemyDamage) {
                setFormation(1);
                return;
            } else {
                setFormation(3);
                return;
            }
        }
    }
    
    // Overrides are over, let's start math
    // game.global.soldierHealthMax and game.global.soldierHealth;
        
    // If we are in X/H stance, verify we have enough health for swap higher damage stance; It's not optimal but I do not have to calculate "Do I survive the next hit?"
    if (game.global.formation == 1 && (game.global.soldierHealth/game.global.soldierHealthMax) > 0.9) setFormation("0");
    if (game.global.formation == "0" && (game.global.soldierHealth/game.global.soldierHealthMax) > 0.7) setFormation(2);    

    // Now the stance dance; For now very simple D force, no scryer. Might expand later
    // Of course ideal whould be what I did in Automaps for repeat button - put stance as a variable, then go through the function and at the end just call setFormation against it
    if (game.global.formation == 2 || game.global.formation == 3 || game.global.formation == 4) {
     if(enemyDamage >= game.global.soldierHealth) {
      // Barrier, Scryer or Dominance and next hit kills us
      setFormation("0");
     } else setFormation(2);
    } else if (game.global.formation == "0") {
     if(enemyDamage >= game.global.soldierHealth) {
      setFormation(1);
     }
    } else if (((game.jobs.Amalgamator.owned > 0) ? Math.floor((new Date().getTime() - game.global.lastSoldierSentAt) / 1000) : Math.floor(game.global.lastBreedTime / 1000)) > 45
               && !game.global.spireActive) {
     // I'm in H, which is next to none damage. Let's trimpicide when breed time over 45 and we are NOT in spire
     setFormation(2);
    } 
    return true;
}

function autoStance2() {
    //get back to a baseline of no stance (X)
    calcBaseDamageinX2();
    //debug("Entering autostance","other");
    //no need to continue
    if (game.global.gridArray.length === 0) return true;
    if (game.global.soldierHealth <= 0) return; //dont calculate stances when dead, cause the "current" numbers are not updated when dead.
    if (!getPageSetting('AutoStance')) return true;
    if (!game.upgrades.Formations.done) return true;
    //debug("Past first checks","other");
    
    // Some special cases, where we want to force a stance below
    // If no challenge is active and we are deep in magma (so block >> HP), just force D stance in Void maps because we cannot die
    // If a challenge is active, just follow normal stance-dance (I was too lazy to check for bleed cases)
    var enemy = getCurrentEnemy();
    if (typeof enemy === 'undefined') return true;
    var enemyHealth = enemy.health;
    var enemyDamage = calcBadGuyDmg(enemy,null,true,true);
    if (game.global.currentMapId) {
        var mapLocation = game.global.mapsOwnedArray[getMapIndex(game.global.currentMapId)].location;
        //debug("Location: " + mapLocation,"other");
        if (game.upgrades.Dominance.done && mapLocation == "Void" && game.global.challengeActive == "") {
            if (enemyDamage < game.global.soldierCurrentBlock) {
                setFormation(2);
                return true;
            }
        }
    }
    
    // Start empowerments overrides
    var activeEmpowerment = getEmpowerment();
    const forceIce = getPageSetting('ForceIce');
    const forceWind = getPageSetting('ForceWind');
    const ignoreWindSpire = getPageSetting('WindSpire');
    var skipSpire = ignoreWindSpire && game.global.spireActive;
    
    // Force D when Ice empowerment is active with > 35 power (= healthy sharpie cannot kill us)
    if (activeEmpowerment == "Ice" && game.empowerments.Ice.level > 30 && forceIce) {
        //debug("Ice level: " + game.empowerments.Ice.level, "other");
        // Improvement: Wait until we can get some anticipation stacks, so we don't just commit trimpicide?
        setFormation(2);
        return;
    }
    
    // Force B in Wind world zones (not maps!) to achieve max wind stacks; I should add a button to toggle this on...
    // Note: We'll use barrier instead of health because we want to go D stance after, if possible. Also scryer is useless in high zones because of stance-dancing -> no additional looot or DE
    if (forceWind && activeEmpowerment == "Wind" && !game.global.mapsActive && game.empowerments.Wind.currentDebuffPower < game.empowerments.Wind.maxStacks && !skipSpire) {
        // if we are in X/H stance, switch to H to avoid trimp death, else B stance
        if (game.global.formation == "0" || game.global.formation == 1) {
            // debug("Setting H stance for wind stacking");
            // If we got killed by omnipotrimp in X/H stance, new one was not calculated yet. So, check HP and go B if we safely can
            if (10*game.global.soldierHealth >= 9*game.global.soldierHealthMax) {
                setFormation(3);
                return;
            }
            setFormation(1);
            return;
        } else {
            // debug("Setting B stance for wind stacking");
            // Check if we're about to die on the next hit in B and if yes, go to H
            if (5*game.global.soldierHealth < enemyDamage) {
                setFormation(1);
                return;
            } else {
                setFormation(3);
                return;
            }
        }
    }
    
    //start analyzing autostance
    var missingHealth = game.global.soldierHealthMax - game.global.soldierHealth;
    var newSquadRdy = game.resources.trimps.realMax() <= game.resources.trimps.owned + 1;
    var dHealth = baseHealth/2;
    var xHealth = baseHealth;
    var bHealth = baseHealth/2;
    //COMMON:
    var corrupt = game.global.world >= mutations.Corruption.start();
    //crits
    var critMulti = 1;
    const ignoreCrits = getPageSetting('IgnoreCrits');
    var isCrushed = false;
    var isCritVoidMap = false;
    var isCritDaily = false;
    if (ignoreCrits == 2) { // Ignore all!
        (isCrushed = (game.global.challengeActive == "Crushed") && game.global.soldierHealth > game.global.soldierCurrentBlock)
            && (critMulti *= 5);
        (isCritVoidMap = (!ignoreCrits && game.global.voidBuff == 'getCrit') || (enemy.corrupted == 'corruptCrit'))
            && (critMulti *= 5);
        (isCritDaily = (game.global.challengeActive == "Daily") && (typeof game.global.dailyChallenge.crits !== 'undefined'))
            && (critMulti *= dailyModifiers.crits.getMult(game.global.dailyChallenge.crits.strength));
        enemyDamage *= critMulti;
    }
    //double attacks
    var isDoubleAttack = game.global.voidBuff == 'doubleAttack' || (enemy.corrupted == 'corruptDbl');
    //fast
    var enemyFast = (game.global.challengeActive == "Slow" || ((game.badGuys[enemy.name].fast || enemy.mutation == "Corruption") && game.global.challengeActive != "Coordinate" && game.global.challengeActive != "Nom")) || isDoubleAttack;
    //
    if (enemy.corrupted == 'corruptStrong')
        enemyDamage *= 2;
    if (enemy.corrupted == 'corruptTough')
        enemyHealth *= 5;

    //calc X,D,B:
    var xDamage = (enemyDamage - baseBlock);
    var dDamage = (enemyDamage - baseBlock / 2);
    var bDamage = (enemyDamage - baseBlock * 4);
    var dDamageNoCrit = (enemyDamage/critMulti - baseBlock/2);
    var xDamageNoCrit = (enemyDamage/critMulti - baseBlock);
    var pierce = 0;
    if (game.global.brokenPlanet && !game.global.mapsActive) {
        pierce = getPierceAmt();
        var atkPierce = pierce * enemyDamage;
        var atkPierceNoCrit = pierce * (enemyDamage/critMulti);
        if (xDamage < atkPierce) xDamage = atkPierce;
        if (dDamage < atkPierce) dDamage = atkPierce;
        if (bDamage < atkPierce) bDamage = atkPierce;
        if (dDamageNoCrit < atkPierceNoCrit) dDamageNoCrit = atkPierceNoCrit;
        if (xDamageNoCrit < atkPierceNoCrit) xDamageNoCrit = atkPierceNoCrit;
    }
    if (xDamage < 0) xDamage = 0;
    if (dDamage < 0) dDamage = 0;
    if (bDamage < 0) bDamage = 0;
    if (dDamageNoCrit < 0) dDamageNoCrit = 0;
    if (xDamageNoCrit < 0) xDamageNoCrit = 0;
    var isdba = isDoubleAttack ? 2 : 1;
    xDamage *= isdba;
    dDamage *= isdba;
    bDamage *= isdba;
    dDamageNoCrit *= isdba;
    xDamageNoCrit *= isdba;

    var drainChallenge = game.global.challengeActive == 'Nom' || game.global.challengeActive == "Toxicity";
    var dailyPlague = game.global.challengeActive == 'Daily' && (typeof game.global.dailyChallenge.plague !== 'undefined');
    var dailyBogged = game.global.challengeActive == 'Daily' && (typeof game.global.dailyChallenge.bogged !== 'undefined');
    var leadChallenge = game.global.challengeActive == 'Lead';
    if (drainChallenge) {
        var hplost = 0.20;  //equals 20% of TOTAL health
        dDamage += dHealth * hplost;
        xDamage += xHealth * hplost;
        bDamage += bHealth * hplost;
    } else if (dailyPlague) {
        drainChallenge = true;
        // 1 + was added to the stacks to anticipate the next stack ahead of time.
        var hplost = dailyModifiers.plague.getMult(game.global.dailyChallenge.plague.strength, 1 + game.global.dailyChallenge.plague.stacks);
        //x% of TOTAL health;
        dDamage += dHealth * hplost;
        xDamage += xHealth * hplost;
        bDamage += bHealth * hplost;
    } else if (dailyBogged) {
        drainChallenge = true;
        // 1 + was added to the stacks to anticipate the next stack ahead of time.
        var hplost = dailyModifiers.bogged.getMult(game.global.dailyChallenge.bogged.strength);
        //x% of TOTAL health;
        dDamage += dHealth * hplost;
        xDamage += xHealth * hplost;
        bDamage += bHealth * hplost;
    } else if (leadChallenge) {
        var leadDamage = game.challenges.Lead.stacks * 0.0003;  //0.03% of their health per enemy stack.
        var added = game.global.soldierHealthMax * leadDamage;
        dDamage += added;
        xDamage += added;
        bDamage += added;
    }
    //^dont attach^.
    if (game.global.voidBuff == "bleed" || (enemy.corrupted == 'corruptBleed')) {
        //20% of CURRENT health;
        var added = game.global.soldierHealth * 0.20;
        dDamage += added;
        xDamage += added;
        bDamage += added;
    }
    baseDamage *= (game.global.titimpLeft > 0 ? 2 : 1); //consider titimp
    baseDamage *= (!game.global.mapsActive && game.global.mapBonus > 0) ? ((game.global.mapBonus * .2) + 1) : 1;    //consider mapbonus

    //lead attack ok if challenge isn't lead, or we are going to one shot them, or we can survive the lead damage
    var oneshotFast = enemyFast ? enemyHealth <= baseDamage : false;
    var surviveD = ((newSquadRdy && dHealth > dDamage) || (dHealth - missingHealth > dDamage));
    var surviveX = ((newSquadRdy && xHealth > xDamage) || (xHealth - missingHealth > xDamage));
    var surviveB = ((newSquadRdy && bHealth > bDamage) || (bHealth - missingHealth > bDamage));
    var leadAttackOK = !leadChallenge || oneshotFast || surviveD;
    var drainAttackOK = !drainChallenge || oneshotFast || surviveD;
    var isCritThing = isCritVoidMap || isCritDaily || isCrushed;
    var voidCritinDok = !isCritThing || oneshotFast || surviveD;
    var voidCritinXok = !isCritThing || oneshotFast || surviveX;

    if (!game.global.preMapsActive && game.global.soldierHealth > 0) {
        //use D stance if: new army is ready&waiting / can survive void-double-attack or we can one-shot / can survive lead damage / can survive void-crit-dmg
        if (game.upgrades.Dominance.done && surviveD && leadAttackOK && drainAttackOK && voidCritinDok) {
            setFormation(2);
        //if CritVoidMap, switch out of D stance if we cant survive. Do various things.
        } else if (isCritThing && !voidCritinDok) {
            //if we are already in X and the NEXT potential crit would take us past the point of being able to return to D/B, switch to B.
            if (game.global.formation == "0" && game.global.soldierHealth - xDamage < bHealth){
                if (game.upgrades.Barrier.done && (newSquadRdy || missingHealth < bHealth))
                    setFormation(3);
            }
            //else if we can totally block all crit damage in X mode, OR we can't survive-crit in D, but we can in X, switch to X.
            // NOTE: during next loop, the If-block above may immediately decide it wants to switch to B.
            else if (xDamage == 0 || ((game.global.formation == 2 || game.global.formation == 4) && voidCritinXok)){
                setFormation("0");
            }
            //otherwise, stuff: (Try for B again)
            else {
                if (game.global.formation == "0"){
                    if (game.upgrades.Barrier.done && (newSquadRdy || missingHealth < bHealth))
                        setFormation(3);
                    else
                        setFormation(1);
                }
                else if (game.upgrades.Barrier.done && (game.global.formation == 2 || game.global.formation == 4))
                    setFormation(3);
            }
        } else if (game.upgrades.Formations.done && surviveX) {
            //in lead challenge, switch to H if about to die, so doesn't just die in X mode without trying
            if ((game.global.challengeActive == 'Lead') && (xHealth - missingHealth < xDamage + (xHealth * leadDamage)))
                setFormation(1);
            else
                setFormation("0");
        } else if (game.upgrades.Barrier.done && surviveB) {
            if (game.global.formation != 3) {
                setFormation(3);    //does this ever run?
                debug("AutoStance B/3","other");
            }
        } else {
            if (game.global.formation != 1) {
                setFormation(1);    //the last thing that runs
            }
        }
    }
    baseDamage /= (game.global.titimpLeft > 0 ? 2 : 1); //unconsider titimp
    baseDamage /= (!game.global.mapsActive && game.global.mapBonus > 0) ? ((game.global.mapBonus * .2) + 1) : 1;    //unconsider mapbonus
    return true;
}

function autoStanceCheck(enemyCrit) {
    if (game.global.gridArray.length === 0) return [true,true];
    //baseDamage              //in stance attack,              //min, //disable stances, //enable flucts
    var ourDamage = calcOurDmg(game.global.soldierCurrentAttack,true,true,true);
    //baseBlock
    var ourBlock = game.global.soldierCurrentBlock;
    //baseHealth
    var ourHealth = game.global.soldierHealthMax;

    //start analyzing autostance
    var missingHealth = game.global.soldierHealthMax - game.global.soldierHealth;
    var newSquadRdy = game.resources.trimps.realMax() <= game.resources.trimps.owned + 1;

    //COMMON:
    var corrupt = game.global.world >= mutations.Corruption.start();
    var enemy = getCurrentEnemy();
    if (typeof enemy === 'undefined') return [true,true];
    var enemyHealth = enemy.health;
    var enemyDamage = calcBadGuyDmg(enemy,null,true,true,true);   //(enemy,attack,daily,maxormin,disableFlucts)
    //crits
    var critMulti = 1;
    const ignoreCrits = getPageSetting('IgnoreCrits');
    var isCrushed = false;
    var isCritVoidMap = false;
    var isCritDaily = false;
    if (ignoreCrits == 2) { // Ignored all!
        (isCrushed = game.global.challengeActive == "Crushed" && game.global.soldierHealth > game.global.soldierCurrentBlock)
            && enemyCrit && (critMulti *= 5);
        (isCritVoidMap = game.global.voidBuff == 'getCrit' || enemy.corrupted == 'corruptCrit')
            && enemyCrit && (critMulti *= 5);
        (isCritDaily = game.global.challengeActive == "Daily" && typeof game.global.dailyChallenge.crits !== 'undefined')
            && enemyCrit && (critMulti *= dailyModifiers.crits.getMult(game.global.dailyChallenge.crits.strength));
        if (enemyCrit)
            enemyDamage *= critMulti;
    }
    //double attacks
    var isDoubleAttack = game.global.voidBuff == 'doubleAttack' || (enemy.corrupted == 'corruptDbl');
    //fast
    var enemyFast = (game.global.challengeActive == "Slow" || ((game.badGuys[enemy.name].fast || enemy.mutation == "Corruption") && game.global.challengeActive != "Coordinate" && game.global.challengeActive != "Nom")) || isDoubleAttack;
    if (enemy.corrupted == 'corruptStrong')
        enemyDamage *= 2;
    if (enemy.corrupted == 'corruptTough')
        enemyHealth *= 5;
    //calc X,D,B:
    enemyDamage -= ourBlock;
    var pierce = 0;
    if (game.global.brokenPlanet && !game.global.mapsActive) {
        pierce = getPierceAmt();
        var atkPierce = pierce * enemyDamage;
        if (enemyDamage < atkPierce) enemyDamage = atkPierce;
    }
    if (enemyDamage < 0) enemyDamage = 0;
    var isdba = isDoubleAttack ? 2 : 1;
    enemyDamage *= isdba;
    var drainChallenge = game.global.challengeActive == 'Nom' || game.global.challengeActive == "Toxicity";
    var dailyPlague = game.global.challengeActive == 'Daily' && (typeof game.global.dailyChallenge.plague !== 'undefined');
    var dailyBogged = game.global.challengeActive == 'Daily' && (typeof game.global.dailyChallenge.bogged !== 'undefined');
    var leadChallenge = game.global.challengeActive == 'Lead';
    if (drainChallenge) {
        var hplost = 0.20;  //equals 20% of TOTAL health
        enemyDamage += ourHealth * hplost;
    } else if (dailyPlague) {
        drainChallenge = true;
        var hplost = dailyModifiers.plague.getMult(game.global.dailyChallenge.plague.strength, 1 + game.global.dailyChallenge.plague.stacks);
        //x% of TOTAL health;
        enemyDamage += ourHealth * hplost;
    } else if (dailyBogged) {
        drainChallenge = true;
        var hplost = dailyModifiers.bogged.getMult(game.global.dailyChallenge.bogged.strength);
        //x% of TOTAL health;
        enemyDamage += ourHealth * hplost;
    } else if (leadChallenge) {
        var leadDamage = game.challenges.Lead.stacks * 0.0003;
        enemyDamage += game.global.soldierHealthMax * leadDamage;
    }
    //^dont attach^.
    if (game.global.voidBuff == "bleed" || (enemy.corrupted == 'corruptBleed')) {
        enemyDamage += game.global.soldierHealth * 0.2;
    }
    ourDamage *= (game.global.titimpLeft > 0 ? 2 : 1); //consider titimp
    ourDamage *= (!game.global.mapsActive && game.global.mapBonus > 0) ? ((game.global.mapBonus * .2) + 1) : 1;    //consider mapbonus

    //lead attack ok if challenge isn't lead, or we are going to one shot them, or we can survive the lead damage
    var oneshotFast = enemyFast ? enemyHealth <= ourDamage : false;
    var survive = ((newSquadRdy && ourHealth > enemyDamage) || (ourHealth - missingHealth > enemyDamage));
    var leadAttackOK = !leadChallenge || oneshotFast || survive;
    var drainAttackOK = !drainChallenge || oneshotFast || survive;
    var isCritThing = isCritVoidMap || isCritDaily || isCrushed;
    var voidCritok = !isCritThing || oneshotFast || survive;

    if (!game.global.preMapsActive) {
        var enoughDamage2 = enemyHealth <= ourDamage;
        var enoughHealth2 = survive && leadAttackOK && drainAttackOK && voidCritok;
        // } else {
            // var ourCritMult = getPlayerCritChance() ? getPlayerCritDamageMult() : 1;
            // var ourDmg = (ourDamage)*ourCritMult;
            // var enoughDamage2 = enemyHealth <= ourDmg;
            // var surviveOneShot = enemyFast ? ourHealth > xDamageNoCrit : enemyHealth < ourDmg;
            // var enoughHealth2 = surviveOneShot && leadAttackOK && drainAttackOK && voidCritok;
        // }
        ourDamage /= (game.global.titimpLeft > 0 ? 2 : 1); //unconsider titimp
        ourDamage /= (!game.global.mapsActive && game.global.mapBonus > 0) ? ((game.global.mapBonus * .2) + 1) : 1;    //unconsider mapbonus
        return [enoughHealth2,enoughDamage2];
    } else
        return [true,true];
}
