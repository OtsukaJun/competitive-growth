// Parse CSV and create vocabulary data
function parseQuizCSV(csvText) {
    const lines = csvText.trim().split('\n');
    const questions = [];
    
    // Skip header row
    for (let i = 1; i < lines.length; i++) {
        const parts = lines[i].split(',');
        if (parts.length >= 6) {
            const word = parts[1];
            const choices = [parts[2], parts[3], parts[4], parts[5]];
            const correctIndex = parseInt(parts[6]) - 1; // Convert 1-4 to 0-3
            
            const correct = choices[correctIndex];
            const options = choices.filter((_, idx) => idx !== correctIndex);
            
            questions.push({
                word: word,
                correct: correct,
                options: options
            });
        }
    }
    
    return questions;
}

// Embedded CSV data from english_quiz_500.csv (first 100 questions for performance)
const quizCSVData = `ID,Question(English),Choice1,Choice2,Choice3,Choice4,CorrectOption
1,stay up late,見てみる・チェックする,（用紙に）書き込む,夜更かしする,〜に頼る・依存する,3
2,go back,戻る,〜とうまくやる,話す,〜に頼る・依存する,1
3,wash,洗う,見る（じっと）,確認する,遊ぶ・ぶらぶらする,1
4,watch,理解する,見る（じっと）,終える,脱ぐ・離陸する,2
5,spend,シャットダウンする,うまくいく・解決する,戻る,（時間・お金を）使う,4
6,agree with,欲しいと思う,立ち寄る,提出する,〜に同意する,4
7,know,勉強する,登録する,知っている,見る,3
8,pick someone up,〜を迎えに行く,〜とうまくやる,話す（言語）,〜を心配する,1
9,tell,脱ぐ・離陸する,見つける,伝える,節約する・保存する,3
10,go to bed,〜を迎えに行く,食べる,シャットダウンする,寝る,4
11,live,使う,住む,落ち着く,戻る,2
12,belong to,乗り込む・入る,〜に所属する,見てみる・チェックする,見る（じっと）,2
13,drop someone off,〜を降ろす,拾う・迎えに行く,試す,手に入れる,1
14,wait,〜を起こす,寝る,乗り込む・入る,待つ,4
15,get tired,シャットダウンする,〜について考える,来る,疲れる,4
16,eat,来る,〜に所属する,食べる,聞く,3
17,grow up,早起きする,忘れる,〜とうまくやる,成長する,4
18,wake someone up,早起きする,〜を起こす,伝える,売る,2
19,try,拾う・迎えに行く,待つ,与える,試す,4
20,run into,言う,偶然出会う,聞く,音量を下げる・断る,2
21,know,知っている,成長する,話す（言語）,売る,1
22,meet,見る,チェックインする,聞く,会う,4
23,log out,アプリにログインする,ログアウトする,開ける,提出する,2
24,go,乗り込む・入る,（用紙に）書き込む,行く,見てみる・チェックする,3
25,meet,会う,成長する,する,（電源を）消す,1
26,get off,疲れる,理解する,（電源を）つける,降りる,4
27,think about,理解する,元気づける,寝る,〜について考える,4
28,talk,話す,〜を心配する,洗う,使う,1
29,cook,料理する,〜について考える,使う,中止する,1
30,take a break,降りる,休憩する,在宅勤務をする,旅行する,2
31,open up,打ち明ける,尋ねる,待つ,延期する,1
32,feel sick,うまくいく・解決する,会う,気分が悪い,脱ぐ・離陸する,3
33,look,見る,尋ねる,〜に同意する,〜を迎えに行く,1
34,see,座る,わかる・見つけ出す,電話する,見る,4
35,work from home,在宅勤務をする,洗う,世話をする,早起きする,1
36,work out,見る,うまくいく・解決する,準備をする,登録する,2
37,hear,聞こえる,休憩する,現れる・音量を上げる,配る,1
38,work from home,洗う,（電源を）つける,在宅勤務をする,立ち上がる,3
39,try,試す,〜に同意する,寝る,スピードを落とす,1
40,meet,乗る,現れる・音量を上げる,会う,住む,3
41,clean,掃除する,（電源を）つける,飲む,書き留める,1
42,belong to,起床する,わかる・見つけ出す,〜に所属する,知っている,3
43,hand in,延期する,忘れる,提出する,尋ねる,3
44,go,行く,持っている,戻る,身に着ける,1
45,take care of,（お金が）かかる,別れる,世話をする,与える,3
46,shut down,〜について考える,降りる,シャットダウンする,わかる・見つけ出す,3
47,understand,故障する,外出する,理解する,（電源を）つける,3
48,look for,見る,戻ってくる,探す,手伝う,3
49,cook,見てみる・チェックする,料理する,現れる・音量を上げる,持っている,2
50,slow down,飲む,世話をする,提出する,スピードを落とす,4
51,fall asleep,起きる,座る,〜を迎えに行く,眠りに落ちる,4
52,save,別れる,節約する・保存する,〜に頼る・依存する,試す,2
53,break down,打ち明ける,見る,〜に同意する,故障する,4
54,turn down,世話をする,確認する,音量を下げる・断る,理解する,3
55,pick someone up,立ち寄る,疲れる,伝える,〜を迎えに行く,4
56,forget,洗う,忘れる,身に着ける,起きる,2
57,go out,提出する,〜を迎えに行く,外出する,買う,3
58,have,持っている,聞く,立ち上がる,食べる,1
59,cost,起きる,（お金が）かかる,スピードを落とす,わかる・見つけ出す,2
60,cost,ログアウトする,（用紙に）書き込む,ログインする,（お金が）かかる,4
61,see,拾う・迎えに行く,設定する・準備する,見る,欲しいと思う,3
62,check it out,アプリにログインする,設定する・準備する,見てみる・チェックする,ログアウトする,3
63,close,チェックインする,探す,閉める,休憩する,3
64,look forward to,チェックアウトする,節約する・保存する,〜を楽しみにする,学ぶ,3
65,get in,来る,確認する,乗り込む・入る,学ぶ,3
66,go back,成長する,戻る,支払う,見る,2
67,hear,〜に同意する,始める,探す,聞こえる,4
68,look,見る,現れる,掃除する,打ち明ける,1
69,get ready,準備をする,覚えている,〜を降ろす,終える,1
70,pay,乗り込む・入る,開ける,シャットダウンする,支払う,4
71,move,聞こえる,必要とする,支払う,動く・引っ越す,4
72,hand in,住む,提出する,〜を楽しみにする,チェックインする,2
73,wake up,聞く,確認する,起きる,（電源を）消す,3
74,pick someone up,落ち着く,拾う・迎えに行く,〜を迎えに行く,住む,3
75,wash,理解する,洗う,開ける,元気づける,2
76,get,動く・引っ越す,確認する,〜に同意する,手に入れる,4
77,learn,気分が悪い,学ぶ,料理する,〜を迎えに行く,2
78,check,立ち寄る,〜を心配する,降りる,確認する,4
79,look after,現れる,売る,世話をする,降りる,3
80,cost,閉める,（お金が）かかる,延期する,〜を心配する,2
81,shut down,見る,理解する,買う,シャットダウンする,4
82,remember,現れる,（用紙に）書き込む,覚えている,聞く,3
83,get ready,理解する,電話する,準備をする,見る,3
84,drop someone off,外出する,会う,〜を降ろす,話す,3
85,put on,身に着ける,早起きする,動く・引っ越す,旅行する,1
86,understand,試す,座る,理解する,〜とうまくやる,3
87,help,手伝う,ログアウトする,忘れる,来る,1
88,put off,座る,立ち寄る,延期する,食べる,3
89,carry out,世話をする,乗り込む・入る,実行する,元気づける,3
90,make,見つける,作る,座る,わかる・見つけ出す,2
91,hurry up,〜に頼る・依存する,在宅勤務をする,シャットダウンする,急ぐ,4
92,feel sick,手伝う,気分が悪い,延期する,取る・連れて行く,2
93,call,電話する,見る,言う,支払う,1
94,study,別れる,探す,勉強する,知っている,3
95,sell,戻ってくる,売る,支払う,言う,2
96,save,〜に同意する,節約する・保存する,（用紙に）書き込む,気分が悪い,2
97,talk,料理する,〜を楽しみにする,話す,〜に所属する,3
98,go,延期する,行く,成長する,必要とする,2
99,know,拾う・迎えに行く,動く・引っ越す,知っている,ログインする,3
100,eat,気分が悪い,必要とする,うまくいく・解決する,食べる,4`;

