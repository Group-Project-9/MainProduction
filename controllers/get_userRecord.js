import errorHandler from "../utils/error.js";
import Record from "../models/record_model.js";
import bcrypt from "bcrypt";
import User from "../models/user_model.js";

export const getUserRecord = async (req, res) => {
    const email = req.query.email;
    
    try {
        const userRecord = await Record.find({email: email});
        if (!userRecord) {
            res.status(404).json({
                message: "Record not found."
            });
        }
        res.status(200).json(userRecord);

    } catch (err) {
        next(err);
    }
};

export const deleteUserRecord = async (req, res, next) => {
    const recordId = req.body._id;

    try {
        const result = await Record.deleteOne({ _id: recordId });
        if (result.deletedCount > 0) {

            res.status(200).json({ success: true, message: "Record deleted successfully" });
            
        } else {
            
            console.log("Record not found.");
            res.status(404).json({ success: false, message: "Record not found" });
        }

    } catch (err) {
        next(err);
    }
};

export const updateUserInfo = async (req, res, next) => {
    // console.log(req.body);
    // console.log(req.params.id);
    if (req.user._id !== req.params.id) return next(errorHandler(401, "Access denied."));
    try {
        if (req.body.password) {
            req.body.password =  bcrypt.hashSync(req.body.password, 10);
        }

        const updateUser = await User.findByIdAndUpdate(req.params.id, {
            $set: {
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                email: req.body.email,
                gender: req.body.gender,
                weight: req.body.weight,
                height: req.body.height,
                password: req.body.password,
                avatar: req.body.avatar
            }
        }, {new: true});

        const {password, ...other} = updateUser._doc;
        res.status(200).json(other);

    } catch (error) {
        next(error);
    }
}