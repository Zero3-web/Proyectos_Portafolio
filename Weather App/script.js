// Weather App JavaScript with OpenWeatherMap API

// OpenWeatherMap API configuration
const API_KEY = '81716fd35c25fcb7b104918b3937b7fa'; // Reemplaza con tu API key de OpenWeatherMap
const DEFAULT_CITY = 'Lima';
const UNITS = 'metric'; // Para Celsius
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

// Function to update time
function updateTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
    
    const timeElement = document.querySelector('.time');
    if (timeElement) {
        timeElement.textContent = timeString;
    }
}

// Function to update greeting based on time
function updateGreeting() {
    const now = new Date();
    const hour = now.getHours();
    let greeting;
    
    if (hour < 12) {
        greeting = 'Good Morning';
    } else if (hour < 18) {
        greeting = 'Good Afternoon';
    } else {
        greeting = 'Good Evening';
    }
    
    const greetingElement = document.querySelector('.greeting');
    if (greetingElement) {
        greetingElement.textContent = greeting;
    }
}

// Function to update date
function updateDate() {
    const now = new Date();
    const dateString = now.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
    
    const dateElement = document.querySelector('.date');
    if (dateElement) {
        dateElement.textContent = dateString;
    }
}

// Function to get weather icon class based on OpenWeatherMap icon code
function getWeatherIcon(iconCode) {
    const iconMap = {
        '01d': '☀️', '01n': '🌙',
        '02d': '⛅', '02n': '☁️',
        '03d': '☁️', '03n': '☁️',
        '04d': '☁️', '04n': '☁️',
        '09d': '🌧️', '09n': '🌧️',
        '10d': '🌦️', '10n': '🌧️',
        '11d': '⛈️', '11n': '⛈️',
        '13d': '❄️', '13n': '❄️',
        '50d': '🌫️', '50n': '🌫️'
    };
    return iconMap[iconCode] || '☁️';
}

// Function to convert wind speed from m/s to mph
function convertWindSpeed(speedMs) {
    return (speedMs * 2.237).toFixed(1);
}

// Function to capitalize first letter of each word
function capitalizeWords(str) {
    return str.replace(/\w\S*/g, (txt) => 
        txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );
}

// Function to fetch current weather data
async function fetchCurrentWeather(city = DEFAULT_CITY) {
    // Check cache first
    const cached = getCachedWeather(`current_${city}`);
    if (cached) {
        return cached;
    }
    
    try {
        const response = await fetch(
            `${BASE_URL}/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=${UNITS}`
        );
        
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error(`City "${city}" not found`);
            }
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Cache the data
        cacheWeatherData(`current_${city}`, data);
        
        return data;
    } catch (error) {
        console.error('Error fetching current weather:', error);
        showModernErrorWithRetry(
            error.message.includes('not found') ? 
                `City "${city}" not found. Please try a different city.` : 
                'Error loading weather data. Please check your internet connection.',
            `loadWeatherData('${city}')`
        );
        return null;
    }
}

// Function to fetch 5-day forecast data
async function fetchForecast(city = DEFAULT_CITY) {
    try {
        const response = await fetch(
            `${BASE_URL}/forecast?q=${city}&appid=${API_KEY}&units=${UNITS}`
        );
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching forecast:', error);
        return null;
    }
}

