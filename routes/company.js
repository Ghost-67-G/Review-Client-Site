const route = require("express").Router();
const Company = require("../db/models/company");
const multer = require('multer')
const fs = require('file-system')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let path = './upload/' + req.body.company_name;
        fs.mkdir(path, (err) => {
            cb(null, path)
        })
      cb(null, 'upload')
  },
  filename: function (req, file, cb) {
      cb(null, file.originalname)
  }
})
let upload = multer({ storage: storage })



route.post("/add-company", upload.single('company_logo'),async(req, resp) => {
  console.log(req.body)
  let company = new Company(req.body);
  await company.save();
  resp.json({
    success: true,
  });
});

route.delete('/delete-company',async(req,resp)=>{
  await Company.findByIdAndDelete(req.query.id)
  resp.json({success:true})
})


route.get('/for-update-company',async(req,resp)=>{
  let company = await Company.findById(req.query.id)
  resp.json({company})
})
route.put('/update-company',upload.single('company_logo'),async(req,resp)=>{
  await Company.findByIdAndUpdate(req.body._id,req.body)
  resp.json({success:true})
})


route.get('/get-companies',async(req,resp)=>{
  let companies = await Company.find()
  resp.json({companies})
})

route.get("/get-company", async(req,resp)=>{
  let company = await Company.findById(req.query.id)
  resp.json({company})
})

module.exports = route;
