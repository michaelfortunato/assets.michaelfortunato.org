const fs = require("fs");
const path = require('path')
const boxes = require("./About2Config");
let scrapedBoxes = {};

Object.entries(boxes).forEach(([group, boxes]) => {
	scrapedBoxes[group] = boxes.map(obj => {
		let scrapedObj = {};
		Object.entries(obj).forEach(([k, v]) => {
			if (k !== "title" && k !== "body") {
				scrapedObj[k] = v.toString().replace(/\t/g, "").replace(/\s/g, ",");
			}
		});
		return scrapedObj;
	});
});

fs.writeFile(
	"./About2ConfigScraped.json",
	JSON.stringify(scrapedBoxes, null, 2),
	{
		flags: "w",
		encoding: "utf-8"
	},
	function writeFileCb(error, data) {
		if (error) console.log(error);
		else console.log("Wrote to file");
	}
);

for (const [group, boxes] of Object.entries(scrapedBoxes)) {
	console.log(`working on group ${group}`);
	//Create directory if it doesn't exist
	!fs.existsSync(`./${group}`) && fs.mkdirSync(`./${group}`);
	for (const blurbMeta of boxes) {
		const writeStream = fs.createWriteStream(path.join(group, `${blurbMeta.key}.md`), {
			flags: "w",
			encoding: "utf-8"
		});
		// First things is write two new lines
		writeStream.write(`---\n`);
		// For each key in object write it on a new line
		for (const [key, value] of Object.entries(blurbMeta))
			writeStream.write(`${key}: ${value}\n`);
		writeStream.write("---\n\n");
		writeStream.close()
	}
}
