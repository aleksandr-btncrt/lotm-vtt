import { ApplicationV2Mixin } from "./application-v2-mixin.mjs";
const { ApplicationV2 } = foundry.applications.api;

/**
 * Base application from which all system applications should be based.
 */
export class ApplicationLOTM extends ApplicationV2Mixin(ApplicationV2) { }