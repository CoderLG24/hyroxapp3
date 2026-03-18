import { addDays, eachDayOfInterval, format } from "date-fns";

import type { AthleteId, ExerciseBlock, WorkoutDay } from "@/lib/types";
import {
  applyTemplate,
  asTemplate,
  buildCycleClassDay,
  buildHyroxCs4ClassDay,
  buildLawtonLowerStrengthRunDay,
  buildRaceDay,
  buildRestDay,
  buildStrengthWorkout
} from "@/lib/workout-builders";

type WorkoutTemplate = Omit<WorkoutDay, "date" | "athleteId">;
type WeekSchedule = Record<"monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday", WorkoutTemplate>;

const PLAN_START = new Date("2026-03-16T12:00:00Z");
const PLAN_END = new Date("2026-09-18T12:00:00Z");
const WEEK_26_START = new Date("2026-09-07T12:00:00Z");
const cycleYellow = "Yellow readiness: reduce volume 15-25% or swap intervals for tempo.";
const cycleRed = "Red readiness: switch to easy aerobic work, upper body, mobility, or rest.";

function toIso(date: Date) {
  return format(date, "yyyy-MM-dd");
}

function templateFromWorkout(workout: WorkoutDay): WorkoutTemplate {
  return asTemplate(workout);
}

function workoutTemplate(config: Omit<Parameters<typeof buildStrengthWorkout>[0], "date" | "athleteId">) {
  return templateFromWorkout(
    buildStrengthWorkout({
      date: "2026-01-01",
      athleteId: "lawton",
      ...config
    })
  );
}

function restTemplate(athleteId: AthleteId) {
  return templateFromWorkout(buildRestDay("2026-01-01", athleteId));
}

function cycleTemplate(description?: string) {
  return templateFromWorkout(buildCycleClassDay("2026-01-01", "katy", description));
}

function hyroxCs4Template(athleteId: AthleteId) {
  return templateFromWorkout(buildHyroxCs4ClassDay("2026-01-01", athleteId));
}

function lawtonLowerTemplate(config: Omit<Parameters<typeof buildLawtonLowerStrengthRunDay>[0], "date" | "athleteId">) {
  return templateFromWorkout(
    buildLawtonLowerStrengthRunDay({
      date: "2026-01-01",
      athleteId: "lawton",
      ...config
    })
  );
}

function buildTemplate(config: {
  title: string;
  type: WorkoutDay["type"];
  description: string;
  warmup: string[];
  mainWork: ExerciseBlock[];
  conditioning?: ExerciseBlock[];
  cooldown: string[];
  cycleAwareNotes?: string[];
}) {
  return workoutTemplate({
    title: config.title,
    type: config.type,
    description: config.description,
    warmup: config.warmup,
    mainWork: config.mainWork,
    conditioning: config.conditioning ?? [],
    cooldown: config.cooldown,
    cycleAwareNotes: config.cycleAwareNotes
  });
}

function upperWarmup(firstLift: string) {
  return [
    "5 min easy row",
    "Band pull-apart x 15",
    "Scap push-up x 10",
    "Thoracic rotation x 6/side",
    `2 progressive warmup sets for ${firstLift}`
  ];
}

function lowerWarmup(firstLift: string) {
  return [
    "5 min easy bike",
    "World's greatest stretch x 5/side",
    "Glute bridge x 12",
    "Bodyweight squat x 10",
    `2 progressive warmup sets for ${firstLift}`
  ];
}

function hybridWarmup() {
  return [
    "5 min easy SkiErg or row",
    "Leg swing x 10/side",
    "Walking lunge x 10 total",
    "Shoulder circles x 10/side",
    "1 build round at 50% effort"
  ];
}

function lawtonUpperIntervals(benchSets: number, benchReps: string, latSets: number, latReps: string, inclineSets: number, inclineReps: string, rowSets: number, rowReps: string, intervalNote: string) {
  return buildTemplate({
    title: "Upper Strength + Run Work",
    type: "mixed",
    description: "Upper-body strength paired with structured interval running.",
    warmup: upperWarmup("Bench Press"),
    mainWork: [
      { name: "Bench Press", sets: benchSets, reps: benchReps, notes: "Rest 2 min between sets" },
      { name: "Lat Pulldown", sets: latSets, reps: latReps, notes: "Rest 75 sec between sets" },
      { name: "Incline Dumbbell Press", sets: inclineSets, reps: inclineReps, notes: "Rest 75 sec between sets" },
      { name: "1-Arm Dumbbell Row", sets: rowSets, reps: rowReps, notes: "Rest 60 sec between sets" }
    ],
    conditioning: [{ name: "Run Work", reps: "As written", notes: intervalNote }],
    cooldown: ["Walk 3 min", "Chest stretch", "Lat stretch", "Thoracic opener"]
  });
}

function lawtonLowerTempo(deadliftSets: number, deadliftReps: string, frontSquatSets: number, frontSquatReps: string, splitSquatSets: number, splitSquatReps: string, tempoDuration: string) {
  return buildTemplate({
    title: "Deadlift + Tempo Run",
    type: "mixed",
    description: "Posterior-chain strength paired with a steady tempo effort.",
    warmup: lowerWarmup("Deadlift"),
    mainWork: [
      { name: "Deadlift", sets: deadliftSets, reps: deadliftReps, notes: "Rest 2-3 min between sets" },
      { name: "Front Squat", sets: frontSquatSets, reps: frontSquatReps, notes: "Rest 2 min between sets" },
      { name: "Split Squat", sets: splitSquatSets, reps: splitSquatReps, notes: "Rest 60 sec between sets" }
    ],
    conditioning: [{ name: "Tempo Run", duration: tempoDuration, notes: "Comfortably hard, even pacing" }],
    cooldown: ["Walk 3 min", "Adductor stretch", "Hamstring stretch", "Quad stretch"]
  });
}

function lawtonCarryDay(ohpSets: number, ohpReps: string, rowSets: number, rowReps: string, closeGripSets: number, closeGripReps: string, carrySets: number, carryDistance: string, coreDuration: string) {
  return buildTemplate({
    title: "Upper Strength + Carry Core",
    type: "strength",
    description: "Upper-body strength with loaded carries and trunk work.",
    warmup: upperWarmup("Overhead Press"),
    mainWork: [
      { name: "Overhead Press", sets: ohpSets, reps: ohpReps, notes: "Rest 90 sec between sets" },
      { name: "Chest-Supported Row", sets: rowSets, reps: rowReps, notes: "Rest 75 sec between sets" },
      { name: "Close-Grip Bench Press", sets: closeGripSets, reps: closeGripReps, notes: "Rest 90 sec between sets" },
      { name: "Farmer Carry", sets: carrySets, distance: carryDistance, notes: "Heavy and controlled, 60 sec rest between carries" },
      { name: "Core Circuit", duration: coreDuration, notes: "Rotate dead bug, side plank, and hollow hold without rushing" }
    ],
    cooldown: ["Forearm stretch", "Lat stretch", "Thoracic opener"]
  });
}

function lawtonHyroxRounds(rounds: number, ski: string, sledDistance: string, row: string, wallBalls: number, lungeDistance: string, heavy?: boolean) {
  return buildTemplate({
    title: "Hyrox Circuit",
    type: "hyrox",
    description: "Exact erg and station rounds with fixed rest.",
    warmup: hybridWarmup(),
    mainWork: [
      {
        name: "Main Circuit",
        reps: `${rounds} rounds`,
        notes: `SkiErg ${ski}; sled push ${heavy ? "heavy " : ""}4 x ${sledDistance}; sled pull ${heavy ? "heavy " : ""}4 x ${sledDistance}; row ${row}; wall balls ${wallBalls}; sandbag lunge ${lungeDistance}; rest 2 min between rounds`
      }
    ],
    cooldown: ["Walk 5 min", "Hip flexor stretch", "Calf stretch", "Thoracic opener"]
  });
}

