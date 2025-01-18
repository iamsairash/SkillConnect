const authAdmin = (req, res, next) => {
  const token = "abc";
  const isAuthorized = token === "abc";
  if (!isAuthorized) {
    res.send("you are unauthorized admin");
  } else {
    next();
  }
};

const authUser = (req, res, next) => {
  const token = "abc";
  const isAuthorized = token === "abc";
  if (!isAuthorized) {
    res.send("you are unauthorized user");
  } else {
    next();
  }
};

module.exports = {
  authAdmin,
  authUser,
};
