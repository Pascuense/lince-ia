import { useState, useEffect } from "react";
import { useGame } from "@/contexts/GameContext";
import { useGameLang } from "@/hooks/useGameLang";
import { Link } from "wouter";
import RequireLogin from "@/components/RequireLogin";
import { GameLanguageSelector } from "@/components/GameLanguageSelector";
import { UserNavBadge } from "@/components/UserNavBadge";
import { GlobalNavBar } from "@/components/GlobalNavBar";
import { BackButton } from "@/components/BackButton";

const T: Record<string, Record<string, string>> = {
  es: {
    title: "Premios del Día",
    subtitle: "Inicia sesión cada día y gana LinceCoins extra",
    claimBtn: "Recoger Premio",
    claimed: "Ya reclamaste hoy",
    nextReward: "Vuelve mañana para tu siguiente premio",
    day: "Día",
    coins: "LinceCoins",
    xp: "XP",
    streak: "Racha actual",
    days: "días",
    totalClaimed: "Total días reclamados",
    weeklyBonus: "Bonus semanal",
    day7Bonus: "Completa 7 días seguidos para ganar el MEGA BONUS",
    congratsTitle: "¡Premio Recogido!",
    congratsCoins: "Has ganado",
    congratsXP: "y",
    congratsStreak: "Racha de",
    backToMap: "← Tu Aventura",
    todayReward: "Premio de hoy",
    comeBack: "Vuelve mañana",
    megaBonus: "MEGA BONUS",
    claimedBadge: "Reclamado",
  },
  en: {
    title: "Daily Prizes",
    subtitle: "Log in every day and earn extra LinceCoins",
    claimBtn: "Collect Prize",
    claimed: "Already claimed today",
    nextReward: "Come back tomorrow for your next reward",
    day: "Day",
    coins: "LinceCoins",
    xp: "XP",
    streak: "Current streak",
    days: "days",
    totalClaimed: "Total days claimed",
    weeklyBonus: "Weekly bonus",
    day7Bonus: "Complete 7 consecutive days for the MEGA BONUS",
    congratsTitle: "Prize Collected!",
    congratsCoins: "You earned",
    congratsXP: "and",
    congratsStreak: "Streak of",
    backToMap: "← Your Adventure",
    todayReward: "Today's prize",
    comeBack: "Come back tomorrow",
    megaBonus: "MEGA BONUS",
    claimedBadge: "Claimed",
  },
  zh: {
    title: "每日奖励",
    subtitle: "每天登录赚取额外LinceCoins",
    claimBtn: "领取奖励",
    claimed: "今天已领取",
    nextReward: "明天回来领取下一个奖励",
    day: "天",
    coins: "LinceCoins",
    xp: "XP",
    streak: "当前连续",
    days: "天",
    totalClaimed: "总领取天数",
    weeklyBonus: "周奖励",
    day7Bonus: "连续7天完成获得超级奖励",
    congratsTitle: "奖励已领取！",
    congratsCoins: "你获得了",
    congratsXP: "和",
    congratsStreak: "连续",
    backToMap: "← 你的冒险",
    todayReward: "今日奖励",
    comeBack: "明天再来",
    megaBonus: "超级奖励",
    claimedBadge: "已领取",
  },
};

const DAY_ICONS = ["🌱", "🌿", "🌳", "⭐", "💎", "🔥", "👑"];

