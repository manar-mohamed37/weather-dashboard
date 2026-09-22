// 1. عناصر الواجهة (DOM Elements)
const cityInput = document.getElementById('city-input');
const searchBtn = document.getElementById('search-btn');
const cityNameEl = document.getElementById('city-name');
const dateEl = document.getElementById('date-today');
const weatherIcon = document.getElementById('weather-icon');
const temperatureEl = document.getElementById('temperature');
const weatherDescEl = document.getElementById('weather-desc');
const humidityEl = document.getElementById('humidity');
const windSpeedEl = document.getElementById('wind-speed');
const errorBox = document.getElementById('error-box');

// مفتاح الـ API المجاني الجاهز للتشغيل مباشرة
const apiKey = "b1c7ba3380026e6d11f5df8b7b75225c"; 

// 2. دالة جلب بيانات الطقس من سيرفر OpenWeatherMap
async function checkWeather(city) {
    // رابط السيرفر مضاف إليه اسم المدينة والمفتاح واللغة العربية
    const url = `https://openweathermap.org{city}&appid=${apiKey}&units=metric&lang=ar`;
    
    try {
        const response = await fetch(url);
        
        // إذا كانت المدينة غير موجودة (خطأ 404)
        if(response.status === 404) {
            errorBox.style.display = 'block'; // إظهار رسالة الخطأ
            return;
        }
        
        errorBox.style.display = 'none'; // إخفاء رسالة الخطأ إذا كان الرد ناجحاً
        const data = await response.json();
        
        updateWeatherUI(data); // تحديث الواجهة بالبيانات الحقيقية
        
    } catch (error) {
        console.error("حدث خطأ أثناء جلب البيانات:", error);
    }
}

// 3. دالة تحديث الواجهة وتغيير الخلفيات والأيقونات ديناميكياً
function updateWeatherUI(data) {
    cityNameEl.innerText = data.name;
    temperatureEl.innerText = Math.round(data.main.temp);
    weatherDescEl.innerText = data.weather[0].description;
    humidityEl.innerText = `${data.main.humidity}%`;
    windSpeedEl.innerText = `${Math.round(data.wind.speed * 3.6)} كم/س`; // تحويل السرعة لـ كم/ساعة

    // عرض تاريخ اليوم منسقاً
    const options = { weekday: 'long', month: 'long', day: 'numeric' };
    dateEl.innerText = new Date().toLocaleDateString('ar-EG', options);

    // 4. منطق تغيير الخلفية والأيقونة بناءً على حالة الطقس (Weather Condition)
    const mainCondition = data.weather[0].main.toLowerCase();
    
    // إزالة أي كلاسات قديمة من الـ body
    document.body.className = '';

    if (mainCondition.includes('clear')) {
        document.body.classList.add('clear-sky');
        weatherIcon.className = "fas fa-sun"; // أيقونة شمس
    } else if (mainCondition.includes('cloud')) {
        document.body.classList.add('clouds');
        weatherIcon.className = "fas fa-cloud"; // أيقونة سحاب
    } else if (mainCondition.includes('rain') || mainCondition.includes('drizzle')) {
        document.body.classList.add('rain');
        weatherIcon.className = "fas fa-cloud-showers-heavy"; // أيقونة مطر
    } else if (mainCondition.includes('snow')) {
        document.body.classList.add('snow');
        weatherIcon.className = "fas fa-snowflake"; // أيقونة ثلج
    } else {
        // حالة افتراضية للضباب أو العواصف
        weatherIcon.className = "fas fa-smog";
    }
}

// 5. مستمعي الأحداث (Event Listeners)
searchBtn.addEventListener('click', () => {
    if(cityInput.value.trim() !== "") {
        checkWeather(cityInput.value.trim());
    }
});

// ميزة تشغيل البحث عند الضغط على زر Enter في الكيبورد لتسهيل تجربة المستخدم
cityInput.addEventListener('keydown', (e) => {
    if(e.key === 'Enter' && cityInput.value.trim() !== "") {
        checkWeather(cityInput.value.trim());
    }
});

// تشغيل التطبيق تلقائياً عند فتح الصفحة على مدينة افتراضية (Cairo)
checkWeather('Cairo');