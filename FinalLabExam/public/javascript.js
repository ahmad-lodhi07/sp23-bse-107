// JavaScript for form validation
function validateForm() {
    let valid = true;

    
    document.getElementById("nameError").innerText = "";
    document.getElementById("emailError").innerText = "";
    document.getElementById("cityError").innerText = "";
    document.getElementById("addressError").innerText = "";

   
    let name = document.getElementById("name").value;
    let email = document.getElementById("email").value;
    let city = document.getElementById("city").value;
    let address = document.getElementById("address").value;

    
    if (name === "") {
        document.getElementById("nameError").innerText = "Name is required.";
        valid = false;
    }

    
    let emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (email === "") {
        document.getElementById("emailError").innerText = "Email is required.";
        valid = false;
    } else if (!emailPattern.test(email)) {
        document.getElementById("emailError").innerText = "Please enter a valid email.";
        valid = false;
    }

    
    if (city === "") {
        document.getElementById("cityError").innerText = "City is required.";
        valid = false;
    }

    
    if (address === "") {
        document.getElementById("addressError").innerText = "Address is required.";
        valid = false;
    }

    return valid;
}

