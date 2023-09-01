import { useEffect, useRef } from "react";
import useAuth from "../hooks/useAuth";

const PdfViewerComponent = (props) => {
  const containerRef = useRef(null);
  const { user } = useAuth();

  useEffect(() => {
    const container = containerRef.current; // This `useRef` instance will render the PDF.
    console.log(user.sign?.url);

    let PSPDFKit, instance;

    (async function () {
      PSPDFKit = await import("pspdfkit");

      PSPDFKit.unload(container); // Ensure that there's only one PSPDFKit instance.

      const instantJSON = {
        format: "https://pspdfkit.com/instant-json/v1",
        formFieldValues: [
          {
            v: 1,
            type: "pspdfkit/form-field-value",
            name: "full_name",
            value: "Karl Michael Jones",
          },
          {
            v: 1,
            type: "pspdfkit/form-field-value",
            name: "date_of_birth",
            value: "1990-02-27",
          },
          {
            v: 1,
            type: "pspdfkit/form-field-value",
            name: "address",
            value: "45 York Street MJ7-H7V Ontario Toronto Canada",
          },
          {
            v: 1,
            type: "pspdfkit/form-field-value",
            name: "health_insurance_nbr",
            value: "132456789",
          },
          {
            v: 1,
            type: "pspdfkit/form-field-value",
            name: "preferred_phone",
            value: "456-4567-324",
          },
        ],
      };

      instance = await PSPDFKit.load({
        // Container where PSPDFKit should be mounted.
        instantJSON: instantJSON,
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
