import { PlayerStats, UserAchievement, ACHIEVEMENTS } from '../types';

export const AchievementService = {
  // Check which achievements should be unlocked
  checkNewAchievements: (stats: PlayerStats): UserAchievement[] => {
    const newAchievements: UserAchievement[] = [];
    const alreadyUnlocked = stats.achievements.map(a => a.achievementId);

    // Quiz Master: 10 correct quiz answers
    if (stats.quizCorrect >= 10 && !alreadyUnlocked.includes('quiz_master')) {
      newAchievements.push({
        achievementId: 'quiz_master',
        unlockedAt: Date.now()
      });
    }

    // Hoax Buster: 5 hoax detected
    if (stats.hoaxBusted >= 5 && !alreadyUnlocked.includes('hoax_buster')) {
      newAchievements.push({
        achievementId: 'hoax_buster',
        unlockedAt: Date.now()
      });
    }

    // Puzzle Solver: 10 puzzles completed
    if (stats.puzzlesCompleted >= 10 && !alreadyUnlocked.includes('puzzle_solver')) {
      newAchievements.push({
        achievementId: 'puzzle_solver',
        unlockedAt: Date.now()
      });
    }

    // Author: 5 writings submitted
    if (stats.writingSubmitted >= 5 && !alreadyUnlocked.includes('author')) {
      newAchievements.push({
        achievementId: 'author',
        unlockedAt: Date.now()
      });
    }

    // Journalist: Played all games (at least 1 in each)
    const playedAllGames = stats.quizCompleted > 0 && 
                           stats.hoaxBusted > 0 && 
                           stats.puzzlesCompleted > 0 && 
                           stats.writingSubmitted > 0;
    if (playedAllGames && !alreadyUnlocked.includes('journalist')) {
      newAchievements.push({
        achievementId: 'journalist',
        unlockedAt: Date.now()
      });
    }

    return newAchievements;
  },

  // Get achievement details
  getAchievementDetails: (id: string) => {
    return ACHIEVEMENTS.find(a => a.id === id);
  },

  // Get all achievement details for a user
  getUserAchievementDetails: (achievements: UserAchievement[]) => {
    return achievements
      .map(ua => ACHIEVEMENTS.find(a => a.id === ua.achievementId))
      .filter(a => a !== undefined);
  },

  // Calculate accuracy percentage
  calculateAccuracy: (correct: number, total: number): number => {
    if (total === 0) return 0;
    return Math.round((correct / total) * 100);
  }
};
