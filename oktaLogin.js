Cypress.Commands.add('oktaLogin', () => {
  const optionsStateToken = {
    method: 'POST',
    url: Cypress.env('state_token_url'),
    body: {
      username: Cypress.env('username'),
      password: Cypress.env('password'),
      options: {
        warnBeforePasswordExpired: 'true',
        multiOptionalFactorEnroll: 'true'
      }
    }
  }

  cy.request(optionsStateToken).then(response => {
    const stateToken = response.body.stateToken;

    const optionsSessionToken = {

      method: 'POST',
      url: Cypress.env('verify_url'),
      headers:{
        orgin:Cypress.env('baseUrl')
      },
      body: {
        answer: Cypress.env('securityAnswer'),
        stateToken: stateToken
      }
    }
    
    cy.request(optionsSessionToken).then(response =>{
      
      const sessionToken = response.body.sessionToken;
      const qs = {
        token: sessionToken,
        redirectUrl: Cypress.env('redirect_uri'),
        // client_id: Cypress.env('client_id'),
        // code_challenge: Cypress.env('code_challenge'),
        // state: Cypress.env('state'),
        // state: stateToken,
        // nonce: Cypress.env('nonce'),
        // code_challenge_method: 'S256',
        // response_mode: 'fragment',
        // response_type: 'code',
        // scope: ['openid', 'profile', 'email'],
      }

      cy.request({
        method: 'GET',
        url: Cypress.env('auth_token_url'),
        checkAccountSetupComplete: 'true',
        form: true,
        followRedirect: false,
        qs: qs
      }).then(responseWithToken => {
        
        // const redirectUrl = responseWithToken.redirectedToUrl;

        // const accessToken = redirectUrl
        //   .substring(redirectUrl.indexOf('access_token'))
        //   .split('=')[1]
        //   .split('&')[0];

        //   cy.wrap(accessToken).as('accessToken');
          cy.visit('/');
       
      });
    })
  });
})