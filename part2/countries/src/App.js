import { useState, useEffect } from 'react'
import axios from 'axios'

const api_key = process.env.REACT_APP_API_KEY

const Filter = ({ filter, handleFilterChange }) => {
  return (
    <div>
      find countries <input value={filter} onChange={handleFilterChange} />
    </div>
  )
}

const ShowOneCountry = ({country}) => {
  const [weather, setWeather] = useState(null)

  useEffect(() => {
    axios
      .get('https://api.openweathermap.org/data/2.5/weather?q=' + country.name.common + '&appid=' + api_key + '&units=metric')
      .then(response => {
        setWeather(response.data)
      })
  }, [country])

  if(weather === null) {
    return(
      <div>
      </div>
    )
  } else {
  return (
    <div>
      <h2>{country.name.common}</h2>
      <p>capital {country.capital}</p>
      <p>population {country.population}</p>
      <h3>languages</h3>
      <ul>
        {Object.values(country.languages).map(language =>
          <li key={language}>{language}</li>
        )}
      </ul>
      <img src={country.flags.png} width="200" alt="flag" />
      <h3>Weather in {country.name.common}</h3>
      <p>temperature {weather.main.temp} Celcius</p>
      <p>wind {weather.wind.speed}</p>
      <img src={'https://openweathermap.org/img/w/' + weather.weather[0].icon + '.png'} alt="weather icon" />
    </div>
  )
        }
}

const Country = ({countriesToShow, showCountry}) => {
  if (countriesToShow.length === 1) {
    return <ShowOneCountry country={countriesToShow[0]} />
  } else if(countriesToShow.length > 10){
    return (
      <div>
        too many matches, specify another filter
      </div>
    )
  } else {
    return (
      <div>
        <h2>Countries</h2>
        <ul>
          {countriesToShow.map(country =>
            <li key={country.name.common}>{country.name.common} <button onClick={() => showCountry(country)}> show </button></li>
          )}
          
        </ul>
      </div>
    )
  }
}

const App = () => {
  const [countries, setCountries] = useState([])
  const [filter, setFilter] = useState('')

  const hook = () =>{
    axios
      .get('https://restcountries.com/v3.1/all')
      .then(response => {
        setCountries(response.data)
      })
  }

  useEffect(hook, [])

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  const showCountry = (country) => {
    setFilter(country.name.common)
  }
  
  const countriesToShow = () => {
    if (filter === '') {
      return countries
    } else {
      return countries.filter(country => country.name.common.toLowerCase().includes(filter.toLowerCase()))
    }
  }
  
  return (
    <div>
      <Filter filter={filter} handleFilterChange={handleFilterChange} />
      <Country countriesToShow={countriesToShow()} showCountry={showCountry} />
    </div>
  )
}

export default App