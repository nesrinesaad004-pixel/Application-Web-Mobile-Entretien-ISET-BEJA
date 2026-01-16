// src/context/GameContext.tsx
import { createContext, useContext, useState, useEffect } from 'react';
import { GameState, StudentInfo } from '@/types/game';

const initialGameState: GameState = {
  currentLevel: 0,
  studentInfo: null,
  level1Choices: [],
  level2Domain: null,
  level2Values: [],
  level3Order: [],
  level4Avatar: null,
  level4PitchOrder: [],
  level5Answers: {},
  level5Score: 0,
  completedLevels: [],
  startTime: null,
  endTime: null,
  // 🔥 Ajout obligatoire
  levelScores: {}, // {1:20, 2:0, ...}
};

type GameContextType = {
  gameState: GameState;
  setStudentInfo: (info: StudentInfo) => void;
  setLevel1Choices: (choices: string[]) => void;
  setLevel2Domain: (domain: string | null) => void;
  setLevel2Values: (values: string[]) => void;
  setLevel3Order: (order: string[]) => void;
  setLevel4Avatar: (avatar: string | null) => void;
  setLevel4PitchOrder: (order: string[]) => void;
  completeLevel: (level: number, score: number) => void; // 🔥 score: number
  resetGame: () => void;
};

const GameContext = createContext<GameContextType>({} as GameContextType);

export const GameProvider = ({ children }: { children: React.ReactNode }) => {
  const [gameState, setGameState] = useState<GameState>(() => {
    const saved = localStorage.getItem('gameState');
    return saved ? JSON.parse(saved) : initialGameState;
  });

  useEffect(() => {
    localStorage.setItem('gameState', JSON.stringify(gameState));
  }, [gameState]);

  const setStudentInfo = (info: StudentInfo) => {
    setGameState((prev) => ({
      ...prev,
      studentInfo: info,
      startTime: Date.now(),
    }));
  };

  const setLevel1Choices = (choices: string[]) => {
    setGameState((prev) => ({ ...prev, level1Choices: choices }));
  };

  const setLevel2Domain = (domain: string | null) => {
    setGameState((prev) => ({ ...prev, level2Domain: domain }));
  };

  const setLevel2Values = (values: string[]) => {
    setGameState((prev) => ({ ...prev, level2Values: values }));
  };

  const setLevel3Order = (order: string[]) => {
    setGameState((prev) => ({ ...prev, level3Order: order }));
  };

  const setLevel4Avatar = (avatar: string | null) => {
    setGameState((prev) => ({ ...prev, level4Avatar: avatar }));
  };

  const setLevel4PitchOrder = (order: string[]) => {
    setGameState((prev) => ({ ...prev, level4PitchOrder: order }));
  };

  // 🔥 NOUVELLE FONCTION : accepte un score numérique (0-20)
  const completeLevel = (level: number, score: number) => {
    const normalizedScore = Math.max(0, Math.min(20, score)); // entre 0 et 20
    setGameState((prev) => ({
      ...prev,
      completedLevels: [...new Set([...prev.completedLevels, level])],
      levelScores: {
        ...prev.levelScores,
        [level]: normalizedScore,
      },
      currentLevel: level + 1,
    }));
  };

  const resetGame = () => {
    setGameState(initialGameState);
  };

  return (
    <GameContext.Provider
      value={{
        gameState,
        setStudentInfo,
        setLevel1Choices,
        setLevel2Domain,
        setLevel2Values,
        setLevel3Order,
        setLevel4Avatar,
        setLevel4PitchOrder,
        completeLevel,
        resetGame,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => useContext(GameContext);