// Parse the CSV data
const allQuestions = parseQuizCSV(quizCSVData);

// Select random questions for the session
let vocabulary = [];

// App state
let currentScreen = 'registration';
let username = '';
let currentQuestionIndex = 0;
let correctAnswers = 0;
let totalAnswers = 0;
let startTime = null;
let questionStartTime = null;
let todayTotalCorrect = 0; // Today's cumulative correct answers
let totalLifetimeCorrect = 0; // Lifetime cumulative correct answers
let previousLevel = 1; // Previous level before this session
let usedQuestionIndices = []; // Track which questions have been used
let shuffledQuestionOrder = []; // Shuffled order of all questions
let currentCorrectAnswer = ''; // Current question's correct answer

// DOM elements
const registrationScreen = document.getElementById('registration-screen');
const startScreen = document.getElementById('start-screen');
const quizScreen = document.getElementById('quiz-screen');
const resultsScreen = document.getElementById('results-screen');
const levelupScreen = document.getElementById('levelup-screen');

const usernameInput = document.getElementById('username-input');
const registerBtn = document.getElementById('register-btn');
const startBtn = document.getElementById('start-btn');
const viewResultsBtn = document.getElementById('view-results-btn');
const finishBtn = document.getElementById('finish-btn');
const endBtn = document.getElementById('end-btn');

