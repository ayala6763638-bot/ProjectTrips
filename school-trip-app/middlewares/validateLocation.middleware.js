import studentModel from "../models/student.model.js";
import teacherModel from "../models/teacher.model.js";
import distinationlocation from "../calculateDistance/calculateDistance.js";

function isEmptyString(s) {
    return s === undefined || s === null || String(s).trim() === "";
}
function numericString(s) {
    return /^[0-9]+$/.test(String(s));
}
function dmsToDecimal(dms) {
    if (!dms) 
        return NaN;
    const deg = parseFloat(dms.degrees) || 0;
    const min = parseFloat(dms.minutes) || 0;
    const sec = parseFloat(dms.seconds) || 0;
    return deg + (min / 60) + (sec / 3600);
}
async function findEntityById(id) {
    if (!id) return null;
    let e = await studentModel.findOne({ id: id });
    if (e) return e;
    e = await teacherModel.findOne({ id: id });
    return e;
}

export default async function validateLocation(req, res, next) {
    try {
        const coordinates = req.body.coordinates;
        const timeRaw = req.body.time || (req.body.lastLocation && req.body.lastLocation.time) || req.body.timestamp;

        if (!coordinates) return res.status(400).json({ message: "coordinates missing" });

        const latDMS = coordinates.latitude;
        const lngDMS = coordinates.longitude;
        if (!latDMS || !lngDMS) return res.status(400).json({ message: "latitude or longitude missing" });
        const parts = [
            { name: "latitude.degrees", v: latDMS.degrees },
            { name: "latitude.minutes", v: latDMS.minutes },
            { name: "latitude.seconds", v: latDMS.seconds },
            { name: "longitude.degrees", v: lngDMS.degrees },
            { name: "longitude.minutes", v: lngDMS.minutes },
            { name: "longitude.seconds", v: lngDMS.seconds },
        ];
        for (const p of parts) {
            if (isEmptyString(p.v)) {
                return res.status(400).json({ message: `field ${p.name} is empty` });
            }
            if (!numericString(p.v)) {
                return res.status(400).json({ message: `field ${p.name} must be numeric` });
            }
        }
        const latMin = parseInt(latDMS.minutes, 10);
        const latSec = parseInt(latDMS.seconds, 10);
        const lngMin = parseInt(lngDMS.minutes, 10);
        const lngSec = parseInt(lngDMS.seconds, 10);
        if (latMin < 0 || latMin >= 60 || latSec < 0 || latSec >= 60 ||
            lngMin < 0 || lngMin >= 60 || lngSec < 0 || lngSec >= 60) {
            return res.status(400).json({ message: "minutes/seconds must be between 0 and 59" });
        }
        const lat = dmsToDecimal(latDMS);
        const lng = dmsToDecimal(lngDMS);
        if (!isFinite(lat) || !isFinite(lng))
             return res.status(400).json({ message: "invalid numeric coordinates" });
        if (lat < -90 || lat > 90 || lng < -180 || lng > 180) 
            return res.status(400).json({ message: "latitude/longitude out of range" });
        const t = timeRaw ? Date.parse(timeRaw) : Date.now();
        if (isNaN(t)) 
            return res.status(400).json({ message: "invalid time format" });
        if (t - Date.now() > 1000 * 60 * 5)
             return res.status(400).json({ message: "time too far in the future" });
        const id = req.params.id;
        if (id) {
            const entity = await findEntityById(id);
            if (entity && entity.lastLocation && entity.lastLocation.coordinates) {
                const prevCoords = entity.lastLocation.coordinates;
                const prevLat = dmsToDecimal(prevCoords.latitude);
                const prevLng = dmsToDecimal(prevCoords.longitude);
                const prevTime = entity.lastLocation.time ? new Date(entity.lastLocation.time).getTime() : 0;
                if (prevTime && t <= prevTime) {
                    return res.status(400).json({ message: "incoming timestamp is older or equal to stored timestamp" });
                }

                if (isFinite(prevLat) && isFinite(prevLng) && prevTime) {
                    const km = distinationlocation(prevLat, prevLng, lat, lng);
                    const timeHours = Math.max((t - prevTime) / (1000 * 60 * 60), 1 / 3600); // at least 1 sec to avoid div0
                    if (km > 500) { 
                        return res.status(400).json({ message: "location jump too large", jumpKm: km });
                    }
                }
            }
        }

        // attach validated values
        req.body._validated = {
            latitude: lat,
            longitude: lng,
            time: new Date(t).toISOString()
        };
        return next();
    } catch (err) {
        console.error("validateLocation error:", err);
        return res.status(500).json({ message: "server error in validateLocation" });
    }
}