function lawtonThresholdDay(benchSets: number, benchReps: string, pullName: string, pullSets: number, pullReps: string, overheadSets: number, overheadReps: string, runNote: string) {
  return buildTemplate({
    title: "Upper Strength + Threshold Run",
    type: "mixed",
    description: "Heavier upper-body work paired with threshold-paced intervals.",
    warmup: upperWarmup("Bench Press"),
    mainWork: [
      { name: "Bench Press", sets: benchSets, reps: benchReps, notes: "Rest 2 min between sets" },
      { name: pullName, sets: pullSets, reps: pullReps, notes: "Rest 90 sec between sets" },
      { name: "Overhead Press", sets: overheadSets, reps: overheadReps, notes: "Rest 90 sec between sets" }
    ],
    conditioning: [{ name: "Run Work", reps: "As written", notes: runNote }],
    cooldown: ["Walk 3 min", "Lat stretch", "Chest stretch", "Thoracic opener"]
  });
}

function lawtonPowerLower(backSquatSets: number, backSquatReps: string, rdlSets: number, rdlReps: string, lungeName: string, lungeSets: number, lungeReps: string, runDuration: string) {
  return buildTemplate({
    title: "Power Lower + Zone 2",
    type: "mixed",
    description: "Lower-body strength with a short aerobic finish.",
    warmup: lowerWarmup("Back Squat"),
    mainWork: [
      { name: "Back Squat", sets: backSquatSets, reps: backSquatReps, notes: "Rest 2 min between sets" },
      { name: "Romanian Deadlift", sets: rdlSets, reps: rdlReps, notes: "Rest 90 sec between sets" },
      { name: lungeName, sets: lungeSets, reps: lungeReps, notes: "Rest 60 sec between sets" }
    ],
    conditioning: [{ name: "Zone 2 Run", duration: runDuration, notes: "Stay smooth and conversational" }],
    cooldown: ["Walk 3 min", "Hip stretch", "Hamstring stretch", "Calf stretch"]
  });
}

function lawtonRunErgSledDay(note: string) {
  return buildTemplate({
    title: "Run + Erg + Sled Blend",
    type: "hyrox",
    description: "Race-sequenced running and station work with exact ordering.",
    warmup: hybridWarmup(),
    mainWork: [{ name: "Main Set", reps: "As written", notes: note }],
    cooldown: ["Walk 5 min", "Quad stretch", "Hip flexor stretch", "Calf stretch"]
  });
}

function lawtonSaturdayCircuitDay(inclineSets: number, inclineReps: string, rowSets: number, rowReps: string, rounds: number, rowDistance: string, wallBalls: number, burpeeBroadJumps: number) {
  return buildTemplate({
    title: "Upper Strength + Hyrox Finish",
    type: "mixed",
    description: "Upper pressing and rowing followed by an exact conditioning circuit.",
    warmup: upperWarmup("Incline Dumbbell Press"),
    mainWork: [
      { name: "Incline Dumbbell Press", sets: inclineSets, reps: inclineReps, notes: "Rest 75 sec between sets" },
      { name: "Seated Row", sets: rowSets, reps: rowReps, notes: "Rest 75 sec between sets" }
    ],
    conditioning: [
      {
        name: "Conditioning Circuit",
        reps: `${rounds} rounds`,
        notes: `Row ${rowDistance}; wall balls ${wallBalls}; burpee broad jumps ${burpeeBroadJumps}; rest 90 sec between rounds`
      }
    ],
    cooldown: ["Walk 3 min", "Lat stretch", "Quad stretch", "Calf stretch"]
  });
}

function lawtonRaceSpecificSaturday(rounds: number, rowDistance: string, lungeDistance: string, wallBalls: number, burpees: number) {
  return buildTemplate({
    title: "Hyrox Saturday Builder",
    type: "hyrox",
    description: "Race-specific repeated station rounds with fixed recovery.",
    warmup: hybridWarmup(),
    mainWork: [
      {
        name: "Main Set",
        reps: `${rounds} rounds`,
        notes: `Row ${rowDistance}; sandbag lunge ${lungeDistance}; wall balls ${wallBalls}; burpees ${burpees}; rest 90 sec between rounds`
      }
    ],
    cooldown: ["Walk 5 min", "Hip stretch", "Shoulder stretch", "Calf stretch"]
  });
}

function katyLowerBike(frontSquatSets: number, frontSquatReps: string, rdlSets: number, rdlReps: string, stepUpSets: number, stepUpReps: string, hipThrustSets: number, hipThrustReps: string, cycleAwareNotes?: string[]) {
  return buildTemplate({
    title: "Lower Strength + Easy Bike",
    type: "strength",
    description: "Lower-body strength with a flush ride to close.",
    warmup: lowerWarmup("Front Squat"),
    mainWork: [
      { name: "Front Squat", sets: frontSquatSets, reps: frontSquatReps, notes: "Rest 2 min between sets" },
      { name: "Romanian Deadlift", sets: rdlSets, reps: rdlReps, notes: "Rest 90 sec between sets" },
      { name: "Step-Up", sets: stepUpSets, reps: stepUpReps, notes: "Drive through the lead leg, rest 60 sec between sets" },
      { name: "Hip Thrust", sets: hipThrustSets, reps: hipThrustReps, notes: "Rest 75 sec between sets" }
    ],
    conditioning: [{ name: "Easy Bike", duration: "10 min", notes: "Easy spin to flush the legs" }],
    cooldown: ["Walk 2 min", "Hip flexor stretch", "Glute stretch", "Calf stretch"],
    cycleAwareNotes
  });
}

function katyUpperIntervals(pressName: string, pressSets: number, pressReps: string, pulldownSets: number, pulldownReps: string, shoulderName: string, shoulderSets: number, shoulderReps: string, runNote: string, cycleAwareNotes?: string[]) {
  return buildTemplate({
    title: "Upper Strength + Run Work",
    type: "mixed",
    description: "Upper-body strength paired with run intervals.",
    warmup: upperWarmup(pressName),
    mainWork: [
      { name: pressName, sets: pressSets, reps: pressReps, notes: "Rest 90 sec between sets" },
      { name: "Lat Pulldown", sets: pulldownSets, reps: pulldownReps, notes: "Rest 75 sec between sets" },
      { name: shoulderName, sets: shoulderSets, reps: shoulderReps, notes: "Rest 75 sec between sets" }
    ],
    conditioning: [{ name: "Run Work", reps: "As written", notes: runNote }],
    cooldown: ["Walk 3 min", "Chest stretch", "Lat stretch", "Thoracic opener"],
    cycleAwareNotes
  });
}

function katyTrapBarDay(trapSets: number, trapReps: string, squatSets: number, squatReps: string, splitSets: number, splitReps: string, cycleAwareNotes?: string[]) {
  return buildTemplate({
    title: "Trap-Bar Strength Day",
    type: "strength",
    description: "Lower-body strength day with trap-bar pull and squat patterns.",
    warmup: lowerWarmup("Trap-Bar Deadlift"),
    mainWork: [
      { name: "Trap-Bar Deadlift", sets: trapSets, reps: trapReps, notes: "Rest 2-3 min between sets" },
      { name: "Back Squat", sets: squatSets, reps: squatReps, notes: "Rest 2 min between sets" },
      { name: "Split Squat", sets: splitSets, reps: splitReps, notes: "Rest 60 sec between sets" }
    ],
    cooldown: ["Walk 2 min", "Hip stretch", "Hamstring stretch", "Glute stretch"],
    cycleAwareNotes
  });
}

function katyBackSquatRun(backSquatSets: number, backSquatReps: string, rdlSets: number, rdlReps: string, lungeSets: number, lungeReps: string, runDuration: string, cycleAwareNotes?: string[]) {
  return buildTemplate({
    title: "Back Squat + Easy Run",
    type: "mixed",
    description: "Lower-body strength with controlled aerobic running.",
    warmup: lowerWarmup("Back Squat"),
    mainWork: [
      { name: "Back Squat", sets: backSquatSets, reps: backSquatReps, notes: "Rest 2 min between sets" },
      { name: "Romanian Deadlift", sets: rdlSets, reps: rdlReps, notes: "Rest 90 sec between sets" },
      { name: "Walking Lunge", sets: lungeSets, reps: lungeReps, notes: "Rest 60 sec between sets" }
    ],
    conditioning: [{ name: "Easy Run", duration: runDuration, notes: "Steady and comfortable pace" }],
    cooldown: ["Walk 2 min", "Hip stretch", "Hamstring stretch", "Calf stretch"],
    cycleAwareNotes
  });
}

