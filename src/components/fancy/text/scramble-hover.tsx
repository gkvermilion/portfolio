import { useEffect, useState } from 'react';
import { motion } from 'motion/react';

interface ScrambleHoverProps {
  text: string;
  scrambleSpeed?: number;
  maxIterations?: number;
  useOriginalCharsOnly?: boolean;
  characters?: string;
  active?: boolean;
  className?: string;
  scrambledClassName?: string;
}

export default function ScrambleHover({
  text,
  scrambleSpeed = 70,
  maxIterations = 3,
  useOriginalCharsOnly = true,
  characters = "abcdefghijklmnopqrstuvwxyz!@#$%^&*()_+-=[]{}|;':,./<?>",
  active,
  className = '',
  scrambledClassName = '',
}: ScrambleHoverProps) {
  const [displayText, setDisplayText] = useState(text);
  const [isHovering, setIsHovering] = useState(false);
  const [isScrambling, setIsScrambling] = useState(false);

  const isActive = active ?? isHovering;

  useEffect(() => {
    if (!isActive || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDisplayText(text);
      setIsScrambling(false);
      return undefined;
    }

    const letters = Array.from(text);
    const availableCharacters = useOriginalCharsOnly
      ? letters.filter((letter) => !/\s/.test(letter))
      : Array.from(characters);
    let iteration = 0;

    const shuffle = () => {
      const shuffledCharacters = [...availableCharacters];
      if (useOriginalCharsOnly) {
        for (let index = shuffledCharacters.length - 1; index > 0; index -= 1) {
          const swapIndex = Math.floor(Math.random() * (index + 1));
          [shuffledCharacters[index], shuffledCharacters[swapIndex]] = [shuffledCharacters[swapIndex], shuffledCharacters[index]];
        }
      }

      let shuffledIndex = 0;
      return letters.map((letter) => {
        if (/\s/.test(letter)) return letter;
        if (!useOriginalCharsOnly) return shuffledCharacters[Math.floor(Math.random() * shuffledCharacters.length)] || letter;
        const next = shuffledCharacters[shuffledIndex] || letter;
        shuffledIndex += 1;
        return next;
      }).join('');
    };

    setIsScrambling(true);
    const interval = window.setInterval(() => {
      iteration += 1;
      setDisplayText(shuffle());
      if (iteration >= maxIterations) {
        window.clearInterval(interval);
        setDisplayText(text);
        setIsScrambling(false);
      }
    }, scrambleSpeed);

    return () => window.clearInterval(interval);
  }, [characters, isActive, maxIterations, scrambleSpeed, text, useOriginalCharsOnly]);

  return (
    <motion.span
      className={`scramble-hover ${className}`.trim()}
      onHoverStart={() => active === undefined && setIsHovering(true)}
      onHoverEnd={() => active === undefined && setIsHovering(false)}
    >
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {Array.from(displayText).map((character, index) => (
          <span className={isScrambling ? `scramble-hover-character is-scrambled ${scrambledClassName}`.trim() : 'scramble-hover-character'} key={`${index}-${character}`}>
            {character}
          </span>
        ))}
      </span>
    </motion.span>
  );
}
