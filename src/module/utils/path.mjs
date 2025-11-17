import { systemID } from "./constants.mjs";

/**
 * 
 * @param {string} path 
 * @returns 
 */
export const systemPath = (path) => `systems/${systemID}/${path}`;