function katyPosteriorDay(frontSquatSets: number, frontSquatReps: string, hipThrustSets: number, hipThrustReps: string, stepUpSets: number, stepUpReps: string, hamCurlSets: number, hamCurlReps: string) {
  return buildTemplate({
    title: "Lower Strength Builder",
    type: "strength",
    description: "Squat, hip extension, step-up, and hamstring accessory day.",
    warmup: lowerWarmup("Front Squat"),
    mainWork: [
      { name: "Front Squat", sets: frontSquatSets, reps: frontSquatReps, notes: "Rest 2 min between sets" },
      { name: "Hip Thrust", sets: hipThrustSets, reps: hipThrustReps, notes: "Rest 75 sec between sets" },
      { name: "Step-Up", sets: stepUpSets, reps: stepUpReps, notes: "Drive through the lead leg, rest 60 sec between sets" },
      { name: "Hamstring Curl", sets: hamCurlSets, reps: hamCurlReps, notes: "Smooth tempo, rest 45 sec between sets" }
    ],
    cooldown: ["Walk 2 min", "Hip stretch", "Hamstring stretch", "Calf stretch"]
  });
}

function katyRacePaceUpper(benchSets: number, benchReps: string, pullReps: string, shoulderReps: string, runNote: string, cycleAwareNotes?: string[]) {
  return buildTemplate({
    title: "Upper Strength + Race-Pace Run",
    type: "mixed",
    description: "Upper-body strength paired with precise race-pace intervals.",
    warmup: upperWarmup("Bench Press"),
    mainWork: [
      { name: "Bench Press", sets: benchSets, reps: benchReps, notes: "Rest 2 min between sets" },
      { name: "Pulldown or Pull-Up", sets: 3, reps: pullReps, notes: "Rest 90 sec between sets" },
      { name: "Seated Dumbbell Press", sets: 2, reps: shoulderReps, notes: "Rest 75 sec between sets" }
    ],
    conditioning: [{ name: "Run Work", reps: "As written", notes: runNote }],
    cooldown: ["Walk 3 min", "Lat stretch", "Chest stretch", "Thoracic opener"],
    cycleAwareNotes
  });
}

function katyDeadliftCarry(deadliftSets: number, deadliftReps: string, carrySets: number, carryDistance: string, lungeSets: number, lungeDistance: string) {
  return buildTemplate({
    title: "Deadlift + Carry Builder",
    type: "mixed",
    description: "Lower-body pull with carries, sandbag lunges, and mobility work.",
    warmup: lowerWarmup("Deadlift"),
    mainWork: [
      { name: "Deadlift", sets: deadliftSets, reps: deadliftReps, notes: "Rest 2-3 min between sets" },
      { name: "Farmer Carry", sets: carrySets, distance: carryDistance, notes: "Heavy and controlled, rest 60 sec between carries" },
      { name: "Sandbag Lunge", sets: lungeSets, distance: lungeDistance, notes: "Controlled turns, rest 60 sec between efforts" }
    ],
    conditioning: [{ name: "Mobility", duration: "10 min", notes: "Focus on hips, calves, thoracic spine, and breathing" }],
    cooldown: ["Walk 3 min", "Hip flexor stretch", "Quad stretch", "Calf stretch"]
  });
}

