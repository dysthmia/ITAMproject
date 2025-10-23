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
    if (e.target.tagName==="LI"){//пункт из списка готов
        e.target.classList.toggle("cheked");
        saveData();
    }
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
    listContainer.innerHTML=localStorage.getItem("data");
}
showTask()



const apiKey="8da7d2215fa7c151f0a77fb32478e277";
const apiUrl="https://api.openweathermap.org/data/2.5/weather?&units=metric&q=";

const searchBox=document.querySelector(".row888 input");
const searchBtn=document.querySelector(".row888 button");
const weatherIcon=document.querySelector(".weather-icon");

async function checkWeather(city) {
    const response = await fetch(apiUrl+ city + `&appid=${apiKey}`);
    var data=await response.json();
    console.log(data);

    document.querySelector(".city-name").innerHTML=data.name;
    document.querySelector(".temp").innerHTML=Math.round(data.main.temp)+"°C";
    document.querySelector(".humidity").innerHTML=data.main.humidity+"%";
    document.querySelector(".wind").innerHTML=data.wind.speed+" km/h";

    if (data.weather[0].main == "Clouds"){
        weatherIcon.src = "content/clouds.png";
    } 
    else if (data.weather[0].main == "Clear"){
        weatherIcon.src="content/clear.png"
    }
    else if(data.weather[0].main == "Rain"){
        weatherIcon.src="content/rain.png"
    }
    else if(data.weather[0].main == "Drizzle"){
        weatherIcon.src="content/drizl.png"
    }
    else if(data.weather[0].main == "Mist"){
        weatherIcon.src="content/mist.png"
    }

}
searchBtn.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        event.preventDefault(); // Предотвращаем перенос строки
        addTask();
    }
});
