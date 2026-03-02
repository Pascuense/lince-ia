import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";

/**
 * Daily Rewards Logic Tests
 * 
 * These tests verify the core daily rewards business logic:
 * - Reward schedule structure (7 days, escalating coins)
 * - Consecutive day tracking
 * - Streak reset on missed days
 * - Preventing double claims on the same day
 * - Week progress tracking
 */

// Replicate the reward schedule from GameContext for testing
const DAILY_REWARD_SCHEDULE = [
  { coins: 10, xp: 5, bonusKey: "day1" },
  { coins: 15, xp: 8, bonusKey: "day2" },
  { coins: 20, xp: 10, bonusKey: "day3" },
  { coins: 30, xp: 15, bonusKey: "day4" },
  { coins: 40, xp: 20, bonusKey: "day5" },
  { coins: 50, xp: 25, bonusKey: "day6" },
  { coins: 100, xp: 50, bonusKey: "day7" },
];

interface DailyRewardsState {
  lastClaimDate: string;
  consecutiveDays: number;
  totalDaysClaimed: number;
  weekProgress: boolean[];
}

const DEFAULT_DAILY_REWARDS: DailyRewardsState = {
  lastClaimDate: "",
  consecutiveDays: 0,
  totalDaysClaimed: 0,
  weekProgress: [false, false, false, false, false, false, false],
};

// Pure function that mirrors the GameContext claim logic
function claimDailyReward(
  currentState: DailyRewardsState,
  today: string
): { newState: DailyRewardsState; reward: { coins: number; xp: number; day: number } } | null {
  if (currentState.lastClaimDate === today) return null;

  let newConsecutive = 1;
  if (currentState.lastClaimDate) {
    const lastDate = new Date(currentState.lastClaimDate);
    const todayDate = new Date(today);
    const diffMs = todayDate.getTime() - lastDate.getTime();
    const diffDays = Math.floor(diffMs / 86400000);
    if (diffDays === 1) {
      newConsecutive = (currentState.consecutiveDays % 7) + 1;
    } else {
      newConsecutive = 1;
    }
  }

  const dayIndex = newConsecutive - 1;
  const reward = DAILY_REWARD_SCHEDULE[dayIndex];

  const newWeekProgress =
    newConsecutive === 1
      ? [true, false, false, false, false, false, false]
      : [...currentState.weekProgress];
  if (newConsecutive > 1) {
    newWeekProgress[dayIndex] = true;
  }

  return {
    newState: {
      lastClaimDate: today,
      consecutiveDays: newConsecutive,
      totalDaysClaimed: currentState.totalDaysClaimed + 1,
      weekProgress: newWeekProgress,
    },
    reward: { coins: reward.coins, xp: reward.xp, day: newConsecutive },
  };
}

function canClaimDailyReward(state: DailyRewardsState, today: string): boolean {
  return state.lastClaimDate !== today;
}

