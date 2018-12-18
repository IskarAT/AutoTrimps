var upgradeList = ['Miners', 'Scientists', 'Coordination', 'Speedminer', 'Speedlumber', 'Speedfarming', 'Speedscience', 'Speedexplorer', 'Megaminer', 'Megalumber', 'Megafarming', 'Megascience', 'Efficiency', 'TrainTacular', 'Trainers', 'Explorers', 'Blockmaster', 'Battle', 'Bloodlust', 'Bounty', 'Egg', 'Anger', 'Formations', 'Dominance', 'Barrier', 'UberHut', 'UberHouse', 'UberMansion', 'UberHotel', 'UberResort', 'Trapstorm', 'Gigastation', 'Shieldblock', 'Potency', 'Magmamancers'];


//Buys all available non-equip upgrades listed in var upgradeList
function buyUpgrades() {
    // Get Wind farm settings; cannot move to global vars in case user changes them
    const forceWind = getPageSetting('ForceWind');
    const windModifier = getPageSetting('WindModifier');
    const ignoreWindSpire = getPageSetting('WindSpire');
    var skipSpire = ignoreWindSpire && game.global.spireActive;
    for (var upgrade in upgradeList) {
        upgrade = upgradeList[upgrade];
        var gameUpgrade = game.upgrades[upgrade];
        var available = (gameUpgrade.allowed > gameUpgrade.done && canAffordTwoLevel(gameUpgrade));
        // Coordinations behavior; Do not buy on wind when under specific H:D, hold coords to get more 'gators when really safely overkilling or do not buy at all
        if (upgrade == 'Coordination' && (((getPageSetting('HoldCoords') == 1 || !canAffordCoordinationTrimps()))
            || (getEmpowerment() == "Wind" && !skipSpire && forceWind && windModifier > 4 * Math.floor(newHDratio)) || (getPageSetting('HoldCoords') == 2 && newHDratio < 0.0000001))) continue;
        if (upgrade == 'Shieldblock' && !getPageSetting('BuyShieldblock')) continue;
        if (upgrade == 'Gigastation' && (game.global.lastWarp ? game.buildings.Warpstation.owned < (Math.floor(game.upgrades.Gigastation.done * getPageSetting('DeltaGigastation')) + getPageSetting('FirstGigastation')) : game.buildings.Warpstation.owned < getPageSetting('FirstGigastation'))) continue;
        //skip bloodlust during scientist challenges and while we have autofight enabled.
        if (upgrade == 'Bloodlust' && game.global.challengeActive == 'Scientist' && getPageSetting('BetterAutoFight')) continue;
        //skip potency when autoBreedTimer is disabled
        if (upgrade == 'Potency' && getPageSetting('GeneticistTimer') >= 0) continue;

        //Main logics:
        if (!available) continue;
        if (game.upgrades.Scientists.done < game.upgrades.Scientists.allowed && upgrade != 'Scientists') continue;
        buyUpgrade(upgrade, true, true);
        debug('Upgraded ' + upgrade, "upgrades", "*upload2");
    //loop again.
    }
}
