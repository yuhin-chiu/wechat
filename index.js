var BrowserWindow = require('browser-window')
var app = require('app')
var _ = require('lodash')
var fs = require('fs-extra')
var bytes = require('bytes')

function debug(/*args*/){
	var args = JSON.stringify(_.toArray(arguments))
	console.log(args)
}

var downloadDir = `${__dirname}/download`
fs.mkdirpSync(downloadDir)

app.on('ready', function(){

	// var win = new BrowserWindow({})
	// win.loadUrl('file://' + __dirname + '/index.html')

	var win = new BrowserWindow({
		width: 900,
		height: 610,
		'web-preferences': {
			'node-integration': false,
			preload: __dirname + '/preload.js'
		}
	})
	win.loadUrl('https://wx.qq.com/?lang=zh_CN&t=' + Date.now())
})
