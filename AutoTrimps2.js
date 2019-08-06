// ==UserScript==
// @name         AutoTrimpsV2+coderpatsy
// @namespace    https://github.com/coderpatsy/AutoTrimps
// @version      2.1.5.9p10-coderpatsy-12-1-2017+Mod+Uni
// @description  Automate all the trimps!
// @author       zininzinin, spindrjr, belaith, Ishkaru, genBTC, Unihedron, coderpatsy
// @include      *trimps.github.io*
// @include      *kongregate.com/games/GreenSatellite/trimps
// @grant        none
// ==/UserScript==
var ATversion = '2.1.5.9p10-coderpatsy-12-1-2017+Mod+Uni';

////////////////////////////////////////////////////////////////////////////////
//Main Loader Initialize Function (loads first, load everything else)///////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////
var atscript = document.getElementById('AutoTrimps-script')
  , base = 'https://coderpatsy.github.io/AutoTrimps/'
  , module = 'modules/'
  ;
if (atscript !== null) {
    base = atscript.getAttribute('src').replace(/AutoTrimps2\.js$/, '');
}
//Load stuff needed to load other stuff:
document.head.appendChild(document.createElement('script')).src = base + module + 'utils.js';

function initializeAutoTrimps() {
    loadPageVariables();
    document.head.appendChild(document.createElement('script')).src = base + 'NewUI2.js';
    document.head.appendChild(document.createElement('script')).src = base + 'Graphs.js';
    //Load modules:
    var modules = ['query', 'upgrades', 'heirlooms', 'buildings', 'jobs', 'equipment', 'gather', 'autostance', 'battlecalc', 'automaps', 'autobreedtimer', 'dynprestige', 'autofight', 'scryer', 'magma', 'portal', 'other'];
    for (var i=0,len=modules.length; i<len; i++) {
        document.head.appendChild(document.createElement('script')).src = base + module + modules[i] + '.js';
    }
    //Autoperks
    if (typeof(AutoPerks) === 'undefined')
        document.head.appendChild(document.createElement('script')).src = base + module + 'autoperks.js';
    else
        debug('AutoPerks is now included in Autotrimps, please disable the tampermonkey script for AutoPerks to remove this message!', '*spinner3');
    toggleSettingsMenu();
    toggleSettingsMenu();
    // dank dark graphs by Unihedron
    if (game.options.menu.darkTheme.enabled == 2) {
        const $link = document.createElement('link');
        $link.rel = "stylesheet";
        $link.type = "text/css";
        $link.href = base + 'dark-graph.css';
        document.head.appendChild($link);
    }
    //
    debug('AutoTrimps v' + ATversion + ' Loaded!', '*spinner3');
}

function printChangelog() {
    tooltip('confirm', null, 'update', '\
<br><b class="AutoEggs">11/26/2017 v2.1.5.9p10</b>\
<br>Add option to never use scryer in void maps\
<br><b class="AutoEggs">11/26/2017 v2.1.5.9p9</b>\
<br>Fix Chrono/Jestimps in 4.6\
<br><b class="AutoEggs">11/22/2017 v2.1.5.9p8</b> genBTC update\
<br>The genBTC version of the script has been updated with most of this fork\'s changes, and vice-versa.\
<br>If you migrate, genBTC has a zone-based Maps -> Ignore Spires Until setting instead of this fork\'s genBTC -> Min Spire for AT.\
<br>This fork will be kept up for the time being.\
<br><u>Report any bugs/problems please! You can find me on Discord: <span style="background-color:#ddd;color:#222">patsy#5684</span></u>\
<br><a href="https://github.com/coderpatsy/AutoTrimps/commits/gh-pages" target="#">Check the commit history</a> (if you care)\
', 'cancelTooltip()', 'Script Update Notice ' + ATversion);
}
////////////////////////////////////////
//Main DELAY Loop///////////////////////
////////////////////////////////////////

//Magic Numbers/////////////////////////
var runInterval = 100;      //How often to loop through logic
var startupDelay = 2000;    //How long to wait for everything to load