const wordDisplay = document.getElementById('word-display');
const choiceBtns = document.querySelectorAll('.choice-btn');
const correctCountEl = document.getElementById('correct-count');
const totalCountEl = document.getElementById('total-count');
const totalCountFractionEl = document.getElementById('total-count-fraction');
const timeSpentEl = document.getElementById('time-spent');

const quizUsernameEl = document.getElementById('quiz-username');
const resultsUsernameEl = document.getElementById('results-username');
const levelupUsernameEl = document.getElementById('levelup-username');

const userRankEl = document.getElementById('user-rank');
const rankingListEl = document.getElementById('ranking-list');
const levelupTextEl = document.getElementById('levelup-text');

// Initialize app
function init() {
    // Check if username exists in localStorage
    const savedUsername = localStorage.getItem('username');
    if (savedUsername) {
        username = savedUsername;
        showScreen('start');
    } else {
        showScreen('registration');
    }
    
    // Load today's cumulative score and lifetime score
    loadTodayScore();
    loadLifetimeScore();
    
    // Event listeners
    registerBtn.addEventListener('click', handleRegistration);
    startBtn.addEventListener('click', startQuiz);
    viewResultsBtn.addEventListener('click', showResults);
    finishBtn.addEventListener('click', handleFinish);
    endBtn.addEventListener('click', () => showScreen('start'));
    
    choiceBtns.forEach((btn, index) => {
        btn.addEventListener('click', () => handleAnswer(index));
    });
}

// Get today's date as string (YYYY-MM-DD)
function getTodayDateString() {
    const today = new Date();
    return today.toISOString().split('T')[0];
}

// Load today's cumulative score
function loadTodayScore() {
    const today = getTodayDateString();
    const scoreKey = `score_${username}_${today}`;
    const savedScore = localStorage.getItem(scoreKey);
    todayTotalCorrect = savedScore ? parseInt(savedScore) : 0;
}

// Save today's cumulative score
function saveTodayScore() {
    const today = getTodayDateString();
    const scoreKey = `score_${username}_${today}`;
    localStorage.setItem(scoreKey, todayTotalCorrect.toString());
}

// Load lifetime cumulative score
function loadLifetimeScore() {
    const lifetimeKey = `lifetime_${username}`;
    const savedScore = localStorage.getItem(lifetimeKey);
    totalLifetimeCorrect = savedScore ? parseInt(savedScore) : 0;
    previousLevel = calculateLevel(totalLifetimeCorrect);
}

// Save lifetime cumulative score
function saveLifetimeScore() {
    const lifetimeKey = `lifetime_${username}`;
    localStorage.setItem(lifetimeKey, totalLifetimeCorrect.toString());
}

// Calculate level from total correct answers
function calculateLevel(totalCorrect) {
    return Math.floor(totalCorrect / 10) + 1;
}

// Check if user leveled up
function checkLevelUp() {
    const newLevel = calculateLevel(totalLifetimeCorrect);
    return newLevel > previousLevel ? newLevel : null;
}

// Show screen
function showScreen(screen) {
    registrationScreen.classList.add('hidden');
    startScreen.classList.add('hidden');
    quizScreen.classList.add('hidden');
    resultsScreen.classList.add('hidden');
    levelupScreen.classList.add('hidden');
    
    switch(screen) {
        case 'registration':
            registrationScreen.classList.remove('hidden');
            break;
        case 'start':
            startScreen.classList.remove('hidden');
            break;
        case 'quiz':
            quizScreen.classList.remove('hidden');
            quizUsernameEl.textContent = username + 'さん';
            break;
        case 'results':
            resultsScreen.classList.remove('hidden');
            resultsUsernameEl.textContent = username + 'さん';
            break;
        case 'levelup':
            levelupScreen.classList.remove('hidden');
            levelupUsernameEl.textContent = username + 'さん';
            break;
    }
    
    currentScreen = screen;
}

