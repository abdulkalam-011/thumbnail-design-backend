import mongoose, {Schema} from 'mongoose';

const projectSchema = new Schema({
  title:{
    type:String,
    required:[true, "title is required"]
  },
  description:{
    type:String,
    default:"",
    required:true
  },
  coverImg:{
    type:String,  //cloudinary url
    required:[true,"thumbnail image is required"]
  },
  liveLink:{
    type:String,
    default:""
  },
  repoLink:{
    type:String,
    default:""
  },
  techStacks:{
    type:[String],
    default:[]
  },
  category:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Category',
    required:[true,"category is required"]
  }
}, { timestamps: true });

export const Project = mongoose.model('Project', projectSchema);