function lawtonWeek(week: number): WeekSchedule {
  const rest = restTemplate("lawton");
  const sundayClass = hyroxCs4Template("lawton");

  if (week <= 4) {
    const lowerConfigs = [
      [4, "8", 4, "8", 3, "10/leg", 3, "15", "20 min"],
      [4, "8", 4, "8", 3, "10/leg", 3, "15", "25 min"],
      [4, "8", 4, "8", 3, "12/leg", 3, "15", "25 min"],
      [3, "8", 3, "8", 2, "10/leg", 2, "15", "20 min"]
    ] as const;
    const tuesdayRuns = ["6 rounds of 2 min hard / 2 min easy recovery jog", "6 rounds of 2 min hard / 2 min easy recovery jog", "7 rounds of 2 min hard / 2 min easy recovery jog", "5 rounds of 2 min hard / 2 min easy recovery jog"];
    const wednesdayConfigs = [
      [3, "800 m", "15 m", "800 m", 20, "20 m", false],
      [3, "800 m", "15 m", "800 m", 20, "20 m", false],
      [4, "800 m", "15 m", "800 m", 20, "20 m", false],
      [3, "800 m", "15 m", "800 m", 15, "15 m", false]
    ] as const;
    const thursdayRuns = ["20 min", "22 min", "24 min", "18 min"];
    const saturdayConfigs = [
      [4, "6", 4, "8", 3, "8", 5, "40 m", "8 min"],
      [4, "6", 4, "8", 3, "8", 5, "40 m", "10 min"],
      [4, "6", 4, "8", 3, "8", 5, "45 m", "10 min"],
      [3, "6", 3, "8", 2, "8", 4, "40 m", "8 min"]
    ] as const;
    const index = week - 1;

    return {
      monday: lawtonLowerTemplate({ squatSets: lowerConfigs[index][0], squatReps: lowerConfigs[index][1], rdlSets: lowerConfigs[index][2], rdlReps: lowerConfigs[index][3], lungeSets: lowerConfigs[index][4], lungeReps: lowerConfigs[index][5], calfRaiseSets: lowerConfigs[index][6], calfRaiseReps: lowerConfigs[index][7], runDuration: lowerConfigs[index][8] }),
      tuesday: lawtonUpperIntervals(week === 4 ? 3 : 4, "8", week === 4 ? 3 : 4, week === 4 ? "8" : "10", week === 4 ? 2 : 3, "10", week === 4 ? 2 : 3, "10/side", tuesdayRuns[index]),
      wednesday: lawtonHyroxRounds(wednesdayConfigs[index][0], wednesdayConfigs[index][1], wednesdayConfigs[index][2], wednesdayConfigs[index][3], wednesdayConfigs[index][4], wednesdayConfigs[index][5], wednesdayConfigs[index][6]),
      thursday: lawtonLowerTempo(week === 4 ? 3 : 5, "5", week === 4 ? 3 : 4, week === 4 ? "5" : "6", week === 4 ? 2 : 3, "8/leg", thursdayRuns[index]),
      friday: rest,
      saturday: lawtonCarryDay(saturdayConfigs[index][0], saturdayConfigs[index][1], saturdayConfigs[index][2], saturdayConfigs[index][3], saturdayConfigs[index][4], saturdayConfigs[index][5], saturdayConfigs[index][6], saturdayConfigs[index][7], saturdayConfigs[index][8]),
      sunday: sundayClass
    };
  }

  if (week <= 8) {
    const lowerRuns = ["20 min", "25 min", "25 min", "20 min"];
    const tuesdayNotes = ["8 x 400 m with 90 sec rest", "8 x 400 m with 90 sec jog/walk rest", "10 x 400 m with 90 sec jog/walk rest", "6 x 400 m with 90 sec jog/walk rest"];
    const wednesdayConfigs = [
      [4, "800 m", "20 m", "800 m", 20, "20 m", false],
      [4, "800 m", "20 m", "800 m", 20, "20 m", false],
      [4, "800 m", "20 m", "800 m", 20, "20 m", true],
      [3, "800 m", "20 m", "800 m", 15, "15 m", false]
    ] as const;
    const thursdayRuns = ["22 min", "24 min", "25 min", "20 min"];
    const saturdayConfigs = [
      [4, "6", 4, "8", 3, "8", 5, "45 m", "10 min"],
      [4, "6", 4, "8", 3, "8", 5, "50 m", "10 min"],
      [4, "6", 4, "8", 3, "8", 5, "50 m", "10 min"],
      [3, "5", 3, "8", 2, "8", 4, "40 m", "8 min"]
    ] as const;
    const index = week - 5;

    return {
      monday: lawtonLowerTemplate({ squatSets: week === 8 ? 3 : 4, squatReps: week <= 7 ? "6" : "6", rdlSets: week === 8 ? 3 : 4, rdlReps: "6", lungeSets: week === 7 ? 3 : week === 8 ? 2 : 3, lungeReps: week === 7 ? "12/leg" : week === 8 ? "10/leg" : "10/leg", calfRaiseSets: week === 8 ? 2 : 3, calfRaiseReps: "15", runDuration: lowerRuns[index] }),
      tuesday: lawtonUpperIntervals(week === 8 ? 3 : 4, week === 8 ? "6" : "8", week === 8 ? 3 : 4, "8", week === 8 ? 2 : 3, week === 8 ? "8" : "10", week === 8 ? 2 : 3, week === 8 ? "8/side" : "10/side", tuesdayNotes[index]),
      wednesday: lawtonHyroxRounds(wednesdayConfigs[index][0], wednesdayConfigs[index][1], wednesdayConfigs[index][2], wednesdayConfigs[index][3], wednesdayConfigs[index][4], wednesdayConfigs[index][5], wednesdayConfigs[index][6]),
      thursday: lawtonLowerTempo(week === 8 ? 3 : 5, "4", week === 8 ? 3 : 4, week === 8 ? "4" : "5", week === 8 ? 2 : 3, "8/leg", thursdayRuns[index]),
      friday: rest,
      saturday: lawtonCarryDay(saturdayConfigs[index][0], saturdayConfigs[index][1], saturdayConfigs[index][2], saturdayConfigs[index][3], saturdayConfigs[index][4], saturdayConfigs[index][5], saturdayConfigs[index][6], saturdayConfigs[index][7], saturdayConfigs[index][8]),
      sunday: sundayClass
    };
  }

  if (week <= 12) {
    const index = week - 9;
    const mondayConfigs = [
      [5, "4", 4, "6", "Reverse Lunge", 3, "8/leg", "20 min"],
      [5, "4", 4, "6", "Reverse Lunge", 3, "8/leg", "20 min"],
      [5, "4", 4, "5", "Reverse Lunge", 3, "8/leg", "20 min"],
      [3, "4", 3, "5", "Reverse Lunge", 2, "8/leg", "15 min"]
    ] as const;
    const tuesdayNotes = [
      "5 x 800 m at threshold pace with 2 min walk/jog rest",
      "5 x 800 m at threshold pace with 2 min walk/jog rest",
      "6 x 800 m at threshold pace with 2 min walk/jog rest",
      "4 x 800 m at threshold pace with 2 min walk/jog rest"
    ];
    const wednesdayNotes = [
      "4 rounds of 1 km run, SkiErg 1000 m, sled push 20 m, sled pull 20 m, then 2 min rest",
      "4 rounds of 1 km run, SkiErg 1000 m, sled push 20 m, sled pull 20 m, then 2 min rest",
      "4 rounds of 1 km run, SkiErg 1000 m, sled push 25 m, sled pull 25 m, then 2 min rest",
      "3 rounds of 1 km run, SkiErg 1000 m, sled push 20 m, sled pull 20 m, then 2 min rest"
    ];
    const thursdayRuns = ["25 min", "28 min", "30 min", "20 min"];
    const saturdayRounds = [3, 4, 4, 3];
    const saturdayWallBalls = [20, 20, 20, 15];
    const saturdayBurpees = [12, 12, 12, 10];

    return {
      monday: lawtonPowerLower(mondayConfigs[index][0], mondayConfigs[index][1], mondayConfigs[index][2], mondayConfigs[index][3], mondayConfigs[index][4], mondayConfigs[index][5], mondayConfigs[index][6], mondayConfigs[index][7]),
      tuesday: lawtonThresholdDay(week === 12 ? 3 : 5, "4", "Weighted Pull-Up or Heavy Pulldown", week === 12 ? 3 : 4, "6", week === 12 ? 2 : 3, "5", tuesdayNotes[index]),
      wednesday: lawtonRunErgSledDay(wednesdayNotes[index]),
      thursday: buildTemplate({
        title: "Heavy Pull + Tempo Run",
        type: "mixed",
        description: "Heavy posterior-chain work plus sustained tempo running.",
        warmup: lowerWarmup("Deadlift"),
        mainWork: [
          { name: "Deadlift", sets: week === 12 ? 3 : 4, reps: "3", notes: "Rest 2-3 min between sets" },
          { name: "Front Squat", sets: week === 12 ? 3 : 4, reps: "4", notes: "Rest 2 min between sets" },
          { name: "Box Step-Over", sets: week === 12 ? 2 : 3, reps: "10/leg", notes: "Controlled and upright, rest 60 sec between sets" }
        ],
        conditioning: [{ name: "Tempo Run", duration: thursdayRuns[index], notes: "Settle into a smooth threshold rhythm" }],
        cooldown: ["Walk 3 min", "Hip flexor stretch", "Calf stretch", "Hamstring stretch"]
      }),
      friday: rest,
      saturday: lawtonSaturdayCircuitDay(week === 12 ? 3 : 4, "8", week === 12 ? 3 : 4, "8", saturdayRounds[index], "750 m", saturdayWallBalls[index], saturdayBurpees[index]),
      sunday: sundayClass
    };
  }

  if (week <= 16) {
    const index = week - 13;
    const tuesdayNotes = [
      "4 x 1 km at threshold/race blend pace with 2 min walk/jog rest",
      "5 x 1 km at threshold/race blend pace with 2 min walk/jog rest",
      "6 x 800 m at hard threshold pace with 2 min walk/jog rest",
      "4 x 800 m at threshold pace with 2 min walk/jog rest"
    ];
    const wednesdayNotes = [
      "2 rounds of 1 km run, SkiErg 1000 m, 1 km run, sled push 25 m, 1 km run, sled pull 25 m, then 3 min rest",
      "2 rounds of 1 km run, SkiErg 1000 m, 1 km run, sled push 25 m, 1 km run, sled pull 25 m, then 3 min rest",
      "2 rounds of 1 km run, SkiErg 1000 m, 1 km run, sled push 25 m, 1 km run, sled pull 25 m, 1 km run, then 3 min rest",
      "1 full round plus 1 partial round of 1 km run, SkiErg 1000 m, 1 km run, sled push 20 m, 1 km run, sled pull 20 m"
    ];
    const thursdayRuns = ["28 min", "30 min", "30 min", "22 min"];
    const saturdayRounds = [4, 4, 4, 3];
    const saturdayWallBalls = [20, 20, 20, 15];
    const saturdayBurpees = [12, 12, 12, 10];

    return {
      monday: lawtonPowerLower(week === 16 ? 3 : 5, "4", week === 16 ? 3 : 4, "5", "Reverse Lunge", week === 16 ? 2 : 3, "8/leg", week === 16 ? "20 min" : "20 min"),
      tuesday: lawtonThresholdDay(week === 16 ? 3 : 5, "4", "Weighted Pull-Up or Heavy Pulldown", week === 16 ? 3 : 4, "6", week === 16 ? 2 : 3, "5", tuesdayNotes[index]),
      wednesday: lawtonRunErgSledDay(wednesdayNotes[index]),
      thursday: buildTemplate({
        title: "Heavy Pull + Tempo Run",
        type: "mixed",
        description: "Heavy lower-body pull with a steady tempo finish.",
        warmup: lowerWarmup("Deadlift"),
        mainWork: [
          { name: "Deadlift", sets: week === 16 ? 3 : 4, reps: "3", notes: "Rest 2-3 min between sets" },
          { name: "Front Squat", sets: week === 16 ? 3 : 4, reps: "4", notes: "Rest 2 min between sets" },
          { name: "Box Step-Over", sets: week === 16 ? 2 : 3, reps: "10/leg", notes: "Controlled and upright, rest 60 sec between sets" }
        ],
        conditioning: [{ name: "Tempo Run", duration: thursdayRuns[index], notes: "Smooth threshold effort" }],
        cooldown: ["Walk 3 min", "Hip stretch", "Hamstring stretch", "Calf stretch"]
      }),
      friday: rest,
      saturday: lawtonSaturdayCircuitDay(week === 16 ? 3 : 4, "8", week === 16 ? 3 : 4, "8", saturdayRounds[index], "1000 m", saturdayWallBalls[index], saturdayBurpees[index]),
      sunday: sundayClass
    };
  }

  if (week <= 22) {
    const tuesdayIntervals = {
      17: "5 x 1 km at race pace with 2 min walk/jog rest",
      18: "5 x 1 km at race pace with 2 min walk/jog rest",
      19: "6 x 1 km at race pace with 2 min walk/jog rest",
      20: "6 x 1 km at race pace with 2 min walk/jog rest",
      21: "6 x 1 km at race pace with 2 min walk/jog rest",
      22: "4 x 1 km at race pace with 2 min walk/jog rest"
    } as const;
    const wednesdayNotes = {
      17: "1 km run, SkiErg 1000 m, 1 km run, sled push 50 m, 1 km run, sled pull 50 m, 1 km run, burpee broad jumps 40 m",
      18: "1 km run, SkiErg 1000 m, 1 km run, sled push 50 m, 1 km run, sled pull 50 m, 1 km run, burpee broad jumps 40 m, row 500 m",
      19: "1 km run, SkiErg 1000 m, 1 km run, sled push 50 m, 1 km run, sled pull 50 m, 1 km run, burpee broad jumps 40 m, 1 km run, row 1000 m",
      20: "1 km run, SkiErg 1000 m, 1 km run, sled push 50 m, 1 km run, sled pull 50 m, 1 km run, burpee broad jumps 40 m, 1 km run, row 1000 m",
      21: "1 km run, SkiErg 1000 m, 1 km run, sled push 50 m, 1 km run, sled pull 50 m, 1 km run, burpee broad jumps 40 m, 1 km run, row 1000 m, wall balls 30",
      22: "1 km run, SkiErg 1000 m, 1 km run, sled push 40 m, 1 km run, sled pull 40 m"
    } as const;
    const saturdayLunge = { 17: "30 m", 18: "35 m", 19: "40 m", 20: "40 m", 21: "40 m", 22: "30 m" } as const;
    const saturdayWall = { 17: 20, 18: 20, 19: 20, 20: 25, 21: 25, 22: 20 } as const;
    const saturdayBurpees = { 17: 12, 18: 12, 19: 12, 20: 12, 21: 15, 22: 10 } as const;
    const thursdayRun = { 17: "30 min", 18: "32 min", 19: "35 min", 20: "30 min", 21: "35 min", 22: "22 min" } as const;

    return {
      monday: lawtonPowerLower(week === 22 ? 2 : 3, "4", week === 22 ? 2 : 3, "5", "Split Squat", 2, week === 22 ? "6/leg" : "8/leg", week === 22 ? "15 min" : "20 min"),
      tuesday: buildTemplate({
        title: "Upper Strength + Race-Pace Run",
        type: "mixed",
        description: "Compact upper-body strength paired with race-pace intervals.",
        warmup: upperWarmup("Bench Press"),
        mainWork: [
          { name: "Bench Press", sets: week === 22 ? 2 : 3, reps: "4", notes: "Rest 2 min between sets" },
          { name: "Pull-Up", sets: week === 22 ? 2 : 3, reps: "5", notes: "Use assistance if needed to keep reps clean" },
          { name: "Dumbbell Press", sets: 2, reps: week === 22 ? "6" : "8", notes: "Rest 75 sec between sets" }
        ],
        conditioning: [{ name: "Run Work", reps: "As written", notes: tuesdayIntervals[week as keyof typeof tuesdayIntervals] }],
        cooldown: ["Walk 3 min", "Lat stretch", "Chest stretch", "Thoracic opener"]
      }),
      wednesday: lawtonRunErgSledDay(wednesdayNotes[week as keyof typeof wednesdayNotes]),
      thursday: buildTemplate({
        title: "Deadlift + Carry Run",
        type: "mixed",
        description: "Heavy deadlift, loaded carries, and a steady run.",
        warmup: lowerWarmup("Deadlift"),
        mainWork: [
          { name: "Deadlift", sets: week === 22 ? 2 : 3, reps: "3", notes: "Rest 2-3 min between sets" },
          { name: "Farmer Carry", sets: week === 22 ? 3 : 4, distance: week === 22 ? "50 m" : "60 m", notes: "Heavy and controlled, rest 60 sec between carries" }
        ],
        conditioning: [{ name: week === 22 ? "Steady Run" : "Tempo Run", duration: thursdayRun[week as keyof typeof thursdayRun], notes: "Smooth, sustainable effort" }],
        cooldown: ["Walk 3 min", "Hip stretch", "Hamstring stretch", "Calf stretch"]
      }),
      friday: rest,
      saturday: lawtonRaceSpecificSaturday(week === 22 ? 3 : 4, "1000 m", saturdayLunge[week as keyof typeof saturdayLunge], saturdayWall[week as keyof typeof saturdayWall], saturdayBurpees[week as keyof typeof saturdayBurpees]),
      sunday: sundayClass
    };
  }

  return {
    monday: buildTemplate({
      title: "Taper Strength + Easy Run",
      type: "mixed",
      description: "Short strength exposure with controlled easy running.",
      warmup: lowerWarmup("Back Squat"),
      mainWork: [{ name: "Back Squat", sets: 3, reps: "3", notes: "Rest 2 min between sets" }],
      conditioning: [{ name: "Easy Run", duration: week === 24 ? "20 min" : "15 min", notes: "Relaxed aerobic running" }],
      cooldown: ["Walk 3 min", "Hip stretch", "Calf stretch", "Hamstring stretch"]
    }),
    tuesday: buildTemplate({
      title: "Taper Bench + Race Pace",
      type: "mixed",
      description: "Short upper-body primer paired with race-pace intervals.",
      warmup: upperWarmup("Bench Press"),
      mainWork: [
        { name: "Bench Press", sets: 3, reps: "3", notes: "Rest 2 min between sets" },
        { name: "Pull-Up", sets: 3, reps: "4", notes: "Stay crisp and submaximal" }
      ],
      conditioning: [{ name: "Run Work", reps: "As written", notes: `${week === 24 ? 5 : 4} x 1 km at race pace with full relaxed recovery` }],
      cooldown: ["Walk 3 min", "Chest stretch", "Lat stretch", "Thoracic opener"]
    }),
    wednesday: lawtonRunErgSledDay(
      week === 23
        ? "5 segments: 1 km run + SkiErg 1000 m; 1 km run + sled push 25 m; 1 km run + sled pull 25 m; 1 km run + row 1000 m; 1 km run + wall balls 20"
        : week === 24
          ? "6 segments: 1 km run + SkiErg 1000 m; 1 km run + sled push 25 m; 1 km run + sled pull 25 m; 1 km run + burpee broad jumps 40 m; 1 km run + row 1000 m; 1 km run + wall balls 20"
          : "6 segments: 1 km run + SkiErg 1000 m; 1 km run + sled push 50 m; 1 km run + sled pull 50 m; 1 km run + burpee broad jumps 40 m; 1 km run + row 1000 m; 1 km run + wall balls 30"
    ),
    thursday: buildTemplate({
      title: "Taper Tempo + Carry",
      type: "mixed",
      description: "Race-adjacent tempo work with carries and lunges.",
      warmup: ["5 min easy jog", "Dynamic hips and calves", "Band shoulder activation"],
      mainWork: [
        { name: "Farmer Carry", sets: week === 25 ? 3 : 4, distance: "50 m", notes: "Stay braced and smooth, rest 60 sec" },
        { name: "Sandbag Lunge", sets: 2, distance: "20 m", notes: "Controlled turns, rest 60 sec between efforts" }
      ],
      conditioning: [{ name: week === 25 ? "Steady Tempo Run" : "Tempo Run", duration: week === 23 ? "25 min" : week === 24 ? "28 min" : "22 min", notes: "Controlled race-prep effort" }],
      cooldown: ["Walk 3 min", "Hip stretch", "Quad stretch", "Calf stretch"]
    }),
    friday: rest,
    saturday: buildTemplate({
      title: "Short Station Circuit",
      type: "hyrox",
      description: "Compact taper circuit with crisp execution and plenty of control.",
      warmup: hybridWarmup(),
      mainWork: [
        {
          name: "Circuit",
          reps: `${week === 24 ? 4 : 3} rounds`,
          notes: `SkiErg 500 m; row 500 m; wall balls ${week === 25 ? 12 : 15}; burpees ${week === 25 ? 8 : 10}; rest 90 sec between rounds`
        }
      ],
      cooldown: ["Walk 5 min", "Shoulder stretch", "Hip stretch", "Calf stretch"]
    }),
    sunday: sundayClass
  };
}

