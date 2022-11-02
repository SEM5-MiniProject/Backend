const checkauth = (req, res, next) => {
  if(req.persist === false){
    return next();
  }else{
    res.redirect('/dashboard');
  }
}
const checknotauth = (req, res, next) => {
  if(req.persist === false){
    res.redirect('/signin');
  }else{
    return next();
  }
}
module.exports = {checkauth, checknotauth};