// Function to update current weather display
function updateCurrentWeather(data) {
    if (!data) return;
    
    // Update body class based on weather condition
    updateBodyClass(data.weather[0].main);
    
    // Update location
    const locationElement = document.querySelector('.location');
    if (locationElement) {
        locationElement.textContent = data.name;
    }
    
    // Update main temperature
    const tempLargeElement = document.querySelector('.temperature-large');
    if (tempLargeElement) {
        tempLargeElement.textContent = `${Math.round(data.main.temp)}°`;
    }
    
    // Update condition
    const conditionElement = document.querySelector('.condition');
    if (conditionElement) {
        conditionElement.textContent = capitalizeWords(data.weather[0].description);
    }
    
    // Update wind speed
    const windElements = document.querySelectorAll('.detail-item span:not(.wind-icon):not(.humidity-icon)');
    if (windElements[0]) {
        windElements[0].textContent = `${convertWindSpeed(data.wind.speed)} mph`;
    }
    
    // Update humidity
    if (windElements[1]) {
        windElements[1].textContent = `${data.main.humidity} %`;
    }
    
    // Update right side temperature
    const tempValueElement = document.querySelector('.temp-value');
    if (tempValueElement) {
        tempValueElement.textContent = `${Math.round(data.main.temp)}°`;
    }
    
    // Update right side wind and humidity (text content only)
    const windTextElement = document.querySelector('.wind');
    if (windTextElement) {
        const existingIcon = windTextElement.querySelector('svg');
        if (existingIcon) {
            windTextElement.innerHTML = '';
            windTextElement.appendChild(existingIcon);
            windTextElement.appendChild(document.createTextNode(`${convertWindSpeed(data.wind.speed)} mph`));
        }
    }
    
    const humidityTextElement = document.querySelector('.humidity');
    if (humidityTextElement) {
        const existingIcon = humidityTextElement.querySelector('svg');
        if (existingIcon) {
            humidityTextElement.innerHTML = '';
            humidityTextElement.appendChild(existingIcon);
            humidityTextElement.appendChild(document.createTextNode(`${data.main.humidity} %`));
        }
    }
    
    // Update feels like
    const feelsLikeElement = document.querySelector('.feels-like div:first-child');
    if (feelsLikeElement) {
        feelsLikeElement.textContent = `Feels like ${Math.round(data.main.feels_like)}°`;
    }
    
    // Update condition small
    const conditionSmallElement = document.querySelector('.condition-small');
    if (conditionSmallElement) {
        conditionSmallElement.textContent = capitalizeWords(data.weather[0].description);
    }
}

// Function to update hourly forecast
function updateHourlyForecast(data) {
    if (!data || !data.list) return;
    
    const hourlyItems = document.querySelectorAll('.hourly-item');
    
    // Take first 6 forecast entries (next 18 hours, every 3 hours)
    const hourlyData = data.list.slice(0, 6);
    
    hourlyData.forEach((item, index) => {
        if (hourlyItems[index]) {
            const date = new Date(item.dt * 1000);
            const time = date.toLocaleTimeString('en-US', {
                hour: 'numeric',
                hour12: true
            });
            
            // Update hour
            const hourElement = hourlyItems[index].querySelector('.hour');
            if (hourElement) {
                hourElement.textContent = time;
            }
            
            // Update temperature
            const tempElement = hourlyItems[index].querySelector('.hourly-temp');
            if (tempElement) {
                tempElement.textContent = `${Math.round(item.main.temp)}°`;
            }
            
            // Update condition
            const conditionElement = hourlyItems[index].querySelector('.hourly-condition');
            if (conditionElement) {
                conditionElement.textContent = capitalizeWords(item.weather[0].description);
            }
        }
    });
}

// Function to update weekly forecast
function updateWeeklyForecast(data) {
    if (!data || !data.list) return;
    
    const dayItems = document.querySelectorAll('.day-item');
    const dailyData = [];
    
    // Group forecast by day (every 8th item = 24 hours)
    for (let i = 0; i < data.list.length; i += 8) {
        if (dailyData.length < 6) {
            dailyData.push(data.list[i]);
        }
    }
    
    dailyData.forEach((item, index) => {
        if (dayItems[index]) {
            const date = new Date(item.dt * 1000);
            const dayName = index === 0 ? 'Today' : date.toLocaleDateString('en-US', { weekday: 'short' });
            
            // Update day
            const dayElement = dayItems[index].querySelector('.day');
            if (dayElement) {
                dayElement.textContent = dayName;
            }
            
            // Update temperature
            const tempElement = dayItems[index].querySelector('.day-temp');
            if (tempElement) {
                tempElement.textContent = `${Math.round(item.main.temp)}°`;
            }
            
            // Update condition
            const conditionElement = dayItems[index].querySelector('.day-condition');
            if (conditionElement) {
                conditionElement.textContent = capitalizeWords(item.weather[0].main);
            }
        }
    });
}

