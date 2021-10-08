
const { Level, middleware: userLevel } = require("../../middlewares/userLevel")

const staff_groups = [
  "group.owner", "group.admin", "group.mod",
  "group.soporte", "group.jefebuilder", "group.builder",
  "group.dev"
];

module.exports=require("../../lib/Routes/exports")("/", (router, waRedirect, db, rcons) => {
  const adminMidd = userLevel(Level.Admin, {
    moreThan: true,
    redirect: true
  })

  router.get("/get/co-users", adminMidd, async (req, res) => {
    if(typeof req.query.uuids !== "string")
      return res.sendStatus(400);

    let more = "";
    if(req.query.uuids)
      more = " WHERE uuid IN ("+ req.query.uuids.split(",").map(_=>'"'+_+'"').join(", ") + ")";
    
    const pool = db();
    const query1 = Array.from(await pool.query("SELECT * FROM survival.co_user"+more)).filter(e=>e.uuid);
    const query2 = Array.from(await pool.query("SELECT * FROM survival.co2_user"+more)).filter(e=>e.uuid);
    pool.end();
    
    const users = {};
    
    query1.forEach(({ uuid, user, rowid }) => {
      users[uuid] = {
        uuid,
        name: user,
        n: [rowid, null]
      };
    });

    query2.forEach(({ uuid, user, rowid }) => {
      if(users[uuid]) return users[uuid].n[1] = rowid;

      users[uuid] = {
        uuid,
        name: user,
        n: [null, rowid]
      };
    });

    res
      .status(200)
      .type("json")
      .send(users);
  });

  router.get("/get/co-cmds", adminMidd, async (req, res) => {
    if(!req.query.n1 && !req.query.n2) 
      return res
        .status(400)
        .type("json")
        .send({ error: "No specify target" });

    let cmds = [];

    const pool = db();
    if(req.query.n1)
      cmds = cmds.concat(Array.from(
        await pool.query(`SELECT user, time, message FROM survival.co_command WHERE user = ${req.query.n1} ORDER BY time DESC LIMIT 100`)
      ));
    if(req.query.n2)                                             cmds = cmds.concat(Array.from(
        await pool.query(`SELECT user, time, message FROM survival.co2_command WHERE user = ${req.query.n2} ORDER BY time DESC LIMIT 100`)
      ));
    pool.end();

    cmds = cmds.sort((a,b)=>b.time-a.time);

    res
      .status(200)
      .type("json")
      .send(cmds);
  });

  router.get("/get/times/:uuid", adminMidd, async (req, res) => {
    const uuid = req.params.uuid;
    
    const pool = db();
    const query = Array.from(await pool.query(`SELECT time, day FROM bungee.StaffTimings WHERE uuid = "${uuid}"`));
    pool.end();
    
    res
      .status(200)
      .type("json")
      .send(query.sort((a,b)=>b.day-a.day));
  });

  router.get("/get/players-data/:modify", adminMidd, async (req, res) => {
    const modify = req.params.modify?.toLowerCase?.();

    let groups = [];

    if(modify === "staff") groups = staff_groups;
    else
      if(modify === "owner") groups = [staff_groups[0]];
    else
      if(modify === "admin") groups = [staff_groups[1]];
    else
      if(modify === "mod") groups = [staff_groups[2]];
    else 
      if(modify === "support") groups = [staff_groups[3]];
    else 
      if(modify === "jbuilder") groups = [staff_groups[4]];
    else 
      if(modify === "builder") groups = [staff_groups[4], staff_groups[5]];
    else 
      if(modify === "dev") groups = [staff_groups[6]];
    else return res.send(400).send({ error: "Invalid modify" });

    groups = groups.map(group=>`"${group}"`);

    const pool = db();
    const groups_query = Array.from(await pool.query(`SELECT DISTINCT uuid, permission FROM survival.luckperms_user_permissions WHERE permission IN (${groups.join(", ")}) ORDER BY FIELD(permission, ${groups.join(", ")})`));
    
    const players = [];

    const player_uuids = [];

    const player_groups = groups_query.reduce((obj, qr)=>{
      if(player_uuids.indexOf(qr.uuid)===-1)
        player_uuids.push(qr.uuid);

      if(!obj[qr.uuid]) obj[qr.uuid] = [];
      
      const group = qr.permission;
      
      obj[qr.uuid].push(group.slice(6));

      return obj;
    }, {});

    const _player_uuids = player_uuids.map(_=>'"'+_+'"');

    const names_query = Array.from(await pool.query(`SELECT DISTINCT player_uuid, player_name FROM survival.Essentials_userdata WHERE player_uuid IN (${_player_uuids.join(", ")})`));
    
    pool.end();

    const player_names = names_query.reduce((obj, qr) => {
      obj[qr.player_uuid] = qr.player_name;
      return obj;
    }, {});
    
    for(let uuid of player_uuids) {
      players.push({ 
        uuid, 
        name: player_names[uuid], 
        ranks: player_groups[uuid]});
    }


    res
      .status(200)
      .type("json")
      .send(players.sort((a,b) => {
        // Get your mayor rank
        const ARank = a.ranks.sort(RankSort)[0];
        const BRank = b.ranks.sort(RankSort)[0];

        const RankDiff = RankSort(ARank, BRank);

        if(RankDiff !== 0) return RankDiff;

        const AName = a.name?.toLowerCase?.();
        const BName = b.name?.toLowerCase?.();

        if(!AName || !BName) return 0;
        
        return StringSort(AName, BName);
      }));
  });
  
  /**
   * @param {string} str_a
   * @param {string} str_b
  */
  function StringSort(str_a, str_b) {
    const maxLength = Math.max(str_a.length, str_b.length);
    for(let i=0; i < maxLength; i++) {
      if(str_a[i] == str_b[i]) continue;
      if(str_a[i] == undefined) return 1;
      if(str_b[i] == undefined) return -1;

      return str_a.charCodeAt(i) - 
             str_b.charCodeAt(i);
    }

    return 0;
  }
  
  /**
   * @param {string} rank_a
   * @param {string} rank_b
  */
  function RankSort(rank_a, rank_b) {
    rank_a = "group."+rank_a;
    rank_b = "group."+rank_b;
    return staff_groups.indexOf(rank_a) - 
           staff_groups.indexOf(rank_b);
  }
});
