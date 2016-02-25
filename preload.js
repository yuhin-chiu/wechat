// var ipc = require('ipc')
var clipboard = require('clipboard')
var NativeImage = require('native-image')
var _ = require('lodash')

window._console = window.console

function debug(/*args*/){
	var args = JSON.stringify(_.toArray(arguments))
	_console.log(args)
}


var free = true
	init()

function init(){
	var checkForQrcode = setInterval(function(){
		var qrimg = document.querySelector('.qrcode img')
		if (qrimg && qrimg.src.match(/\/qrcode/)) {
			debug('二维码', qrimg.src)
			clearInterval(checkForQrcode)
		}
	}, 100)
	var checkForLogin = setInterval(function(){
		var chat_item = document.querySelector('.chat_item')
		if (chat_item) {
			onLogin()
			clearInterval(checkForLogin)
		}
	}, 500)
}

function onLogin(){
	$('.chat_item')[0].click()

	var oldContent = ''
	var oldNickname = ''
	var checkForThisWindow = setInterval(function() {//只处理群聊
		var $content_last = $([
			'.message:not(.me) .js_message_plain',
			'.message_system:not(.ng-scope) .content'
		].join(', ')).last()
		var $content_text = $content_last.html() //最后一条消息内容，根据内容是否改变来判断是否有人发消息
		var $content_message = $content_last.closest('.message') //找上层.meaasge,
		var $content_nickname = $content_message.find('.nickname').text() //获取发信人
		if(oldContent !== $content_text || oldNickname !== $content_nickname) {
			oldContent = $content_text
			oldNickname = $content_nickname
			onDialogChange()
		}
	}, 1000)
}
function onDialogChange($content_last) {
		setTimeout(function(){
		var reply = {}

		var $msg = $([
			'.message:not(.me) .bubble_cont > div',
			'.message_system'
		].join(', ')).last()
		var $message = $msg.closest('.message')
		var $nickname = $message.find('.nickname')
		var $titlename = $('.title_name')

		if ($nickname.length) { // 群聊
			var from = $nickname.text()
			var room = $titlename.text()
		} else { // 单聊
			var from = $titlename.text()
			var room = null
		}
		debug('来自', from, room)

		if ($msg.is('.message_system')) {
			debug('system', $msg.find('.content').text())
			var ctn = $msg.find('.content').text()
			var arr = null;
			if (ctn.match(/(.+)红包(.+)/)) {
				reply.text = '有孙子发红包啦~大家快来抢啊！'
			} else if ((arr = (/(.+)邀请(.+)加入了群聊/).exec(ctn)) !== null) {
				reply.text = '欢迎神经病 '+ arr[2] +' 加入'
					// '1) 发新人红包，不限多少, 主要是跟大家打个招呼\n' +
					// '2) 自我介绍，籍贯，学校，经历，工作领域等等\n' +
					// '3) 实名 ＋ 公司 或 实名 ＋ 职业，参考群里其它同学昵称\n' +
			// } else if (ctn.match(/(.+)撤回了一条消息/)) {
			// 	reply.text = '撤你妹'
			// } else if (ctn === '位置共享已经结束') {
			// 	reply.text = '位置共享已经结束'
			// } else if (ctn === '实时对讲已经结束') {
			// 	reply.text = '实时对讲已经结束'
			} else {
				// 无视
			}
		} else if ($msg.is('.plain')) {
			var text = ''
			var $text = $msg.find('.js_message_plain')
			$text.contents().each(function(i, node){
				if (node.nodeType === Node.TEXT_NODE) {
					text += node.nodeValue
				} else if (node.nodeType === Node.ELEMENT_NODE) {
					var $el = $(node)
					if ($el.is('br')) text += '\n'
					else if ($el.is('.qqemoji, .emoji')) {
						text += $el.attr('text').replace(/_web$/, '')
					}
				}
			})

			debug('接收', 'text', text)

			if(text.match(/(.*)@阿凸 (.*)/)){
				text = text.replace('@阿凸 ', '');
				text = (text === '')? '爷爷在此！': text
					reply.text = ('@' + from + ' ' + text)
			} else if(text.match(/(.*)@阿凸(.*)/)){
				text = text.replace('@阿凸', '');
				text = (text === '')? '叫你爹干嘛？': text
					reply.text = ('@' + from + ' ' + text)
			} else {
			}
		}
		debug('回复', reply)

		angular.element('#editArea').scope().editAreaCtn = reply.text


			$('.btn_send')[0].click()

		}, 100)
}
