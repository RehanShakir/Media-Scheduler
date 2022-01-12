import mongoose from "mongoose";

let fieldSchema = mongoose.Schema({
  fileName: {
    type: String,
  },
  time: {
    type: String,
  },
  sec: {
    type: String,
  },
  url: {
    type: String,
  },
  resource_type: {
    type: String,
  },
  public_id: {
    type: String,
  },
});

let fieldModel = new mongoose.model("Field", fieldSchema);

export default fieldModel;
