var header;

header = {
    render: function(config) {
		/* The onclick line of code below needs to be added to the body element to close the user-dropdown box. */
		/* This is a work around in the absence of a tooltip library been provided for R7 */
		/* onclick="hideLogin('user-dropdown')" */

    //set site root for pathing, default to transition.sam.gov
    var SITE_ROOT = (config.site_root) ? config.site_root : 'https://transition.sam.gov';
    var ENV_ROOT = (config.env_root) ? config.env_root : 'http://clp-unified.comp.micropaas.io';

    /* Other required config properties that need to be added once a clear plan is set for the
    authentication code integration: "auth_api_key", "auth_url", "auth_cookie"
    */
    var AUTH_API_KEY = (config.auth_api_key) ? config.auth_api_key : 'rkkGBk7AU8UQs9LHT6rM0rFkg3A3rGaiBntKSGEC';

    //NOTE: the default endpoint does not currently exists
    // The format is: https://csp-api.sam.gov/{ENV}/IdentityandAccess/v3/auth/session/
    // where ENV is: COMP, MINC, PRODLIKE
    // assuming PROD will be the production value
    var AUTH_URL = (config.auth_url) ? config.auth_url : 'https://csp-api.sam.gov/prod/IdentityandAccess/v3/auth/session/';
    var AUTH_COOKIE = (config.auth_cookie) ? config.auth_cookie : 'iPlanetDirectoryPro';

    var html =  `<section id="iae-header"><header class="usa-grid">
						<div class="iae-header-menu">
						<div class="iae-header-nav">
							<a href=""><i class="fa fa-bars"><span class="usa-sr-only">Menu</span></i></a>
							<span class="m_T-1x">MENU</span>
						</div>
						<div class="iae-header-logo">
							<a href="#"><img alt="Transtion SAM.gov Logo" src="${SITE_ROOT}/assets/img/transition-sam-logo.png"></a>
						</div>
					</div>
					<div class="iae-sign-in">
						<a href=""><i class="fa fa-search"><span class="usa-sr-only">Search</span></i></a>
						<a href=""><i class="fa fa-bell"><span class="usa-sr-only">Notifications</span></i></a>
						<div id="iae-user-off">
							<ul class="usa-unstyled-list">
								<li class="pull-right m_L-3x">Create Account</li>
								<li class="pull-right">|</li>
								<li class="pull-right m_R-3x" id="iae-login" onclick="showLogin('iae-header-login')">Sign in</li>
							</ul>
						</div>
						<div id="iae-user-on" onclick="showLogin('user-dropdown')">
							<div class="pull-right m_R-3x">
								<i class="fa fa-user m_R-2x"><span class="usa-sr-only">User</span></i>
								<span id="user-greeting">Hello</span>
								<i class="fa fa-caret-down m_L-1x"><span class="usa-sr-only">Settings Dropdown</span></i>
							</div>
							<div class="iae-user-dropdown" id="user-dropdown">
								<ul class="usa-unstyled-list">
                  <li><a href="${ENV_ROOT}/my-details/">Personal Details</a></li>
                  <li><a href="${ENV_ROOT}/password/">Password Reset</a></li>
                  <li><a href="${ENV_ROOT}/my-access">My Access</a></li>
								</ul>
							</div>
						</div>
					</div>
					<!--nav> This will hold the dropdown nav menu once a UI is finalized </nav-->
				</header>
				</section>
				<section id="iae-header-login" class="iae-login">
				<i class="fa fa-chevron-right" onclick="hideLogin('iae-header-login')"></i>
				<div id="iae-pswd-login">
					<h3>Sign In</h3>
					<p>Your transition.SAM.gov account gives you access to detailed records and data.</p>
					<hr />
					<h4>Sign in with email</h4>
					<form id="form_login">
						<div class="login-field">
							<label class="m_T-2x" for="auth_email" id="auth_email_label">Email Address<span class="sr-only"> Required</span></label>
							<i class="fa fa-user"></i>
							<input type="text" id="auth_email" value="" name="username" />
							<span class="sr-only"> Required</span>
						</div>
						<div class="login-field">
							<label id="auth_password_label" for="auth_password" class="m_T-2x">Password<span class="sr-only"> Required</span></label>
							<i class="fa fa-lock"></i>
							<input type="password" id="auth_password" value="" name="password" />
							<a class="forgot-password" href="${ENV_ROOT}/password/">Forgot?</a>
							<span class="sr-only"> Password</span>
						</div>
						<input type="submit" value="Next" />
					</form>
					<hr />
					<!-- The CAC/PIV is not implemented as part of this release, the following text is a placeholder. -->
					<h4>Sign in with CAC/PIV</h4>
					<p>Available soon - fast and easy sign in with your card. <i class="fa fa-info-circle tooltip"><span class="tooltiptext">Sorry this feature is not available yet.</span></i></p>
				</div>
				<div id="iae-otp-login">
					<form id="form_otp">
						<h3>Your access code has been sent</h3>
						<p>For your security we verify who you are. Check your email and enter the code below to sign in.</p>
						<div>
							<input type="hidden" id="authId" />
							<input type="hidden" id="stage" />
							<label id="auth_password_label" for="auth_otp_password" class="m_T-2x">Access code <i class="fa fa-info-circle m_L-1x"></i><span class="sr-only"> Required</span></label>
							<input type="password" id="auth_otp_password" value="" name="otp-password">
							<span class="sr-only"> One Time Access Code</span>
						</div>
						<div><i class="fa fa-envelope m_R-1x"></i> Resend Email</div>
						<input type="submit" value="Sign In" />
					</form>
				</div>
				</section>`;

    	return html;
    }
};

