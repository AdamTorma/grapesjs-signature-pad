export default (editor, opts = {}) => {
  const bm = editor.BlockManager;

  bm.add("SIGNATURE-PAD", {
    label: editor.I18n.t("grapesjs-signature-pad.name"),
    content: `<div data-gjs-type="signature-pad" data-gjs-editable="false" class="signature-pad"></div>`,
    attributes: { class: "fa fa-pencil-square-o" },
    select: true,
    category: "Extra",
  });
};
