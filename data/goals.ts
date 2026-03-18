import type { GoalDefinition } from "@/lib/types";

export const goalDefinitions: GoalDefinition[] = [
  {
    key: "scheduled_workout_complete",
    label: "Complete scheduled workout",
    description: "Finish the programmed training session assigned for the day."
  },
  {
    key: "eat_at_home",
    label: "Eat at home",
    description: "Keep meals aligned with the household nutrition plan."
  },
  {
    key: "protein_target_hit",
    label: "Hit protein target",
    description: "Reach the athlete-specific daily protein target."
  },
  {
    key: "hydration_target_hit",
    label: "Hit hydration goal",
    description: "Finish the daily hydration target."
  },
  {
    key: "mobility_complete",
    label: "Complete mobility / recovery",
    description: "Log mobility, soft tissue, or recovery work."
  },
  {
    key: "step_goal_hit",
    label: "Hit step goal",
    description: "Reach the daily step floor for recovery and consistency."
  }
];
