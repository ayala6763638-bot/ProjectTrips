import React, { createContext, useContext, useReducer, useEffect, useCallback, useRef } from "react";
import { usesocket } from "./socketContext";
import { getmyclass, getstudentindangeroues, addStudentLocation, addteacherLocation } from "../api/api";
import { isLocationValid } from "../Utlis/CalculatingAndValidet.js";
const AppStateContext = createContext(null);

const initialState = {
    students: [],
    teacherLocation: null,
    studentsInDanger: [],
};

export const ACTIONS = {
    SET_STUDENTS: "SET_STUDENTS",
    UPDATE_STUDENT: "UPDATE_STUDENT",
    SET_TEACHER_LOCATION: "SET_TEACHER_LOCATION",
    SET_STUDENTS_IN_DANGER: "SET_STUDENTS_IN_DANGER",
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
    const stat1 = useRef(state);
    useEffect(() => {
        stat1.current = state;
    }, [state]);
    const getClassData = useCallback(async (teacherId) => {
        if (!teacherId)
            return;
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
        if (!socket)
            return;
        const onStudentUpdated = async (updatedStudent) => {
            const locationStudent = stat1.current.students.find(s => s.id == updatedStudent.id);
            const prevLocation = locationStudent?.lastLocation?.coordinates;

            // Validate location update before dispatching
            if (!isLocationValid(updatedStudent.lastLocation.coordinates, prevLocation)) {
                sendValidationFailedMessage("not corrrect Location update for the student" + updatedStudent.id);
                return;
            }

            dispatch({ type: ACTIONS.UPDATE_STUDENT, payload: updatedStudent });
            if (updatedStudent?.id && updatedStudent?.lastLocation?.coordinates) {
                try {
                    await addStudentLocation(updatedStudent.id, updatedStudent.lastLocation.coordinates);
                } catch (err) {
                    console.error("addStudentLocation error:", err);
                };
            }
        };

        const sendValidationFailedMessage = (message) => {
            console.warn(message);
            // emit
        }

        const onTeacherUpdated = (updateTeacher) => {
            const prevLocation = stat1.current.teacherLocation?.lastLocation?.coordinates;
            if (!isLocationValid(updateTeacher.lastLocation.coordinates, prevLocation)) {
                console.warn("not corrrect Location update for the teacher");
                return;
            }
            dispatch({ type: ACTIONS.SET_TEACHER_LOCATION, payload: updateTeacher });
            if (updateTeacher?.id && updateTeacher?.lastLocation?.coordinates) {
                try {
                    addteacherLocation(updateTeacher.id, updateTeacher.lastLocation.coordinates);
                } catch (err) {
                    console.error("addteacherLocation error:", err);
                };
            }
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

export const useAppState = () => {
    const ctx = useContext(AppStateContext);
    if (!ctx) throw new Error("useAppState must be used within AppStateProvider");
    return ctx;
};


