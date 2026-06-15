const uploadExcelQuestions =
async (
    req,
    res
) => {

    try {

        console.log(req.file);

        return res.status(200).json({
            success: true,
            message:
                "File uploaded successfully"
        });

    } catch (error) {

        return res.status(400).json({
            success: false,
            message:
                error.message
        });

    }

};

module.exports = {
    uploadExcelQuestions
};