// Handle registration
function handleRegistration() {
    const name = usernameInput.value.trim();
    if (name) {
        username = name;
        localStorage.setItem('username', name);
        loadTodayScore();
        loadLifetimeScore();
        showScreen('start');
    }
}

// Start quiz
function startQuiz() {
    currentQuestionIndex = 0;
    correctAnswers = 0; // Reset session correct answers
    totalAnswers = 0;
    startTime = Date.now();
    
    // Create shuffled order of all questions
    shuffledQuestionOrder = Array.from({length: allQuestions.length}, (_, i) => i);
    shuffledQuestionOrder.sort(() => Math.random() - 0.5);
    usedQuestionIndices = [];
    
    showScreen('quiz');
    loadQuestion();
}

// Load question
function loadQuestion() {
    // If all questions have been used, reshuffle
    if (usedQuestionIndices.length >= shuffledQuestionOrder.length) {
        shuffledQuestionOrder.sort(() => Math.random() - 0.5);
        usedQuestionIndices = [];
    }
    
    // Get next unused question
    const questionIndex = shuffledQuestionOrder[usedQuestionIndices.length];
    const question = allQuestions[questionIndex];
    
    wordDisplay.textContent = question.word;
    currentCorrectAnswer = question.correct;
    
    // Create shuffled choices
    const choices = [question.correct, ...question.options];
    const shuffledChoices = shuffleArray(choices);
    
    // Update choice buttons
    choiceBtns.forEach((btn, index) => {
        btn.classList.remove('correct', 'incorrect', 'disabled');
        const choiceText = btn.querySelector('.choice-text');
        choiceText.textContent = shuffledChoices[index];
        btn.dataset.answer = shuffledChoices[index];
    });
    
    questionStartTime = Date.now();
}

// Handle answer
function handleAnswer(index) {
    const selectedBtn = choiceBtns[index];
    const selectedAnswer = selectedBtn.dataset.answer;
    const isCorrect = selectedAnswer === currentCorrectAnswer;
    
    // Disable all buttons
    choiceBtns.forEach(btn => btn.classList.add('disabled'));
    
    // Show feedback
    if (isCorrect) {
        selectedBtn.classList.add('correct');
        correctAnswers++;
    } else {
        selectedBtn.classList.add('incorrect');
        // Highlight correct answer
        choiceBtns.forEach(btn => {
            if (btn.dataset.answer === currentCorrectAnswer) {
                btn.classList.add('correct');
            }
        });
    }
    
    totalAnswers++;
    
    // Mark this question as used
    const questionIndex = shuffledQuestionOrder[usedQuestionIndices.length];
    usedQuestionIndices.push(questionIndex);
    
    // Move to next question after 1 second
    setTimeout(() => {
        loadQuestion();
    }, 1000);
}

// Show results
function showResults() {
    const endTime = Date.now();
    const timeSpent = Math.floor((endTime - startTime) / 1000);
    
    // Update today's cumulative score
    todayTotalCorrect += correctAnswers;
    saveTodayScore();
    
    // Update lifetime cumulative score
    totalLifetimeCorrect += correctAnswers;
    saveLifetimeScore();
    
    correctCountEl.textContent = correctAnswers;
    totalCountFractionEl.textContent = totalAnswers;
    totalCountEl.textContent = totalAnswers;
    timeSpentEl.textContent = timeSpent;
    
    // Load and display ranking
    loadRanking();
    
    // Check if user leveled up and update button text
    const newLevel = checkLevelUp();
    if (newLevel) {
        finishBtn.textContent = '次へ';
    } else {
        finishBtn.textContent = '終了する';
    }
    
    showScreen('results');
}

// Handle finish button click
function handleFinish() {
    const newLevel = checkLevelUp();
    if (newLevel) {
        // Show level up screen
        levelupTextEl.textContent = `レベル${newLevel}になりました！`;
        previousLevel = newLevel; // Update previous level
        showScreen('levelup');
    } else {
        // Go back to start screen
        showScreen('start');
    }
}

