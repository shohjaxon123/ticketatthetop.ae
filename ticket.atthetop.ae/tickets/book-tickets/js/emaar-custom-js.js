var CLI_Cookie = {
	set: function (name, value, days) {
		var secure = "";
		// if (true === Boolean(Cli_Data.secure_cookies)) {
			secure = ";secure";
		// }
		if (days) {
			var date = new Date();
			date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
			var expires = "; expires=" + date.toGMTString();
		} else {
			var expires = "";
		}
		document.cookie = name + "=" + value + secure + expires + "; path=/";
		if (days < 1) {
			host_name = window.location.hostname;
			document.cookie = name + "=" + value + expires + "; path=/; domain=." + host_name + ";";
			if (host_name.indexOf("www") != 1) {
				var host_name_withoutwww = host_name.replace('www', '');
				document.cookie = name + "=" + value + secure + expires + "; path=/; domain=" + host_name_withoutwww + ";";
			}
			host_name = host_name.substring(host_name.lastIndexOf(".", host_name.lastIndexOf(".") - 1));
			document.cookie = name + "=" + value + secure + expires + "; path=/; domain=" + host_name + ";";
		}
	},
	read: function (name) {
		var nameEQ = name + "=";
		var ca = document.cookie.split(';');
		for (var i = 0; i < ca.length; i++) {
			var c = ca[i];
			while (c.charAt(0) == ' ') {
				c = c.substring(1, c.length);
			}
			if (c.indexOf(nameEQ) === 0) {
				return c.substring(nameEQ.length, c.length);
			}
		}
		return null;
	},
	erase: function (name) {
		this.set(name, "", -10);
	},
	exists: function (name) {
		return (this.read(name) !== null);
	},
	getallcookies: function () {
		var pairs = document.cookie.split(";");
		var cookieslist = {};
		for (var i = 0; i < pairs.length; i++) {
			var pair = pairs[i].split("=");
			cookieslist[(pair[0] + '').trim()] = decodeURI(pair[1]);
		}
		return cookieslist;
	}
}

if (!CLI_Cookie.exists('local_cart_id') || CLI_Cookie.read('local_cart_id').length < 20){

    var data = EncParams.lc_cart_id;

    CLI_Cookie.set('local_cart_id', data, 30);

}