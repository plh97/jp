const { useState, useEffect, useRef } = React;

// Hiragana, Katakana, Voiced Hiragana, and Voiced Katakana Data Models
const hiraganaData = {
    characters: [
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

const katakanaData = {
    characters: [
        ['ア', 'イ', 'ウ', 'エ', 'オ'],
        ['カ', 'キ', 'ク', 'ケ', 'コ'],
        ['サ', 'シ', 'ス', 'セ', 'ソ'],
        ['タ', 'チ', 'ツ', 'テ', 'ト'],
        ['ナ', 'ニ', 'ヌ', 'ネ', 'ノ'],
        ['ハ', 'ヒ', 'フ', 'ヘ', 'ホ'],
        ['マ', 'ミ', 'ム', 'メ', 'モ'],
        ['ヤ', 'ユ', 'ヨ'],
        ['ラ', 'リ', 'ル', 'レ', 'ロ'],
        ['ワ', 'ヲ', 'ン']
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

const voicedHiraganaData = {
    characters: [
        ['が', 'ぎ', 'ぐ', 'げ', 'ご'], // ga, gi, gu, ge, go
        ['だ', 'ぢ', 'づ', 'で', 'ど'], // da, ji, zu, de, do
        ['ざ', 'じ', 'ず', 'ぜ', 'ぞ'], // za, ji, zu, ze, zo
        ['ば', 'び', 'ぶ', 'べ', 'ぼ'], // ba, bi, bu, be, bo
        ['ぱ', 'ぴ', 'ぷ', 'ぺ', 'ぽ']  // pa, pi, pu, pe, po
    ],
    romaji: [
        ['ga', 'gi', 'gu', 'ge', 'go'],
        ['da', 'di', 'zu', 'de', 'do'],
        ['za', 'zi', 'zu', 'ze', 'zo'],
        ['ba', 'bi', 'bu', 'be', 'bo'],
        ['pa', 'pi', 'pu', 'pe', 'po']
    ]
};

const voicedKatakanaData = {
    characters: [
        ['ガ', 'ギ', 'グ', 'ゲ', 'ゴ'], // ga, gi, gu, ge, go
        ['ダ', 'ヂ', 'ヅ', 'デ', 'ド'], // da, ji, zu, de, do
        ['ザ', 'ジ', 'ズ', 'ゼ', 'ゾ'], // za, ji, zu, ze, zo
        ['バ', 'ビ', 'ブ', 'ベ', 'ボ'], // ba, bi, bu, be, bo
        ['パ', 'ピ', 'プ', 'ペ', 'ポ']  // pa, pi, pu, pe, po
    ],
    romaji: [
        ['ga', 'gi', 'gu', 'ge', 'go'],
        ['da', 'di', 'du', 'de', 'do'],
        ['za', 'zi', 'zu', 'ze', 'zo'],
        ['ba', 'bi', 'bu', 'be', 'bo'],
        ['pa', 'pi', 'pu', 'pe', 'po']
    ]
};

// Utility functions
const createCharacterToRomajiMap = (data) => {
    const map = new Map();
    data.characters.forEach((row, i) => {
        row.forEach((char, j) => map.set(char, data.romaji[i][j]));
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

// Character Card Component
const CharacterCard = ({ char, onAnswerCheck, characterSet }) => {
    const [inputValue, setInputValue] = useState('');
    const [isCorrect, setIsCorrect] = useState(null);
    const inputRef = useRef(null);

    const characterData = characterSet === 'hiragana' ? hiraganaData : 
                         characterSet === 'katakana' ? katakanaData : 
                         characterSet === 'voicedHiragana' ? voicedHiraganaData : 
                         voicedKatakanaData;
    const characterToRomaji = createCharacterToRomajiMap(characterData);
    const correctRomaji = characterToRomaji.get(char);

    const handleInputChange = (e) => {
        const value = e.target.value.replace(/\d/g, '');
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
            data-character={char}
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

// Tabs Component
const Tabs = ({ activeTab, onTabChange, score, total }) => {
    return (
        <div className="tabs-container">
            <div className="tabs">
                <button 
                    className={`tab-button ${activeTab === 'hiragana' ? 'active' : ''}`}
                    onClick={() => onTabChange('hiragana')}
                >
                    平假名
                </button>
                <button 
                    className={`tab-button ${activeTab === 'katakana' ? 'active' : ''}`}
                    onClick={() => onTabChange('katakana')}
                >
                    片假名
                </button>
                <button 
                    className={`tab-button ${activeTab === 'voicedHiragana' ? 'active' : ''}`}
                    onClick={() => onTabChange('voicedHiragana')}
                >
                    平假名浊音/半浊音
                </button>
                <button 
                    className={`tab-button ${activeTab === 'voicedKatakana' ? 'active' : ''}`}
                    onClick={() => onTabChange('voicedKatakana')}
                >
                    片假名浊音/半浊音
                </button>
            </div>
            <div className="score-display">
                得分: {score}/{total}
            </div>
        </div>
    );
};

// Main App Component
const App = () => {
    const [characterSet, setCharacterSet] = useState(() => localStorage.getItem('characterSet') || 'hiragana');
    const [shuffledCharacters, setShuffledCharacters] = useState([]);
    const [correctAnswers, setCorrectAnswers] = useState(0);
    const [showWinMessage, setShowWinMessage] = useState(false);

    const getCharacterData = () => {
        if (characterSet === 'hiragana') return hiraganaData;
        if (characterSet === 'katakana') return katakanaData;
        if (characterSet === 'voicedHiragana') return voicedHiraganaData;
        if (characterSet === 'voicedKatakana') return voicedKatakanaData;
        return hiraganaData; // 默认值，防止 undefined
    };

    const totalQuestions = getCharacterData().characters.flat().length;
    const attemptsRef = useRef(new Map());

    const initializeGame = () => {
        const allCharacters = getCharacterData().characters.flat();
        const shuffled = shuffleArray(allCharacters);
        setShuffledCharacters(shuffled);
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
    }, [characterSet]);

    const handleCharacterSetChange = (set) => {
        setCharacterSet(set);
        localStorage.setItem('characterSet', set);
    };

    const handleAnswerCheck = (character, isCorrect) => {
        const record = attemptsRef.current.get(character);
        record.attempts++;
        if (isCorrect && !record.correct) {
            record.correct = true;
            setCorrectAnswers(prev => prev + 1);
        }
        if (correctAnswers + 1 === totalQuestions) {
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
            <Tabs 
                activeTab={characterSet} 
                onTabChange={handleCharacterSetChange}
                score={correctAnswers}
                total={totalQuestions}
            />
            <div className="container">
                <div className="hiragana-area">
                    {shuffledCharacters.map((char, index) => (
                        <CharacterCard 
                            key={index + characterSet} 
                            char={char} 
                            onAnswerCheck={handleAnswerCheck}
                            characterSet={characterSet}
                        />
                    ))}
                </div>
            </div>
            <button className="reset-button" onClick={handleReset}>重置</button>
            {showWinMessage && (
                <div className="win-message">恭喜你！全部答对了！</div>
            )}
        </>
    );
};

// Render the app
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App tab="home" />);