//AutoTrimps GUI - Current Version 2.1.5.8
//maintained by genBTC, November 2017

(function () {
    //create the Automation icon in the game bar
    automationMenuInit();
}());

//create container for settings buttons
function automationMenuSettingsInit() {
    var settingsrow = document.getElementById("settingsRow");
    var autoSettings = document.createElement("DIV");
    autoSettings.id = "autoSettings";
    autoSettings.setAttribute("style", "display: none; max-height: 96vh;overflow: auto;");
    settingsrow.appendChild(autoSettings);
}
automationMenuSettingsInit();

//prepare CSS for new Tab interface
var link1 = document.createElement('link');
link1.rel = "stylesheet";
link1.type = "text/css";
link1.href = base + 'tabs.css';
document.head.appendChild(link1);

//Tab make helperfunctions
function createTabs(name, description) {
    var li_0 = document.createElement('li');

    var a_0 = document.createElement('a');
    a_0.className = "tablinks";
    a_0.setAttribute('onclick', 'toggleTab(event, \'' + name + '\')');
    a_0.href = "#";
    a_0.appendChild(document.createTextNode(name));
    li_0.id = 'tab' + name;
    li_0.appendChild(a_0);

    addtabsUL.appendChild(li_0);
    createTabContents(name, description);
}

function createTabContents(name, description) {
    var div_0 = document.createElement('div');
    div_0.className = "tabcontent";
    div_0.id = name;

    var div_1 = document.createElement('div');
    div_1.setAttribute("style", "margin-left: 1vw; margin-right: 1vw;");
    var h4_0 = document.createElement('h4');
    h4_0.setAttribute('style', 'font-size: 1.2vw;');
    h4_0.appendChild(document.createTextNode(description));
    div_1.appendChild(h4_0);

    div_0.appendChild(div_1);

    addTabsDiv.appendChild(div_0);
}

function toggleTab(evt, tabName) {
    //Toggle.
    if (evt.currentTarget.className.indexOf(" active") > -1) {
        document.getElementById(tabName).style.display = "none";
        evt.currentTarget.className = evt.currentTarget.className.replace(" active", "");
    } else {
        document.getElementById(tabName).style.display = "block";
        evt.currentTarget.className += " active";
    }
}