function katyWeek(week: number): WeekSchedule {
  const rest = restTemplate("katy");
  const cycle = cycleTemplate();
  const sundayClass = hyroxCs4Template("katy");

  if (week <= 4) {
    const mondayConfig = [
      [4, "8", 4, "8", 3, "10/leg", 3, "10"],
      [4, "8", 4, "8", 3, "10/leg", 3, "10"],
      [4, "8", 4, "8", 3, "10/leg", 3, "10"],
      [3, "8", 3, "8", 2, "10/leg", 2, "10"]
    ] as const;
    const tuesdayNotes = [
      "5 rounds of 2 min hard / 2 min easy recovery jog",
      "5 rounds of 2 min hard / 2 min easy recovery jog",
      "5 rounds of 2 min hard / 2 min easy recovery jog",
      "4 rounds of 2 min hard / 2 min easy recovery jog"
    ];
    const index = week - 1;
    const cycleAwareNotes = week === 3 ? [cycleYellow, `${cycleRed} If symptoms are high, keep the lifting as written and switch to easy bike or walk 25 min instead of intervals.`] : undefined;
    const thursdayNotes = week === 3 ? [cycleYellow, `${cycleRed} Replace the full lower-body strength day with mobility and easy cardio for 20 min if symptoms are high.`] : undefined;

    return {
      monday: katyLowerBike(mondayConfig[index][0], mondayConfig[index][1], mondayConfig[index][2], mondayConfig[index][3], mondayConfig[index][4], mondayConfig[index][5], mondayConfig[index][6], mondayConfig[index][7]),
      tuesday: katyUpperIntervals("Dumbbell Bench Press", week === 4 ? 3 : 4, "8", week === 4 ? 3 : 4, week === 4 ? "8" : "10", "Seated Dumbbell Press", week === 4 ? 2 : 3, week === 4 ? "10" : "10", tuesdayNotes[index], cycleAwareNotes),
      wednesday: cycle,
      thursday: katyTrapBarDay(week === 4 ? 3 : 5, week === 4 ? "5" : "5", week === 4 ? 3 : 4, week === 4 ? "5" : "6", week === 4 ? 2 : 3, "8/leg", thursdayNotes),
      friday: rest,
      saturday: cycle,
      sunday: sundayClass
    };
  }

  if (week <= 8) {
    const mondaySets = week === 8 ? 3 : 4;
    const mondayReps = "6";
    const tuesdayNote = week <= 7 ? "6 rounds of 2 min hard / 2 min easy recovery jog" : "4 rounds of 2 min hard / 2 min easy recovery jog";
    const tuesdayCycleNotes = week === 7 ? [cycleYellow, `${cycleRed} Keep the lifting as written and replace intervals with easy bike or walk 25 min if needed.`] : undefined;
    const thursdayCycleNotes = week === 7 ? [cycleYellow, `${cycleRed} Replace this session with mobility and easy cardio 20 min if symptoms are high.`] : undefined;

    return {
      monday: katyLowerBike(mondaySets, mondayReps, mondaySets, mondayReps, week === 8 ? 2 : 3, week === 8 ? "8/leg" : "10/leg", week === 8 ? 2 : 3, week === 8 ? "8" : "8"),
      tuesday: katyUpperIntervals("Bench Press", week === 8 ? 3 : 4, week === 8 ? "6" : "8", week === 8 ? 3 : 4, "8", "Seated Dumbbell Press", week === 8 ? 2 : 3, week === 8 ? "8" : "10", tuesdayNote, tuesdayCycleNotes),
      wednesday: cycle,
      thursday: katyTrapBarDay(week === 8 ? 3 : 5, week === 8 ? "4" : "4", week === 8 ? 3 : 4, week === 8 ? "4" : "6", week === 8 ? 2 : 3, "8/leg", thursdayCycleNotes),
      friday: rest,
      saturday: cycle,
      sunday: sundayClass
    };
  }

  if (week <= 12) {
    const cycleAwareMonday = week === 11 ? [cycleYellow, `${cycleRed} If symptoms are high, use Back Squat 4 x 4, Romanian Deadlift 3 x 6, Walking Lunge 2 x 8/leg, and easy bike or walk 15 min.`] : undefined;
    const cycleAwareTuesday = week === 11 ? [cycleYellow, `${cycleRed} If symptoms are high, keep the lifting as written and replace intervals with a steady run for 22 min.`] : undefined;
    const tuesdayNote = week === 11 ? "5 x 800 m at threshold pace with 2 min walk/jog rest" : week === 12 ? "3 x 800 m at threshold pace with 2 min walk/jog rest" : "4 x 800 m at threshold pace with 2 min walk/jog rest";

    return {
      monday: katyBackSquatRun(week === 12 ? 3 : 5, "4", week === 12 ? 3 : 4, week === 11 ? "6" : week === 12 ? "5" : "6", week === 12 ? 2 : 3, "8/leg", "15 min", cycleAwareMonday),
      tuesday: buildTemplate({
        title: "Upper Strength + Threshold Run",
        type: "mixed",
        description: "Bench, pull, press, and threshold intervals.",
        warmup: upperWarmup("Bench Press"),
        mainWork: [
          { name: "Bench Press", sets: week === 12 ? 3 : 4, reps: "5", notes: "Rest 2 min between sets" },
          { name: "Pull-Up or Pulldown", sets: week === 12 ? 3 : 4, reps: "6-8", notes: "Rest 90 sec between sets" },
          { name: "Overhead Press", sets: week === 12 ? 2 : 3, reps: "5", notes: "Rest 90 sec between sets" }
        ],
        conditioning: [{ name: "Run Work", reps: "As written", notes: tuesdayNote }],
        cooldown: ["Walk 3 min", "Lat stretch", "Chest stretch", "Thoracic opener"],
        cycleAwareNotes: cycleAwareTuesday
      }),
      wednesday: cycle,
      thursday: katyPosteriorDay(week === 12 ? 3 : 4, week === 12 ? "5" : "6", week === 12 ? 2 : 3, "8", week === 12 ? 2 : 3, week === 12 ? "8/leg" : "10/leg", week === 12 ? 2 : 3, "12"),
      friday: rest,
      saturday: cycle,
      sunday: sundayClass
    };
  }

  if (week <= 16) {
    const cycleAwareMonday = week === 15 ? [cycleYellow, `${cycleRed} If symptoms are high, use Back Squat 4 x 4, Romanian Deadlift 3 x 5, Walking Lunge 2 x 8/leg, and easy bike or walk 15 min.`] : undefined;
    const cycleAwareTuesday = week === 15 ? [cycleYellow, `${cycleRed} If symptoms are high, keep the lifting as written and replace intervals with a steady run for 24 min.`] : undefined;
    const tuesdayNote = week === 13 ? "5 x 800 m at threshold pace with 2 min walk/jog rest" : week === 14 ? "4 x 1 km at threshold/race blend pace with 2 min walk/jog rest" : week === 15 ? "5 x 800 m at threshold pace with 2 min walk/jog rest" : "4 x 800 m at threshold pace with 2 min walk/jog rest";

    return {
      monday: katyBackSquatRun(week === 16 ? 3 : 5, "4", week === 16 ? 3 : 4, "5", week === 16 ? 2 : 3, "8/leg", week === 16 ? "15 min" : "20 min", cycleAwareMonday),
      tuesday: buildTemplate({
        title: "Upper Strength + Threshold Run",
        type: "mixed",
        description: "Upper-body strength with quality threshold running.",
        warmup: upperWarmup("Bench Press"),
        mainWork: [
          { name: "Bench Press", sets: week === 16 ? 3 : 4, reps: "5", notes: "Rest 2 min between sets" },
          { name: "Pull-Up or Pulldown", sets: week === 16 ? 3 : 4, reps: "6-8", notes: "Rest 90 sec between sets" },
          { name: "Overhead Press", sets: week === 16 ? 2 : 3, reps: "5", notes: "Rest 90 sec between sets" }
        ],
        conditioning: [{ name: "Run Work", reps: "As written", notes: tuesdayNote }],
        cooldown: ["Walk 3 min", "Lat stretch", "Chest stretch", "Thoracic opener"],
        cycleAwareNotes: cycleAwareTuesday
      }),
      wednesday: cycle,
      thursday: katyPosteriorDay(week === 16 ? 3 : 4, week === 16 ? "5" : "6", week === 16 ? 2 : 3, "8", week === 16 ? 2 : 3, week === 16 ? "8/leg" : "10/leg", week === 16 ? 2 : 3, "12"),
      friday: rest,
      saturday: cycle,
      sunday: sundayClass
    };
  }

  if (week <= 22) {
    const cycleAwareMonday = week === 19 ? [cycleYellow, `${cycleRed} If symptoms are high, reduce to Squat 2 x 4, Romanian Deadlift 2 x 5, and easy bike or walk 20 min.`] : undefined;
    const cycleAwareTuesday = week === 19 ? [cycleYellow, `${cycleRed} If symptoms are high, keep the lifting as written and replace the intervals with a steady run for 24 min.`] : undefined;
    const runNote =
      week <= 19
        ? "5 x 1 km at race pace with 2 min walk/jog rest"
        : week <= 21
          ? "6 x 1 km at race pace with 2 min walk/jog rest"
          : "4 x 1 km at race pace with 2 min walk/jog rest";

    return {
      monday: buildTemplate({
        title: "Squat + Easy Run",
        type: "mixed",
        description: "Compact lower-body strength with a steady aerobic finish.",
        warmup: lowerWarmup("Back Squat"),
        mainWork: [
          { name: "Squat", sets: week === 22 ? 2 : 3, reps: "4", notes: "Rest 2 min between sets" },
          { name: "Romanian Deadlift", sets: week === 22 ? 2 : 3, reps: "5", notes: "Rest 90 sec between sets" }
        ],
        conditioning: [{ name: week === 19 && cycleAwareMonday ? "Easy Bike or Walk" : "Easy Run", duration: week === 22 ? "15 min" : "20 min", notes: "Stay easy and conversational" }],
        cooldown: ["Walk 2 min", "Hip stretch", "Hamstring stretch", "Calf stretch"],
        cycleAwareNotes: cycleAwareMonday
      }),
      tuesday: katyRacePaceUpper(week === 22 ? 2 : 3, "4", "5", week === 22 ? "6" : "8", runNote, cycleAwareTuesday),
      wednesday: cycle,
      thursday: katyDeadliftCarry(week === 22 ? 2 : 3, "3", week === 22 ? 3 : 4, week === 22 ? "40 m" : "50 m", week === 22 ? 2 : 3, week === 22 ? "15 m" : "20 m"),
      friday: rest,
      saturday: cycle,
      sunday: sundayClass
    };
  }

  const cycleAwareMonday = week === 24 ? [cycleYellow, `${cycleRed} If symptoms are high, use Back Squat 2 x 3 and easy bike or walk 15 min.`] : undefined;
  const cycleAwareTuesday = week === 24 ? [cycleYellow, `${cycleRed} If symptoms are high, keep the lifting as written and replace intervals with a steady run for 20 min.`] : undefined;

  return {
    monday: buildTemplate({
      title: "Taper Squat + Easy Run",
      type: "mixed",
      description: "Short squat exposure with easy aerobic volume.",
      warmup: lowerWarmup("Back Squat"),
      mainWork: [{ name: "Back Squat", sets: week === 24 && cycleAwareMonday ? 3 : 3, reps: "3", notes: "Rest 2 min between sets" }],
      conditioning: [{ name: cycleAwareMonday ? "Easy Run" : "Easy Run", duration: "15 min", notes: "Relaxed and smooth" }],
      cooldown: ["Walk 2 min", "Hip stretch", "Calf stretch", "Hamstring stretch"],
      cycleAwareNotes: cycleAwareMonday
    }),
    tuesday: buildTemplate({
      title: "Taper Bench + Race Pace",
      type: "mixed",
      description: "Short upper-body primer with race-pace intervals.",
      warmup: upperWarmup("Bench Press"),
      mainWork: [
        { name: "Bench Press", sets: 3, reps: "3", notes: "Rest 2 min between sets" },
        { name: "Pulldown or Pull-Up", sets: 3, reps: "4", notes: "Stay crisp and submaximal" }
      ],
      conditioning: [{ name: "Run Work", reps: "As written", notes: "4 x 1 km at race pace with full relaxed recovery" }],
      cooldown: ["Walk 3 min", "Lat stretch", "Chest stretch", "Thoracic opener"],
      cycleAwareNotes: cycleAwareTuesday
    }),
    wednesday: cycle,
    thursday: buildTemplate({
      title: "Steady Tempo + Carry",
      type: "mixed",
      description: "Low-volume tempo work with carries and sandbag lunges.",
      warmup: ["5 min easy jog", "Dynamic hips and calves", "Shoulder activation"],
      mainWork: [
        { name: "Farmer Carry", sets: week === 25 ? 3 : 4, distance: "40 m", notes: "Heavy and controlled, rest 60 sec" },
        { name: "Sandbag Lunge", sets: 2, distance: "20 m", notes: "Controlled turns, rest 60 sec between efforts" }
      ],
      conditioning: [{ name: week === 25 ? "Steady Run" : "Steady Tempo Run", duration: week === 23 ? "22 min" : week === 24 ? "20-25 min" : "22 min", notes: "Controlled, not draining" }],
      cooldown: ["Walk 3 min", "Hip stretch", "Quad stretch", "Calf stretch"]
    }),
    friday: rest,
    saturday: cycle,
    sunday: sundayClass
  };
}

