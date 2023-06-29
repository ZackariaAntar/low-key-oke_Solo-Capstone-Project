import {Box, BottomNavigation,
BottomNavigationAction, IconButton, Container, Paper, Stack} from "@mui/material";
import AssignmentIcon from "@mui/icons-material/Assignment";
import QueueMusicIcon from "@mui/icons-material/QueueMusic";
import WatchLaterIcon from "@mui/icons-material/WatchLater";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";




function BottomNav() {


	return (
		<>
			<Box
				sx={{
					position: "fixed",
					bottom: 0,
					left: 0,
					right: 0,
					bgcolor: "rgba(246, 232, 255, 1)",
					padding: .25,

				}}
				elevation={10}
			>
				<Stack
					direction="row"
					justifyContent="space-around"
					alignItems="center"
					spacing={0}
				>
					<IconButton size="large" color="secondary" component={Link} to={'/signup'}>
						<AssignmentIcon />
					</IconButton>
					<IconButton size="large" color="secondary" component={Link} to={'/my-queue'}>
						<QueueMusicIcon />
					</IconButton>
					<IconButton size="large" color="secondary" component={Link} to={'/my-history'}>
						<WatchLaterIcon />
					</IconButton>
				</Stack>
			</Box>

			{/* <BottomNavigation
				showLabels
				value={value}
				// onClick={() => goToView(value)}
				onChange={(event, newValue) => {
					setValue(newValue);
				}}
			>
				<BottomNavigationAction
					value="/signup"
					to="/signup"
					component={Link}
					label="Sign-up"
					icon={<AssignmentTwoToneIcon />}
				></BottomNavigationAction>

				<BottomNavigationAction
					value="/my-queue"
					to="/my-queue"
					component={Link}
					label="My Queue"
					icon={<QueueMusicTwoToneIcon />}
				/>

				<BottomNavigationAction
					value="/my-history"
					to="/my-history"
					component={Link}
					label="My History"
					icon={<WatchLaterTwoToneIcon />}
				/>
			</BottomNavigation> */}
		</>
	);

}

export default BottomNav;

// border: "1, solid, black",
// 					bgcolor: "background.dark"