exports.upload = (req, res, next) => {
    res.json({ file: req.file });
};
