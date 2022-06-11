import StyledString from './StyledString.mjs'
import patchConsoleLog from './patchConsoleLog.mjs'
import compileTemplate from './compileTemplate.mjs'

patchConsoleLog();

let template = {
	default: [{
		default: [{
			0:"rgb(201,1,1)",
			1:"rgb(201,1,1)",
		},{
			0:"rgb(201,1,1)",
			1:"rgb(213,82,17)",
		},{
			0:"rgb(213,82,17)",
			1:"rgb(201,185,29)",
		},{
			0:"rgb(201,185,29)",
			1:"rgb(38,173,43)",
		},{
			0:"rgb(38,173,43)",
			1:"rgb(20,197,232)",
		},{
			0:"rgb(20,197,232)",
			1:"rgb(70,72,241)",
		},{
			0:"rgb(70,72,241)",
			1:"rgb(140,106,211)",
		},{
			0:"rgb(140,106,211)",
			1:"rgb(234,61,115)",
		},{
			0:"rgb(234,61,115)",
			1:"rgb(220,29,29)",
		},{
			0:"rgb(220,29,29)",
			1:"rgb(189,12,203)",
		},{
			0:"rgb(189,12,203)",
			1:"rgb(144,43,211)",
		},{
			0:"rgb(144,43,211)",
			1:"rgb(33,83,203)",
		},{
			0:"rgb(33,83,203)",
			1:"rgb(30,211,192)",
		},{
			0:"rgb(30,211,192)",
			1:"rgb(11,215,82)",
		},{
			0:"rgb(11,215,82)",
			1:"rgb(146,194,26)",
		},{
			0:"rgb(146,194,26)",
			1:"rgb(227,187,21)",
		},{
			0:"rgb(227,187,21)",
			1:"rgb(234,99,57)",
		},{
			0:"rgb(234,99,57)",
			1:"rgb(201,1,1)",
		}]
	}]
}

function colors (...args) {
	return new StyledString(args);
}
colors.define = compileTemplate.define;

let rgbs = {
	black: [0, 0, 0],
	red: [237, 80, 65],
	green: [102, 172, 92],
	yellow: [225, 178, 60],
	blue: [73, 148, 201],
	magenta: [127, 23, 53],
	cyan: [78, 181, 230],
	white: [255, 255, 255],
	gray: [124, 124, 124],
	grey: [124, 124, 124]
};

Object.keys(rgbs).forEach(key => {
	let rgb = rgbs[key];
	colors.define(`${key}BG`, `rgbBG(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`);
	colors.define(`${key}`, `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`);
});

let mapName = []
template.default[0].default.forEach((item, i) => {
	let pathColor = `pathColor${i}`
	let idColor = `idColor${i}`
	if(i >= 10) {
		pathColor = `pathColorA${i - 10}`
		idColor = `idColorA${i - 10}`
	}
	mapName.push({
		"0": pathColor,
		"1": idColor
	})
	colors.define(pathColor, `"style("color":"${item[0]}")"`);
	colors.define(idColor, `"style("color":"${item[1]}")"`);
})
colors.define('underline', 'style("text-decoration: underline")');
colors.define('bold', 'style("font-weight: bold")');
colors.define('italic', 'style("font-style: italic")');
colors.define('strikethrough', 'style("text-decoration: line-through")');
colors.define('dim', 'style("opacity: 0.75")');
colors.define('hidden', 'style("opacity: 0.00")');
colors.define('html', 'style("opacity: 0.00")');
colors.list = mapName
export default colors;
/*
let concept = {
	default: [{
		default: [{
			0:"rgb(201,1,1)",
			1:"rgb(39,94,7)",
		}]
	}]
}
*/