setTimeout(delayStart, startupDelay);
function delayStart() {
    initializeAutoTrimps();
    printChangelog();
    setTimeout(delayStartAgain, startupDelay);
}
function delayStartAgain(){
    setInterval(mainLoop, runInterval);
    setInterval(guiLoop, runInterval*10);
    updateCustomButtons();
    document.getElementById('Prestige').value = autoTrimpSettings.PrestigeBackup.selected;
    //MODULESdefault = MODULES;
    //MODULESdefault = Object.assign({}, MODULES);
    MODULESdefault = JSON.parse(JSON.stringify(MODULES));
}

////////////////////////////////////////
//Global Main vars /////////////////////
////////////////////////////////////////
////////////////////////////////////////

var AutoTrimpsDebugTabVisible = true;
var enableDebug = true; //Spam console
var autoTrimpSettings = {};

var MODULES = {};
var MODULESdefault = {};
var autoTrimpVariables = {};
var bestBuilding;
var scienceNeeded;
var breedFire = false;

var shouldFarm = false;
var enoughDamage = true;
var enoughHealth = true;

var baseDamage = 0;
var baseBlock = 0;
var baseHealth = 0;

var preBuyAmt;
var preBuyFiring;
var preBuyTooltip;
var preBuymaxSplit;

var ATrunning = true;
var magmiteSpenderChanged = false;
var BAFsetting, oldBAFsetting;

var currentworld = 0;
var lastrunworld = 0;
var aWholeNewWorld = false;
var needGymystic = true;
var heirloomFlag = false;
var heirloomCache = game.global.heirloomsExtra.length;

//reset stuff that may not have gotten cleaned up on portal
function mainCleanup() {
    lastrunworld = currentworld;
    currentworld = game.global.world;
    aWholeNewWorld = lastrunworld != currentworld;
    //run once per portal:
    if (currentworld == 1 && aWholeNewWorld) {
        lastHeliumZone = 0;
        zonePostpone = 0;
        //for the dummies like me who always forget to turn automaps back on after portaling
        if(!game.upgrades.Battle.done && autoTrimpSettings.AutoMaps.enabled == false)
            settingChanged("AutoMaps");
        return true; // Do other things
    }
}

