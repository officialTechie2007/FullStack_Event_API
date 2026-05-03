def send_email(to_email, otp):
    import smtplib

    server = smtplib.SMTP("smtp.gmail.com", 587)
    server.starttls()
    sender_email="anandasirofficial@gmail.com" #sender
    to_email="softanandasir@gmail.com" #receiver
    #server.login(sender_email,"sender app password")
    server.login(sender_email, "kpuypyifpnmoxogt")

    message = f"Subject: OTP Verification\n\nYour OTP is {otp}"

    server.sendmail(sender_email, to_email, message)

    server.quit()
    send_email(to_email,"123456")
