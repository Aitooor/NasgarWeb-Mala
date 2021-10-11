
const { setLevel, Level, middleware: userLevelMidd } = require("../../middlewares/userLevel");

const { sendEmail, MessageIDType } = require("../../lib/mailer");
const mailTemplate = require("../../lib/mailerTemplates");

const { signup } = require("../../api/account");
const { ErrorCode } = require("../../@types/errorCodes");
const jwt = require("../../lib/jwt");

module.exports = require("../../lib/Routes/exports")("/", (router, waRedirect, db, rcons) => {
	const defaultMidd = userLevelMidd(Level.Default, {
		moreThan: false,
		redirect: true,
		authPage: (_req, res) => {
			res.render("prefabs/splash", {
				title: "Ya has iniciado sesion",
				texts: {
					text: "Ya has iniciado."
				},
				seconds: 5
			});
		}
	});
	
	router.get("/signup", defaultMidd, (req, res) => {
		res.render("pags/signup");
	});

	router.post("/signup", async (req, res) => {
		const { username, email, password } = req.body;

		const response = await signup(db, username, email, password);

		if(!response.done) {
			console.error("[ACCOUNTS]" + response.error);
			
			if(response.code === ErrorCode.EAcExists)
				return res.render("prefabs/splash", {
					title: "Error",
					texts: {
						text: "Usuario ocupado.",
						help: "Ese usuario ya existe"
					},
					link: {
						text: "el registro",
						href: `${process.env.WEB_HREF}/sigup`
					},
					seconds: 5
				});

			return res.render("prefabs/splash", {
				title: "Error",
				texts: {
					text: "Error registrando.",
					help: "Contactanos en <a>Discord</a>"
				},
				link: {
					text: "el registro",
					href: `${process.env.WEB_HREF}/sigup`
				},
				seconds: 20
			});
		}

		try {
			const uuid = jwt.generate(response.data);
			const verifyUrl = `${process.env.WEB_HREF}/api/accounts/verify?uuid=${uuid}`;

			await sendEmail({
				to: email,
				
				subject: "Email verification",
				text: `To verify pase the next url in your browser ${verifyUrl}`,
				html: mailTemplate("signConfirm", verifyUrl),
				
				priority: "high",
				messageID: { type: MessageIDType.Verification },

				seeInfo: true
			});

			res.render("prefabs/splash", {
				title: "Verifica tu email",
				texts: {
					text: "Verifica tu email.",
					help: "Revisa la bandeja de spam o contactanos en <a href=\"https://ds.nasgar.online\">Discord</a>."
				},
				seconds: 20
			});
		} catch(err) {
			console.error(err);

			res.render("prefabs/splash", {
				title: "Error",
				texts: {
					text: "Error mandando el email.",
					help: "Contactanos en <a href=\"https://ds.nasgar.online\">Discord</a>"
				},
				seconds: 20
			});
		}
  });

	router.get("/logout", (req, res) => {
		setLevel(Level.Default, req, res);
		res.render("prefabs/splash", {
			title: "Cerrando sesion",
			texts: {
				text: "Sesion cerrada.",
				help: "Sesion cerrada exitosamente"
			},
			seconds: 5
		});
	});

	router.post("/logout", (req, res) => {
		setLevel(Level.Default, req, res)
		res.sendStatus(200);
	});
});
