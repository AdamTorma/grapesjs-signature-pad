import loadComponents from "./components";
import loadBlocks from "./blocks";
import en from "./locale/en";
import de from "./locale/de";

export default (editor, opts = {}) => {
  const options = {
    ...{
      i18n: {},
      // default options
    },
    ...opts,
  };

  // Load i18n files
  editor.I18n &&
    editor.I18n.addMessages({
      en,
      de,
      ...options.i18n,
    });

  // Add components
  loadComponents(editor, options);
  // Add blocks
  loadBlocks(editor, options);
};
