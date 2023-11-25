function sendEmail() {
    Email.send({
        Host: "smtp.elasticemail.com",
        Username: "fareskpro@gmail.com",
        Password: "186DC0D67B318E092A2FAABB2C6DD2EB110B",
        To: 'faresk1407@gmail.com',
        From: "fareskpro@gmail.com",
        Subject: "New Contact Form Enquiry",
        Body: "Name: " + document.getElementById("name").value
            + "<br> Email: " + document.getElementById("email").value
            + "<br> Subject: " + document.getElementById("subject").value
            + "<br> Message: " + document.getElementById("message").value
    }).then(
        message => document.querySelector(".reponse").innerHTML = "Message envoyé"
    );

}