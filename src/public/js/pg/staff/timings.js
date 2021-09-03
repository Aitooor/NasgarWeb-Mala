
const $ = id=>document.getElementById(id);

const player_list = $("players");

const player_actual = {
  name:  $("actualName"),
  last:  $("actualLast"),
  total: $("actualTotal"),
  times: $("actualTimes"),
  cmds:  $("actualCmds")
};

let staff_uuids = {};
let staff_names = {};
let staff_n     = {};
let cached_players = {};
let actual;

async function SetActualPlayer(player) {
  await player._times();
  await player._cmds();

  actual = player.uuid;

  player_actual.name.innerText = player.name;
  player_actual.last.innerText = "Last play: "+(parseDate(player.times[player.times.length - 1]?.day)||"-");
  player_actual.total.innerText = count(player.times);
  player_actual.times.innerHTML = "";
  player_actual.times.append(...player.times.reverse().map(time=>GDom({
    attr: { "class": "row" },
    childs: [{
        attr: { "class": "field" },
        childs: [parseDate(time.day)]
      },{
        attr: { "class": "field"},
        childs: [parseTime(time.time)]
    }]
  })));
  player_actual.cmds.innerHTML = "";
  player_actual.cmds.append(...player.cmds.reverse().map(cmd=>GDom({
    attr: { "class": "row" },
    childs: [{
        attr: { "class": "field" },
        childs: [cmd.cmd]
      },{
        attr: { "class": "field"},
        childs: [parseDate(cmd.time)]
    }]
  })));
}

function defProp(obj, name, gg)  {
  Object.defineProperty(obj, name, {
    enumerable: true,
    ...gg
  });
}

function parseTime(secs) {
  if(!secs) return "0h";
  return (secs / 60) + "m";
}

function parseDate(milis) {
  if(!milis) return;
  
  const date = new Date(milis);
  const d = date.getHours() >= 12;
  return `${date.getDay()}.${date.getMonth()}.${date.getYear()} ${date.getHours() - (d?12:0)}:${date.getMinutes()} ${d?"p.m.":"a.m."}`;
}
function count(times) {
  return "";
}

async function GetPlayer(name) {
  let uuid = staff_uuids[name];
  if(uuid == null) await CacheUUIDs();
  uuid = staff_uuids[name];

  let player = cached_players[uuid];

  player.times = null;
  player.cmds  = null;
  
  player._times = async function() {
    if(!player.times) player.times = await GetPlayerTime(uuid);
    return player.times;
  };

  player._cmds = async function() {
    if(!player.cmds) player.cmds = await GetPlayerCmds(uuid);
    player.cmds = [];
    return player.cmds;
  }

  return player;
}

async function CacheUUIDs() {
  const res = await fetch("/api/get/players-data/staff", {
    credentials: "same-origin",
    cache: "no-cache"
  });

  if(!res.ok) return (alert("Error fetching player data (uuid)"), true), null;
  
  const json = await res.json();
  
  for(let player of json) {
    staff_uuids[player.name] = player.uuid;
    staff_names[player.uuid] = player.name;
    staff_n    [player.uuid] = player.n;

    cached_players[player.uuid] = {
      uuid: player.uuid,
      name: player.name,
      ranks: player.ranks
    };
  }
}

async function GetPlayerTime(uuid) {
  const res = await fetch("/api/get/times/"+uuid, {
    credentials: "same-origin",
    cache: "no-cache"
  });

  if(!res.ok)
    return (alert(res.status === 400 ? uuid+" Bad uuid getting times" : "Error fetching times of "+uuid), true), null;
  
  return await res.json();
}

async function GetPlayerCmds(uuid) {
  const res = await fetch("/api/get/co-cmds/"+uuid, {
    credentials: "same-origin",
    cache: "no-cache"
  });

  if(!res.ok)
    return (alert(res.status === 400 ? uuid+" Bad uuid getting times" : "Error fetching commands of "+uuid), true), null;

  return await res.json();
}

async function AddPlayerToList(player) {
  player_list.append(GDom({
    attr: { "class": "row" },
    evt: { "click": _OnPlayerClicked(player.name) },
    childs: [{
        attr: { "class": "field" },
        childs: [player.ranks.join(", ")]
      },{
        attr: { "class": "field" },
        childs: [player.name]
    }]
  }));
}

function SetListPlayers(players) {
  player_list.innerHTML="";
  players.map(AddPlayerToList);
}

// Execute when a player at players list is clicked
function _OnPlayerClicked(name) {
  return async () => {
    SetActualPlayer(await GetPlayer(name)).catch(alert);
  }
}

// Transform a json to HTMLElement with attributes and childs
function GDom(structure) {
  if(typeof structure === "string") 
    return structure;

  const _elm = structure?.elm || "div";
  const elm = document.createElement(_elm);

  const _attr = structure?.attr || {};
  for(let attr in _attr) 
    elm.setAttribute(attr, _attr[attr]);

  const _evt = structure?.evt || {};
  for(let evt in _evt) 
    elm.addEventListener(evt, _evt[evt]);

  const _childs = structure?.childs || [];
  const childs = _childs.map(GDom);

  elm.append(...childs);

  return elm;
}

async function update() {
  cached_players = {};
  const r = [];
  await CacheUUIDs();
  for(let name in staff_uuids) {
    const ply = await GetPlayer(name);
    
    r.push(ply);
  }

  await SetListPlayers(r);
// TODO: Filters
}

async function updateActual() {
  cached_players[actual].times = null;
  cached_players[actual].rank  = null;
  cached_players[actual].cmds  = null;
  await SetActualPlayer(await GetPlayer(staff_names[actual]));
}
// TODO: all paths of api

update();
