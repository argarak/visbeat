let mt = 0;
let fr1 = 0;
let fr2 = 0;

let searchParams = new URLSearchParams(window.location.search);

let red, green, blue, alpha;

if (
  searchParams.get("r") === null ||
  searchParams.get("g") === null ||
  searchParams.get("b") === null ||
  searchParams.get("a") === null
) {
  // some defaults if there isn't any functions to load from URL
  red = t => {
    return (t * 2) | (t / 400) | (t / 400000);
  };
  green = t => {
    return (t / 2) | (t / 400) | (t / 800000);
  };
  blue = t => {
    return t | (t / 400) | (t / 200000);
  };
  alpha = t => {
    return 255;
  };
} else {
  red = new Function("t", "return " + atob(searchParams.get("r")) + ";");
  green = new Function("t", "return " + atob(searchParams.get("g")) + ";");
  blue = new Function("t", "return " + atob(searchParams.get("b")) + ";");
  alpha = new Function("t", "return " + atob(searchParams.get("a")) + ";");
}

function returnRGBAEncoded(funcStrings) {
  if (funcStrings.length !== 4) return;
  let encoded = [];
  for (let fstr of funcStrings) {
    encoded.push(encodeURIComponent(btoa(fstr)));
  }
  console.log(
    "?r=" +
      encoded[0] +
      "&g=" +
      encoded[1] +
      "&b=" +
      encoded[2] +
      "&a=" +
      encoded[3]
  );
}

document.addEventListener(
  "DOMContentLoaded",
  function() {
    var fpsbox = document.getElementById("fps");

    let drawfps = function() {
      //fr1 = performance.now();
      draw();
      //fr2 = performance.now();
      //fpsbox.innerHTML = "" + 1000 / (fr2 - fr1);
    };

    var draw = function() {
      let ctx = window.ctx;

      //var imgdata = ctx.getImageData(0, 0, 640, 480);
      var imgdata = ctx.createImageData(640, 480);
      var imgdatalen = imgdata.data.length;

      for (var i = 0; i < imgdatalen / 4; i++) {
        imgdata.data[4 * (mt % (imgdatalen / 4))] = (red(mt) % 256) | 0;
        imgdata.data[4 * (mt % (imgdatalen / 4)) + 1] = (green(mt) % 256) | 0;
        imgdata.data[4 * (mt % (imgdatalen / 4)) + 2] = (blue(mt) % 256) | 0;
        imgdata.data[4 * (mt % (imgdatalen / 4)) + 3] = (alpha(mt) % 256) | 0;

        mt += 1;
      }

      ctx.putImageData(imgdata, 0, 0);

      window.requestAnimationFrame(drawfps);
    };

    let canvas = document.getElementById("vis");

    if (canvas.getContext) {
      window.ctx = canvas.getContext("2d");
    }

    window.requestAnimationFrame(drawfps);
  },
  false
);
