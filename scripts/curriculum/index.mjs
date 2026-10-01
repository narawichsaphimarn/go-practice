import { beginner } from "./beginner.mjs";
import { advanced } from "./advanced.mjs";
import { advancedRest } from "./advanced-rest.mjs";
import { professional } from "./professional.mjs";
import { expert } from "./expert.mjs";

export const lessons = [...beginner, ...advanced, ...advancedRest, ...professional, ...expert];
