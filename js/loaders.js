function alertMessage(msg) {
  const popupMessages = document.querySelector(".popupMessages");
  popupMessages.innerHTML = `
      <div id="popup-modal" tabindex="-1"
      class="overflow-y-auto overflow-x-hidden fixed right-0 left-0 z-50 md:inset-0 h-modal md:h-full justify-center items-center flex"
      aria-modal="true" role="dialog">
      <div class="relative p-4 w-full max-w-md h-full md:h-auto">
          <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
              <div class="p-6 text-center">
                  <svg aria-hidden="true" class="mx-auto mb-4 w-14 h-14 text-gray-300 dark:text-gray-400" fill="none"
                      stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-200">${msg}</h3>
                  <button onclick="window.location.reload()" data-modal-toggle="popup-modal" type="button" class="text-white bg-red-600 hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2">
                    Try again
                </button>
              </div>
          </div>
      </div>
    </div>
  `;
}
function loadImage(url) {
  return new Promise((resolve) => {
    const image = new Image();
    image.addEventListener("load", () => {
      resolve(image);
    });
    image.src = url;
  });
}

async function loadImageFolder(url) {
  return await fetch(url)
    .then((response) => response.text())
    .then(async (html) => {
      let image = [];
      var parser = new DOMParser();
      var doc = parser.parseFromString(html, "text/html");
      let elements = doc.getElementsByTagName("a");
      for (let i = 0; i < elements.length; i++) {
        let href = elements[i].href.match(/\.(jpe?g|png|gif)$/);
        if (href != null) {
          let src = href.input;
          await loadImage(src).then((res) => {
            image[i] = res;
          });
        }
      }
      return image.filter((e) => e != null);
    })
    .catch(function (err) {
      console.log("Failed to fetch: ", err);
    });
}

const probability = (min = 0.01, max = 0.99) => {
  return Math.random() * (max - min) + min;
};
