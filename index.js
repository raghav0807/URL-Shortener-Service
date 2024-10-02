const express = require("express");

const { connectToMongoDB } = require("./connect");

const urlRoute = require("./routes/url");
const URL = require("./models/url");

const app = express();
const PORT = 8001;

connectToMongoDB(
  "mongodb+srv://raghavagiwal20:aSZd7N9f6YLBssm5@cluster0.d4erj.mongodb.net/short-url?retryWrites=true&w=majority&appName=Cluster0"
).then(() => console.log("mongodb connected"));

app.use(express.json());
app.use("/url", urlRoute);

app.get("/:shortid", async (req, res) => {
  const shortid = req.params.shortid;
  const entry = await URL.findOneAndUpdate(
    {
      shortid: shortid,
    },
    {
      $push: {
        visitHistory: {
          timestamp: Date.now(),
        },
      },
    }
  );
  res.redirect(entry.redirectURL);
});

app.listen(PORT, () => console.log(`Server started at port: ${PORT}`));

//
