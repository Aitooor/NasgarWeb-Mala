const { Router } = require("express");

/** @type {import("./imports")} */
module.exports = function(route, routes) {
	const router = new Router();

	function s(...args) {
		/** @type {import("../../a").Routes.pFunc} */
		function exec(v) {v(...args)};

		for (const Route of routes) {
			exec(Route);
			router.use(Route.thisRoute, Route.r);
		}
	};

	s.r = router;
	s.thisRoute = route;

	return s;
}