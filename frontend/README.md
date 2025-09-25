# gkhit 🎯

A **General Knowledge Quiz Game** with scoring, duration tracking, and a backend-powered **Top 10 Leaderboard**.

---

## 🚀 Features

* 🧠 **GK Game** with 10 random questions (new set each round).
* ⏱️ **Duration tracking** while playing.
* 🏆 **Top 10 Leaderboard** stored in the backend, showing:

  * Rank
  * Name
  * Score
  * Duration
* 📊 **Result screen** after finishing the quiz:

  * Total Score
  * Correct Answers
  * Wrong Answers
  * Leaderboard below the results

---

## 🛠️ Tech Stack

* **Frontend**: HTML, CSS, JavaScript, Next.js, TailwindCSS
* **Backend**: Express, MongoDB (for leaderboard storage)

---

## ⚙️ Working

1. **Quiz Start**

   * Asks for the player’s **name** (cannot continue without it).

2. **Question Fetching**

   * Loads **10 random questions** from `/public/quizQuestions.json` (100 total in file).
   * Ensures a new set each round.

3. **Gameplay**

   * Score updates after each answer.
   * **Next button** enabled only after selecting an option.
   * **Previous button** available after first question (deducts score of last answer if changed).

4. **Quiz End**

   * On last question, clicking **Finish** mounts:

     * **QuizEnd component** → shows result (score, correct, wrong).
     * **Leaderboard component** → fetches and displays Top 10 leaderboard from backend.

5. **Leaderboard Update**

   * After last answer, player’s **name, score, duration** are sent to backend.
   * If player ranks in **Top 10**, entry is stored in DB.

---

## 📂 Folder Structure

```
gkhit/
├── app/
│   └── components/
│       ├── QuizStart.jsx     # asks name to start  
│       ├── QuizCard.jsx      # shows question, options, handles next/prev logic  
│       ├── QuizEnd.jsx       # displays score, correct/wrong count, posts data  
│       ├── Leaderboard.jsx   # leaderboard table (fetches from backend)  
│       └── QuizBody.jsx      # main container, manages state & rendering  
│
├── public/
│   └── quizQuestions.json    # 100 questions, options, answers  
│
└── README.md
```

---

## 🖼️ Flow

1. **Enter Name** →
2. **Play 10 Random Questions** →
3. **Submit Final Answer** →
4. **Show Result** (score, correct, wrong) →
5. **Leaderboard Displayed** (Top 10 players)

---

### Backend Flow

#### 1. **POST /leaderboard**

* Accepts `{ name, score, duration }`.
* Logic:

  * **If name exists** → update entry **only if new score is better** (higher score, or equal score but faster duration).
  * **If name does not exist** →

    * If leaderboard has < 10 entries → insert new entry.
    * If leaderboard has 10 entries → compare with worst performer:

      * If better → replace worst performer.
      * If worse → ignore.

#### 2. **GET /leaderboard**

* Returns the **top 10 leaderboard** sorted by:

  1. Score (descending)
  2. Duration (ascending, for tie-breaking).
  
---

## 📌 Future Enhancements

* Add **categories** (Sports, Science, History, etc.).
* Timer per question.
* User authentication for persistent leaderboard tracking.
