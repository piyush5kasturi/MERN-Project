const cityName = document.getElementById('cityName');
const submitBtn = document.getElementById('submitBtn');
const city_name = document.getElementById('city_name');
const temp_real_value = document.getElementById('temp_real_value');
const temp_status = document.getElementById('temp_status');

const datahide = document.querySelector('.middle_layer');


const getInfo = async (event) => {
    event.preventDefault();
    let cityVal = cityName.value;
    if (cityVal === "") {
        city_name.innerText = `Plz write the name before search`;
        datahide.classList.add('data_hide');
    } else {
        try {
            let url = `https://api.openweathermap.org/data/2.5/weather?q=${cityVal}&units=metric&appid=33ef2d0ab21a36cf0c24ab5b81637b53`;
            const response = await fetch(url);
            const data = await response.json();
            const arrData = [data];

            city_name.innerText = `${arrData[0].name}, ${arrData[0].sys.country}`;
            temp_real_value.innerText = arrData[0].main.temp;

            const tempMod = arrData[0].weather[0].main;
            //condition to check sunny or cloudy
            if (tempMod == 'Clear') {
                temp_status.innerHTML = '<img src="images/animated/day.svg" alt="cloudy">';
            } else if (tempMod == "Clouds") {
                temp_status.innerHTML = '<img src="images/animated/cloudy.svg" alt="cloudy">';
            } else if (tempMod == "Rain") {
                temp_status.innerHTML = '<img src="images/animated/rainy-7.svg" alt="cloudy">';
            } else {
                temp_status.innerHTML = '<img src="images/animated/day.svg" alt="cloudy">'
            }
            datahide.classList.remove('data_hide');

        } catch {
            city_name.innerText = `Plz enter the city name properly`;
            datahide.classList.add("data_hide");

        }

    }
}

submitBtn.addEventListener('click', getInfo);
