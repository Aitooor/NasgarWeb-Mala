

const staff_groups = [
  "group.owner", "group.admin", "group.mod",
  "group.soporte", "group.jefebuilder", "group.builder",
  "group.dev"
];

module.exports=require("../../lib/Routes/exports")("/", (router, waRedirect, db, rcons) => {
  function adminMidd(req, res, next) {
    if(req.session.admin) next();
    else res.status(403).type("json").send({ error: "Only admin accounts." });
  }

  router.get("/get/co-cmds/:uuid", adminMidd, async (req, res) => {
    res.send([]);
  });

  router.get("/get/times/:uuid", adminMidd, async (req, res) => {
    const uuid = req.params.uuid;
    
    const pool = await db();
    const query = Array.from(await pool.query(`SELECT time, day FROM bungee.StaffTimings WHERE uuid = "${uuid}"`));
    
    res.status(200).send(query);
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

    const pool = await db();
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

    const names_query = Array.from(await pool.query(`SELECT DISTINCT player_uuid, player_name FROM survival.Essentials_userdata WHERE player_uuid IN (${player_uuids.map(_=>'"'+_+'"').join(", ")}) AND userdata LIKE "%lastteleport:%"`));
    
    await pool.end();

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


    res.status(200).type("json").send(players);
  });
});