function generateWeeklyBlocks(athleteId: AthleteId, weekBuilder: (week: number) => WeekSchedule) {
  const orderedDays: Array<keyof WeekSchedule> = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
  const weeks = Array.from({ length: 25 }, (_, index) => weekBuilder(index + 1));

  return weeks.flatMap((week, weekIndex) =>
    orderedDays.map((day, dayOffset) =>
      applyTemplate(toIso(addDays(PLAN_START, weekIndex * 7 + dayOffset)), athleteId, week[day])
    )
  );
}

function customLawtonTail(): WorkoutDay[] {
  return [
    buildTemplate({
      title: "Taper Strength + Easy Run",
      type: "mixed",
      description: "Back squat and bench primer with a short easy run.",
      warmup: lowerWarmup("Back Squat"),
      mainWork: [
        { name: "Back Squat", sets: 2, reps: "3", notes: "Rest 2 min between sets" },
        { name: "Bench Press", sets: 2, reps: "3", notes: "Rest 2 min between sets" }
      ],
      conditioning: [{ name: "Easy Run", duration: "10 min", notes: "Relaxed and smooth" }],
      cooldown: ["Walk 3 min", "Hip stretch", "Chest stretch", "Calf stretch"]
    }),
    buildTemplate({
      title: "Race Pace 800s + Mobility",
      type: "run",
      description: "Short race-pace interval session with full relaxed recovery.",
      warmup: ["10 min easy jog", "Dynamic mobility", "3 x 60 m strides"],
      mainWork: [{ name: "Run Intervals", reps: "3 reps", notes: "800 m at race pace with full relaxed recovery between reps" }],
      conditioning: [{ name: "Mobility", duration: "10 min", notes: "Hips, calves, thoracic spine, and breathing" }],
      cooldown: ["Walk 5 min", "Gentle lower-body stretch"]
    }),
    buildTemplate({
      title: "Short Station Circuit",
      type: "hyrox",
      description: "Light station exposure without fatigue accumulation.",
      warmup: hybridWarmup(),
      mainWork: [{ name: "Circuit", reps: "2 rounds", notes: "SkiErg 500 m; row 500 m; wall balls 10; lunges 10 total; rest 2 min between rounds" }],
      cooldown: ["Walk 5 min", "Hip stretch", "Shoulder stretch"]
    }),
    buildTemplate({
      title: "Easy Run + Strides",
      type: "run",
      description: "Light aerobic maintenance with short relaxed strides.",
      warmup: ["5 min easy jog", "Dynamic mobility"],
      mainWork: [{ name: "Easy Run", duration: "20 min", notes: "Keep effort easy, then add 4 short strides at the end" }],
      conditioning: [],
      cooldown: ["Walk 5 min", "Calf stretch", "Hip flexor stretch"]
    }),
    templateFromWorkout(buildRestDay("2026-01-01", "lawton")),
    buildTemplate({
      title: "Zone 2 Run",
      type: "run",
      description: "Final easy aerobic run before race week sharpens.",
      warmup: ["5 min brisk walk", "Dynamic mobility"],
      mainWork: [{ name: "Zone 2 Run", duration: "35 min", notes: "Keep the effort easy and rhythmic" }],
      conditioning: [],
      cooldown: ["Walk 5 min", "Calf stretch", "Hamstring stretch"]
    }),
    hyroxCs4Template("lawton"),
    buildTemplate({
      title: "Race Pace 400s + Easy Circuit",
      type: "hyrox",
      description: "Brief speed reminder with a light station circuit.",
      warmup: ["10 min easy jog", "Dynamic mobility", "2 x 60 m strides"],
      mainWork: [{ name: "Run Intervals", reps: "2 reps", notes: "400 m at race pace with full relaxed recovery" }],
      conditioning: [{ name: "Easy Station Circuit", reps: "1 round", notes: "SkiErg 250 m; row 250 m; wall balls 8" }],
      cooldown: ["Walk 5 min", "Easy stretch"]
    }),
    buildTemplate({
      title: "Walk + Mobility",
      type: "recovery",
      description: "Recovery day to stay loose and calm.",
      warmup: [],
      mainWork: [{ name: "Walk", duration: "20 min", notes: "Relaxed walk with nasal breathing" }],
      conditioning: [{ name: "Mobility", duration: "10 min", notes: "Hips, calves, shoulders, thoracic spine" }],
      cooldown: ["2 min breathing reset"]
    }),
    buildTemplate({
      title: "Easy Spin or Jog",
      type: "recovery",
      description: "Light movement only to stay sharp without adding fatigue.",
      warmup: [],
      mainWork: [{ name: "Easy Spin or Jog", duration: "15 min", notes: "Keep effort very easy and stop feeling fresh" }],
      conditioning: [],
      cooldown: ["2 min breathing reset", "Light mobility"]
    }),
    templateFromWorkout(buildRestDay("2026-01-01", "lawton")),
    templateFromWorkout(buildRaceDay("2026-01-01", "lawton"))
  ].map((template, index) => applyTemplate(toIso(addDays(WEEK_26_START, index)), "lawton", template));
}