function DailyRewardsContent() {
  const { lang } = useGameLang();
  const t = T[lang] || T.es;
  const { state, canClaimDailyReward, claimDailyReward, getDailyRewardSchedule } = useGame();
  const [showCelebration, setShowCelebration] = useState(false);
  const [claimedReward, setClaimedReward] = useState<{ coins: number; xp: number; day: number } | null>(null);
  const [canClaim, setCanClaim] = useState(false);

  useEffect(() => {
    setCanClaim(canClaimDailyReward());
  }, [canClaimDailyReward, state.dailyRewards]);

  const schedule = getDailyRewardSchedule();
  const currentDay = (state.dailyRewards?.consecutiveDays || 0) % 7;
  const nextDay = canClaim ? currentDay : (currentDay % 7);

  const handleClaim = () => {
    const result = claimDailyReward();
    if (result) {
      setClaimedReward(result);
      setShowCelebration(true);
      setCanClaim(false);
      setTimeout(() => setShowCelebration(false), 4000);
    }
  };

  return (
    <div className="min-h-screen bg-[oklch(0.10_0.01_240)] text-white">
      <BackButton variant="inline" />
      <GlobalNavBar />
      <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-32 sm:pt-36 pb-20">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/jugar" className="text-[oklch(0.82_0.15_195)] text-base sm:text-lg font-bold hover:underline min-h-[44px] flex items-center">
            {t.backToMap}
          </Link>
          <div className="flex items-center gap-3">
            <GameLanguageSelector variant="pill" />
            <UserNavBadge variant="compact" />
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-10">
          <div className="text-6xl mb-4">🎁</div>
          <h1 className="text-4xl sm:text-5xl font-black bg-gradient-to-r from-[oklch(0.82_0.15_195)] to-[oklch(0.72_0.12_75)] bg-clip-text text-transparent">
            {t.title}
          </h1>
          <p className="text-gray-400 text-lg sm:text-xl mt-3 leading-relaxed">{t.subtitle}</p>
        </div>

        {/* Streak info */}
        <div className="flex gap-4 mb-10">
          <div className="flex-1 bg-[oklch(0.14_0.015_240)] rounded-2xl p-5 sm:p-6 text-center border border-orange-500/20">
            <div className="text-3xl sm:text-4xl font-black text-orange-400">🔥 {state.dailyRewards?.consecutiveDays || 0}</div>
            <div className="text-sm sm:text-base text-gray-500 mt-2 font-medium">{t.streak}</div>
          </div>
          <div className="flex-1 bg-[oklch(0.14_0.015_240)] rounded-2xl p-5 sm:p-6 text-center border border-[oklch(0.72_0.12_75)]/20">
            <div className="text-3xl sm:text-4xl font-black text-[oklch(0.72_0.12_75)]">📅 {state.dailyRewards?.totalDaysClaimed || 0}</div>
            <div className="text-sm sm:text-base text-gray-500 mt-2 font-medium">{t.totalClaimed}</div>
          </div>
        </div>

        {/* 7-day calendar grid */}
        <div className="grid grid-cols-7 gap-2 sm:gap-3 mb-10">
          {schedule.map((day, i) => {
            const isCurrent = canClaim && i === nextDay;
            const isFuture = !day.claimed && !isCurrent;
            const isDay7 = i === 6;

            return (
              <div
                key={day.day}
                className={`relative rounded-xl sm:rounded-2xl p-2 sm:p-3 text-center transition-all duration-300 ${
                  day.claimed
                    ? "bg-gradient-to-b from-[oklch(0.82_0.15_195)]/20 to-[oklch(0.82_0.15_195)]/5 border-2 border-[oklch(0.82_0.15_195)]/40"
                    : isCurrent
                    ? "bg-gradient-to-b from-[oklch(0.72_0.12_75)]/20 to-[oklch(0.72_0.12_75)]/5 border-2 border-[oklch(0.72_0.12_75)] shadow-[0_0_20px_oklch(0.72_0.12_75/0.3)] animate-pulse"
                    : isDay7 && isFuture
                    ? "bg-gradient-to-b from-purple-500/10 to-purple-500/5 border border-purple-500/20"
                    : "bg-[oklch(0.14_0.015_240)] border border-gray-800"
                }`}
              >
                {/* Day number */}
                <div className={`text-xs sm:text-sm font-bold mb-1 ${
                  day.claimed ? "text-[oklch(0.82_0.15_195)]" : isCurrent ? "text-[oklch(0.72_0.12_75)]" : "text-gray-600"
                }`}>
                  {t.day} {day.day}
                </div>

                {/* Icon */}
                <div className={`text-2xl sm:text-3xl mb-1 ${isFuture && !isDay7 ? "opacity-30 grayscale" : ""}`}>
                  {day.claimed ? "✅" : DAY_ICONS[i]}
                </div>

                {/* Coins */}
                <div className={`text-xs sm:text-sm font-black ${
                  day.claimed ? "text-[oklch(0.82_0.15_195)]" : isCurrent ? "text-[oklch(0.72_0.12_75)]" : isDay7 ? "text-purple-400" : "text-gray-500"
                }`}>
                  🪙 {day.coins}
                </div>

                {/* Claimed badge */}
                {day.claimed && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-[oklch(0.82_0.15_195)] rounded-full flex items-center justify-center">
                    <span className="text-[10px] text-black font-black">✓</span>
                  </div>
                )}

                {/* Day 7 special label */}
                {isDay7 && !day.claimed && (
                  <div className="text-[9px] sm:text-xs text-purple-400 font-bold mt-0.5">{t.megaBonus}</div>
                )}
              </div>
            );
          })}
        </div>

        {/* Today's reward highlight */}
        {canClaim && (
          <div className="mb-8 p-6 sm:p-8 bg-gradient-to-r from-[oklch(0.72_0.12_75)]/10 to-[oklch(0.82_0.15_195)]/10 border-2 border-[oklch(0.72_0.12_75)]/30 rounded-2xl">
            <div className="text-center">
              <p className="text-base sm:text-lg text-gray-400 mb-4 font-medium">{t.todayReward}</p>
              <div className="flex items-center justify-center gap-6 sm:gap-8 mb-6">
                <div className="text-center">
                  <div className="text-4xl sm:text-5xl mb-2">{DAY_ICONS[nextDay]}</div>
                  <div className="text-sm text-gray-500 font-medium">{t.day} {nextDay + 1}</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl sm:text-4xl font-black text-[oklch(0.72_0.12_75)]">🪙 {schedule[nextDay]?.coins || 10}</div>
                  <div className="text-sm text-gray-500 font-medium">{t.coins}</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-[oklch(0.82_0.15_195)]">+{Math.round((schedule[nextDay]?.coins || 10) / 2)} {t.xp}</div>
                </div>
              </div>
              <button
                onClick={handleClaim}
                className="w-full py-5 rounded-2xl font-black text-xl sm:text-2xl bg-gradient-to-r from-[oklch(0.72_0.12_75)] to-[oklch(0.82_0.15_195)] text-black hover:opacity-90 transition-all shadow-[0_0_30px_oklch(0.72_0.12_75/0.3)] active:scale-95 min-h-[60px]"
              >
                🎁 {t.claimBtn}
              </button>
            </div>
          </div>
        )}

        {/* Already claimed message */}
        {!canClaim && (
          <div className="mb-8 p-6 sm:p-8 bg-[oklch(0.14_0.015_240)] border border-gray-800 rounded-2xl text-center">
            <div className="text-5xl mb-3">✅</div>
            <p className="text-gray-400 font-bold text-xl sm:text-2xl">{t.claimed}</p>
            <p className="text-gray-600 text-base sm:text-lg mt-2">{t.nextReward}</p>
          </div>
        )}

        {/* Celebration overlay */}
        {showCelebration && claimedReward && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm" onClick={() => setShowCelebration(false)}>
            <div className="bg-[oklch(0.14_0.015_240)] border-2 border-[oklch(0.72_0.12_75)] rounded-3xl p-8 sm:p-10 text-center max-w-md mx-4 shadow-[0_0_60px_oklch(0.72_0.12_75/0.4)]">
              {/* Confetti emojis */}
              <div className="text-7xl mb-5 animate-bounce">🎉</div>
              <h2 className="text-3xl sm:text-4xl font-black text-white mb-6">{t.congratsTitle}</h2>
              
              <div className="flex items-center justify-center gap-8 mb-6">
                <div className="text-center">
                  <div className="text-4xl sm:text-5xl font-black text-[oklch(0.72_0.12_75)]">🪙 +{claimedReward.coins}</div>
                  <div className="text-sm text-gray-500 mt-1">{t.coins}</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl sm:text-4xl font-black text-[oklch(0.82_0.15_195)]">⚡ +{claimedReward.xp}</div>
                  <div className="text-sm text-gray-500 mt-1">{t.xp}</div>
                </div>
              </div>

              <div className="flex items-center justify-center gap-2 mb-8">
                <span className="text-2xl text-orange-400">🔥</span>
                <span className="text-white font-bold text-xl">{t.congratsStreak} {claimedReward.day} {t.days}</span>
              </div>

              {claimedReward.day === 7 && (
                <div className="mb-6 p-4 bg-purple-500/10 border border-purple-500/30 rounded-xl">
                  <div className="text-3xl mb-2">👑</div>
                  <p className="text-purple-400 font-bold text-lg">{t.megaBonus}</p>
                </div>
              )}

              <button
                onClick={() => setShowCelebration(false)}
                className="w-full py-4 rounded-2xl font-black text-xl bg-white/10 text-white hover:bg-white/20 transition-all min-h-[56px]"
              >
                OK
              </button>
            </div>
          </div>
        )}

        {/* Weekly bonus info */}
        <div className="p-5 sm:p-6 bg-purple-500/5 border border-purple-500/20 rounded-2xl text-center">
          <div className="text-3xl mb-2">👑</div>
          <p className="text-purple-400 text-lg sm:text-xl font-bold">{t.weeklyBonus}</p>
          <p className="text-gray-500 text-sm sm:text-base mt-2 leading-relaxed">{t.day7Bonus}</p>
          <div className="mt-4 flex items-center justify-center gap-2">
            {schedule.map((day, i) => (
              <div
                key={i}
                className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold ${
                  day.claimed
                    ? "bg-[oklch(0.82_0.15_195)] text-black"
                    : "bg-gray-800 text-gray-600"
                }`}
              >
                {day.claimed ? "✓" : i + 1}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DailyRewards() {
  return (
    <RequireLogin>
      <DailyRewardsContent />
    </RequireLogin>
  );
}
