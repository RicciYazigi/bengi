// ---------------  Centro Pachamama – Benji  ---------------
// Todo el juego se ejecuta 100 % en el navegador: SIN LOGIN, SIN SERVIDOR
// El progreso se guarda en localStorage

// Estado global
let gameState = {
    currentSection: 'home',
    totalPoints: 0,
    dailyStreak: 0,
    progress: 0,
    achievements: [],
    notes: '',
    timer: { minutes: 25, seconds: 0, isActive: false, mode: 'study' },
    math: { currentQuestion: 0, correctAnswers: 0, totalQuestions: 0 },
    language: { lastWritingSubmission: null },
    english: { quizScore: 0 },
    todayStats: { points: 0, activities: 0, studyTime: 0 }
};

// Datos
const motivationalQuotes = [
    "¡Cada día es una oportunidad para aprender algo nuevo!",
    "La educación es el arma más poderosa para cambiar el mundo",
    "El conocimiento es como un jardín: si no se cultiva, no se puede cosechar",
    "¡Tus sueños están a un paso de distancia!",
    "La práctica hace al maestro, ¡sigue adelante!"
];

const mathProblems = [
    {
        question: "Si una escuela recicla 120 kg de papel al mes, ¿cuántos kg reciclará en 8 meses?",
        options: ["960 kg", "840 kg", "1000 kg", "720 kg"],
        correct: 0,
        explanation: "120 × 8 = 960 kg"
    },
    {
        question: "Un huerto escolar tiene 15 plantas de tomate. Si cada planta produce 8 tomates, ¿cuántos tomates se cosechan en total?",
        options: ["120", "100", "150", "80"],
        correct: 0,
        explanation: "15 × 8 = 120 tomates"
    },
    {
        question: "Si 5 estudiantes pueden plantar 25 árboles en 2 horas, ¿cuántos árboles plantarán 8 estudiantes en el mismo tiempo?",
        options: ["40", "35", "45", "50"],
        correct: 0,
        explanation: "Cada estudiante planta 5 árboles → 8 × 5 = 40"
    },
    {
        question: "Una familia ahorra 45 litros de agua al día. ¿Cuántos litros ahorrará en una semana?",
        options: ["315", "300", "350", "280"],
        correct: 0,
        explanation: "45 × 7 = 315 litros"
    },
    {
        question: "Si el 60 % de 250 estudiantes participan en actividades ambientales, ¿cuántos estudiantes participan?",
        options: ["150", "140", "160", "120"],
        correct: 0,
        explanation: "60 % de 250 = 0,60 × 250 = 150"
    }
];

const vocabulary = [
    { english: "Environment", spanish: "Medio ambiente", example: "We must protect our environment." },
    { english: "Recycle", spanish: "Reciclar", example: "Please recycle this plastic bottle." },
    { english: "Sustainable", spanish: "Sostenible", example: "We need sustainable development." },
    { english: "Pollution", spanish: "Contaminación", example: "Air pollution is a serious problem." },
    { english: "Conservation", spanish: "Conservación", example: "Water conservation is important." }
];

const comprehensionQuestions = [
    {
        question: "¿Cuál es el enfoque principal del Colegio Pachamama?",
        options: ["Deportes", "Sostenibilidad", "Arte", "Tecnología"],
        correct: 1
    },
    {
        question: "¿Qué tipo de energía utiliza el colegio?",
        options: ["Eólica", "Solar", "Nuclear", "Carbón"],
        correct: 1
    },
    {
        question: "¿Cómo se extiende la educación ambiental según el texto?",
        options: ["Solo en el aula", "A la familia y comunidad", "Solo a los profesores", "Solo los fines de semana"],
        correct: 1
    }
];

const achievements = [
    { id: 'first_day', name: 'Primer Día', description: 'Completaste tu primer día de estudio', icon: 'star', unlocked: false },
    { id: 'math_master', name: 'Maestro Matemático', description: 'Resolviste 10 problemas matemáticos', icon: 'calculator', unlocked: false },
    { id: 'word_wizard', name: 'Mago de Palabras', description: 'Completaste el ejercicio de escritura', icon: 'pen', unlocked: false },
    { id: 'english_expert', name: 'Experto en Inglés', description: 'Dominaste el vocabulario ambiental', icon: 'globe', unlocked: false },
    { id: 'pomodoro_pro', name: 'Experto Pomodoro', description: 'Completaste 5 sesiones de estudio', icon: 'clock', unlocked: false },
    { id: 'streak_master', name: 'Racha Perfecta', description: 'Mantuviste una racha de 7 días', icon: 'fire', unlocked: false },
    { id: 'super_student', name: 'Súper Estudiante', description: 'Alcanzaste 500 puntos', icon: 'trophy', unlocked: false },
    { id: 'eco_warrior', name: 'Guerrero Ecológico', description: 'Completaste todas las materias', icon: 'leaf', unlocked: false }
];

