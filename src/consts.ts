export const kGamesFeatures = new Map<number, string[]>([
  // Cybeprunk 2077 runned in the launcher
  [
    216641,
    [

    ]
  ], // Cybeprunk 2077
  [
    21664,
    [

    ]
  ],
]);

export const kGameClassIds = Array.from(kGamesFeatures.keys());

export const kWindowNames = {
  inGame: 'in_game',
  glitch: 'glitch'
};

// TODO: take care about game resolution, use inGame info to calculate these positions
export const MATRIX_POSITION = { x: 200, y: 450, width: 920, height: 600 };
export const MATRIX_POSITION_5X5 = { x: 400, y: 450, width: 600, height: 420 };
export const TARGETS_POSITION = { x: 1160, y: 450, width: 530, height: 530 };
export const TARGETS_POSITION_5X5 = { x: 1110, y: 450, width: 530, height: 530 };
export const CURRENT_TOOL_TEXT_POSITION = { x: 250, y: 400, width: 720, height: 35 };

export const SUPPORTED_LANGUAGES = {
  cyber: 'cyber', // Matrix and targets symbols trained data in OCR service
  rus: 'rus' // Current tool name recognition, related to the game language
}
