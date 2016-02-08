/*
	Réaliser un exercice prédéfini
*/
var nbrSujets = 2, // réaliser un exercice avec x sujets 
	ctrlSujets = 0,
	emetteur, //la balise representante la machine emetteur dans le doc HTML
	recepteur, //la balise representante la machine emetteur dans le doc HTML
	sujet = [], //la variable qui transmettra le sujet, donc sujet[0] = emetteur et sujet[1] recepteur
	avancee = "non definit", //string variable qui suit l'avancement du projet "non definit" | "definit" | "trame emise" | "trame transmise hub" | "trame transmise switch" | "trame reçue" | "fini"
	ctrlEmmission = [false, false], //enrégistre les résultats des tests de l'adressage de la trame
	ctrlHub = false; //enrégistre le numéro du hub par lequel a passé la trame
	
//initialisation de la carte de niveaux
var nbrNiveaux = 4, //nbr niveaux sur la carte
	nbrPositions = 6; // nbr positions par niveau

var c = new Carte(nbrNiveaux, nbrPositions);
console.log (c);//debug

//initialisation de machines : parexemple 4 clients, 2 hubs, 1 switch et 2 serveurs
//plus tard ces machines peuvent etre rassemblees dans un tableau

var cl0 = new MachineConnectee("client_0", "client", c.niveau(0), 0, "MAC_cl_0");
var cl1 = new MachineConnectee("client_1", "client", c.niveau(0), 1, "MAC_cl_1");
var cl2 = new MachineConnectee("client_2", "client", c.niveau(0), 4, "MAC_cl_2");
var cl3 = new MachineConnectee("client_3", "client", c.niveau(0), 5, "MAC_cl_3");

var sv0 = new MachineConnectee("serveur_0", "serveur", c.niveau(3), 0, "MAC_sv_0");
console.log(sv0);
var sv1 = new MachineConnectee("serveur_1", "serveur", c.niveau(3), 4, "MAC_sv_1");

var hub0 = new Materiel("hub_0", "hub", c.niveau(1), 0, 4);
hub0.setPorts();
hub0.ports[0].connecter(cl0);
hub0.ports[1].connecter(cl1);
hub0.ports[2].connecter(sw0);

var hub1 = new Materiel("hub_1", "hub", c.niveau(1), 4, 4);
hub1.setPorts();
hub1.ports[0].connecter(cl2);
hub1.ports[1].connecter(cl3);
hub1.ports[2].connecter(sw0);

var sw0 = new Materiel("switch_0", "switch", c.niveau(2), 2, 4);
sw0.setPorts();
sw0.ports[0].connecter(hub0);
sw0.ports[1].connecter(hub1);
sw0.ports[2].connecter(sv0);
sw0.ports[3].connecter(sv1);
console.log(sw0);

/*
	ONLOAD c'est ici
*/
window.onload = function(){
	document.getElementById("faireExercice").addEventListener("click", faireExercice);
}
/*
	Les gestionnaires
*/
//realiser un exercice aléatoire
function faireExercice(evt){
	evt.preventDefault();
	document.getElementById("faireExercice").removeEventListener("click", faireExercice);
	afficherReseau();
	choisirSujet();
	
	//ajouter les écouteurs d'évenement :
	emetteur = document.getElementById(sujet[0].getNom());
	recepteur = document.getElementById(sujet[1].getNom());
	console.log(emetteur, recepteur);//debug
	emetteur.addEventListener("mouseover", styleMouseOver);
	emetteur.addEventListener("mouseout", styleMouseOut);
	
	emetteur.addEventListener("click", emettre);
}

/*function refaireExercice(){
	afficherReseau();
	choisirSujet();
	
	//ajouter les écouteurs d'évenement :
	emetteur = document.getElementById(sujet[0].getNom());
	recepteur = document.getElementById(sujet[1].getNom());
	console.log(emetteur, recepteur);//debug
	emetteur.addEventListener("mouseover", styleMouseOver);//cela ne marche pas
	emetteur.addEventListener("mouseout", styleMouseOut);
	
	emetteur.addEventListener("click", emettre);
}*/

//afficher le schema du reseau
function afficherReseau(){
	cl0.afficher("schema-reseau");
	cl1.afficher("schema-reseau");
	cl2.afficher("schema-reseau");
	cl3.afficher("schema-reseau");
	
	sv0.afficher("schema-reseau");
	sv1.afficher("schema-reseau");
	
	hub0.afficher("schema-reseau");
	hub1.afficher("schema-reseau");
	
	sw0.afficher("schema-reseau");
}

