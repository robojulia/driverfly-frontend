const type = document.currentScript.getAttribute('filterType');

var iframe = document.createElement("iframe");
let urlString = iframe.src = `${process.env.FRONTEND_BASE_URL ?? ""}/embedded?filterType=${type}`;
iframe.style = "width: 100%; height: 99vh; border: none;"
document.body.appendChild(iframe);





