/*
	Constructeur de schéma réseau
	Ce fichier comprend les fonctions nécessaires pour l'initialisation d'un schéma réseau prédéfini dans un fichier XML.
	Il se charge des actions suivantes :
		1) récupérer les données du fichier XML ; (testé avec "schema_0" : nbrClients = 4, nbrServeurs = 2, nbrHubs = 2, nbrSwitches = 1, nbrPortsHub == nbrPortsSwitch = 4)
		2) vérifier que le nombre de ports libres permet de créer un réseau avec le nombre de machines donné ; (testé avec "schema_0")
		3) créer les Unite(s) ; (testé avec "schema_0")
		4) relier les Unite(s) dans un réseau ; (testé avec "schema_0")
		5) supprimer les Unite(s) inutiles si besoin ; (à faire)
		6) gérer les exceptions. (à faire)
	Utilisé par : faire-exercice.js, test.js
*/

//-----------------------------------------------RECUPERER----------------------------------------------------------------------------

//renvoit un objet Schema paramétré
function recupererSchema(id){
	var schema = new Schema(id);
	$.ajax({
		type: "GET",
        url: "../memoire--xml/param-reseau.xml",
        dataType: "xml",
		async : false, // afin de rendre un objet Schema défini la requête est synchronisée
        success: function(xml) {
			var id = "#" + schema.id;
			var schemaXML = $(xml).find(id);
			var i = 0;
			
			schema.nbrClients = parseInt(schemaXML.attr("nbrClients"));
			schema.nbrServeurs = parseInt(schemaXML.attr("nbrServeurs"));
			schema.nbrHubs = parseInt(schemaXML.attr("nbrHubs"));
			schema.nbrPortsHub = parseInt(schemaXML.attr("nbrPortsHub"));
			schema.nbrSwitches = parseInt(schemaXML.attr("nbrSwitches"));
			schema.nbrPortsSwitch = parseInt(schemaXML.attr("nbrPortsSwitch"));
			
			$(xml).find("mac").each(function(){
				schema.adressesMAC[i] = $(this).html();
				i++;
			});
			//console.log(schema, 0);//debug
		}
	});
	//console.log(schema, 1);//debug
	return schema; // A cette étape les propriétés du Schema correspondent au contenu du fichier xml
}

//-----------------------------------------------VERIFIER-----------------------------------------------------------------------------

//vérifier si le nombre de Ports(s) donné permettra de relier toutes les MachineConnectee(s) dans le réseau
//la fonction ne vérifie pas s'il y a un exces de Port(s) et de Materiel(s)
//s : un Schema définie
function verifNbrPorts(s){
	var nbrPortsMachine,
		rep;
	// s'il y a des machines
	if ((s.nbrClients > 0 || s.nbrServeurs > 0) && (s.nbrSwitches > 0 || s.nbrHubs > 0)){
		if(s.nbrHubs > 0 && s.nbrSwitches > 0){
			nbrPortsMachine = s.nbrHubs*(s.nbrPortsHub - 1) + s.nbrSwitches*(s.nbrPortsSwitch - 1);
		}else{
			if(s.nbrHubs > 0 && s.nbrSwitches == 0){
				nbrPortsMachine = s.nbrHubs*(s.nbrPortsHub - 1) + 1;
			}else{
				if(s.nbrSwitches > 0 && s.nbrHubs == 0){
					nbrPortsMachine = s.nbrSwitches*(s.nbrPortsSwitch - 1) + 1;
				}
			}
		}
	}else{
		console.log("Le nombre de machines ne permet pas de créer un réseau.");
		rep = false;
	}
	// et que le nombre de Ports est suffisant pour relier toutes les Machines
	if(nbrPortsMachine && (nbrPortsMachine > (s.nbrClients + s.nbrServeurs))){
		rep = true;
	}else{
		console.log("Le nombre de ports ne permet pas de créer un réseau.");
		rep = false;
	}
	return rep;
}

