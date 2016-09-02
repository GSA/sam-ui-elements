'use strict';
var expect = require('chai').expect;
var navigation = require('../../../src/common/navigation');

describe('header', function() {
    it('should exist', function() {
        expect(navigation.header).to.not.be.undefined;
    });
});

describe('header', function() {
    it('returns a string', function() {

    const SITE_ROOT = 'http://test.sam.gov';
    const ENV_ROOT =  'http://test.comp.micropaas.io';

    var expected = `<section id="iae-header"><header class="usa-grid">
						<div class="iae-header-menu">
						<div class="iae-header-nav">
							<a href=""><i class="fa fa-bars"><span class="usa-sr-only">Menu</span></i></a>
							<span class="m_T-1x">MENU</span>
						</div>
						<div class="iae-header-logo">
							<a href="#"><img alt="Transtion SAM.gov Logo" src="http://test.sam.gov/assets/img/transition-sam-logo.png"></a>
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
                  <li><a href="http://test.comp.micropaas.io/my-details/">Personal Details</a></li>
                  <li><a href="http://test.comp.micropaas.io/password/">Password Reset</a></li>
                  <li><a href="http://test.comp.micropaas.io/my-access">My Access</a></li>
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
							<a class="forgot-password" href="http://test.comp.micropaas.io/password/">Forgot?</a>
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

        var actual = navigation.header.render({site_root: SITE_ROOT, env_root: ENV_ROOT});

        expect(actual).to.eql(expected);
    });
});