function minimizeAllTabs() {
    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
    for (var i = 0,len = tabcontent.length; i < len ; i++) {
        tabcontent[i].style.display = "none";
    }
    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (var i = 0,len = tablinks.length; i < len ; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
}
var addTabsDiv;
var addtabsUL;
//Actually Make the Tabs
function initializeAllTabs() {
    //CREATE TABS + CONTENT
    addTabsDiv = document.createElement('div');
    addtabsUL = document.createElement('ul');
    addtabsUL.className = "tab";
    addTabsDiv.appendChild(addtabsUL);
    //Make Tabs.
    createTabs("Core", "Main Controls for the script");
    createTabs("Gear", "Gear = Prestiges / Equipment settings");
    createTabs("Maps", "AutoMaps + VoidMaps related Settings");
    createTabs("Settings", "Sub Controls for the script");
    createTabs("genBTC", "GenBTC Advanced");
    createTabs("Magma", "Dimensional Generator");
    createTabs("Golden", "Golden Upgrade Strategies and other special settings");
    createTabs("Nature", "Nature");
    createTabs("Spam", "Controls AutoTrimps message Spam");
    createTabs("Import Export", "Import Export Settings");
    //add a minimize button:
    var li_0 = document.createElement('li');
    var a_0 = document.createElement('a');
    a_0.className = "tablinks minimize";
    a_0.setAttribute('onclick', 'minimizeAllTabs()');
    a_0.href = "#";
    a_0.appendChild(document.createTextNode("Minimize All"));
    li_0.appendChild(a_0);
    li_0.setAttribute("style", "float:right!important;");
    addtabsUL.appendChild(li_0);
    //Insert tabs into the game area
    document.getElementById("autoSettings").appendChild(addTabsDiv);
    //pretend click to make first tab active.
    document.getElementById("Core").style.display = "block";
    document.getElementsByClassName("tablinks")[0].className += " active";
}
initializeAllTabs();

//Actually Make the Settings Buttons
function initializeAllSettings() {
    //START MAKING BUTTONS IN THE TABS:
//CORE:
    createSetting('ManualGather2', ['Gather/Build OFF', 'Auto Gather/Build', 'Science Research OFF', 'Auto Gather/Build #2'], '3-Way Button. Auto Gathering of Food,Wood,Metal(w/turkimp) & Science. Auto speed-Builds your build queue. Now able to turn science researching off for the achievement Reach Z120 without using manual research. Please test the Auto Gather/Build #2, its experimental but should work.', 'multitoggle', 1, null, "Core");
    createSetting('BetterAutoFight', ['Better AutoFight OFF', 'Better Auto Fight 1', 'Better Auto Fight 2'], '3-Way Button, Recommended. Will automatically handle fighting. #2 is the new one, #1 is the old algorithm (if you have any issues). The new BAF#2 does: 3)Click fight anyway if we are dead and stuck in a loop due to Dimensional Generator and we can get away with adding time to it.(RemainingTime + ArmyAdd.Time &lt; GeneTimer) and 4) Clicks fight anyway if we are dead and have &gt;=31 NextGroupTimer and deal with the consequences by firing genetecists afterwards. WARNING: If you autoportal with BetterAutoFight disabled, the game sits there doing nothing until you click FIGHT. (not good for afk) ', 'multitoggle', 1, null, "Core");
    createSetting('AutoStance', ['Auto Stance OFF', 'Auto Stance 1', 'Auto Stance 2'], 'Automatically swap stances to avoid death. Please test the Autostance #2, its very experimental, and in beta.', 'multitoggle', 1, null, "Core");
    createSetting('BuyStorage', 'Buy Storage', 'Will buy storage when resource is almost full. (like AutoStorage, even anticipates Jestimp)', 'boolean', true, null, "Core");
    createSetting('BuyUpgrades', 'Buy Upgrades', 'Autobuy non equipment Upgrades', 'boolean', true, null, "Core");
    createSetting('TrapTrimps', 'Trap Trimps', 'Automatically trap trimps when needed, including building traps. (when you turn off, make sure you also turn off the ingame AutoTraps button)', 'boolean', true, null, "Core");
    
    createSetting('AutoPortal', 'Auto Portal', 'Automatically portal. Will NOT auto-portal if you have a challenge active, the challenge setting dictates which challenge it will select for the next run. All challenge settings will portal right after the challenge ends, regardless. Helium Per Hour only <b>portals at cell 1</b> of the first level where your He/Hr went down even slightly compared to the current runs Best He/Hr. Take note, there is a Buffer option, which is like a grace percentage of how low it can dip without triggering. Setting a buffer will portal mid-zone if you exceed 5x of the buffer.  CAUTION: Selecting He/hr may immediately portal you if its lower-(use Pause AutoTrimps button to pause the script first to avoid this)', 'dropdown', 'Off', ['Off', 'Helium Per Hour', 'Balance', 'Decay', 'Electricity', 'Crushed', 'Nom', 'Toxicity', 'Watch', 'Lead', 'Corrupted', 'Custom'], "Core");
    createSetting('HeliumHourChallenge', 'Challenge list for U1 portal', 'Automatically portal into this challenge when using helium per hour or custom autoportal.', 'dropdown', 'None', ['None', 'Balance', 'Decay', 'Electricity', 'Crushed', 'Nom', 'Toxicity', 'Life', 'Watch', 'Lead', 'Corrupted', 'Domination'], "Core");
    createSetting('RadonHourChallenge', 'Challenge list for U2 portal', 'Automatically portal into this challenge when using helium per hour or custom autoportal.', 'dropdown', 'None', ['None', 'Bublé', 'Melt', 'Quagmire', 'Archaeology', 'Insanity'], "Core");
    document.getElementById("HeliumHourChallengeLabel").innerHTML = "Helium:";
    document.getElementById("RadonHourChallengeLabel").innerHTML = "Radon:";
    createSetting('CustomAutoPortal', 'Custom Portal U1', 'Automatically portal AFTER clearing this level.(ie: setting to 200 would portal when you first reach level 201)', 'value', '200', null, "Core");
    createSetting('CustomAutoPortalU2', 'Custom Portal U2', 'Automatically portal AFTER clearing this level.(ie: setting to 200 would portal when you first reach level 201)', 'value', '20', null, "Core");
    createSetting('HeHrDontPortalBefore', 'He/Hr Dont Portal Before', 'Do NOT allow Helium per Hour AutoPortal setting to portal BEFORE this level is reached. It is an additional check that prevents drops in helium/hr from triggering autoportal. Set to 0 or -1 to completely disable this check.', 'value', '200', null, "Core");
    createSetting('HeliumHrBuffer', 'He/Hr Portal Buffer %', 'IMPORTANT SETTING. When using the He/Hr Autoportal, it will portal if your He/Hr drops by this amount of % lower than your best for current run, default is 0% (ie: set to 5 to portal at 95% of your best). Now with stuck protection - Allows portaling midzone if we exceed set buffer amount by 5x. (ie a normal 2% buffer setting would now portal mid-zone you fall below 10% buffer).', 'value', '0', null, 'Core');
    
    createSetting('AutoFinishDaily', 'Auto Finish Daily', 'With this on, the He/Hr Portal and Custom Auto Portal options will auto-finish the daily <b>whenever they trigger</b> and THEN portal you.', 'boolean', false, null, 'Core');
    createSetting('AutoFinishDailyZone', 'Finish Daily Zone Mod', 'Finish Daily by this # of zones earlier/later than your regular Custom AutoPortal zone or your Helium Dont Portal Before zone. When Auto Finish Daily is on. Tip: Tune your value of He/HrDontPortalBefore to suit the daily, and then tune this. Can accept negative numbers for earlier, ie: -7 means portal 7 zones earlier than normal. Can also use positive numbers to DELAY portaling for later. When used with He/Hr AutoPortal, the number of zones early does not FORCE end the daily at that zone, only ALLOW it to end that early: it will Always end when your HE/hr drops enough to trigger the portal. <b>Use 0 to disable.</b>', 'valueNegative', -2, null, 'Core');
    createSetting('AutoStartDaily', 'Auto Start Daily', 'With this on, the Auto Portal options will portal you into and auto-start the daily <b>whenever available</b>. Does Yesterday first, followed by Today. Falls back to selected challenge when both are complete.', 'boolean', false, null, 'Core');
    createSetting('NoWasteDaily', 'Do not waste Daily', 'When true, runs dailies anyway if they are about to expire.', 'boolean', false, null, 'Core');
    
    createSetting('PauseScript', 'Pause AutoTrimps', 'Pause AutoTrimps Script (not including the graphs module)', 'boolean', null, null, 'Core');
    document.getElementById('PauseScript').parentNode.style.setProperty('float','right');
    document.getElementById('PauseScript').parentNode.style.setProperty('margin-right','1vw');
    document.getElementById('PauseScript').parentNode.style.setProperty('margin-left','0');

//GEAR:
    createSetting('BuyArmor', 'Buy Armor', 'Auto-Buy/Level-Up the most cost efficient armor available. ', 'boolean', true, null, "Gear");
    createSetting('BuyArmorUpgrades', 'Buy Armor Upgrades', '(Prestiges) & Gymystic. Will buy the most efficient armor upgrade available. ', 'boolean', true, null, "Gear");
    createSetting('BuyWeapons', 'Buy Weapons', 'Auto-Buy/Level-Up the most cost efficient weapon available. ', 'boolean', true, null, "Gear");
    createSetting('BuyWeaponUpgrades', 'Buy Weapon Upgrades', '(Prestiges) Will buy the most efficient weapon upgrade available. ', 'boolean', true, null, "Gear");
    createSetting('BuyShieldblock', 'Buy Shield Block', 'Will buy the shield block upgrade. CAUTION: If you are progressing past zone 60, you probably don\'t want this :)', 'boolean', false, null, "Gear");
    createSetting('Prestige', 'Prestige', 'Acquire prestiges through the selected item (inclusive) as soon as they are available in maps. Forces equip first mode. Automap must be enabled. THIS IS AN IMPORTANT SETTING related to speed climbing and should probably always be on something. If you find the script getting stuck somewhere, particularly where you should easily be able to kill stuff, setting this to an option lower down in the list will help ensure you are more powerful at all times, but will spend more time acquiring the prestiges in maps.', 'dropdown', 'Polierarm', ['Off', 'Supershield', 'Dagadder', 'Bootboost', 'Megamace', 'Hellishmet', 'Polierarm', 'Pantastic', 'Axeidic', 'Smoldershoulder', 'Greatersword', 'Bestplate', 'Harmbalest', 'GambesOP'], "Gear");
    //Make a backup of the prestige setting: backup setting grabs the actual value of the primary setting any time it is changed, (line 412 of the function settingChanged())
    var lastSetting = autoTrimpSettings["PrestigeBackup"];
    autoTrimpSettings["PrestigeBackup"] = {
        selected: lastSetting === undefined ? autoTrimpSettings["Prestige"] : lastSetting.selected || lastSetting,
        id: "PrestigeBackup",
        name: "PrestigeBackup"
    };
    createSetting('DynamicPrestige2', 'Dynamic Prestige z', 'Dynamic Prestige: <b>Set Target Zone number: Z #. (disable with 0 or -1)</b><br> Skip getting prestiges at first, and Gradually work up to the desired Prestige setting you have set (set the Prestige dropdown to the highest weapon you want to end up on at the target zone you set here). Runs with Dagger to save a significant amount of time until we need better gear, then starts increasing the prestige setting near the end of the run.  Examines which prestiges you have, how many missing ones youd need to achieve the desired target and starts running maps every zone (more maps for higher settings), Until the target prestige is reached. ', 'value', -1, null, 'Gear');
    createSetting('PrestigeSkipMode', 'Prestige Skip Mode', 'If there are more than 2 Unbought Prestiges (besides Shield), ie: sitting in your upgrades window but you cant afford them, AutoMaps will not enter Prestige Mode, and/or will exit from it. The amount of unboughts can be configured with this variable MODULES[\\"automaps\\"].SkipNumUnboughtPrestiges = 2;', 'boolean', false, null, "Gear");
    createSetting('AlwaysArmorLvl2', 'Always Buy Lvl 2 Armor', 'Always Buy the 2nd point of Armor even if we dont need the HP. Its the most cost effective level, and the need HP decision script isnt always adequate. Forced on during Spire. Recommended On.', 'boolean', true, null, 'Gear');
    createSetting('WaitTill60', 'Skip Gear Level 58&59', 'Dont Buy Gear during level 58 and 59, wait till level 60, when cost drops down to 10%.', 'boolean', true, null, 'Gear');
    createSetting('DelayArmorWhenNeeded', 'Delay Armor', 'Delays buying armor prestige-upgrades during Want More Damage or Farming automap-modes, Although if you need health AND damage, it WILL buy armor prestiges tho.', 'boolean', null, null, 'Gear');
    //migrate old CapEquip to new CapEquip2
    if (autoTrimpSettings["CapEquip2"] === undefined && autoTrimpSettings["CapEquip"]) {
        createSetting('CapEquip2', 'Cap Equip to', 'Do not level equipment past this number. Helps for early game when the script wants to level your tier2s to level 40+, or to stop wasting metal. Recommended value: 10, Disable with -1 or 0.', 'value', -1, null, 'Gear');
        setPageSetting("CapEquip2",10 * autoTrimpSettings["CapEquip"].enabled);
    } else {
        createSetting('CapEquip2', 'Cap Equip to', 'Do not level equipment past this number. Helps for early game when the script wants to level your tier2s to level 40+, or to stop wasting metal. Recommended value: 10, Disable with -1 or 0.', 'value', -1, null, 'Gear');
    }
    createSetting('CheapGear', 'Buy cheap armor', 'Past magma, AT tends to not buy armor. This will force buy HP gear if very cheap. Value determines how many armor lvls below average weapon lvl to aim for. Recommended value: 10, Disable with -1 or 0.', 'value', -1, null, 'Gear');

//AutoMaps + VoidMaps settings:
    createSetting('AutoMaps', 'Auto Maps', 'Recommended. Automatically run maps to progress. Very Important. Has multiple modes: <b>Prestige, Voids, Want more Damage, Want more Health, Want Health & Damage, and Farming.</b>Prestige takes precedence and does equal level maps until it gets what is needed as per Autotrimps Prestige dropdown setting. Voids is self explanatory: use the Void Difficulty Check setting to control the amount of farming. If \'want more damage\', it will only do 10 maps for 200% mapbonus damage bonus. If \'Farming\', it does maps beyond 10 if the displayed number is over >16x. \'Want more health[or and damage]\' is basically just a status message telling you need more health, theres not much that can be done besides tell AutoLevelEquipment to keep buying stuff. If you \'want health\' but your damage is OK to continue, invest in more HP perks.', 'boolean', true, null, "Maps");
    createSetting('MaxMapBonusAfterZone', 'Max MapBonus After', 'Always gets Max Map Bonus from this zone on. (inclusive and after).<br><b>NOTE:</b> Set -1 to disable entirely (default). Set 0 to use it always.<br><b>Advanced:</b>User can set a lower number than the default 10 maps with the AT hidden console command: MODULES[\\"automaps\\"].maxMapBonusAfterZ = 9;', 'value', '-1', null, 'Maps');
    createSetting('MaxStacksForSpire', ['Default map bonus', 'Max Map Bonus for Spire', 'Power Raiding!'], 'Controls behavior for map bonus. Now also supports raiding for higher tier gear in Spire and voidmaps up to +5 (we usually can\'t afford +10 anyway, so not all the time).', 'multitoggle', 1, null, "Maps");
    createSetting('MinutestoFarmBeforeSpire', 'Minutes to Farm Before Spire', 'Farm level 200/199(or BW) maps for X minutes before continuing onto attempting Spire.<br><b>NOTE:</b> Set 0 to disable entirely (default). <br>Setting to -1/Infinite does not work here, set a very high number instead.', 'value', '0', null, 'Maps');    
    createSetting('ExitSpireCell', 'Exit Spire After Cell', 'Optional/Rare. Exits the Spire early, after completing cell X. example: 40 for Row 4. (use 0 or -1 to disable)', 'value', '-1', null, 'Maps');    
    createSetting('SpireLimit', 'Min Spire for AT', 'Spires below this value are treated as normal zones. e.g. Set to 3 and most AT Spire-specific settings only take effect on Spire III and later.<br>Does not work with Run Bionic Before Spire.', 'value', 1, null, 'genBTC');
    createSetting('VoidMaps', 'Void Maps U1', 'The zone at which you want all your void maps to be cleared (Cell 96).  0 is off', 'value', '0', null, "Maps");
    createSetting('VoidMapsU2', 'Void Maps U2', 'The zone at which you want all your void maps to be cleared (Cell 96).  0 is off', 'value', '0', null, "Maps");
    createSetting('RunNewVoids', 'Run New Voids', 'Run new void maps acquired after the set void map zone. Runs them at Cell 95 by default, unless you set a decimal value indicating the cell, like: 187.75  CAUTION: May severely slow you down by trying to do too-high level voidmaps. Use the adjacent RunNewVoidsUntil setting to limit this.', 'boolean', null, null, 'Maps');
    createSetting('RunNewVoidsUntil', 'New Voids Until', 'Run New Voids Until: Put a cap on what zone new voids will run at, until this zone, inclusive. ', 'value', '-1', null, 'Maps');
    createSetting('VoidDailyOffset', 'Daily offset', 'Value of this field gets added to lvl where we run voidmaps but only during daily. Works with negative too but who cares, right? 0 = no change.', 'value', '0', null, 'Maps');
    createSetting('SmithFree', 'AutoRun SmithFree', 'Automatically run Melting Point for SmithFree before voidmaps, unless we are in Melt challenge.', 'boolean', true, null, "Maps");
    createSetting('MaxWorshippers', 'Farm Worshippers', 'Every 5 zones after z55, run maps to max worshippers.', 'boolean', true, null, "Maps");
    
//Settings:
    createSetting('FarmerRatio', 'Farmer Ratio', '', 'value', '1', null, "Settings");
    createSetting('LumberjackRatio', 'Lumberjack Ratio', '', 'value', '1', null, "Settings");
    createSetting('MinerRatio', 'Miner Ratio', '', 'value', '1', null, "Settings");
    createSetting('MaxScientists', 'Max Scientists', 'Advanced. Cap your scientists. recommend: -1 (infinite still controls itself)', 'value', '-1', null, "Settings");
    createSetting('MaxExplorers', 'Max Explorers', 'Cap your explorers, most of fragments are gained by looting not gathering. recommend: 150', 'value', '150', null, "Settings");
    createSetting('MaxTrainers', 'Max Trainers', 'Advanced. Cap your trainers. recommend: -1', 'value', '-1', null, "Settings");
    createSetting('MaxHut', 'Max Huts', 'Huts', 'value', '100', null, "Settings");
    createSetting('MaxHouse', 'Max Houses', 'Houses', 'value', '100', null, "Settings");
    createSetting('MaxMansion', 'Max Mansions', 'Mansions', 'value', '100', null, "Settings");
    createSetting('MaxHotel', 'Max Hotels', 'Hotels', 'value', '100', null, "Settings");
    createSetting('MaxResort', 'Max Resorts', 'Resorts', 'value', '100', null, "Settings");
    createSetting('MaxGateway', 'Max Gateways', 'WARNING: Not recommended to raise above 25', 'value', '25', null, "Settings");
    createSetting('MaxWormhole', 'Max Wormholes', 'WARNING: Wormholes cost helium! Values below 0 do nothing.', 'value', '0', null, "Settings");
    createSetting('MaxCollector', 'Max Collectors', 'recommend: -1', 'value', '-1', null, "Settings");
    createSetting('FirstGigastation', 'First Gigastation', 'How many warpstations to buy before your first gigastation', 'value', '20', null, "Settings");
    createSetting('DeltaGigastation', 'Delta Gigastation', 'How many extra warpstations to buy for each gigastation. Supports decimal values. For example 2.5 will buy +2/+3/+2/+3...', 'value', '2', null, "Settings");
    createSetting('MaxGym', 'Max Gyms', 'Advanced. recommend: -1', 'value', '-1', null, "Settings");
    createSetting('MaxTribute', 'Max Tributes', 'Advanced. recommend: -1 ', 'value', '-1', null, "Settings");
    createSetting('MaxNursery', 'Max Nurseries', 'Advanced. recommend: -1', 'value', '-1', null, "Settings");
    createSetting('BreedFire', 'Breed Fire', 'OPTIONAL. Fire Lumberjacks and Miners to speed up breeding when needed. Basically trades wood/metal to cut the wait between deaths down. Disclaimer: May heavily negatively impact wood-gathering. ', 'boolean', null, null, 'Settings');
    createSetting('AutoMagmamancers', 'Auto Magmamancers', 'OPTIONAL. Auto Magmamancer Management. Hires Magmamancers when the Current Zone time goes over 10 minutes. Does a one-time spend of at most 10% of your resources. Every increment of 10 minutes after that repeats the 10% hiring process. Disclaimer: May negatively impact Gem count.', 'boolean', null, null, 'Settings');

//genBTC advanced settings - option buttons.
    createSetting('WarpstationCap', 'Warpstation Cap', 'Do not level Warpstations past Basewarp+DeltaGiga **. Without this, if a Giga wasnt available, it would level infinitely (wastes metal better spent on prestiges instead.) **The script bypasses this cap each time a new giga is bought, when it insta-buys as many as it can afford (since AT keeps available metal/gems to a low, overbuying beyond the cap to what is affordable at that first moment is not a bad thing). ', 'boolean', true, null, 'genBTC');
    createSetting('WarpstationWall3', 'Warpstation Wall', 'Conserves Metal. Only buys 1 Warpstation when you can afford <b>X</b> warpstations metal cost (at the first one\'s price, simple math). -1, 0, 1 = disable. In other words, only allows warps that cost less than 1/nth your currently owned metal. (to save metal for prestiges)', 'value', -1, null, 'genBTC');
    createSetting('WarpstationCoordBuy', 'Buy Warp to Hit Coord', 'If we are very close to hitting the next coordination, and we can afford the warpstations it takes to do it, Do it! (even if we are over the Cap/Wall). Recommended with WarpCap/WarpWall. (has no point otherwise) ', 'boolean', true, null, 'genBTC');
    createSetting('AutoRoboTrimp', 'AutoRoboTrimp', 'Use RoboTrimps ability starting at this level, and every 5 levels thereafter. (set to 0 to disable. default 60.) 60 is a good choice for mostly everybody.', 'value', '60', null, 'genBTC');    
    createSetting('TrainerCaptoTributes', 'Cap Trainers to a % of Tributes', 'Only Buy a Trainer when its cost is LESS than X% of cost of a tribute. This setting can work in combination with the other one, or set the other one to -1 and this will take full control. Default: -1 (Disabled). 50% is close to the point where the cap does nothing. You can go as low as you want but recommended is 10% to 1%. (example: Trainer cost of 5001, Tribute cost of 100000, @ 5%, it would NOT buy the trainer.)', 'value', '-1', null, 'genBTC');
    createSetting('NoNurseriesUntil', 'No Nurseries Until z', 'For Magma z230+ purposes. Nurseries get shut down, and wasting nurseries early on is probably a bad idea. Might want to set this to 230+ for now. Can use combined with the old Max Nurseries cap setting.', 'value', -1, null, 'genBTC');
    createSetting('ForceAbandon', 'Auto Force-Abandon', '(Trimpicide). If a new fight group is available and anticipation stacks arent maxed, force abandon and grab a new group. Located in the geneticist management script.', 'boolean', true, null, 'genBTC');
    createSetting('GymWall', 'Gym Wall', 'Conserves Wood. Only buys 1 Gym when you can afford <b>X</b> gyms wood cost (at the first one\'s price, simple math). -1 or 0 to disable. In other words, only allows gyms that cost less than 1/nth your currently owned wood. (to save wood for nurseries for new z230+ Magma nursery strategy). Takes decimal numbers. (Identical to the Warpstation wall setting which is why its called that). Setting to 1 does nothing besides stopping gyms from being bought 2 at a time due to the mastery.', 'value', -1, null, 'genBTC');
    createSetting('DynamicGyms', 'Dynamic Gyms', 'Designed to limit your block to slightly more than however much the enemy attack is. If MaxGyms is capped or GymWall is set, those will still work, and this will NOT override those (works concurrently), but it will further limit them. In the future it may override, but the calculation is not easy to get right so I dont want it undo-ing other things yet. EXPERIMENTAL.', 'boolean', false, null, 'genBTC');
    createSetting('AutoAllocatePerks', 'Auto Allocate Perks', 'EXPERIMENTAL. Uses the AutoPerks ratio based preset system to automatically allocate your perks to spend whatever helium you have when you AutoPortal. ', 'boolean', false, null, 'genBTC');
    createSetting('SpireBreedTimer', 'Spire Breed Timer', 'Set a different breed timer target for the Spire. Use -1 to disable this special setting.', 'value', -1, null, 'genBTC');
    createSetting('UsePatience', 'Enable Patience', 'Sets the default breed timer to 45 seconds if you have the Patience mastery.', 'boolean', true, null, 'genBTC');
if (game.worldUnlocks.easterEgg)
        createSetting('AutoEggs', 'AutoEggs', 'Click easter egg if it exists, upon entering a new zone. Warning: Quite overpowered. Please solemnly swear that you are up to no good.', 'boolean', false, null, 'genBTC');

// Dimensional Generator settings:
    createSetting('UseAutoGen', ['Auto Generator OFF', 'Auto Generator ON'], '<b>MASTER BUTTON</b> Dynamically switch generator modes. Required for the following mode management configurations to work. The Dimensional Generator is a building unlocked in The Magma, from z230.', 'multitoggle', 0, null, 'Magma');
    createSetting('AutoGen2', ['Default', 'Microtick', 'Max Cap', 'Overclock'], 'Before Z is reached, Microtick and Max Cap will switch between [Hybrid / Gain Fuel] to get EXACTLY one / FULL stacks of Capacity (not Storage) before using [Gain Mi]. Default will respect whatever you set it to and won\'t fiddle with it unless challenge overriding is on. Overclock will Gain Fuel until Z.', 'multitoggle', 2, null, 'Magma');
    createSetting('AutoGen2End', 'End Early Mode Z', 'On and after Z, be done with the mode we start with and switch to the final mode. -1 to disable.', 'value', 300, null, 'Magma');
    createSetting('AutoGen2SupplyEnd', 'End at Supply', 'On and after the zone for gathering the most magma by Supply, end Early Mode. Works alongside AutoGen2End and will end when either condition is met.', 'boolean', false, null, 'Magma');
    createSetting('AutoGen3', ['Gain Mi', 'Gain Fuel', 'Hybrid'], 'Mode to use after Z / SupplyEnd.', 'multitoggle', 1, null, 'Magma');
    createSetting('AutoGenDC', ['Daily: Normal', 'Daily: Fuel', 'Daily: Hybrid'], 'Use a special mode in dailies to make the most out of it. Overrides AutoGen3 unless Strong Override is on.', 'multitoggle', 1, null, 'Magma');
    createSetting('AutoGenC2', ['c2: Normal', 'c2: Fuel', 'c2: Hybrid'], 'Use a special mode when running challenge2s to make the most out of it. Overrides AutoGen3 unless Strong Override is on.', 'multitoggle', 1, null, 'Magma');
    createSetting('AutoGen2Override', ['Override Final Only', 'Strong Override'], 'Overrides apply to the final mode (always use early mode), or also to early mode (will stop microtick etc). Normal will not change anything.', 'multitoggle', 1, null, 'Magma');

    document.getElementById('AutoGen2Override').parentNode.insertAdjacentHTML('afterend','<hr>');
    createSetting('MagmiteExplain', 'Magmite spending behaviour', '1. Buy one-and-done upgrades, expensive first, then consider 1st level of Overclocker;<br>2. Buy Overclocker IF AND ONLY IF we can afford it;<br>2.5. Exit if OneTimeOnly<br>3. Buy Efficiency if it is better than capacity;<br>4. Buy Capacity or Supply depending on which is cheaper, or based on SupplyWall', 'infoclick', 'MagmiteExplain', null, 'Magma');
    createSetting('AutoMagmiteSpender2', ['Spend Magmite OFF', 'Spend Magmite (Portal)', 'Spend Magmite Always'], 'Auto Spends any unspent Magmite immediately before portaling. (Or Always, if toggled). Part 1 buys any permanent one-and-done upgrades in order from most expensive to least. Part 2 then analyzes Efficiency vs Capacity for cost/benefit, and buys Efficiency if its BETTER than Capacity. If not, if the PRICE of Capacity is less than the price of Supply, it buys Capacity. If not, it buys Supply. And then it repeats itself until you run out of Magmite and cant buy anymore. For Magma z230+ purposes.', 'multitoggle', 1, null, 'Magma');
    createSetting('SupplyWall', 'Throttle Supply (or Capacity)', 'Positive number NOT 1 e.g. 2.5: Consider Supply when its cost * 2.5 is < Capacity, instead of immediately when < Cap. Effectively throttles supply for when you don\'t need too many.<br><br>Negative number (-1 is ok) e.g. -2.5: Consider Supply if it costs < Capacity * 2.5, buy more supplys! Effectively throttling capacity instead.<br><br><b>Set to 1: DISABLE SUPPLY only spend magmite on Efficiency, Capacity and Overclocker. (For some end game players, supply is worth probably figuratively nothing.)<br>Set to 0: IGNORE SETTING and use old behaviour (will still try to buy overclocker)</b>', 'valueNegative', 2, null, 'Magma');
    createSetting('OneTimeOnly', 'One Time / Overclock Only', 'Makes the magmite spending sequence only buy one time upgrades and overclock, ignoring Efficiency, Capacity and Supply. Intended for manual use. Does not disable itself.', 'boolean', false, null, 'Magma');
    createSetting('BuyOvclock', 'Buy Overclock', 'Turn this off to not buy anymore overclocks. Will still buy the first level if you don\'t already own it.', 'boolean', true, null, 'Magma');

//Golden Upgrade Strategies:
    createSetting('AutoGoldenUpgrades', 'AutoGoldenUpgrades', 'IMPORTANT SETTING. Automatically Buy the specified Golden Upgrades as they become available. <b>Void</b> unlocks some intelligent settings from Dzugavili Mod and Derskagg Mod.', 'dropdown', 'Off', ["Off", "Helium", "Battle", "Void"], 'Golden');
    createSetting('goldStrat', 'goldStrat', 'VOID ONLY: After max void golden upgrades, alternate between buying helium and battle upgrades. Or Choose a Zone to switch over completely at.', 'dropdown', 'Off', ["Off", "Alternating", "Zone"], 'Golden');
    createSetting('goldAlternating', 'goldAlternating', 'Buy a helium upgrade after X-1 battle upgrades have been purchased', 'value', '2', null, 'Golden');
    createSetting('goldZone', 'goldZone', 'Buy a helium upgrade until zone X, then buy battle upgrades.', 'value', '200', null, 'Golden');
    createSetting('HoldCoords', ['Normal AT behavior', 'Fully manual coords', 'Hold when overkilling'], 'Define behavior for coordinations. Buy + not buy are simple, Hold only buys coords when we go below more or less safe threshold in H:D ratio.', 'multitoggle', 1, null, "Golden");
    createSetting('Equality', 'Auto equality', 'Use automatic toggling On/Off of Equality perk. When scaling if On, it means we have more damage but can fail for example Bublé challenge. So after a zone x (defined in next setting), we toggle to Off which forces maximum stacks even without us dying previously.', 'boolean', false, null, "Golden");
    createSetting('EqualityWhen', 'Eq. zone:', 'Toggle equality scaling from On to Off after this zone.', 'value', '20', null, "Golden");
    
// Nature settings:
    createSetting('AutoNatureTokens', 'Spend Nature Tokens', '<b>MASTER BUTTON</b> Automatically spend or convert nature tokens.', 'boolean', false, null, 'Nature');
    createSetting('AutoPoison', 'Poison', 'Spend/convert Poison tokens', 'dropdown', 'Off', ['Off', 'Empowerment', 'Transfer', 'Convert to Wind', 'Convert to Ice'], 'Nature');
    createSetting('AutoWind', 'Wind', 'Spend/convert Wind tokens', 'dropdown', 'Off', ['Off', 'Empowerment', 'Transfer', 'Convert to Poison', 'Convert to Ice'], 'Nature');
    createSetting('AutoIce', 'Ice', 'Spend/convert Ice tokens', 'dropdown', 'Off', ['Off', 'Empowerment', 'Transfer', 'Convert to Poison', 'Convert to Wind'], 'Nature');
    createSetting('AutoEmpowerments', 'Autostart empows', 'Autostart empowerments during daily, if their price is 0.', 'boolean', false, null, 'Nature');
    createSetting('ForceWind', 'Force wind stacking', 'When on wind zone, autostance in order to achieve max stacks and therefore more He', 'boolean', false, null, 'Nature');
    createSetting('WindSpire', 'Ignore wind spire', 'Ignore wind stacking in spire (z500)', 'boolean', true, null, 'Nature');
    createSetting('WindModifier', 'Wind H:D control', 'Controls how agressively you want to stack wind. If your H:D ratio (Automaps) is lower than specified, do <b>NOT</b> automap for bonus.<br> Change/test according to your Wind empower. Low number wastes stacks, high is good for bone portal but wastes time after a sharpie in H.<br>Recommended: 15-25 for He/Hr, 30-40 for manual dailies and >60 for maxing bone portal.<br><b>Disable with -1</b>', 'value', -1, null, 'Nature');
    createSetting('WindZone', 'Wind Zone Start', 'Controls what zone we start with Wind Stance, if running empowerment.', 'value', -1, null, 'Nature');
    createSetting('ForceIce', 'Force D stance in ice', 'When on ice zone, ignore usual stancing and force D. Safety requires > 35 ice levels to trigger the code, else we waste He/Hr! (=we are impervious to Healthy Sharpie)', 'boolean', false, null, 'Nature');
    createSetting('IceNursery', 'No nurseries in ice', 'If you have enough ice, do not buy more nurseries on ice zones -> less shut down due to magma.', 'boolean', false, null, 'Nature');
    
    
//Spam settings:
    createSetting('SpamGeneral', 'General Spam', 'General Spam = Starting Zone, Auto He/Hr, AutoMagmiteSpender ', 'boolean', true, null, 'Spam');
    createSetting('SpamUpgrades', 'Upgrades Spam', 'Upgrades Spam', 'boolean', true, null, 'Spam');
    createSetting('SpamEquipment', 'Equipment Spam', 'Equipment Spam', 'boolean', true, null, 'Spam');
    createSetting('SpamMaps', 'Maps Spam', 'Maps Spam = Buy,Pick,Run Maps,Recycle,CantAfford', 'boolean', true, null, 'Spam');
    createSetting('SpamOther', 'Other Spam', 'Other Spam = Better Auto Fight, Trimpicide, Robotrimp, AutoMagmamancers', 'boolean', true, null, 'Spam');
    createSetting('SpamBuilding', 'Building Spam', 'Building Spam = all buildings, even storage', 'boolean', false, null, 'Spam');
    createSetting('SpamJobs', 'Job Spam', 'Job Spam = All jobs, in scientific notation', 'boolean', false, null, 'Spam');

// Export/Import/Default settings
    createSetting('ExportAutoTrimps', 'Export AutoTrimps', 'Export your Settings.', 'infoclick', 'ExportAutoTrimps', null, 'Import Export');
    createSetting('ImportAutoTrimps', 'Import AutoTrimps', 'Import your Settings.', 'infoclick', 'ImportAutoTrimps', null, 'Import Export');
    createSetting('DefaultAutoTrimps', 'Reset to Default', 'Reset everything to the way it was when you first installed the script.', 'infoclick', 'DefaultAutoTrimps', null, 'Import Export');
    createSetting('CleanupAutoTrimps', 'Cleanup Saved Settings ', 'Deletes old values from previous versions of the script from your AutoTrimps Settings file.', 'infoclick', 'CleanupAutoTrimps', null, 'Import Export');
    //createSetting('ExportModuleVars', 'Export Custom Variables', 'Export your custom MODULES variables.', 'infoclick', 'ExportModuleVars', null, 'Import Export');
    //createSetting('ImportModuleVars', 'Import Custom Variables', 'Import your custom MODULES variables (and save).', 'infoclick', 'ImportModuleVars', null, 'Import Export');
    //createSetting('ResetModuleVars', 'Reset Custom Variables', 'Reset(Delete) your custom MODULES variables, and return the script to normal. ', 'infoclick', 'ResetModuleVars', null, 'Import Export');
}
initializeAllSettings();

function AutoTrimpsTooltip(what, isItIn, event) {
    if (game.global.lockTooltip)
        return;
    var elem = document.getElementById("tooltipDiv");
    swapClass("tooltipExtra", "tooltipExtraNone", elem);
    var ondisplay = null; // if non-null, called after the tooltip is displayed
    var tooltipText;
    var costText = "";
    if (what == "ExportAutoTrimps") {
        tooltipText = "This is your AUTOTRIMPS save string. There are many like it but this one is yours. Save this save somewhere safe so you can save time next time. <br/><br/><textarea id='exportArea' style='width: 100%' rows='5'>" + serializeSettings() + "</textarea>";
        costText = "<div class='maxCenter'><div id='confirmTooltipBtn' class='btn btn-info' onclick='cancelTooltip()'>Got it</div>";
        if (document.queryCommandSupported('copy')) {
            costText += "<div id='clipBoardBtn' class='btn btn-success'>Copy to Clipboard</div>";
            ondisplay = function() {
                document.getElementById('exportArea').select();
                document.getElementById('clipBoardBtn').addEventListener('click', function(event) {
                    document.getElementById('exportArea').select();
                    try {
                        document.execCommand('copy');
                    } catch (err) {
                        document.getElementById('clipBoardBtn').innerHTML = "Error, not copied";
                    }
                });
            };
        } else {
            ondisplay = function() {
                document.getElementById('exportArea').select();
            };
        }
        costText += "</div>";
    } else if (what == "ImportAutoTrimps") {
        //runs the loadAutoTrimps() function.
        tooltipText = "Import your AUTOTRIMPS save string! It'll be fine, I promise.<br/><br/><textarea id='importBox' style='width: 100%' rows='5'></textarea>";
        costText = "<div class='maxCenter'><div id='confirmTooltipBtn' class='btn btn-info' onclick='cancelTooltip(); loadAutoTrimps();'>Import</div><div class='btn btn-info' onclick='cancelTooltip()'>Cancel</div></div>";
        ondisplay = function() {
            document.getElementById('importBox').focus();
        };
    } else if (what == "DefaultAutoTrimps") {
        resetAutoTrimps();
        tooltipText = "Autotrimps has been successfully reset to its defaults! ";
        costText = "<div class='maxCenter'><div id='confirmTooltipBtn' class='btn btn-info' onclick='cancelTooltip();'>OK</div></div>";
        debug(tooltipText, "other");
    } else if (what == "CleanupAutoTrimps") {
        cleanupAutoTrimps();
        tooltipText = "Autotrimps saved-settings have been attempted to be cleaned up. If anything broke, refreshing will fix it, but check that your settings are correct! (prestige in particular)";
        costText = "<div class='maxCenter'><div id='confirmTooltipBtn' class='btn btn-info' onclick='cancelTooltip();'>OK</div></div>";
    } else if (what == "ExportModuleVars") {
        tooltipText = "These are your custom Variables. The defaults have not been included, only what you have set... <br/><br/><textarea id='exportArea' style='width: 100%' rows='5'>" + exportModuleVars() + "</textarea>";
        costText = "<div class='maxCenter'><div id='confirmTooltipBtn' class='btn btn-info' onclick='cancelTooltip()'>Got it</div>";
        if (document.queryCommandSupported('copy')) {
            costText += "<div id='clipBoardBtn' class='btn btn-success'>Copy to Clipboard</div>";
            ondisplay = function() {
                document.getElementById('exportArea').select();
                document.getElementById('clipBoardBtn').addEventListener('click', function(event) {
                    document.getElementById('exportArea').select();
                    try {
                        document.execCommand('copy');
                    } catch (err) {
                        document.getElementById('clipBoardBtn').innerHTML = "Error, not copied";
                    }
                });
            };
        } else {
            ondisplay = function() {
                document.getElementById('exportArea').select();
            };
        }
        costText += "</div>";
    } else if (what == "ImportModuleVars") {
        tooltipText = "Enter your Autotrimps MODULE variable settings to load, and save locally for future use between refreshes:<br/><br/><textarea id='importBox' style='width: 100%' rows='5'></textarea>";
        costText = "<div class='maxCenter'><div id='confirmTooltipBtn' class='btn btn-info' onclick='cancelTooltip(); importModuleVars();'>Import</div><div class='btn btn-info' onclick='cancelTooltip()'>Cancel</div></div>";
        ondisplay = function() {
            document.getElementById('importBox').focus();
        };
    } else if (what == "ResetModuleVars") {
        resetModuleVars();
        tooltipText = "Autotrimps MODULE variable settings have been successfully reset to its defaults!";
        costText = "<div class='maxCenter'><div id='confirmTooltipBtn' class='btn btn-info' onclick='cancelTooltip();'>OK</div></div>";
    } else if (what == 'MagmiteExplain') {
        tooltipText = "<img src='" + base + "mi.png'>";
        costText = "<div class='maxCenter'><div id='confirmTooltipBtn' class='btn btn-info' onclick='cancelTooltip();'>I don't get it at all</div></div>";
    }
    game.global.lockTooltip = true;
    elem.style.left = "33.75%";
    elem.style.top = "25%";
    document.getElementById("tipTitle").innerHTML = what;
    document.getElementById("tipText").innerHTML = tooltipText;
    document.getElementById("tipCost").innerHTML = costText;
    elem.style.display = "block";
    if (ondisplay !== null)
        ondisplay();
}

//reset autotrimps to defaults (also handles imports)
function resetAutoTrimps(imported) {
    ATrunning = false; //stop AT, wait, remove
    function waitRemoveLoad(imported) {
        localStorage.removeItem('autoTrimpSettings');
        //delete,remake,init defaults, recreate everything:
        autoTrimpSettings = imported ? imported : new Object(); //load the import.
        var settingsrow = document.getElementById("settingsRow");
        settingsrow.removeChild(document.getElementById("autoSettings"));
        automationMenuSettingsInit();
        initializeAllTabs();
        initializeAllSettings();
        updateCustomButtons();
        saveSettings();
        checkPortalSettings();
        ATrunning = true; //restart AT.
    }
    setTimeout(waitRemoveLoad(imported),101);
}

//import autotrimps settings from a textbox
function loadAutoTrimps() {
    //try the import
    try {
        var thestring = document.getElementById("importBox").value.replace(/[\n\r]/gm, "");
        var tmpset = JSON.parse(thestring);
        if (tmpset == null)
            return;
    } catch (err) {
        debug("Error importing, the string is bad." + err.message);
        return;
    }
    resetAutoTrimps(tmpset);
}

//remove stale values from past autotrimps versions
function cleanupAutoTrimps() {
    for (var setting in autoTrimpSettings) {
        var elem = document.getElementById(autoTrimpSettings[setting].id);
        if (elem == null)
            delete autoTrimpSettings[setting];
    }
}

//export MODULE variables to a textbox
function exportModuleVars() {
    return JSON.stringify(compareModuleVars());
}

function compareModuleVars() {
    var diffs = {};
    var mods = Object.keys(MODULES);
    for (var i=0,leni=mods.length;i<leni;i++) {
        var vars = Object.keys(MODULES[mods[i]]);
        for (var j=0,lenj=vars.length;j<lenj;j++) {
            var a = MODULES[mods[i]][vars[j]];
            var b = MODULESdefault[mods[i]][vars[j]];
            //var isArray = !!a && Array === a.constructor;
            if (JSON.stringify(a)!=JSON.stringify(b)) {
            //if ((a != b) || (isArray && JSON.stringify(a)!=JSON.stringify(b))) {
                if (diffs[mods[i]] === undefined)
                    diffs[mods[i]] = {};
                //console.log(vars[j]);
                diffs[mods[i]][vars[j]] = a;
            }
        }
    }
    //console.log(diffs);
    return diffs;
}

//import MODULE variables from a textbox
function importModuleVars() {
    //try the import
    try {
        //var thestring = document.getElementById("importBox").value.replace(/(\r\n|\n|\r)/gm, "");
        var thestring = document.getElementById("importBox").value;
        var strarr = thestring.split(/\n/);
        for (var line in strarr) {
            var s = strarr[line];
            s = s.substring(0, s.indexOf(';')+1); //cut after the ;
            s = s.replace(/\s/g,'');    //regexp remove ALL(/g) whitespaces(\s)
            //s = s.split('=');           //split into left / right on the =
            eval(s);
            strarr[line] = s;
        }

        //var tmpset = JSON.parse(thestring);
        var tmpset = compareModuleVars();
        // if (tmpset == null)
            // return;
    } catch (err) {
        debug("Error importing, the string is bad." + err.message);
        return;
    }
//    resetModuleVars(tmpset);
    localStorage.removeItem('autoTrimpVariables');
    localStorage.setItem('autoTrimpVariables', JSON.stringify(tmpset));
}

//reset MODULE variables to default, (and/or then import)
function resetModuleVars(imported) {
    ATrunning = false; //stop AT, wait, remove
    function waitRemoveLoad(imported) {
        localStorage.removeItem('autoTrimpVariables');
        MODULES = JSON.parse(JSON.stringify(MODULESdefault));
        //load everything again, anew
        // debug('Saved');
        try {
            localStorage.setItem('autoTrimpVariables', JSON.stringify(autoTrimpVariables));
        } catch(e) {
          if (e.code == 22) {
            // Storage full, maybe notify user or do some clean-up
            debug("Error: LocalStorage is full, or some other error. Try to restart your browser.");
          }
        }
        ATrunning = true; //restart AT.
    }
    setTimeout(waitRemoveLoad(imported),101);
}

function automationMenuInit() {

    var settingBtnSrch = document.getElementsByClassName("btn btn-default");
    for (var i = 0; i < settingBtnSrch.length; i++) {
        if (settingBtnSrch[i].getAttribute("onclick") === "toggleSettingsMenu()")
            settingBtnSrch[i].setAttribute("onclick", "autoPlusSettingsMenu()");
    }
    //create the AutoTrimps Script button
    var newItem = document.createElement("TD");
    newItem.appendChild(document.createTextNode("AutoTrimps"));
    newItem.setAttribute("class", "btn btn-default");
    newItem.setAttribute("onclick", "autoToggle()");
    var settingbarRow = document.getElementById("settingsTable").firstElementChild.firstElementChild;
    settingbarRow.insertBefore(newItem, settingbarRow.childNodes[10]);

    //create automaps button
    var newContainer = document.createElement("DIV");
    newContainer.setAttribute("class", "battleSideBtnContainer");
    newContainer.setAttribute("style", "display: block;");
    newContainer.setAttribute("id", "autoMapBtnContainer");
    var abutton = document.createElement("SPAN");
    abutton.appendChild(document.createTextNode("Auto Maps"));
    abutton.setAttribute("class", "btn fightBtn btn-success");
    abutton.setAttribute("id", "autoMapBtn");
    abutton.setAttribute("onClick", "settingChanged('AutoMaps')");
    abutton.setAttribute("onmouseover", 'tooltip(\"Toggle Automapping\", \"customText\", event, \"Toggle automapping on and off.\")');
    abutton.setAttribute("onmouseout", 'tooltip("hide")');
    var fightButtonCol = document.getElementById("battleBtnsColumn");
    newContainer.appendChild(abutton);
    fightButtonCol.appendChild(newContainer);

    //create automaps status
    newContainer = document.createElement("DIV");
    newContainer.setAttribute("style", "display: block; font-size: 1.1vw; text-align: center; background-color: rgba(0,0,0,0.3);");
    newContainer.setAttribute("onmouseover", 'tooltip(\"Health to Damage ratio\", \"customText\", event, \"This displays the current mode that Automaps is in. H:D ratio means estimated enemy health vs your current damage.<p><br><b>H:D ratio = </b>\" + newHDratio + \"<br><b>HP ratio = </b>\" + healthRatio + \"<br>\" +\"<br><b>Map vars: </b><br>shouldDoMaps: \" + shouldDoMaps + \"<br>needPrestige: \" + needPrestige + \"<br>doMaxMapBonus: \" + doMaxMapBonus + \"<br>needToVoid: \" + needToVoid + \"<br>doVoids: \" + doVoids + \"<br>worship: \" + worship + \"<br>\")');
    newContainer.setAttribute("onmouseout", 'tooltip("hide")');
    abutton = document.createElement("SPAN");
    abutton.id = 'autoMapStatus';
    newContainer.appendChild(abutton);
    fightButtonCol.appendChild(newContainer);

    //create hiderStatus - He/hr percent
    newContainer = document.createElement("DIV");
    newContainer.setAttribute("style", "display: block; font-size: 1vw; text-align: center; margin-top: 2px; background-color: rgba(0,0,0,0.3);");
    newContainer.setAttribute("onmouseover", 'tooltip(\"Helium/Hr Info\", \"customText\", event, \"1st is Current He/hr % out of Lifetime He(not including current+unspent).<br> 0.5% is an ideal peak target. This can tell you when to portal... <br>2nd is Current run Total He earned / Lifetime He(not including current)<br>\" + getDailyHeHrStats())');
    newContainer.setAttribute("onmouseout", 'tooltip("hide")');
    abutton = document.createElement("SPAN");
    abutton.id = 'hiderStatus';
    newContainer.appendChild(abutton);
    fightButtonCol.appendChild(newContainer);

    //make timer click toggle paused mode
    document.getElementById('portalTimer').setAttribute('onclick', 'toggleSetting(\'pauseGame\')');
    document.getElementById('portalTimer').setAttribute('style', 'cursor: default');

    //shrink padding for fight buttons to help fit automaps button/status
    var btns = document.getElementsByClassName("fightBtn");
    for (var x = 0; x < btns.length; x++) {
        btns[x].style.padding = "0.01vw 0.01vw";
    }
}

function getDailyHeHrStats() {
    var words = "";
    if (game.global.challengeActive == "Daily") {
        var getPercent = (game.stats.heliumHour.value() / (game.global.totalHeliumEarned - (game.global.heliumLeftover + game.resources.helium.owned)));
        getPercent *= 100 + getDailyHeliumValue(countDailyWeight());
        words = "<b>After Daily He/Hr: " + getPercent.toFixed(3) +'%';
    }
    return words;
}

//toggles the display of the settings menu.
function autoToggle(what) {
    if (what) {
        whatobj = document.getElementById(what);
        if (whatobj.style.display === 'block') {
            whatobj.style.display = 'none';
            document.getElementById(what + 'BTN').style.border = '';
        } else {
            whatobj.style.display = 'block';
            document.getElementById(what + 'BTN').style.border = '4px solid green';
        }
    } else {
        if (game.options.displayed)
            toggleSettingsMenu();
        if (document.getElementById('graphParent').style.display === 'block')
            document.getElementById('graphParent').style.display = 'none';
        var item = document.getElementById('autoSettings');
        if (item.style.display === 'block')
            item.style.display = 'none';
        else item.style.display = 'block';
    }
}

//overloads the settings menu button to include hiding the auto menu settings.
function autoPlusSettingsMenu() {
    var item = document.getElementById('autoSettings');
    if (item.style.display === 'block')
        item.style.display = 'none';
    item = document.getElementById('graphParent');
    if (item.style.display === 'block')
        item.style.display = 'none';
    toggleSettingsMenu();
}


function createSetting(id, name, description, type, defaultValue, list, container) {
    var btnParent = document.createElement("DIV");
    // btnParent.setAttribute('class', 'optionContainer');
    btnParent.setAttribute('style', 'display: inline-block; vertical-align: top; margin-left: 1vw; margin-bottom: 1vw; width: 13.142vw;');
    var btn = document.createElement("DIV");
    btn.id = id;
    var loaded = autoTrimpSettings[id];
    if (type == 'boolean') {
        if (!(loaded && id == loaded.id))
            autoTrimpSettings[id] = {
                id: id,
                name: name,
                description: description,
                type: type,
                enabled: loaded === undefined ? (defaultValue || false) : loaded
            };
        btn.setAttribute("style", "font-size: 1.1vw;");
        btn.setAttribute('class', 'noselect settingsBtn settingBtn' + autoTrimpSettings[id].enabled);
        btn.setAttribute("onclick", 'settingChanged("' + id + '")');
        btn.setAttribute("onmouseover", 'tooltip(\"' + name + '\", \"customText\", event, \"' + description + '\")');
        btn.setAttribute("onmouseout", 'tooltip("hide")');
        btn.textContent = name;
        btnParent.appendChild(btn);
        if (container) document.getElementById(container).appendChild(btnParent);
        else document.getElementById("autoSettings").appendChild(btnParent);
    } else if (type == 'value' || type == 'valueNegative') {
        if (!(loaded && id == loaded.id))
            autoTrimpSettings[id] = {
                id: id,
                name: name,
                description: description,
                type: type,
                value: loaded === undefined ? defaultValue : loaded
            };
        btn.setAttribute("style", "font-size: 1.1vw;");
        btn.setAttribute('class', 'noselect settingsBtn btn-info');
        if (type == 'valueNegative')
            btn.setAttribute("onclick", 'autoSetValueToolTip("' + id + '", "' + name + '",true)');
        else
            btn.setAttribute("onclick", 'autoSetValueToolTip("' + id + '", "' + name + '")');
        btn.setAttribute("onmouseover", 'tooltip(\"' + name + '\", \"customText\", event, \"' + description + '\")');
        btn.setAttribute("onmouseout", 'tooltip("hide")');
        btn.textContent = name;
        btnParent.appendChild(btn);
        if (container) document.getElementById(container).appendChild(btnParent);
        else document.getElementById("autoSettings").appendChild(btnParent);
    } else if (type == 'dropdown') {
        if (!(loaded && id == loaded.id))
            autoTrimpSettings[id] = {
                id: id,
                name: name,
                description: description,
                type: type,
                selected: loaded === undefined ? defaultValue : loaded,
                list: list
            };
        var btn = document.createElement("select");
        btn.id = id;
        if (game.options.menu.darkTheme.enabled == 2) btn.setAttribute("style", "color: #C8C8C8; font-size: 1.1vw;");
        else btn.setAttribute("style", "color:black; font-size: 1.1vw;");
        btn.setAttribute("class", "noselect");
        btn.setAttribute("onmouseover", 'tooltip(\"' + name + '\", \"customText\", event, \"' + description + '\")');
        btn.setAttribute("onmouseout", 'tooltip("hide")');
        btn.setAttribute("onchange", 'settingChanged("' + id + '")');

        for (var item in list) {
            var option = document.createElement("option");
            option.value = list[item];
            option.text = list[item];
            btn.appendChild(option);
        }
        btn.value = autoTrimpSettings[id].selected;

        var dropdownLabel = document.createElement("Label");
        dropdownLabel.id = id + "Label";
        dropdownLabel.innerHTML = id + ":";
        dropdownLabel.setAttribute('style', 'margin-right: 0.3vw; font-size: 0.8vw;');
        btnParent.appendChild(dropdownLabel);
        btnParent.appendChild(btn);

        if (container) document.getElementById(container).appendChild(btnParent);
        else document.getElementById("autoSettings").appendChild(btnParent);

    } else if (type == 'infoclick') {
        btn.setAttribute('class', 'btn btn-info');
        btn.setAttribute("onclick", 'AutoTrimpsTooltip(\'' + defaultValue + '\', null, \'update\')');
        btn.setAttribute("onmouseover", 'tooltip(\"' + name + '\", \"customText\", event, \"' + description + '\")');
        btn.setAttribute("onmouseout", 'tooltip("hide")');
        btn.setAttribute("style", "display: block; font-size: 0.8vw;");
        btn.textContent = name;
        btnParent.style.width = '';
        btnParent.appendChild(btn);
        if (container) document.getElementById(container).appendChild(btnParent);
        else document.getElementById("autoSettings").appendChild(btnParent);
        return;
    } else if (type == 'multitoggle') {
        if (!(loaded && id == loaded.id))
            autoTrimpSettings[id] = {
                id: id,
                name: name,
                description: description,
                type: type,
                value: loaded === undefined ? defaultValue || 0 : loaded
            };
        btn.setAttribute("style", "font-size: 1.1vw;");
        btn.setAttribute('class', 'noselect settingsBtn settingBtn' + autoTrimpSettings[id].value);
        btn.setAttribute("onclick", 'settingChanged("' + id + '")');
        btn.setAttribute("onmouseover", 'tooltip(\"' + name.join(' / ') + '\", \"customText\", event, \"' + description + '\")');
        btn.setAttribute("onmouseout", 'tooltip("hide")');
        btn.textContent = autoTrimpSettings[id]["name"][autoTrimpSettings[id]["value"]];
        btnParent.appendChild(btn);
        if (container) document.getElementById(container).appendChild(btnParent);
        else document.getElementById("autoSettings").appendChild(btnParent);
    }
    //make sure names/descriptions match what we have stored.
    if (autoTrimpSettings[id].name != name)
        autoTrimpSettings[id].name = name;
    if (autoTrimpSettings[id].description != description)
        autoTrimpSettings[id].description = description;
    autoTrimpSettings["ATversion"] = ATversion;
}

function settingChanged(id) {
    var btn = autoTrimpSettings[id];
    if (btn.type == 'boolean') {
        btn.enabled = !btn.enabled;
        document.getElementById(id).setAttribute('class', 'noselect settingsBtn settingBtn' + btn.enabled);
    }
    if (btn.type == 'multitoggle') {
        //puts a 5 second pause in between cycling through from "on portal" to "always" so you can switch it to "off".
        if (id == 'AutoMagmiteSpender2' && btn.value == 1) {
            magmiteSpenderChanged = true;
            setTimeout(function() {
                magmiteSpenderChanged = false;
            }, 5000);
        }
        btn.value++;
        if (btn.value > btn.name.length - 1)
            btn.value = 0;
        document.getElementById(id).setAttribute('class', 'noselect settingsBtn settingBtn' + btn.value);
        document.getElementById(id).textContent = btn.name[btn.value];
    }
    if (btn.type == 'dropdown') {
        btn.selected = document.getElementById(id).value;
        //part of the prestige dropdown's "backup" system to prevent internal tampering via the dynamic prestige algorithm. everytime we see a user initiated change, make a backup.
        if (id == "Prestige")
            autoTrimpSettings["PrestigeBackup"].selected = document.getElementById(id).value;
    }
    //console.log(id + " Setting Changed");
    updateCustomButtons();
    saveSettings();
    checkPortalSettings();
    if ((autoTrimpSettings.AutoGen2.value == 3) && game.generatorUpgrades["Overclocker"].upgrades <= 0)
        tooltip('confirm', null, 'update', 'WARNING: You are set to Overclock but do not have any Overclocker upgrades. AutoGen2 will default to \'Max Cap\' in this case. If this is not desired, please fix your AutoGen2 setting.', 'cancelTooltip()', 'Cannot Overclock');
}


function autoSetValueToolTip(id, text,negative) {
    ranstring = text;
    var elem = document.getElementById("tooltipDiv");
    var tooltipText = 'Type a number below. You can also use shorthand such as 2e5 or 200k.';
    if (negative)
        tooltipText += 'Accepts negative numbers as validated inputs.';
    else
        tooltipText += 'Put -1 for Infinite.';
    tooltipText += '<br/><br/><input id="customNumberBox" style="width: 50%" onkeypress="onKeyPressSetting(event, \'' + id + '\','+negative+')" value=' + autoTrimpSettings[id].value + '></input>';
    var costText = '<div class="maxCenter"><div class="btn btn-info" onclick="autoSetValue(\'' + id + '\','+negative+')">Apply</div><div class="btn btn-info" onclick="cancelTooltip()">Cancel</div></div>';
    game.global.lockTooltip = true;
    elem.style.left = '32.5%';
    elem.style.top = '25%';
    document.getElementById('tipTitle').textContent = ranstring + ':  Value Input';
    document.getElementById('tipText').innerHTML = tooltipText;
    document.getElementById('tipCost').innerHTML = costText;
    elem.style.display = 'block';
    var box = document.getElementById('customNumberBox');
    try {
        box.setSelectionRange(0, box.value.length);
    } catch (e) {
        box.select();
    }
    box.focus();
}

function onKeyPressSetting(event, id,negative) {
    if (event.which == 13 || event.keyCode == 13) {
        autoSetValue(id,negative);
    }
}

function autoSetValue(id,negative) {
    var num = 0;
    unlockTooltip();
    tooltip('hide');
    var numBox = document.getElementById('customNumberBox');
    if (numBox) {
        num = numBox.value.toLowerCase();
        if (num.split('e')[1]) {
            num = num.split('e');
            num = Math.floor(parseFloat(num[0]) * (Math.pow(10, parseInt(num[1]))));
        } else {
            var letters = num.replace(/[^a-z]/gi, '');
            var base = 0;
            if (letters.length) {
                var suffices = ['K', 'M', 'B', 'T', 'Qa', 'Qi', 'Sx', 'Sp', 'Oc', 'No', 'Dc', 'Ud', 'Dd', 'Td', 'Qad', 'Qid', 'Sxd', 'Spd', 'Od', 'Nd', 'V', 'Uv', 'Dv', 'Tv', 'Qav', 'Qiv', 'Sxv', 'Spv', 'Ov', 'Nv', 'Tt'];
                for (var x = 0; x < suffices.length; x++) {
                    if (suffices[x].toLowerCase() == letters) {
                        base = x + 1;
                        break;
                    }
                }
                if (base) num = Math.round(parseFloat(num.split(letters)[0]) * Math.pow(1000, base));
            }
            if (!base) num = parseFloat(num);
        }
    } else return;
    autoTrimpSettings[id].value = num;
    if (num > -1 || negative)
        document.getElementById(id).textContent = ranstring + ': ' + prettify(num);
    else
    //document.getElementById(id).textContent = ranstring + ': ' + 'Infinite';
        document.getElementById(id).innerHTML = ranstring + ': ' + "<span class='icomoon icon-infinity'></span>";
    saveSettings();
    checkPortalSettings();
}

function updateCustomButtons() {
    //console.log("GUI: CustomButtons Updated");
    function toggleElem(elem, showHide) {
        var state = showHide ? '' : 'none';
        var stateParent = showHide ? 'inline-block' : 'none';
        var item = document.getElementById(elem);
        item.style.display = state;
        item.parentNode.style.display = stateParent;
    }

    function turnOff(elem) {
        toggleElem(elem, false);
    }

    function turnOn(elem) {
        toggleElem(elem, true);
    }
    //automaps button
    if (autoTrimpSettings.AutoMaps.enabled)
        document.getElementById("autoMapBtn").setAttribute("class", "btn fightBtn btn-success");
    else
        document.getElementById("autoMapBtn").setAttribute("class", "btn fightBtn btn-danger");
    //auto portal setting, hide until player has unlocked the balance challenge
    //(game.challenges.Balance.filter()) ? turnOn("AutoPortal") : turnOff("AutoPortal");
    //auto Daily settings, hide until player has unlocked the Daily challenges
    (game.challenges.Daily.filter()) ? turnOn("AutoStartDaily") : turnOff("AutoStartDaily");
    (game.challenges.Daily.filter()) ? turnOn("AutoFinishDaily") : turnOff("AutoFinishDaily");
    (game.challenges.Daily.filter() && getPageSetting('AutoFinishDaily')) ? turnOn("AutoFinishDailyZone") : turnOff("AutoFinishDailyZone");
    //if custom auto portal is not selected, remove the custom value settingsbox
    (autoTrimpSettings.AutoPortal.selected == "Custom") ? turnOn("CustomAutoPortal") : turnOff("CustomAutoPortal");
    (autoTrimpSettings.AutoPortal.selected == "Custom") ? turnOn("CustomAutoPortalU2") : turnOff("CustomAutoPortalU2");
    //if HeHr is not selected, remove HeliumHourChallenge settingsbox
    (autoTrimpSettings.AutoPortal.selected == "Helium Per Hour" || autoTrimpSettings.AutoPortal.selected == "Custom") ? turnOn("HeliumHourChallenge") : turnOff("HeliumHourChallenge");
    (autoTrimpSettings.AutoPortal.selected == "Helium Per Hour" || autoTrimpSettings.AutoPortal.selected == "Custom") ? turnOn("RadonHourChallenge") : turnOff("RadonHourChallenge");
    //if HeHr is not selected, remove HeHrDontPortalBefore settingsbox
    (autoTrimpSettings.AutoPortal.selected == "Helium Per Hour") ? turnOn("HeHrDontPortalBefore") : turnOff("HeHrDontPortalBefore");
    //if HeHr is not selected, remove HeHr buffer settingsbox
    (autoTrimpSettings.AutoPortal.selected == "Helium Per Hour") ? turnOn("HeliumHrBuffer") : turnOff("HeliumHrBuffer");
    // Use equality thingy
    (autoTrimpSettings.Equality.enabled) ? turnOn("EqualityWhen") : turnOff("EqualityWhen");

    //update dropdown selections: (ALL DROPDOWNS REQUIRE THIS BIT TO BE UPDATEY)
    document.getElementById('AutoPortal').value = autoTrimpSettings.AutoPortal.selected;
    document.getElementById('HeliumHourChallenge').value = autoTrimpSettings.HeliumHourChallenge.selected;
    document.getElementById('RadonHourChallenge').value = autoTrimpSettings.RadonHourChallenge.selected;
    document.getElementById('AutoGoldenUpgrades').value = autoTrimpSettings.AutoGoldenUpgrades.selected;
    document.getElementById('AutoPoison').value = autoTrimpSettings.AutoPoison.selected;
    document.getElementById('AutoWind').value = autoTrimpSettings.AutoWind.selected;
    document.getElementById('AutoIce').value = autoTrimpSettings.AutoIce.selected;
    //DerSkagg Mod: Golden Upgrade Settings. (Toggles relevant ones on/off)
    if (autoTrimpSettings.AutoGoldenUpgrades.selected == "Void") {
        turnOn("goldStrat");
        document.getElementById('goldStrat').value = autoTrimpSettings.goldStrat.selected;
        if (autoTrimpSettings.goldStrat.selected == "Alternating") {
            document.getElementById('goldAlternating').value = autoTrimpSettings.goldAlternating.selected;
            turnOn("goldAlternating")
        } else
            turnOff("goldAlternating");
        (autoTrimpSettings.goldStrat.selected == "Zone") ? turnOn("goldZone") : turnOff("goldZone");
    } else {
        turnOff("goldStrat");
        turnOff("goldAlternating");
        turnOff("goldZone");
    }
    //document.getElementById('Prestige').value = autoTrimpSettings.Prestige.selected; //dont update this, dynamic prestige takes it over and is handled elsewhere.

    //stop disable farming from needing a refresh
    if (getPageSetting('DisableFarm'))
        shouldFarm = false;
    // handle metal preference
    MODULES["automaps"] && (MODULES["automaps"].preferGardens = !getPageSetting('PreferMetal'));
    //if player has selected arbalest or gambeson but doesn't have them unlocked, just unselect it for them! It's magic!
    if (document.getElementById('Prestige').selectedIndex > 11 && game.global.slowDone == false) {
        document.getElementById('Prestige').selectedIndex = 11;
        autoTrimpSettings.Prestige.selected = "Bestplate";
    }
    //Bionic Before Spire - Auto turns on RunUniqueMaps
    /*if (autoTrimpSettings.RunBionicBeforeSpire.enabled && !autoTrimpSettings.RunUniqueMaps.enabled)
        setPageSetting("RunUniqueMaps",true);*/
    //make sure value buttons are set accurately.
    for (var setting in autoTrimpSettings) {
        if (autoTrimpSettings[setting].type == 'value' || autoTrimpSettings[setting].type == 'valueNegative') {
            var elem = document.getElementById(autoTrimpSettings[setting].id);
            if (elem != null) {
                if (autoTrimpSettings[setting].value > -1 || autoTrimpSettings[setting].type == 'valueNegative')
                    elem.textContent = autoTrimpSettings[setting].name + ': ' + prettify(autoTrimpSettings[setting].value);
                else
                //elem.textContent = ranstring + ': ' + 'Infinite';
                    elem.innerHTML = autoTrimpSettings[setting].name + ': ' + "<span class='icomoon icon-infinity'></span>";
            }
        }
    }
}

//buncha update stuff i wrote but ended up not needing:
/*
for (var setting in autoTrimpSettings) {
    var btn = autoTrimpSettings[setting];
    var elem = document.getElementById(setting);
    if (elem == null) continue;
    if (btn.type == 'boolean')
        elem.setAttribute('class', 'noselect settingsBtn settingBtn' + btn.enabled);
    if (btn.type == 'multitoggle') {
        elem.setAttribute('class', 'noselect settingsBtn settingBtn' + btn.value);
        elem.textContent = btn.name[btn.value];
    }
}
*/

//Checks portal related UI settings (TODO: split into two, and move the validation check to NewUI)
function checkPortalSettings() {
    var portalLevel = -1;
    var leadCheck = false;
    switch (autoTrimpSettings.AutoPortal.selected) {
        case "Off":
            break;
        case "Custom":
            portalLevel = autoTrimpSettings.CustomAutoPortal.value + 1;
            leadCheck = autoTrimpSettings.HeliumHourChallenge.selected == "Lead" ? true : false;
            break;
        case "Balance":
            portalLevel = 41;
            break;
        case "Decay":
            portalLevel = 56;
            break;
        case "Electricity":
            portalLevel = 82;
            break;
        case "Crushed":
            portalLevel = 126;
            break;
        case "Nom":
            portalLevel = 146;
            break;
        case "Toxicity":
            portalLevel = 166;
            break;
        case "Lead":
            portalLevel = 181;
            break;
        case "Watch":
            portalLevel = 181;
            break;
        case "Corrupted":
            portalLevel = 191;
            break;
    }
    if (portalLevel == -1)
        return portalLevel;
    if (autoTrimpSettings.VoidMaps.value >= portalLevel)
        tooltip('confirm', null, 'update', 'WARNING: Your void maps are set to complete after your autoPortal, and therefore will not be done at all! Please Change Your Settings Now. This Box Will Not Go away Until You do. Remember you can choose \'Custom\' autoPortal along with challenges for complete control over when you portal. <br><br> Estimated autoPortal level: ' + portalLevel, 'cancelTooltip()', 'Void Maps Conflict');
    if ((leadCheck || game.global.challengeActive == 'Lead') && (autoTrimpSettings.VoidMaps.value % 2 == 0 && portalLevel <= 181))
        tooltip('confirm', null, 'update', 'WARNING: Voidmaps run during Lead on an Even zone do not receive the 2x Helium Bonus for Odd zones, and are also tougher. You should probably fix this.', 'cancelTooltip()', 'Lead Challenge Void Maps');
    return portalLevel;
}

/*
//UI startup:
//Add breeding box:
var breedbarContainer = document.querySelector('#trimps > div.row');
var addbreedTimerContainer = document.createElement("DIV");
addbreedTimerContainer.setAttribute('class', "col-xs-11");
addbreedTimerContainer.setAttribute('style', 'padding-right: 0;');
addbreedTimerContainer.setAttribute("onmouseover", 'tooltip(\"Breed Timer\", \"customText\", event, \"Shows how long has your next army been breeding for in seconds.\")');
addbreedTimerContainer.setAttribute("onmouseout", 'tooltip("hide")');
var addbreedTimerInside = document.createElement("DIV");
addbreedTimerInside.setAttribute('style', 'display: block;');
var addbreedTimerInsideIcon = document.createElement("SPAN");
addbreedTimerInsideIcon.setAttribute('class', "icomoon icon-clock");
var addbreedTimerInsideText = document.createElement("SPAN"); //updated in the top of mainLoop() each cycle
addbreedTimerInsideText.id = 'hiddenBreedTimer';
addbreedTimerInside.appendChild(addbreedTimerInsideIcon);
addbreedTimerInside.appendChild(addbreedTimerInsideText);
addbreedTimerContainer.appendChild(addbreedTimerInside);
breedbarContainer.appendChild(addbreedTimerContainer);
var armycount = document.getElementById('trimpsFighting');

function addToolTipToArmyCount() {
    armycount.setAttribute("onmouseover", 'tooltip(\"Army Count\", \"customText\", event, \"To Fight now would add: \" + prettify(getArmyTime()) + \" seconds to the breed timer.\")');
    armycount.setAttribute("onmouseout", 'tooltip("hide")');
    armycount.setAttribute("class", 'tooltipadded');
}
*/