//-----------------------------------------------CREER--------------------------------------------------------------------------------

//créer les Unites du réseau
//en arrivant ici on suppose que le nombre de MachineConnectee(s) et de Ports dans le schéma
//est déjà vérifié avec verifNbrPorts(s)
//donc on a un nombre de MachineConnectee(s) strictement positif
//et un nombre de Materiel(s) plus grand que 0
//cette fonction va créer et renvoyer un tableau de tableaux des Unite(s) dy type :
//[[clients], [serveurs], [hubs], [switches]]
//si le nbr des Unite(s) d'un type est égale à 0, le sous-tableau correspondant sera vide : [0]
//les adresses MAC seront attribuées aux MachinesConnectee(s)
//s : un Schema
//c : une Carte
function creerUnites(s, c){
	//test
	/*var tab = [[1, 2, 3], [4, 5]];
	var m = tab.shift();
	console.log(m, tab);*/
	var rep = new Array(),
		nom;
	// creer les MachinesConnectee(s)
	rep[0] = new Array(s.nbrClients);
	rep[1] = new Array(s.nbrServeurs);
	rep[2] = new Array(s.nbrHubs);
	rep[3] = new Array(s.nbrSwitches);
	for(var i = 0; i < rep[0].length; i++){
		nom = "client_" + i;
		rep[0][i] = new MachineConnectee(nom, "client", c.niveau(0), i, s.adressesMAC[i]);
	}
	for(var i = 0; i < rep[1].length; i++){
		nom = "serveur_" + i;
		rep[1][i] = new MachineConnectee(nom, "serveur", c.niveau(3), i, s.adressesMAC[i]);
	}
	for(var i=0; i < rep[2].length; i++){
		nom = "hub_" + i;
		rep[2][i] = new Materiel(nom, "hub", c.niveau(1), i, s.nbrPortsHub);
		rep[2][i].setPorts();
	}
	for(var i=0; i < rep[3].length; i++){
		nom = "switch_" + i;
		rep[3][i] = new Materiel(nom, "switch", c.niveau(2), i, s.nbrPortsSwitch);
		rep[3][i].setPorts();
	}
	//console.log(rep);//debug
	return rep;
}

//-----------------------------------------------RELIER-------------------------------------------------------------------------------

//prérequis :
	//un Schema est déja définie
	//le nombre des Port(s) et des MachinesConnectee(s) permet de créer un réseau ;
	//les Unite(s) sont créées et reparties dans des tableaux
	
