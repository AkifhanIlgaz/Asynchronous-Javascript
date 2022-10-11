function get(url) {
  return new Promise((resolve, reject) => {
    let httpRequest = new XMLHttpRequest();
    httpRequest.open("GET", url);
    httpRequest.onload = function () {
      if (httpRequest.status === 200) {
        resolve(httpRequest.responseText);
      } else {
        reject(Error(httpRequest.status));
      }
    };
    httpRequest.send();
  });
}

function successHandler(data) {
  const dataObj = JSON.parse(data);
  const weatherDiv = document.querySelector("#weather");
  const div = `
        <h2 class="top">
        <img
            src="http://openweathermap.org/img/w/${dataObj.weather[0].icon}.png"
            alt="${dataObj.weather[0].description}"
            width="50"
            height="50"
        />${dataObj.name}
        </h2>
        <p>
        <span class="tempF">${tempToF(dataObj.main.temp)}&deg;</span> | ${
    dataObj.weather[0].description
  }
        </p>
    `;
  return div;
}

function failHandler(status) {
  console.log(status);
}

function tempToF(kelvin) {
  return ((kelvin - 273.15) * 1.8 + 32).toFixed(0);
}

document.addEventListener("DOMContentLoaded", function () {
  const apiKey = "03b8572e8d846defd6d849e8d9302a0d";
  const weatherDiv = document.querySelector("#weather");

  const locations = ["los+angeles", "san+francisco", "lone+pine", "mariposa"];

  const urls = locations.map((location) => {
    return (
      `https://api.openweathermap.org/data/2.5/weather?q=${location}&APPID=` +
      apiKey
    );
  });

  const urlPromises = urls.map((url) => get(url));

  Promise.all(urlPromises)
    .then((responses) => {
      return responses.map((response) => successHandler(response));
    })
    .then((literals) => {
      weatherDiv.innerHTML = `<h1>Weather</h1>${literals.join("")}`;
    })
    .catch((error) => failHandler(error))
    .finally(() => {
      // This will be executed no matter what the promise state is
      weatherDiv.classList.remove("hidden");
    });
});