function customKatyTail(): WorkoutDay[] {
  return [
    buildTemplate({
      title: "Taper Strength + Easy Run",
      type: "mixed",
      description: "Back squat and bench primer with a short easy run.",
      warmup: lowerWarmup("Back Squat"),
      mainWork: [
        { name: "Back Squat", sets: 2, reps: "3", notes: "Rest 2 min between sets" },
        { name: "Bench Press", sets: 2, reps: "3", notes: "Rest 2 min between sets" }
      ],
      conditioning: [{ name: "Easy Run", duration: "10 min", notes: "Relaxed and smooth" }],
      cooldown: ["Walk 3 min", "Hip stretch", "Chest stretch", "Calf stretch"]
    }),
    buildTemplate({
      title: "Race Pace 800s + Mobility",
      type: "run",
      description: "Short race-pace interval session with full relaxed recovery.",
      warmup: ["10 min easy jog", "Dynamic mobility", "3 x 60 m strides"],
      mainWork: [{ name: "Run Intervals", reps: "3 reps", notes: "800 m at race pace with full relaxed recovery between reps" }],
      conditioning: [{ name: "Mobility", duration: "10 min", notes: "Hips, calves, thoracic spine, and breathing" }],
      cooldown: ["Walk 5 min", "Gentle lower-body stretch"]
    }),
    cycleTemplate(),
    buildTemplate({
      title: "Easy Run + Strides",
      type: "run",
      description: "Light aerobic maintenance with short relaxed strides.",
      warmup: ["5 min easy jog", "Dynamic mobility"],
      mainWork: [{ name: "Easy Run", duration: "20 min", notes: "Keep effort easy, then add 4 short strides at the end" }],
      conditioning: [],
      cooldown: ["Walk 5 min", "Calf stretch", "Hip flexor stretch"]
    }),
    templateFromWorkout(buildRestDay("2026-01-01", "katy")),
    cycleTemplate(),
    hyroxCs4Template("katy"),
    buildTemplate({
      title: "Race Pace 400s + Easy Circuit",
      type: "hyrox",
      description: "Brief speed reminder with a light station circuit.",
      warmup: ["10 min easy jog", "Dynamic mobility", "2 x 60 m strides"],
      mainWork: [{ name: "Run Intervals", reps: "2 reps", notes: "400 m at race pace with full relaxed recovery" }],
      conditioning: [{ name: "Easy Station Circuit", reps: "1 round", notes: "SkiErg 250 m; row 250 m; wall balls 8" }],
      cooldown: ["Walk 5 min", "Easy stretch"]
    }),
    buildTemplate({
      title: "Walk + Mobility",
      type: "recovery",
      description: "Recovery day to stay loose and calm.",
      warmup: [],
      mainWork: [{ name: "Walk", duration: "20 min", notes: "Relaxed walk with nasal breathing" }],
      conditioning: [{ name: "Mobility", duration: "10 min", notes: "Hips, calves, shoulders, thoracic spine" }],
      cooldown: ["2 min breathing reset"]
    }),
    cycleTemplate("Studio cycle session used as the day’s assigned cardio workout, or easy spin 30 min if taper adjustment is needed."),
    templateFromWorkout(buildRestDay("2026-01-01", "katy")),
    templateFromWorkout(buildRaceDay("2026-01-01", "katy"))
  ].map((template, index) => applyTemplate(toIso(addDays(WEEK_26_START, index)), "katy", template));
}

export function generateLawtonWorkouts() {
  const workouts = [...generateWeeklyBlocks("lawton", lawtonWeek), ...customLawtonTail()];
  const expectedDates = eachDayOfInterval({ start: PLAN_START, end: PLAN_END }).map(toIso);

  if (workouts.length !== expectedDates.length) {
    throw new Error(`Lawton workouts length mismatch: expected ${expectedDates.length}, received ${workouts.length}`);
  }

  return workouts;
}

export function generateKatyWorkouts() {
  const workouts = [...generateWeeklyBlocks("katy", katyWeek), ...customKatyTail()];
  const expectedDates = eachDayOfInterval({ start: PLAN_START, end: PLAN_END }).map(toIso);

  if (workouts.length !== expectedDates.length) {
    throw new Error(`Katy workouts length mismatch: expected ${expectedDates.length}, received ${workouts.length}`);
  }

  return workouts;
}