/* Authentication Code and Supporting functions */

/*document.addEventListener("DOMContentLoaded", function() {

	var form_login = document.getElementById('form_login');

	if (form_login) {
		form_login.onsubmit = function() { return onLoginSubmit(); }
	}

	var form_otp = document.getElementById('form_otp');

	if (form_otp) {
		form_otp.onsubmit = function() { return onOTPSubmit(); }
	}

	window.addEventListener("userLoggedIn", onUserLoggedIn);
});

function showLogin(target) {
	event.stopPropagation();
	document.getElementById(target).style.display = 'block';
}

function hideLogin(target) {
	document.getElementById(target).style.display = 'none';
}

function onLoginSubmit() {

	var username = document.getElementById('auth_email');
	var password = document.getElementById('auth_password');

	var xhr = new XMLHttpRequest();

	var jsonData= JSON.stringify({
		username: username.value,
		password: password.value,
		service: "LDAPandHOTP"
	});

	xhr.open('POST', 'https://csp-api.sam.gov/comp/IdentityandAccess/v3/auth/session/?api_key=rkkGBk7AU8UQs9LHT6rM0rFkg3A3rGaiBntKSGEC', true);
	xhr.setRequestHeader('Content-Type', 'application/json');
	xhr.send(jsonData);

	xhr.onload = function() {
		if (xhr.status == 200) {
			console.log(xhr.responseText);

			if (xhr.responseText) {
				var data = JSON.parse(xhr.responseText);

				if (data["authnResponse"]) {
					var authObject = data["authnResponse"];
					showOTP(authObject["authId"], authObject["stage"]);
				}
			}

		}
	};

	return false;
}

function showOTP(authId, stage) {

  hideLogin('iae-pswd-login');
  showLogin('iae-otp-login');

	console.log(`${authId} - ${stage}`, authId, stage);

	document.getElementById("authId").value = authId;
	document.getElementById("stage").value = stage;
}

function onOTPSubmit() {

	var otp = document.getElementById('auth_otp_password');
	var authId = document.getElementById("authId");
	var stage = document.getElementById("stage");

	var xhr = new XMLHttpRequest();

	var jsonData = JSON.stringify({
			service: "LDAPandHOTP",
			stage: stage.value,
			otp: otp.value,
			authId: authId.value
		});

	xhr.open('POST', 'https://csp-api.sam.gov/comp/IdentityandAccess/v3/auth/session/?api_key=rkkGBk7AU8UQs9LHT6rM0rFkg3A3rGaiBntKSGEC', true);
	xhr.setRequestHeader('Content-Type', 'application/json');
	xhr.send(jsonData);

	xhr.onload = function() {
		if (xhr.status == 200) {
			console.log(xhr.responseText);

			if (xhr.responseText) {
				var data = JSON.parse(xhr.responseText);

				if (data["authnResponse"]) {
					var authObject = data["authnResponse"];

					if (authObject["tokenId"]) {
						document.cookie = (`iPlanetDirectoryPro=${authObject["tokenId"]}; path=/`);
						var event = new Event('userLoggedIn');
						window.dispatchEvent(event);
            hideLogin('iae-header-login');
					}
				}
			}

		}
	};

	return false;
}

function onUserLoggedIn() {

	var cookie = window.getCookie('iPlanetDirectoryPro');

	var xhr = new XMLHttpRequest();

	xhr.open('GET', 'https://csp-api.sam.gov/comp/IdentityandAccess/v3/auth/session/?api_key=rkkGBk7AU8UQs9LHT6rM0rFkg3A3rGaiBntKSGEC', true);
	xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.setRequestHeader('iPlanetDirectoryPro', cookie);
	xhr.send();
	xhr.onload = function() {
		if (xhr.status == 200) {

			if (xhr.responseText) {
        console.log(xhr.responseText);

				showLogin('iae-user-on');
				hideLogin('iae-user-off');
				var data = JSON.parse(xhr.responseText);

				var user_greeting = document.getElementById('user-greeting');
				user_greeting.textContent = `Hello, ${data.sessionToken.uid}`;
			}

		}
	};
}

function signOut() {
	var cookie = window.getCookie('iPlanetDirectoryPro');

	var xhr = new XMLHttpRequest();

	xhr.open('DELETE', 'https://csp-api.sam.gov/comp/IdentityandAccess/v3/auth/session/?api_key=rkkGBk7AU8UQs9LHT6rM0rFkg3A3rGaiBntKSGEC', true);
	xhr.setRequestHeader('Content-Type', 'application/json');
	xhr.setRequestHeader('iPlanetDirectoryPro', cookie);
	xhr.send();
	xhr.onload = function() {
		if (xhr.status == 200) {

			if (xhr.responseText) {
				console.log(xhr.responseText);
				window.location.reload(true);
			}
		}
	};

	//reset cookie for the past
	document.cookie = (`iPlanetDirectoryPro=${cookie}; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`);
}

window.getCookie = function(name) {
  match = document.cookie.match(new RegExp(name + '=([^;]+)'));
  if (match) return match[1];
}*/


module.exports = header;
