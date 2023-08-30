import { useEffect, useRef } from "react";

const PdfViewerComponent = (props) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current; // This `useRef` instance will render the PDF.

    let PSPDFKit, instance;

    (async function () {
      PSPDFKit = await import("pspdfkit");

      PSPDFKit.unload(container); // Ensure that there's only one PSPDFKit instance.

      // const instantJSON = {
      //   format: "https://pspdfkit.com/instant-json/v1",
      //   formFieldValues: [
      //     {
      //       v: 1,
      //       type: "pspdfkit/form-field-value",
      //       name: "insuredPSA",
      //       value: ["Yes"],
      //     },
      //   ],
      // };

      instance = await PSPDFKit.load({
        // Container where PSPDFKit should be mounted.
        // instantJSON: instantJSON,
        container,
        // The document to open.
        document: props.document,
        // Use the public directory URL as a base URL. PSPDFKit will download its library assets from here.
        baseUrl: `${window.location.protocol}//${window.location.host}/${process.env.PUBLIC_URL}`,
      });

      function listener() {
        const formFieldValues = instance.getFormFieldValues();
        console.log(formFieldValues);
      }

      instance.addEventListener("formFields.change", listener);
    })();

    return () => PSPDFKit && PSPDFKit.unload(container);
  }, [props.document]);

  // This div element will render the document to the DOM.
  return <div ref={containerRef} style={{ width: "100%", height: "100vh" }} />;
};

export default PdfViewerComponent;
