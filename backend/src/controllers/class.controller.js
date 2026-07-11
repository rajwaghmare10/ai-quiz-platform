const classService =
require("../services/class.service");

const createClass = async (
  req,
  res
) => {

  try {

    const teacherId =
      req.user.userId;

    const { className, description} = req.body;

    const newClass = await classService.createClass({
        teacherId,
        className,
        description
      });

    return res.status(201).json({
      success: true,
      data: newClass
    });

  } catch (error) {

    return res.status(400).json({
      success: false,
      message: error.message
    });

  }
};


const getMyClasses =
async (req, res) => {

    try {

        const classes =
            await classService
                .getMyClasses(
                    req.user.userId
                );

        return res.status(200).json({
            success: true,
            data: classes
        });

    } catch (error) {

        return res.status(400).json({
            success: false,
            message: error.message
        });

    }
};

const joinClass =
async (req, res) => {

    try {
        console.log("BODY:", req.body);
        console.log("USER:", req.user);
        const result =
            await classService.joinClass(
                req.body.classCode,
                req.user.userId
            );
        return res.status(201).json({
            success: true,
            data: result
        });

    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

const getJoinedClasses = async (
    req,
    res
) => {

    try {

        const classes =
            await classService
                .getJoinedClasses(
                    req.user.userId
                );

        return res.status(200).json({
            success: true,
            data: classes
        });

    } catch (error) {

        return res.status(400).json({
            success: false,
            message: error.message
        });

    }
};

const getClassDetails = async (
    req,
    res
) => {

    try {

        const data =
            await classService
                .getClassDetails(
                    req.params.classId
                );

        return res.status(200).json({
            success: true,
            data
        });

    } catch (error) {

        return res.status(404).json({
            success: false,
            message: error.message
        });

    }
};

const getClassStudents = async (req, res) => {
  try {
    const students = await classService.getClassStudents(
      req.params.classId,
      req.user.userId,
      req.user.role
    );
    return res.status(200).json({ success: true, data: students });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

const deleteClass = async (req, res) => {
  try {
    await classService.deleteClass(req.params.classId, req.user.userId);
    return res.status(200).json({
      success: true,
      message: "Class deleted successfully"
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

const leaveClass = async (req, res) => {
  try {
    await classService.leaveClass(req.params.classId, req.user.userId);
    return res.status(200).json({
      success: true,
      message: "Left class successfully"
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  createClass,
  getMyClasses,
  joinClass,
  getJoinedClasses,
  getClassDetails,
  getClassStudents,
  deleteClass,
  leaveClass
};