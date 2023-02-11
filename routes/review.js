const route = require("express").Router();
const Review = require("../db/models/reviews");
const User = require("../db/models/users");
const Company = require("../db/models/company");



route.post("/submit-review", async(req, resp)=>{
    let review = new Review(req.body.data)
    await User.findByIdAndUpdate(req.body.id.user_id,{ $push: { user_reviews: req.body.data } })
    await Company.findByIdAndUpdate(req.body.id.company_id,{ $push: { company_reviews: req.body.data } })
    await review.save()
    resp.end()
})




module.exports = route;