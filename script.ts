//Warning make sure you are editing the ts file and not the js file

var legalAge = 18;

function onWaifuSearch() : void {
	let input : string = (<HTMLInputElement>document.getElementById("waifu-search")).value;
	let output : HTMLElement = document.getElementById("output");
	let request : XMLHttpRequest = new XMLHttpRequest();
	request.open("GET", "https://raw.githubusercontent.com/yourWaifu/is-this-waifu-legal/master/waifus/" + input + ".json");
	request.responseType = "json";
	request.onerror = function(event) {
		console.log(event);
		output.innerHTML = "Something went wrong. Look at console for more info";
	};
	request.onload = function() {
		switch(this.status) {
		case 200: //OK
			break;
		case 404:
			output.innerHTML = 
				"Could not find this person. Sorry.\n"
				"Maybe you spelled her name wrong.\n"
				"If you know her age, "
				"<a href=\"https://github.com/yourWaifu/is-this-waifu-legal#How-to-add-a-waifu-to-the-list\">"
					"please add her"
				"</a>.";
			return;
		default:
			output.innerHTML = "Error " + this.status.toString();
			return;
		}
		let data : JSON = this.response;
		let newHTML : string = "";
		newHTML += "<h1>"
		newHTML += data["english-name"];
		newHTML += "</h1>/n"
		
		// Calculate age
		if (data.hasOwnProperty("year") && data["year"] !== null) {
			let currentDate : Date = new Date();
			let age : number = currentDate.getFullYear() - data["year"];
			//take into count the month
			if (data.hasOwnProperty("month") && data["month"] !== null) {
				let month : number = data["month"];
				let currentMonth : number = currentDate.getMonth();
				if (
					(
						currentMonth < month
					) || (
						//take into count the day
						currentMonth === month &&
						data.hasOwnProperty("day") &&
						data["day"] !== null &&
						currentDate.getDay() < data["day"]
					)
				) {
					--age;
				}
			}
			newHTML += "age: ";
			newHTML += age.toString();
			newHTML += " years old\n"
			if (legalAge < age) {
				newHTML += "Looks legal to me.\n"
			} else {
				newHTML += "Not legal\n"
				"Wait "
				newHTML += legalAge - age;
				newHTML += " more years."
			}
		} else {
			newHTML += "Year of birth is unknown. Sorry."
		}
		output.innerHTML = newHTML;
	}
	request.send();
}