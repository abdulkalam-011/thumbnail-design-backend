const sendAlert = (alert) => (req, res, next) => {
  console.log(req)
  next()
};

export { sendAlert };
