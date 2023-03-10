export default (editor, opts = {}) => {
  const domc = editor.DomComponents;

  // Same options of the library
  // https://github.com/szimek/signature_pad
  const signaturePadProps = {
    dotSize: "default",
    minWidth: 0.5,
    maxWidth: 2.5,
    throttle: 16,
    minDistance: 5,
    backgroundColor: "rgba(0,0,0,0)",
    penColor: "black",
    velocityFilterWeight: 0.7,
  };

  const idTrait = {
    name: "id",
  };

  const penColorTrait = {
    name: "penColor",
    label: "Pen color",
    type: "color",
    changeProp: true,
  };

  const backgroundColorTrait = {
    name: "backgroundColor",
    label: "Background color",
    type: "color",
    changeProp: true,
  };

  const script = function (props) {
    const init = () => {
      function openSignaturePadModal(_this) {
        const dialog = document.createElement("dialog");
        dialog.id = "sp-modal";

        const dialogHeader = document.createElement("div");
        dialogHeader.innerHTML += `<span class="sp-modal-title">Please sign</span>`;
        dialogHeader.classList.add("dialog-header");
        dialog.appendChild(dialogHeader);

        const closeButton = document.createElement("button");
        closeButton.id = "sp-modal-close";
        closeButton.classList.add("modal-btn");
        closeButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14">
      <path fill-rule="evenodd" clip-rule="evenodd" d="M13.7071 1.70711C14.0976 1.31658 14.0976 0.683417 13.7071 0.292893C13.3166 -0.0976311 12.6834 -0.0976311 12.2929 0.292893L7 5.58579L1.70711 0.292893C1.31658 -0.0976311 0.683417 -0.0976311 0.292893 0.292893C-0.0976311 0.683417 -0.0976311 1.31658 0.292893 1.70711L5.58579 7L0.292893 12.2929C-0.0976311 12.6834 -0.0976311 13.3166 0.292893 13.7071C0.683417 14.0976 1.31658 14.0976 1.70711 13.7071L7 8.41421L12.2929 13.7071C12.6834 14.0976 13.3166 14.0976 13.7071 13.7071C14.0976 13.3166 14.0976 12.6834 13.7071 12.2929L8.41421 7L13.7071 1.70711Z" />
    </svg>`;
        dialogHeader.appendChild(closeButton);
        7;
        const canvas = document.createElement("canvas");
        canvas.id = "sp-canvas";
        dialog.appendChild(canvas);

        const dialogFooter = document.createElement("div");
        dialogFooter.classList.add("dialog-footer");
        dialogFooter.innerHTML += `<span class="sp-helptext">Sign above</span>`;
        dialog.appendChild(dialogFooter);

        const buttonContainer = document.createElement("div");
        buttonContainer.classList.add("btn-container");
        dialogFooter.appendChild(buttonContainer);

        const clearButton = document.createElement("button");
        clearButton.id = "sp-modal-clear";
        clearButton.classList.add("modal-btn");
        clearButton.innerHTML = "clear";
        buttonContainer.appendChild(clearButton);

        const saveButton = document.createElement("button");
        saveButton.id = "sp-modal-save";
        saveButton.classList.add("modal-btn");
        saveButton.innerHTML = "save";
        saveButton.autofocus = true;
        buttonContainer.appendChild(saveButton);

        const signaturePad = new SignaturePad(canvas, {
          penColor: props.penColor,
          backgroundColor: props.backgroundColor,
        });

        let signatureImage = _this.querySelector("img");
        if (signatureImage?.dataset.signature) {
          signaturePad.fromData(JSON.parse(signatureImage.dataset.signature));
        }

        // Adjust canvas coordinate space taking into account pixel ratio,
        // to make it look crisp on mobile devices.
        // This also causes canvas to be cleared.
        const resizeCanvas = () => {
          // When zoomed out to less than 100%, for some very strange reason,
          // some browsers report devicePixelRatio as less than 1
          // and only part of the canvas is cleared then.
          const ratio = Math.max(window.devicePixelRatio || 1, 1);

          // This part causes the canvas to be cleared
          canvas.width = canvas.offsetWidth * ratio;
          canvas.height = canvas.offsetHeight * ratio;
          canvas.getContext("2d").scale(ratio, ratio);

          // This library does not listen for canvas changes, so after the canvas is automatically
          // cleared by the browser, SignaturePad#isEmpty might still return false, even though the
          // canvas looks empty, because the internal data of this library wasn't cleared. To make sure
          // that the state of this library is consistent with visual state of the canvas, you
          // have to clear it manually.
          // signaturePad.clear();

          // If you want to keep the drawing on resize instead of clearing it you can reset the data.
          signaturePad.fromData(signaturePad.toData());
        };

        signaturePad.on();

        // On mobile devices it might make more sense to listen to orientation change,
        // rather than window resize events.
        window.onresize = resizeCanvas;

        closeButton.addEventListener("click", () => {
          dialog.close();
          dialog.remove();
        });

        clearButton.addEventListener("click", () => {
          signaturePad.clear();
        });

        saveButton.addEventListener("click", () => {
          // Check if img already exists
          if (!signatureImage) {
            signatureImage = document.createElement("img");
            _this.appendChild(signatureImage);
          }

          if (!signaturePad.isEmpty()) {
            signatureImage.src = signaturePad.toDataURL();
            signatureImage.dataset.signature = JSON.stringify(
              signaturePad.toData()
            );
          } else {
            signatureImage.remove();
          }

          dialog.close();
          dialog.remove();
        });

        document.body.append(dialog);

        dialog.showModal();
        resizeCanvas();
      }

      // `this` is bound to the component element
      this.addEventListener("click", function handleClick(event) {
        openSignaturePadModal(this);
      });
    };

    if (!window.SignaturePad) {
      const script = document.createElement("script");
      script.onload = init;
      script.src =
        "https://cdn.jsdelivr.net/npm/signature_pad@4.1.5/dist/signature_pad.umd.min.js";
      document.body.appendChild(script);

      const style = document.createElement("style");

      const styles = `
      #sp-modal {
        padding: 1rem;
        border: none;
        border-radius: 8px;
        width: 50%;
        min-width: 20rem;
        max-width: 40rem;
        -webkit-box-shadow: 5px 5px 15px 5px rgba(0,0,0,0.35); 
        box-shadow: 5px 5px 15px 5px rgba(0,0,0,0.35);
        font-family: "Verdana", sans-serif;
      }
      #sp-modal::backdrop {
        background: rgba(0, 0, 0, 0.35);
        backdrop-filter: blur(2px);
      }
      .dialog-header {
        display: flex;
        border-bottom: 1px solid #fafafa;
        margin-botton: 1rem;
        padding-bottom: 0.5rem;
      }
      .sp-modal-title {
        flex-grow: 1;
        display: inline-block;
        align-self: center;
        text-transform: uppercase;
      }
      .btn-container {
        display: flex;
        gap: 1rem;
        margin-top: 1rem;
      }
      .btn-container > button {
        flex-grow: 1;
      }
      .sp-helptext {
        font-size: 0.75rem;
        display: block;
        color: #777;
        text-align: center;
      }
      #sp-canvas {
        width: 100%;
        height: 100%;
        margin-top: 1rem;
        margin-bottom: 1rem;
        border: 1px solid black;
        aspect-ratio: 3 / 1;
      }
      .signature-pad {
        position: relative;
        display: flex;
      }
      .signature-pad > img {
        position: absolute;
        top: 0;
        left: 0;
        background: #fff;
        width: 100%;
        height: 100%;
      }
      .modal-btn {
        outline: none;
        border: none;
        border-radius: 0.25rem;
        padding: 0.5rem;
        cursor: pointer;
        text-transform: uppercase;
      }
      #sp-modal-close {
        background: rgba(0,0,0,0);
      }
      #sp-modal-close > svg {
        fill: #333;
        transition: transform 0.3s ease-in;
      }
      #sp-modal-close:hover > svg {
        transform: rotate(90deg);
      }
      #sp-modal-save:hover,
      #sp-modal-clear:hover {
        background-color: #555;
        color: white;
      }
      #sp-modal-save {
        background: #333;
        color: white;
      }
      #sp-modal-clear {
        background: #ddd;
        color: #333;
      }
      .sp-placeholder {
        display: block;
        width: 100%;
        color: #999;
        text-shadow: 2px 2px rgba(255,255,255,1);
        padding: 0.5rem;
        text-align: center;
        align-self: center;
      }`;

      style.innerText = styles;
      document.head.appendChild(style);
    } else {
      init();
    }
  };

  domc.addType("signature-pad", {
    model: {
      defaults: {
        tagName: "div",
        name: editor.I18n.t("grapesjs-signature-pad.name"),
        droppable: false,
        resizable: true,
        traits: [idTrait, penColorTrait, backgroundColorTrait],
        style: {
          width: "15rem",
          height: "5rem",
          background: "#f0f0f0",
          border: "1px dashed #cacaca",
          cursor: "pointer",
        },
        unstylable: [
          "width",
          "height",
          "max-width",
          "max-height",
          "min-height",
          "padding",
        ],
        content: `<span class="sp-placeholder">${editor.I18n.t(
          "grapesjs-signature-pad.call-to-action"
        )}</span>`,
        script,
        // Define default values for your custom properties
        penColor: "black",
        backgroundColor: null,
        // Define which properties to pass (this will also reset your script on their changes)
        "script-props": ["penColor", "backgroundColor"],
      },
    },
    view: {},
  });
};
