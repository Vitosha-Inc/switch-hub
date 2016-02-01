/*
	Réaliser un exercice prédéfini
*/
var nbrSujets = 1, // réaliser un exercice avec x sujets 
	ctrSujets = 0,
	emetteur, //la balise representante la machine emetteur dans le doc HTML
	recepteur, //la balise representante la machine emetteur dans le doc HTML
	sujet = [], //la variable qui transmettra le sujet, donc sujet[0] = emetteur et sujet[1] recepteur
	avancee = "non definit"; //string variable qui suit l'avancement du projet "non definit" | "definit" | "trame emise" | "trame transmise hub" | "trame transmise switch" | "trame recue" | "fini"
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
var sv1 = new MachineConnectee("serveur_1", "serveur", c.niveau(3), 4, "MAC_sv_1");

var hub0 = new MachineConnecteur("hub_0", "hub", c.niveau(1), 0, 4);
var hub1 = new MachineConnecteur("hub_1", "hub", c.niveau(1), 4, 4);

var sw0 = new MachineConnecteur("switch_1", "switch", c.niveau(2), 2, 4);

/*
	ONLOAD c'est ici
*/
window.onload = function(){
	document.getElementById("faireExercice").addEventListener("click", faireExercice);
}
/*
	Les gestionnaires
*/
//realiser un exercice predefini
function faireExercice(evt){
	evt.preventDefault();
	afficherReseau();
	choisirSujet();
	
	//ajouter les écouteurs d'évenement :
	emetteur = document.getElementById(sujet[0].getNom());
	recepteur = document.getElementById(sujet[1].getNom());
	console.log(emetteur, recepteur);//debug
	emetteur.addEventListener("mouseover", styleMouseOver);
	emetteur.addEventListener("mouseout", styleMouseOut);
	recepteur.addEventListener("mouseover", styleMouseOver);
	recepteur.addEventListener("mouseout", styleMouseOut);
	
	emetteur.addEventListener("click", emettre);
}

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
	var nbEmetteur = Math.round(Math.random()*3),
		nbRecepteur = Math.round(Math.random());
	
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
			sujet[1] = sv0;
			sv0.setRole("recepteur");
			break;
		case 1 :
			sujet[1] = sv1;
			sv1.setRole("recepteur");
			break;
	}
	
	//augmenter le ctr
	ctrSujets++;
	avancee = "definit";
	
	//afficher le sujer
	var texte = "<p>Emetteur : " + sujet[0].getNom() + "</p>";
	texte += "<p>Recepteur : " + sujet[1].getNom() + "</p>";
	document.getElementById("com-exo").innerHTML = texte;
}
//emettre une trame
function emettre(evt){
	//afficher le tableau de la trame
	if (avancee = "definit"){
		evt.target.setAttribute("fill", "red");
		evt.preventDefault();
		$('#contenu').load("emettre.html", null, function(){ //la fonction s'execute lorsque le load est fait
			$('#machine').html("<p>Machine : " + sujet[0].getNom() + "</p>");
			$('#emetteur').change(testerEmetteur);
			$('#recepteur').change(testerRecepteur);
			$("#validerTrameEmise").click(validerEmission);
		});
	}
}
//tester la trame avant l'emission
function testerEmetteur(evt){
	evt.preventDefault();
	console.log("tester la trame a emetre : emetteur"); //debug
	console.log(evt.target);
	emetteurTest = evt.target;
	console.log(sujet[0].getNom(), emetteurTest.value);

	if(sujet[0].getNom() == emetteurTest.value){
		console.log("adresse emetteur ok");
		emetteurTest.attr("class","vraie");
	}
}
function testerRecepteur(evt){
	evt.preventDefault();
	console.log("tester la trame a emetre : recepteur"); //debug
	console.log(evt.target);
	recepteurTest = evt.target;
	console.log(sujet[1].getNom(), recepteurTest.value);

	if(sujet[1].getNom() == recepteurTest.value){
		console.log("adresse recepteur ok");
		recepteurTest.attr("class","vraie");
	}
}
//valider l'emission de la trame
function validerEmission(evt){
	evt.preventDefault();
	avancee = "trame emise";
	console.log(avancee);
	//affichage
	$('#contenu').html("");
}
//changer le style on mouseover
function styleMouseOver(evt){
	evt.target.setAttribute("fill", "red"); //plus tard cela va se gerer par de styles
}
function styleMouseOut(evt){
	evt.target.setAttribute("fill", "none");
}