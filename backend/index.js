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
        const needed = 10;
        const { name, score, duration } = req.body;

        if (!name || score == null || duration == null) {
            return res.status(400).json({ message: "Missing required fields", success: false });
        }

        let leaderboard = await leaderModel.find().sort({ score: -1, duration: 1 }).limit(needed);
        const user = await leaderModel.findOne({ name });

        // If user exists → update if improved
        if (user) {
            if (score > user.score || (score === user.score && duration < user.duration)) {
                await leaderModel.findByIdAndUpdate(user._id, { score, duration });
                leaderboard = await leaderModel.find().sort({ score: -1, duration: 1 }).limit(needed);
                return res.status(201).json({ leaderboard, message: "Rank improved", success: true });
            } else {
                leaderboard = await leaderModel.find().sort({ score: -1, duration: 1 }).limit(needed);
                return res.status(200).json({ leaderboard, message: "Rank not improved", success: true });
            }
        }

        // If user does not exist
        if (leaderboard.length < needed) {
            const newEntry = new leaderModel({ name, score, duration });
            await newEntry.save();
            leaderboard = await leaderModel.find().sort({ score: -1, duration: 1 }).limit(needed);
            return res.status(201).json({ leaderboard, message: "New user added!", success: true });
        } else {
            // Leaderboard full → check against lowest
            const lowest = leaderboard[leaderboard.length - 1];

            if (score > lowest.score || (score === lowest.score && duration < lowest.duration)) {
                const newEntry = new leaderModel({ name, score, duration });
                await newEntry.save();
                leaderboard = await leaderModel.find().sort({ score: -1, duration: 1 }).limit(needed);
                return res.status(201).json({ leaderboard, message: "New user added!", success: true });
            } else {
                res.status(200).json({ leaderboard, message: "Could not rank", success: true });
                const newEntry = new leaderModel({ name, score, duration });
                await newEntry.save();
                return;
            }
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error, post failed!!!", success: false });
    }
});


app.listen(process.env.PORT);
