/*
	Affichage du réseaux
	Ce fichier contient les fonctions liées à l'affichage du schéma réseaux
	Il se charge des actions suivantes :
		1) afficher le schéma d'un réseau construit;
		2) changer le style des éléments touchés par un événement
*/
//----------------------------------------------------- AFFICHER --------------------------------------------------------------------------------------
//affiche le schema du réseau
//le réseau est déjà crée et on prend :
//clients : le tableau des MachinesConnectee(s) clients
//serveurs : le tableau des MachinesConnectee(s) serveurs
//hubs : le tableau des Materiel(s) hubs
//switches : le tableau de Materiel(s) switches
//idBalise : l'id (html) de la balise (svg) qui contiendra les images
function afficherReseau(clients, serveurs, hubs, switches, idBalise){
	for (var i = 0; i < clients.length; i++){
		clients[i].afficher(idBalise); // cette fonction est une méthode de la classe Unite et se trouve dans ../objets--js/unite.js
	}
	
	for (var i = 0; i < serveurs.length; i++){
		serveurs[i].afficher(idBalise);
	}
	
	for (var i = 0; i < hubs.length; i++){
		hubs[i].afficher(idBalise);
	}
	
	for (var i = 0; i < switches.length; i++){
		switches[i].afficher(idBalise);
	}
}