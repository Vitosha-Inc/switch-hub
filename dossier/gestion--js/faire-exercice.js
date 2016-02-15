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
/*	
//initialisation de la carte de niveaux
var nbrNiveaux = 4, //nbr niveaux sur la carte
	nbrPositions = 6; // nbr positions par niveau

var c = new Carte(nbrNiveaux, nbrPositions);
console.log (c);//debug

//initialisation de machines : parexemple 4 clients, 2 hubs, 1 switch et 2 serveurs
//plus tard ces machines peuvent etre rassemblees dans un tableau
var nbrClients = 4,
	nbrHubs = 2,
	nbrPortsHub = 4,
	nbrSwitches = 1,
	nbrPortsSwitch = 4,
	nbrServeurs = 2,
	adressesMAC = new Array(nbrClients + nbrServeurs);
	for(var i = 0; i < adressesMAC.length ; i++){
		adressesMAC[i] = i + 2000;
	}
	//hubs = new Array(nbrHubs),
	//switches = new Array(nbrSwitches);
	
	var machines = creerMachines(nbrClients, nbrServeurs, adressesMAC);
	//ajouter un if(nbrHubs est défini) alors crée les hubs
	var hubs = creerMaterieux("hub", nbrHubs, nbrPortsHub);
	//ajouter un if(nbrSwitches est défini) alors crée les switches
	var switches = creerMaterieux("switch", nbrSwitches, nbrPortsSwitch);
	connecterMachines(machines, hubs, switches, nbrClients, nbrServeurs, nbrPortsHub, nbrPortsSwitch);
	console.log(machines);
	console.log(hubs);
	console.log(switches);
	//if(nbrPortsHub + nbrPortsSwitch > = nbrClients + nbrServeurs + nbrPortsInterconnexion)
	//alors connecter les machines
	
	//crée un tableau de machines
	//nbrClients : int le nombre de machines qui seront des clients
	//nbrServeurs : int le nombre de machines qui seront des serveurs
	//adressesMAC : un tableau de chaînes de caractères contenant les adresses MAC
	//retourne un tableau de MachineConnectee(s)
	function creerMachines(nbrClients, nbrServeurs, adressesMAC){
		var machines = new Array(nbrClients + nbrServeurs),
			nom;
		for(var i = 0; i < machines.length; i++){
			if(i < nbrClients){
				nom = "client_" + i;
				machines[i] = new MachineConnectee(nom, "client", c.niveau(0), i, adressesMAC[i]);
			}else{
				nom = "serveur_" + (machines.length - i-1);
				machines[i] = new MachineConnectee(nom, "serveur", c.niveau(3), (machines.length - i-1), adressesMAC[i]);
			}
		}
		return machines;
	}
	
	//crée un tableau de hubs
	//type : switch | hub
	//nbr : int le nombre d'unités
	//nbrPorts : int le nombre des ports
	//retourne un tableau de Materiel(s)
	function creerMaterieux(type, nbr, nbrPorts){ 
		var materieux = new Array(nbr),
		nom,
		niveau;
		type == "hub" ? niveau = 1 : niveau = 2;
		for(var i=0; i<nbr; i++){
			nom = type + "_" + i;
			materieux[i] = new Materiel(nom, type, c.niveau(niveau), i, nbrPorts);
			materieux[i].setPorts();
		}
		return materieux;
	}
	
	//connecte chaque matériel d'un tableau donné à des machines
	//machines : tableau de MachineConnectee(s)
	//hubs : tableau de Materiel(s) de type "hub"
	//switches : tableau de Materiel(s) de type "switch"
	function connecterMachines(machines, hubs, switches, nbrClients, nbrServeurs, nbrPortsHub, nbrPortsSwitch){
		//-------------------------------------------------------prépa-------------------------------------------------------------------------------------------
		//(1) s'il y a des machines à connecter nbrMachines > 0 :
		if (machines && (machines.length > 0)){
			var nbrPortsMachine,
				nbrMachines = machines.length,
				clients = nbrClients,
				serveurs = nbrServeurs,
				nbrArret,// le nombre i d'arret de la boucle (3.1.1)
				numPortsLibHub_0,//des variables qui stockent les numéros des ports libres
				numPortsLibHub_1,
				numPortsLibSwitch,
				hubDispo_0 = false,//des variables qui stockent les Materiel(s) avec des ports libres
				hubDispo_1 = false,
				switchDispo = false,
				nbrClientsConnectes = 0;
			//(2) calculer le nbr de ports qui seront connectés aux machines et je le compare au nbr de machines :
			if(hubs && switches){
				nbrPortsMachine = hubs.length*(nbrPortsHub - 1) + switches.length*(nbrPortsSwitch - 1);
			}
			if(hubs && !switches){
				nbrPortsMachine = hubs.length*nbrPortsHub - hubs.length + 1;
			}
			if(switches && !hubs){
				nbrPortsMachine = switches.length*nbrPortsSwitch - switches.length + 1;
			}
			if(!hubs && !switches){
				nbrPortsMachine = 0;
			}
			//(2.1) si nbrPortsMachine < nbrMachines =>
			if(nbrPortsMachine < nbrMachines)
				alert("Le matériel existant ne permet pas de relier les " + nbrMachines + " machines restantes dans le réseau.");
					// (à faire plus tard) je propose :
						//ajouter du matériel et revenir à (2)? 
						//or supprimer de machines et revenir à (2)? 
						//je m'arrete et je vais à la page d'accueil.
			
			//(2.2) si nbrPortsMachine >= nbrMachines =>
			else{
				//s'il y a plusieurs switches -> interconnecter les switches (quel que soit le nbr des hubs je n'y touche pas ici)
				if (switches.length > 1){
					for(var i = 0; i < (switches.length - 1); i++){
						switches[i].ports[nbrPortsSwitch-1].connecter(switches[i+1]);
						switches[i+1].ports[0].connecter(switches[i]);
					}
				}

				//En arrivant ici le nombre de machines est strictement positif (1), donc
				//(3)DO l'algorithme de connexion (WHILE le nbrMachines > 0)
				do{
				//---------------------------------------------- algorithme de connexion :-------------------------------------------------------------------------
					//(3.1)--> si parmi ces machines il y a des clients :
					if (clients > 0){
						//(3.1.1)vérifier s'il y a un hub aux ports libres
						i = 0;
						while(hubDispo_0 == false && i < hubs.length){
							numPortsLibHub_0 = hubs[i].chercherPortsLibres();
							if(numPortsLibHub_0 != 0){
								hubDispo_0 = hubs[i];
								nbrArret = i++;
							}
							else
								i++;
						}
						if (hubDispo_0){
							i = 0;
							while(switchDispo == false && i < switches.length){
								numPortsLibSwitch = switches[i].chercherPortsLibres();
								if(numPortsLibSwitch != 0)
									switchDispo = switches[i];
								else
									i++;
							}
							//s'il y a un switch avec des ports libres
							if (switchDispo){
								//connecter le hub au premier switch disponible
								switchDispo.connecterPort(numPortsLibSwitch.shift(), hubDispo_0);
								//connecter le switch avec le hub correspondant
								hubDispo_0.connecterPort(numPortsLibHub_0.shift(), switchDispo);
								//remplir deux connexions;
							}else{ 
								//si il y a un autre hub avec des ports libres
								while(hubDispo_1 == false && nbrArret < hubs.length){
									numPortsLibHub_1 = hubs[nbrArret].chercherPortsLibres();
									if(numPortsLibHub_1 != 0)
										hubDispo_1 = hubs[nbrArret];
									else
										nbrArret++;
								}
								if(hubDispo_1){
									//connecter le hub à l'autre hub
									hubDispo_1.connecterPort(numPortsLibHub_1.shift(), hubDispo_0);
									hubDispo_0.connecterPort(numPortsLibHub_0.shift(), hubDispo_1);
									//remplir deux connexions
								}else{
									//s'il y a des serveurs non connectés
									if(serveurs > 0){
										while(serveurs > 0){
											//connecter le hub aux serveurs
											var n = (machines.length - serveur);
											hubDispo_0.connecterPort(numPortsLibHub_0.shift(), machines[n]);
											//diminuer le nombre de serveurs à connecter
											serveurs--;
											nbrMachines--;
										}
									}
								}
							}		
							//puis connecter autant de clients que possible aux ports restants
							while(clients > 0 && numPortsLibHub_0.length > 0){
								hubDispo_0.connecterPort(numPortsLibHub_0.shift(), machines[nbrClientsConnectes]);//ici machines[n] ne marche pas au deuxième tour les cas => changer
								//diminuer le nombre de machines à connecter
								clients--;
								nbrMachines--;
								nbrClientsConnectes++;
							}
							
						}else{
							//vérifier si il y a un switch non connecté
							i = 0;
							while(switchDispo == false && i < switches.length){
								numPortsLibSwitch = switches[i].chercherPortsLibres();
								if(numPortsLibSwitch != 0)
									switchDispo = switches[i];
								else
									i++;
							}
							if(switchDispo){
								// et si il y a des serveurs non connectés
								if(serveurs > 0){
									while(serveurs > 0){
										//connecter le switch aux serveurs
										var n = (machines.length - serveur);
										switchDispo.connecterPort(numPortsLibSwitch.shift(), machines[n]);
										//diminuer le nombre de serveurs à connecter
										serveurs--;
										nbrMachines--;
									}
								}
								//connecter autant de clients que possible aux ports restants
								while(clients > 0 && numPortsLibHub_0.length > 0){
									hubDispo_0.connecterPort(numPortsLibHub_0.shift(), machines[nbrClientsConnectes]);
									//diminuer le nombre de machines à connecter
									clients--;
									nbrMachines--;
									nbrClientsConnectes++;
								}
								
							}else{
								alert("Le matériel existant ne permet pas de relier les " + nbrMachines + " machines restantes dans le réseau.");
							}
						}
	
					}
					//(3.2)--> et que parmi ces machines il n'y a que de serveurs
					else{
						//vérifier s'il y a un switch aux ports libres
						i = 0;
						while(switchDispo == false && i < switches.length){
							numPortsLibSwitch = switches[i].chercherPortsLibres();
							if(numPortsLibSwitch != 0)
								switchDispo = switches[i];
							else
								i++;
						}
						if(switchDispo){
							//connecter autant de serveurs que possible au ports libres
							while(serveurs > 0 && numPortsLibSwitch.length > 0){
								//connecter le switch aux serveurs
								var n = (machines.length - serveurs);
								switchDispo.connecterPort(numPortsLibSwitch.shift(), machines[n]);
								//diminuer le nombre de serveurs à connecter
								serveurs--;
								nbrMachines--;
							}
						}else{							
							//vérifier s'il y a un hub aux ports libres
							i = 0;
							while(hubDispo_0 == false && i < hubs.length){
								numPortsLibHub_0 = hubs[i].chercherPortsLibres();
								if(numPortsLibHub_0 != 0)
									hubDispo_0 = hubs[i];
								else
									i++;
							}
							if(hubDispo_0){
								//connecter autant de serveurs que possible au ports libres
								while(serveurs > 0 && numPortsLibHub_0.length > 0){
									//connecter le switch aux serveurs
									var n = (machines.length - serveurs);
									hubDispo_0.connecterPort(numPortsLibHub_0.shift(), machines[n]);
									//diminuer le nombre de serveurs à connecter
									serveurs--;
									nbrMachines--;
								}
							}else{
								alert("Le matériel existant ne permet pas de relier les " + nbrMachines + " machines restantes dans le réseau.");
							}
						}
					}
					//se remettre à l'état initial	
					hubDispo_0 = false;
					hubDispo_1 = false;
					switchDispo = false;
					numPortsLibHub_0 = 0;
					numPortsLibHub_1 = 0;
					numPortsLibSwitch = 0;
					nbrArret = 0;
					
				}
				//-->revenir à (3) sinon sortir
				while(nbrMachines > 0);
				//(4)(à faire plus tard) récapitulatif - s'il reste des hub sans connexions et des switches avec 1 seule connexion(avec un autre switch)
				// -> alors les supprimer ? (il ne sont pas nécessaires au réseau)
				//(5) DONE
				console.log("done");
			}
		}
	}//testé avec la configuration suivante : 4 clients, 2 hubs X 4 ports, 1 switch X 4 ports, 2 serveurs; 
*/
/*
	ONLOAD c'est ici
*//*
window.onload = function(){
	document.getElementById("faireExercice").addEventListener("click", faireExercice);
}*/
/*
	Les gestionnaires
*/
//realiser un exercice aléatoire
/*function faireExercice(evt){
	evt.preventDefault();
	document.getElementById("faireExercice").removeEventListener("click", faireExercice);
	afficherReseau();*/
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
	emetteur.addEventListener("mouseover", styleMouseOver);//cela ne marche pas - il n'attache pas les écouteurs d'événements
	emetteur.addEventListener("mouseout", styleMouseOut);
	
	emetteur.addEventListener("click", emettre);
}*/
/*
//afficher le schema du reseau
function afficherReseau(){
	for (var i = 0; i < machines.length; i++){
		machines[i].afficher("schema-reseau");
	}

	
	for (var i = 0; i < hubs.length; i++){
		hubs[i].afficher("schema-reseau");
	}

	
	for (var i = 0; i < switches.length; i++){
		switches[i].afficher("schema-reseau");
	}

}*/

// choisir aléatoirement un sujet et l'afficher
function choisirSujet(){
	var nbEmetteur,
		nbRecepteur;
	while (nbEmetteur == nbRecepteur){
		nbEmetteur = Math.round(Math.random()*(nbrClients - 1));
		nbRecepteur = Math.round(Math.random()*(nbrClients + nbrServeurs - 1));
	}
	
	//trouver l'émetteur
	sujet[0] = machines[nbEmetteur];
	sujet[1] = machines[nbRecepteur];
	
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
	
	// pour commencer un autre sujet (mais cela ne marche pas encore)
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