// --- Funciones utilitarias ---
function saveGameState() {
    gameState.lastSave = new Date().toISOString();
    localStorage.setItem('pachamamaGameState', JSON.stringify(gameState));
}
function loadGameState() {
    const saved = localStorage.getItem('pachamamaGameState');
    if (saved) {
        const loaded = JSON.parse(saved);
        gameState = { ...gameState, ...loaded };
        updateDailyStreak();
    }
}
function updateDailyStreak() {
    const today = new Date().toDateString();
    const last = gameState.lastSave ? new Date(gameState.lastSave).toDateString() : null;
    if (last !== today) {
        if (last && isYesterday(new Date(gameState.lastSave))) {
            gameState.dailyStreak++;
        } else {
            gameState.dailyStreak = 1;
        }
        gameState.todayStats = { points: 0, activities: 0, studyTime: 0 };
    }
}
function isYesterday(d) {
    const yes = new Date();
    yes.setDate(yes.getDate() - 1);
    return d.toDateString() === yes.toDateString();
}
function addPoints(p, reason = '') {
    gameState.totalPoints += p;
    gameState.todayStats.points += p;
    gameState.todayStats.activities++;
    updateProgress();
    updateUI();
    if (reason) showTemporaryMessage(`+${p} pts por ${reason}`, 'success');
    if (gameState.totalPoints >= 500) unlockAchievement('super_student');
    saveGameState();
}
function updateProgress() {
    gameState.progress = Math.min(Math.floor((gameState.totalPoints / 1000) * 100), 100);
}
function unlockAchievement(id) {
    if (!gameState.achievements.includes(id)) {
        gameState.achievements.push(id);
        const ach = achievements.find(a => a.id === id);
        if (ach) showAchievementNotification(ach);
        addPoints(50, 'logro desbloqueado');
    }
}
function showAchievementNotification(ach) {
    const box = document.getElementById('achievementNotification');
    document.getElementById('achievementText').textContent = ach.name;
    box.classList.remove('hidden');
    setTimeout(() => box.classList.add('hidden'), 3500);
}
function showTemporaryMessage(msg, type = 'info') {
    const box = document.getElementById('successMessage');
    document.getElementById('successText').textContent = msg;
    box.className = `fixed top-32 right-6 p-4 rounded-lg shadow-lg z-50 text-white ${type === 'success' ? 'bg-green-500' : 'bg-red-500'}`;
    box.classList.remove('hidden');
    setTimeout(() => box.classList.add('hidden'), 3000);
}
function updateUI() {
    ['totalPoints', 'dailyStreak', 'progressPercent', 'progressText', 'todayPoints', 'todayActivities', 'todayStudyTime'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.textContent = gameState[id] || gameState.todayStats[id] || '0';
    });
    if (id === 'progressPercent' || id === 'progressText') el.textContent += '%';
    // Círculo de progreso
    const circle = document.getElementById('progressCircle');
    const c = 2 * Math.PI * 45;
    circle.style.strokeDasharray = c;
    circle.style.strokeDashoffset = c - (gameState.progress / 100) * c;
    updateAchievementsList();
}
function updateAchievementsList() {
    const list = document.getElementById('achievementsList');
    const unlocked = achievements.filter(a => gameState.achievements.includes(a.id));
    list.innerHTML = unlocked.length
        ? unlocked.map(a => `<div class="flex items-center space-x-3 bg-yellow-50 p-2 rounded-lg"><i class="fas fa-${a.icon} text-yellow-600"></i><div><div class="font-semibold text-sm">${a.name}</div><div class="text-xs text-gray-600">${a.description}</div></div></div>`).join('')
        : '<p class="text-gray-500 text-sm">Completa actividades para desbloquear logros</p>';
}

