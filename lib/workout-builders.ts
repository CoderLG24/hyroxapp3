import type { AthleteId, ExerciseBlock, WorkoutDay } from "@/lib/types";

type WorkoutTemplate = Omit<WorkoutDay, "date" | "athleteId">;

interface StrengthDayParams {
  date: string;
  athleteId: AthleteId;
  title: string;
  description: string;
  warmup: string[];
  mainWork: ExerciseBlock[];
  conditioning: ExerciseBlock[];
  cooldown: string[];
  type?: WorkoutDay["type"];
  cycleAwareNotes?: string[];
}

interface LawtonLowerStrengthRunParams {
  date: string;
  athleteId: AthleteId;
  squatSets: number;
  squatReps: string;
  rdlSets: number;
  rdlReps: string;
  lungeSets: number;
  lungeReps: string;
  calfRaiseSets?: number;
  calfRaiseReps?: string;
  runDuration: string;
  title?: string;
}

function createWorkout(params: StrengthDayParams): WorkoutDay {
  return {
    date: params.date,
    athleteId: params.athleteId,
    title: params.title,
    type: params.type ?? "mixed",
    description: params.description,
    warmup: params.warmup,
    mainWork: params.mainWork,
    conditioning: params.conditioning,
    cooldown: params.cooldown,
    isRestDay: false,
    cycleAwareNotes: params.cycleAwareNotes
  };
}

export function applyTemplate(date: string, athleteId: AthleteId, template: WorkoutTemplate): WorkoutDay {
  return { ...template, date, athleteId };
}

export function buildRestDay(date: string, athleteId: AthleteId): WorkoutDay {
  return {
    date,
    athleteId,
    title: "Rest Day",
    type: "rest",
    description: "Full rest day with optional walking and light mobility.",
    warmup: [],
    mainWork: [],
    conditioning: [],
    cooldown: ["Optional easy walk", "Optional light mobility"],
    isRestDay: true
  };
}

export function buildCycleClassDay(date: string, athleteId: AthleteId, description?: string): WorkoutDay {
  return {
    date,
    athleteId,
    title: "Cycle Class",
    type: "cycle",
    description:
      description ??
      "Studio cycle session used as the day’s assigned cardio workout.",
    warmup: ["5 min easy spin", "Light ankle, hip, and thoracic mobility"],
    mainWork: [
      {
        name: "Cycle Class",
        duration: "45-60 min",
        notes: "Instructor-led class with rolling hill and threshold efforts"
      }
    ],
    conditioning: [],
    cooldown: ["5 min easy spin", "Lower-body stretch"],
    isRestDay: false
  };
}

export function buildRaceDay(date: string, athleteId: AthleteId): WorkoutDay {
  return {
    date,
    athleteId,
    title: "Race Day",
    type: "race",
    description: "Hyrox race day. Execute the warmup calmly, trust the work, and race together.",
    warmup: [
      "5 min easy jog",
      "2 x 20 sec SkiErg build",
      "2 x 20 sec row build",
      "Dynamic hips, calves, and shoulders",
      "3 x 60 m relaxed strides"
    ],
    mainWork: [
      {
        name: "Hyrox Race",
        duration: "Event duration",
        notes: "Pace the opening run, stay composed through stations, and finish strong."
      }
    ],
    conditioning: [],
    cooldown: ["10 min walk", "Hydrate, fuel, and complete a gentle lower-body stretch"],
    isRestDay: false
  };
}

export function buildLawtonLowerStrengthRunDay(params: LawtonLowerStrengthRunParams): WorkoutDay {
  const mainWork: ExerciseBlock[] = [
    { name: "Back Squat", sets: params.squatSets, reps: params.squatReps, notes: "Rest 2 min between sets" },
    { name: "Romanian Deadlift", sets: params.rdlSets, reps: params.rdlReps, notes: "Rest 90 sec between sets" },
    {
      name: "Walking Lunge",
      sets: params.lungeSets,
      reps: params.lungeReps,
      notes: "Controlled steps, rest 60 sec between sets"
    }
  ];

  if (params.calfRaiseSets && params.calfRaiseReps) {
    mainWork.push({
      name: "Standing Calf Raise",
      sets: params.calfRaiseSets,
      reps: params.calfRaiseReps,
      notes: "1 sec pause at top, rest 45 sec between sets"
    });
  }

  return createWorkout({
    date: params.date,
    athleteId: params.athleteId,
    title: params.title ?? "Lower Strength + Zone 2 Run",
    type: "strength",
    description: "Lower-body strength focus followed by a controlled aerobic run.",
    warmup: [
      "5 min easy bike",
      "World's greatest stretch x 5/side",
      "Glute bridge x 12",
      "Bodyweight squat x 10",
      "2 progressive warmup sets for the first lift"
    ],
    mainWork,
    conditioning: [
      {
        name: "Zone 2 Run",
        duration: params.runDuration,
        notes: "Keep effort conversational, nasal breathing if possible"
      }
    ],
    cooldown: ["Walk 3 min", "Hip flexor stretch", "Hamstring stretch", "Calf stretch"]
  });
}

export function buildStrengthWorkout(params: StrengthDayParams): WorkoutDay {
  return createWorkout(params);
}

export function asTemplate(workout: WorkoutDay): WorkoutTemplate {
  return {
    title: workout.title,
    type: workout.type,
    description: workout.description,
    warmup: workout.warmup,
    mainWork: workout.mainWork,
    conditioning: workout.conditioning,
    cooldown: workout.cooldown,
    isRestDay: workout.isRestDay,
    cycleAwareNotes: workout.cycleAwareNotes
  };
}
