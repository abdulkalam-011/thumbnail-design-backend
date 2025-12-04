import mongoose, {Schema} from 'mongoose';

const testimonialSchema = new Schema({ 
  owner:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User"
  },
  content:{
    type:String,
    required:true,
  },
  rating:{
    type:Number,
    enum:[1,2,3,4,5],
    required:[true, 'rating is required']
  },
  workId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Work",
    required:[true, 'workId is required for testimonial']
  }
}, { timestamps: true });

export const Testimonial  = mongoose.model('Testimonial', testimonialSchema);