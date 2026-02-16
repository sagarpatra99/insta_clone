const ImageKit = require("@imagekit/nodejs");

const imagekit = new ImageKit({
  publicKey: "paste",
  privateKey: "paste",
  urlEndpoint: "paste",
});

async function test() {
  try {
    const res = await imagekit.files.upload({
      file: "https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png",
      fileName: "test.png",
    });

    console.log("SUCCESS:", res.url);
  } catch (err) {
    console.log("ERROR:", err.message);
  }
}

test();