// --- Navegación ---
function showSection(name) {
    document.querySelectorAll('.section').forEach(s => s.classList.add('hidden'));
    document.getElementById(name + 'Section').classList.remove('hidden');
    gameState.currentSection = name;
    if (name === 'math') initMath();
    if (name === 'language') initLanguage();
    if (name === 'english') initEnglish();
    if (name === 'home') updateMotivationalQuote();
    saveGameState();
}
function updateMotivationalQuote() {
    const q = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
    document.getElementById('motivationalQuote').textContent = q;
}

// --- Matemáticas ---
function initMath() {
    gameState.math.currentQuestion = 0;
    generateMathQuestion();
}
function generateMathQuestion() {
    const problem = mathProblems[Math.floor(Math.random() * mathProblems.length)];
    document.getElementById('mathQuestion').innerHTML = `<h4 class="font-semibold mb-2">Problema ${gameState.math.currentQuestion + 1}</h4><p>${problem.question}</p>`;
    document.getElementById('mathOptions').innerHTML = problem.options.map((o, i) => `
        <label class="flex items-center space-x-2 p-2 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer transition-all">
            <input type="radio" name="mathAnswer" value="${i}" class="text-green-600">
            <span>${o}</span>
        </label>`).join('');
    document.getElementById('mathResult').classList.add('hidden');
    window.currentMathProblem = problem;
}
function checkMathAnswer() {
    const selected = document.querySelector('input[name="mathAnswer"]:checked');
    if (!selected) return showTemporaryMessage('Selecciona una respuesta', 'error');
    const isCorrect = parseInt(selected.value) === window.currentMathProblem.correct;
    const resultDiv = document.getElementById('mathResult');
    if (isCorrect) {
        gameState.math.correctAnswers++;
        resultDiv.innerHTML = `<div class="bg-green-100 text-green-800 p-3 rounded-lg"><i class="fas fa-check-circle mr-2"></i>¡Correcto! ${window.currentMathProblem.explanation}</div>`;
        addPoints(20, 'respuesta correcta');
    } else {
        resultDiv.innerHTML = `<div class="bg-red-100 text-red-800 p-3 rounded-lg"><i class="fas fa-times-circle mr-2"></i>Incorrecto. ${window.currentMathProblem.explanation}</div>`;
    }
    resultDiv.classList.remove('hidden');
    gameState.math.currentQuestion++;
    gameState.math.totalQuestions++;
    if (gameState.math.currentQuestion >= 5) {
        setTimeout(() => {
            const score = Math.floor((gameState.math.correctAnswers / 5) * 100);
            showTemporaryMessage(`Quiz completado: ${score}% precisión`, 'success');
            if (gameState.math.correctAnswers >= 4) unlockAchievement('math_master');
            addPoints(25, 'quiz matemático');
            gameState.math.currentQuestion = 0;
        }, 2000);
    } else {
        setTimeout(generateMathQuestion, 2000);
    }
}

// --- Lengua ---
function initLanguage() {
    generateComprehensionQuestions();
}
function generateComprehensionQuestions() {
    const container = document.getElementById('comprehensionQuestions');
    container.innerHTML = comprehensionQuestions.map((q, i) => `
        <div class="mb-4">
            <p class="font-medium mb-2">${i + 1}. ${q.question}</p>
            <div class="space-y-1">${q.options.map((o, j) => `
                <label class="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded transition-all">
                    <input type="radio" name="question${i}" value="${j}" class="text-blue-600">
                    <span class="text-sm">${o}</span>
                </label>`).join('')}</div>
        </div>`).join('');
}
function checkComprehension() {
    let correct = 0;
    comprehensionQuestions.forEach((q, i) => {
        const sel = document.querySelector(`input[name="question${i}"]:checked`);
        if (sel && parseInt(sel.value) === q.correct) correct++;
    });
    const score = Math.floor((correct / comprehensionQuestions.length) * 100);
    showTemporaryMessage(`Comprensión: ${correct}/${comprehensionQuestions.length} (${score}%)`, 'success');
    if (score >= 66) addPoints(30, 'comprensión lectora');
}

// --- Escritura ---
document.addEventListener('input', e => {
    if (e.target.id === 'writingExercise') {
        const words = e.target.value.trim().split(/\s+/).filter(w => w);
        document.getElementById('wordCount').textContent = `Palabras: ${words.length}`;
    }
});
function submitWriting() {
    const text = document.getElementById('writingExercise').value.trim();
    if (text.length < 50 || text.split(/\s+/).filter(w => w).length < 30) {
        return showTemporaryMessage('La carta debe tener al menos 30 palabras', 'error');
    }
    let pts = 20;
    if (/estimado|querido|sr\.|sra\./i.test(text)) pts += 10;
    if (/atentamente|cordialmente|saludos/i.test(text)) pts += 10;
    if (text.split(/\s+/).filter(w => w).length > 100) pts += 20;
    addPoints(pts, 'ejercicio de escritura');
    unlockAchievement('word_wizard');
}

