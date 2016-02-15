var nbEmetteur, // nbr machine émetrice
	nbRecepteur, // nbr machine réceptrice
	em, // machine émetteur
	rec, //machine récepteur
	ctr = 0; // controller l'ordre des clicks
window.onload = function(){
	document.getElementById("faireExercice").addEventListener("click", afficherReseau);
}
function afficherReseau(evt){
	evt.preventDefault();
	//window.alert("ok");
	//afficher les images
	var s = Snap("100%", 1000),
	client_1 = s.rect(10, 70, 70, 70),
	client_2 = s.rect(120, 70, 70, 70),
	client_3 = s.rect(230, 70, 70, 70),
	client_4 = s.rect(340, 70, 70, 70),
	
	serveur_1 = s.rect(10, 470, 70, 120),
	serveur_2 = s.rect(120, 470, 70, 120),
	
	switch_1 = s.rect(150, 240, 120, 35),
	
	connect_1 = s.path("M 80, 140, L 150, 240").attr({fill: "none", stroke: "#000", strokeWidth: 1 });
	connect_2 = s.path("M 190, 140, L 190, 240").attr({fill: "none", stroke: "#000", strokeWidth: 1 });
	connect_3 = s.path("M 300, 140, L 230, 240").attr({fill: "none", stroke: "#000", strokeWidth: 1 });
	connect_4 = s.path("M 410, 140, L 270, 240").attr({fill: "none", stroke: "#000", strokeWidth: 1 });
	connect_5 = s.path("M 150, 275, L 10, 470").attr({fill: "none", stroke: "#000", strokeWidth: 1 });
	connect_6 = s.path("M 170, 275, L 120, 470").attr({fill: "none", stroke: "#000", strokeWidth: 1 });
	
	//choisir un sujet aléatoir
	afficherSujet();
	
	//trouver l'émetteur
	switch (nbEmetteur) {
		case 1 :
			em = client_1;
			break;
		case 2 :
			em = client_2;
			break;
		case 3 :
			em = client_3;
			break;
		case 4 :
			em = client_4;
			break;
	}
	
	//trouver le récepteur
	switch (nbRecepteur) {
		case 1 :
			rec = serveur_1;
			break;
		case 2 :
			rec = serveur_2;
			break;
	}
	
	//attacher les gestionnaires d'événements
	gestionEvenements(em, switch_1, rec);
	
}

function afficherSujet(){
	nbEmetteur = Math.round(Math.random()*4);
	nbRecepteur = Math.round(Math.random()*2);
	if(nbEmetteur == 0){
		nbEmetteur = 1;
	}
	if(nbRecepteur == 0){
		nbRecepteur = 1;
	}
	var texte = "<p>Emetteur : " + nbEmetteur + "</p>";
	texte += "<p>Recepteur : " + nbRecepteur + "</p>";
	document.getElementById("contenu").innerHTML = texte; 
}

function gestionEvenements(em, tr, rec){
	em.click(function(){
		if (ctr==0){
			window.alert("emetteur");
			afficheTestEmis();
			ctr++;
			//em.attr({});
		}
	});
	tr.click(function(){
		if (ctr==1){
			window.alert("transmission");
			ctr++;
		}
	});
	rec.click(function(){
		if (ctr==2){
			window.alert("récepteur");
			window.alert("Bravo !");
			ctr = 0;
		}
	});
}

//affiche le tableau de la machine émetrice
function afficheTestEmis(nbEmetteur, nbRecepteur){
	$("#contenu").load('testemis.html');
	document.getElementById("machine").innerHTML="<h2>Emetteur : machine "+nbEmetteur+"</h2><h2>Récepteur : machine"+nbRecepteur+"</h2>";
	effectueTestEmis(nbEmetteur, nbRecepteur);
}

function effectueTestEmis(em, rec){
	$("#emForm").submit(function(event){
		event.preventDefault();
		console.log(emetteur.value+" = "+em);
		console.log(recepteur.value+" = "+rec);
		if(em!=emetteur.value){
			if(rec!=recepteur.value){
			window.alert("Les adresses de l'émetteur et du récepteur ne sont pas correctes!");
			}else{
			window.alert("L'adresse de l'émetteur n'est pas la bonne!");
			}
		}else{
		if(rec!=recepteur.value){
			window.alert("L'adresse du récepteur n'est pas la bonne!");
			}else{
			window.alert("OK -> étape suivante");
			}
		}
	});
}