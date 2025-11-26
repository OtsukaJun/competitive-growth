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

// Load and parse CSV data from external file
let allQuestions = [];

// Load CSV data on initialization
async function loadQuizData() {
    try {
        const response = await fetch('english_quiz_500.csv');
        const csvText = await response.text();
        allQuestions = parseQuizCSV(csvText);
        console.log(`Loaded ${allQuestions.length} questions`);
    } catch (error) {
        console.error('Error loading quiz data:', error);
        // Fallback to empty array if loading fails
        allQuestions = [];
    }
}

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
let usedQuestionIds = []; // Track used questions to avoid repeats

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
async function init() {
    // Load quiz data first
    await loadQuizData();
    
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

// Get next random question (avoiding all used questions in current session)
function getNextRandomQuestion() {
    // Filter out all questions used in this session
    const availableQuestions = allQuestions.filter((q, idx) => !usedQuestionIds.includes(idx));
    
    // If all questions have been used (unlikely with 500 questions), reset
    if (availableQuestions.length === 0) {
        usedQuestionIds = [];
        return getNextRandomQuestion();
    }
    
    // Select random question from available ones
    const randomIndex = Math.floor(Math.random() * availableQuestions.length);
    const selectedQuestion = availableQuestions[randomIndex];
    
    // Find original index and mark as used in this session
    const originalIndex = allQuestions.indexOf(selectedQuestion);
    usedQuestionIds.push(originalIndex);
    
    return selectedQuestion;
}

// Start quiz
function startQuiz() {
    currentQuestionIndex = 0;
    correctAnswers = 0; // Reset session correct answers
    totalAnswers = 0;
    startTime = Date.now();
    usedQuestionIds = []; // Reset used questions
    
    // Start with one random question
    vocabulary = [getNextRandomQuestion()];
    
    showScreen('quiz');
    loadQuestion();
}

// Load question
function loadQuestion() {
    // Make sure we have a question
    if (currentQuestionIndex >= vocabulary.length) {
        vocabulary.push(getNextRandomQuestion());
    }
    
    const question = vocabulary[currentQuestionIndex];
    wordDisplay.textContent = question.word;
    
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
    const question = vocabulary[currentQuestionIndex];
    const isCorrect = selectedAnswer === question.correct;
    
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
            if (btn.dataset.answer === question.correct) {
                btn.classList.add('correct');
            }
        });
    }
    
    totalAnswers++;
    
    // Move to next question after 1 second
    setTimeout(() => {
        // Add a new random question
        vocabulary.push(getNextRandomQuestion());
        currentQuestionIndex++;
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
