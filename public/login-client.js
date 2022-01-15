document.getElementById("submit").addEventListener("click", function() {
    let xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if(this.readyState == 4 && this.status == 200){
            window.location.href = this.responseText;
        } else if (this.readyState == 4 && this.status != 200){
            window.alert(this.responseText);
        }
    }
    let data = {};
    data.username = document.getElementById("username").value;
    data.password = document.getElementById("password").value;

    xhttp.open("POST", "/login", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(data));
});