// choisir aléatoirement un sujet et l'afficher
function choisirSujet(){
	var nbEmetteur,
		nbRecepteur;
	while (nbEmetteur == nbRecepteur){
		nbEmetteur = Math.round(Math.random()*3);
		nbRecepteur = Math.round(Math.random()*5);
	}
	
	//trouver l'émetteur
	switch (nbEmetteur) {
		case 0 :
			sujet[0] = cl0;
			cl0.setRole("emetteur");
			break;
		case 1 :
			sujet[0] = cl1;
			cl1.setRole("emetteur");
			break;
		case 2 :
			sujet[0] = cl2;
			cl2.setRole("emetteur");
			break;
		case 3 :
			sujet[0] = cl3;
			cl3.setRole("emetteur");
			break;
	}
	
	//trouver le récepteur
	switch (nbRecepteur) {
		case 0 :
			sujet[1] = cl0;
			cl0.setRole("recepteur");
			break;
		case 1 :
			sujet[1] = cl1;
			cl1.setRole("recepteur");
			break;
		case 2 :
			sujet[1] = cl2;
			cl2.setRole("recepteur");
			break;
		case 3 :
			sujet[1] = cl3;
			cl3.setRole("recepteur");
			break;
		case 4 :
			sujet[1] = sv0;
			sv0.setRole("recepteur");
			break;
		case 5 :
			sujet[1] = sv1;
			sv1.setRole("recepteur");
			break;
	}
	
	//augmenter le ctr
	ctrlSujets++;
	avancee = "definit";
	
	//afficher le sujer
	var texte = "<p>Emetteur : " + sujet[0].getNom() + "</p>";
	texte += "<p>Recepteur : " + sujet[1].getNom() + "</p>";
	document.getElementById("com-exo").innerHTML = texte;
}

//----------------------------------------------EMISSION--------------------------------------------------------------------------------
//emettre une trame
function emettre(evt){
	//afficher le tableau de la trame
	if (avancee = "definit"){
		evt.target.setAttribute("fill", "red");
		evt.target.removeEventListener("click", emettre);
		evt.target.removeEventListener("mouseout", styleMouseOut);
		evt.preventDefault();
		$('#contenu').load("emettre.html", null, function(){ //la fonction s'execute lorsque le load est fait
			$('#machine').html("<p>Machine : " + sujet[0].getNom() + "</p>");
			$('#emetteur').change(testerEmetteur);
			$('#recepteur').change(testerRecepteur);			
		});
	}
}

//tester la trame avant l'emission

function testerEmetteur(evt){
	evt.preventDefault();
	console.log("tester la trame a emetre : emetteur"); //debug
	console.log(evt.target);
	
	$("#contenuFeedback").html("");
	
	emetteurTest = evt.target;
	console.log(sujet[0].getNom(), emetteurTest.value);

	if(sujet[0].getNom() == emetteurTest.value){
		ctrlEmmission[0] = true;
		console.log("adresse emetteur ok");
		emetteurTest.setAttribute("class","vraie");
		
		//si l'adresse du recepteur est correcte afficher le bouton de validation
		if(ctrlEmmission[1] == true){
			texte = '<div id="validerTrameEmise" class="bouton"><p>Valider</p></div>'
			document.getElementById("contenuFeedback").innerHTML += texte;
			console.log($("#validerTrameEmise"));
			$("#validerTrameEmise").click(validerEmission);
		}
	}
}

function testerRecepteur(evt){
	evt.preventDefault();
	console.log("tester la trame a emetre : recepteur"); //debug
	console.log(evt.target);
	
	$("#contenuFeedback").html("");
	
	recepteurTest = evt.target;
	console.log(sujet[1].getNom(), recepteurTest.value);

	if(sujet[1].getNom() == recepteurTest.value){
		ctrlEmmission[1] = true;
		console.log("adresse recepteur ok");
		recepteurTest.setAttribute("class","vraie");
		
		//si l'adresse de l'emmetteur est correcte afficher le bouton de validation
		if(ctrlEmmission[0] == true){
			texte = '<div id="validerTrameEmise" class="bouton"><p>Valider</p></div>'
			document.getElementById("contenuFeedback").innerHTML += texte;
			console.log($("#validerTrameEmise"));
			$("#validerTrameEmise").click(validerEmission);
		}
	}
}

//valider l'emission de la trame

