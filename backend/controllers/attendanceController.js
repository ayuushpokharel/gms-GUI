const Attendance = require("../models/attendanceModel");
const ClassSession = require("../models/classSessionModel");
const Membership = require("../models/membershipModel");
const Class = require("../models/classModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncError");

const DAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

// Midnight UTC for "today", used as the dedupe key for ClassSession.date
const startOfToday = () => {
  const d = new Date();
  d.setUTCHours(0, 0, 0, 0);
  return d;
};

// Does a class's weekly schedule occur today?
const scheduleMatchesToday = (scheduleDay) => {
  const todayName = DAY_NAMES[new Date().getDay()];
  const weekday = !["Saturday", "Sunday"].includes(todayName);
  if (scheduleDay === "Daily") return true;
  if (scheduleDay === "Weekdays") return weekday;
  if (scheduleDay === "Weekends") return !weekday;
  return scheduleDay === todayName;
};

// Get the distinct classes the logged-in user is currently enrolled in
// (via any of their memberships, active or not — schedule/history checks
// are done on top of this list where needed)
const getEnrolledClassIds = async (userId) => {
  const memberships = await Membership.find({ user: userId });
  const classIds = new Set();
  memberships.forEach((m) =>
    m.enrolledClasses.forEach((c) => classIds.add(c.gymClass.toString())),
  );
  return [...classIds];
};

// Get today's check-in options — GET /api/v1/attendance/today
exports.getTodayCheckinOptions = catchAsyncErrors(async (req, res, next) => {
  const classIds = await getEnrolledClassIds(req.user._id);

  if (classIds.length === 0) {
    return res.status(200).json({ success: true, classes: [] });
  }

  const classes = await Class.find({ _id: { $in: classIds } });
  const todaysClasses = classes.filter((c) =>
    scheduleMatchesToday(c.schedule.day),
  );

  const today = startOfToday();
  const options = await Promise.all(
    todaysClasses.map(async (c) => {
      const session = await ClassSession.findOne({
        gymClass: c._id,
        date: today,
      });

      let alreadyCheckedIn = false;
      if (session) {
        const attendance = await Attendance.findOne({
          user: req.user._id,
          classSession: session._id,
        });
        alreadyCheckedIn = !!attendance;
      }

      return {
        classId: c._id,
        name: c.name,
        time: c.schedule.time,
        day: c.schedule.day,
        alreadyCheckedIn,
      };
    }),
  );

  res.status(200).json({ success: true, classes: options });
});

// Self check-in — POST /api/v1/attendance/checkin
exports.checkIn = catchAsyncErrors(async (req, res, next) => {
  const { classId } = req.body;

  if (!classId) {
    return next(new ErrorHandler("Please select a class", 400));
  }

  const classIds = await getEnrolledClassIds(req.user._id);
  if (!classIds.includes(classId)) {
    return next(new ErrorHandler("You are not enrolled in this class", 403));
  }

  const gymClass = await Class.findById(classId);
  if (!gymClass) {
    return next(new ErrorHandler("Class not found", 404));
  }

  if (!scheduleMatchesToday(gymClass.schedule.day)) {
    return next(new ErrorHandler("This class is not scheduled for today", 400));
  }

  const today = startOfToday();

  // Find or create today's session for this class
  let session = await ClassSession.findOne({ gymClass: classId, date: today });
  if (!session) {
    session = await ClassSession.create({
      gymClass: classId,
      date: today,
      startTime: gymClass.schedule.time,
    });
  }

  try {
    const attendance = await Attendance.create({
      user: req.user._id,
      classSession: session._id,
      gymClass: classId,
      className: gymClass.name,
      date: today,
    });

    res.status(201).json({ success: true, attendance });
  } catch (error) {
    if (error.code === 11000) {
      return next(new ErrorHandler("You already checked in today", 400));
    }
    return next(error);
  }
});

// Compute streak / heatmap / breakdown from a set of attendance records
const computeStats = (records) => {
  // Unique calendar days present, most recent first
  const dayStrings = [
    ...new Set(records.map((r) => r.date.toISOString().slice(0, 10))),
  ].sort((a, b) => (a < b ? 1 : -1));

  let streak = 0;
  if (dayStrings.length > 0) {
    const cursor = new Date();
    cursor.setUTCHours(0, 0, 0, 0);

    // Streak counts from today (or yesterday, if not yet checked in today)
    let idx = 0;
    if (dayStrings[0] !== cursor.toISOString().slice(0, 10)) {
      cursor.setUTCDate(cursor.getUTCDate() - 1);
    }
    while (
      idx < dayStrings.length &&
      dayStrings[idx] === cursor.toISOString().slice(0, 10)
    ) {
      streak += 1;
      idx += 1;
      cursor.setUTCDate(cursor.getUTCDate() - 1);
    }
  }

  const heatmap = {};
  records.forEach((r) => {
    const key = r.date.toISOString().slice(0, 10);
    heatmap[key] = (heatmap[key] || 0) + 1;
  });

  const classBreakdown = {};
  records.forEach((r) => {
    classBreakdown[r.className] = (classBreakdown[r.className] || 0) + 1;
  });

  const now = new Date();
  const weekAgo = new Date(now);
  weekAgo.setDate(weekAgo.getDate() - 7);
  const sessionsThisWeek = records.filter((r) => r.date >= weekAgo).length;

  return {
    totalSessions: records.length,
    streak,
    sessionsThisWeek,
    heatmap,
    classBreakdown,
  };
};

// Get my attendance — GET /api/v1/attendance/me
exports.getMyAttendance = catchAsyncErrors(async (req, res, next) => {
  const records = await Attendance.find({ user: req.user._id }).sort({
    date: -1,
  });

  res.status(200).json({
    success: true,
    records,
    stats: computeStats(records),
  });
});

// Admin: get a user's attendance — GET /api/v1/admin/attendance/:userId
exports.getUserAttendanceAdmin = catchAsyncErrors(async (req, res, next) => {
  const records = await Attendance.find({ user: req.params.userId }).sort({
    date: -1,
  });

  res.status(200).json({
    success: true,
    records,
    stats: computeStats(records),
  });
});
