var Header;

Header = {
    Header: function(config) {
    	var html =  '<section id="iae-header"><header><div class="iae-header"><div class="usa-grid">' +
				     '<div class="iae-header-menu"><div class="iae-header-nav"><i class="fa fa-bars"></i>' + 
					 '<div class="m_T-1x">MENU</div></div><div class="iae-header-logo"><a class="image-wrap" href="#">' +
					 '<img alt="Transtion SAM.gov Logo" src="assets/img/transition-sam-logo.png"></a></div></div>' +
				     '<div class="iae-sign-in"><i class="fa fa-search"></i><i class="fa fa-bell"></i>' +
					 '<div class="pull-right m_L-3x">Create Account</div><div class="pull-right">|</div>' +
					 '<div class="pull-right m_R-3x">Sign in</div></div></div></div></header></section>';
    	return html;
    }
};

module.exports = Header;
