import axios from "axios";
import { put, takeLatest } from "redux-saga/effects";

// worker Saga: will be fired on "FETCH_QUEUE" actions
function* fetchQueue(action) {
	try {
		const seshQueue = yield axios.get(`/api/songs/host/view/${action.payload}`);

		yield put({ type: "SET_QUEUE", payload: seshQueue.data });
	} catch (error) {
		console.log("Queue GET request failed", error);
	}
}


function* markSongAsCompleted(action) {
	console.log("IN MARK SONG AS COMPLETED SAGA", action.payload);
	try {
		yield axios.put(`/api/songs/remove/${action.payload.id}`);
		yield put({
			type: "FETCH_MY_CURRENT_SESSION_SONGS",
			payload: action.payload.user_id,
		});

		yield put({
			type: "FETCH_QUEUE",
			payload: action.payload.host_user_id,
		});
	} catch (error) {
		console.log("REMOVE FROM QUEUE REQUEST FAILED", error);
	}
}

function* callYoutube(action) {
	console.log("CALL YOUTUBE", action.payload);
	try {
		const search = yield axios.post("/api/yt", action.payload);
		console.log('ytSearch response', search.data);
		// if(search.status === 201){
		yield put({ type: "SONG_FOUND", payload: {loading:false, blurb:"Here's what we found, please choose from the following options.", data:search.data} })
		// yield put({ type: "FETCH_MY_CURRENT_SESSION_SONGS", payload: action.payload.user_id})

		// }
	} catch (error) {
		yield put({ type: "SONG_NOT_FOUND", payload: {loading:true, blurb:"Sorry, we couldn't find the song you were looking for, please try again."}})
		// yield put({ type: "FETCH_MY_CURRENT_SESSION_SONGS", payload: action.payload.user_id});
		console.log("Queue POST request failed", error);
	}
}

function* postToQueue(action){
		console.log("IN POST TO QUEUE", action.payload);

	try {
		yield axios.post('/api/songs', action.payload)
		yield put({ type: "FETCH_MY_CURRENT_SESSION_SONGS", payload: action.payload.user_id})


	} catch (error) {
		console.log('ERROR POSTING TO QUEUE', error);

	}

}


function* fetchMyCurrentSongs(action) {
	try {
		const seshQueue = yield axios.get(`/api/songs/guest/current/${action.payload}`)

		yield put({ type: "SET_MY_CURRENT_SESSION_SONGS", payload: seshQueue.data });
	} catch (error) {
		console.log("myCurrentSongs GET request failed", error);
	}
}


function* deleteFromMyQueue(action) {
	console.log("IN DELETE FROM MY QUEUE SAGA", action.payload);
	try {
		const getHostId = yield axios.get(
			`/api/songs/guest/requesting/host/user/${action.payload.id}`
		);
		yield axios.delete(`/api/songs/guest/remove/${action.payload.id}`);
		yield put({
			type: "FETCH_QUEUE",
			payload: getHostId.data[0].host_user_id,
		});
		yield put({
			type: "FETCH_MY_CURRENT_SESSION_SONGS",
			payload: action.payload.user_id,
		});
	} catch (error) {
		console.log("ERROR REMOVING FROM MY QUEUE", error);
	}
}


function* fetchMySongHistory(action) {
	try {
		const seshQueue = yield axios.get(`/api/songs/guest/all/history/${action.payload}`)
		yield put({ type: "SET_MY_SONG_HISTORY", payload: seshQueue.data });
	} catch (error) {
		console.log("mySongHistory GET request failed", error);
	}
}
function* fetchMyFavorites(action) {
	console.log('FETCH MY FAVORITES', action.payload);
	try {
		const seshQueue = yield axios.get(`/api/songs/guest/favorites/history/${action.payload}`)
		yield put({ type: "SET_MY_FAVORITES", payload: seshQueue.data });
	} catch (error) {
		console.log("myFavorites GET request failed", error);
	}
}

function* setSongAsFavorite(action){
    try{
        yield axios.put(`/api/songs/guest/set/song/favorite/${action.payload.songId}`)
        yield put({type:'FETCH_MY_SONG_HISTORY', payload: action.payload.userId})

    }catch(error){
                console.log("ERROR FAVORITING", error);
    }
}


function* unfavoriteSong(action) {
	try {
        yield axios.put(`/api/songs/guest/set/song/unfavorite/${action.payload.songId}`)
        yield put({type:'FETCH_MY_SONG_HISTORY', payload: action.payload.userId})
	} catch (error) {
        console.log('ERROR UNFAVORITING', error);
    }
}


function* queueSaga() {
	yield takeLatest("FETCH_QUEUE", fetchQueue);
    yield takeLatest("SEARCH_YOUTUBE", callYoutube)
	yield takeLatest('POST_TO_QUEUE', postToQueue)
    yield takeLatest("FETCH_MY_CURRENT_SESSION_SONGS", fetchMyCurrentSongs)
    yield takeLatest("FETCH_MY_SONG_HISTORY", fetchMySongHistory)
    yield takeLatest("FETCH_MY_FAVORITES", fetchMyFavorites)
    yield takeLatest("MARK_SONG_AS_COMPLETED", markSongAsCompleted)
    yield takeLatest("DELETE_FROM_MY_QUEUE", deleteFromMyQueue)
    yield takeLatest("MAKE_FAVORITE", setSongAsFavorite)
    yield takeLatest("MAKE_UNFAVORITE", unfavoriteSong)
}

export default queueSaga;
