function renderPrintPage(sourceElement, endCallback) {
  function getConvertedPdfFromHtml(doc, callback) {
    const opt = {
      margin: [5, 0, 8, 0],
      enableLinks: false,
      pagebreak: {
        avoid: ["tr", ".submodule-block", ".preface-page", ".first-page"],
        mode: ["css", "legacy"],
      },
      image: { type: "jpeg", quality: 1 },
      html2canvas: {
        allowTaint: true,
        dpi: 300,
        letterRendering: true,
        logging: false,
        scale: 2,
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
          pdf.setFontSize(8);
          pdf.text(
            `Page ${i} of ${totalPages}`,
            pdf.internal.pageSize.getWidth() - 10,
            pdf.internal.pageSize.getHeight() - 5
          );
        }

        callback(pdf);
      });
  }

  function addPdfToIframe(doc) {
    var iframe = document.createElement("iframe");
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

    console.log(doc);
    var blobPDF = new Blob([doc.output("blob")], { type: "application/pdf" });
    var blobUrl = URL.createObjectURL(blobPDF);
    iframe.src = blobUrl;

    document.body.appendChild(iframe);

    iframe.onload = function () {
      endCallback(iframe);
    };
  }

  var doc = new jspdf.jsPDF("p", "pt", "a4");

  getConvertedPdfFromHtml(doc, (pdf) => {
    addPdfToIframe(pdf);
  });
}

renderPrintPage(document.querySelector(".pdf_print_container"), () => {
  // stop loader here
});
