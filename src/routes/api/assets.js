const { middleware: userLevelMidd, Level: UserLevel } = require("../../middlewares/userLevel");
const cloudinary = require("../../services/cloudinary");
const { v4: uuid } = require("uuid");

module.exports = require("../../lib/Routes/exports")("/asset", async (router, waRedirect, db, rcon) => {
  const imageMidd = userLevelMidd(UserLevel.Staff, { redirect: false });
  
  router.get("/", async (req, res) => {
    if(typeof req.query.publicId !== "string")
      return res.sendStatus(400);

    const query = await cloudinary.getData(req.query.publicId);

    if(query === null)
      return res.sendStatus(404);

    res.redirect(query.url);
  });

  router.delete("/", imageMidd, async (req, res) => {
    if(typeof req.query.publicId !== "string")
      return res.sendStatus(400);

    const query = await cloudinary.deleteData(req.query.publicId);

    if(query === null)
      return res.sendStatus(404);

    res.sendStatus(200);
  });
  
  router.post("/", imageMidd, async (req, res) => {
    let files = req.files.images;

    if(!Array.isArray(files))
      files = [files];
    
    for(const file of files) {
      await cloudinary.upload(file, { public_id: `images/${uuid()}` });
    }

    res.sendStatus(200);
  });

  router.get("/all", imageMidd, async (_req, res) => {
    const pool = db();

    const query = await cloudinary.getAllImages();

    pool.end();

    res.type("json").send(query.map(_ => {
      _.image = `${process.WEB_HREF}/api/asset?uuid=${_.uuid}`;
      return _;
    }));
  });
})
