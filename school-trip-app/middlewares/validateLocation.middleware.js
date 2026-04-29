import { dmsToDecimal } from "../../scool-trip-ui/my-school-app/src/Utlis/CalculatingAndValidet.js";

export default async function validateLocation(req, res, next) {
    try {
        const { coordinates, time } = req.body;
        if (!coordinates?.latitude || !coordinates?.longitude) {
            return res.status(400).json({ message: "Missing coordinates" });
        }
        const lat = dmsToDecimal(coordinates.latitude);
        const lng = dmsToDecimal(coordinates.longitude);
        if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
            return res.status(400).json({ message: "Invalid coordinates" });
        }      
        req.body._validated = {
            latitude: lat,
            longitude: lng,
            time: new Date(eventTime).toISOString()
        };
        next();
    } catch (err) {
        console.error("Validation error:", err);
        return res.status(500).json({ message: " server error" });
    }
}
