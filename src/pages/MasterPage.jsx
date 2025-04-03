import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import FlashCard from '../components/FlashCard';
import Title from '../components/Title';
import SetCards from '../components/SetCards';
import confetti from 'canvas-confetti';

// flip, 0, flip, 1, mult, 2, mult, 3, type, 4, type, 5
const MasterPage = () => {
    const { id } = useParams();
    var wrong = false; 
    const numLevels = 5;
    const interval = 10;
    const [flip, setFlip] = useState(false);
    const [completed, setCompleted] = useState(false);
    const [index, setIndex] = useState(0);
    const [totalDone, setTotalDone] = useState(0);
    const [randomized, setRandomized] = useState(false);
    const [set, setOriginalSet] = useState(() => {
        const storedData = JSON.parse(localStorage.getItem(id));
        return storedData ? storedData.set : null;
    });
    if (!randomized) {
        randomize(set);
        setRandomized(true);
    } 

    if (set[index].Mastery >= numLevels) {
        setIndex((index + 1) % set.length);
    }

    function randomize(arr) {
        // A Fisher-Yates shuffle
        for (let i = arr.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1)); 
            [arr[i], arr[j]] = [arr[j], arr[i]];
        } 
    }

    function testRadio(event, guess, id) {
        event.preventDefault();
        if (guess === set[index].Definition) {
            if (!wrong) set[index].Mastery = set[index].Mastery + 1;
            setIndex((index + 1) % set.length);
            setTotalDone(totalDone + 1);
            setCompleted(false);
        } else {
            flashRed(document.getElementById("option" + id));
            wrong = "true";
        }
    }

    function flashRed(element) {
        let originalColor = element.style.backgroundColor;
        
        // Clear ongoing transitions
        element.style.transition = "none";
        element.style.backgroundColor = "rgba(255, 0, 0, 0.3)"; 
    
        void element.offsetWidth;
    
        element.style.transition = "background-color 0.5s ease"; 
    
        setTimeout(function() {
            element.style.backgroundColor = originalColor;
        }, 200); 
    }

    function switchRight() {
        set[index].Mastery = set[index].Mastery + 1;
        setIndex((index + 1) % set.length);
        setTotalDone(totalDone + 1);
        setCompleted(false);
    }

    function generateRandom(exclude) { // Improve runtime in the future
        const randomNumbers = new Set();
        while (randomNumbers.size < 3) {
            var randomNumber = Math.floor(Math.random() * (set.length-1));
            while (randomNumber == exclude || randomNumbers.has(randomNumber)) {
                randomNumber = (randomNumber + 1) % set.length;
            }

            randomNumbers.add(randomNumber);
        }

        randomNumbers.add(exclude);

        return [...randomNumbers];
    }

    const triggerConfetti = () => {
        confetti({
          particleCount: 100,
          spread: 160,
          origin: { x: 0.5, y: 0.5 },
          zIndex: -1,
          duration: 200,
          disableForReducedMotion: true
        });
    }
    
    useEffect(() => {
        const handleKeyDown = (event) => {
            event.preventDefault();
            if (totalDone == interval) {
                setTotalDone(0);
            } else if (set[index].Mastery < 2) {
                if (event.key === " "|| event.key === "ArrowUp" || event.key === "ArrowDown") {
                    setFlip(!flip);
                    setCompleted(true);
                } else if (event.key === "ArrowRight") {
                    if (completed) {
                        if (flip) {
                            setFlip(false);
                            setTimeout(switchRight, 50); // Without delay when flipping, people could cheat!
                        } else {
                            switchRight();
                        }
                    }
                }
            }
        };

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [flip, index, totalDone]);

    if (totalDone == interval) {
        localStorage.setItem(id, JSON.stringify({set}));
        return (
            <div>
                <Title title={id} back="true" />
                <h1 className="centerText continue"> Great job, press any button to continue</h1>
                <SetCards setname={id} />
            </div>
        );
    }

    if (set[index].Mastery < 2) {
        return (
            <>
                <Title title={id} back="true" />
                <div id="cardinfo">
                    <p id="cardnumber">{totalDone + 1 + " out of " + interval}</p>
                </div>
                {(set[index].Mastery == 0)? 
                <FlashCard term={set[index].Term} definition={set[index].Definition} flip={flip}/>:
                <FlashCard term={set[index].Definition} definition={set[index].Term} flip={flip}/>}
            </>
        );
    } else {
        var choices = generateRandom(index);
        randomize(choices);
        return (
            <>
                <Title title={id} back="true" />
                <div id="cardinfo">
                    <p className="centerText">{totalDone + 1 + " out of " + interval}</p>
                </div>
                <h1 className="centerText">{set[index].Term}</h1>
                <form>
                    <div className="cardContainer">
                        <button id="option0" className="smallCard" onClick={() => testRadio(event, set[choices[0]].Definition, 0)}>
                            <h1 id="cardtext">{set[choices[0]].Definition}</h1>
                        </button>
                        <button id="option1" className="smallCard" onClick={() => testRadio(event, set[choices[1]].Definition, 1)}>
                            <h1 id="cardtext">{set[choices[1]].Definition}</h1>
                        </button>
                    </div>
                    <div className="cardContainer">
                        <button id="option2" className="smallCard" onClick={() => testRadio(event, set[choices[2]].Definition, 2)}>
                            <h1 id="cardtext">{set[choices[2]].Definition}</h1>
                        </button>
                        <button id="option3" className="smallCard" onClick={() => testRadio(event, set[choices[3]].Definition, 3)}>
                            <h1 id="cardtext">{set[choices[3]].Definition}</h1>
                        </button>
                    </div>
                </form>
            </>
        );
    }
};

export default MasterPage;