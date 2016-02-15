/*
	classe MachineConnectee
	enfant de Unite
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