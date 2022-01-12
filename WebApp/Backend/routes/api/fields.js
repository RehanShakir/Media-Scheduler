import express from "express";
import _ from "lodash";
import cloudinary from "cloudinary";

cloudinary.v2;

const router = express.Router();
import fieldModel from "../../models/feild.js";
cloudinary.config({
  cloud_name: process.env.CLOUDNAME,
  api_key: process.env.APIKEY,
  api_secret: process.env.APISECRET,
});

router.get("/", async (req, res) => {
  try {
    let field = await fieldModel.find();
    return res.send(field);
  } catch (err) {
    console.log(err);
  }
});

router.post("/saveField", async (req, res) => {
  try {
    const file = req.files.photo;

    console.log(file);
    const imageURL = await cloudinary.uploader.upload(
      file.tempFilePath,
      (err, result) => {
        return result, err;
      },
      { resource_type: "auto" }
    );

    let { time, sec } = req.body;

    // console.log(imageURL.public_id);

    if (!time || !sec) {
      return res.status(200).send("Time & Sec required");
    }

    let field = new fieldModel();

    field.fileName = file.name;
    field.time = time;
    field.sec = sec;
    field.resource_type = imageURL.resource_type;
    field.public_id = imageURL.public_id;
    field.url = imageURL.url;

    await field.save();

    return res.status(200).send("Posted");
  } catch (err) {
    console.log(err);
  }
});

router.delete("/delete/:id", async (req, res) => {
  try {
    let field1 = await fieldModel.findById(req.params.id);
    console.log(field1);
    await cloudinary.uploader.destroy(
      `${field1.public_id}`,
      function (result) {
        console.log(result);
      },
      { resource_type: `${field1.resource_type}` }
    );
    let field = await fieldModel.findByIdAndDelete(req.params.id);

    return res.status(200).send("Deleted");
  } catch (err) {
    console.error(err);
  }
});
export default router;
