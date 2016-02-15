/*
	La classe Port
*/
var Port = function Port(id){
	this.id = id; // integer
	this.etat = "P"; // "T" (transmet)| "R" (reçoit) |"P" (passif)
	this.connexion = false; // false ou nom machine
}
/*
	Methodes
*/
//getters
Port.prototype.getId = function(){
	return this.id;
}
Port.prototype.getEtat = function(){
	return this.etat;
}
Port.prototype.getConnexion = function(){
	return this.connexion;
}

//setters
Port.prototype.setEtat = function(valeur){
	this.etat = valeur;
}
Port.prototype.connecter = function(unite){
	this.connexion = unite;
}
Port.prototype.deconnecter = function(){
	this.connexion = false;
}
//others
//dire si le port est connecté à une machine donnée 
Port.prototype.estConnecte = function(machine){
	return this.connexion == machine;
}

/*
	La classe Unite
*/
var Unite = function Unite(nom, type, niveau, numPosition){
	//verifier les parametres d'entree à faire...
	this.nom = nom; // string
	this.type = type; // "client" | "serveur" | "switch" | "hub"
	this.position = niveau.getPosition(numPosition);
	// il faut déplacer les avatars dans un autre fichier et faire une methode avec switch plus tard
	if (this.type == "client")
		this.avatar = '<rect id="' + this.nom + '" x="' +this.position.getX()
					+ '" y="' + this.position.getY() + '" width="' 
					+ 2*ATOMX + '" height="' + 2*ATOMY + '" fill="white" stroke="gray" stroke-width="2"></rect>';
					
	if (this.type == "serveur")
		this.avatar = '<rect id="' + this.nom + '" x="' +this.position.getX()+ '" y="' 
					+ this.position.getY() + '" width="' 
					+ 2*ATOMX + '" height="' + 4*ATOMY + '" fill="white" stroke="gray" stroke-width="2"></rect>';
					
	if (this.type == "switch")
		this.avatar = '<rect id="' + this.nom + '" x="' +this.position.getX()
					+ '" y="' + this.position.getY() + '" width="' 
					+ 3*ATOMX + '" height="' + ATOMY + '" fill="white" stroke="blue" stroke-width="2"></rect>';
					
	if (this.type == "hub")
		this.avatar = '<rect id="' + this.nom + '" x="' +this.position.getX()+ '" y="' 
					+ this.position.getY() + '" width="' 
					+ 3*ATOMX + '" height="' + ATOMY + '" fill="white" stroke="green" stroke-width="2"></rect>';
}
/*
	Methodes
*/
//getters
Unite.prototype.getNom = function(){
	return this.nom;
}
Unite.prototype.getType = function(){
	return this.type;
}
//setters
Unite.prototype.setType = function(type){
	this.type = type;
}
//autres
Unite.prototype.afficher = function(elemParent){
	document.getElementById(elemParent).innerHTML += this.avatar;
}

/*
	classe MachineConnectee
*/
var MachineConnectee = function MachineConnectee(nom, type, niveau, numPosition, mac){
	//verifier les parametres d'entree à faire...
	Unite.call(this, nom, type, niveau, numPosition);
	
	this.role = false; // false si non défini | "emetteur" | "recepteur"
	this.mac = mac; //string adresse MAC de la machine
}
MachineConnectee.prototype = Object.create(Unite.prototype);
MachineConnectee.prototype.constructor = MachineConnectee;
/*
	Methodes
*/
//getters
MachineConnectee.prototype.getRole = function(){
	return this.role;
}
MachineConnectee.prototype.getMAC = function(){
	return this.mac;
}
//setters
MachineConnectee.prototype.setRole = function(role){
	this.role = role;
}

/*
	La classe Materiel
*/
var Materiel = function Materiel(nom, type, niveau, numPosition, nbrPorts){
	//verifier les parametres d'entree à faire...
	Unite.call(this, nom, type, niveau, numPosition);
	
	this.nbrPorts = nbrPorts; // integer
	this.ports = new Array(this.nbrPorts); // tableau de ports
	this.ctr = 0; // compter le nombre de ports définis dans le tableau
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
Materiel.prototype.ajouterPorts = function(ports){
	for(var i=0; i < arguments.length; i++){
		if(arguments[i] instanceof Port && this.ctr < this.nbrPorts){
			this.ports[this.ctr] = arguments[i];
			this.ctr++;
		}// else envoyer message d'erreur à faire...
		
	}
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