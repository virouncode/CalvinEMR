import PdfViewerComponent from "./PdfViewerComponent";

const DocumentViewerComponent = () => {
  return (
    <div className="PDF-viewer">
      <PdfViewerComponent document={"document.pdf"} />
    </div>
  );
};

export default DocumentViewerComponent;
