// Constants and constraint rules for cello fingering

export const PENALTY = {
  LOW: 1,
  MEDIUM: 50,
  HIGH: 100,  // Changed from 1000 to 100 to match v5 documentation
  NEVER: 100000,
  MAX: Infinity
};

export const OPEN_STRING_PITCHES = [57, 50, 43, 36]; // A3, D3, G2, C2

export const POSITION_COUNT = 40;
export const STRING_COUNT = 4;
export const FINGER_COUNT = 6;  // 0-5 (0=open, 1-4=fingers, 5=thumb)
export const THUMB_POSITION_THRESHOLD = 6;  // Thumb can be used at position ≥6
export const UPPER_BOUT_CUTOFF = 4;

// Hand stretch distances (including thumb)
// Finger indices: 0=open, 1=index, 2=middle, 3=ring, 4=pinky, 5=thumb
// CELLO RULE: Adjacent fingers are 2 semitones (whole tone) apart

export const MIN_DISTANCE_TO_UPPER_FINGER = [0, 2, 2, 2, 0, 0];
//                                          [0][1][2][3][4][5]
// [0]=0: Open string can be followed by any position
// [1]=2: From finger 1 to finger 2, minimum 2 semitones
// [2]=2: From finger 2 to finger 3, minimum 2 semitones
// [3]=2: From finger 3 to finger 4, minimum 2 semitones
// [4]=0: Finger 4 is the highest regular finger
// [5]=0: Thumb is the highest finger, no higher finger

export const MAX_DISTANCE_TO_UPPER_FINGER = [40, 4, 4, 4, 0, 7];
//                                          [0][1][2][3][4][5]
// [0]=40: From open string, can reach any position
// [1]=4: From finger 1 to finger 2, maximum 4 semitones (can skip to finger 3)
// [2]=4: From finger 2 to finger 3, maximum 4 semitones (can skip to finger 4)
// [3]=4: From finger 3 to finger 4, maximum 4 semitones
// [4]=0: Finger 4 is the highest regular finger
// [5]=7: Thumb can reach 7 semitones higher (thumb to 3rd finger forms octave)

export const MIN_DISTANCE_TO_LOWER_FINGER = [1, 0, -4, -4, -4, -7];
//                                          [0][1][2][3][4][5]
// [0]=1: Minimum 1 semitone from open string
// [1]=0: Finger 1 is the lowest regular finger
// [2]=-4: From finger 2 to finger 1, minimum -4 semitones (can skip back)
// [3]=-4: From finger 3 to finger 2, minimum -4 semitones (can skip back)
// [4]=-4: From finger 4 to finger 3, minimum -4 semitones (can skip back)
// [5]=-7: Thumb can reach 7 semitones lower (symmetric with MAX_DISTANCE_TO_UPPER_FINGER[5])

export const MAX_DISTANCE_TO_LOWER_FINGER = [40, 0, -2, -2, -2, 0];
//                                          [0][1][2][3][4][5]
// [0]=40: From open string, can reach any position
// [1]=0: Finger 1 is the lowest regular finger
// [2]=-2: From finger 2 to finger 1, maximum -2 semitones (adjacent fingers)
// [3]=-2: From finger 3 to finger 2, maximum -2 semitones (adjacent fingers)
// [4]=-2: From finger 4 to finger 3, maximum -2 semitones (adjacent fingers)
// [5]=0: Thumb is the lowest finger, no lower finger

// Training configuration
export const DEFAULT_CONFIG = {
  nEpisodes: 10000,
  learningRate: 0.99,
  discountFactor: 0.99,  // Higher for cello (stronger sequence dependency)
  explorationRate: 0.8,
  planningSteps: 10,
  priorityThreshold: 3.0,
  evaluationInterval: 300,
  convergenceThreshold: 0.01,
  convergenceWindow: 3
};

