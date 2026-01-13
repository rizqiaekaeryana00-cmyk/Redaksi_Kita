import React from 'react';
import { UserAchievement } from '../types';
import { AchievementService } from '../services/achievementService';

interface AchievementBadgesProps {
  achievements: UserAchievement[];
}

export const AchievementBadges: React.FC<AchievementBadgesProps> = ({ achievements }) => {
  const achievementDetails = AchievementService.getUserAchievementDetails(achievements);

  return (
    <div className="flex flex-wrap gap-3">
      {achievementDetails.length === 0 ? (
        <p className="text-gray-500 text-sm">Belum ada pencapaian. Mulai bermain untuk membuka!</p>
      ) : (
        achievementDetails.map((achievement) => (
          <div
            key={achievement?.id}
            className={`${achievement?.color} rounded-full p-3 text-white hover:shadow-lg transition-all cursor-help group relative`}
            title={achievement?.description}
          >
            <i className={`fas fa-${achievement?.icon} text-lg`}></i>
            
            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black/80 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
              <div className="font-bold">{achievement?.name}</div>
              <div className="text-xs">{achievement?.description}</div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};
