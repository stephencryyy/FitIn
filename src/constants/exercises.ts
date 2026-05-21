import { ExerciseDocument } from '@/src/types/workout';

export const SEED_EXERCISES: Omit<ExerciseDocument, 'id'>[] = [
  // CHEST
  { name: 'Barbell Bench Press', category: 'strength', primaryMuscle: 'Chest', secondaryMuscles: ['Triceps', 'Shoulders'], equipment: ['Barbell', 'Bench'], instructions: 'Lie on a flat bench, grip the bar slightly wider than shoulder width, lower to chest, press up.', imageURL: null, isCustom: false },
  { name: 'Incline Barbell Bench Press', category: 'strength', primaryMuscle: 'Chest', secondaryMuscles: ['Shoulders', 'Triceps'], equipment: ['Barbell', 'Bench'], instructions: 'Set bench to 30-45 degrees, grip bar wider than shoulders, lower to upper chest, press up.', imageURL: null, isCustom: false },
  { name: 'Decline Barbell Bench Press', category: 'strength', primaryMuscle: 'Chest', secondaryMuscles: ['Triceps'], equipment: ['Barbell', 'Bench'], instructions: 'Set bench to decline, grip bar wider than shoulders, lower to lower chest, press up.', imageURL: null, isCustom: false },
  { name: 'Dumbbell Bench Press', category: 'strength', primaryMuscle: 'Chest', secondaryMuscles: ['Triceps', 'Shoulders'], equipment: ['Dumbbell', 'Bench'], instructions: 'Lie on flat bench with dumbbells, press up and squeeze at top.', imageURL: null, isCustom: false },
  { name: 'Incline Dumbbell Press', category: 'strength', primaryMuscle: 'Chest', secondaryMuscles: ['Shoulders', 'Triceps'], equipment: ['Dumbbell', 'Bench'], instructions: 'Set bench to 30-45 degrees, press dumbbells up from shoulder level.', imageURL: null, isCustom: false },
  { name: 'Dumbbell Flyes', category: 'strength', primaryMuscle: 'Chest', secondaryMuscles: ['Shoulders'], equipment: ['Dumbbell', 'Bench'], instructions: 'Lie on bench, arms extended, lower dumbbells in arc motion, squeeze chest to return.', imageURL: null, isCustom: false },
  { name: 'Cable Crossover', category: 'strength', primaryMuscle: 'Chest', secondaryMuscles: ['Shoulders'], equipment: ['Cable'], instructions: 'Stand between cables set high, pull handles down and together in front of chest.', imageURL: null, isCustom: false },
  { name: 'Push-ups', category: 'bodyweight', primaryMuscle: 'Chest', secondaryMuscles: ['Triceps', 'Shoulders'], equipment: ['Bodyweight'], instructions: 'Hands slightly wider than shoulders, lower body until chest nearly touches floor, push back up.', imageURL: null, isCustom: false },
  { name: 'Chest Dips', category: 'bodyweight', primaryMuscle: 'Chest', secondaryMuscles: ['Triceps', 'Shoulders'], equipment: ['Bodyweight'], instructions: 'Lean forward on parallel bars, lower body by bending arms, push back up.', imageURL: null, isCustom: false },
  { name: 'Machine Chest Press', category: 'strength', primaryMuscle: 'Chest', secondaryMuscles: ['Triceps'], equipment: ['Machine'], instructions: 'Sit in machine, press handles forward, control on the way back.', imageURL: null, isCustom: false },
  { name: 'Pec Deck', category: 'strength', primaryMuscle: 'Chest', secondaryMuscles: [], equipment: ['Machine'], instructions: 'Sit in pec deck machine, bring arms together in front of chest.', imageURL: null, isCustom: false },

  // BACK
  { name: 'Barbell Deadlift', category: 'strength', primaryMuscle: 'Back', secondaryMuscles: ['Hamstrings', 'Glutes', 'Traps'], equipment: ['Barbell'], instructions: 'Stand over bar, grip shoulder width, drive through heels keeping back straight.', imageURL: null, isCustom: false },
  { name: 'Conventional Deadlift', category: 'strength', primaryMuscle: 'Back', secondaryMuscles: ['Hamstrings', 'Glutes', 'Traps', 'Forearms'], equipment: ['Barbell'], instructions: 'Feet hip-width, grip outside knees, hinge at hips, lift by extending hips and knees.', imageURL: null, isCustom: false },
  { name: 'Pull-ups', category: 'bodyweight', primaryMuscle: 'Lats', secondaryMuscles: ['Biceps', 'Back'], equipment: ['Pull-up Bar'], instructions: 'Hang from bar with overhand grip, pull up until chin clears bar.', imageURL: null, isCustom: false },
  { name: 'Chin-ups', category: 'bodyweight', primaryMuscle: 'Lats', secondaryMuscles: ['Biceps'], equipment: ['Pull-up Bar'], instructions: 'Hang from bar with underhand grip, pull up until chin clears bar.', imageURL: null, isCustom: false },
  { name: 'Barbell Row', category: 'strength', primaryMuscle: 'Back', secondaryMuscles: ['Biceps', 'Lats'], equipment: ['Barbell'], instructions: 'Bend at hips, grip bar overhand, pull to lower chest squeezing shoulder blades.', imageURL: null, isCustom: false },
  { name: 'Dumbbell Row', category: 'strength', primaryMuscle: 'Back', secondaryMuscles: ['Biceps', 'Lats'], equipment: ['Dumbbell', 'Bench'], instructions: 'One knee on bench, pull dumbbell to hip, squeeze at top.', imageURL: null, isCustom: false },
  { name: 'Lat Pulldown', category: 'strength', primaryMuscle: 'Lats', secondaryMuscles: ['Biceps', 'Back'], equipment: ['Cable'], instructions: 'Sit at lat pulldown, grip wide, pull bar to upper chest.', imageURL: null, isCustom: false },
  { name: 'Seated Cable Row', category: 'strength', primaryMuscle: 'Back', secondaryMuscles: ['Biceps', 'Lats'], equipment: ['Cable'], instructions: 'Sit upright, pull handle to torso, squeeze shoulder blades.', imageURL: null, isCustom: false },
  { name: 'T-Bar Row', category: 'strength', primaryMuscle: 'Back', secondaryMuscles: ['Biceps', 'Lats'], equipment: ['Barbell'], instructions: 'Straddle bar, grip handle, pull to chest keeping back flat.', imageURL: null, isCustom: false },
  { name: 'Face Pulls', category: 'strength', primaryMuscle: 'Back', secondaryMuscles: ['Shoulders', 'Traps'], equipment: ['Cable'], instructions: 'Set cable high, pull rope to face with elbows high, squeeze rear delts.', imageURL: null, isCustom: false },

  // SHOULDERS
  { name: 'Overhead Press', category: 'strength', primaryMuscle: 'Shoulders', secondaryMuscles: ['Triceps', 'Traps'], equipment: ['Barbell'], instructions: 'Stand with bar at shoulders, press overhead, lock out at top.', imageURL: null, isCustom: false },
  { name: 'Dumbbell Shoulder Press', category: 'strength', primaryMuscle: 'Shoulders', secondaryMuscles: ['Triceps'], equipment: ['Dumbbell'], instructions: 'Sit or stand, press dumbbells from shoulder level overhead.', imageURL: null, isCustom: false },
  { name: 'Lateral Raises', category: 'strength', primaryMuscle: 'Shoulders', secondaryMuscles: [], equipment: ['Dumbbell'], instructions: 'Stand with dumbbells at sides, raise arms to the sides until parallel to floor.', imageURL: null, isCustom: false },
  { name: 'Front Raises', category: 'strength', primaryMuscle: 'Shoulders', secondaryMuscles: [], equipment: ['Dumbbell'], instructions: 'Stand with dumbbells in front of thighs, raise one arm to shoulder height.', imageURL: null, isCustom: false },
  { name: 'Reverse Pec Deck', category: 'strength', primaryMuscle: 'Shoulders', secondaryMuscles: ['Back'], equipment: ['Machine'], instructions: 'Sit facing the machine, pull handles back squeezing rear delts.', imageURL: null, isCustom: false },
  { name: 'Arnold Press', category: 'strength', primaryMuscle: 'Shoulders', secondaryMuscles: ['Triceps'], equipment: ['Dumbbell'], instructions: 'Start with palms facing you, rotate and press overhead.', imageURL: null, isCustom: false },
  { name: 'Upright Row', category: 'strength', primaryMuscle: 'Shoulders', secondaryMuscles: ['Traps'], equipment: ['Barbell'], instructions: 'Hold bar with narrow grip, pull up along body to chin height.', imageURL: null, isCustom: false },
  { name: 'Cable Lateral Raise', category: 'strength', primaryMuscle: 'Shoulders', secondaryMuscles: [], equipment: ['Cable'], instructions: 'Stand sideways to cable, raise arm to side until parallel to floor.', imageURL: null, isCustom: false },

  // BICEPS
  { name: 'Barbell Curl', category: 'strength', primaryMuscle: 'Biceps', secondaryMuscles: ['Forearms'], equipment: ['Barbell'], instructions: 'Stand with bar at arms length, curl up keeping elbows at sides.', imageURL: null, isCustom: false },
  { name: 'Dumbbell Curl', category: 'strength', primaryMuscle: 'Biceps', secondaryMuscles: ['Forearms'], equipment: ['Dumbbell'], instructions: 'Stand with dumbbells, curl alternating or together, squeeze at top.', imageURL: null, isCustom: false },
  { name: 'Hammer Curl', category: 'strength', primaryMuscle: 'Biceps', secondaryMuscles: ['Forearms'], equipment: ['Dumbbell'], instructions: 'Hold dumbbells with neutral grip, curl up keeping palms facing each other.', imageURL: null, isCustom: false },
  { name: 'Preacher Curl', category: 'strength', primaryMuscle: 'Biceps', secondaryMuscles: [], equipment: ['EZ Bar', 'Bench'], instructions: 'Rest arms on preacher pad, curl bar up squeezing biceps.', imageURL: null, isCustom: false },
  { name: 'Incline Dumbbell Curl', category: 'strength', primaryMuscle: 'Biceps', secondaryMuscles: [], equipment: ['Dumbbell', 'Bench'], instructions: 'Sit on incline bench, let arms hang, curl dumbbells up.', imageURL: null, isCustom: false },
  { name: 'Cable Curl', category: 'strength', primaryMuscle: 'Biceps', secondaryMuscles: [], equipment: ['Cable'], instructions: 'Stand facing cable, curl handle up squeezing biceps at top.', imageURL: null, isCustom: false },
  { name: 'Concentration Curl', category: 'strength', primaryMuscle: 'Biceps', secondaryMuscles: [], equipment: ['Dumbbell'], instructions: 'Sit with elbow braced on inner thigh, curl dumbbell up.', imageURL: null, isCustom: false },

  // TRICEPS
  { name: 'Close-Grip Bench Press', category: 'strength', primaryMuscle: 'Triceps', secondaryMuscles: ['Chest'], equipment: ['Barbell', 'Bench'], instructions: 'Lie on bench, grip bar shoulder width, press up focusing on triceps.', imageURL: null, isCustom: false },
  { name: 'Tricep Pushdown', category: 'strength', primaryMuscle: 'Triceps', secondaryMuscles: [], equipment: ['Cable'], instructions: 'Stand at cable with rope or bar, push down extending elbows fully.', imageURL: null, isCustom: false },
  { name: 'Overhead Tricep Extension', category: 'strength', primaryMuscle: 'Triceps', secondaryMuscles: [], equipment: ['Dumbbell'], instructions: 'Hold dumbbell overhead with both hands, lower behind head, extend up.', imageURL: null, isCustom: false },
  { name: 'Skull Crushers', category: 'strength', primaryMuscle: 'Triceps', secondaryMuscles: [], equipment: ['EZ Bar', 'Bench'], instructions: 'Lie on bench, lower bar to forehead by bending elbows, extend up.', imageURL: null, isCustom: false },
  { name: 'Diamond Push-ups', category: 'bodyweight', primaryMuscle: 'Triceps', secondaryMuscles: ['Chest'], equipment: ['Bodyweight'], instructions: 'Hands close together forming diamond shape, perform push-up.', imageURL: null, isCustom: false },
  { name: 'Tricep Dips', category: 'bodyweight', primaryMuscle: 'Triceps', secondaryMuscles: ['Chest', 'Shoulders'], equipment: ['Bodyweight'], instructions: 'On parallel bars, keep body upright, lower and press up.', imageURL: null, isCustom: false },
  { name: 'Tricep Kickback', category: 'strength', primaryMuscle: 'Triceps', secondaryMuscles: [], equipment: ['Dumbbell'], instructions: 'Bend forward, extend arm behind you squeezing tricep at top.', imageURL: null, isCustom: false },

  // LEGS - QUADRICEPS
  { name: 'Barbell Squat', category: 'strength', primaryMuscle: 'Quadriceps', secondaryMuscles: ['Glutes', 'Hamstrings'], equipment: ['Barbell'], instructions: 'Bar on upper back, squat down until thighs parallel, stand up.', imageURL: null, isCustom: false },
  { name: 'Front Squat', category: 'strength', primaryMuscle: 'Quadriceps', secondaryMuscles: ['Glutes'], equipment: ['Barbell'], instructions: 'Bar racked on front delts, squat keeping torso upright.', imageURL: null, isCustom: false },
  { name: 'Leg Press', category: 'strength', primaryMuscle: 'Quadriceps', secondaryMuscles: ['Glutes', 'Hamstrings'], equipment: ['Machine'], instructions: 'Sit in leg press, feet shoulder width, press platform away.', imageURL: null, isCustom: false },
  { name: 'Leg Extension', category: 'strength', primaryMuscle: 'Quadriceps', secondaryMuscles: [], equipment: ['Machine'], instructions: 'Sit in machine, extend legs until straight, squeeze quads.', imageURL: null, isCustom: false },
  { name: 'Bulgarian Split Squat', category: 'strength', primaryMuscle: 'Quadriceps', secondaryMuscles: ['Glutes'], equipment: ['Dumbbell', 'Bench'], instructions: 'Rear foot on bench, lower into lunge, drive through front heel.', imageURL: null, isCustom: false },
  { name: 'Goblet Squat', category: 'strength', primaryMuscle: 'Quadriceps', secondaryMuscles: ['Glutes'], equipment: ['Dumbbell'], instructions: 'Hold dumbbell at chest, squat deep keeping chest up.', imageURL: null, isCustom: false },
  { name: 'Walking Lunges', category: 'strength', primaryMuscle: 'Quadriceps', secondaryMuscles: ['Glutes', 'Hamstrings'], equipment: ['Dumbbell'], instructions: 'Step forward into lunge, alternate legs walking forward.', imageURL: null, isCustom: false },
  { name: 'Hack Squat', category: 'strength', primaryMuscle: 'Quadriceps', secondaryMuscles: ['Glutes'], equipment: ['Machine'], instructions: 'Stand on hack squat platform, squat down and press up.', imageURL: null, isCustom: false },

  // LEGS - HAMSTRINGS
  { name: 'Romanian Deadlift', category: 'strength', primaryMuscle: 'Hamstrings', secondaryMuscles: ['Glutes', 'Lower Back'], equipment: ['Barbell'], instructions: 'Hold bar, hinge at hips keeping legs slightly bent, lower bar along legs.', imageURL: null, isCustom: false },
  { name: 'Leg Curl', category: 'strength', primaryMuscle: 'Hamstrings', secondaryMuscles: [], equipment: ['Machine'], instructions: 'Lie face down on machine, curl weight up by bending knees.', imageURL: null, isCustom: false },
  { name: 'Seated Leg Curl', category: 'strength', primaryMuscle: 'Hamstrings', secondaryMuscles: [], equipment: ['Machine'], instructions: 'Sit in machine, curl weight by bending knees under pad.', imageURL: null, isCustom: false },
  { name: 'Good Mornings', category: 'strength', primaryMuscle: 'Hamstrings', secondaryMuscles: ['Lower Back', 'Glutes'], equipment: ['Barbell'], instructions: 'Bar on upper back, hinge forward at hips keeping back straight.', imageURL: null, isCustom: false },
  { name: 'Stiff-Leg Deadlift', category: 'strength', primaryMuscle: 'Hamstrings', secondaryMuscles: ['Glutes', 'Lower Back'], equipment: ['Barbell'], instructions: 'Like RDL but with straighter legs, feel stretch in hamstrings.', imageURL: null, isCustom: false },

  // GLUTES
  { name: 'Hip Thrust', category: 'strength', primaryMuscle: 'Glutes', secondaryMuscles: ['Hamstrings'], equipment: ['Barbell', 'Bench'], instructions: 'Upper back on bench, bar on hips, drive hips up squeezing glutes.', imageURL: null, isCustom: false },
  { name: 'Glute Bridge', category: 'strength', primaryMuscle: 'Glutes', secondaryMuscles: ['Hamstrings'], equipment: ['Bodyweight'], instructions: 'Lie on back, feet flat, drive hips up squeezing glutes at top.', imageURL: null, isCustom: false },
  { name: 'Cable Kickback', category: 'strength', primaryMuscle: 'Glutes', secondaryMuscles: [], equipment: ['Cable'], instructions: 'Attach ankle strap, kick leg straight back squeezing glute.', imageURL: null, isCustom: false },
  { name: 'Sumo Deadlift', category: 'strength', primaryMuscle: 'Glutes', secondaryMuscles: ['Quadriceps', 'Hamstrings'], equipment: ['Barbell'], instructions: 'Wide stance, grip between legs, drive through hips to stand.', imageURL: null, isCustom: false },

  // CALVES
  { name: 'Standing Calf Raise', category: 'strength', primaryMuscle: 'Calves', secondaryMuscles: [], equipment: ['Machine'], instructions: 'Stand on calf raise machine, raise up on toes, lower slowly.', imageURL: null, isCustom: false },
  { name: 'Seated Calf Raise', category: 'strength', primaryMuscle: 'Calves', secondaryMuscles: [], equipment: ['Machine'], instructions: 'Sit with knees under pad, raise heels up, lower slowly.', imageURL: null, isCustom: false },

  // ABS
  { name: 'Crunches', category: 'bodyweight', primaryMuscle: 'Abs', secondaryMuscles: [], equipment: ['Bodyweight'], instructions: 'Lie on back, hands behind head, curl upper body up.', imageURL: null, isCustom: false },
  { name: 'Plank', category: 'bodyweight', primaryMuscle: 'Abs', secondaryMuscles: ['Shoulders'], equipment: ['Bodyweight'], instructions: 'Hold push-up position on forearms, keep body straight.', imageURL: null, isCustom: false },
  { name: 'Hanging Leg Raise', category: 'bodyweight', primaryMuscle: 'Abs', secondaryMuscles: ['Hip Flexors'], equipment: ['Pull-up Bar'], instructions: 'Hang from bar, raise legs until parallel to floor.', imageURL: null, isCustom: false },
  { name: 'Ab Wheel Rollout', category: 'bodyweight', primaryMuscle: 'Abs', secondaryMuscles: ['Shoulders'], equipment: ['None'], instructions: 'Kneel with ab wheel, roll forward extending body, pull back.', imageURL: null, isCustom: false },
  { name: 'Russian Twist', category: 'bodyweight', primaryMuscle: 'Obliques', secondaryMuscles: ['Abs'], equipment: ['Bodyweight'], instructions: 'Sit with feet off ground, twist torso side to side.', imageURL: null, isCustom: false },
  { name: 'Cable Woodchop', category: 'strength', primaryMuscle: 'Obliques', secondaryMuscles: ['Abs'], equipment: ['Cable'], instructions: 'Set cable high, pull diagonally across body rotating torso.', imageURL: null, isCustom: false },
  { name: 'Mountain Climbers', category: 'bodyweight', primaryMuscle: 'Abs', secondaryMuscles: ['Shoulders', 'Quadriceps'], equipment: ['Bodyweight'], instructions: 'Push-up position, drive knees to chest alternating quickly.', imageURL: null, isCustom: false },
  { name: 'Dead Bug', category: 'bodyweight', primaryMuscle: 'Abs', secondaryMuscles: [], equipment: ['Bodyweight'], instructions: 'Lie on back, extend opposite arm and leg while maintaining core stability.', imageURL: null, isCustom: false },

  // TRAPS
  { name: 'Barbell Shrug', category: 'strength', primaryMuscle: 'Traps', secondaryMuscles: [], equipment: ['Barbell'], instructions: 'Hold bar at waist, shrug shoulders up toward ears, hold, lower.', imageURL: null, isCustom: false },
  { name: 'Dumbbell Shrug', category: 'strength', primaryMuscle: 'Traps', secondaryMuscles: [], equipment: ['Dumbbell'], instructions: 'Hold dumbbells at sides, shrug up, squeeze at top.', imageURL: null, isCustom: false },
  { name: 'Farmers Walk', category: 'strength', primaryMuscle: 'Traps', secondaryMuscles: ['Forearms', 'Abs'], equipment: ['Dumbbell'], instructions: 'Hold heavy dumbbells at sides, walk with good posture.', imageURL: null, isCustom: false },

  // FOREARMS
  { name: 'Wrist Curl', category: 'strength', primaryMuscle: 'Forearms', secondaryMuscles: [], equipment: ['Barbell'], instructions: 'Sit with forearms on thighs, curl wrists up.', imageURL: null, isCustom: false },
  { name: 'Reverse Wrist Curl', category: 'strength', primaryMuscle: 'Forearms', secondaryMuscles: [], equipment: ['Barbell'], instructions: 'Sit with forearms on thighs palms down, extend wrists up.', imageURL: null, isCustom: false },

  // CARDIO
  { name: 'Treadmill Running', category: 'cardio', primaryMuscle: 'Cardio', secondaryMuscles: ['Quadriceps', 'Calves'], equipment: ['Cardio Machine'], instructions: 'Run at chosen pace and incline on treadmill.', imageURL: null, isCustom: false },
  { name: 'Cycling', category: 'cardio', primaryMuscle: 'Cardio', secondaryMuscles: ['Quadriceps'], equipment: ['Cardio Machine'], instructions: 'Cycle at chosen resistance and cadence.', imageURL: null, isCustom: false },
  { name: 'Rowing Machine', category: 'cardio', primaryMuscle: 'Cardio', secondaryMuscles: ['Back', 'Lats', 'Biceps'], equipment: ['Cardio Machine'], instructions: 'Drive with legs, pull with arms, control on return.', imageURL: null, isCustom: false },
  { name: 'Jump Rope', category: 'cardio', primaryMuscle: 'Cardio', secondaryMuscles: ['Calves'], equipment: ['None'], instructions: 'Jump rope at chosen pace, stay on balls of feet.', imageURL: null, isCustom: false },
  { name: 'Burpees', category: 'bodyweight', primaryMuscle: 'Full Body', secondaryMuscles: [], equipment: ['Bodyweight'], instructions: 'Squat, hands on floor, jump feet back, push-up, jump feet forward, jump up.', imageURL: null, isCustom: false },
  { name: 'Stair Climber', category: 'cardio', primaryMuscle: 'Cardio', secondaryMuscles: ['Quadriceps', 'Glutes'], equipment: ['Cardio Machine'], instructions: 'Step continuously on stair machine at chosen speed.', imageURL: null, isCustom: false },
  { name: 'Elliptical', category: 'cardio', primaryMuscle: 'Cardio', secondaryMuscles: ['Quadriceps'], equipment: ['Cardio Machine'], instructions: 'Stride on elliptical machine at chosen resistance.', imageURL: null, isCustom: false },
  { name: 'Battle Ropes', category: 'bodyweight', primaryMuscle: 'Full Body', secondaryMuscles: ['Shoulders', 'Abs'], equipment: ['None'], instructions: 'Create waves with heavy ropes using various movement patterns.', imageURL: null, isCustom: false },
  { name: 'Box Jumps', category: 'bodyweight', primaryMuscle: 'Quadriceps', secondaryMuscles: ['Glutes', 'Calves'], equipment: ['None'], instructions: 'Jump onto box, land softly with both feet, step down.', imageURL: null, isCustom: false },
  { name: 'Kettlebell Swing', category: 'strength', primaryMuscle: 'Full Body', secondaryMuscles: ['Glutes', 'Hamstrings', 'Shoulders'], equipment: ['Kettlebell'], instructions: 'Hinge at hips, swing kettlebell between legs and up to chest height.', imageURL: null, isCustom: false },

  // FLEXIBILITY
  { name: 'Standing Hamstring Stretch', category: 'flexibility', primaryMuscle: 'Hamstrings', secondaryMuscles: [], equipment: ['None'], instructions: 'Stand, extend one leg on raised surface, lean forward.', imageURL: null, isCustom: false },
  { name: 'Pigeon Stretch', category: 'flexibility', primaryMuscle: 'Glutes', secondaryMuscles: ['Hip Flexors'], equipment: ['None'], instructions: 'One leg forward bent, other leg extended behind, lean forward.', imageURL: null, isCustom: false },
  { name: 'Cat-Cow Stretch', category: 'flexibility', primaryMuscle: 'Back', secondaryMuscles: ['Abs'], equipment: ['None'], instructions: 'On hands and knees, alternate between arching and rounding back.', imageURL: null, isCustom: false },
  { name: 'Child Pose', category: 'flexibility', primaryMuscle: 'Back', secondaryMuscles: ['Shoulders'], equipment: ['None'], instructions: 'Kneel, sit back on heels, extend arms forward on floor.', imageURL: null, isCustom: false },
  { name: 'Quad Stretch', category: 'flexibility', primaryMuscle: 'Quadriceps', secondaryMuscles: [], equipment: ['None'], instructions: 'Stand on one leg, pull other foot to glute, hold.', imageURL: null, isCustom: false },
  { name: 'Shoulder Stretch', category: 'flexibility', primaryMuscle: 'Shoulders', secondaryMuscles: [], equipment: ['None'], instructions: 'Pull arm across body at chest height, hold with other arm.', imageURL: null, isCustom: false },
];
