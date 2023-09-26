
  // This file was automatically generated. Edits will be overwritten

  export interface Typegen0 {
        '@@xstate/typegen': true;
        internalEvents: {
          "": { type: "" };
"done.invoke.(machine).chips.adding:invocation[0]": { type: "done.invoke.(machine).chips.adding:invocation[0]"; data: unknown; __tip: "See the XState TS docs to learn how to strongly type this." };
"done.invoke.(machine).menu.adding:invocation[0]": { type: "done.invoke.(machine).menu.adding:invocation[0]"; data: unknown; __tip: "See the XState TS docs to learn how to strongly type this." };
"done.invoke.(machine).search.searching:invocation[0]": { type: "done.invoke.(machine).search.searching:invocation[0]"; data: unknown; __tip: "See the XState TS docs to learn how to strongly type this." };
"xstate.init": { type: "xstate.init" };
        };
        invokeSrcNameMap: {
          "addNewPerson": "done.invoke.(machine).chips.adding:invocation[0]" | "done.invoke.(machine).menu.adding:invocation[0]";
"search": "done.invoke.(machine).search.searching:invocation[0]";
        };
        missingImplementations: {
          actions: never;
          delays: never;
          guards: never;
          services: never;
        };
        eventsCausingActions: {
          "addFromMenu": "KEY_PRESS";
"addNewPerson": "done.invoke.(machine).chips.adding:invocation[0]" | "done.invoke.(machine).menu.adding:invocation[0]";
"addPerson": "ADD";
"addTemporaryPerson": "ADD" | "KEY_PRESS";
"blurInput": "KEY_PRESS";
"cancelSearch": "SEARCH";
"clearInput": "ADD" | "KEY_PRESS" | "RESET";
"deletePerson": "DELETE";
"deleteSelectedPerson": "KEY_PRESS";
"focusInput": "ADD" | "DELETE" | "KEY_PRESS" | "RESET";
"moveLeft": "KEY_PRESS";
"moveRight": "KEY_PRESS";
"resetValue": "RESET";
"selectLastPerson": "KEY_PRESS";
"setCurrentSearch": "SEARCH";
"setMenuIndex": "SET_MENU_INDEX";
"setResults": "done.invoke.(machine).search.searching:invocation[0]";
"updateCurrentSearch": "";
        };
        eventsCausingDelays: {

        };
        eventsCausingGuards: {
          "hasPendingSearch": "";
"isAddingNewPerson": "KEY_PRESS";
"isBackspace": "KEY_PRESS";
"isDelete": "KEY_PRESS";
"isEnter": "KEY_PRESS";
"isLeftArrow": "KEY_PRESS";
"isLongEnough": "SEARCH";
"isNewPerson": "ADD";
"isNotLongEnough": "SEARCH";
"isRightArrow": "KEY_PRESS";
        };
        eventsCausingServices: {
          "addNewPerson": "ADD" | "KEY_PRESS";
"search": "" | "SEARCH";
        };
        matchesStates: "chips" | "chips.adding" | "chips.idle" | "menu" | "menu.adding" | "menu.collapsed" | "menu.expanded" | "search" | "search.idle" | "search.searching" | { "chips"?: "adding" | "idle";
"menu"?: "adding" | "collapsed" | "expanded";
"search"?: "idle" | "searching"; };
        tags: never;
      }
