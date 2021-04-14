import data from '../cities.json';
import axios from "axios";
import moment from 'moment';
import Cookies from 'js-cookie'
import { useEffect, useState } from 'react';
import Config from '../config.json';

function Welcome() {

    const [weatherData, setWeatherData] = useState({
        city: null,
        data: {}
    })

    const loadDropdownData = () => {
        const cityList = data.List;
        let options = [];
        cityList.forEach(element => {
            options.push(<option value={element.CityCode}>{element.CityName}</option>)
        });
        return options;
    }

    useEffect(() => {
        loadDropdownData();
        fetchData(data.List[0].CityCode)

    }, [])

    const onDropdownChange = (e) => {
        fetchData(e.target.value)
    }

    const fetchData = (cityCode) => {

        const getCacheData = Cookies.get(cityCode);
        if (getCacheData) {
            setWeatherData({ city: cityCode, data: JSON.parse(getCacheData) })
            console.log("INFO", "Load From Cache");
        } else {
            console.log("INFO", "Load From API");
            axios.get(`${Config.BaseUrl}${cityCode}${Config.AppId}`)
                .then(result => {
                    if (result.data.list && result.data.list.length > 0) {
                        const saveData = {
                            ...result.data.list[0], lastUpdated: new Date()
                        }
                        setWeatherData({ city: cityCode, data: saveData });
                        Cookies.set(cityCode, JSON.stringify(saveData), {
                            path: '/',
                            expires: new Date(Date.now() + 300000)
                        })
                    }

                }).catch(err => {
                    console.log(err);
                })
        }

    }

    const ucfirst = (str) => str.charAt(0).toUpperCase() + str.slice(1)
    console.log(weatherData)
    return <div className="container">

        <div className="weather-side">

            <div className="weather-gradient"></div>

            <div className="date-container">

                <h2 className="date-dayname">{moment(new Date()).format('ddd')}</h2>
                <span className="date-day">{moment(new Date()).format("DD MMMM YYYY")}</span>
                <span className="location font-weight-bold">{weatherData.data && weatherData.data.name}</span>

            </div>

            <div className="weather-container">

                <h1 className="weather-temp">{weatherData.data && weatherData.data.main && weatherData.data.main.temp}
                    <span className="font-weight-bold extrasmall">°C</span>
                </h1>

                <h3 className="weather-desc mb-0">{weatherData.data && weatherData.data.weather && weatherData.data.weather[0].main}

                </h3>
                <h6 className=" text-white">
                    {ucfirst(
                        (weatherData.data && weatherData.data.weather) ? weatherData.data.weather[0].description : "")}</h6>

            </div>

        </div>

        <div className="info-side">

            <div className="today-info-container">

                <div className="today-info">

                    <div className="precipitation"> <span className="title">PRESSURE</span><span className="value"> &nbsp;&nbsp;
                    {weatherData.data && weatherData.data.main && weatherData.data.main.pressure} Pa
                    </span>

                        <div className="clear"></div>

                    </div>

                    <div className="humidity"> <span className="title">HUMIDITY</span><span className="value">
                        {weatherData.data && weatherData.data.main && weatherData.data.main.humidity} %
                    </span>

                        <div className="clear"></div>

                    </div>

                    <div className="wind"> <span className="title">WIND</span><span className="value">
                        {weatherData.data && weatherData.data.wind && weatherData.data.wind.speed} km/h
                    </span>

                        <div className="clear"></div>

                    </div>

                </div>

            </div>

            <div className="location-container">
                <select className="form-control" name="cityCode" onChange={onDropdownChange}>
                    {loadDropdownData()}
                </select>
            </div>

            <div className="lastUpdated">
                <p>Last updated: {moment(weatherData.data && weatherData.data.lastUpdated ? weatherData.data.lastUpdated : new Date()).format("DD/MM/YYYY hh:mm:ss")}</p>
            </div>

            <div className="cloud" style={{margin: "4px", marginLeft: "8px", marginTop: "10px"}}>
                <p>The data displayed here is got <br/> from the open weather API.</p>
            </div>
        </div>
    </div>

}

export default Welcome;