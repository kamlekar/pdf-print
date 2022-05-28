var doc = new jspdf.jsPDF({
  compressPdf: false,
});
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
        height:100%; 
        width:650px; 
        padding:20px;
        z-index: 2;
      `
    );
    iframe.src = pdf.output("datauristring");
    document.body.appendChild(iframe);
  },
});
