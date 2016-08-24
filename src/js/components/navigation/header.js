var Header;

Header = {
    Header: function(config) {
		/* The onclick line of code below needs to be added to the body element to close the user-dropdown box. */
		/* This is a work around in the absence of a tooltip library been provided for R7 */
		/* onclick="hideLogin('user-dropdown')" */
		
    	var html =  '<section id="iae-header"><header><div class="iae-header">' +
			'<div class="usa-grid-full"><div class="iae-header-menu"><div class="iae-header-nav">' +
			'<i class="fa fa-bars"></i><div class="m_T-1x">MENU</div></div>' +
      		'<div class="iae-header-logo"><a href="#">' +
      		'<img alt="Transtion SAM.gov Logo" src="assets/img/transition-sam-logo.png"></a>' +
      		'</div></div><div class="iae-sign-in"><i class="fa fa-search"></i><i class="fa fa-bell"></i>' +
			'<div id="iae-user-off"><div class="pull-right m_L-3x">Create Account</div><div class="pull-right">|</div>' +
			'<div class="pull-right m_R-3x" id="iae-login" onclick="showLogin(\'iae-header-login\')">Sign in</div></div>' +
			'<div id="iae-user-on" onclick="showLogin(\'user-dropdown\')"><div class="pull-right m_R-3x">' +
			'<i class="fa fa-user m_R-2x"></i>Hi, Jane <i class="fa fa-caret-down m_L-1x"></i></div>' +
			'<div class="iae-user-dropdown" id="user-dropdown"><li><a href="#">Personal Details</a></li>' +
			'<li><a href="#">Password Reset</a></li><li><a href="#">My Access</a></li></div>' +
			'</div></div></div></div></header></section>' +
      		'<section id="iae-header-login"><i class="fa fa-chevron-right" onclick="hideLogin(\'iae-header-login\')"></i>' +
	    	'<div class="iae-login"><div id="iae-pswd-login"><h3>Sign In</h3>' +
			'<p>Your transition.SAM.gov account gives you access to detailed records and data.</p>' +
			'<hr /><h4>Sign in with email</h4><form id="form_login"><div class="login-field">' +
			'<label class="m_T-2x" for="auth_email" id="auth_email_label">Email Address<span class="sr-only"> Required</span></label>' +
			'<i class="fa fa-user"></i><input type="text" id="auth_email" value="" name="username" />' +
			'<span class="sr-only"> Required</span></div><div class="login-field">' +
			'<label id="auth_password_label" for="auth_password" class="m_T-2x">Password<span class="sr-only"> Required</span></label>' +
			'<i class="fa fa-lock"></i><input type="password" id="auth_password" value="" name="password" />' +
			'<a class="forgot-password" href="http://clp-unified.comp.micropaas.io/password/">Forgot?</a>' +
			'<span class="sr-only"> Password</span></div><input type="submit" value="Next" /></form><hr />' +
			'<!-- The CAC/PIV is not implemented as part of this release, the following text is a placeholder. -->' +
			'<h4>Sign in with CAC/PIV</h4>' +
			'<p>Available soon - fast and easy sign in with your card. <i class="fa fa-info-circle tooltip"><span class="tooltiptext">Sorry this feature is not available yet.</span></i></p></div><div id="iae-otp-login">' +
			'<form id="form_otp"><h3>Your access code has been sent</h3>' +
			'<p>For your security we verify who you are. Check your email and enter the code below to sign in.</p>' +
			'<div><input type="hidden" id="authId" /><input type="hidden" id="stage" />' +
			'<label id="auth_password_label" for="auth_otp_password" class="m_T-2x">Access code <i class="fa fa-info-circle m_L-1x"></i>' +
			'<span class="sr-only"> Required</span></label>' +
			'<input type="password" id="auth_otp_password" value="" name="otp-password">' +
			'<span class="sr-only"> One Time Access Code</span></div>' +
			'<div><i class="fa fa-envelope m_R-1x"></i> Resend Email</div>' +
			'<input type="submit" value="Sign In" /></form></div></div></section>';

    	return html;
    }
};

module.exports = Header;
