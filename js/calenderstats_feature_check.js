// Check for the various File API support.
if (window.File && window.FileReader && window.FileList && window.Blob) {
  // do nothing - everything needed is supported
} else {
  alert('DE: Der Browser unterst\u00fctz nicht alle n\u00f6tigen Features. Versuchen Sie es mit einer aktullen Version von Chrome, Edge, Firefox, Safari, ... .\n\nEN: This browser does not support the features needed for the service. Please try again with a recent version of e.g. Chrome, Edge, Firefox, Safari, ... .');
}
