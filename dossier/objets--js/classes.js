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
Port.prototype.estConnecte = function(){
	return this.connexion;
}
//setters
Port.prototype.setEtat = function(valeur){
	this.etat = valeur;
}
Port.prototype.connecter = function(machine){
	this.connexion = machine;
}
Port.prototype.deconnecter = function(){
	this.connexion = false;
}

/*
	La classe Machine
*/
var Machine = function Machine(nom, type, niveau, numPosition){
	//verifier les parametres d'entree à faire...
	this.nom = nom; // string
	this.type = type; // "client" | "serveur" | "switch" | "hub"
	this.position = niveau.getPosition(numPosition);
	// il faut déplacer les avatars dans un autre fichier et faire une methode avec switch plus tard
	if (this.type == "client")
		this.avatar = '<rect id="' + this.nom + '" x="' +this.position.getX()
					+ '" y="' + this.position.getY() + '" width="' 
					+ 2*ATOMX + '" height="' + 2*ATOMY + '" fill="none" stroke="gray" stroke-width="2"></rect>';
					
	if (this.type == "serveur")
		this.avatar = '<rect id="' + this.nom + '" x="' +this.position.getX()+ '" y="' 
					+ this.position.getY() + '" width="' 
					+ 2*ATOMX + '" height="' + 4*ATOMY + '" fill="none" stroke="gray" stroke-width="2"></rect>';
					
	if (this.type == "switch")
		this.avatar = '<rect id="' + this.nom + '" x="' +this.position.getX()
					+ '" y="' + this.position.getY() + '" width="' 
					+ 3*ATOMX + '" height="' + ATOMY + '" fill="none" stroke="blue" stroke-width="2"></rect>';
					
	if (this.type == "hub")
		this.avatar = '<rect id="' + this.nom + '" x="' +this.position.getX()+ '" y="' 
					+ this.position.getY() + '" width="' 
					+ 3*ATOMX + '" height="' + ATOMY + '" fill="none" stroke="green" stroke-width="2"></rect>';
}
/*
	Methodes
*/
//getters
Machine.prototype.getNom = function(){
	return this.nom;
}
Machine.prototype.getType = function(){
	return this.type;
}
//setters
Machine.prototype.setType = function(type){
	this.type = type;
}
//autres
Machine.prototype.afficher = function(elemParent){
	document.getElementById(elemParent).innerHTML += this.avatar;
}
//methode connecter qui permet de se connecter à un port

/*
	classe MachineConnectee
*/
var MachineConnectee = function MachineConnectee(nom, type, niveau, numPosition, mac){
	//verifier les parametres d'entree à faire...
	Machine.call(this, nom, type, niveau, numPosition);
	
	this.role = false; // false si non défini | "emetteur" | "recepteur"
	this.mac = mac; //string adresse MAC de la machine
}
MachineConnectee.prototype = Object.create(Machine.prototype);
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
	La classe MachineConnecteur
*/
var MachineConnecteur = function MachineConnecteur(nom, type, niveau, numPosition, nbrPorts){
	//verifier les parametres d'entree à faire...
	Machine.call(this, nom, type, niveau, numPosition);
	
	this.nbrPorts = nbrPorts; // integer
	this.ports = new Array(this.nbrPorts); // tableau de ports
	this.ctr = 0; // compter le nombre de ports définis dans le tableau
}
MachineConnecteur.prototype = Object.create(Machine.prototype);
MachineConnecteur.prototype.constructor = MachineConnecteur;
/*
	Methodes
*/
//getters
MachineConnecteur.prototype.getNbrPorts = function(){
	return this.nbrPorts;
}
MachineConnecteur.prototype.getPorts = function(){
	return this.ports;
}
MachineConnecteur.prototype.getMAC = function(nomMachine){
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
MachineConnecteur.prototype.setNbrPorts = function(nbr){
	this.nbrPorts = nbr;
}
MachineConnecteur.prototype.ajouterPorts = function(ports){
	for(var i=0; i < arguments.length; i++){
		if(arguments[i] instanceof Port && this.ctr < this.nbrPorts){
			this.ports[this.ctr] = arguments[i];
			this.ctr++;
		}// else envoyer message d'erreur à faire...
		
	}
}