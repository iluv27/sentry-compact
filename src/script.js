var upload = document.querySelector(".upload");
var download = document.querySelector(".download");
var hiddenButton = document.querySelector("#hidden-button");
var input = document.querySelector("#slider-input");
var inputValue = document.querySelector(".input-value");
var inputMetedata = document.getElementsByClassName("metadata")[0];
var outputMetedata = document.getElementsByClassName("metadata")[1];
const gprdCookies = document.getElementById("cookies");
const cookiePolicyAccept = document.getElementById("accept");
const cookiePolicyClose = document.getElementById("close");

document.addEventListener('DOMContentLoaded', function () {
  // Disable scrolling when the cookie banner is visible
  document.body.classList.add('no-scroll');

  // When the "Accept" button is clicked
  document.getElementById('accept').addEventListener('click', function () {
    // Enable scrolling
    document.body.classList.remove('no-scroll');
    // Hide the cookie banner
    document.getElementById('cookies').style.display = 'none';
  });

  // When the "Close" button is clicked
  document.getElementById('close').addEventListener('click', function () {
    // Enable scrolling
    document.body.classList.remove('no-scroll');
    // Hide the cookie banner
    document.getElementById('cookies').style.display = 'none';
  });
});


window.onload = function () {
  setTimeout(function () {
    gprdCookies.style.display = "block";
  }, 2000);
};
// =================================
// New Codes
// =================================
// Add event listeners to handle drag-and-drop events
document.addEventListener("dragover", function (event) {
  event.preventDefault();
  //document.getElementById("drop-area").classList.add("dragover");
});

document.addEventListener("drop", function (event) {
  event.preventDefault();
  var files = event.dataTransfer.files;
  hiddenButton.files = files;
});

// Add event listener for file input change
hiddenButton.addEventListener("change", function () {
  var file = hiddenButton.files[0];
  // do something with the file
});

document.addEventListener("dragleave", function (event) {
  event.preventDefault();
  // document.getElementById("drop-area").classList.remove("dragover");
});
// =================================
// New Codes
// =================================

input.oninput = function () {
  var c = document.getElementsByClassName("top")[0];
  c.style.width = (600 / 100) * input.value + "px";
};

upload.onclick = function () {
  // click on input type file
  hiddenButton.click();
  console.log("Working");
};

cookiePolicyAccept.onclick = function () {
  gprdCookies.style.display = "none";
};

cookiePolicyClose.onclick = function () {
  gprdCookies.style.display = "none";
};

hiddenButton.onchange = () => {
  // get selected file
  var file = hiddenButton.files[0];
  var url = URL.createObjectURL(file);
  var img = document.createElement("img");
  // load image to get width height
  img.src = url;
  img.onload = function () {
    var w = img.width;
    var h = img.height;
    // give metedata of input file
    inputMetedata
      .getElementsByTagName("li")[0]
      .getElementsByTagName("strong")[0].innerHTML = file.name;
    inputMetedata
      .getElementsByTagName("li")[1]
      .getElementsByTagName("strong")[0].innerHTML = w + "/" + h;
    inputMetedata
      .getElementsByTagName("li")[2]
      .getElementsByTagName("strong")[0].innerHTML =
      (file.size / 1024 / 1024).toFixed(2) + "Mb";
    // set attribute for file name used in downloading
    upload.setAttribute("filename", file.name);
    // create a function to get ratio of width height
    calculateValues(inputValue.value, w, h);
    inputValue.onchange = function () {
      // run function again on changing compressed ratio
      calculateValues(inputValue.value, w, h);
    };
    // set original image on preview
    document.querySelector(".bottom img").src = url;
  };
};

// now create calculateValues function here
function calculateValues(v, w, h) {
  var outputQuality = (100 - v) / 100;
  var outputWidth = w * outputQuality;
  var outputHeight = h * outputQuality;
  // now craete a function to compress
  Compress(outputQuality, outputWidth, outputHeight);
}

function Compress(q, w, h) {
  new Compressor(hiddenButton.files[0], {
    quality: q,
    width: w,
    height: h,
    success(result) {
      var url = URL.createObjectURL(result);
      document.getElementsByClassName("output")[0].style.display = "block";
      document.getElementsByClassName("progress")[0].style.display = "block";
      document.getElementsByClassName("preview-container")[0].style.display =
        "block";
      document.getElementsByClassName("turnOff")[0].style.display = "none";
      document.getElementsByClassName("remove")[0].style.display = "none";
      var img = document.createElement("img");
      img.src = url;
      img.onload = function () {
        // show compressed image on preview
        document.querySelector(".top img").src = url;
        var w = img.width;
        var h = img.height;
        // give metedata of output file
        outputMetedata
          .getElementsByTagName("li")[0]
          .getElementsByTagName("strong")[0].innerHTML =
          (q * 100 - 99 + ((q * 100) / 100) * 10).toFixed(0) + "%";
        outputMetedata
          .getElementsByTagName("li")[1]
          .getElementsByTagName("strong")[0].innerHTML = w + "/" + h;
        outputMetedata
          .getElementsByTagName("li")[2]
          .getElementsByTagName("strong")[0].innerHTML =
          (result.size / 1024).toFixed(0) + "Kb";
      };
      download.onclick = function () {
        var filename = upload.getAttribute("filename").split(".");
        var a = document.createElement("a");
        a.href = url;
        a.download = filename[0] + "-min." + filename[1];
        a.click();
      };
    },
    error(err) {
      console.log(err.message);
    },
  });
}
