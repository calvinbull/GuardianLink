// Function to generate reset token
function passwordResetToken(username) {
    // builds a unique token based on the username, current time, and a random base-38 string
    const timestamp = Date.now();
    const randomString = Math.random().toString(36);
    const token = `${username}:${timestamp}:${randomString}`;

    return token;
}

module.exports = { passwordResetToken };