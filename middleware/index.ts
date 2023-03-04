import ClientSchema from '../models/mongooseModels/Client.model.js'

var middlewareObj: any = {};

middlewareObj.isLoggedIn = function(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  res.status(401).send({level:'info', message:'You are not authorized to perform this action!'});
};

middlewareObj.checkClientOwnerShip = function(req, res, next){
  if(req.isAuthenticated()){
    ClientSchema.findById(req.params.id, function(err, foundClient){
      if(err){
        res.status(404).send({level:'warn', message:'Client not found.'});
      }  else {
        // conditional if user owns campground
        if(foundClient.author.id.equals(req.user._id)) {
          next();
        } else {
          res.status(401).send({level:'warn', message:'You are not authorized to perform this action.'});
        }
      }
    });
  } else {
    res.status(401).send({level:'warn', message:'You are not authorized to perform this action.'});
  }
};

export default middlewareObj;