const handleRegister = (req, res, db, bcrypt) => {
	const { email, password, firstName, lastName } = req.body;
	if (!email || !password || !firstName || !lastName) {
		return res.status(400).json("incorrect form submission");
	}
	const hash = bcrypt.hashSync(password, 10);
	console.log(hash);
	console.log(db);
	// Store hash in your password DB.
	db.transaction((trx) => {
		trx
			.insert({
				hash: hash,
				email: email,
			})
			.into("login")
			.returning("email")
			.then((loginEmail) => {
				return trx("users")
					.returning("*")
					.insert({
						email: loginEmail[0].email,
						firstname: firstName,
						lastname: lastName,
						joined: new Date(),
					})
					.then((user) => {
						res.json(user[0]);
					});
			})
			.then(trx.commit)
			.catch(trx.rollback);
	}).catch((err) => res.status(400).json("unable to register"));
};

module.exports = {
	handleRegister: handleRegister,
};
