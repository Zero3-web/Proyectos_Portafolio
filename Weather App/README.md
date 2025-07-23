# Weather App con OpenWeatherMap API

Esta aplicación del clima utiliza la API de OpenWeatherMap para mostrar datos meteorológicos en tiempo real.

## Configuración de la API

### Paso 1: Obtener API Key de OpenWeatherMap

1. Ve a [OpenWeatherMap](https://openweathermap.org/api)
2. Haz clic en "Sign Up" para crear una cuenta gratuita
3. Una vez registrado, ve a tu perfil y busca la sección "API Keys"
4. Copia tu API key

### Paso 2: Configurar la API Key

1. Abre el archivo `script.js`
2. Encuentra la línea que dice:
   ```javascript
   const API_KEY = 'YOUR_API_KEY';
   ```
3. Reemplaza `'YOUR_API_KEY'` con tu API key real:
   ```javascript
   const API_KEY = 'tu_api_key_aqui';
   ```

## Características

✅ **Datos en tiempo real** - Temperatura actual, condiciones climáticas, viento y humedad
✅ **Pronóstico por horas** - Próximas 18 horas (cada 3 horas)
✅ **Pronóstico semanal** - 6 días de pronóstico
✅ **Ubicación dinámica** - Puedes cambiar la ciudad
✅ **Actualización automática** - Los datos se actualizan cada 10 minutos
✅ **Diseño responsive** - Funciona en móviles y escritorio

## Funcionalidades Adicionales

### Cambiar Ciudad
Puedes cambiar la ciudad desde la consola del navegador:
```javascript
WeatherApp.changeCity('Madrid');
WeatherApp.changeCity('New York');
WeatherApp.changeCity('Tokyo');
```

### Datos que se muestran
- **Temperatura actual** con sensación térmica
- **Condiciones climáticas** (soleado, nublado, lluvioso, etc.)
- **Velocidad del viento** (convertida a mph)
- **Humedad relativa**
- **Pronóstico por horas** para las próximas 18 horas
- **Pronóstico semanal** para los próximos 6 días

## Estructura de Archivos

```
Weather App/
├── index.html      # Estructura HTML
├── style.css       # Estilos CSS
├── script.js       # JavaScript con integración API
└── README.md       # Este archivo
```

## Notas Importantes

- **Límite de API gratuita**: 1000 llamadas por día
- **Actualización automática**: Cada 10 minutos
- **Unidades**: Celsius para temperatura, mph para viento
- **Zona horaria**: Hora local del navegador

## Solución de Problemas

### Error "Please set your OpenWeatherMap API key"
- Verifica que hayas reemplazado 'YOUR_API_KEY' con tu API key real

### Error "Error loading weather data"
- Verifica tu conexión a internet
- Asegúrate de que tu API key sea válida
- Verifica que el nombre de la ciudad sea correcto

### Los datos no se actualizan
- Revisa la consola del navegador para errores
- Verifica que no hayas excedido el límite de la API gratuita

## Mejoras Futuras Posibles

- 🔍 Búsqueda de ciudades con autocompletado
- 📍 Geolocalización automática
- 🌡️ Gráficos de temperatura
- 🗺️ Mapa del clima
- 📱 Notificaciones push
- 🌓 Modo oscuro/claro
- 💾 Ciudades favoritas guardadas localmente

¡Disfruta de tu aplicación del clima personalizada! 🌤️
