(function () {
  var doc = new jspdf.jsPDF("p", "pt", "a4");
  var sourceElement = document.querySelector(".pdf_print_container");
  doc.html(sourceElement, {
    callback: function (pdf) {
      console.log(pdf);
      // pdf.save("sample-file.pdf");
      var iframe = document.createElement("iframe");
      iframe.setAttribute(
        "style",
        `
        position:absolute;
        right:0; 
        top:0; 
        bottom:0; 
        size: A4;
        width: 100%;
        height: 100%;
        padding:20px;
        z-index: 2;
      `
      );
      var blobPDF = new Blob([pdf.output("blob")], { type: "application/pdf" });
      var blobUrl = URL.createObjectURL(blobPDF);
      iframe.src = blobUrl;

      document.body.appendChild(iframe);

      const opt = {
        margin: [5, 0, 8, 0],
        filename: `sample.pdf`,
        enableLinks: false,
        pagebreak: {
          avoid: ["tr", ".submodule-block"],
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

      var htmlPDF = html2pdf()
        .from(sourceElement)
        .set(opt)
        .toPdf()
        .get("pdf")
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
        })
        .save();

      console.log(htmlPDF);
    },
    html2canvas: {
      scale: 0.5,
      pageSplit: true,
    },
  });

  // const options = {
  //   margin: 0,
  //   file_name: file_name,
  //   image: { type: "jpeg", quality: 0.98 },
  //   html2canvas: { scale: 2 },
  //   jsPDF: { unit: "mm", format: "a4" },
  //   pagebreak: { before: ".submodule-block" },
  // };

  // html2pdf().set(options).from(sourceElement).save();
})();
