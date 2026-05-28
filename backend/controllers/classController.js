const Class = require("../models/classModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("../middleware/catchAsyncError");
const ApiFeatures = require("../utils/apiFeatures");
const cloudinary = require("cloudinary");

// Create Class -- Admin
exports.createClass = catchAsyncError(async (req, res, next) => {
  // Parse schedule from flat form-data keys
  if (req.body["schedule[day]"]) {
    req.body.schedule = {
      day: req.body["schedule[day]"],
      time: req.body["schedule[time]"],
      duration: Number(req.body["schedule[duration]"]),
    };
    delete req.body["schedule[day]"];
    delete req.body["schedule[time]"];
    delete req.body["schedule[duration]"];
  }

  const imagesLinks = [];

  // Handle file uploads from Postman (File type)
  if (req.files && req.files.images) {
    const files = Array.isArray(req.files.images)
      ? req.files.images
      : [req.files.images];

    for (const file of files) {
      const b64 = `data:${file.mimetype};base64,${file.data.toString("base64")}`;
      const result = await cloudinary.v2.uploader.upload(b64, {
        folder: "gym_classes",
      });
      imagesLinks.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    }
  }

  req.body.images = imagesLinks;
  req.body.user = req.user.id;

  const gymClass = await Class.create(req.body);

  res.status(201).json({
    success: true,
    gymClass,
  });
});

// Get All Classes
exports.getAllClasses = catchAsyncError(async (req, res, next) => {
  const resultPerPage = 8;
  const classesCount = await Class.countDocuments();

  const apiFeature = new ApiFeatures(
    Class.find().populate("trainer", "name specialization avatar"),
    req.query,
  )
    .search()
    .filter();

  let classes = await apiFeature.query.clone(); // ← add .clone()
  let filteredClassesCount = classes.length;

  apiFeature.pagination(resultPerPage);
  classes = await apiFeature.query.clone(); // ← add .clone()

  res.status(200).json({
    success: true,
    classes,
    classesCount,
    resultPerPage,
    filteredClassesCount,
  });
});

// Get All Classes (Admin)
exports.getAdminClasses = catchAsyncError(async (req, res, next) => {
  const classes = await Class.find().populate("trainer", "name specialization");

  res.status(200).json({
    success: true,
    classes,
  });
});

// Get Class Details
exports.getClassDetails = catchAsyncError(async (req, res, next) => {
  const gymClass = await Class.findById(req.params.id).populate(
    "trainer",
    "name specialization bio avatar experience",
  );

  if (!gymClass) {
    return next(new ErrorHandler("Class not found", 404));
  }

  res.status(200).json({
    success: true,
    gymClass,
  });
});

// Update Class -- Admin
exports.updateClass = catchAsyncError(async (req, res, next) => {
  let gymClass = await Class.findById(req.params.id);

  if (!gymClass) {
    return next(new ErrorHandler("Class not found", 404));
  }

  // Images Start Here
  let images = [];

  if (typeof req.body.images === "string") {
    images.push(req.body.images);
  } else {
    images = req.body.images;
  }

  if (images !== undefined) {
    // Deleting Images From Cloudinary
    for (let i = 0; i < gymClass.images.length; i++) {
      await cloudinary.v2.uploader.destroy(gymClass.images[i].public_id);
    }

    const imagesLinks = [];

    for (let i = 0; i < images.length; i++) {
      const result = await cloudinary.v2.uploader.upload(images[i], {
        folder: "gym_classes",
      });

      imagesLinks.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    }

    req.body.images = imagesLinks;
  }

  gymClass = await Class.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    gymClass,
  });
});

// Delete Class
exports.deleteClass = catchAsyncError(async (req, res, next) => {
  const gymClass = await Class.findById(req.params.id);

  if (!gymClass) {
    return next(new ErrorHandler("Class not found", 404));
  }

  // Deleting Images From Cloudinary
  for (let i = 0; i < gymClass.images.length; i++) {
    await cloudinary.v2.uploader.destroy(gymClass.images[i].public_id);
  }

  await Class.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    message: "Class Deleted Successfully",
  });
});

// Create New Review or Update the review
exports.createClassReview = catchAsyncError(async (req, res, next) => {
  const { rating, comment, classId } = req.body;

  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };

  const gymClass = await Class.findById(classId);

  if (!gymClass) {
    return next(new ErrorHandler("Class not found", 404));
  }

  const isReviewed = gymClass.reviews.find(
    (rev) => rev.user.toString() === req.user._id.toString(),
  );

  if (isReviewed) {
    gymClass.reviews.forEach((rev) => {
      if (rev.user.toString() === req.user._id.toString())
        ((rev.rating = Number(rating)), (rev.comment = comment));
    });
  } else {
    gymClass.reviews.push(review);
    gymClass.numofReviews = gymClass.reviews.length;
  }

  let avg = 0;

  gymClass.reviews.forEach((rev) => {
    avg += rev.rating;
  });

  gymClass.ratings = avg / gymClass.reviews.length;

  await gymClass.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
  });
});

// Get All Reviews of a class
exports.getClassReviews = catchAsyncError(async (req, res, next) => {
  const gymClass = await Class.findById(req.query.id);

  if (!gymClass) {
    return next(new ErrorHandler("Class not found", 404));
  }

  res.status(200).json({
    success: true,
    reviews: gymClass.reviews,
  });
});

// Delete Review
exports.deleteReview = catchAsyncError(async (req, res, next) => {
  const gymClass = await Class.findById(req.query.classId);

  if (!gymClass) {
    return next(new ErrorHandler("Class not found", 404));
  }

  const reviews = gymClass.reviews.filter(
    (rev) => rev._id.toString() !== req.query.id.toString(),
  );

  let avg = 0;
  reviews.forEach((rev) => {
    avg += rev.rating;
  });

  let ratings = 0;
  if (reviews.length === 0) {
    ratings = 0;
  } else {
    ratings = avg / reviews.length;
  }

  const numofReviews = reviews.length;

  await Class.findByIdAndUpdate(
    req.query.classId,
    {
      reviews,
      ratings,
      numofReviews,
    },
    {
      new: true,
      runValidators: true,
    },
  );

  res.status(200).json({
    success: true,
  });
});

// Update capacity (called when membership goes Active)
async function updateCapacity(id, qty) {
  const gymClass = await Class.findById(id);
  if (qty > gymClass.capacity) {
    throw new Error(
      `Cannot reduce capacity below zero for class ${gymClass.name}`,
    );
  }
  gymClass.capacity -= qty;
  await gymClass.save({ validateBeforeSave: false });
}

module.exports.updateCapacity = updateCapacity;
