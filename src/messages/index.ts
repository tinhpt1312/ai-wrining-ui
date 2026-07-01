export { msg } from "./format";
export { commonMessages } from "./common";
export { appMessages } from "./app";
export { authMessages } from "./auth";
export { navMessages, routeLabels } from "./nav";
export { validationMessages } from "./validation";
export { writingMessages } from "./writing";
export { writingsMessages } from "./writings";
export { landingMessages } from "./landing";
export { dashboardMessages } from "./dashboard";
export { analysisMessages } from "./analysis";
export { revisionMessages } from "./revision";
export { suggestionsMessages } from "./suggestions";
export { suggestionLabelMessages } from "./suggestion-labels";
export { exploreMessages } from "./explore";
export { profileMessages } from "./profile";
export { shareMessages } from "./share";
export { exportMessages } from "./export";
export { booksMessages } from "./books";
export { componentMessages } from "./components";
export { errorMessages, getMessageForErrorCode } from "./errors";

import { commonMessages } from "./common";
import { appMessages } from "./app";
import { authMessages } from "./auth";
import { navMessages } from "./nav";
import { validationMessages } from "./validation";
import { writingMessages } from "./writing";
import { writingsMessages } from "./writings";
import { landingMessages } from "./landing";
import { dashboardMessages } from "./dashboard";
import { analysisMessages } from "./analysis";
import { revisionMessages } from "./revision";
import { suggestionsMessages } from "./suggestions";
import { suggestionLabelMessages } from "./suggestion-labels";
import { exploreMessages } from "./explore";
import { profileMessages } from "./profile";
import { shareMessages } from "./share";
import { booksMessages } from "./books";
import { exportMessages } from "./export";
import { componentMessages } from "./components";
import { errorMessages } from "./errors";

/** Root namespace for all UI copy (single locale for now). */
export const messages = {
  common: commonMessages,
  app: appMessages,
  auth: authMessages,
  nav: navMessages,
  validation: validationMessages,
  writing: writingMessages,
  writings: writingsMessages,
  landing: landingMessages,
  dashboard: dashboardMessages,
  analysis: analysisMessages,
  revision: revisionMessages,
  suggestions: suggestionsMessages,
  suggestionLabels: suggestionLabelMessages,
  explore: exploreMessages,
  profile: profileMessages,
  share: shareMessages,
  export: exportMessages,
  books: booksMessages,
  components: componentMessages,
  errors: errorMessages,
} as const;
