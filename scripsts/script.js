// 8da7d2215fa7c151f0a77fb32478e277
//https://api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}
const inputBox=document.getElementById("input-box"); //в эту переменную записываем то что ввел пользовател
const listContainer=document.getElementById("list-container");//это переменная наш список

function addTask(){
    if (inputBox.value === ''){
        alert('bruh realy?');//если введеное значение пусто - ошибка
    }
    else{
        let li =document.createElement("li");//создаем пункт из списка и добавляем его йоу
        li.innerHTML=inputBox.value;
        listContainer.appendChild(li);
        let span=document.createElement("span");//так называемый крест
        span.innerHTML="\u00d7";
        li.appendChild(span);
        saveData();//крч функцию localstorage
    }
    inputBox.value="";
}

listContainer.addEventListener("click",function(e){//приколюха по нажатию определяет что сделать надо
    // Не стоит использовать такой ненадежный идентификатор, как тег
    // Представим, что ты решил добавить фичу "подзадачи для каждой задачи". В этой фиче ты в верстке
    // к каждой задачке добавил внутрь еще один список ul и с li. Допустим я кликну не по твоей таске целиком,
    // а кликну по вложенному элементу, и твой код добавит ему class cheked, хотя ты не планировал этого
    //
    // Чтобы избежать этого используй что-то понадежнее для проверки элемента в духе id или класса
    //
    // Вообще тут ошибка есть. Если твоя todo разрастется и туда добавится верстка, в духе заголовка,
    // Описания, иконки какой-то - твой код не заработает. Я кликну по иконке и ничего не произойдет тк
    // e.target !== todo (какой-то не тот элемент)
    // Надо проверять, что в родительских тегах есть todo (например через id) и уже тогда ставить на todo - checked
    // вот тут есть проблема как я описал - https://learn.javascript.ru/event-delegation
    // А вообще в целом посмотри всю главу эту (https://learn.javascript.ru/ui) - 
    // это прям мастхев знания, которые напрямую нужны в продакшене
    if (e.target.tagName==="LI"){//пункт из списка готов
        e.target.classList.toggle("cheked");
        saveData();
    }
    // Проблемы аналогичны проблемам выше на 3 строчки
    else if (e.target.tagName==="SPAN"){//удалить элемент из списка
        e.target.parentElement.remove();
        saveData();
    }
},false);

inputBox.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        event.preventDefault(); // Предотвращаем перенос строки
        addTask();
    }
});

function saveData(){
    localStorage.setItem("data",listContainer.innerHTML);
}
function showTask(){
    // Тоже нереальная уязвимость использовать прям innerHTML. Можно из браузера открыть в devtools localstorage.
    // Я мог бы спокойно вставлять туда любые скрипты и выведать какие-нибудь секретики твоего приложения
    //
    // Тут надо работать с текстом - хранить таски в виде объектов и потом рендерить эти объекты,
    // Добавляя значения для тегов через textContent
    listContainer.innerHTML=localStorage.getItem("data");
}
showTask()


// Был варик для урока израсходовать лимит этого ключа, чтобы тебе пришлось новый создать, 
// но лан хахаха, не буду
//
// Не делай так, используй для этого .env файл и библиотеку dotenv, либо в vite это уже по дефолту есть,
// погуглишь и все найдешь (ищи "переменные среды")
const apiKey="8da7d2215fa7c151f0a77fb32478e277";
const apiUrl="https://api.openweathermap.org/data/2.5/weather?&units=metric&q=";

const searchBox=document.querySelector(".row888 input");
const searchBtn=document.querySelector(".row888 button");
const weatherIcon=document.querySelector(".weather-icon");

async function checkWeather(city) {
    // Ты не обернул запрос в catch и вообще в целом не валидируешь данные бека
    // Если запрос упадет с ошибкой - твой сайт сломается и упадет с ошибкой (белый экран будет)
    const response = await fetch(apiUrl+ city + `&appid=${apiKey}`);
    var data=await response.json();
    console.log(data);

    // Фатальная ошибка использовать тут innerHTML, потому что он парсится
    // как полноценный html и в него можно засунуть скрипт нехороший - допустим бекенд украл я. Я засуну в data.name скрипт, 
    // в котором сделаю очень много чего нехорошего с твоим сайтом
    // Допустим украду токены безопасности, или заставлю твоих пользователей как зомби атаковать другой сайт
    // Или буду редиректить их на сайты всякие интимные и там буду красть их ip и все данные
    //
    // Использовать innerHTML с данными, которые ты не контролируешь в скрипте - фатально
    // Тоже самое нельзя делать для ввода юзера, например он может вставить в input свой код,
    // а ты его парсишь через innerHTML
    //
    // Опять же не проверяешь что вообще пришло. Например я ввел абракадабру в поиск погоды
    // И апишка вернула ошибку, мол нет таких данных, поэтому в интерфейсе появился undefined
    // Такие кейсы надо обрабатывать и отображать какую-нибудь запасную версию на такие случаи в духе
    // "Не удалось найти данные по вашему запросу, попробуйте снова" и грустный смайлик
    // + пользователю надо понимать, что идет какая-то работа. Нужно добавлять какое-то loading состояние
    // Типо пока запрос идет отображается вместо карточки погоды "loading...", а потом в блоке finally у промиса ты бы убрал этот loading
    document.querySelector(".city-name").innerHTML=data.name;
    document.querySelector(".temp").innerHTML=Math.round(data.main.temp)+"°C";
    document.querySelector(".humidity").innerHTML=data.main.humidity+"%";
    document.querySelector(".wind").innerHTML=data.wind.speed+" km/h";

    // Для таких случаев используй switch case, он идеально подходит для таких блоков
    // Занимает гораздо меньше места
    if (data.weather[0].main == "Clouds"){
        weatherIcon.src = "content/CLOUDS.png";
    } 
    else if (data.weather[0].main == "Clear"){
        weatherIcon.src="content/CLEAR.png"
    }
    else if(data.weather[0].main == "Rain"){
        weatherIcon.src="content/RAIN.png"
    }
    else if(data.weather[0].main == "Drizzle"){
        weatherIcon.src="content/DRIZL.png"
    }
    else if(data.weather[0].main == "Mist"){
        weatherIcon.src="content/MIST.png"
    }
}

// Исправленная обработка нажатия Enter для поиска погоды
searchBox.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        // Вот тут можно было бы обработать ошибку промиса
        checkWeather(searchBox.value);
    }
});

// Обработка клика на кнопку поиска
searchBtn.addEventListener("click", function() {
    checkWeather(searchBox.value);
});