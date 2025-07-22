import React, { useState, useEffect } from 'react';
import { BookOpen, Calculator, Globe, Trophy, Clock, MessageCircle, Target, Star, Leaf, Sparkles, Brain, Award, CheckCircle, Play, Pause, RotateCcw } from 'lucide-react';

const PachamamaCenter = () => {
  const [currentSection, setCurrentSection] = useState('home');
  const [progress, setProgress] = useState(35);
  const [showAI, setShowAI] = useState(false);
  const [achievements, setAchievements] = useState([]);
  const [dailyStreak, setDailyStreak] = useState(3);
  const [totalPoints, setTotalPoints] = useState(850);
  const [notes, setNotes] = useState('');
  const [timerMinutes, setTimerMinutes] = useState(25);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [timerMode, setTimerMode] = useState('study');
  const [completedTasks, setCompletedTasks] = useState({});
  const [mathProblems, setMathProblems] = useState([]);
  const [currentProblem, setCurrentProblem] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);

  const dailyPhrases = [
    "🌱 Cada día de estudio es una semilla que plantas para tu futuro",
    "🌿 Como las plantas del Colegio Pachamama, tú también crecerás con dedicación",
    "🦋 La transformación comienza con pequeños pasos constantes",
    "🌳 Tus raíces de conocimiento se fortalecen cada día",
    "🌸 Florece con confianza, Benji. ¡Estás preparándote increíble!"
  ];

  const availableAchievements = [
    { id: 1, name: "Primer Día Completo", icon: "🌱", description: "Completaste tu primera sesión de estudio" },
    { id: 2, name: "Matemático Ecológico", icon: "🔢", description: "Resolviste 10 problemas matemáticos" },
    { id: 3, name: "Lector Ambiental", icon: "📚", description: "Completaste una lectura sobre medio ambiente" },
    { id: 4, name: "Explorador Bilingüe", icon: "🌐", description: "Practicaste vocabulario en inglés" },
    { id: 5, name: "Racha de 3 días", icon: "🔥", description: "Estudiaste 3 días consecutivos" },
    { id: 6, name: "Maestro Pomodoro", icon: "⏰", description: "Completaste 5 sesiones Pomodoro" },
  ];

  useEffect(() => {
    let interval = null;
    if (isTimerActive && (timerMinutes > 0 || timerSeconds > 0)) {
      interval = setInterval(() => {
        if (timerSeconds > 0) {
          setTimerSeconds(timerSeconds - 1);
        } else if (timerMinutes > 0) {
          setTimerMinutes(timerMinutes - 1);
          setTimerSeconds(59);
        }
      }, 1000);
    } else if (isTimerActive && timerMinutes === 0 && timerSeconds === 0) {
      setIsTimerActive(false);
      if (timerMode === 'study') {
        setTimerMode('break');
        setTimerMinutes(5);
        alert('¡Excelente! Tiempo de descanso. Tómate 5 minutos para relajarte 🌿');
        addPoints(50);
      } else {
        setTimerMode('study');
        setTimerMinutes(25);
        alert('¡Descanso terminado! Es hora de continuar estudiando 📚');
      }
    }
    return () => clearInterval(interval);
  }, [isTimerActive, timerMinutes, timerSeconds, timerMode]);

  const generateMathProblems = () => {
    const problems = [];
    for (let i = 0; i < 5; i++) {
      const type = Math.random() > 0.5 ? 'eco' : 'basic';
      let problem;

      if (type === 'eco') {
        const scenarios = [
          {
            question: "En el Colegio Pachamama se plantaron 35 árboles. Si cada árbol absorbe 22 kg de CO2 al año, ¿cuánto CO2 absorberán todos los árboles juntos?",
            answer: 770
          },
          {
            question: "Los estudiantes de Pachamama recolectaron 144 botellas para reciclar. Si las organizan en grupos de 12, ¿cuántos grupos completos pueden formar?",
            answer: 12
          }
        ];

        const scenario = scenarios[Math.floor(Math.random() * scenarios.length)];
        const answer = scenario.answer;

        problem = {
          question: scenario.question,
          answer: answer,
          options: [answer, answer + Math.floor(Math.random() * 20) + 1, answer - Math.floor(Math.random() * 20) - 1, answer + Math.floor(Math.random() * 50) + 20]
        };
      } else {
        const a = Math.floor(Math.random() * 20) + 1;
        const b = Math.floor(Math.random() * 20) + 1;
        const operations = ['+', '-', '*'];
        const op = operations[Math.floor(Math.random() * operations.length)];

        let answer;
        switch(op) {
          case '+': answer = a + b; break;
          case '-': answer = Math.abs(a - b); break;
          case '*': answer = a * b; break;
          default: answer = a + b;
        }

        problem = {
          question: `${Math.max(a,b)} ${op} ${Math.min(a,b)} = ?`,
          answer: answer,
          options: [answer, answer + Math.floor(Math.random() * 10) + 1, answer - Math.floor(Math.random() * 10) - 1, answer + Math.floor(Math.random() * 20) + 5]
        };
      }

      problem.options = problem.options.sort(() => Math.random() - 0.5);
      problems.push(problem);
    }
    setMathProblems(problems);
    setCurrentProblem(0);
    setCorrectAnswers(0);
  };

  const addPoints = (points) => {
    setTotalPoints(prev => prev + points);
    setProgress(prev => Math.min(prev + 2, 100));
  };

  const unlockAchievement = (id) => {
    if (!achievements.find(a => a.id === id)) {
      const achievement = availableAchievements.find(a => a.id === id);
      setAchievements(prev => [...prev, achievement]);
      addPoints(100);
    }
  };

  const completeTask = (taskId) => {
    setCompletedTasks(prev => ({...prev, [taskId]: true}));
    addPoints(25);
  };

  const FloatingElements = () => (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="absolute animate-pulse text-2xl opacity-20"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${i * 0.5}s`,
            animationDuration: `${3 + Math.random() * 2}s`
          }}
        >
          {['🌱', '🌿', '🦋', '🌸', '🍃', '🌳'][i]}
        </div>
      ))}
    </div>
  );

  const NavigationBar = () => (
    <nav className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-4 shadow-lg backdrop-blur-sm">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Leaf className="w-8 h-8" />
          <h1 className="text-xl font-bold">Centro Pachamama</h1>
        </div>

        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2 bg-white/20 px-3 py-1 rounded-full">
            <Star className="w-4 h-4" />
            <span className="text-sm font-medium">{totalPoints} pts</span>
          </div>
          <div className="flex items-center space-x-2 bg-white/20 px-3 py-1 rounded-full">
            <Trophy className="w-4 h-4" />
            <span className="text-sm font-medium">{dailyStreak} días</span>
          </div>
          <div className="w-24 bg-white/30 rounded-full h-2">
            <div
              className="bg-yellow-300 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <button
            onClick={() => setShowAI(true)}
            className="bg-white/20 p-2 rounded-full hover:bg-white/30 transition-colors"
          >
            <Brain className="w-5 h-5" />
          </button>
        </div>
      </div>
    </nav>
  );

  const AIAssistant = () => (
    <div className={`fixed inset-0 bg-black/50 flex items-center justify-center z-50 transition-all duration-300 ${showAI ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      <div className="bg-white rounded-2xl p-6 max-w-md w-full m-4 transform transition-all duration-300 scale-95 hover:scale-100">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-green-700 flex items-center">
            <Brain className="w-6 h-6 mr-2" />
            Asistente Pachamama
          </h3>
          <button
            onClick={() => setShowAI(false)}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="space-y-4">
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-green-800 text-sm">
              ¡Hola Benji! 🌱 Estoy aquí para ayudarte en tu preparación. ¿En qué materia te gustaría enfocarte hoy?
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2">
            {[
              { text: "Ayuda con Matemáticas 🔢", section: "math" },
              { text: "Práctica de Lengua 📖", section: "language" },
              { text: "Vocabulario en Inglés 🌐", section: "english" },
              { text: "Técnicas de estudio 🎯", section: "study" }
            ].map((option, i) => (
              <button
                key={i}
                onClick={() => {
                  setCurrentSection(option.section);
                  setShowAI(false);
                }}
                className="text-left p-3 bg-gray-50 hover:bg-green-100 rounded-lg transition-colors text-sm"
              >
                {option.text}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const PomodoroTimer = () => (
    <div className="bg-white rounded-xl p-6 shadow-lg">
      <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
        <Clock className="w-5 h-5 mr-2" />
        Cronómetro Pomodoro
      </h3>

      <div className="text-center">
        <div className={`text-4xl font-mono mb-4 ${timerMode === 'study' ? 'text-green-600' : 'text-blue-600'}`}>
          {String(timerMinutes).padStart(2, '0')}:{String(timerSeconds).padStart(2, '0')}
        </div>

        <div className="mb-4">
          <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
            timerMode === 'study'
              ? 'bg-green-100 text-green-800'
              : 'bg-blue-100 text-blue-800'
          }`}>
            {timerMode === 'study' ? '📚 Estudiando' : '☕ Descanso'}
          </span>
        </div>

        <div className="flex justify-center space-x-3">
          <button
            onClick={() => setIsTimerActive(!isTimerActive)}
            className="flex items-center space-x-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
          >
            {isTimerActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{isTimerActive ? 'Pausar' : 'Iniciar'}</span>
          </button>

          <button
            onClick={() => {
              setIsTimerActive(false);
              setTimerMinutes(timerMode === 'study' ? 25 : 5);
              setTimerSeconds(0);
            }}
            className="flex items-center space-x-2 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reiniciar</span>
          </button>
        </div>
      </div>
    </div>
  );

  const HomePage = () => (
    <div className="space-y-8">
      <div className="text-center py-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          ¡Bienvenido de vuelta, Benji! 🌟
        </h2>
        <p className="text-lg text-green-700 mb-6">
          {dailyPhrases[dailyStreak % dailyPhrases.length]}
        </p>

        <div className="bg-gradient-to-r from-green-100 to-emerald-100 p-6 rounded-2xl max-w-2xl mx-auto">
          <h3 className="text-xl font-semibold text-gray-800 mb-3">Tu Progreso Hoy</h3>
          <div className="w-full bg-white rounded-full h-4 mb-4">
            <div
              className="bg-gradient-to-r from-green-400 to-emerald-500 h-4 rounded-full transition-all duration-1000"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-green-700 font-medium">{progress}% completado</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="grid gap-4">
            {[
              { id: 'math', icon: Calculator, title: 'Misión Matemática', color: 'from-blue-500 to-purple-600', desc: 'Resuelve problemas ecológicos' },
              { id: 'language', icon: BookOpen, title: 'Lengua Exploradora', color: 'from-green-500 to-teal-600', desc: 'Comprensión y escritura' },
              { id: 'english', icon: Globe, title: 'Inglés Superviviente', color: 'from-orange-500 to-red-600', desc: 'Vocabulario y práctica' }
            ].map((section) => (
              <button
                key={section.id}
                onClick={() => setCurrentSection(section.id)}
                className={`relative overflow-hidden bg-gradient-to-r ${section.color} text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 group`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <section.icon className="w-8 h-8" />
                    <div className="text-left">
                      <h3 className="text-lg font-bold">{section.title}</h3>
                      <p className="text-sm opacity-90">{section.desc}</p>
                    </div>
                  </div>
                  <div className="text-2xl group-hover:scale-110 transition-transform">
                    {completedTasks[section.id] ? '✅' : '🎯'}
                  </div>
                </div>
              </button>
            ))}
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
              <Award className="w-5 h-5 mr-2" />
              Logros Recientes
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {achievements.slice(-4).map((achievement, i) => (
                <div key={i} className="bg-gradient-to-r from-yellow-100 to-orange-100 p-3 rounded-lg text-center">
                  <div className="text-2xl mb-1">{achievement.icon}</div>
                  <p className="text-xs font-medium text-gray-700">{achievement.name}</p>
                </div>
              ))}
              {achievements.length === 0 && (
                <div className="col-span-2 text-center text-gray-500 py-4">
                  ¡Completa actividades para desbloquear logros! 🏆
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <PomodoroTimer />

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
              <MessageCircle className="w-5 h-5 mr-2" />
              Notas Rápidas
            </h3>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Escribe aquí tus ideas, recordatorios o conceptos importantes..."
              className="w-full h-32 p-3 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const MathSection = () => {
    const [quizStarted, setQuizStarted] = useState(false);

    const handleAnswer = (answer) => {
      setSelectedAnswer(answer);
      setShowResult(true);

      if (answer === mathProblems[currentProblem].answer) {
        setCorrectAnswers(prev => prev + 1);
        addPoints(20);
      }

      setTimeout(() => {
        if (currentProblem < mathProblems.length - 1) {
          setCurrentProblem(prev => prev + 1);
          setSelectedAnswer('');
          setShowResult(false);
        } else {
          if (correctAnswers >= 3) {
            unlockAchievement(2);
            completeTask('math');
          }
          alert(`¡Quiz terminado! Respuestas correctas: ${correctAnswers + (answer === mathProblems[currentProblem].answer ? 1 : 0)}/${mathProblems.length}`);
          setQuizStarted(false);
          setCurrentProblem(0);
          setCorrectAnswers(0);
          setShowResult(false);
        }
      }, 2000);
    };

    if (!quizStarted) {
      return (
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-4 flex items-center justify-center">
              <Calculator className="w-8 h-8 mr-3" />
              Misión Matemática 🔢
            </h2>
            <p className="text-lg text-gray-600">
              Resuelve problemas matemáticos con temática ecológica del Colegio Pachamama
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Desafío Diario</h3>
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-blue-800 font-medium">Problema del día:</p>
                  <p className="text-gray-700 mt-2">
                    En el huerto de Pachamama crecieron 24 plantas de tomate. Si cada planta produce 8 tomates y se cosechan durante 3 semanas, ¿cuántos tomates se recolectarán en total?
                  </p>
                  <button
                    onClick={() => addPoints(30)}
                    className="mt-3 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Resolver problema (Respuesta: 576)
                  </button>
                </div>

                <button
                  onClick={() => {
                    generateMathProblems();
                    setQuizStarted(true);
                  }}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                >
                  🚀 Iniciar Quiz Matemático
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Recursos Externos</h3>
              <div className="space-y-3">
                {[
                  { name: 'Khan Academy', url: 'https://khan-academy.org', color: 'bg-blue-500', desc: 'Videos educativos' },
                  { name: 'GeoGebra', url: 'https://geogebra.org', color: 'bg-green-500', desc: 'Matemáticas interactivas' },
                  { name: 'Profe en C@sa', url: 'https://recursos.educacion.gob.ec', color: 'bg-red-500', desc: 'Recursos MinEduc' }
                ].map((resource, i) => (
                  <a
                    key={i}
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`block ${resource.color} text-white p-4 rounded-lg hover:shadow-lg transition-all duration-300 transform hover:scale-105`}
                  >
                    <div className="font-semibold">{resource.name}</div>
                    <div className="text-sm opacity-90">{resource.desc}</div>
                  </a>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={() => setCurrentSection('home')}
            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
          >
            ← Volver al inicio
          </button>
        </div>
      );
    }

    return (
      <div className="max-w-2xl mx-auto bg-white rounded-xl p-8 shadow-lg">
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-gray-800 mb-2">Quiz Matemático</h3>
          <p className="text-gray-600">Problema {currentProblem + 1} de {mathProblems.length}</p>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentProblem + 1) / mathProblems.length) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="mb-6">
          <p className="text-lg text-gray-800 mb-6 p-4 bg-gray-50 rounded-lg">
            {mathProblems[currentProblem]?.question}
          </p>

          <div className="grid grid-cols-2 gap-3">
            {mathProblems[currentProblem]?.options.map((option, i) => (
              <button
                key={i}
                onClick={() => !showResult && handleAnswer(option)}
                disabled={showResult}
                className={`p-3 rounded-lg border-2 transition-all duration-300 ${
                  showResult
                    ? option === mathProblems[currentProblem].answer
                      ? 'bg-green-100 border-green-500 text-green-800'
                      : option === selectedAnswer
                      ? 'bg-red-100 border-red-500 text-red-800'
                      : 'bg-gray-100 border-gray-300'
                    : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Respuestas correctas: {correctAnswers}/{currentProblem + (showResult ? 1 : 0)}
          </p>
        </div>
      </div>
    );
  };

  const LanguageSection = () => (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-4 flex items-center justify-center">
          <BookOpen className="w-8 h-8 mr-3" />
          Lengua Exploradora 📖
        </h2>
        <p className="text-lg text-gray-600">
          Mejora tu comprensión lectora y habilidades de escritura
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Lectura del Día</h3>
          <div className="space-y-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-semibold text-green-800 mb-2">
                El Colegio Pachamama y la Sostenibilidad
              </h4>
              <p className="text-gray-700 text-sm leading-relaxed">
                El Colegio Pachamama es pionero en educación ambiental en Ecuador. Su enfoque pedagógico integra el cuidado del medio ambiente con la excelencia académica. Los estudiantes participan activamente en proyectos de conservación, huertos orgánicos y programas de reciclaje que forman ciudadanos conscientes de su responsabilidad ecológica.
              </p>
            </div>

            <div className="space-y-2">
              <p className="font-medium text-gray-800">Preguntas de comprensión:</p>
              {[
                "¿Qué hace pionero al Colegio Pachamama?",
                "¿Cómo integra la institución el cuidado ambiental?",
                "¿Qué actividades realizan los estudiantes?"
              ].map((question, i) => (
                <div key={i} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    onChange={(e) => e.target.checked && addPoints(10)}
                    className="text-green-500"
                  />
                  <label className="text-sm text-gray-700">{question}</label>
                </div>
              ))}
            </div>

            <button
              onClick={() => {
                completeTask('language');
                unlockAchievement(3);
              }}
              className="w-full bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
            >
              Completar lectura
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Ejercicio de Escritura</h3>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Escribe aquí tu carta de iniciativa ambiental..."
            className="w-full h-48 p-3 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-green-500"
          ></textarea>
          <button
            onClick={() => {
              addPoints(40);
              completeTask('language');
            }}
            className="w-full mt-3 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Entregar ejercicio
          </button>
        </div>
      </div>

      <button
        onClick={() => setCurrentSection('home')}
        className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
      >
        ← Volver al inicio
      </button>
    </div>
  );

  const EnglishSection = () => (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-4 flex items-center justify-center">
          <Globe className="w-8 h-8 mr-3" />
          Inglés Superviviente 🌐
        </h2>
        <p className="text-lg text-gray-600">
          Aprende vocabulario clave sobre el medio ambiente
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Tarjetas de Vocabulario</h3>
          <div className="space-y-3">
            {[
              { en: "Environment", es: "Medio ambiente" },
              { en: "Recycle", es: "Reciclar" },
              { en: "Sustainable", es: "Sostenible" },
              { en: "Pollution", es: "Contaminación" },
              { en: "Conservation", es: "Conservación" }
            ].map((word, i) => (
              <div key={i} className="bg-purple-50 p-4 rounded-lg flex justify-between items-center">
                <span className="font-semibold text-purple-800">{word.en}</span>
                <span className="text-gray-600">{word.es}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Prueba Rápida</h3>
          <div className="space-y-4">
            <div>
              <p className="text-gray-700 mb-2">¿Qué significa <span className="font-bold">"Sustainable"</span>?</p>
              <div className="flex flex-col space-y-2">
                {["Sostenible", "Rápido", "Contaminado"].map((option, i) => (
                  <button key={i} onClick={() => { if (option === "Sostenible") { addPoints(15); completeTask('english'); unlockAchievement(4); } }} className="text-left p-2 bg-gray-100 hover:bg-purple-100 rounded-lg transition-colors">
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-gray-700 mb-2">Traduce <span className="font-bold">"Reciclar"</span> al inglés:</p>
              <input type="text" className="w-full p-2 border rounded-lg" placeholder="Escribe aquí..." />
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={() => setCurrentSection('home')}
        className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
      >
        ← Volver al inicio
      </button>
    </div>
  );

  const renderSection = () => {
    switch (currentSection) {
      case 'math':
        return <MathSection />;
      case 'language':
        return <LanguageSection />;
      case 'english':
        return <EnglishSection />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen font-sans text-gray-800">
      <FloatingElements />
      <div className="relative z-10">
        <NavigationBar />
        <AIAssistant />
        <main className="max-w-6xl mx-auto p-4 md:p-6 lg:p-8">
          {renderSection()}
        </main>
      </div>
    </div>
  );
};

export default PachamamaCenter;
