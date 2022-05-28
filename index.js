function renderAndShowPDF(sourceElement, endCallback) {
  var globalStyles = {
    marginLeft: 10,
    marginRight: 10,
    marginTop: 10,
    marginBottom: 10,
    pageNumberFontSize: 8,
    scale: 2,
    dpi: 300,
  };

  function convertPdfFromHtml(doc, callback) {
    const opt = {
      margin: [
        globalStyles.marginTop,
        globalStyles.marginRight,
        globalStyles.marginBottom,
        globalStyles.marginLeft,
      ],
      enableLinks: true,
      pagebreak: {
        avoid: ["tr", ".submodule-block", ".preface-page", ".first-page"],
        mode: ["css", "legacy"],
      },
      image: { type: "jpeg", quality: 1 },
      html2canvas: {
        allowTaint: true,
        dpi: globalStyles.dpi,
        letterRendering: true,
        logging: false,
        scale: globalStyles.scale,
        scrollX: 0,
        scrollY: 0,
      },
      jsPDF: { doc },
    };

    return html2pdf()
      .from(sourceElement)
      .set(opt)
      .toPdf()
      .get("pdf")
      .then((pdf) => {
        const totalPages = pdf.internal.getNumberOfPages();

        for (let i = 1; i < totalPages + 1; i++) {
          pdf.setPage(i);
          pdf.setFontSize(globalStyles.pageNumberFontSize);
          pdf.text(
            `Page ${i} of ${totalPages}`,
            globalStyles.marginLeft,
            pdf.internal.pageSize.getHeight() - globalStyles.marginBottom / 2
          );
        }

        callback(pdf);
      });
  }

  function addPdfToIframe(doc) {
    var iframe = document.createElement("iframe");
    iframe.onload = function () {
      endCallback(iframe);
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

    var blobPDF = new Blob([doc.output("blob")], { type: "application/pdf" });
    var blobUrl = URL.createObjectURL(blobPDF);
    iframe.src = blobUrl;

    document.body.appendChild(iframe);
  }

  var doc = new jspdf.jsPDF("p", "pt", "a4");

  convertPdfFromHtml(doc, (pdf) => {
    addPdfToIframe(pdf);
  });
}

renderAndShowPDF(document.querySelector(".pdf_print_container"), () => {
  // stop loader here
});
