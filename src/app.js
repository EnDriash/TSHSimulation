import './assets/scss/app.scss';
import $ from 'cash-dom';
import Promise from 'promise-polyfill';

require('es6-promise').polyfill();
require('isomorphic-fetch');

export class App {
  initializeApp() {

    $('.load-username').on('click', event => {
      let userName = $('.username.input').val();

      fetch('https://api.github.com/users/' + this.userInput_validation(userName))
        .then(response => response.json())
        .then(body => {
          this.profile = body;
          this.update_profile();
        })

    })

  }

  update_profile() {
    $('#profile-name').text($('.username.input').val())
    $('#profile-image').attr('src', this.profile.avatar_url)
    $('#profile-url').attr('href', this.profile.html_url).text(this.profile.login)
    $('#profile-bio').text(this.profile.bio || '(no information)')
  }

  userInput_validation(userName) {
    let reg = new RegExp('^([(a-z)|(0-9)|\-|\_])+$', 'i');

    if (reg.test(userName)) {
      $('.username.input').removeClass('unvalid');
      return userName;
    } else {
      $('.username.input').addClass('unvalid');
    }

  }
}
