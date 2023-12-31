import React from "react";
import { useDispatch, useSelector } from "react-redux";

function LeaveSessionButton(props) {
	const dispatch = useDispatch();
    const user = useSelector((store) => store.user)
	return (
		<button
			// This button shows up in multiple locations and is styled differently
			// because it's styled differently depending on where it is used, the className
			// is passed to it from it's parents through React props
			className={props.className}
			onClick={() => dispatch({type:'LEAVE_SESSION', payload: {user_id: user.id}})}
		>
			Leave Session
		</button>
	);
}

export default LeaveSessionButton;
