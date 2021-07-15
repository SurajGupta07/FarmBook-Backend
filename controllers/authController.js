module.exports.signup_get = (req, res) => {
  res.send({success: true, message: 'Signup'});
}

module.exports.login_get = (req, res) => {
  res.send({success: true, message: 'Login'});
}

module.exports.signup_post = (req, res) => {
  let { email, password } = req.body;
  console.log(email, password);
  res.send('new signup')
}

module.exports.login_post = (req, res) => {
  let { email, password } = req.body;
  console.log(email, password);
  res.send('user login');
}