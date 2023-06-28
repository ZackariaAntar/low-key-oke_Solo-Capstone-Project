import { useEffect, useState } from "react";
import YouTube, { YouTubeProps } from "react-youtube";
import { Container } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {Button} from '@mui/material'
// https://github.com/tjallingt/react-youtube



function MainDisplay(){
	const dispatch = useDispatch()

	    useEffect(() => {
			dispatch({ type: "FETCH_CURRENT_SESSION", payload: user.id });
			dispatch({ type: "FETCH_QUEUE", payload: user.id });
		}, []);
		const seshInfo = useSelector((store) => store.seshInfo);
		const queue = useSelector((store) => store.queue);
		const user = useSelector((store) => store.user);



		const [fetch, setFetch] = useState(false)

		console.log(queue);




	const handlePlay = (event) =>{
		console.log('playing');
		// event.target.playVideo();

	}
	const handleReady = (event) =>{
		console.log('ready');
		// dispatch({ type: "FETCH_QUEUE", payload: user.id });
		// event.target.pauseVideo();

	}
	const handleEnd = (event) =>{
		console.log('ended')
		dispatch({type:'REMOVE_FROM_QUEUE', payload: queue[0]})
		// event.target.pauseVideo()


	}

	const getQueue = () => {
		console.log("making fetch queue happen");
		// dispatch({type: "FETCH_QUEUE", payload: user.id });
		setFetch(!fetch)

		// event.target.pauseVideo()
	};

    const options = {
		height: "548",
		width: "900",
		playerVars: {
			// https://developers.google.com/youtube/player_parameters
			autoplay: 0,
            controls: 1,

		},
	};
	// return (
	// 	<Container maxWidth="md">
	// 		<h1>Join code: {seshInfo.sesh_code}</h1>
	// 		<div>
	// 			<YouTube
	// 				videoId={queue && queue[0].url}
	// 				opts={options}
	// 				onReady={handleReady}
	// 				onPlay={handlePlay}
	// 				onEnd={handleEnd}
	// 			/>
	// 		</div>
	// 		<div>
	// 			<h2>
	// 				ON DECK: {queue[1].user_id} with {queue[1].title} by
	// 				{queue[1].artist}
	// 			</h2>
	// 		</div>
	// 	</Container>
	// );

	if (!queue) {
		return (
			<Container maxWidth="md">
				<h1>Join code: {seshInfo.sesh_code}</h1>
				<Button variant="contained" onClick={getQueue}> START HOSTING </Button>
			</Container>
		);

	} else {
		return (
			<Container maxWidth="md">
				<h1>Join code: {seshInfo.sesh_code}</h1>
				<div>
					<YouTube
						videoId={queue[0].url}
						opts={options}
						onReady={handleReady}
						onPlay={handlePlay}
						onEnd={handleEnd}
					/>
				</div>
				<div>
					<h2>
						ON DECK: {queue[1].user_id} with {queue[1].title} by
						{queue[1].artist}
					</h2>
				</div>
			</Container>
		);
	}


}

export default MainDisplay

//
{/* <div>
					<YouTube
						videoId={'DykZEOV5wD4'}
						opts={options}
						onReady={handleReady}
						onPlay={handlePlay}
						onEnd={handleEnd}
					/>
				</div>
				<div>
					<h2>
						WAITING FOR PLAYERS TO JOIN
					</h2>
				</div> */}