// Function to show error message
function showError(message) {
    const container = document.querySelector('.weather-container');
    if (container) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #ff4757;
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            z-index: 1000;
            font-size: 14px;
        `;
        errorDiv.textContent = message;
        document.body.appendChild(errorDiv);
        
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.parentNode.removeChild(errorDiv);
            }
        }, 5000);
    }
}

// Function to show loading state with modern skeleton
function showLoading() {
    const tempElement = document.querySelector('.temperature-large');
    if (tempElement) {
        tempElement.textContent = '--°';
        tempElement.classList.add('loading-skeleton');
    }
    
    const conditionElement = document.querySelector('.condition');
    if (conditionElement) {
        conditionElement.textContent = 'Loading...';
        conditionElement.classList.add('loading-skeleton');
    }
    
    // Add skeleton to hourly items
    const hourlyItems = document.querySelectorAll('.hourly-item');
    hourlyItems.forEach(item => {
        item.classList.add('loading-skeleton');
    });
    
    // Add skeleton to day items
    const dayItems = document.querySelectorAll('.day-item');
    dayItems.forEach(item => {
        item.classList.add('loading-skeleton');
    });
}

// Function to hide loading state
function hideLoading() {
    const elements = document.querySelectorAll('.loading-skeleton');
    elements.forEach(element => {
        element.classList.remove('loading-skeleton');
    });
}

// Function to load all weather data
async function loadWeatherData(city = DEFAULT_CITY) {
    showLoading();
    
    try {
        // Fetch current weather and forecast in parallel
        const [currentWeather, forecast] = await Promise.all([
            fetchCurrentWeather(city),
            fetchForecast(city)        ]);
        
        // Hide loading state
        hideLoading();
        
        if (currentWeather) {
            updateCurrentWeather(currentWeather);
        }
        
        if (forecast) {
            updateHourlyForecast(forecast);
            updateWeeklyForecast(forecast);
        }
          } catch (error) {
        hideLoading();
        console.error('Error loading weather data:', error);
        showModernErrorWithRetry('Failed to load weather data', `loadWeatherData('${city}')`);
    }
}

// Function to handle day item clicks
function handleDayClick(event) {
    // Remove active class from all day items
    const dayItems = document.querySelectorAll('.day-item');
    dayItems.forEach(item => item.classList.remove('active'));
    
    // Add active class to clicked item
    event.currentTarget.classList.add('active');
}

// Function to add hover effects to hourly items
function addHourlyHoverEffects() {
    const hourlyItems = document.querySelectorAll('.hourly-item');
    
    hourlyItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
            this.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.15)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = 'none';
        });
    });
}

// Function to add smooth loading animation
function addLoadingAnimation() {
    const container = document.querySelector('.weather-container');
    if (container) {
        container.style.opacity = '0';
        container.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            container.style.transition = 'all 0.6s ease-out';
            container.style.opacity = '1';
            container.style.transform = 'translateY(0)';
        }, 100);
    }
}

// Function to update weather icons based on condition
function updateWeatherIcon(iconCode) {
    const iconMap = {
        '01d': '☀️', '01n': '🌙',
        '02d': '⛅', '02n': '☁️',
        '03d': '☁️', '03n': '☁️',
        '04d': '☁️', '04n': '☁️',
        '09d': '🌧️', '09n': '🌧️',
        '10d': '🌦️', '10n': '🌧️',
        '11d': '⛈️', '11n': '⛈️',
        '13d': '❄️', '13n': '❄️',
        '50d': '🌫️', '50n': '🌫️'
    };
    return iconMap[iconCode] || '☁️';
}

// Function to update body class based on weather condition
function updateBodyClass(weatherMain) {
    const body = document.body;
    
    // Remove all weather classes
    body.classList.remove('sunny', 'cloudy', 'rainy', 'snowy', 'smoke', 'mist', 'haze', 'clear');
    
    // Add new class based on weather
    const weatherLower = weatherMain.toLowerCase();
    if (weatherLower.includes('clear')) {
        body.classList.add('clear');
    } else if (weatherLower.includes('cloud')) {
        body.classList.add('cloudy');
    } else if (weatherLower.includes('rain') || weatherLower.includes('drizzle')) {
        body.classList.add('rainy');
    } else if (weatherLower.includes('snow')) {
        body.classList.add('snowy');
    } else if (weatherLower.includes('smoke') || weatherLower.includes('mist') || weatherLower.includes('haze')) {
        body.classList.add('smoke');
    } else {
        body.classList.add('sunny');
    }
}

// Function to add floating animation to elements
function addFloatingAnimation() {
    const floatingElements = document.querySelectorAll('.floating');
    floatingElements.forEach((element, index) => {
        element.style.animationDelay = `${index * 0.5}s`;
    });
}

// Function to add stagger animation to day items
function addStaggerAnimation() {
    const dayItems = document.querySelectorAll('.day-item');
    dayItems.forEach((item, index) => {
        item.style.animationDelay = `${index * 0.1}s`;
        item.classList.add('stagger-item');
    });
}

// Function to add parallax effect to background
function addParallaxEffect() {
    const container = document.querySelector('.weather-container');
    
    document.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth) - 0.5;
        const y = (e.clientY / window.innerHeight) - 0.5;
        
        container.style.transform = `
            translateX(${x * 5}px) 
            translateY(${y * 5}px)
        `;
    });
}

// Enhanced error message with modern styling
function showModernError(message) {
    const container = document.querySelector('.weather-container');
    if (container) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'modern-error-message';
        errorDiv.style.cssText = `
            position: fixed;
            top: 30px;
            right: 30px;
            background: rgba(255, 71, 87, 0.9);
            color: white;
            padding: 20px 25px;
            border-radius: 15px;
            z-index: 1000;
            font-size: 14px;
            font-weight: 500;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            box-shadow: 0 8px 32px rgba(255, 71, 87, 0.3);
            animation: slideInRight 0.5s ease-out;
            max-width: 300px;
        `;
        errorDiv.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px;">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span>${message}</span>
            </div>
        `;
        document.body.appendChild(errorDiv);
        
        // Add CSS animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideInRight {
                from {
                    opacity: 0;
                    transform: translateX(100px);
                }
                to {
                    opacity: 1;
                    transform: translateX(0);
                }
            }
        `;
        document.head.appendChild(style);
        
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.style.animation = 'slideInRight 0.5s ease-out reverse';
                setTimeout(() => {
                    errorDiv.parentNode.removeChild(errorDiv);
                    document.head.removeChild(style);
                }, 500);
            }
        }, 4000);
    }
}

// Search functionality with debouncing and city suggestions
let searchTimeout;
const POPULAR_CITIES = [
    'New York', 'London', 'Tokyo', 'Paris', 'Sydney', 'Dubai', 'Singapore', 
    'Los Angeles', 'Chicago', 'Toronto', 'Berlin', 'Moscow', 'Mumbai', 
    'Seoul', 'Madrid', 'Rome', 'Amsterdam', 'Istanbul', 'Bangkok', 'Cairo'
];

// Function to debounce search input
function debounce(func, wait) {
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(searchTimeout);
            func(...args);
        };
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(later, wait);
    };
}

// Function to search cities
function searchCities(query) {
    if (!query || query.length < 2) {
        hideSuggestions();
        return;
    }
    
    const filtered = POPULAR_CITIES.filter(city => 
        city.toLowerCase().includes(query.toLowerCase())
    );
    
    showSuggestions(filtered.slice(0, 5)); // Show max 5 suggestions
}

// Function to show search suggestions
function showSuggestions(cities) {
    const suggestionsContainer = document.getElementById('searchSuggestions');
    
    if (cities.length === 0) {
        hideSuggestions();
        return;
    }
    
    suggestionsContainer.innerHTML = cities.map(city => 
        `<div class="suggestion-item" data-city="${city}">${city}</div>`
    ).join('');
    
    suggestionsContainer.classList.add('show');
    
    // Add click listeners to suggestions
    suggestionsContainer.querySelectorAll('.suggestion-item').forEach(item => {
        item.addEventListener('click', () => {
            selectCity(item.dataset.city);
        });
    });
}

// Function to hide suggestions
function hideSuggestions() {
    const suggestionsContainer = document.getElementById('searchSuggestions');
    suggestionsContainer.classList.remove('show');
}

// Function to select a city
async function selectCity(cityName) {
    const searchInput = document.getElementById('citySearch');
    searchInput.value = cityName;
    hideSuggestions();
    
    // Add loading state
    searchInput.disabled = true;
    
    try {
        await loadWeatherData(cityName);
        
        // Update URL without reloading page
        const url = new URL(window.location);
        url.searchParams.set('city', cityName);
        window.history.pushState({}, '', url);
        
    } catch (error) {
        console.error('Error loading city weather:', error);
        showModernError(`Could not load weather data for ${cityName}`);
    } finally {
        searchInput.disabled = false;
    }
}

// Function to initialize search functionality
function initializeSearch() {
    const searchInput = document.getElementById('citySearch');
    
    if (!searchInput) return;
    
    // Debounced search function
    const debouncedSearch = debounce(searchCities, 300);
    
    // Input event listener
    searchInput.addEventListener('input', (e) => {
        debouncedSearch(e.target.value);
    });
    
    // Enter key handler
    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const firstSuggestion = document.querySelector('.suggestion-item');
            if (firstSuggestion) {
                selectCity(firstSuggestion.dataset.city);
            } else if (searchInput.value.trim()) {
                selectCity(searchInput.value.trim());
            }
        } else if (e.key === 'Escape') {
            hideSuggestions();
            searchInput.blur();
        }
    });
    
    // Hide suggestions when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.search-box')) {
            hideSuggestions();
        }
    });
    
    // Load city from URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const cityParam = urlParams.get('city');
    if (cityParam) {
        searchInput.value = cityParam;
        loadWeatherData(cityParam);
    }
}

// Enhanced error handling with retry functionality
function showModernErrorWithRetry(message, retryAction = null) {
    const container = document.querySelector('.weather-container');
    if (container) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'modern-error-message';
        errorDiv.style.cssText = `
            position: fixed;
            top: 30px;
            right: 30px;
            background: rgba(255, 71, 87, 0.9);
            color: white;
            padding: 20px 25px;
            border-radius: 15px;
            z-index: 1000;
            font-size: 14px;
            font-weight: 500;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            box-shadow: 0 8px 32px rgba(255, 71, 87, 0.3);
            animation: slideInRight 0.5s ease-out;
            max-width: 300px;
        `;
        
        const retryButton = retryAction ? 
            `<button onclick="${retryAction}" style="margin-left: 10px; padding: 5px 10px; background: rgba(255,255,255,0.2); border: none; border-radius: 5px; color: white; cursor: pointer;">Retry</button>` : 
            '';
            
        errorDiv.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px;">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span>${message}</span>
                ${retryButton}
            </div>
        `;
        document.body.appendChild(errorDiv);
        
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.style.animation = 'slideInRight 0.5s ease-out reverse';
                setTimeout(() => {
                    if (errorDiv.parentNode) {
                        errorDiv.parentNode.removeChild(errorDiv);
                    }
                }, 500);
            }
        }, 5000);
    }
}

