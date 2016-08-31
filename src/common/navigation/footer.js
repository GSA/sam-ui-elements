var Footer;

Footer = {
    Footer: function(config) {

      //set site root for pathing, default to transition.sam.gov
      var SITE_ROOT = (config.site_root) ? config.site_root : 'https://transition.sam.gov';

	  var html =  	`<section id="iae-footer">
					<footer>
						<div class="usa-grid usa-footer-return-to-top"><a href="#">Return to top</a></div>
						<nav class="iae-footer">
							<div class="iae-footer-body usa-grid">
								<div class="iae-footer-logo usa-width-one-sixth"><a class="image-wrap" href="http://gsa.gov" target="_blank"><img alt="GSAlogo" src="${SITE_ROOT}/assets/img/logo-gsa.png"></a></div>
								<ul class="iae-footer-links usa-unstyled-list usa-width-five-sixths">
									<li class=" usa-width-one-fourth">
										<h4 class="m_T-0 iae-footer-head">About</h4>
										<ul class="iae-footer-links usa-unstyled-list">
											<li class="m_B"><a href="${SITE_ROOT}/about/" title="What Is This Site?">What Is This Site?</a></li>
											<li class="m_B"><a href="${SITE_ROOT}/transition-roadmap/" title="Transition Timeline">Transition Timeline</a></li>
											<li class="m_B"><a href="https://interact.gsa.gov/group/integrated-award-environment-iae-industry-community" target="_blank" title="Join our Interact Community">Join our Interact Community</a></li>
											<li class="m_B"><a href="${SITE_ROOT}/for-developers/" title="For Developers">For Developers</a></li>
										</ul>
									</li>
									<li class=" usa-width-one-fourth">
										<h4 class="m_T-0 iae-footer-head">Partners</h4>
										<ul class="iae-footer-links usa-unstyled-list">
											<li class="m_B"><a href="https://www.acquisition.gov/" target="_blank" title="Acquisition.gov">Acquisition.gov</a></li>
											<li class="m_B"><a href="https://www.usaspending.gov/Pages/Default.aspx" target="_blank" title="USASpending.gov">USASpending.gov</a></li>
											<li class="m_B"><a href="http://www.grants.gov/" target="_blank" title="Grants.gov">Grants.gov</a></li>
										</ul>
									</li>
									<li class=" usa-width-one-fourth">
										<h4 class="m_T-0 iae-footer-head">System Information</h4>
										<ul class="iae-footer-links usa-unstyled-list">
											<li class="m_B"><a href="${SITE_ROOT}/legal/" title="Legal">Legal</a></li>
											<li class="m_B"><a href="${SITE_ROOT}/accessibility/" title="Accessibility">Accessibility</a></li>
											<li class="m_B"><a href="${SITE_ROOT}/alerts-archive/" target="_blank" title="Alerts Archive">Alerts Archive</a></li>
											<li class="m_B"><a href="${SITE_ROOT}/release-notes/" title="Release Notes">Release Notes</a></li>
										</ul>
									</li>
									<li class=" usa-width-one-fourth">
										<h4 class="m_T-0 iae-footer-head">Let Us Help You</h4>
										<ul class="iae-footer-links usa-unstyled-list">
											<li class="m_B"><a href="${SITE_ROOT}/faqs/" title="Help Center">Help Center</a></li>
											<li class="m_B"><a href="mailto:IAEOutreach@gsa.gov" title="Email Us">Email Us</a></li>
											<li class="m_B"><a href="https://fsd.gov/fsd-gov/loginchat.do" target="_blank" title="Web Chat (M–F 8AM - 6PM ET)">Web Chat (M–F 8AM - 6PM ET)</a></li>
											<li class="m_B"><a href="https://fsd.gov/fsd-gov/login.do" target="_blank" title="Contact Federal Service Desk">Contact Federal Service Desk</a></li>
										</ul>
									</li>
								</ul>
							</div>
						</nav>
					</footer>
				</section>`;

      return html;
    }
};

module.exports = Footer;
