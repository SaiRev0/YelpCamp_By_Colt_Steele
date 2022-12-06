const mongoose = require("mongoose");
const Campground = require("../models/campground");
const cities = require("./cities");
const { descriptors, places } = require("./seedhelpers");

mongoose
  .connect(
    "mongodb+srv://admin:NidDp8znqUsVRlPz@cluster0.hdnup2y.mongodb.net/?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("Mongo Connected");
  })
  .catch((err) => {
    console.log("Error" + err);
  });

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i <= 100; i++) {
    const random100 = Math.floor(Math.random() * 30);
    const price = Math.floor(Math.random() * 1000) + 1;
    const camp = new Campground({
      author : "638acf42caf383803467b844",
      Location: `${cities[random100].city} , ${cities[random100].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Aperiam quaerat nihil delectus deserunt exercitationem id nulla quod quidem asperiores aliquid provident error dolorum impedit, nam alias corporis iure. Aspernatur, sapiente.",
      price,
      geometry : {
        type : "Point" ,
        coordinates : [
          cities[random100].longitude,
          cities[random100].latitude,
        ]
      },
      images :  [
        {
          url: "https://images.unsplash.com/photo-1485038101637-2d4833df1b35?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1228&q=80",  
          filename: 'YelpCamp/m0p5vvpsmkhubhjs2qmn',
        }
      ]
    });
    await camp.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
