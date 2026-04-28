import React, { createContext, useReducer, useEffect, useCallback, useRef } from "react";
import { usesocket } from "./socketContext";
import { getmyclass, getstudentindangeroues } from "../api/api";
import { isLocationValid } from "../Utlis/CalculatingAndValidet.js";
import { ACTIONS } from "./constants.js";

export const AppStateContext = createContext(null);

const initialState = {
    students: [],
    teacherLocation: null,
    studentsInDanger: [],
};

function reducer(state, action) {
    switch (action.type) {
        case ACTIONS.SET_STUDENTS:
            return { ...state, students: action.payload };
        case ACTIONS.UPDATE_STUDENT: {
            const updated = action.payload;
            const students = state.students.map(s => (s.id === updated.id ? updated : s));
            const exists = state.students.some(s => s.id === updated.id);
            return { ...state, students: exists ? students : [...state.students, updated] };
        }
        case ACTIONS.SET_TEACHER_LOCATION:
            return { ...state, teacherLocation: action.payload };
        case ACTIONS.SET_STUDENTS_IN_DANGER:
            return { ...state, studentsInDanger: action.payload };
        default:
            return state;
    }
}

export const AppStateProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const socket = usesocket();
    const stateRef = useRef(state);

    useEffect(() => {
        stateRef.current = state;
    }, [state]);

    const getClassData = useCallback(async (teacherId) => {
        if (!teacherId) return;
        try {
            const res = await getmyclass(teacherId);
            const dangerRes = await getstudentindangeroues(teacherId);
            dispatch({ type: ACTIONS.SET_STUDENTS, payload: res.data.students });
            dispatch({ type: ACTIONS.SET_TEACHER_LOCATION, payload: res.data.teacher });
            dispatch({ type: ACTIONS.SET_STUDENTS_IN_DANGER, payload: dangerRes.data });
        } catch (err) {
            console.error("getClassData error:", err);
        }
    }, [dispatch]);

    useEffect(() => {
        if (!socket) return;
        const onStudentUpdated = (updatedStudent) => {
            const locationStudent = stateRef.current.students.find(s => s.id == updatedStudent.id);
            const prevLocation = locationStudent?.lastLocation?.coordinates;
            if (!isLocationValid(updatedStudent.lastLocation.coordinates, prevLocation)) {
                return;
            }
            dispatch({ type: ACTIONS.UPDATE_STUDENT, payload: updatedStudent });
        };

        const onTeacherUpdated = (updatedTeacher) => {
            const prevLocation = stateRef.current.teacherLocation?.lastLocation?.coordinates;
            if (!isLocationValid(updatedTeacher.lastLocation.coordinates, prevLocation)) {
                return;
            }
            dispatch({ type: ACTIONS.SET_TEACHER_LOCATION, payload: updatedTeacher });
        };

        socket.on("studentLocationUpdated", onStudentUpdated);
        socket.on("teacherLocationInUpdate", onTeacherUpdated);

        return () => {
            socket.off("studentLocationUpdated", onStudentUpdated);
            socket.off("teacherLocationInUpdate", onTeacherUpdated);
        };
    }, [socket]);

    return (
        <AppStateContext.Provider value={{ state, dispatch, getClassData }}>
            {children}
        </AppStateContext.Provider>
    );
};
