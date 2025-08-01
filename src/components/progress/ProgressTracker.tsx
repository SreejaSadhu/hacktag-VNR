import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Trophy, 
  Target, 
  TrendingUp, 
  Star, 
  Zap,
  CheckCircle,
  Clock,
  Award,
  Gift,
  Crown,
  Rocket,
  Lightbulb
} from "lucide-react";

interface Achievement {
  id: string;
  title: string;
  description: string;
  type: 'milestone' | 'streak' | 'bonus' | 'special';
  progress: number;
  maxProgress: number;
  reward?: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: Date;
}

interface Milestone {
  id: string;
  title: string;
  description: string;
  target: number;
  current: number;
  unit: string;
  reward: string;
  completed: boolean;
}

export default function ProgressTracker() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [totalPoints, setTotalPoints] = useState(0);
  const [level, setLevel] = useState(1);
  const [streak, setStreak] = useState(0);

  // Initialize achievements
  useEffect(() => {
    const initialAchievements: Achievement[] = [
      {
        id: 'first_website',
        title: 'First Website',
        description: 'Create your first website',
        type: 'milestone',
        progress: 0,
        maxProgress: 1,
        reward: '50 points',
        icon: '🌐',
        unlocked: false
      },
      {
        id: 'email_campaign',
        title: 'Email Master',
        description: 'Send your first email campaign',
        type: 'milestone',
        progress: 0,
        maxProgress: 1,
        reward: '75 points',
        icon: '📧',
        unlocked: false
      },
      {
        id: 'ai_insights',
        title: 'AI Explorer',
        description: 'Generate your first AI insights',
        type: 'milestone',
        progress: 0,
        maxProgress: 1,
        reward: '100 points',
        icon: '🤖',
        unlocked: false
      },
      {
        id: 'streak_3',
        title: 'Consistent Creator',
        description: 'Use the platform for 3 consecutive days',
        type: 'streak',
        progress: 0,
        maxProgress: 3,
        reward: '150 points',
        icon: '🔥',
        unlocked: false
      },
      {
        id: 'streak_7',
        title: 'Week Warrior',
        description: 'Use the platform for 7 consecutive days',
        type: 'streak',
        progress: 0,
        maxProgress: 7,
        reward: '300 points',
        icon: '⚡',
        unlocked: false
      },
      {
        id: 'premium_user',
        title: 'Premium Pioneer',
        description: 'Upgrade to premium plan',
        type: 'special',
        progress: 0,
        maxProgress: 1,
        reward: '500 points + Premium Badge',
        icon: '👑',
        unlocked: false
      }
    ];

    setAchievements(initialAchievements);
  }, []);

  // Initialize milestones
  useEffect(() => {
    const initialMilestones: Milestone[] = [
      {
        id: 'websites_created',
        title: 'Website Creator',
        description: 'Create websites',
        target: 10,
        current: 0,
        unit: 'websites',
        reward: '250 points',
        completed: false
      },
      {
        id: 'emails_sent',
        title: 'Email Campaigner',
        description: 'Send email campaigns',
        target: 5,
        current: 0,
        unit: 'campaigns',
        reward: '200 points',
        completed: false
      },
      {
        id: 'insights_generated',
        title: 'AI Analyst',
        description: 'Generate AI insights',
        target: 3,
        current: 0,
        unit: 'insights',
        reward: '300 points',
        completed: false
      }
    ];

    setMilestones(initialMilestones);
  }, []);

  // Simulate real-time progress updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate random progress updates
      const shouldUpdate = Math.random() < 0.2; // 20% chance every interval
      
      if (shouldUpdate) {
        // Update achievements
        setAchievements(prev => prev.map(achievement => {
          if (!achievement.unlocked && Math.random() < 0.1) {
            const newProgress = Math.min(achievement.progress + 1, achievement.maxProgress);
            const isUnlocked = newProgress >= achievement.maxProgress;
            
            if (isUnlocked) {
              setTotalPoints(prevPoints => prevPoints + parseInt(achievement.reward.split(' ')[0]));
            }
            
            return {
              ...achievement,
              progress: newProgress,
              unlocked: isUnlocked,
              unlockedAt: isUnlocked ? new Date() : undefined
            };
          }
          return achievement;
        }));

        // Update milestones
        setMilestones(prev => prev.map(milestone => {
          if (!milestone.completed && Math.random() < 0.05) {
            const newCurrent = Math.min(milestone.current + 1, milestone.target);
            const isCompleted = newCurrent >= milestone.target;
            
            if (isCompleted) {
              setTotalPoints(prevPoints => prevPoints + parseInt(milestone.reward.split(' ')[0]));
            }
            
            return {
              ...milestone,
              current: newCurrent,
              completed: isCompleted
            };
          }
          return milestone;
        }));

        // Update streak
        if (Math.random() < 0.1) {
          setStreak(prev => prev + 1);
        }

        // Update level based on total points
        setLevel(Math.floor(totalPoints / 100) + 1);
      }
    }, 3000); // Update every 3 seconds

    return () => clearInterval(interval);
  }, [totalPoints]);

  const getAchievementIcon = (type: Achievement['type']) => {
    switch (type) {
      case 'milestone':
        return <Target className="h-4 w-4 text-blue-500" />;
      case 'streak':
        return <TrendingUp className="h-4 w-4 text-orange-500" />;
      case 'bonus':
        return <Gift className="h-4 w-4 text-purple-500" />;
      case 'special':
        return <Crown className="h-4 w-4 text-yellow-500" />;
      default:
        return <Star className="h-4 w-4 text-gray-500" />;
    }
  };

  const unlockedAchievements = achievements.filter(a => a.unlocked);
  const lockedAchievements = achievements.filter(a => !a.unlocked);
  const completedMilestones = milestones.filter(m => m.completed);
  const activeMilestones = milestones.filter(m => !m.completed);

  return (
    <div className="space-y-6">
      {/* Level and Points Summary */}
      <Card className="border-0 shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            <span>Progress Overview</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{level}</div>
              <div className="text-sm text-blue-600">Level</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{totalPoints}</div>
              <div className="text-sm text-green-600">Total Points</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">{streak}</div>
              <div className="text-sm text-orange-600">Day Streak</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Active Milestones */}
      <Card className="border-0 shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-5 w-5 text-primary" />
            <span>Active Milestones</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {activeMilestones.map((milestone) => (
            <div key={milestone.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">{milestone.title}</h4>
                  <p className="text-sm text-muted-foreground">{milestone.description}</p>
                </div>
                <Badge variant="secondary">{milestone.reward}</Badge>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>{milestone.current} / {milestone.target} {milestone.unit}</span>
                  <span>{Math.round((milestone.current / milestone.target) * 100)}%</span>
                </div>
                <Progress value={(milestone.current / milestone.target) * 100} className="h-2" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Achievements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Unlocked Achievements */}
        <Card className="border-0 shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span>Unlocked Achievements ({unlockedAchievements.length})</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {unlockedAchievements.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                <Trophy className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No achievements unlocked yet</p>
                <p className="text-sm">Keep using the platform to earn achievements!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {unlockedAchievements.map((achievement) => (
                  <div key={achievement.id} className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                    <div className="text-2xl">{achievement.icon}</div>
                    <div className="flex-1">
                      <h4 className="font-medium text-green-700">{achievement.title}</h4>
                      <p className="text-sm text-green-600">{achievement.description}</p>
                      <p className="text-xs text-green-500 mt-1">
                        Unlocked {achievement.unlockedAt?.toLocaleDateString()}
                      </p>
                    </div>
                    <Badge variant="secondary" className="bg-green-100 text-green-700">
                      {achievement.reward}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Locked Achievements */}
        <Card className="border-0 shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-gray-500" />
              <span>Locked Achievements ({lockedAchievements.length})</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {lockedAchievements.map((achievement) => (
                <div key={achievement.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg opacity-60">
                  <div className="text-2xl">{achievement.icon}</div>
                  <div className="flex-1">
                    <h4 className="font-medium">{achievement.title}</h4>
                    <p className="text-sm text-muted-foreground">{achievement.description}</p>
                    <div className="mt-2">
                      <div className="flex justify-between text-xs text-muted-foreground mb-1">
                        <span>Progress</span>
                        <span>{achievement.progress} / {achievement.maxProgress}</span>
                      </div>
                      <Progress value={(achievement.progress / achievement.maxProgress) * 100} className="h-1" />
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {achievement.reward}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Completed Milestones */}
      {completedMilestones.length > 0 && (
        <Card className="border-0 shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Award className="h-5 w-5 text-yellow-500" />
              <span>Completed Milestones ({completedMilestones.length})</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {completedMilestones.map((milestone) => (
                <div key={milestone.id} className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <CheckCircle className="h-4 w-4 text-yellow-600" />
                    <h4 className="font-medium text-yellow-700">{milestone.title}</h4>
                  </div>
                  <p className="text-sm text-yellow-600 mb-2">{milestone.description}</p>
                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">
                    {milestone.reward}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 