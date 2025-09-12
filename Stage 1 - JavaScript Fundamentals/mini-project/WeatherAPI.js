const apiKey = "18aaf6d5276ef0cc4f45b9cedada6775";

function showdetails() {
  const city = document.getElementById("city-input").value;
  if (!city) {
    alert("Please enter a city name");
    return;
  }

  fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
  )
    .then((response) => {
      if (!response.ok) throw new Error("City not found");
      return response.json();
    })
    .then((data) => {
      // convert sunrise/sunset from unix to readable time
      const sunrise = new Date(data.sys.sunrise * 1000).toLocaleTimeString();
      const sunset = new Date(data.sys.sunset * 1000).toLocaleTimeString();

      const datacontainer = document.getElementById("data-container");
      datacontainer.innerHTML = `
          <h3>Weather in ${data.name}, ${data.sys.country}</h3>
          <p><strong>Coordinates:</strong> ${data.coord.lat}, ${data.coord.lon}</p>
          <p><strong>Weather:</strong> ${data.weather[0].main} (${data.weather[0].description})</p>
          <p><strong>Temperature:</strong> ${data.main.temp}°C (feels like ${data.main.feels_like}°C)</p>
          <p><strong>Humidity:</strong> ${data.main.humidity}%</p>
          <p><strong>Pressure:</strong> ${data.main.pressure} hPa</p>
          <p><strong>Clouds:</strong> ${data.clouds.all}%</p>
          <p><strong>Wind:</strong> ${data.wind.speed} m/s @ ${data.wind.deg}°</p>
          <p><strong>Visibility:</strong> ${data.visibility} m</p>
          <p><strong>Sunrise:</strong> ${sunrise}</p>
          <p><strong>Sunset:</strong> ${sunset}</p>
        `;
    })
    .catch((err) => {
      document.getElementById(
        "data-container"
      ).innerHTML = `<p style="color:red">${err.message}</p>`;
    });
}