describe("Daily Rewards System", () => {
  describe("Reward Schedule", () => {
    it("has exactly 7 days in the schedule", () => {
      expect(DAILY_REWARD_SCHEDULE).toHaveLength(7);
    });

    it("has escalating coin rewards", () => {
      for (let i = 1; i < DAILY_REWARD_SCHEDULE.length; i++) {
        expect(DAILY_REWARD_SCHEDULE[i].coins).toBeGreaterThan(
          DAILY_REWARD_SCHEDULE[i - 1].coins
        );
      }
    });

    it("day 7 has the highest reward (100 coins)", () => {
      expect(DAILY_REWARD_SCHEDULE[6].coins).toBe(100);
      expect(DAILY_REWARD_SCHEDULE[6].xp).toBe(50);
    });

    it("day 1 starts with 10 coins", () => {
      expect(DAILY_REWARD_SCHEDULE[0].coins).toBe(10);
      expect(DAILY_REWARD_SCHEDULE[0].xp).toBe(5);
    });

    it("total weekly coins sum to 265", () => {
      const total = DAILY_REWARD_SCHEDULE.reduce((sum, d) => sum + d.coins, 0);
      expect(total).toBe(265);
    });
  });

  describe("canClaimDailyReward", () => {
    it("returns true when no previous claim exists", () => {
      expect(canClaimDailyReward(DEFAULT_DAILY_REWARDS, "2026-02-07")).toBe(true);
    });

    it("returns false when already claimed today", () => {
      const state: DailyRewardsState = {
        ...DEFAULT_DAILY_REWARDS,
        lastClaimDate: "2026-02-07",
      };
      expect(canClaimDailyReward(state, "2026-02-07")).toBe(false);
    });

    it("returns true when last claim was yesterday", () => {
      const state: DailyRewardsState = {
        ...DEFAULT_DAILY_REWARDS,
        lastClaimDate: "2026-02-06",
      };
      expect(canClaimDailyReward(state, "2026-02-07")).toBe(true);
    });
  });

  describe("claimDailyReward", () => {
    it("returns null if already claimed today", () => {
      const state: DailyRewardsState = {
        ...DEFAULT_DAILY_REWARDS,
        lastClaimDate: "2026-02-07",
        consecutiveDays: 1,
      };
      const result = claimDailyReward(state, "2026-02-07");
      expect(result).toBeNull();
    });

    it("gives day 1 reward on first ever claim", () => {
      const result = claimDailyReward(DEFAULT_DAILY_REWARDS, "2026-02-07");
      expect(result).not.toBeNull();
      expect(result!.reward.coins).toBe(10);
      expect(result!.reward.xp).toBe(5);
      expect(result!.reward.day).toBe(1);
      expect(result!.newState.consecutiveDays).toBe(1);
      expect(result!.newState.totalDaysClaimed).toBe(1);
      expect(result!.newState.weekProgress[0]).toBe(true);
    });

    it("gives day 2 reward on consecutive day", () => {
      const state: DailyRewardsState = {
        lastClaimDate: "2026-02-06",
        consecutiveDays: 1,
        totalDaysClaimed: 1,
        weekProgress: [true, false, false, false, false, false, false],
      };
      const result = claimDailyReward(state, "2026-02-07");
      expect(result).not.toBeNull();
      expect(result!.reward.coins).toBe(15);
      expect(result!.reward.xp).toBe(8);
      expect(result!.reward.day).toBe(2);
      expect(result!.newState.consecutiveDays).toBe(2);
      expect(result!.newState.weekProgress[1]).toBe(true);
    });

    it("resets to day 1 when streak is broken (missed a day)", () => {
      const state: DailyRewardsState = {
        lastClaimDate: "2026-02-04",
        consecutiveDays: 3,
        totalDaysClaimed: 3,
        weekProgress: [true, true, true, false, false, false, false],
      };
      const result = claimDailyReward(state, "2026-02-07"); // 3 days gap
      expect(result).not.toBeNull();
      expect(result!.reward.coins).toBe(10); // Back to day 1
      expect(result!.reward.day).toBe(1);
      expect(result!.newState.consecutiveDays).toBe(1);
      // Week progress resets
      expect(result!.newState.weekProgress[0]).toBe(true);
      expect(result!.newState.weekProgress[1]).toBe(false);
    });

    it("gives day 7 mega bonus on 7th consecutive day", () => {
      const state: DailyRewardsState = {
        lastClaimDate: "2026-02-06",
        consecutiveDays: 6,
        totalDaysClaimed: 6,
        weekProgress: [true, true, true, true, true, true, false],
      };
      const result = claimDailyReward(state, "2026-02-07");
      expect(result).not.toBeNull();
      expect(result!.reward.coins).toBe(100); // Mega bonus!
      expect(result!.reward.xp).toBe(50);
      expect(result!.reward.day).toBe(7);
      expect(result!.newState.weekProgress[6]).toBe(true);
    });

    it("cycles back to day 1 after completing 7 days", () => {
      const state: DailyRewardsState = {
        lastClaimDate: "2026-02-07",
        consecutiveDays: 7,
        totalDaysClaimed: 7,
        weekProgress: [true, true, true, true, true, true, true],
      };
      const result = claimDailyReward(state, "2026-02-08");
      expect(result).not.toBeNull();
      expect(result!.reward.coins).toBe(10); // Back to day 1
      expect(result!.reward.day).toBe(1);
      expect(result!.newState.consecutiveDays).toBe(1);
    });

    it("increments totalDaysClaimed correctly over multiple claims", () => {
      let state = { ...DEFAULT_DAILY_REWARDS };
      const dates = [
        "2026-02-01",
        "2026-02-02",
        "2026-02-03",
      ];

      for (let i = 0; i < dates.length; i++) {
        const result = claimDailyReward(state, dates[i]);
        expect(result).not.toBeNull();
        state = result!.newState;
        expect(state.totalDaysClaimed).toBe(i + 1);
      }

      expect(state.consecutiveDays).toBe(3);
      expect(state.totalDaysClaimed).toBe(3);
    });

    it("tracks full 7-day week progress correctly", () => {
      let state = { ...DEFAULT_DAILY_REWARDS };
      const dates = [
        "2026-02-01",
        "2026-02-02",
        "2026-02-03",
        "2026-02-04",
        "2026-02-05",
        "2026-02-06",
        "2026-02-07",
      ];

      for (const date of dates) {
        const result = claimDailyReward(state, date);
        expect(result).not.toBeNull();
        state = result!.newState;
      }

      // All 7 days should be marked
      expect(state.weekProgress).toEqual([true, true, true, true, true, true, true]);
      expect(state.consecutiveDays).toBe(7);
      expect(state.totalDaysClaimed).toBe(7);
    });
  });
});