// CSV data embedded
const csvData = `Name,Score
Tanaka Ryo,34
佐藤Aki,89
yuki_23,17
山本Haruto,56
Mei.kondo,72
Hiroshi_7,8
中村ゆう,95
sakurai.M,43
リンタロウ56,64
Toma_aki,21
渡辺玲奈,12
yu_suzuki88,100
今井Shun,42
Misaki34,6
Ishida光,27
Arisa.k,97
だいち009,53
Kana.Y,81
斎藤Kou,15
Makoto_3,74
千葉Leo,38
Hikari,90
shiro_112,59
工藤nao,4
tomo1998,68
Ren.G,94
斉藤Kei,7
yuika77,57
matsu_daichi,23
Koharu.01,82
高橋jun,29
Kazuki_81,63
Rina84,11
Haru.m,54
Kaito-Rei,78
ふじもと修,36
Yu_to33,16
miu_02,92
田中翔太,9
Rio.chan,65
aoi_321,88
MatsuiRen,44
さくら_S,73
Tsubasa08,31
近藤タカ,2
7_miku,58
Rei_T,80
みなと32,96
Shizuku09,19
hashimoto46,75
yuji_001,28
Kanae.M,99
須藤Kai,13
NOA777,70
Misato_R,46
鈴木りお,1
Kenjiro94,67
AYA009,83
Yamato33,41
rei.na,60
HayatoXR,134
中川亮平,201
Mika_Zero,158
Satoshi_88,245
HarukaS,310
Kuroki_12,122
Yuzuha_0,115
大谷Kento,303
Sakura555,288
Koji_2000,170
Minami33,147
Kaito999,254
nana.mori,187
Riku—S,221
Shunpei,198
三浦K,141
Ren_44,119
井上Haruma,230
SakiT,129
Taiga55,180
matsu_ken,352
HonokaR,260
ありさ88,214
Yu-suke3,275
Hoshino22,160
KAI_11,189
Marina777,145
yuu_200,320
Akari_x,301
高瀬Ryuto,172
ももか3,118
TakeruN,90
Jin-082,44
HarutoXT,67
あやの2024,32
seiji.k,55
MISORA09,98
Takuya_L,20`;

// Load CSV and display ranking
function loadRanking() {
    try {
        // Parse CSV
        const lines = csvData.trim().split('\n');
        const users = [];
        
        // Skip header row
        for (let i = 1; i < lines.length; i++) {
            const [name, score] = lines[i].split(',');
            if (name && score) {
                users.push({
                    name: name.trim(),
                    score: parseInt(score.trim())
                });
            }
        }
        
        // Add current user with today's cumulative score
        users.push({
            name: username,
            score: todayTotalCorrect
        });
        
        // Sort by score (descending - highest first)
        users.sort((a, b) => b.score - a.score);
        
        // Calculate ranks with ties
        const rankedUsers = [];
        let currentRank = 1;
        for (let i = 0; i < users.length; i++) {
            if (i > 0 && users[i].score < users[i - 1].score) {
                currentRank = i + 1; // Skip ranks for tied users
            }
            rankedUsers.push({
                ...users[i],
                rank: currentRank
            });
        }
        
        // Find user's rank
        const userEntry = rankedUsers.find(u => u.name === username);
        const userRank = userEntry ? userEntry.rank : 1;
        const totalUsers = users.length;
        
        // Update rank display
        userRankEl.textContent = userRank;
        document.querySelector('.rank-total').textContent = `(${totalUsers}人中)`;
        
        // Display ranking list (show all users with ranks)
        displayRankingList(rankedUsers, username);
        
    } catch (error) {
        console.error('Error loading ranking:', error);
    }
}

// Display ranking list
function displayRankingList(rankedUsers, currentUsername) {
    rankingListEl.innerHTML = '';
    
    // Display all users with their ranks
    for (let i = 0; i < rankedUsers.length; i++) {
        const user = rankedUsers[i];
        const rankingItem = createRankingItem(user.rank, user.name, user.score, user.name === currentUsername);
        rankingListEl.appendChild(rankingItem);
    }
    
    // Scroll to current user's position after rendering
    setTimeout(() => {
        const currentUserItem = rankingListEl.querySelector('.current-user');
        if (currentUserItem) {
            currentUserItem.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }, 100);
}

// Create ranking item element
function createRankingItem(position, name, score, isCurrentUser) {
    const item = document.createElement('div');
    item.className = 'ranking-item' + (isCurrentUser ? ' current-user' : '');
    
    item.innerHTML = `
        <div class="ranking-item-left">
            <span class="ranking-position">${position}</span>
            <span class="ranking-name">${name}</span>
        </div>
        <span class="ranking-score">${score}問</span>
    `;
    
    return item;
}

// Utility: Shuffle array
function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

// Start app
init();
