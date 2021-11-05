import { Component, OnInit } from '@angular/core';
import { webSocket } from "rxjs/webSocket";
import { map } from 'rxjs/operators';

let url: string
let env = "FROM_HEROKU" //SERVER_LOCAL, TO_HEROKU, FROM_HEROKU

if (env == "FROM_HEROKU") {
	url = window.location.href.replace("https://", "")
	url = url.replace("/", "")
}

if (env == "SERVER_LOCAL") {
	url = "localhost:3500"
}
if (env == "TO_HEROKU") {
	url = "wss://damp-basin-32272.herokuapp.com/"
}
const subject = webSocket({
	url: "ws://"+ url,
	deserializer: data => data
});





@Component({
	selector: 'weather-widget',
	template: `
	<select (change)="changeCurrentCity($event.target.value)">
		<option *ngFor="let city of static_cities" [value]="city">
			{{city}}
		</option>
	</select>

		<p>El clima en 								 {{weather.name}}</p>
		<p>{{weather.weather[0].main}}</p>
		<p>Temperatura							 : {{weather.main.temp}}</p>
		<p>Sensación   térmica       : {{weather.main.feels_like}}</p>
		<p>Temperatura mínima        : {{weather.main.temp_min}}</p>
		<p>Temperatura máxima        : {{weather.main.temp_max}}</p>
		<p>Presión     atmosferica   : {{weather.main.pressure}}</p>
		<p>Humedad    							 : {{weather.main.humidity}}</p>
		<p>Visibilidad 							 : {{weather.visibility}}</p>
		<p>Viento dirección					 : {{weather.wind.deg}}</p>
		<p>Viento velocidad					 : {{weather.wind.speed}}</p>
	`,
	providers: []
})
export class WeatherWidgetComponent implements OnInit {
	constructor() { 
	}
	weather = {
		name: 'Esperando datos del servidor',
		weather: [{ main: 'Esperando datos del servidor' }],
		main: {
			temp: 'Esperando datos del servidor',
			feels_like: 'Esperando datos del servidor',
			temp_min: 'Esperando datos del servidor',
			temp_max: 'Esperando datos del servidor',
			pressure: 'Esperando datos del servidor',
			humidity: 'Esperando datos del servidor',
		},
		visibility: 'Esperando datos del servidor',
		wind: {
			deg: 'Esperando datos del servidor',
			speed: 'Esperando datos del servidor'
		}
	}
	cities = []
	static_cities = ['Buenos Aires F.D.', 'Santa Fe', 'San Miguel de Tucumán', 'Río Negro Province', 'Cordova']
	current_city = 'Buenos Aires F.D.'



	ngOnInit(): void {
		subject.subscribe(
			(data) => this.setWeather((data.data)),
			(err) => console.log(err),
			() => console.log('complete')
		);
		let message = { op: 'Start' } as unknown as MessageEvent<any>
		subject.next(message);
	}

	changeCurrentCity(city) {
		let datax = this.cities.filter(x => {
			return x.name == city
		})
		let data = datax[0]
		this.weather = {
			name: data.name,
			weather: [{ main: data.weather[0].main +" "+ data.weather[0].description }],
			main: {
				temp: (data.main.temp) + 'º',
				feels_like: (data.main.feels_like) + 'º',
				temp_min: (data.main.temp_min) + 'º',
				temp_max: (data.main.temp_max) + 'º',
				pressure: data.main.pressure + " hPa",
				humidity: data.main.humidity + "%",
			},
			visibility: data.visibility + " km",
			wind: {
				deg: data.wind.deg + "º",
				speed: data.wind.speed + " kmh"
			}
		}
	 }

	setWeather(data) {
		// console.log("🚀 ~ file: weather-widget.component.ts ~ line 108 ~ WeatherWidgetComponent ~ setWeather ~ data", data)
		data = (JSON.parse(data))
    console.log("🚀 ~ file: weather-widget.component.ts ~ line 109 ~ WeatherWidgetComponent ~ setWeather ~ data", data)
		this.cities = (data)
		this.changeCurrentCity('Buenos Aires F.D.')
	}

}
