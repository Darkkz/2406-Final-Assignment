document.getElementById("submit").addEventListener("click", function() {
    let xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if(this.readyState == 4 && this.status == 200){
            window.alert(this.responseText);
        } else if (this.readyState == 4 && this.status != 200){
            window.alert(this.responseText);
        }
    }

    let data;
    let elements = document.getElementsByClassName('privacy');
    for(let i = 0; i < elements.length; i++){
        if(elements[i].checked){
            data = elements[i].value;
        }
    }

    if (data == undefined){
        window.alert("Please Select a privacy setting");
        return;
    }
    let updatePriv = {privacy: data};
    xhttp.open("PUT", "/users/" + window.location.pathname.slice(7), true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(updatePriv));
});