import { Component, OnInit } from '@angular/core';
import { webSocket } from "rxjs/webSocket";
import { map } from 'rxjs/operators';
const subject = webSocket({
	url: "ws://localhost:"+process.env.PORT,
	deserializer: data => data
});





@Component({
	selector: 'weather-widget',
	template: `
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



	ngOnInit(): void {
		

		subject.subscribe(
			(data) => this.setWeather(JSON.parse(data.data)),
			(err) => console.log(err),
			() => console.log('complete')
		);
		let message = { op: 'Start' } as unknown as MessageEvent<any>
		subject.next(message);
	}



	setWeather(data) {
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
		console.log(data);
	}

}
