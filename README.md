
# Weather API

Small weather application using external weather API to gather information. App written in NestJs.


## Features

- Shows average temperature for a country, city or specific location
- Shows general weather in country, city or specifi location
- Shows forecast for next 7 days for above locations



## Tech Stack

- NestJs


## Run Locally

Clone the project

```bash
  git clone https://github.com/Adam-DevPL/weather-api.git
```

Go to the project directory

```bash
  cd weather-api
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run start
```


## Running Tests

Unit tests for the application. To run tests, run the following command

```bash
  npm run test
```


## API Reference

#### Get average of temperature for a specific country

```http
  GET /get/country/:country
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `country` | `string` | **Required**. Country name with validation |

#### a weather for a specific city

```http
  GET /get/city/:city
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `city`      | `string` | **Required**. City name to find weather |

#### a weather for a specific location

```http
  GET /get/location/:lat/:lon
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `lat`, `lon`      | `number` | **Required**. Latitude and longitude for a specifi location |

#### weather data for a specific day

```http
  GET /prediction/:day/:city
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `day`      | `string` | **Required**. Single day, future to find weather |
| `city`      | `string` | **Required**. City name to find weather |

#### weather data for a specific day

```http
  GET /prediction/:day/:country
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `day`      | `string` | **Required**. Single day, future to find weather |
| `country`      | `string` | **Required**. Country name to find weather |


#### a weather data for a specific date range in a specific country

```http
  GET /prediction/country/:country/:from/:to
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `country`      | `string` | **Required**. Country name to find weather |
| `from`      | `string` | **Required**. Future start of the date scope |
| `to`      | `string` | **Required**. Future end of the date scope |

#### a weather data for a specific city and specific data range

```http
  GET /prediction/country/:city/:from/:to
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `city`      | `string` | **Required**. City name to find weather |
| `from`      | `string` | **Required**. Future start of the date scope |
| `to`      | `string` | **Required**. Future end of the date scope |

#### a weather data for a specific location and specific data range

```http
  GET /prediction/country/:lat/:lon/:from/:to
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `lat`, `lon`      | `number` | **Required**. Latitude and longitude for a specifi location |
| `from`      | `string` | **Required**. Future start of the date scope |
| `to`      | `string` | **Required**. Future end of the date scope |




## Authors

- [@adam-devpl](https://github.com/Adam-DevPL)

