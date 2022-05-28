var doc = new jspdf.jsPDF("p", "pt", "a4");
doc.html(document.querySelector(".pdf_print_container"), {
  callback: function (pdf) {
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
  },
  html2canvas: {
    scale: 0.5,
  },
});
