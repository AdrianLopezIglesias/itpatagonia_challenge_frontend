import { Component, OnInit } from '@angular/core';
import { webSocket } from "rxjs/webSocket";
import { map } from 'rxjs/operators';
import { isString } from 'util';

let url: string
let env = "TO_HEROKU" //SERVER_LOCAL, TO_HEROKU, FROM_HEROKU

if (env == "FROM_HEROKU") {
	url = window.location.href.replace("https://", "");
url = url.replace("/", "");
url = "wss://" + url
}
if (env == "SERVER_LOCAL") {
	url = "ws://localhost:3500";
}
if (env == "TO_HEROKU") {
	url = "wss://damp-basin-32272.herokuapp.com/";
}
const subject = webSocket({
	url: url,
	deserializer: data => data
});





@Component({
	selector: 'weather-widget',
	template: `
	<div class="container">
	
	<br/>
	<select (change)="changeCurrentCity($event.target.value)" class="form-control">
		<option *ngFor="let city of static_cities" [value]="city">
			{{city}}
		</option>
	</select>
	<br/>
	<div class="container-fluid">
	<p>{{weather.weather[0].main}} <img src="/{{weather.weather[0].icon}}"></p>
	<table class="table">
	<tbody>
	<tr>
	<td>País</td>
	<td>{{weather.country}}</td>
	</tr>
	<tr>
	<td>Hora actual</td>
	<td>{{getTime(weather.timezone)}}</td>
	</tr>
	<tr>
	<td>Temperatura actual</td>
	<td>{{weather.main.temp}}</td>
	</tr>
	<tr>
	<td>Sensación térmica</td>
	<td>{{weather.main.feels_like}}</td>
	</tr>
	<tr>
	<td>Temperatura mínima</td>
	<td>{{weather.main.temp_min}}</td>
	</tr>
	<tr>
	<td>Temperatura máxima</td>
	<td>{{weather.main.temp_max}}</td>
	</tr>
	<tr>
	<td>Presión atmosférica</td>
	<td>{{weather.main.pressure}}</td>
	</tr>
	<tr>
	<td>Humedad</td>
	<td>{{weather.main.humidity}}</td>
	</tr>
	<tr>
	<td>Visibilidad</td>
	<td>{{weather.visibility}}</td>
	</tr>
	<tr>
	<td>Viento (dirección) </td>
	<td>{{weather.wind.deg}}</td>
	</tr>
	<tr>
	<td>Viento (velocidad)</td>
	<td>{{weather.wind.speed}}</td>
	</tr>
	</tbody>
	</table>
	</div>
	</div>
	`,
	providers: []
})
export class WeatherWidgetComponent implements OnInit {
	constructor() { 
	}
	weather = {
		name: 'Esperando datos del servidor',
		country: 'Esperando datos del servidor',
		timezone: 'Esperando datos del servidor',
		weather: [{ main: 'Esperando datos del servidor', icon: "assets/10d.png" }],
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
	static_cities = ['Buenos Aires F.D.', 'Santa Fe', 'San Miguel de Tucumán', 'Río Negro Province', 'Cordova', 'Berlin', 'Miami', 'New York']
	current_city = 'Buenos Aires F.D.'
	started = 0


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
		console.log("changeCurrentCity")
		this.current_city = city
		let datax = this.cities.filter(x => {
			return x.name == this.current_city
		})
		let data = datax[0]
		this.weather = {
			name: data.name,
			country: data.sys.country,
			timezone: data.timezone,
			weather: [{
				main: data.weather[0].description,
				icon: "assets/"+data.weather[0].icon + ".png"
			}],
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
	
	getTime(time) {
		if (isString(time)) {
			return time
		}
	var d = new Date((new Date().getTime())+time*1000)
	return		d.toUTCString()
	}

	setWeather(data) {
		data = (JSON.parse(data))
    console.log("🚀 ~ file: weather-widget.component.ts ~ line 109 ~ WeatherWidgetComponent ~ setWeather ~ data", data)
		this.cities = (data)
		if (this.started == 0) {
			this.changeCurrentCity('Buenos Aires F.D.')
			this.started = 1
		}
	}

}
