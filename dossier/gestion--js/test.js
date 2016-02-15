/*
	TESTS
*/
/*
	Test de paramétrage du schéma et de mise en réseau (done)
*/

/*
	Réaliser un exercice aléatoire sur un schéma prédéfini (à faire)
*/

//------------------------------------- VARIABLES --------------------------------------------------------------------------------------------------------------

//initialisation de la carte des niveaux (nécéssaire pour l'affichage)
var nbrNiveaux = 4, //nbr niveaux sur la carte
	nbrPositions = 6; // nbr positions par niveau
var c = new Carte(nbrNiveaux, nbrPositions);
//console.log(c);//debug

//declaration des variables du réseau
var s; // la référence au Schema qui sera utilisé plus tard
var clients,
	serveurs,
	hubs,
	switches;//les variables qui seront chargées avec les tableaux des Unite(s);
var ctrlReseau = false;

//declaration des variables de l'exercice
var etat = "non défini", // l'état de l'exercice
	//etat : "non défini" | "réseau affiché" | "sujet défini"
	sujet = new Array(2), //un tableau qui contiendra la Machine "emetteur" et la Machine "recepteur" pour un sujet donné
	nbrSujets = 2, // le nbr de sujets à réaliser le nombre 2 est pour tester
	ctrlSujets = 0;// le nombre des sujets réalisés
	
//----------------------------------- ONLOAD c'est ici ----------------------------------------------------------------------------------------------------------

window.onload = function(){
	document.getElementById("faireExercice").addEventListener("click", faireExercice);
}

//------------------------------------ GESTIONNAIRES ------------------------------------------------------------------------------------------------------------

//realiser un exercice aléatoire
function faireExercice(evt){	
	evt.preventDefault();
	document.getElementById("faireExercice").removeEventListener("click", faireExercice);
	
	//---------------------------- mise en place du réseau --------------------------------------------
	
	//les fonctions de cette partie se trouvent dans ../construction--js/reseau.js
	s = recupererSchema("schema_0"); // récupère un schéma par son id
	if(verifNbrPorts(s)){ // vérifie que le nombre de posrts et des machines permet de créer un réseau
		//console.log(s); //debug
		tabUnites = creerUnites(s, c); //crée un tableau des tableau des Unite(s) du réseau
		clients = tabUnites.shift(); //reprend les clients
		serveurs = tabUnites.shift(); //reprend les serveurs
		hubs = tabUnites.shift(); //reprend les hubs
		switches = tabUnites.shift(); //reprend les switches
		//console.log(clients, serveurs, hubs, switches);//debug
		ctrlReseau = connecterMachines(clients, serveurs, hubs, switches, s); //connecte les machines dans un réseau
		//console.log(clients, serveurs, hubs, switches, ctrlReseau);//debug
	}/*else{
		afficher nbr insuffisant de ports ; 
		proposer des actions ;
	}*/
	
	//---------------------------- affichage du réseau -------------------------------------------------
	
	//les fonctions responsables de l'affichage se trouvent dans ../gestion--js/affichage-reseau.js
	if(ctrlReseau){//si le réseau a bien été créé
		console.log("affichage en cours");//debug
		afficherReseau(clients, serveurs, hubs, switches, "schema-reseau");//le réseau s'affichera dans la balise "schema-reseau" du index.html
		etat = "réseau affiché";
	}/*else{
		afficher problème lors de la mise en réseau ;
		recommencer ? ;
	}*/
	
	//----------------------------- réalisation de l'exercice ---------------------------------------------
	
	if (etat == "réseau affiché"){
		while(ctrlSujets < nbrSujets){
			choisirSujet(clients, serveurs, s, sujet);
		}
	}
}
//---------------------------- choisir sujet ----------------------------------------------------------------------------------------------------------------------------------------------
// choisir aléatoirement un sujet :
// un couple emetteur - recepteur parmi les clients et les serveurs du réseau
function choisirSujet(clients, serveurs, s){
	var nbEmetteur,
		nbRecepteur;
	while (nbEmetteur == nbRecepteur){
		nbEmetteur = Math.round(Math.random()*(s.nbrClients - 1));
		nbRecepteur = Math.round(Math.random()*(s.nbrClients + s.nbrServeurs - 1));
	}
	
	//trouver l'émetteur et le récepteur
	sujet[0] = clients[nbEmetteur];
	if(nbRecepteur < s.nbrClients)
		sujet[1] = clients[nbRecepteur];
	else
		sujet[1] = serveurs[nbRecepteur];
	
	//augmenter le ctrSujets
	ctrlSujets++;
	etat = "sujet définit";
	
	//afficher le sujet
	var texte = "<p>Emetteur : " + sujet[0].getNom() + "</p>"; // getNom() méthode de la classe Unite
	texte += "<p>Recepteur : " + sujet[1].getNom() + "</p>";
	document.getElementById("com-exo").innerHTML = texte;
}