// Performance optimization: Cache weather data
const weatherCache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Function to get cached weather data
function getCachedWeather(city) {
    const cached = weatherCache.get(city.toLowerCase());
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        return cached.data;
    }
    return null;
}

// Function to cache weather data
function cacheWeatherData(city, data) {
    weatherCache.set(city.toLowerCase(), {
        data,
        timestamp: Date.now()
    });
}

// Initialize the app
async function initWeatherApp() {
    // Check if API key is set
    if (API_KEY === 'YOUR_API_KEY' || API_KEY === '81716fd35c25fcb7b104918b3937b7fa') {
        showModernError('Please set your OpenWeatherMap API key in script.js');
        return;
    }
    
    // Update time, greeting, and date immediately
    updateTime();
    updateGreeting();
    updateDate();
    
    // Initialize search functionality
    initializeSearch();
    
    // Add loading animation
    addLoadingAnimation();
    
    // Add visual effects
    addFloatingAnimation();
    addStaggerAnimation();
    addParallaxEffect();
    
    // Load weather data
    await loadWeatherData();
    
    // Add event listeners to day items
    const dayItems = document.querySelectorAll('.day-item');
    dayItems.forEach(item => {
        item.addEventListener('click', handleDayClick);
    });
    
    // Add hover effects to hourly items
    addHourlyHoverEffects();
    
    // Update time every minute
    setInterval(updateTime, 60000);
    
    // Update greeting every hour
    setInterval(updateGreeting, 3600000);
    
    // Update weather data every 10 minutes
    setInterval(() => {
        const currentCity = document.querySelector('.location').textContent;
        loadWeatherData(currentCity);
    }, 600000);
}