// --- Inglés ---
function initEnglish() {
    displayVocabulary();
    generateEnglishQuiz();
}
function displayVocabulary() {
    const container = document.getElementById('vocabularyList');
    container.innerHTML = vocabulary.map(v => `
        <div class="bg-gray-50 p-3 rounded-lg hover:bg-blue-50 transition-all">
            <div class="flex justify-between items-start mb-1"><span class="font-semibold text-blue-600">${v.english}</span><span class="text-gray-600">${v.spanish}</span></div>
            <p class="text-sm text-gray-600 italic">"${v.example}"</p>
        </div>`).join('');
}
function generateEnglishQuiz() {
    const word = vocabulary[Math.floor(Math.random() * vocabulary.length)];
    const others = vocabulary.filter(w => w !== word).sort(() => 0.5 - Math.random()).slice(0, 2).map(w => w.spanish);
    const opts = [word.spanish, ...others].sort(() => 0.5 - Math.random());
    document.getElementById('englishQuestion').innerHTML = `<h4 class="font-semibold mb-2">What does "<span class="text-purple-600">${word.english}</span>" mean in Spanish?</h4><p class="text-sm text-gray-600">Example: "<em>${word.example}</em>"</p>`;
    document.getElementById('englishOptions').innerHTML = opts.map(o => `
        <label class="flex items-center space-x-2 p-2 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer transition-all">
            <input type="radio" name="englishAnswer" value="${o}" class="text-purple-600">
            <span>${o}</span>
        </label>`).join('');
    document.getElementById('englishResult').classList.add('hidden');
    window.currentEnglishWord = word;
}
function checkEnglishAnswer() {
    const selected = document.querySelector('input[name="englishAnswer"]:checked');
    if (!selected) return showTemporaryMessage('Select an answer', 'error');
    const correct = selected.value === window.currentEnglishWord.spanish;
    const resultDiv = document.getElementById('englishResult');
    if (correct) {
        gameState.english.quizScore++;
        resultDiv.innerHTML = `<div class="bg-green-100 text-green-800 p-3 rounded-lg"><i class="fas fa-check-circle mr-2"></i>Correct! Well done!</div>`;
        addPoints(15, 'vocabulario correcto');
        if (gameState.english.quizScore >= 10) unlockAchievement('english_expert');
    } else {
        resultDiv.innerHTML = `<div class="bg-red-100 text-red-800 p-3 rounded-lg"><i class="fas fa-times-circle mr-2"></i>Incorrect. The correct answer is "<strong>${window.currentEnglishWord.spanish}</strong>".</div>`;
    }
    resultDiv.classList.remove('hidden');
    setTimeout(generateEnglishQuiz, 2500);
}

// --- Pomodoro ---
let timerInterval;
function startTimer() {
    if (gameState.timer.isActive) return;
    gameState.timer.isActive = true;
    timerInterval = setInterval(() => {
        if (gameState.timer.seconds > 0) {
            gameState.timer.seconds--;
        } else if (gameState.timer.minutes > 0) {
            gameState.timer.minutes--;
            gameState.timer.seconds = 59;
        } else {
            clearInterval(timerInterval);
            gameState.timer.isActive = false;
            if (gameState.timer.mode === 'study') {
                gameState.timer.mode = 'break';
                gameState.timer.minutes = 5;
                gameState.timer.seconds = 0;
                gameState.todayStats.studyTime += 25;
                showTemporaryMessage('¡Sesión de estudio completada! Tiempo de descanso.', 'success');
                addPoints(25, 'sesión Pomodoro completa');
                if (Math.floor(gameState.totalPoints / 25) >= 5) unlockAchievement('pomodoro_pro');
            } else {
                gameState.timer.mode = 'study';
                gameState.timer.minutes = 25;
                gameState.timer.seconds = 0;
                showTemporaryMessage('Descanso terminado. ¡Hora de estudiar!', 'success');
            }
        }
        updateTimerDisplay();
        saveGameState();
    }, 1000);
}
function pauseTimer() { clearInterval(timerInterval); gameState.timer.isActive = false; saveGameState(); }
function resetTimer() { clearInterval(timerInterval); gameState.timer.isActive = false; gameState.timer.minutes = gameState.timer.mode === 'study' ? 25 : 5; gameState.timer.seconds = 0; updateTimerDisplay(); saveGameState(); }
function updateTimerDisplay() {
    const m = String(gameState.timer.minutes).padStart(2, '0');
    const s = String(gameState.timer.seconds).padStart(2, '0');
    document.getElementById('timerDisplay').textContent = `${m}:${s}`;
    document.getElementById('timerMode').textContent = `Modo: ${gameState.timer.mode === 'study' ? 'Estudio' : 'Descanso'}`;
}
function saveNotes() {
    gameState.notes = document.getElementById('quickNotes').value;
    saveGameState();
    showTemporaryMessage('Notas guardadas', 'success');
    addPoints(5, 'guardar notas');
}

