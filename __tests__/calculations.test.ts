import {
  calculateBMR,
  calculateTDEE,
  calculateTargetCalories,
  calculateMacros,
  calculateAge,
  calculate1RM,
  calculateBMI,
} from '@/src/lib/utils/calculations';

describe('calculateBMR (Mifflin-St Jeor)', () => {
  it('returns correct value for male adult', () => {
    // 80kg, 180cm, 30y, male → 10*80 + 6.25*180 - 5*30 + 5 = 1780
    expect(calculateBMR(80, 180, 30, 'male')).toBe(1780);
  });

  it('returns correct value for female adult', () => {
    // 60kg, 165cm, 25y, female → 10*60 + 6.25*165 - 5*25 - 161 = 1345.25
    expect(calculateBMR(60, 165, 25, 'female')).toBeCloseTo(1345.25, 2);
  });

  it('male formula adds +5 vs gender-neutral baseline', () => {
    const male = calculateBMR(70, 170, 30, 'male');
    const female = calculateBMR(70, 170, 30, 'female');
    expect(male - female).toBe(166); // +5 - (-161) = 166
  });

  it('treats unknown gender as male (defensive default)', () => {
    expect(calculateBMR(80, 180, 30, 'unknown')).toBe(calculateBMR(80, 180, 30, 'male'));
  });
});

describe('calculateTDEE', () => {
  it('multiplies BMR by sedentary 1.2', () => {
    expect(calculateTDEE(1700, 'sedentary')).toBe(2040);
  });
  it('multiplies BMR by very_active 1.9', () => {
    expect(calculateTDEE(1700, 'very_active')).toBe(3230);
  });
  it('rounds the result', () => {
    expect(calculateTDEE(1733, 'moderate')).toBe(Math.round(1733 * 1.55));
  });
});

describe('calculateTargetCalories', () => {
  it('subtracts 500 for lose_weight', () => {
    expect(calculateTargetCalories(2500, 'lose_weight')).toBe(2000);
  });
  it('adds 300 for build_muscle', () => {
    expect(calculateTargetCalories(2500, 'build_muscle')).toBe(2800);
  });
  it('returns tdee unchanged for maintain', () => {
    expect(calculateTargetCalories(2500, 'maintain')).toBe(2500);
  });
});

describe('calculateMacros', () => {
  it('splits build_muscle as 30/45/25 (P/C/F)', () => {
    const m = calculateMacros(3000, 'build_muscle');
    // protein: 3000*0.3/4 = 225, carbs: 3000*0.45/4 = 337.5 → 338, fat: 3000*0.25/9 = 83.33 → 83
    expect(m.protein).toBe(225);
    expect(m.carbs).toBe(338);
    expect(m.fat).toBe(83);
  });

  it('totals approximate the input calories', () => {
    const cals = 2000;
    const m = calculateMacros(cals, 'lose_weight');
    const totalCals = m.protein * 4 + m.carbs * 4 + m.fat * 9;
    expect(Math.abs(totalCals - cals)).toBeLessThanOrEqual(5); // rounding tolerance
  });
});

describe('calculateAge', () => {
  it('returns the right age for a date in the past', () => {
    const today = new Date();
    const fortyYearsAgo = `${today.getFullYear() - 40}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    expect(calculateAge(fortyYearsAgo)).toBe(40);
  });

  it('subtracts one year if birthday has not occurred this year', () => {
    const today = new Date();
    const futureMonth = today.getMonth() + 2; // 2 months from now
    if (futureMonth > 11) return; // skip in November/December
    const birthDate = `${today.getFullYear() - 30}-${String(futureMonth + 1).padStart(2, '0')}-15`;
    expect(calculateAge(birthDate)).toBe(29);
  });
});

describe('calculate1RM (Epley)', () => {
  it('returns the lifted weight for 1 rep', () => {
    expect(calculate1RM(100, 1)).toBe(100);
  });

  it('estimates 1RM for 5 reps', () => {
    // 80 * (1 + 5/30) = 80 * 1.1667 ≈ 93.33 → 93
    expect(calculate1RM(80, 5)).toBe(93);
  });

  it('1RM strictly increases with reps for same weight', () => {
    expect(calculate1RM(60, 8)).toBeGreaterThan(calculate1RM(60, 1));
  });
});

describe('calculateBMI', () => {
  it('returns 22.0 for 80kg / 190cm (rounded to one decimal)', () => {
    // 80 / (1.9*1.9) = 22.16 → 22.2
    expect(calculateBMI(80, 190)).toBeCloseTo(22.2, 1);
  });
  it('returns one-decimal precision', () => {
    const v = calculateBMI(72, 178);
    expect(Number(v.toFixed(1))).toBe(v);
  });
});