// Comfortable finger change ranges (including thumb)
// CELLO RULE: Adjacent fingers are 2 semitones apart
export function getMaxComfortableFingerChange(startFinger: number, endFinger: number): number {
  // Special case: starting from open string
  if (startFinger === 0) return 40;
  
  // Special case: ending on open string
  if (endFinger === 0) return 0;
  
  // Special case: thumb (finger 5) - highly flexible
  if (startFinger === 5 || endFinger === 5) {
    // Thumb can flexibly transition to/from other fingers
    return 40;
  }
  
  const diff = endFinger - startFinger;
  // Cello: adjacent fingers are 2 semitones apart
  // finger 1→2: 2 semitones, finger 1→3: 4 semitones, finger 1→4: 6 semitones
  const changes: { [key: number]: number } = {
    '-4': -6,  // finger 4 → finger 0 (down 4 fingers, -6 semitones)
    '-3': -6,  // finger 4 → finger 1 (down 3 fingers, -6 semitones)
    '-2': -4,  // finger 3 → finger 1 (down 2 fingers, -4 semitones)
    '-1': -2,  // finger 2 → finger 1 (down 1 finger, -2 semitones)
    '0': 0,    // same finger
    '1': 2,    // finger 1 → finger 2 (up 1 finger, 2 semitones)
    '2': 4,    // finger 1 → finger 3 (up 2 fingers, 4 semitones)
    '3': 6,    // finger 1 → finger 4 (up 3 fingers, 6 semitones)
    '4': 6     // finger 0 → finger 4 (up 4 fingers, 6 semitones)
  };
  
  return changes[diff] ?? -40;
}

export function getMinComfortableFingerChange(startFinger: number, endFinger: number): number {
  return -getMaxComfortableFingerChange(endFinger, startFinger);
}

// Calculate finger sequence penalty (v5.3 NEW - finger continuity)
export function calculateFingerSequencePenalty(
  prevFinger: number,
  currentFinger: number
): number {
  // 1. Encourage standard 1-3-4 sequence
  if ((prevFinger === 1 && currentFinger === 3) ||
      (prevFinger === 3 && currentFinger === 4) ||
      (prevFinger === 4 && currentFinger === 3) ||
      (prevFinger === 3 && currentFinger === 1)) {
    return -5;  // Reward standard sequence
  }
  
  // 2. Penalize skipping finger 1 and going directly to finger 3
  if (prevFinger === 0 && currentFinger === 3) {
    return 30;  // Strong penalty for skipping finger 1
  }
  
  // 3. Penalize skipping finger 1 and going directly to finger 4
  if (prevFinger === 0 && currentFinger === 4) {
    return 40;  // Even stronger penalty for skipping finger 1 and 3
  }
  
  // 4. Encourage going from open string to finger 1
  if (prevFinger === 0 && currentFinger === 1) {
    return -5;  // Reward standard start
  }
  
  // 5. Additional penalty for using finger 2
  if (currentFinger === 2) {
    return 10;  // Extra penalty to guide towards 1-3-4 pattern
  }
  
  return 0;
}

