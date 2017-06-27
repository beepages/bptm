"use strict";

var express 		= require('express'), app = express();
var bodyParser 		= require('body-parser');
var fs 				= require('fs');

let themelist = [];

const PageItemCount = 10;

app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.enable('trust proxy');

app.use('/', express.static('public'));
app.use('/files', express.static('themes'));

app.get('/listfiles', function(req, res)
{
	if(req.query.theme === undefined) { res.status(404).send(""); return; }

	res.setHeader('Content-Type', 'application/json');

	var list = [];

	let mainPath = './themes/' + req.query.theme;
	function readFolder(path)
	{
		let items = fs.readdirSync(mainPath + path);

		items.forEach((item) =>
		{
			if(fs.statSync(mainPath + path + '/' + item).isDirectory())
			{
				readFolder(path + '/' + item + '/');
			} else
			{
				let dc = [ //files to ignore
					"preview-1.png",
				];
				if(~~dc.indexOf(path + item)) { return; }
				list.push(path + item);
			}
		});
 	}

	readFolder('');

	res.send(JSON.stringify({files: list}));
});


app.get('/themes', function(req, res)
{
	if(req.query.page === undefined) { res.status(404).send(""); return; }
	let out = {
		themes: [],
		previews: [],
	};
	//returns 10 themes
	for(let i = req.query.page * PageItemCount; i < req.query.page * PageItemCount + PageItemCount; i++)
	{
		if(i < themelist.length)
		{
			out.themes.push(themelist[i]);
			let pp = [
				themelist[i][0] + '/preview-1.png',
				themelist[i][0] + '/preview-2.png',
				themelist[i][0] + '/preview-3.png',
				themelist[i][0] + '/preview-4.png',
				themelist[i][0] + '/preview-5.png',
			];

			for(let j = 0; j < pp.length; j++)
			{
				if(fs.existsSync('./themes/' + pp[j]))
				{
					out.previews.push('/files/' + pp[j]);
				}
			}
		} else
		{
			break;
		}
	}

	res.send(JSON.stringify(out));
});

function loadThemeList()
{
	themelist = [];
	let data = fs.readFileSync("theme_list_data.txt", "utf-8");
	let lines = data.split("\n");
	for(let i = 0; i < lines.length; i++)
	{
		themelist.push(lines[i].split(" "));
	}
}

loadThemeList();
setInterval(loadThemeList, 5000); //updates theme list every five seconds

app.listen(/* 4000 */ 3000, function(){});