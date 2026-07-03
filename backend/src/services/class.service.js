const classRepository =
require("../repositories/class.repository");

const createClass = async ({
  teacherId,
  className,
  description
}) => {

  // Generate simple class code
  const classCode =
    Math.random()
      .toString(36)
      .substring(2, 8)
      .toUpperCase();

  const newClass =
    await classRepository.createClass({
      teacherId,
      className,
      classCode,
      description
    });

  return newClass;
};

const getMyClasses = async (teacherId) => {
    const classes =
        await classRepository
            .getClassesByTeacherId(
                teacherId
            );

    return classes;
};

const joinClass =
async (
    classCode,
    studentId
) => {

    const foundClass =
        await classRepository
            .findClassByCode(
                classCode
            );

    if (!foundClass) {
        throw new Error(
            "Invalid class code"
        );
    }

    const existingMember =
        await classRepository
            .isStudentAlreadyJoined(
                foundClass.class_id,
                studentId
            );

    if (existingMember) {
        throw new Error(
            "Already joined class"
        );
    }

    return await classRepository
        .joinClass(
            foundClass.class_id,
            studentId
        );
};

const getJoinedClasses = async (
    studentId
) => {

    return await classRepository
        .getJoinedClasses(
            studentId
        );
};

const getClassDetails = async (
    classId
) => {

    const foundClass =
        await classRepository
            .getClassDetails(
                classId
            );

    if (!foundClass) {
        throw new Error(
            "Class not found"
        );
    }

    return foundClass;
};

const getClassStudents = async (classId) => {
  return await classRepository.getClassStudents(classId);
};

module.exports = {
  createClass,
  getMyClasses,
  joinClass,
  getJoinedClasses,
  getClassDetails,
  getClassStudents
};