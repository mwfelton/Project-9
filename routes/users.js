const express = require('express');
const router = express.Router();

function asyncHandler(cb){
    return async (req,res, next) => {
        try {
            await cb(req, res, next);
        } catch(err) {
            next(err);
        }
    }
}

// A /api/users GET route that will return all properties and values for the currently authenticated User along with a 200 HTTP status code.
router.get('/api/users', asyncHandler(async (req, res)=>{
    res.status(200).send('good morning 5501')
}));


// A /api/users POST route that will create a new user, set the Location header to "/", and return a 201 HTTP status code and no content.
router.post('/api/users', asyncHandler(async (req, res)=>{
    
}));

module.exports = router;
