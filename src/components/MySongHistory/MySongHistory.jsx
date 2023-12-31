import {
	IconButton,
	Divider,
	Grid,
	Box,
	Paper,
	Typography,
    Container,
	Card,
	CardContent,
	CardActionArea

} from "@mui/material";

import StarBorderRoundedIcon from "@mui/icons-material/StarBorderRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import BottomNav from "../BottomNav/BottomNav";

function MySongHistory(){
    const dispatch = useDispatch()

    useEffect(()=>{
        dispatch({ type: "FETCH_MY_SONG_HISTORY", payload: user.id});
    },[])

    const user = useSelector((store)=>store.user)
    const myHistory = useSelector((store)=>store.myHistory)

    const setAsFavorite = (id) =>{
        dispatch({type:'MAKE_FAVORITE', payload: {songId: id,  userId: user.id}})
    }
    const setUnfavorite = (id) =>{
        dispatch({type:'MAKE_UNFAVORITE', payload: {songId: id, userId: user.id}})
    }
	const icon = {
		fontSize: ".8rem",
		color: "#4b00a1",
		display: "flex",
		flexDirection: "column",
		justifyContent: "center",
	};
	const text = { mt: 1 };


    if(myHistory.length >= 1){
        return (
			<Container maxWidth={"xs"} sx={{ pt: 3 }}>
				{myHistory &&
					myHistory.map((history, i) => (
							<Card
								key={history.id}
								elevation={10}
								sx={{
									bgcolor: "#F2F2F2",
									mt: 2,
									borderRadius: 2,
									display: "flex",

								}}
							>
								<CardContent
									sx={{
										textAlign: "center",
										color: "#4b00a1",
										mx: 0.25,
										mt: 1,
										width: "80%",
									}}
								>
									<Typography
										sx={{ my: 0.75 }}
										variant="h6"
										fontWeight={"bolder"}
										align="center"
									>
										{history.title}
									</Typography>
								</CardContent>

								<Divider
									orientation="vertical"
									flexItem
									color="#4b00a1"
									sx={{ my: 7 }}
								/>

								<CardContent
									sx={{
										display: "flex",
										flexDirection: "column",
										justifyContent: "center",
										textAlign: "center",
										width: "50%",
									}}
								>
									<CardActionArea>
									{history.favorited ? (
											<IconButton
												size="large"
												sx={icon}
												onClick={() =>
													setUnfavorite(history.id)
												}
											>
												<StarRoundedIcon />

												<Typography
													sx={text}
													variant="caption2"
												>
													Remove from favorites
												</Typography>
											</IconButton>

									) : (
											<IconButton
												size="large"
												sx={icon}
												onClick={() =>
													setAsFavorite(history.id)
												}
											>
												<StarBorderRoundedIcon />
												<Typography
													sx={text}
													variant="caption2"
												>
													Add to favorites
												</Typography>
											</IconButton>
									)}
									</CardActionArea>
								</CardContent>
							</Card>
					))}
				<BottomNav />
			</Container>
		);
    }else{
        return (
			<Container maxWidth={"xs"} sx={{ pt: 3 }}>
				<Card
					elevation={10}
					sx={{
						bgcolor: "#4b00a1",
						mt: 5,

						borderRadius: 4,
					}}
				>
					<CardContent
						sx={{
							textAlign: "center",
							color: "#F2F2F2",
						}}
					>
						<Typography variant="h5" fontWeight={"bolder"}>
							Nothing to see here
						</Typography>
					</CardContent>
				</Card>
				<BottomNav />
			</Container>
		);
    }

}
export default MySongHistory;