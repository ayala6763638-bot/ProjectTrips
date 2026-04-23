import Schema from "mongoose";

const validateRequest = (Schema) => {
    return (req, res, next) => {
        const { error } = Schema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }
        next();
    };
};
export default validateRequest;