// --- AI Assistant ---
document.getElementById('aiAssistantBtn').addEventListener('click', () => document.getElementById('aiAssistantModal').classList.toggle('hidden'));
document.getElementById('closeAI').addEventListener('click', () => document.getElementById('aiAssistantModal').classList.add('hidden'));
document.getElementById('sendMessage').addEventListener('click', sendChatMessage);
document.getElementById('chatInput').addEventListener('keydown', e => { if (e.key === 'Enter') sendChatMessage(); });
function sendChatMessage() {
    const input = document.getElementById('chatInput');
    const msg = input.value.trim();
    if (!msg) return;
    addChatBubble(msg, 'user');
    input.value = '';
    const reply = generateAIReply(msg);
    setTimeout(() => addChatBubble(reply, 'ai'), 600);
}
function addChatBubble(text, sender) {
    const container = document.getElementById('chatContainer');
    const div = document.createElement('div');
    div.className = `chat-message mb-2 ${sender === 'user' ? 'text-right' : ''}`;
    div.innerHTML = `<span class="inline-block p-2 rounded-lg text-sm max-w-xs ${sender === 'user' ? 'bg-purple-600 text-white' : 'bg-purple-100 text-purple-800'}">${text}</span>`;
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
}
function generateAIReply(msg) {
    const m = msg.toLowerCase();
    if (m.includes('matemática') || m.includes('math')) return "¡Excelente elección! Practica con nuestros problemas ecológicos. ¿Hay algún tema que te resulte difícil?";
    if (m.includes('lengua') || m.includes('escribir')) return "La escritura mejora con práctica. Usa saludo, desarrollo y despedida. ¿Quieres consejos para tu carta?";
    if (m.includes('inglés') || m.includes('english')) return "Great! Repite las palabras en frases propias. ¿Qué término se te dificulta?";
    if (m.includes('pomodoro') || m.includes('tiempo')) return "25 minutos de estudio intenso y 5 de descanso. ¡Funciona!";
    return "Puedes preguntarme sobre cualquier materia. ¡Tu progreso se guarda automáticamente!";
}
document.querySelectorAll('.ai-quick-btn').forEach(btn => btn.addEventListener('click', function () {
    const subject = this.dataset.subject;
    if (subject === 'help') {
        addChatBubble('Necesito ayuda general con mis estudios', 'user');
        setTimeout(() => addChatBubble('¡Perfecto! Esta app es 100 % libre. Explora sin restricciones.', 'ai'), 600);
    } else {
        showSection(subject);
        document.getElementById('aiAssistantModal').classList.add('hidden');
    }
}));

// --- Inicialización ---
document.addEventListener('DOMContentLoaded', () => {
    loadGameState();
    updateUI();
    updateTimerDisplay();
    updateMotivationalQuote();
    document.getElementById('startTimer').addEventListener('click', startTimer);
    document.getElementById('pauseTimer').addEventListener('click', pauseTimer);
    document.getElementById('resetTimer').addEventListener('click', resetTimer);
    document.getElementById('submitMathAnswer').addEventListener('click', checkMathAnswer);
    document.getElementById('checkComprehension').addEventListener('click', checkComprehension);
    document.getElementById('submitWriting').addEventListener('click', submitWriting);
    document.getElementById('submitEnglishAnswer').addEventListener('click', checkEnglishAnswer);
    document.getElementById('quickNotes').value = gameState.notes || '';
    setTimeout(() => { if (!gameState.achievements.includes('first_day')) unlockAchievement('first_day'); }, 2000);
});