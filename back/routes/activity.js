const router = require("express").Router();
const mongoose = require('mongoose');
const passport = require("passport");
const Activity = require("../models/Activity");
const User = require("../models/User");

const HttpError = require("../models/Http-error");
const { check, validationResult } = require("express-validator");

const checkAuth = require('../middleware/check-auth');

//------------------------ GET ALL ACTIVITIES ------------------------------//

router.route("/all")
  .get(async (req, res, next) => {

    let activities;

    try {
      activities = await Activity.find();
    } catch (err) {
      const error = new HttpError('Fetching activities failed, try again.', 500);
      return next(error);
    }

    if (!activities || activities.length === 0) {
      return next(
        new HttpError("There is no activities proposed for the moment.", 404)
      ); //to error handling middleware
    }
    res.json({ activities: activities.map(activity => activity.toObject()) });
  });


//------------------------ GET ACTIVITY BY ID ------------------------------//

router.route("/:aid")
  .get(async (req, res, next) => {
    const activityId = req.params.aid;

    let activity;
    try {
      activity = await Activity.findById(activityId);
    } catch (err) {
      const error = new HttpError('Something went wrong. No activity found.', 500);
      return next(error);
    }

    if (!activity) {
      const error = new HttpError("No activity found for the provided id.", 404);
      return next(error);
    }
    res.json({ activity: activity.toObject({ getters: true }) }); //toObject( {getters: true} ) => permet de retirer le _ de _id
  });

//------------------------ GET ALL ACTIVITIES OF A USER BY ID ------------------------------//

router.route("/user/:uid")
  .get(async (req, res, next) => {
    const userId = req.params.uid;

    let activitiesUser;

    try {
      activitiesUser = await User.findById(userId).populate('activities');

    } catch (err) {
      const error = new HttpError('Fetching activities failed, try again.', 500);
      return next(error);
    }

    if (!activitiesUser || activitiesUser.activities.length === 0) {
      return next(
        new HttpError("No activity found for the provided user id.", 404)
      ); //to error handling middleware
    }
    res.json({ activities: activitiesUser.activities.map(activity => activity.toObject()) });
  });


//------------------------ MIDDLEWARE TOKEN ------------------------------//

router.use(checkAuth);


//------------------------ CREATE A NEW ACTIVITY ------------------------------//

router.route("/")
  .post(
    [
      check("title").isLength({ min: 5, max: 30 }),
      check("description").isLength({ min: 1, max: 150 }),
      check("date").notEmpty(),
      check("location").notEmpty(),
    ],
    async (req, res, next) => {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return next(new HttpError(
          "Invalid inputs passed, please check your data.",
          422)
        );
      }
      const { title, description, location, date, creator } = req.body;
      const createdActivity = new Activity({
        title,
        description,
        date,
        location,
        creator
      });

      let user;

      try {
        user = await User.findById(creator)
      } catch (err) {
        const error = new HttpError('Creating activity failed, try again.', 500);
        return next(error);
      }

      if (!user) {
        const error = new HttpError('User not found for the provided id', 404);
        return next(error);
      }

      //session and transaction to bind activity creation and link to user creator
      try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await createdActivity.save(); // push activity in db --- {session: sess}
        user.activities.push(createdActivity); // "copy" activity to user info
        await user.save(); // push activity to user
        await sess.commitTransaction();
      } catch (err) {
        const error = new HttpError(
          'Creating activity failed, try again.', 500
        );
        return next(error);
      }

      res.status(201).json({ activity: createdActivity });
    }
  );

//------------------------ UPDATE ACTIVITY BY ID ------------------------------//
router.route("/:aid")
  .patch(
    [
      check("title").isLength({ min: 5, max: 30 }),
      check("description").isLength({ min: 1, max: 150 }),
      check("date").notEmpty(),
      check("location").notEmpty(),
    ],
    async (req, res, next) => {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        throw new HttpError("Invalid inputs passed, please check your data.", 422);
      }

      const { title, description, location, date } = req.body;
      const activityId = req.params.aid;

      let activity;
      try {
        activity = await Activity.findById(activityId);
      } catch (err) {
        const error = new HttpError('Something went wrong, try again.', 500);
        return next(error);
      }

      if (activity.creator.toString() !== req.userData.userId) {
        const error = new HttpError('You are not allowed to edit this activity.', 401);
        return next(error);
      }

      activity.title = title;
      activity.description = description;
      activity.location = location;
      activity.date = date;

      try {
        await activity.save();
      } catch (err) {
        const error = new HttpError('Something went wrong, activity not updated.', 500);
        return next(error);
      }

      res.status(200).json({ activity: activity.toObject({ getters: true }) });
    }
  );

//----- DELETE ACTIVITY BY ID ------//

router.route("/:aid")
  .delete(async (req, res, next) => {
    const activityId = req.params.aid;

    let activity;
    try {
      activity = await Activity.findById(activityId).populate('creator');
    } catch (err) {
      const error = new HttpError('Something went wrong, could not delete activity', 500);
      return next(error);
    }

    if (!activity) {
      const error = new HttpError('Could not find activity for this id.', 404);
      return next(error);
    }

    if (activity.creator.id !== req.userData.userId) {
      const error = new HttpError('You are not allowed to delete this activity.', 401);
      return next(error);
    }

    try {
      const sess = await mongoose.startSession();
      sess.startTransaction();
      await activity.remove();
      activity.creator.activities.pull(activity);
      await activity.creator.save();
      await sess.commitTransaction();

    } catch (err) {
      const error = new HttpError('Something went wrong, could not delete activity', 500);
      return next(error);
    }

    res.status(200).json({ message: "Deleted activity." });
  });

module.exports = router;