function validerEmission(evt){
	evt.preventDefault();
	if ( ctrlEmmission[0] == true && ctrlEmmission[1] == true ){
		avancee = "trame emise";
		ctrlEmmission[0] = false;
		ctrlEmmission[1] = false;
		console.log(avancee);
		//affichage
		$('#contenu').html("");
		$('#contenuFeedback').html("");
		//test
		//console.log(hub0.estConnexion(sujet[0])); //ok
		if (hub0.estConnexion(sujet[0])){
			document.getElementById('hub_0').addEventListener("mouseover", styleMouseOver);
			document.getElementById('hub_0').addEventListener("mouseout", styleMouseOut);
			document.getElementById('hub_0').addEventListener("click", transmettreHub);
			ctrlHub = hub0;
		}else{
			document.getElementById('hub_1').addEventListener("mouseover", styleMouseOver);
			document.getElementById('hub_1').addEventListener("mouseout", styleMouseOut);
			document.getElementById('hub_1').addEventListener("click", transmettreHub);
			ctrlHub = hub1;
		}
	}else{
		texte = "<p>Les adresses ne sont pas correctes.</p>"
		document.getElementById("contenuFeedback").innerHTML += texte;
	}
}

//-------------------------------------------------TRANSMISSION-----------------------------------------------------------
//-------------------------------------------------HUB--------------------------------------------------------------------

function transmettreHub(evt){
	avancee = "trame transmise hub";
	evt.target.setAttribute("fill", "red");
	
	evt.target.removeEventListener("mouseover", styleMouseOver);
	evt.target.removeEventListener("mouseout", styleMouseOut);
	evt.target.removeEventListener("click", transmettreHub);
	
	
	switch(evt.target.id){
		case "hub_0" :
			if(hub0.estConnexion(sujet[1])){
				recepteur.addEventListener("mouseover", styleMouseOver);
				recepteur.addEventListener("mouseout", styleMouseOut);
				recepteur.addEventListener("click", recevoirTrame);
			}else{
				
				document.getElementById('switch_0').addEventListener("mouseover", styleMouseOver);
				document.getElementById('switch_0').addEventListener("mouseout", styleMouseOut);
				document.getElementById('switch_0').addEventListener("click", transmettreSwitch);
			}
			break;
		case "hub_1" :
			if(hub1.estConnexion(sujet[1])){
				recepteur.addEventListener("mouseover", styleMouseOver);
				recepteur.addEventListener("mouseout", styleMouseOut);
				recepteur.addEventListener("click", recevoirTrame);
			}else{
				document.getElementById('switch_0').addEventListener("mouseover", styleMouseOver);
				document.getElementById('switch_0').addEventListener("mouseout", styleMouseOut);
				document.getElementById('switch_0').addEventListener("click", transmettreSwitch);
			}
			break;
	}
}

//-------------------------------------------------SWITCH--------------------------------------------------------------------

function transmettreSwitch(evt){
	console.log(avancee);
	avancee = "trame transmise switch";
	evt.target.setAttribute("fill", "red");
	
	evt.target.removeEventListener("mouseover", styleMouseOver);
	evt.target.removeEventListener("mouseout", styleMouseOut);
	evt.target.removeEventListener("click", transmettreSwitch);
	
	if(sw0.estConnexion(sujet[1])){
		recepteur.addEventListener("mouseover", styleMouseOver);
		recepteur.addEventListener("mouseout", styleMouseOut);
		recepteur.addEventListener("click", recevoirTrame);
	}else{
		switch(ctrlHub){
			case hub0 :
					if(hub1.estConnexion(sujet[1])){
						document.getElementById('hub_1').addEventListener("mouseover", styleMouseOver);
						document.getElementById('hub_1').addEventListener("mouseout", styleMouseOut);
						document.getElementById('hub_1').addEventListener("click", transmettreHub);
					}else{
						console.log("erreur");
					}
				break;
			case hub1 :
					if(hub1.estConnexion(sujet[1])){
						document.getElementById('hub_0').addEventListener("mouseover", styleMouseOver);
						document.getElementById('hub_0').addEventListener("mouseout", styleMouseOut);
						document.getElementById('hub_0').addEventListener("click", transmettreHub);
					}else{
						console.log("erreur");
					}
				break;
		}
	}
}
//------------------------------------------------RECEPTION----------------------------------------------------------------------
function recevoirTrame(evt){
	avancee = "trame reçue";
	evt.target.setAttribute("fill", "red");
	recepteur.removeEventListener("mouseover", styleMouseOver);
	recepteur.removeEventListener("mouseout", styleMouseOut);
	recepteur.removeEventListener("click", recevoirTrame);
	window.alert(avancee);
	/*if(ctrlSujets != nbrSujets)
		refaireExercice();
	else{
		avancee = "fini";
		window.alert("L'exercice est fini.");
	}*/
}

//-------------------------------------------------STYLE---------------------------------------------------------------------------
//changer le style on mouseover
function styleMouseOver(evt){
	evt.target.setAttribute("fill", "red"); //plus tard cela va se gerer par de styles
}
function styleMouseOut(evt){
	evt.target.setAttribute("fill", "white");
}