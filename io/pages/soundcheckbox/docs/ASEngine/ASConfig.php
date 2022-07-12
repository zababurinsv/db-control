<?php

//Timezone
date_default_timezone_set('UTC');

//WEBSITE

define('WEBSITE_NAME', 'SoundCheckBox.com - Set Up Your Show');
define('WEBSITE_DOMAIN', 'http://localhost');

// It can be the same as domain (if script is placed on website's root folder)
// or it can contain path that include subfolders, if script is located in
//some subfolder and not in root folder.
define('SCRIPT_URL', 'http://localhost/');

//DATABASE CONFIGURATION
define('DB_HOST', 'localhost');
define('DB_TYPE', 'mysql');
define('DB_USER', 'root');
define('DB_PASS', 'root');
define('DB_NAME', 'flv_scb');

//SESSION CONFIGURATION
define('SESSION_SECURE', false);
define('SESSION_HTTP_ONLY', false);
define('SESSION_USE_ONLY_COOKIES', false);

//LOGIN CONFIGURATION
define('LOGIN_MAX_LOGIN_ATTEMPTS', 20);
define('LOGIN_FINGERPRINT', true);
define('SUCCESS_LOGIN_REDIRECT', serialize(array('default' => "riders.php")));

//PASSWORD CONFIGURATION
define('PASSWORD_ENCRYPTION', "bcrypt"); //available values: "sha512", "bcrypt"
define('PASSWORD_BCRYPT_COST', "13");
define('PASSWORD_SHA512_ITERATIONS', 25000);
define('PASSWORD_SALT', "oEXvtSWRH7w6kJNKzlMEJO"); //22 characters to be appended on first 7 characters that will be generated using PASSWORD_ info above
define('PASSWORD_RESET_KEY_LIFE', 60);

// REGISTRATION CONFIGURATION
define('MAIL_CONFIRMATION_REQUIRED', true);
define('REGISTER_CONFIRM', "http://localhost/confirm.php");
define('REGISTER_PASSWORD_RESET', "http://localhost/passwordreset.php");

// EMAIL SENDING CONFIGURATION
// Available MAILER options are 'mail' for php mail() and 'smtp' for using SMTP server for sending emails
define('MAILER', "mail");
define('SMTP_HOST', "mail.soundcheckbox.com");
define('SMTP_PORT', 25);
define('SMTP_USERNAME', "info@soundcheckbox.com");
define('SMTP_PASSWORD', "1qazxsw2EDC");
define('SMTP_ENCRYPTION', "");


define('MAIL_FROM_NAME', "SoundCheckBox.com - Set Up Your Show");
define('MAIL_FROM_EMAIL', "noreply@soundcheckbox.com");

// SOCIAL LOGIN CONFIGURATION

define('SOCIAL_CALLBACK_URI', "http://localhost/socialauth_callback.php");

// GOOGLE
define('GOOGLE_ENABLED', false);
define('GOOGLE_ID', "155355686506-paaagkluuub183nea0g13e0hs20g4ki5.apps.googleusercontent.com");
define('GOOGLE_SECRET', "-ivEH5zFGblbwPI_MJVqlVlf");

// FACEBOOK
define('FACEBOOK_ENABLED', false);
define('FACEBOOK_ID', "177926579501083");
define('FACEBOOK_SECRET', "a7f36ad63ce87fb73b300974ea7c4f37");

// TWITTER

// NOTE: Twitter api for authentication doesn't provide users email address!
// So, if you email address is strictly required for all users, consider disabling twitter login option.

define('TWITTER_ENABLED', false);
define('TWITTER_KEY', "");
define('TWITTER_SECRET', "");

// TRANSLATION
define('DEFAULT_LANGUAGE', 'en');
