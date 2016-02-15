/*
	classe Materiel
	enfant de Unite
*/
var Materiel = function Materiel(nom, type, niveau, numPosition, nbrPorts){
	//verifier les parametres d'entree à faire...
	Unite.call(this, nom, type, niveau, numPosition);
	
	this.nbrPorts = nbrPorts; // integer
	this.ports = new Array(this.nbrPorts); // tableau de ports
	this.ctr = 0; // compter le nombre de ports connectés
}
Materiel.prototype = Object.create(Unite.prototype);
Materiel.prototype.constructor = Materiel;
/*
	Methodes
*/
//getters
Materiel.prototype.getNbrPorts = function(){
	return this.nbrPorts;
}
Materiel.prototype.getPorts = function(){
	return this.ports;
}
Materiel.prototype.getMAC = function(nomMachine){
	var mac,
		i = 0;
	while(!mac, i < this.ctr){
		if(this.ports[i].getNom() == nomMachine){
			mac = this.ports[i].getMAC();
		}
	}
	return mac;
}
//setters
Materiel.prototype.setNbrPorts = function(nbr){
	this.nbrPorts = nbr;
}
Materiel.prototype.setPorts = function(){
	for(var i=0; i < this.nbrPorts; i++){
		this.ports[i] = new Port(i);
	}
}

//autres
/*savoir s'il y a des ports libres
	renvoit false s'il n'y a pas de ports libres 
	| un tableau correspondant au nbr de ports libre s'il y en a
*/
Materiel.prototype.chercherPortsLibres = function(){
	if( rep == 0)
		return false;
	else{
		var rep = new Array,
			j = 0;
		for(var i = 0; i < this.nbrPorts; i++){
			if(!this.ports[i].getConnexion()){
				rep[j] = i;
				j++;
			}
		}
		return rep;
	}
}

/*connecter un port du matériel
	numPort : entier le numéro du port à connecterPort
	connexion : un Unite (MachineConnectee ou Materiel)
*/
Materiel.prototype.connecterPort = function(numPort, connexion){
	this.ports[numPort].connecter(connexion);
	this.ctr++;
}

/* trouver si une Machine est connectée à ce port
	paramètre : la Machine à tester ;
	retour : booleen ;
*/
Materiel.prototype.estConnexion = function(machine){
	var rep = false,
		i = 0;
	while (rep == false && i < this.ports.length){
		if ( this.ports[i].estConnecte(machine))
			rep = this.ports[i].estConnecte(machine);
			i++;
	}
	return rep;
}