//connecte chaque matériel d'un tableau donné à des machines
//clients, serveurs : tableaux de MachinesConnectee(s);
//hubs, switches : tebleaux de Materiel(s)
//s : un Schema
//renvoit un booleen : true (le réseau est construit) ou false (le réseau n'est pas construit)
function connecterMachines(clients, serveurs, hubs, switches, s){
	var hubDispo_0 = false,
		numPortsLibHub_0 = 0,
		switchDispo = false,
		numPortsLibSwitch = 0,
		hubDispo_1 = false,
		numPortsLibHub_1 = 0,
		nbrMachines = (s.nbrServeurs + s.nbrClients),
		nbrClients = s.nbrClients,
		nbrClientsConnectes = 0,
		nbrServeurs = s.nbrServeurs,
		nbrServeursConnectes = 0,
		nbrArret = 0,
		sortir = false,
		rep = false; // la réponse renvoyée si le réseau s'est construit ou pas
		
	//(1)s'il y a plusieurs switches -> interconnecter les switches (quel que soit le nbr des hubs je n'y touche pas ici)
	if (switches.length > 1){
		for(var i = 0; i < (switches.length - 1); i++){
			switches[i].ports[s.nbrPortsSwitch-1].connecter(switches[i+1]);
			switches[i+1].ports[0].connecter(switches[i]);
		}
	}
	//En arrivant ici le nombre de machines est strictement positif, donc
	//(2)DO l'algorithme de connexion (WHILE le nbrMachines > 0)
	do{
	//---------------------------------------------- algorithme de connexion :-------------------------------------------------------------------------
		//(2.1)--> si parmi ces machines il y a des clients :
		if (nbrClients > 0){
			//vérifier s'il y a un hub aux ports libres
			i = 0;
			while(hubDispo_0 == false && i < hubs.length){
				numPortsLibHub_0 = hubs[i].chercherPortsLibres();
				if(numPortsLibHub_0 != 0){
					hubDispo_0 = hubs[i];
					nbrArret = i++;
				}else
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
						while(nbrServeurs > 0){
							//connecter le hub aux serveurs
							hubDispo_0.connecterPort(numPortsLibHub_0.shift(), serveurs[nbrServeursConnectes]);
							//diminuer le nombre de serveurs à connecter
							nbrServeurs--;
							nbrMachines--;
							nbrServeursConnectes++;
						}
					}
				}		
				//puis connecter autant de clients que possible aux ports restants
				while(nbrClients > 0 && numPortsLibHub_0.length > 0){
					hubDispo_0.connecterPort(numPortsLibHub_0.shift(), clients[nbrClientsConnectes]);//ici machines[n] ne marche pas au deuxième tour les cas => changer
					//diminuer le nombre de machines à connecter
					nbrClients--;
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
					while(nbrServeurs > 0){
						//connecter le switch aux serveurs
						var n = (machines.length - serveur);
						switchDispo.connecterPort(numPortsLibSwitch.shift(), serveurs[nbrServeursConnectes]);
						//diminuer le nombre de serveurs à connecter
						nbrServeurs--;
						nbrMachines--;
						nbrServeursConnectes++;
					}
					//connecter autant de clients que possible aux ports restants
					while(nbrClients > 0 && numPortsLibHub_0.length > 0){
						hubDispo_0.connecterPort(numPortsLibHub_0.shift(), clients[nbrClientsConnectes]);
						//diminuer le nombre de machines à connecter
						nbrClients--;
						nbrMachines--;
						nbrClientsConnectes++;
					}
				}else{ //d'habitude cela ne doit pas s'afficher
					alert("Le matériel existant ne permet pas de relier les " + nbrMachines + " machines restantes dans le réseau.");
					sortir = true;
				}
			}
		}
		//(2.2)--> et que parmi ces machines il n'y a que de serveurs
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
				while(nbrServeurs > 0 && numPortsLibSwitch.length > 0){
					//connecter le switch aux serveurs
					switchDispo.connecterPort(numPortsLibSwitch.shift(), serveurs[nbrServeursConnectes]);
					//diminuer le nombre de serveurs à connecter
					nbrServeurs--;
					nbrMachines--;
					nbrServeursConnectes++;
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
					while(nbrServeurs > 0 && numPortsLibHub_0.length > 0){
						//connecter le switch aux serveurs
						hubDispo_0.connecterPort(numPortsLibHub_0.shift(), serveurs[nbrServeursConnectes]);
						//diminuer le nombre de serveurs à connecter
						nbrServeurs--;
						nbrMachines--;
						nbrServeursConnectes++;
					}
				}else{//d'habitude cela ne doit pas s'afficher
					alert("Le matériel existant ne permet pas de relier les " + nbrMachines + " machines restantes dans le réseau.");
					sortir = true;
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
	//-->revenir à (2) sinon sortir
	while(nbrMachines > 0 && sortir == false);
	//(3)(à faire plus tard) récapitulatif - s'il reste des hub sans connexions et des switches avec 1 seule connexion(avec un autre switch)
	// -> alors les supprimer ? (il ne sont pas nécessaires au réseau)
	//(4) DONE
	//console.log("connecterMachines() done");
	rep = !sortir;
	return rep;
}

//-----------------------------------------------SUPPRIMER----------------------------------------------------------------------------