////////////////////////////////////////
//Main LOGIC Loop///////////////////////
////////////////////////////////////////
////////////////////////////////////////
function mainLoop() {
    if (ATrunning == false) return;
    ATrunning = true;
    if(game.options.menu.showFullBreed.enabled != 1) toggleSetting("showFullBreed");    //more detail
    addbreedTimerInsideText.innerHTML = ((game.jobs.Amalgamator.owned > 0) ? Math.floor((new Date().getTime() - game.global.lastSoldierSentAt) / 1000) : Math.floor(game.global.lastBreedTime / 1000)) + 's'; //add breed time for next army;
    if (armycount.className != "tooltipadded") addToolTipToArmyCount();
    if (mainCleanup() // Z1 new world
            || portalWindowOpen // in the portal screen (for manual portallers)
            || (!heirloomsShown && heirloomFlag) // closed heirlooms screen
            || (heirloomCache != game.global.heirloomsExtra.length)) { // inventory size changed (a drop appeared)
            // also pre-portal: portal.js:111
        if (getPageSetting('AutoHeirlooms')) autoHeirlooms();//"Auto Heirlooms"      (")

        heirloomCache = game.global.heirloomsExtra.length;
    }
    heirloomFlag = heirloomsShown;

    if(getPageSetting('PauseScript') || game.options.menu.pauseGame.enabled || game.global.viewingUpgrades) return;
    game.global.addonUser = true;
    game.global.autotrimps = {
        firstgiga: getPageSetting('FirstGigastation'),
        deltagiga: getPageSetting('DeltaGigastation')
    }
    if (aWholeNewWorld) {
        // Auto-close dialogues.
        switch (document.getElementById('tipTitle').innerHTML) {
            case 'The Improbability':   // Breaking the Planet
            case 'Corruption':          // Corruption / True Corruption
            case 'Spire':               // Spire
            case 'The Magma':           // Magma
                cancelTooltip();
        }
        setTitle(); // Set the browser title

        if (getPageSetting('AutoEggs'))
            easterEggClicked();
    }
    setScienceNeeded();  //determine how much science is needed

    //EXECUTE CORE LOGIC
    if (getPageSetting('ExitSpireCell') >0) exitSpireCell(); //"Exit Spire After Cell" (other.js)
    if (getPageSetting('BuyUpgrades')) buyUpgrades();   //"Buy Upgrades"       (upgrades.js)
    autoGoldenUpgradesAT();
    if (getPageSetting('BuyStorage'))
        buyStorage();     //"Buy Storage"     (buildings.js)
    if (game.global.lastClearedCell > 88) { // Sadly I removed some settings from AT so things stopped working in AutoPortal etc. :) cell 88 is to work inside voids
      buyBuildings(); //"Buy Buildings"   (buildings.js)
      autoHeirlooms(); // Carry heirlooms (heirlooms.js)
    } 
    needGymystic = false;   //reset this after buyBuildings
    if (getPageSetting('ManualGather2')<=2) manualLabor();  //"Auto Gather/Build"           (gather.js)
    else if (getPageSetting('ManualGather2')==3) manualLabor2();  //"Auto Gather/Build #2"     (")
    if (getPageSetting('AutoMaps')) autoMap();          //"Auto Maps"   (automaps.js)
    else updateAutoMapsStatus();
    if (autoTrimpSettings.AutoPortal.selected != "Off") autoPortal();   //"Auto Portal" (hidden until level 40) (portal.js)

    if (getPageSetting('TrapTrimps') && game.global.trapBuildAllowed && game.global.trapBuildToggled == false) toggleAutoTrap(); //"Trap Trimps"
    if (aWholeNewWorld && getPageSetting('AutoRoboTrimp')) autoRoboTrimp();   //"AutoRoboTrimp" (other.js)
    autoLevelEquipment();           //"Buy Armor", "Buy Armor Upgrades", "Buy Weapons", "Buy Weapons Upgrades"  (equipment.js)

    BAFsetting = getPageSetting('BetterAutoFight');
    if (BAFsetting==1) betterAutoFight();        //"Better Auto Fight"  (autofight.js)
    else if (BAFsetting==2) betterAutoFight2();     //"Better Auto Fight2"  (")
    else if (BAFsetting==0 && BAFsetting!=oldBAFsetting && game.global.autoBattle && game.global.pauseFight)  pauseFight(); //turn on autofight on once when BAF is toggled off.
    else if (BAFsetting==0 && game.global.world == 1 && game.global.autoBattle && game.global.pauseFight) pauseFight();     //turn on autofight on lvl 1 if its off.
    else if (BAFsetting==0 && !game.global.autoBattle && game.global.soldierHealth == 0) betterAutoFight();   //use BAF as a backup for pre-Battle situations
    oldBAFsetting = BAFsetting;                                            //enables built-in autofight once when disabled  
  
    if (getPageSetting('AutoStance')<=1) autoStance();    //"Auto Stance"      (autostance.js)
    else if (getPageSetting('AutoStance')==2) autoStance2();   //"Auto Stance #2"       (")
    if (getPageSetting('UseAutoGen')) autoGenerator(); // "Auto Generator ON" (magma.js)

    //Auto Magmite Spender
    try {
        if (getPageSetting('AutoMagmiteSpender2')==2 && !magmiteSpenderChanged)
            autoMagmiteSpender(); // magma.js
    } catch (err) {
        debug("Error encountered in AutoMagmiteSpender(Always): " + err.message,"general");
    }

    if (getPageSetting('AutoNatureTokens')) autoNatureTokens();

    //Runs any user provided scripts - by copying and pasting a function named userscripts() into the Chrome Dev console. (F12)
    if (userscriptOn) userscripts();
    //rinse, repeat
    return;
}

//GUI Updates happen on this thread, every 1000ms, concurrently
function guiLoop() {
    updateCustomButtons();
}

// Userscript loader. write your own!
var userscriptOn = true;    //controls the looping of userscripts and can be self-disabled
var globalvar0,globalvar1,globalvar2,globalvar3,globalvar4,globalvar5,globalvar6,globalvar7,globalvar8,globalvar9;
//left blank intentionally. the user will provide this. blank global vars are included as an example
function userscripts()
{
    //insert code here:
}
