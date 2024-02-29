import { Pipe, PipeTransform } from "@angular/core";
const { DateTime } = require("luxon");

@Pipe({
	name: "luxon",
})
export class LuxonPipe implements PipeTransform {

	public transform(value: any, args: string): any {
		try {
			if (value) {
				let date = DateTime(new Date(value).toISOString().substring(0, 10));
				if (args.includes("h:mm:ss"))
					date = DateTime(DateTime(new Date(value)).format("YYYY-MM-DDTHH:mm:ss"));

				if (date.isValid()) return date.format(args || "L");
				else return value;

			} else return value;
		} catch (error) {
			console.error(error);
		}
	}

}