// Start the app when DOM is loaded
document.addEventListener('DOMContentLoaded', initWeatherApp);

// Handle window resize for responsive design
window.addEventListener('resize', function() {
    // Any resize-specific logic can go here
    console.log('Window resized');
});

// Add keyboard navigation support
document.addEventListener('keydown', function(event) {
    const dayItems = document.querySelectorAll('.day-item');
    const activeItem = document.querySelector('.day-item.active');
    
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        event.preventDefault();
        
        let currentIndex = Array.from(dayItems).indexOf(activeItem);
        let newIndex;
        
        if (event.key === 'ArrowLeft') {
            newIndex = currentIndex > 0 ? currentIndex - 1 : dayItems.length - 1;
        } else {
            newIndex = currentIndex < dayItems.length - 1 ? currentIndex + 1 : 0;
        }
        
        // Remove active from current and add to new
        activeItem.classList.remove('active');
        dayItems[newIndex].classList.add('active');
        
        // Scroll into view if needed
        dayItems[newIndex].scrollIntoView({ behavior: 'smooth', inline: 'center' });
    }
});

// Export functions for potential use in other scripts
window.WeatherApp = {
    updateTime,
    updateGreeting,
    updateDate,
    loadWeatherData,
    changeCity: (city) => loadWeatherData(city)
};
