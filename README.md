# GuardianLink  
Website project to connect volunteers and non-profit organizations.  
  
# INITIAL CONFIGURATION INSTRUCTIONS  
1. Self-signed HTTPS keys and certificate must be generated using openssl into /backend/security folder:  
    `openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout cert.key -out cert.pem -sha256`  
2. Create an .env file in the root folder containing the following variables (change defaults as needed):  
    SERVER_HOST=127.0.0.1  
    SERVER_PORT=3000  
    ADMIN_DEFAULT_PASS=  
    EMAIL_SERVICE=gmail  
    EMAIL_ACCOUNT=  
    **generated app password from https://myaccount.google.com/apppasswords**  
    EMAIL_APP_PASSWORD=  
    BCRYPT_SALT_ROUNDS=10  
3. Run server application from `GuardianLink/` folder with `npm start`.  