// Raw position score calculation (including thumb rules)
export function calculateRawPositionScore(position: number, string: number, finger: number): number {
  // Open string
  if (position === 0) {
    if (finger !== 0) return PENALTY.NEVER;
    return -50;  // STRONG REWARD for open strings - prioritize open strings
  }
  
  // Non-open position with finger 0
  if (finger === 0) return PENALTY.NEVER;
  
  // Finger 2 (middle finger) is rarely used in cello
  if (finger === 2) {
    return PENALTY.MEDIUM;  // 50 - discourage but allow when necessary
  }
  
  // Thumb usage rules (NEW)
  if (finger === 5) {
    // Thumb can only be used at position ≥6
    if (position < THUMB_POSITION_THRESHOLD) {
      return PENALTY.NEVER;  // Physically impossible in low positions
    }
    
    // Thumb should only be used when absolutely necessary
    // Heavy penalty to ensure open strings and lower positions are preferred
    if (position >= 12) {
      return PENALTY.MEDIUM;  // High positions (≥12): moderate penalty (50)
    } else {
      return PENALTY.HIGH;  // Mid positions (6-11): heavy penalty (100) - thumb is last choice
    }
  }
  
  // Fingers 1-4 in high positions penalty
  if (finger >= 1 && finger <= 4) {
    // If position ≥6 but not using thumb, give extra penalty
    if (position >= THUMB_POSITION_THRESHOLD) {
      return PENALTY.MEDIUM;  // Discourage regular fingers in high positions
    }
  }
  
  // Low positions (1-6) with fingers 1, 3, 4: preferred, give reward
  if ((finger === 1 || finger === 3 || finger === 4) && position >= 1 && position <= 6) {
    return -10;  // Reward for comfortable low positions with 1-3-4 fingers
  }
  
  // Calculate finger positions
  const maxHighFingerPosition = position + MAX_DISTANCE_TO_UPPER_FINGER[finger];
  const minHighFingerPosition = position + MIN_DISTANCE_TO_UPPER_FINGER[finger];
  const maxLowFingerPosition = position + MAX_DISTANCE_TO_LOWER_FINGER[finger];
  const minLowFingerPosition = position + MIN_DISTANCE_TO_LOWER_FINGER[finger];
  
  // Position too low
  if (maxHighFingerPosition < 6 || maxLowFingerPosition <= 0) {
    return PENALTY.MEDIUM;
  }
  
  // Position too high
  if (minHighFingerPosition > UPPER_BOUT_CUTOFF) {
    if (minLowFingerPosition >= UPPER_BOUT_CUTOFF) {
      // Whole hand over upper bout
      return 2 * PENALTY.MEDIUM + (minLowFingerPosition - UPPER_BOUT_CUTOFF);
    } else {
      // Hand partially over upper bout
      return (3 * PENALTY.MEDIUM) / 2 + (minHighFingerPosition - UPPER_BOUT_CUTOFF);
    }
  }
  
  return 0;
}

// String cross penalty
export function calculateStringCrossPenalty(stringDiff: number): number {
  const absDiff = Math.abs(stringDiff);
  return absDiff > 0 ? 3 * PENALTY.LOW * absDiff : 0;  // Set to 3 for balanced string distribution
}

// Finger change penalty
export function calculateFingerChangePenalty(
  startPos: number,
  endPos: number,
  startFinger: number,
  endFinger: number
): number {
  const maxComfortableChange = getMaxComfortableFingerChange(startFinger, endFinger);
  const minComfortableChange = getMinComfortableFingerChange(startFinger, endFinger);
  const actualChange = endPos - startPos;
  
  if (actualChange < minComfortableChange) {
    return calculateShiftPenalty(actualChange - minComfortableChange);
  }
  if (actualChange > maxComfortableChange) {
    return calculateShiftPenalty(actualChange - maxComfortableChange);
  }
  return 0;
}

// Shift penalty
export function calculateShiftPenalty(shiftAmount: number): number {
  const absShift = Math.abs(shiftAmount);
  return PENALTY.MEDIUM + PENALTY.LOW * absShift * 1.2;  // Coefficient 1.2 for cello
}

// Calculate total penalty for a transition
export function calculateTotalPenalty(
  prevState: { position: number; finger: number; string: number },
  action: { position: number; finger: number; string: number }
): number {
  let penalty = 0;
  
  // Raw position penalty
  penalty += calculateRawPositionScore(action.position, action.string, action.finger);
  
  // String cross penalty
  penalty += calculateStringCrossPenalty(action.string - prevState.string);
  
  // Finger change penalty
  penalty += calculateFingerChangePenalty(
    prevState.position,
    action.position,
    prevState.finger,
    action.finger
  );
  
  // Finger sequence penalty (v5.3 NEW - finger continuity)
  penalty += calculateFingerSequencePenalty(prevState.finger, action.finger);
  
  return penalty;
}
