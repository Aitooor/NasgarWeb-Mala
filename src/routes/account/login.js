const { setLevel, Level, middleware: userLevelMidd } = require("../../middlewares/userLevel");

const { login } = require("../../api/account");
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

	router.get("/login", defaultMidd, (req, res) => {
		const next = typeof req.query.next === "string" ? 
			encodeURIComponent(req.query.next) :
			null;
		
		res.render("pags/login", { 
			next
		});
	});

	router.post("/login", async (req, res) => {
		const { username, password } = req.body;
		const nextUrl = req.query.next || undefined;
		const response = await login(db, username, password);

		if(!response.done) {
			console.error(response.error);

			if(response.error.code === ErrorCode.EAcIncorrect)
				return res
					.status(403)
					.render("prefabs/splash", {
						title: "Incorrecto",
						texts: {
							text: "Usuario o contraseña incorrecta.",
							help: "Verifica los datos.",
						},
						link: {
							text: "el ingreso",
							href: `${process.env.WEB_HREF}/login`
						},
						seconds: 20
					});

			if(response.error.code === ErrorCode.EAcNoVerified)
				return res
					.status(403)
					.render("prefabs/splash", {
						title: "Verifica tu email",
						texts: {
							text: "Verifica tu email",
							help: "Revisa la bandeja de spam.",
						},
						link: {
							text: "el ingreso",
							href: `${process.env.WEB_HREF}/login`
						},
						seconds: 20
					});
			
			return res
				.status(400)
				.render("prefabs/splash", {
					title: "Error",
					texts: {
						text: "Error ingresando.",
						help: "Contactanos.",
					},
					link: {
						text: "el ingreso",
						href: `${process.env.WEB_HREF}/login`
					},
					seconds: 20
				});
		}

		jwt.set({ userLevel: response.data.rank }, req, res);

		res.render("prefabs/splash", {
			title: "Has iniciado sesion",
			texts: {
				text: "Has iniciado sesion.",
			},
			link: {
				text: nextUrl ? "next" : undefined,
				href: nextUrl
			},
			seconds: 5
		});
	});
});
