function alertNotStaff(req, res) {
	req.session.alert = "You are not part of the staff, please enter a correct password for your level in <b class\"code\"><a href=\"/staffLogin\">/staffLogin</a></b>";
	req.session.showAlert = true;
	res.redirect("/");
}
function StaffMiddleware(req, res, next) {
	if(req.session?.isStaff === true) next();
	else alertNotStaff(req, res);
}

module.exports = {
	StaffMiddleware,
	alertNotStaff
};
module.exports.default = StaffMiddleware;