import './assets/scss/app.scss';
import $ from 'cash-dom';
import 'es6-promise/auto';
import 'isomorphic-fetch';
import 'promise-polyfill';

class App {

  initializeApp() {
    $('.load-username').on('click', event => {
      let userName = $('.username.input').val();
      let url = `https://api.github.com/users/${this.userInput_validation(userName)}`;

      fetch(url)
        .then(response => {
          if (!response.ok) {
            return Promise.reject(response)
          } else {
            return response.json()
          }
        })
        .then(body => {
          this.profile = body;
          this.update_profile();
        }).then(() => {

          fetch(url +'/events/public')
            .then(response => response.json())
            .then(eventsList => {
              eventsList = eventsList.filter((elem) => {
                return elem.type.includes('PullRequest');
              })
              this.update_history(eventsList);
            }).catch((error) => {
              console.log(error);
              window.alert('Sorry! Dosen\'t available any PullRequest event.');
            })

        }).catch((error) => {
          console.log(error);
          window.alert('The user doesn\'t egzist!');
        })

    })

  }

  update_history(data) {
    console.log(data)
    Array.from($('.timeline-item')).forEach((elem, idx) => {
      $('.events-container .timeline-content .heading')
        .text(data[idx].created_at.slice(0,10) + ' ' + data[idx].created_at.slice(11,16));
      $('.events-container .gh-username img').attr('src', data[idx].actor.avatar_url);
      $('.events-container .gh-username a').attr('href', 'https://github.com/' + data[idx].actor.login).text(data[idx].actor.login);
      $('.events-container .content .action-type').text(data[idx].payload.pull_request.state); //OK
      $('.events-container .content > a').attr('href', data[idx].payload.pull_request.html_url);
      $('.events-container .content .repo-name > a').attr('href', data[idx].payload.pull_request.base.repo.html_url).text(data[idx].payload.pull_request.base.repo.full_name);
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

module.exports = {App};
