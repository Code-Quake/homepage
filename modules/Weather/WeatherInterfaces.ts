export interface IShowAlert {
  description: string;
  end: string;
  event: string;
  start: string;
}

export interface IShowDaily {
  summary: string;
  fullSummary: string;
  date: string;
  temp_max: string;
  icon: string;
  sunrise: string;
  sunset: string;
  feels_like: number;
  humidity: number;
  clouds: number;
  wind_speed: number;
}

export interface IAlert {
  description: string;
  end: number;
  event: string;
  sender_name: string;
  start: number;
  tags: string[];
}

export interface IWeather {
  description: string;
  icon: string;
  id: number;
  main: string;
}

export interface ICurrent {
  clouds: number;
  dew_point: number;
  dt: number;
  feels_like: number;
  humidity: number;
  pressure: number;
  sunrise: number;
  sunset: number;
  temp: number;
  uvi: number;
  visibility: number;
  weather: IWeather[];
  wind_deg: number;
  wind_speed: number;
}

export interface IFeelsLike {
  day: number;
  eve: number;
  morn: number;
  night: number;
}

export interface ITemp {
  day: number;
  eve: number;
  max: number;
  min: number;
  morn: number;
  night: number;
}

export interface IDaily {
  clouds: number;
  dew_point: number;
  dt: number;
  feels_like: IFeelsLike;
  humidity: number;
  moon_phase: number;
  moonrise: number;
  moonset: number;
  pop: number;
  pressure: number;
  summary: string;
  sunrise: number;
  sunset: number;
  temp: ITemp;
  uvi: number;
  weather: IWeather[];
  wind_deg: number;
  wind_gust: number;
  wind_speed: number;
}

export interface IHourly {
  clouds: number;
  dew_point: number;
  dt: number;
  feels_like: number;
  humidity: number;
  pop: number;
  pressure: number;
  temp: number;
  uvi: number;
  visibility: number;
  weather: IWeather[];
  wind_deg: number;
  wind_gust: number;
  wind_speed: number;
}

export interface IMinutely {
  dt: number;
  precipitation: number;
}

export interface IWeatherData {
  alerts: IAlert[];
  current: ICurrent;
  daily: IDaily[];
  hourly: IHourly[];
  lat: number;
  lon: number;
  minutely: IMinutely[];
  timezone: string;
  timezone_offset: number;
}

export interface IWeatherCard {
  id: number;
  name: string;
  rightContent: React.ReactNode;
  leftContent: React.ReactNode;
}
