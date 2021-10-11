
/** @returns {HTMLElement} */
const $ = id=>document.getElementById(id);

const player_list = $("players");

const player_actual = {
  name:  $("actualName"),
  last:  $("actualLast"),
  total: $("actualTotal"),
  times: $("actualTimes"),
  cmds:  $("actualCmds")
};

const WEEK_DAYS = [ "Mon", "Tue", "Wed", "Thu", "Fri", "Sun", "Sat" ];

const MONTHS = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dic" ];

let staff_uuids = {};
let staff_names = {};
let staff_n     = {};
let cached_players = {};

// UUID of selected player
let actual;

async function SetActualPlayer(player) {
  await player._times();
  await player._cmds();

  actual = player.uuid;

  player_actual.name.innerText = player.name;
  player_actual.last.innerText = "Last play: "+(parseDate(player.times[0]?.day)||"-");
  player_actual.total.innerText = "Total time: "+count(player.times);
  player_actual.times.innerHTML = "";
  player_actual.times.append(...player.times.map(time=>GDom({
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
  player_actual.cmds.append(...player.cmds.map(cmd=>GDom({
    attr: { "class": "row" },
    childs: [{
        attr: { "class": "field" },
        childs: [cmd.message]
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

  const floor = (n)=>normDateNum(Math.floor(n));

  const hours = secs / 60 / 60;
  const mins  = (hours - floor(hours)) * 60;
  const _secs = (mins  - floor(mins )) * 60;

  return `${floor(hours)}h ${floor(mins)}m ${floor(_secs)}s`;
}

function parseDate(milis) {
  if(!milis) return;
  
  const date = new Date(milis);
  const d = date.getHours() >= 12;
  return `${normDateNum(date.getDate())}-${normDateNum(date.getMonth()+1)}-${normDateNum(date.getFullYear())} (${WEEK_DAYS[date.getDay()]} | ${MONTHS[date.getMonth()]})`;
}

function normDateNum(n) {
  n = `${n}`;
  return n.length === 2?n:
          n.length > 2?
            n.slice(n.length-2):
            "0"+n;
}

function count(times) {
  const onlyTimes = times.map(e=>e.time);
  return parseTime(onlyTimes.reduce((a,b)=>(+a)+(+b), 0));
}

async function GetPlayer(uuid) {
  let player = cached_players[uuid];
  
  player.times = null;
  player.cmds  = null;
  
  player._times = async function() {
    if(!player.times) player.times = await GetPlayerTime(uuid);
    return player.times;
  };

  player._cmds = async function() {
    if(!player.cmds) player.cmds = await GetPlayerCmds(player.n);
    
    return player.cmds;
  }

  return player;
}

async function CacheUUIDs() {
  const res = await fetch("/api/get/players-data/staff", {
    credentials: "same-origin",
    cache: "no-cache"
  });

  if(!res.ok) 
    return (alert("Error fetching player data (uuid)"), true), null;

  const players = await res.json();
  
  const uuids = players.map(player => player.uuid);

  const res2 = await fetch("/api/get/co-users?uuids=" + uuids.join(","), {
    credentials: "same-origin",
    cache: "no-cache"
  });

  if(!res2.ok)
    return (alert("Error fetching co users, "+ res2.status), true), null;
  
  const users = await res2.json();
  
  for(let player of players) {
    if(!staff_uuids[player.name])
      staff_uuids[player.name] = [];
    staff_uuids[player.name].push(player.uuid);
    staff_names[player.uuid] = player.name;
    staff_n    [player.uuid] = users[player.uuid]?.n || [null, null];

    cached_players[player.uuid] = {
      uuid: player.uuid,
      name: player.name,
      n: staff_n[player.uuid],
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

async function GetPlayerCmds(n) {
  const res = await fetch("/api/get/co-cmds?"+(n[0]!=null?"n1="+n[0]:"")+(n[1]!=null?n[0]!=null?"&n2="+n[1]:"n2="+n[1]:""), {
    credentials: "same-origin",
    cache: "no-cache"
  });

  if(!res.ok)
    return (alert(res.status === 400 ? n+" Bad uuid getting times" : "Error fetching commands of "+n), true), null;

  return await res.json();
}

async function AddPlayerToList(player) {
  player_list.append(GDom({
    attr: { "class": "row" },
    evt: { "click": _OnPlayerClicked(player.uuid) },
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
function _OnPlayerClicked(uuid) {
  return async () => {
    player_actual.name.innerText = "Loading...";
    SetActualPlayer(await GetPlayer(uuid)).catch(alert);
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
  let r = [];
  await CacheUUIDs();
  for(let uuid in staff_names) {
    const ply = await GetPlayer(uuid).catch(alert);
    
    r.push(ply);
  }

  SetListPlayers(r);
// TODO: Filters
}

async function updateActual() {
  cached_players[actual].times = null;
  cached_players[actual].rank  = null;
  cached_players[actual].cmds  = null;
  await SetActualPlayer(await GetPlayer(actual));
}

update().catch(alert);
