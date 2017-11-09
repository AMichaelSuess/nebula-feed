# Tests to Write

## Sign Up Users
* sign up new user: success
* sign up user w/o username: fail
* sign up user w/o password: fail
* sign up user w/o name: fail
* sign up user with password less than 8 chars: fail
* sign up user with existing email-address: fail
* sign up with an invalid email-address: fail
* click link to login-page from signup-page: success

## Log In Users
* log in existing user with correct pw: success
* log in existing user with wrong pw: fail
* log in with no username: fail
* log in with wrong username: fail
* click link to sign up-page: success

## Accessing content without Logging In
* try to access `/main`-view w/o logging in: fail
* try to access all protected API-paths w/o logging in: fail


## Log Out Users
* click `Log Out` in main view: success + login-screen shown

## Main-view
* check correct data are visible: success
* add rating for a user: success
* add rating for another user: success
* press `Reset` for first user: success
* add rating for a third user: success
* press `Submit`: success + rating disappears
* when logged in and accessing the root url: show main view
