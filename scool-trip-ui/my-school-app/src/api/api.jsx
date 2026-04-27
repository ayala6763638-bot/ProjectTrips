import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000',
});

const getAuthConfig = (teacherId) => ({
    headers: { 'teacher-id': teacherId }
});

export const loginStudent = (Credentials) => {
    return api.post('students/login', Credentials);
};

export const loginTeacher = (Credentials) => {
    return api.post('teachers/login', Credentials);
}

export const registerTeacher = (teacher) => {
    return api.post('teachers/add', teacher);
};

export const addstudent = (student, teacherId) => {
    return api.post('students/add', student, getAuthConfig(teacherId));
};

export const getAllStudents = (teacherId) => {
    return api.get('students/all', getAuthConfig(teacherId)
    )
};

export const getstudentsByClass = (className, teacherId) => {
    return api.get(`students/class/${className}`, getAuthConfig(teacherId));
};

export const addStudentLocation = (id, location) => {
    return api.post(`students/update-location/${id}`, { coordinates: location });
};

export const addteacherLocation = (id, location) => {
    return api.post(`teachers/update-location/${id}`, { coordinates: location });
};

export const getmyclass= (teacherId) => {
    return api.get('students/my-class', getAuthConfig(teacherId));
};

export const getteacherlocation = (teacherId) => {
    return api.get('teachers/my-location', getAuthConfig(teacherId));
};

export const getstudentindangeroues = (teacherId) => {
    return api.get('students/in-danger', 
        {
            params: { teacherId },
            headers: { 'teacher-id': teacherId }
        }
    );
};



