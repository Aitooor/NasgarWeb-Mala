const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const { middleware: userLevelMidd, Level: UserLevel } = require("../../middlewares/userLevel");

module.exports = require("../../lib/Routes/exports")("/staff", async (router, waRedirect, db, rcon) => {

  const imageMidd = userLevelMidd(UserLevel.Staff, { redirect: false });
  
  router.get("/image", async (req, res) => {
    if(req.query.uuid === undefined)
      return res.sendStatus(400);

    const pool = db();

    const query = await pool.query(`SELECT * FROM web.images WHERE uuid = "${req.query.uuid}" LIMIT 1`);

    pool.end();

    if(query.length === 0)
      return res.sendStatus(404);

    res
      .contentType(query[0].type)
      .send(query[0].image);
  });

  router.delete("/image", imageMidd, async (req, res) => {
  });

  router.get("/images", imageMidd, async (_req, res) => {
    const pool = db();

    const query = await pool.query(`SELECT uuid, filename, name, created, type FROM web.images`);

    pool.end();

    res.type("json").send(query.map(_ => {
      _.image = `${process.env.WEB_HREF}/api/staff/image?uuid=${_.uuid}`;
      return _;
    }));
  });

  router.post("/images", imageMidd, async (req, res) => {
    let files = req.files.images;

    if(!Array.isArray(files))
      files = [files];

    for(const file of files) {

      // Transform data to buffer and update
      
      const filePath = file.tempFilePath;
      const buffer = fs.readFileSync(filePath);
      
      file.data = buffer;
    }

    const pool = db();

    for(let file of files) {
      try {
        await pool.query(`INSERT INTO web.images SET ?`, {
          uuid: uuidv4(),
          name: file.name,
          filename: file.name,
          created: Date.now(),
          type: file.mimetype,
          image: file.data
        });
        
        pool.end();

        setTimeout(() => {
          fs.rmSync(file.tempFilePath, {
            force: true,
          });
        }, 10_000);
      } catch(e) {
        pool.end();
        console.error(e);
        return res.sendStatus(500);
      }
    }

    res.sendStatus(200);
  });
})
