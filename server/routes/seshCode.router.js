const express = require("express");
const pool = require("../modules/pool");
const router = express.Router();
const {
	rejectUnauthenticated,
} = require("../modules/authentication-middleware");

// GET ROUTE USED TO CHECK AGAINST TO VALIDATE NEWLY GENERATED CODE

router.get("/", rejectUnauthenticated, (req, res) => {
	let queryText = `SELECT * FROM sesh;`;
	pool.query(queryText)
		.then((result) => {
			console.log(
				"REQUEST FOR ALL OF THE SESSION CODES FROM sesh TABLE",
				result.rows
			);
			res.send(result.rows);
		})
		.catch((err) => {
			console.log(
				"PROBLEM GETTING ALL SESSION CODES FROM sesh TABLE",
				err
			);
			res.sendStatus(500);
		});
});

// ALL USERS GET ROUTE TO FIND THEIR CURRENT SESSION ID

router.get("/current/:id", rejectUnauthenticated, (req, res) => {
	const user_id = req.params.id;

	let queryText = `SELECT "sesh_junction"."sesh_code"
	FROM "sesh_junction"
    JOIN "sesh" ON "sesh_junction"."sesh_code" = "sesh"."join_code"
	WHERE "sesh_junction"."user_id" = $1
	ORDER BY "sesh"."created_at" DESC
	LIMIT 1;`;
	pool.query(queryText, [user_id])
		.then((result) => {
			console.log(
				"REQUEST FOR ALL OF THE SESSION CODES FROM sesh TABLE",
				result.rows
			);
			res.send(result.rows);
		})
		.catch((err) => {
			console.log(
				"PROBLEM GETTING CURRENT SESSION CODES FROM sesh_junction TABLE",
				err
			);
			res.sendStatus(500);
		});
});


// HOST POST ROUTE ON CREATING A NEW GAME

router.post("/", rejectUnauthenticated, (req, res) => {
	const { newCode, host_id } = req.body;
	let updateViews = `
		UPDATE "user" SET "in_session" = true, "is_hosting" = true
		WHERE id = $1;`;
	pool.query(updateViews, [host_id])
		.then(() => {
			console.log("SUCCESSFULLY SET HOST VIEWS");
			let queryText = `
    	  INSERT INTO sesh ("join_code", "host_user_id")
    	  VALUES ($1, $2);`;
			pool.query(queryText, [newCode, host_id])
				.then(() => {
					console.log("SUCCESSFULLY ADDED TO THE sesh TABLE");
					let junctionQuery = `
    			INSERT INTO sesh_junction ("sesh_code", "user_id")
   				VALUES ($1, $2);`;
					pool.query(junctionQuery, [newCode, host_id])
						.then(() => {
							res.sendStatus(201);
						})
						.catch((error) => {
							console.log(
								"PROBLEM WITH ADDING SESH CODE AND HOST ID TO THE JUNCTION TABLE AFTER ADDING IT TO THE sesh TABLE",
								error
							);
							res.sendStatus(500);
						});
				})
				.catch((error) => {
					console.log("PROBLEM WITH ADDING TO THE sesh TABLE", error);
					res.sendStatus(500);
				});
		})
		.catch((err) => {
			console.log("problem CREATING HOST INSTANCE", err);
			res.sendStatus(500);
		});
});

// GUEST POST ROUTE ON JOINING AN EXISTING GAME

router.post("/guest", rejectUnauthenticated, async (req, res, next) => {
	const { sesh_code, user_id } = req.body;
	const client = await pool.connect();

	console.log( 'ARRIVED ON WACK GUEST FROM JOIN EXISTING PARTY: sesh_code and user_id from req', sesh_code, user_id);
	let junctionQuery = `
		INSERT INTO sesh_junction ("sesh_code", "user_id")
		VALUES ($1, $2);`;
	let updateViews = 'UPDATE "user" SET "in_session" = true WHERE id = $1;';
	const findExisting = `SELECT * FROM sesh_junction WHERE user_id = $1 AND sesh_code =$2`

	try {
		await client.query("BEGIN");

		const existing = await client.query(findExisting, [user_id, sesh_code])

		console.log('sesh junction', existing.rows);

		if (await existing.rows.length > 0) {
			console.log("User found! Will not add again");
			await client.query(updateViews, [user_id]);
			await client.query("COMMIT");
			res.sendStatus(200);
		} else {
			console.log("User not found, adding them to the session!");
			await client.query(junctionQuery, [sesh_code, user_id]);
			await client.query(updateViews, [user_id]);
			await client.query("COMMIT");
			res.sendStatus(201);
		}
	} catch (error) {
		await client.query("ROLLBACK");
		console.log('SOMETHING WENT WRONG', error);
		res.sendStatus(500);

	} finally{
		client.release()

	}
	// pool.query(updateViews, [user_id])
	// .then(() => {
	// console.log("SUCCESSFULLY CHANGED GUEST VIEW IN USER TABLE");

	// 	pool.query(junctionQuery, [sesh_code, user_id])
	// 		.then(() => {
	// 			console.log(
	// 			"SUCCESSFULLY ADDED guest TO THE sesh_junction TABLE"
	// 			);
	// 			res.sendStatus(201);
	// 			})
	// 						.catch((error) => {
	// 							console.log(
	// 								"PROBLEM WITH ADDING guest TO THE JUNCTION TABLE",
	// 								error
	// 							);
	// 							res.sendStatus(500);
	// 						});
	// 		})
	// 	.catch((error) => {
	// 		console.log("PROBLEM CHANGING GUEST VIEW IN USER TABLE", error);
	// 		res.sendStatus(500);
	// 	});
});

router.post("/leave/session/", rejectUnauthenticated, async (req, res, next) => {
	console.log('arrived AT LEAVE SESSION', req.body);
	const { user_id } = req.body;
	let leaveSessionQuery = `
		UPDATE "user" SET "in_session" = false, "is_hosting" = false
		WHERE id = $1;
		`;
	const removeSongs = `UPDATE queue SET in_queue = false WHERE user_id = $1;`;
	const removePlayer = `DELETE FROM sesh_junction WHERE user_id = $1;`;
	const client = await pool.connect();

	try {
		await client.query("BEGIN");
		await client.query(leaveSessionQuery, [user_id]);
		await client.query(removeSongs, [user_id]);
		await client.query(removePlayer, [user_id]);
		await client.query("COMMIT");
		res.sendStatus(200);

	} catch (error) {
		await client.query("ROLLBACK");
		console.log("SOMETHING WENT WRONG", error);
		res.sendStatus(500);

	} finally{
		client.release()
	}


	// pool.query(leaveSessionQuery, [user_id])
	// 	.then((response) => {
	// 		console.log("SUCCESS LEAVING CURRENT SESSION", response);
	// 		res.sendStatus(200);
	// 	})
	// 	.catch((error) => {
	// 		console.log("PROBLEM WITH LEAVING CURRENT SESSION", error);
	// 		res.sendStatus(500);
	// 	});
});

module.exports = router;
