const { useState, useEffect, useRef } = React;

// Hiragana Data Model (unchanged from original)
const hiraganaData = {
    hiragana: [
        ['あ', 'い', 'う', 'え', 'お'],
        ['か', 'き', 'く', 'け', 'こ'],
        ['さ', 'し', 'す', 'せ', 'そ'],
        ['た', 'ち', 'つ', 'て', 'と'],
        ['な', 'に', 'ぬ', 'ね', 'の'],
        ['は', 'ひ', 'ふ', 'へ', 'ほ'],
        ['ま', 'み', 'む', 'め', 'も'],
        ['や', 'ゆ', 'よ'],
        ['ら', 'り', 'る', 'れ', 'ろ'],
        ['わ', 'を', 'ん']
    ],
    romaji: [
        ['a', 'i', 'u', 'e', 'o'],
        ['ka', 'ki', 'ku', 'ke', 'ko'],
        ['sa', 'shi', 'su', 'se', 'so'],
        ['ta', 'chi', 'tsu', 'te', 'to'],
        ['na', 'ni', 'nu', 'ne', 'no'],
        ['ha', 'hi', 'fu', 'he', 'ho'],
        ['ma', 'mi', 'mu', 'me', 'mo'],
        ['ya', 'yu', 'yo'],
        ['ra', 'ri', 'ru', 're', 'ro'],
        ['wa', 'wo', 'n']
    ]
};

// Utility functions
const createHiraganaToRomajiMap = () => {
    const map = new Map();
    hiraganaData.hiragana.forEach((row, i) => {
        row.forEach((char, j) => map.set(char, hiraganaData.romaji[i][j]));
    });
    return map;
};

const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
};

// Hiragana Card Component
const HiraganaCard = ({ char, onAnswerCheck }) => {
    const [inputValue, setInputValue] = useState('');
    const [isCorrect, setIsCorrect] = useState(null);
    const inputRef = useRef(null);

    const hiraganaToRomaji = createHiraganaToRomajiMap();
    const correctRomaji = hiraganaToRomaji.get(char);

    const handleInputChange = (e) => {
        const value = e.target.value.replace(/\d/g, ''); // Filter out numbers
        setInputValue(value);
    };

    const checkAnswer = () => {
        if (!inputValue.trim()) return;
        const correct = inputValue.toLowerCase() === correctRomaji;
        setIsCorrect(correct);
        onAnswerCheck(char, correct);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            checkAnswer();
        }
    };

    const handleBlur = () => {
        if (inputValue.trim()) checkAnswer();
    };

    const handleClick = () => {
        if (inputRef.current && isCorrect === null) inputRef.current.focus();
    };

    return (
        <div
            className={`hiragana-card ${isCorrect === true ? 'correct' : isCorrect === false ? 'incorrect' : ''}`}
            data-hiragana={char}
            onClick={handleClick}
        >
            <div className="hiragana-display">{char}</div>
            <div className="input-container">
                {isCorrect === true ? (
                    <span className="romaji-answer">{correctRomaji}</span>
                ) : (
                    <input
                        type="text"
                        className="romaji-input"
                        placeholder="..."
                        value={inputValue}
                        onChange={handleInputChange}
                        onKeyPress={handleKeyPress}
                        onBlur={handleBlur}
                        ref={inputRef}
                    />
                )}
            </div>
        </div>
    );
};

// Main App Component
const App = () => {
    const [shuffledHiragana, setShuffledHiragana] = useState([]);
    const [correctAnswers, setCorrectAnswers] = useState(0);
    const [showWinMessage, setShowWinMessage] = useState(false);
    const totalQuestions = hiraganaData.hiragana.flat().length;
    const attemptsRef = useRef(new Map());

    const initializeGame = () => {
        const allHiragana = hiraganaData.hiragana.flat();
        const shuffled = shuffleArray(allHiragana);
        setShuffledHiragana(shuffled);
        setCorrectAnswers(0);
        setShowWinMessage(false);
        const newAttempts = new Map();
        shuffled.forEach(char => {
            newAttempts.set(char, { correct: false, attempts: 0 });
        });
        attemptsRef.current = newAttempts;
    };

    useEffect(() => {
        initializeGame();
    }, []);

    const handleAnswerCheck = (hiragana, isCorrect) => {
        const record = attemptsRef.current.get(hiragana);
        record.attempts++;
        if (isCorrect && !record.correct) {
            record.correct = true;
            setCorrectAnswers(prev => prev + 1);
        }
        if (correctAnswers === totalQuestions) {
            setShowWinMessage(true);
        }
    };

    const handleReset = () => {
        initializeGame();
    };

    const focusNextEmptyOrIncorrect = () => {
        const cards = document.querySelectorAll('.hiragana-card');
        const activeElement = document.activeElement;
        const currentCard = activeElement ? activeElement.closest('.hiragana-card') : null;
        console.log(currentCard);
        if (currentCard) {
            const currentIndex = Array.from(cards).indexOf(currentCard);
            for (let i = currentIndex + 1; i < cards.length; i++) {
                const input = cards[i].querySelector('.romaji-input');
                if (input && (!input.value.trim() || cards[i].classList.contains('incorrect'))) {
                    input.focus();
                    return;
                }
            }
        }

        for (let card of cards) {
            const input = card.querySelector('.romaji-input');
            if (input && (!input.value.trim() || card.classList.contains('incorrect'))) {
                input.focus();
                return;
            }
        }
    };

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Enter') {
                const activeElement = document.activeElement;
                if (activeElement && activeElement.classList.contains('romaji-input')) {
                    e.preventDefault();
                    focusNextEmptyOrIncorrect();
                }
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [correctAnswers]);

    return (
        <>
            <h1 className="page-title">平假名练习</h1>
            <div className="container">
                <div className="hiragana-area">
                    {shuffledHiragana.map((char, index) => (
                        <HiraganaCard key={index} char={char} onAnswerCheck={handleAnswerCheck} />
                    ))}
                </div>
            </div>
            <div className="score-display">
                得分: {correctAnswers}/{totalQuestions}
            </div>
            <button className="reset-button" onClick={handleReset}>重置</button>
            {showWinMessage && (
                <div className="win-message">恭喜你！全部答对了！</div>
            )}
        </>
    );
};

// Render the app
ReactDOM.render(<App />, document.getElementById('root'));