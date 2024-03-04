const type = document.currentScript.getAttribute('filterType');
const companyId = document.currentScript.getAttribute('companyId');
var iframe = document.createElement('iframe');
let urlString = iframe.src = `https://app.driverfly.co/embedded?filterType=${type}&companyId=${companyId}`;
iframe.style = 'width: 100%; height: 99vh; border: none;'
document.body.appendChild(iframe);