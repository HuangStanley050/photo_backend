exports.upload = (req, res, next) => {
  console.log(req.user);
  res.json({ file: req.file.originalname });
};
