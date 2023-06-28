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
function* fetchMyCurrentSongs(action) {
	try {
		const seshQueue = yield axios.get(`/api/songs/guest/current/${action.payload}`)

		yield put({ type: "SET_MY_CURRENT_SESSION_SONGS", payload: seshQueue.data });
	} catch (error) {
		console.log("myCurrentSongs GET request failed", error);
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


function* postToQueue(action){
    console.log('IN POST TO QUEUE', action.payload);
    try {
		yield axios.post("/api/songs",action.payload);
        yield put({ type: "FETCH_MY_CURRENT_SESSION_SONGS", payload: action.payload.user_id});
	} catch (error) {
		console.log("Queue POST request failed", error);
	}
}

function* deleteFromQueue(action){
    console.log("IN DELETE FROM QUEUE SAGA", action.payload);
    try{
         const getHostId = yield axios.get(
					`/api/songs//guest/requesting/host/user/${action.payload.id}`
				);
                yield axios.delete(`/api/songs/guest/remove/${action.payload.id}`);
                yield put({ type: "FETCH_QUEUE", payload: getHostId.data[0].host_user_id})
                yield put({ type: "FETCH_MY_CURRENT_SESSION_SONGS", payload: action.payload.user_id});
    }catch(error){


    }


}

function* markSongAsCompleted(action){
    console.log("IN MARK SONG AS COMPLETED SAGA", action.payload);
    try {
		yield axios.put(`/api/songs/remove/${action.payload.id}`);
        yield put({ type: "FETCH_QUEUE", payload: action.payload});


	} catch (error) {
		console.log("REMOVE FROM QUEUE REQUEST FAILED", error);
	}
}

function* queueSaga() {
	yield takeLatest("FETCH_QUEUE", fetchQueue);
    yield takeLatest("POST_TO_QUEUE", postToQueue)
    yield takeLatest("FETCH_MY_CURRENT_SESSION_SONGS", fetchMyCurrentSongs)
    yield takeLatest("FETCH_MY_SONG_HISTORY", fetchMySongHistory)
    yield takeLatest("MARK_SONG_AS_COMPLETED", markSongAsCompleted)
    yield takeLatest("DELETE_FROM_MY_QUEUE", deleteFromQueue)
}

export default queueSaga;
