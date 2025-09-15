const apiKey = "18aaf6d5276ef0cc4f45b9cedada6775";

// Theme management
function initializeTheme() {
  const savedTheme = localStorage.getItem('weather-app-theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);
}

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('weather-app-theme', newTheme);
  updateThemeIcon(newTheme);
}

function updateThemeIcon(theme) {
  const themeIcon = document.querySelector('#theme-toggle i');
  themeIcon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
}

// Weather condition mapping
function getWeatherCondition(weatherMain) {
  const conditions = {
    'Clear': 'sunny',
    'Clouds': 'cloudy',
    'Rain': 'rainy',
    'Drizzle': 'rainy',
    'Thunderstorm': 'rainy',
    'Snow': 'snowy',
    'Mist': 'cloudy',
    'Fog': 'cloudy'
  };
  return conditions[weatherMain] || 'cloudy';
}

// Enhanced weather icons
function getWeatherIcon(condition) {
  const icons = {
    'humidity': '<i class="fas fa-tint"></i>',
    'pressure': '<i class="fas fa-gauge-high"></i>',
    'wind-speed': '<i class="fas fa-wind"></i>',
    'wind-direction': '<i class="fas fa-compass"></i>',
    'sunrise': '<i class="fas fa-sun"></i>',
    'sunset': '<i class="fas fa-moon"></i>',
    'visibility': '<i class="fas fa-eye"></i>',
    'uv-index': '<i class="fas fa-sun"></i>'
  };
  return icons[condition] || '<i class="fas fa-info"></i>';
}

// Wind direction converter
function getWindDirection(degrees) {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(degrees / 22.5) % 16;
  return `${directions[index]} (${degrees}°)`;
}

// Main weather function
function showdetails() {
  const city = document.getElementById("city-input").value.trim();
  const datacontainer = document.getElementById("data-container");

  if (!city) {
    showNotification("Please enter a city name", "error");
    return;
  }

  datacontainer.className = "weather-card show";
  datacontainer.innerHTML = `
    <div class="loading">
      <div class="loading-spinner"></div>
      <div class="loading-text">Fetching weather data...</div>
    </div>
  `;

  fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
  )
    .then((response) => {
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("City not found. Please check the spelling and try again.");
        } else if (response.status === 401) {
          throw new Error("API key error. Please contact support.");
        } else {
          throw new Error("Unable to fetch weather data. Please try again later.");
        }
      }
      return response.json();
    })
    .then((data) => {
      const sunrise = new Date(data.sys.sunrise * 1000).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      });
      const sunset = new Date(data.sys.sunset * 1000).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      });
      const currentDate = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      const weatherCondition = getWeatherCondition(data.weather[0].main);
      datacontainer.className = `weather-card show ${weatherCondition}`;

      datacontainer.innerHTML = `
        <div class="location-info">
          <div class="city-name">${data.name}, ${data.sys.country}</div>
          <div class="current-date">${currentDate}</div>
        </div>

        <div class="temperature-section">
          <div class="main-temp">${Math.round(data.main.temp)}°</div>
          <div class="feels-like">Feels like ${Math.round(data.main.feels_like)}°C</div>
          <div class="weather-description">${data.weather[0].description}</div>
        </div>

        <div class="details-grid">
          <div class="detail-item">
            ${getWeatherIcon('humidity')}
            <div class="detail-label">Humidity</div>
            <div class="detail-value">${data.main.humidity}%</div>
          </div>
          
          <div class="detail-item">
            ${getWeatherIcon('pressure')}
            <div class="detail-label">Pressure</div>
            <div class="detail-value">${data.main.pressure} hPa</div>
          </div>
          
          <div class="detail-item">
            ${getWeatherIcon('wind-speed')}
            <div class="detail-label">Wind Speed</div>
            <div class="detail-value">${data.wind.speed} m/s</div>
          </div>
          
          <div class="detail-item">
            ${getWeatherIcon('wind-direction')}
            <div class="detail-label">Wind Direction</div>
            <div class="detail-value">${getWindDirection(data.wind.deg)}</div>
          </div>
          
          <div class="detail-item">
            ${getWeatherIcon('sunrise')}
            <div class="detail-label">Sunrise</div>
            <div class="detail-value">${sunrise}</div>
          </div>
          
          <div class="detail-item">
            ${getWeatherIcon('sunset')}
            <div class="detail-label">Sunset</div>
            <div class="detail-value">${sunset}</div>
          </div>
        </div>
      `;
      
      // Save to recent searches
      saveRecentSearch(data.name, data.sys.country);
      showNotification(`Weather data loaded for ${data.name}`, "success");
    })
    .catch((err) => {
      datacontainer.innerHTML = `<div class="error"><i class="fas fa-exclamation-triangle"></i> ${err.message}</div>`;
      showNotification(err.message, "error");
    });
}

// Quick search function
function quickSearch(cityName) {
  document.getElementById("city-input").value = cityName;
  showdetails();
}

// Recent searches management
function saveRecentSearch(city, country) {
  let recentSearches = JSON.parse(localStorage.getItem('recent-searches') || '[]');
  const searchItem = `${city}, ${country}`;
  
  // Remove if already exists
  recentSearches = recentSearches.filter(item => item !== searchItem);
  
  // Add to beginning
  recentSearches.unshift(searchItem);
  
  // Keep only last 5 searches
  recentSearches = recentSearches.slice(0, 5);
  
  localStorage.setItem('recent-searches', JSON.stringify(recentSearches));
}

// Notification system
function showNotification(message, type = 'info') {
  // Remove existing notification
  const existingNotification = document.querySelector('.notification');
  if (existingNotification) {
    existingNotification.remove();
  }

  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.innerHTML = `
    <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
    <span>${message}</span>
  `;
  
  document.body.appendChild(notification);
  
  // Auto remove after 3 seconds
  setTimeout(() => {
    if (notification.parentNode) {
      notification.remove();
    }
  }, 3000);
}

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
  // Initialize theme
  initializeTheme();
  
  // Theme toggle event
  document.getElementById('theme-toggle').addEventListener('click', toggleTheme);
  
  // Enter key support
  document.getElementById("city-input").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
      showdetails();
    }
  });
  
  // Input focus animation
  const searchInput = document.getElementById("city-input");
  searchInput.addEventListener('focus', function() {
    this.parentElement.style.transform = 'scale(1.02)';
  });
  
  searchInput.addEventListener('blur', function() {
    this.parentElement.style.transform = 'scale(1)';
  });
});