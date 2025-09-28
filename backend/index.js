import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

mongoose.connect(process.env.mongoURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log("Connection Successful.");
}).catch((err) => {
    console.log("connection failed", err);
})

const userSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    score: { type: Number, required: true },
    duration: { type: Number, required: true }
});

const quizSchema = new mongoose.Schema({
    index: { type: Number, required: true },
    question: { type: String, required: true },
    options: { type: Array, required: true },
    answer: { type: String, required: true },
    category: { type: String, required: true }
});

const quizModel = mongoose.model('Quiz_Data', quizSchema);
const leaderModel = mongoose.model('gkhit_leaderboard', userSchema);

app.get('/api/quiz_data', async (req, res) => {
    try {
        const needed = 10;
        const quizData = await quizModel.find();
        let set_of_indexes = new Set([]);
        let selectedData = [];

        if (!quizData.length) {
            console.error("Quiz data is empty!!");
            return res.status(404).json({ selectedData, message: 'Quiz data not available!!', success: false });
        }
        while (set_of_indexes.size < needed) {
            let randNum = Math.floor(Math.random() * quizData.length);
            set_of_indexes.add(randNum);
        }

        const array_of_indexes = [...set_of_indexes];

        array_of_indexes.forEach((item, i) => {
            selectedData[i] = quizData[item];
        });

        if (set_of_indexes.size === needed && selectedData.length === needed) {
            return res.status(200).json(selectedData);
        }
    } catch (error) {
        console.error('Data loading failed: ', err);
        return res.status(500).json({ message: 'Internal server error, get failed!!!', success: false });
    }
});

app.post('/api/post_score', async (req, res) => {
  try {
    const { name, score, duration } = req.body;

    if (!name || score == null || duration == null) {
      return res
        .status(400)
        .json({ message: "Missing required fields", success: false });
    }

    console.log("Everything seems ok...");

    // Find user by name
    let user = await leaderModel.findOne({ name });

    if (user) {
      // Update only if better
      if (score > user.score || (score === user.score && duration < user.duration)) {
        await leaderModel.findByIdAndUpdate(user._id, { score, duration });
        console.log(`User ${name} improved score/duration`);
      } else {
        console.log(`User ${name} did not improve`);
      }
    } else {
      // New user → just insert
      const newUser = new leaderModel({ name, score, duration });
      await newUser.save();
      console.log(`New user ${name} added`);
    }

    // Always return top 10 leaderboard
    const leaderboard = await leaderModel.find().sort({ score: -1, duration: 1 }).limit(10);

    return res.status(200).json({
      leaderboard,
      message: user ? "Existing user processed" : "New user added",
      success: true,
    });

  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Internal server error, post failed!!!", success: false });
  }
});

app.listen(process.env.PORT);
