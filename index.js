(async () => {
  const pdfDocumentObject = new jspdf.jsPDF("p", "pt", "a4");

  const printStyleSettings = {
    marginLeft: 10,
    marginRight: 10,
    marginTop: 10,
    marginBottom: 10,
    pageNumberFontSize: 8,
    scale: 2,
    dpi: 300,
  };

  const printFormatOptions = {
    margin: [
      printStyleSettings.marginTop,
      printStyleSettings.marginRight,
      printStyleSettings.marginBottom,
      printStyleSettings.marginLeft,
    ],
    enableLinks: true,
    pagebreak: {
      avoid: ["tr", ".submodule-block", ".preface-page", ".first-page"],
      mode: ["css", "legacy"],
    },
    image: { type: "jpeg", quality: 1 },
    html2canvas: {
      allowTaint: true,
      dpi: printStyleSettings.dpi,
      letterRendering: true,
      logging: false,
      scale: printStyleSettings.scale,
      scrollX: 0,
      scrollY: 0,
    },
    jsPDF: { doc: pdfDocumentObject },
  };

  async function getPrintReadyDocumentObjectFromHtmlElement(htmlElement) {
    return html2pdf()
      .from(htmlElement)
      .set(printFormatOptions)
      .toPdf()
      .get("pdf")
      .catch((err) => {
        console.error(err);
      });
  }

  function addPageNumberToEachPage(printReadyDocumentObject) {
    const totalPages = printReadyDocumentObject.internal.getNumberOfPages();
    const pageHeight = printReadyDocumentObject.internal.pageSize.getHeight();
    const pageNumberPlacementX = printStyleSettings.marginLeft;
    const pageNumberPlacementY =
      pageHeight - printStyleSettings.marginBottom / 2;

    for (let pageNumber = 1; pageNumber < totalPages + 1; pageNumber++) {
      printReadyDocumentObject.setPage(pageNumber);
      printReadyDocumentObject.setFontSize(
        printStyleSettings.pageNumberFontSize
      );
      printReadyDocumentObject.text(
        `Page ${pageNumber} of ${totalPages}`,
        pageNumberPlacementX,
        pageNumberPlacementY
      );
    }
  }

  async function showPrintReadyPageInIframe(printReadyDocumentObject) {
    return new Promise((resolve) => {
      var iframe = document.createElement("iframe");
      iframe.onload = function () {
        resolve(iframe);
      };
      iframe.setAttribute(
        "style",
        `
        position:fixed;
        right:0; 
        top:0; 
        bottom:0; 
        left: 0;
        z-index: 2000;
        width: 100%;
        height: 100%;
      `
      );

      var blobPDF = new Blob([printReadyDocumentObject.output("blob")], {
        type: "application/pdf",
      });
      var blobUrl = URL.createObjectURL(blobPDF);
      iframe.src = blobUrl;

      document.body.appendChild(iframe);
    });
  }

  const htmlContainer = document.querySelector(".pdf_print_container");
  const printReadyDocumentObject =
    await getPrintReadyDocumentObjectFromHtmlElement(htmlContainer);
  addPageNumberToEachPage(printReadyDocumentObject);
  await showPrintReadyPageInIframe(printReadyDocumentObject);
  // hide loader and stuff
})();
